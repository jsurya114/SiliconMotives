# SiliconMotives logo assets

23 October 2026. The owner supplied `public/images/image.png` as the new brand logo.

## Production assets

- `public/images/brand/logo.png`: transparent stacked logo, 1305 × 761.
- `public/images/brand/logo-horizontal.png`: horizontal header/footer lockup, 824 × 160.
- `public/images/brand/mark.png`: square symbol with transparent padding, 512 × 512; used in Organization structured data.
- `public/favicon-{32,48,96,192}.png`, `public/favicon.ico` and `public/apple-touch-icon.png`: symbol-only browser/search/bookmark assets. The old SVG favicon URL now contains the same mark for compatibility.

`components/BrandLogo.tsx` shares the horizontal asset across public navigation and footer components. On navy backgrounds a CSS filter displays a white version without adding a background. The original uploaded file is retained separately and is not used as the displayed logo.

The Open Graph/Twitter preview uses the horizontal logo on the site's off-white colour. Page titles remain readable text; icons beside titles are supplied through favicon links. Google controls whether and when the icon and structured-data logo appear.

## Background extraction

Used the built-in imagegen tool with transparency enabled. Prompt:

> Use case: background-extraction. Edit target: supplied SiliconMotives logo. Remove ONLY the off-white textured background, including all background between the four rounded lobes and between/inside the letters. Preserve precisely the existing symbol geometry, teal and charcoal colours, and exact wordmark text SILICONMOTIVES, same relative layout and spacing. No redesign, no new text, no shadows, no textures. Output the full existing logo on genuinely transparent alpha, clean crisp edges, with minimal transparent margin. Intended for a website logo. Keep original logo intact.

Production crops, horizontal arrangement and icon sizes derive from that transparent result using Sharp. No new symbol was drawn. Image metadata confirms alpha ranges from 0 to 255. The production webpack build and TypeScript compilation passed; no test suite was run.
