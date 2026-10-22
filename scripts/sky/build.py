"""Build the hero's cloud layers into public/images/sky/.

    python3 scripts/sky/build.py [--preview]

Needs numpy, scipy and Pillow, plus cwebp and avifenc on PATH. The licensed source
photographs are downloaded into scripts/sky/.cache/ on first run (see docs/sky-hero.md
for credits). --preview also writes each keyed layer over magenta into the cache, which
makes halos and holes obvious. The output is deterministic for the same sources.
"""
import json
import os
import subprocess
import sys
import urllib.request

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(__file__))
from keyer import estimate_sky, key, load, preview, save_rgba, sky_mask, smoothstep, blur  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CACHE = os.path.join(os.path.dirname(__file__), '.cache')
OUT = os.path.join(ROOT, 'public', 'images', 'sky')
HERO = os.path.join(ROOT, 'public', 'images', 'cloud-sky-clear.webp')

# Unsplash License photographs (free for commercial use).
SOURCES = {
    'hine': '1592830834426-5147d148e4c4',
    'moroz': '1612251557267-4d2ef64bccb5',
    'felske': '1762195406528-0af44ad2000f',
    'eccles': '1762624886803-7a95d271f494',
    'dey': '1769755498586-1cddbf017808',
}

# crop: (x0, y0, x1, y1) fractions · feather: borders the cloud touches, faded along a
# ragged line · blur: defocus in source px · lift: brighten shadows · thin: brighten
# translucent wisps · sky: clear-sky threshold override · alpha: overall opacity ·
# largest: keep only the main cloud (grow px, soften px)
LAYERS = {
    'fg-a': dict(src='felske', crop=(0, 0.02, 1, 0.66), blur=4.5, widths=[2000, 1200], sky=0.3, lift=0.3, thin=0.4, largest=(40, 12)),
    'fg-b': dict(src='dey', blur=6, widths=[1400, 900], sky=0.22, lift=0.25, thin=0.4, largest=(28, 10)),
    'wisp': dict(src='eccles', blur=2.5, widths=[1400, 900], alpha=0.92, thin=0.35, largest=(28, 10)),
    'deck': dict(src='hine', feather='ltrb', frac=0.1, blur=3.5, widths=[2600, 1400], lift=0.12, thin=0.6),
    'bank': dict(src='moroz', crop=(0.3, 0.2, 1, 1), feather='lrb', frac=0.16, blur=3.5, widths=[2000, 1100], lift=0.1, thin=0.6),
}


def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def fetch(name):
    path = os.path.join(CACHE, f'{name}.jpg')
    if not os.path.exists(path):
        url = f'https://images.unsplash.com/photo-{SOURCES[name]}?q=92&fm=jpg&w=4000'
        print('downloading', name)
        urllib.request.urlretrieve(url, path)
    return path


def bbox(a, t=0.02, pad=0.03):
    ys, xs = np.where(a > t)
    h, w = a.shape
    p = int(pad * max(h, w))
    return max(0, ys.min() - p), min(h, ys.max() + p + 1), max(0, xs.min() - p), min(w, xs.max() + p + 1)


def feather_edges(a, edges, frac=0.06, seed=3):
    """Fade cut borders along an irregular, noise-modulated line so no straight edge shows."""
    h, w = a.shape
    rng = np.random.default_rng(seed)
    noise = ndi.gaussian_filter(rng.random((h // 40 + 2, w // 40 + 2)).astype(np.float32), 3)
    noise = (noise - noise.min()) / (noise.max() - noise.min() + 1e-6)
    noise = np.asarray(Image.fromarray(noise, 'F').resize((w, h), Image.BICUBIC))
    jitter = (noise - 0.5) * frac * 1.2 - frac * 0.3
    yy = np.linspace(0, 1, h)[:, None]
    xx = np.linspace(0, 1, w)[None, :]
    m = np.ones_like(a)
    if 'l' in edges: m = m * smoothstep(0, frac, xx + jitter)
    if 'r' in edges: m = m * smoothstep(0, frac, 1 - xx + jitter)
    if 't' in edges: m = m * smoothstep(0, frac, yy + jitter)
    if 'b' in edges: m = m * smoothstep(0, frac, 1 - yy + jitter)
    return a * m


def keep_largest(a, grow, soften):
    """Drop everything but the main cloud (and the wisps within `grow` px of it)."""
    lab, n = ndi.label(a > 0.05)
    sizes = ndi.sum(np.ones_like(a), lab, range(1, n + 1))
    keep = ndi.binary_dilation(lab == 1 + int(np.argmax(sizes)), iterations=grow)
    return a * ndi.gaussian_filter(keep.astype(np.float32), soften)


def stats(col, a):
    return np.percentile(col[a > 0.97], [3, 50, 98], axis=0)


def grade(col, a, target):
    """Match each channel's shadow, mid and highlight levels to the hero photograph."""
    src = stats(col, a)
    out = np.empty_like(col)
    for k in range(3):
        xs = np.concatenate([[0], src[:, k], [1]])
        ys = np.concatenate([[0], target[:, k], [1]])
        order = np.argsort(xs)
        out[..., k] = np.interp(col[..., k], xs[order], ys[order])
    return np.clip(out, 0, 1)


def resize_rgba(col, a, width):
    """Resample premultiplied, so edges never pick up dark fringes."""
    h, w = a.shape
    height = round(h * width / w)
    pre = np.dstack([col * a[..., None], a])
    chans = [np.asarray(Image.fromarray(pre[..., k].astype(np.float32), 'F').resize((width, height), Image.LANCZOS)) for k in range(4)]
    pre = np.clip(np.stack(chans, -1), 0, 1)
    return np.clip(pre[..., :3] / np.maximum(pre[..., 3], 1e-4)[..., None], 0, 1), pre[..., 3]


def export(name, col, a, widths):
    sizes = {}
    for w in widths:
        c2, a2 = resize_rgba(col, a, w) if w != a.shape[1] else (col, a)
        png = os.path.join(CACHE, f'{name}-{w}.png')
        save_rgba(png, c2, a2)
        base = os.path.join(OUT, f'{name}-{w}')
        run(['cwebp', '-quiet', '-q', '82', '-alpha_q', '90', '-m', '6', '-sharp_yuv', '-exact', png, '-o', base + '.webp'])
        run(['avifenc', '--speed', '4', '-q', '62', '--qalpha', '80', '--yuv', '444', png, base + '.avif'])
        os.remove(png)
        sizes[w] = [a2.shape[0], os.path.getsize(base + '.avif') // 1024]
    print(f'{name:5s} width: [height, avif KB]', json.dumps(sizes))


def main():
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    show = '--preview' in sys.argv

    # ── The hero photograph: a clean sky plate, far wisps and the mid cumulus ──
    hero = load(HERO)
    h, w = hero.shape[:2]
    sky = estimate_sky(hero, sky_mask(hero))
    col, a = key(hero, sky)
    target = stats(col, a)

    # The sky is smooth, so a modest size with a little dither (against banding) is enough.
    rng = np.random.default_rng(7)
    plate = np.stack([np.asarray(Image.fromarray(sky[..., k], 'F').resize((1920, 1080), Image.BICUBIC)) for k in range(3)], -1)
    plate = Image.fromarray((np.clip(plate + rng.normal(0, 1.1 / 255, plate.shape), 0, 1) * 255 + 0.5).astype(np.uint8))
    for pw, q in ((1920, '78'), (960, '78')):
        png = os.path.join(CACHE, f'sky-{pw}.png')
        plate.resize((pw, round(1080 * pw / 1920)), Image.LANCZOS).save(png)
        run(['cwebp', '-quiet', '-q', q, '-m', '6', '-sharp_yuv', png, '-o', os.path.join(OUT, f'sky-{pw}.webp')])
        run(['avifenc', '-q', '70', png, os.path.join(OUT, f'sky-{pw}.avif')])
        os.remove(png)

    # The scattered upper-left wisps sit further away than the cumulus.
    lab, n = ndi.label(a > 0.04)
    yy, xx = np.mgrid[0:h, 0:w] / np.array([h, w])[:, None, None]
    far = np.zeros_like(a)
    for i in range(1, n + 1):
        m = lab == i
        cy, cx = yy[m].mean(), xx[m].mean()
        if m.sum() / (h * w) < 0.02 and ((cx < 0.45 and cy < 0.55) or cy < 0.08):
            far[m] = 1
    far = ndi.gaussian_filter(far, 3)
    # atmospheric perspective: the far wisps take on a little of the sky
    export('far', col * 0.86 + sky * 0.14, a * far * 0.94, [1672, 1100])
    export('mid', col, a * (1 - far), [1672, 1100])

    # ── Licensed photographs, keyed and graded to the hero ──
    for name, cfg in LAYERS.items():
        img = load(fetch(cfg['src']))
        ih, iw = img.shape[:2]
        x0, y0, x1, y1 = cfg.get('crop', (0, 0, 1, 1))
        img = img[int(y0 * ih):int(y1 * ih), int(x0 * iw):int(x1 * iw)]
        col, a = key(img, estimate_sky(img, sky_mask(img, cfg.get('sky'))))
        if cfg.get('largest'):
            a = keep_largest(a, *cfg['largest'])
        a = feather_edges(a, cfg.get('feather', ''), cfg.get('frac', 0.08))
        if cfg.get('blur'):
            pre = blur(col * a[..., None], cfg['blur'])
            a = ndi.gaussian_filter(a, cfg['blur'])
            col = pre / np.maximum(a, 1e-4)[..., None]
        col = grade(np.clip(col, 0, 1), a, target)
        if cfg.get('lift'):
            # near clouds read brighter and less leaden than a photo's underside
            col = 1 - (1 - col) * (1 - cfg['lift'])
        if cfg.get('thin'):
            # thin, sunlit cloud is bright; keyed wisps otherwise come out as blue-grey smudges
            col = 1 - (1 - col) * (1 - cfg['thin'] * (1 - smoothstep(0.2, 0.9, a))[..., None])
        a = a * cfg.get('alpha', 1)
        y0b, y1b, x0b, x1b = bbox(a)
        col, a = col[y0b:y1b, x0b:x1b], a[y0b:y1b, x0b:x1b]
        export(name, col, a, cfg['widths'])
        if show:
            preview(os.path.join(CACHE, f'preview-{name}.jpg'), col, a, width=900)


if __name__ == '__main__':
    main()
