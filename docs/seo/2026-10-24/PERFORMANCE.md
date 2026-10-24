# Mobile performance and search recheck

24 October 2026. Performance results are laboratory measurements, not field Core Web Vitals or ranking promises.

## Baseline

Google PageSpeed Insights API returned HTTP 429 (shared daily quota exceeded). The Chrome DevTools connector could not attach because its browser profile was already in use. No browser process belonging to another session was stopped.

Measured the public homepage with the official Lighthouse CLI 13.5.0, mobile simulation (412 × 823, DPR 1.75, 4× CPU slowdown, simulated mobile network).

- URL: https://www.siliconmotives.com/
- Captured: 2026-10-24T13:45:30.539Z
- Performance: 68/100
- Basic Lighthouse SEO checks: 100/100
- First Contentful Paint: 3.9 s
- Largest Contentful Paint: 5.0 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Speed Index: 6.5 s

Lighthouse flagged the external Google Fonts stylesheet as render blocking, with an estimated 1,410 ms saving. That estimate is not a measured improvement. It also flagged a 960px NasaLogistics PNG downloaded at about 143 KB for a much smaller display.

## Changes

- Self-hosted the exact existing Schibsted Grotesk and Newsreader WOFF2 files, including normal and italic serif styles, with the original open font license notices.
- Preloaded the two normal fonts used by the hero. Italic Newsreader loads when needed.
- Retained the existing CSS font-family names, weights and optical-sizing behavior. Public pages no longer load Google Fonts CSS or font files from Google's servers.
- Scoped the existing DM Sans/Manrope stylesheet to the admin layout, preserving the owner interface's fonts and noindex behavior.
- Added long-lived immutable caching for the versioned `/fonts/` assets.
- Used responsive Next.js image delivery for client logos in the marquee and testimonials. Logo layout boxes remain 144 × 80 and 96 × 32 respectively. SVGs retain vector delivery; external CMS image fallbacks remain supported.
- Did not change Hero.tsx, SkyFlight.tsx, the cloud files, animation timing, geometry, text layout or site.css.

## Local validation

- Production webpack build and TypeScript compilation passed.
- Production HTTP checks passed for the homepage and admin route.
- Verified the homepage has exactly the two intended font preloads and no external Google Fonts stylesheet.
- Verified NasaLogistics logos have responsive source sets and explicit display sizes.
- Verified the versioned font returns WOFF2 bytes with immutable cache headers.
- Verified the admin retains its existing font stylesheet and noindex declaration.
- The optimized NasaLogistics resource in the local mobile audit transferred about 8 KB, compared with about 143 KB for the original live PNG.
- Local mobile final audit: Performance 74, basic SEO 100, FCP 1.1 s, LCP 4.5 s, TBT 390 ms, CLS 0, Speed Index 3.1 s. These localhost/webpack figures are not treated as a controlled comparison with the live/CDN baseline. A separate intermediate font-loading variant was evaluated and replaced before publishing.
- Inspected the final mobile screenshot; the existing hero presentation is retained.

A matching live audit will be recorded after deployment. Scores vary with network, browser and machine conditions; a single audit is not a field measurement. Navigation Lighthouse does not establish real-user INP.

## Search Console observations

Company account: siliconmotives@gmail.com; domain property: siliconmotives.com.

- The report currently covers 21–22 October, with a displayed last update of 3.5 hours ago when read.
- Property totals: 1 click, 6 impressions, average position 2.7.
- Query tab: no query rows available. No keyword-specific rank is inferred.
- Page table: homepage 1 click/5 impressions; About 0/5; Agency Partners 0/1; Contact 0/1; Privacy 0/1; Terms 0/1. Property and page impression totals have different aggregation rules and should not be summed as unique searches.
- DevOps consulting now reports “URL is on Google” and “Page is indexed”, resolving the previously observed discovered-but-not-indexed state.
- No repeated indexing requests were submitted.

These small early totals do not establish a top-10 position for Kochi commercial queries. Continue reviewing query/page/country/device data once sufficient data is available. No outreach, reviews or third-party company profile changes were made.

## References

- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
- https://github.com/GoogleChrome/lighthouse
- https://react.dev/reference/react-dom/components/link
- https://support.google.com/webmasters/answer/7576553

## First live verification and follow-up

The first deployed font/image pass was checked at 2026-10-24T17:12:58.037Z on the same public URL and mobile Lighthouse settings:

| Metric | Original live baseline | Font/image pass live |
| --- | --- | --- |
| Performance | 68 | 72 |
| Basic SEO | 100 | 100 |
| FCP | 3.9 s | 1.4 s |
| LCP | 5.0 s | 3.7 s |
| TBT | 0 ms | 460 ms |
| CLS | 0 | 0 |
| Speed Index | 6.5 s | 6.4 s |

The result improved content rendering but exposed startup work after the earlier first paint. The higher TBT is recorded rather than presented as an across-the-board improvement. No causal claim about TBT is made from one run; its measurement window depends on FCP and results vary with machine conditions.

The below-the-fold Reveal/RevealText components prepared every GSAP tween and SplitText instance during mount. They now initialize 300px before entering view, while immediate effects still initialize immediately. Plain server-rendered text remains available before animation initialization. Intersection observers and GSAP contexts are reverted when the component unmounts or motion preference changes.

- Helper lifecycle checks passed for delayed setup, one-time initialization, cancellation before visibility, one-time cleanup, immediate near-view setup and lack of IntersectionObserver support.
- Production build passed.
- Local mobile comparison using the same production server: Performance 74 → 85; TBT 390 → 160 ms; LCP 4.5 → 4.0 s; FCP 1.1 → 1.1 s; CLS 0 → 0. These remain local laboratory observations.
- Browser checks verified near-view headings were split and visible while the distant footer remained unsplit. Mobile menu navigation closed the dialog and restored scroll lock. The hero heading, equal-width buttons and cloud presentation were retained.
- A final live audit of the follow-up will be recorded after deployment.

## Owner-supplied client portraits

The owner supplied Gokul/Woobe, Navas/Picbox and NM Jaseem/Uniwayin photos while this performance work was underway. Added a compact, named portrait row beneath the client logos and used exact name-plus-company matching for published testimonial avatars. Gokul's existing Woobe quote uses his photo. No Navas/Jaseem quotes or unconfirmed job titles were created.

Portraits use lazy, responsive Next.js image delivery, fixed circular layout boxes, and CSS framing; original photos are preserved. Name/company matching and rejection of wrong authors passed. All three portraits loaded at phone width with no horizontal overflow. Preview captures: `client-portraits-mobile.jpg` and `mobile-hero.jpg`.

## Final deployed result

Source commit: `c5b6223`. The live homepage returned HTTP 200, included the client portraits, and no longer referenced external Google Fonts CSS. Final matching mobile Lighthouse run: **2026-10-24T17:43:09.207Z**, version 13.5.0, no run warnings. Machine-readable results: `mobile-performance-summary.json`.

| Metric | Original live baseline | Final live result |
| --- | --- | --- |
| Performance | 68/100 | 91/100 |
| Basic Lighthouse SEO checks | 100/100 | 100/100 |
| First Contentful Paint | 3.9 s | 1.3 s |
| Largest Contentful Paint | 5.0 s | 3.2 s |
| Total Blocking Time | 0 ms | 70 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 6.5 s | 3.6 s |

All three portrait responses in the mobile test were responsive 256px images, about 7.5–8 KB each, rather than the original full-resolution PNGs. The final run made zero Google Fonts network requests.

The final result improves rendering speed and overall lab performance while retaining the cloud presentation and adding the owner-supplied portraits. TBT is higher than the original baseline and substantially lower than the intermediate live pass; do not describe it as an improvement over the original 0 ms value. Real-user INP is not established by this navigation audit.

LCP at 3.2 seconds still exceeds the 2.5-second good target. Further work should use field data and targeted network/script analysis; the remaining hero image findings were not used as a reason to change the requested cloud assets or animation. A score of 91 is a lab result, and the SEO score covers basic automated checks. Neither is a guarantee of rankings or a field Core Web Vitals pass.

Final checks: production build/TypeScript passed; portrait matching and deferred-setup lifecycle checks passed; mobile browser checks passed for loaded portraits, no horizontal overflow, near-view text initialization, untouched distant footer text, the original hero text/button layout, and menu close/scroll-unlock behavior. Test viewport was reset and temporary local servers were stopped. No enquiries, reviews or outreach messages were sent.
