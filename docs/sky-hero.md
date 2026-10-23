# Sky hero

The home page hero is a photographic cloud scene with the real hero copy set inside it.
Scrolling moves a virtual camera forward through the clouds: foreground clouds slide
across the headline, a cloud bank rises from below, the camera passes into it, and the
haze settles into the page colour that the next section (Our belief) is set on.

## How it is built

| Piece | File |
| --- | --- |
| Markup, layer list (depths, sizes, srcsets), preloads | `components/sections/Hero.tsx` |
| Camera engine (client) | `components/motion/SkyFlight.tsx` |
| Layout, layer geometry, camera settings, idle drift | `app/(site)/site.css`, "Sky hero" block |
| Layer images (AVIF + WebP, two widths each) | `public/images/sky/` |
| Asset pipeline | `scripts/sky/build.py`, `scripts/sky/keyer.py` |

**Depth model.** Each layer is a flat plane at a distance from the camera
(`data-depth`). Back to front: sky plate (60), far wisps (14), mid cumulus (9), a soft
wisp (8), the copy (7), the bank (3.4), the deck (2.7), the cloud over the headline (2.5)
and a corner cloud (2). Scroll progress moves the camera forward by `--cam-d` and
down by `--cam-y`; every plane is scaled about the vanishing point (`--vp-x`, `--vp-y`)
by `depth / (depth - travel)` and shifted by the camera offset divided by its distance.
Near planes therefore grow and slide much faster than far ones, and the order in which
they overlap the headline changes as you scroll. Planes the camera reaches thin out over
their `data-near` range. `data-rise` adds upward travel to the cloud bank, and
`data-fade` maps progress to opacity for the copy, wash, haze and floor.

**Scroll.** The hero is `240lvh` tall (`215lvh` on phones) and its stage is sticky, so
the page scrolls normally: no scroll-jacking. A ScrollTrigger reads progress from the
pinned range, a short exponential smoothing step removes wheel stepping, and only
`transform` and `opacity` are written, and only when progress changes. The same
progress always produces the same frame, so reversing, stopping halfway and fast
flicks all resolve cleanly.

**Idle drift.** Slow CSS animations of the individual `translate`/`scale` properties
(71–173 s, alternating, desynchronised), which compose with the camera's `transform` and
run on the compositor. Nearer clouds drift further.

**The headline cloud.** `SkyFlight` measures the headline's text lines and sets
`--title-x/-y/-em`, `--eyebrow-y` and `--cta-y` on the stage. The cloud's dense edge then
veils about ¾ em at the end of the longest line, whatever the wrapping, while staying
below the eyebrow and above the buttons. It stays hidden until placed, so placing it
never shifts layout.

**Hand-off.** From 60% the haze builds; from 72% a floor in the page colour rises from
the bottom. When the pin releases, the stage's lower half already matches the next
section's background, so the cloud ceiling scrolls away above it with no seam.

**Fallbacks.** Under `prefers-reduced-motion`, or on screens shorter than 540px, the
hero is a still, single-screen layered scene (`--flight` is unset and `SkyFlight` does
nothing but place the headline cloud), and the wash fades into the page colour at the
bottom. Keyboard focus inside the hero copy scrolls back to the opening frame. All cloud
layers are `aria-hidden`, `alt=""` and `pointer-events: none`; the copy is real HTML.

**Phones** get fewer planes (sky, far, mid, headline cloud, deck); the other layers have
a `media` source pointing at a 1×1 GIF, so they are never downloaded.

## Tuning

- Camera path: `--vp-x`, `--vp-y`, `--cam-d`, `--cam-y`, `--cam-x`, `--pitch` on
  `.sky-hero__stage` (with a phone override).
- Length of the flight: `.sky-hero` height.
- Timing: `data-fade` ranges in `Hero.tsx` (copy, wash, haze, floor).
- Per layer: `depth`, `near`, `rise` in `Hero.tsx`; position and size in `site.css`.

## Assets

`python3 scripts/sky/build.py [--preview]` rebuilds every file in `public/images/sky/`
(needs numpy, scipy, Pillow, `cwebp` and `avifenc`). Source photographs download into
`scripts/sky/.cache/` (git-ignored).

How the layers are made:

1. **Sky estimate.** Clear-sky pixels (far bluer than red) are found, and the sky behind
   the clouds is filled in by multi-scale normalised convolution.
2. **Key.** Each pixel is modelled as cloud over that sky in sRGB, the space browsers
   composite in. A least-squares fit gives soft alpha for thin edges; red-channel and
   difference terms make shaded interiors opaque, except within a band of the silhouette.
3. **Decontaminate.** Colour = (pixel − (1 − α)·sky) / α, so no sky colour is left in
   the edges. Rims then take the colour of the cloud just inside them, which removes
   JPEG chroma bleed (otherwise a thin blue outline over pale backgrounds).
4. **Finish.** Borders that a cloud touches are faded along a ragged, noise-modulated
   line. Near layers get a little defocus. Every layer is graded to the hero photograph's
   cloud levels, shadows are lifted, and translucent wisps are brightened like sunlit
   cloud.
5. **Encode.** AVIF (4:4:4, alpha) with a WebP fallback, two widths each, resampled
   premultiplied so edges never darken.

### Sources and licences

| Layer | Source | Licence |
| --- | --- | --- |
| `sky`, `far`, `mid` | The site's existing hero image, `public/images/cloud-sky-clear.webp`, generated for the site (prompt in `HERO-IMAGE.md`) | Site-owned generated asset |
| `deck` | Lester Hine, [unsplash.com/photos/dAEBKDe2xbo](https://unsplash.com/photos/white-clouds-and-blue-sky-during-daytime-dAEBKDe2xbo) | [Unsplash License](https://unsplash.com/license) |
| `bank` | Олег Мороз (Oleg Moroz), [unsplash.com/photos/hR4JiEOZMS8](https://unsplash.com/photos/white-clouds-and-blue-sky-during-daytime-hR4JiEOZMS8) | [Unsplash License](https://unsplash.com/license) |
| `fg-a` | Andreas Felske, [unsplash.com/photos/NxvEswaIKJc](https://unsplash.com/photos/fluffy-white-clouds-in-a-clear-blue-sky-NxvEswaIKJc) | [Unsplash License](https://unsplash.com/license) |
| `wisp` | Bill Eccles, [unsplash.com/photos/GdPAjMyuWJ8](https://unsplash.com/photos/a-single-white-cloud-against-a-deep-blue-sky-GdPAjMyuWJ8) | [Unsplash License](https://unsplash.com/license) |
| `fg-b` | Rohit Dey, [unsplash.com/photos/I5hfkcv5Dlg](https://unsplash.com/photos/a-single-white-cloud-floats-in-a-clear-blue-sky-I5hfkcv5Dlg) | [Unsplash License](https://unsplash.com/license) |

The Unsplash License allows free commercial use and modification without attribution;
the credits are kept here anyway. All five were checked as free (not Unsplash+) on
23 Oct 2026.
