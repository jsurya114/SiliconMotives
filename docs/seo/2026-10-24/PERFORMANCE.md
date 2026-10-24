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
