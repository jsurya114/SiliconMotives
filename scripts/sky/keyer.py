"""Sky-difference keyer for cumulus photographed against a blue sky.

Each pixel is modelled the way a browser composites it (in sRGB):

    I = a * C + (1 - a) * S

S is the local sky colour, estimated by normalised convolution of the clear-sky
pixels; C is a near-neutral cloud colour. A least-squares fit over the three
channels gives a = 1 - v, which handles thin, sunlit edges. Shaded interiors are
lit by blue skylight, so they are caught by a red-channel and a difference term,
but only away from the silhouette (near it they would turn the half-sky rim into a
blue outline). Colours are then decontaminated so the cloud can sit over anything.
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def load(path, width=None):
    im = Image.open(path).convert("RGB")
    if width and im.width != width:
        h = round(im.height * width / im.width)
        im = im.resize((width, h), Image.LANCZOS)
    return np.asarray(im, dtype=np.float32) / 255.0


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def blur(x, s):
    if x.ndim == 3:
        return np.stack([ndi.gaussian_filter(x[..., k], s, mode="nearest") for k in range(x.shape[2])], -1)
    return ndi.gaussian_filter(x, s, mode="nearest")


def sky_mask(img, thresh=None):
    """Clear sky: far bluer than red. Shaded cloud is bluish too, but much less so."""
    r, b = img[..., 0], img[..., 2]
    chroma = b - r
    if thresh is None:
        thresh = max(0.36, np.percentile(chroma, 90) * 0.72)
    m = (chroma > thresh) & (b > 0.35)
    # erode so cloud fringes are never sampled as sky
    return ndi.binary_erosion(m, iterations=max(2, img.shape[1] // 600))


def estimate_sky(img, mask):
    """Fill in the sky behind the clouds by multi-scale normalised convolution."""
    h, w = img.shape[:2]
    # the sky is smooth, so work small
    sh = max(2, round(h * 400 / w))
    small = np.asarray(Image.fromarray((img * 255).astype(np.uint8)).resize((400, sh), Image.BILINEAR), np.float32) / 255
    msmall = np.asarray(Image.fromarray(mask.astype(np.uint8) * 255).resize((400, sh), Image.BILINEAR), np.float32) / 255
    msmall = (msmall > 0.95).astype(np.float32)
    out = np.zeros_like(small)
    filled = np.zeros(small.shape[:2], np.float32)
    for s in (4, 10, 24, 60, 140):
        num = blur(small * msmall[..., None], s)
        den = blur(msmall, s)[..., None]
        est = num / np.maximum(den, 1e-6)
        take = (1 - filled) * np.clip(den[..., 0] / 0.15, 0, 1)
        out += est * take[..., None]
        filled += take
    out = blur(out / np.maximum(filled, 1e-6)[..., None], 3)
    chans = [np.asarray(Image.fromarray(out[..., k].astype(np.float32), mode="F").resize((w, h), Image.BICUBIC)) for k in range(3)]
    return np.clip(np.stack(chans, -1), 0, 1)


def key(img, sky, core=(0.55, 0.9), core_sigma=None, floor=0.035, soft=0.6, red=(0.05, 0.32), dist=(0.06, 0.24), rim=None):
    """Return (colour, alpha) for the clouds in img, given its sky estimate."""
    h, w = img.shape[:2]
    ds = sky - sky.mean(-1, keepdims=True)
    di = img - img.mean(-1, keepdims=True)
    v = (ds * di).sum(-1) / np.maximum((ds * ds).sum(-1), 1e-5)
    a = 1 - np.clip(v, 0, 1)
    # below the floor it is sky noise or vignette, not cloud
    a = np.clip((a - floor) / (1 - floor), 0, 1)
    a_ls = a
    if red:
        # shaded cloud is lit by blue skylight, but it is still far redder than the sky behind it
        a = np.maximum(a, smoothstep(red[0], red[1], img[..., 0] - sky[..., 0]))
    if dist:
        # plain difference matte: catches grey undersides that are as dark as the sky
        a = np.maximum(a, smoothstep(dist[0], dist[1], np.sqrt(((img - sky) ** 2).sum(-1))))
    # Those boosts are for interiors. Along the silhouette they would make the half-sky rim
    # solid and blue, which reads as an outline over anything pale, so near the edge fall
    # back to the neutral-cloud estimate.
    band = rim or w / 200
    inside = ndi.distance_transform_edt(a > 0.5)
    wgt = smoothstep(0.2 * band, band, inside)
    a = a_ls * (1 - wgt) + a * wgt
    if soft:
        a = ndi.gaussian_filter(a, soft)
    # dense cores are opaque even where the photo's shading is blue
    c = smoothstep(core[0], core[1], ndi.gaussian_filter(a, core_sigma or w / 260))
    a = 1 - (1 - a) * (1 - c)
    # decontaminate: C = (I - (1 - a) S) / a
    col = np.clip((img - (1 - a)[..., None] * sky) / np.maximum(a, 1e-3)[..., None], 0, 1)
    # near-transparent pixels take a local average colour instead of a noisy division
    col_s = blur(col * a[..., None], w / 700) / np.maximum(ndi.gaussian_filter(a, w / 700)[..., None], 1e-4)
    t = smoothstep(0.06, 0.45, a)[..., None]
    col = fix_edges(col_s * (1 - t) + col * t, a)
    return np.clip(col, 0, 1), np.clip(a, 0, 1)


def fix_edges(col, a, sigma=None):
    """Give semi-transparent rims the colour of the cloud just inside them.

    JPEG chroma subsampling smears sky blue into the outermost pixels of sharp cloud
    edges; left alone that reads as a thin blue outline once the cloud sits over
    anything paler than the original sky."""
    h, w = a.shape
    sigma = sigma or w / 450
    wgt = a ** 4
    den = ndi.gaussian_filter(wgt, sigma)[..., None]
    inner = blur(col * wgt[..., None], sigma) / np.maximum(den, 1e-4)
    e = (1 - smoothstep(0.45, 0.97, a))[..., None] * (den > 2e-3)
    return col * (1 - e) + inner * e


def save_rgba(path, col, a):
    arr = np.dstack([col, a])
    Image.fromarray(np.clip(arr * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA").save(path)


def preview(path, col, a, bg=(0.85, 0.1, 0.55), width=900):
    """The cloud over a loud colour, which makes halos and holes obvious."""
    comp = col * a[..., None] + np.array(bg, np.float32) * (1 - a[..., None])
    im = Image.fromarray(np.clip(comp * 255, 0, 255).astype(np.uint8))
    im.resize((width, round(im.height * width / im.width)), Image.LANCZOS).save(path)
