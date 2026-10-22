# SiliconMotives SEO baseline and proposed action plan

Audit date: 22 October 2026. Website revision: `969fcad`. Public target: `https://www.siliconmotives.com/`.

This is a read-only baseline and proposal. No application code, CMS content, DNS, Search Console, or production settings were changed for this audit. The recommendations below require approval before implementation.

## Decision

Keep the editorial homepage focused on the company and its three capabilities. First align the site's canonical hostname, then build a small set of useful commercial pages supported by real project evidence. Keep all six projects on `/projects`; retain the homepage client and testimonial sections. This proposal does not reintroduce homepage project cards.

Start with four service pages and strengthen `/agency-partners`. Defer separate AWS DevOps, Shopify, ecommerce-agency, and India-location pages until they have distinct intent, confirmed capabilities, and enough original evidence.

The accompanying [keyword map](KEYWORD-MAP.md) contains exact candidate primary/secondary queries, page boundaries, and proof requirements. They are research hypotheses, not measured U.S. keyword demand.

## Method, evidence, and limits

- Reviewed the upstream [claude-seo audit](https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/skills/seo-audit/SKILL.md), [strategic planning](https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/skills/seo-plan/SKILL.md), and [GEO](https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/skills/seo-geo/SKILL.md) methodologies. Used their audit, competitor, architecture, evidence, and prioritization framework; no unsupported composite SEO score was invented.
- Reviewed marketingskills' [SEO audit](https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/seo-audit/SKILL.md), [site architecture](https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/site-architecture/SKILL.md), and [AI SEO](https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/ai-seo/SKILL.md) core workflows. These packs were not already installed in the checked local skill directories. Their upstream documents were reviewed as methodology; no persistent plugin installation was performed.
- Inspected and ran **seo-ops**, commit `c637138203e39bab1f768568480b097be8f74eff`, from an isolated temporary environment. This revision has 30 checks. Dependencies and outputs stayed outside the skill package. See [unaltered checker report](SEO-OPS-BASELINE.md).
- Fetched all 13 sitemap pages, parsed metadata, JSON-LD, headings, images and internal links, and checked representative redirects, an unknown URL, the owner host, and the sharing image. See [live evidence](LIVE-BASELINE.json).
- Checked the rendered mobile DOM and ran a mobile Lighthouse audit plus one cold-load Chrome performance trace. See [lab evidence](LAB-BASELINE.json).
- Public search queries used U.S. qualifiers and official competitor pages. This is **not** a controlled U.S.-located Google SERP study. Result order is not reported as ranking.
- No authenticated GSC, GA4, Keyword Planner, Ahrefs, Semrush, backlink, or keyword-volume dataset was available through the discovered connectors. Rankings, indexed-page counts, conversions, U.S. volume, CPC, keyword difficulty and real-user CWV remain unestablished. Public crawlability does not establish indexing.

## Confirmed baseline

| Area | Evidence | Assessment |
| --- | --- | --- |
| Reachability | All 13 sitemap URLs reach HTTP 200 after the apex-to-www redirect | No missing sitemap page found |
| Robots | `/robots.txt` returns 200, permits public crawling, excludes `/admin`, and names the sitemap | Present; sitemap host needs alignment |
| Sitemap | `/sitemap.xml` returns 200 with 13 URLs: seven main/legal pages and six project pages | All entries currently use the redirecting apex host |
| Canonicals | All 13 final pages are on `www`; their canonical tags name the apex host | Conflicting canonical signals; fix first |
| HTML | Main content is available in fetched HTML; rendered mobile DOM confirms one homepage H1 and Organization JSON-LD | No empty client-rendered shell found; exact rendered/no-JS text parity was not exhaustively measured |
| Metadata | Titles, descriptions, canonical, Open Graph and Twitter metadata present on all 13 pages; sharing image returns 200 PNG | Existing foundation works; page-specific commercial intent is weak |
| Headings | One H1 on each of the 13 pages; sampled hierarchy check passes | Keep the editorial hierarchy |
| Internal links | All 13 logical sitemap pages have an inbound link in the parsed public set | No sitemap orphan found; contextual service links are missing because service pages do not exist |
| Unknown URL | An invented missing page returns HTTP 404 | Correct HTTP behavior; brief project pages are not confirmed soft 404s |
| Owner panel | Owner root returns 200 with `X-Robots-Tag: noindex, nofollow` and no-store headers | Correct separation from public indexable content |
| Old deployment host | `silicon-motives.vercel.app/` returns 200 with duplicate public content | Consider a production-alias redirect; preserve previews and the owner host |
| Branding and delivery | Legal disclosure, Kerala operations, domain email and founder names present | Useful existing trust signals; no U.S. office should be implied |

Google describes redirects and canonical annotations as strong signals and sitemap inclusion as a weaker supporting signal. Align them to the same final URL. Recommended choice: **keep the already configured `www` host** and update metadata/sitemap/schema constants to match. Neither hostname form has an inherent advantage. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

## Content and trust findings

1. **No commercial service URLs exist.** The homepage services anchor cannot separately explain software development, backend/API delivery, infrastructure, and DevOps purchase decisions. Dedicated pages are the main architectural opportunity.
2. **Project pages are overviews, not case studies.** The six pages contain roughly 47–54 words inside `<main>` after script/style removal, excluding header/footer. This count is only a diagnostic. They lack approved product visuals, named delivery roles, dates, substantial technical decisions and substantiated outcomes. Keep the projects and improve the evidence; do not pad them to a word target or delete them to satisfy a checker.
3. **CMS content and presentation copy conflict.** The homepage says “Three capabilities” but renders four older CMS service cards: Web & product development, Custom software, Cloud & infrastructure, and Ongoing engineering. Reconcile the actual content source before building service-page links.
4. **Founder identity is inconsistent.** The homepage renders “Jayasoorya S” from CMS while About uses “Jayasoorya Suryadas.” The exact-name match in `People.tsx` consequently omits his homepage LinkedIn link. Use a stable founder ID or verified alias mapping rather than a display-name join; confirm the canonical spelling and responsibilities.
5. **Four testimonials are now visible.** Their text matches the suggested draft wording in repository migrations. The public page and repository cannot establish whether each client subsequently approved publication. Confirm approval/provenance and logo permission; retain existing sections and publish only approved wording. This audit does not label the quotes fabricated and does not change their publication state.
6. **Agency copy is stronger than before.** It names Jasil, describes IST, written updates, milestones, confidentiality and handover. It still needs relevant project links, an explicit starting deliverable, and confirmed overlap/support boundaries rather than invented SLAs.
7. **No measurement baseline is established.** Qualified project and agency enquiries should be the conversion goal. Collect aggregate landing-page, country, query and enquiry-intent evidence once the chosen analytics/GSC setup is confirmed; do not send names, email addresses or project briefs into analytics.

The legal entity's formation date, project delivery dates, project contributions, client permissions, testimonial approvals, certifications, and claimed security properties were not independently verified. Attribute founder work before incorporation accurately when the evidence is supplied.

## Performance and image baseline

One Chrome cold-load trace, 390×844 mobile viewport, Slow 4G, 4× CPU slowdown:

| Metric | Result | Interpretation |
| --- | --- | --- |
| LCP | 3,114 ms | Above the 2.5-second “good” target in this lab sample |
| CLS | 0.03 | Below 0.1 in this lab sample |
| INP | Not measured | No representative interaction/field measurement |
| CrUX | Tool reported no page field data | No real-user CWV pass/fail can be assigned |

The LCP element was the cloud hero image. The trace found it in initial HTML and not lazy-loaded, but its initial request priority was Low before increasing to High. Discovery/load delay was about 1.22 seconds and load duration about 1.81 seconds. Source already uses Next Image `preload`; verify actual emitted preload/fetch priority before changing implementation. Inspect image compression/quality, the five-family Google Fonts stylesheet, and render-blocking CSS while preserving the visual treatment. Use the same test conditions for a later before/after comparison. [Google Web Vitals](https://web.dev/articles/vitals), [Chrome LCP discovery](https://developer.chrome.com/docs/performance/insights/lcp-discovery)

Mobile Lighthouse 13.4.1 scored 100 for SEO, Accessibility, Best Practices and Agentic Browsing, with no failures in its 54 automated checks. Performance was excluded from that Lighthouse run. These are limited automated checks, not an SEO strategy, ranking forecast, full accessibility certification, or proof of indexing.

The public PageSpeed API request returned HTTP 429 quota exceeded; no PageSpeed performance score is reported. This does not indicate a problem with SiliconMotives.

The static checker flags missing width/height attributes on 23 homepage images and two About images. Some Next Image `fill` uses already reserve space through fixed/aspect-ratio parents. Review rendered layout before treating every missing attribute as a CLS defect. Prioritize predictable logo slots and correctly sized responsive images. Empty alt is appropriate for decorative imagery or a logo with an adjacent readable company name; do not add keywords to those alt attributes.

## How to interpret the deterministic checker

Raw result: **9 failed checks, 16 passed, 3 not tested, 2 human review**. Its 14-page sample includes both hostname versions of the same homepage; there are 13 logical sitemap pages. Do not publish this as “nine Google violations.”

| Checker item | Reviewed conclusion |
| --- | --- |
| C2 sitemap | Real issue: entries redirect to www. Missing `lastmod` alone is not a blocker. Add timestamps only when genuine content-update dates exist; never use deploy time. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) |
| C8 canonical | Real host mismatch, confirmed independently in live HTML and rendered DOM |
| C11 title/description | Distinct logical pages have unique titles/descriptions. Duplicate homepage is a sample artifact. Homepage title is 63 decoded characters; checker reports 67 because of encoded `&amp;`. A 60-character limit is a heuristic, not a Google indexing rule. [Google title guidance](https://developers.google.com/search/docs/appearance/title-link) |
| C12 schema | Organization JSON-LD exists and parses. Add applicable entity connections and optional homepage WebSite markup; absence of the checker’s preferred base group does not make existing markup invalid. Google lists no universally required Organization properties. [Google Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization) |
| C13 brief pages | Six project pages need more useful evidence. Their length alone does not establish Google soft-404 classification; check GSC after verification |
| C16 snippet controls | Absence of an explicit `max-snippet:-1` does not itself prohibit normal snippets. `max-image-preview:large` is an optional enhancement. Keep owner-panel noindex separate. [Google robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) |
| C18 images | Check missing dimensions against reserved CSS geometry and measured shifts; do not report all 25 occurrences as proven instability |
| C7 llms.txt | Optional experiment, not a Google Search/AI eligibility requirement. Lower priority than content and canonical fixes. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) |
| C28 headers | Public-site hardening opportunity; not a demonstrated ranking blocker. Owner/admin headers are already protected. Roll out any CSP with compatibility checks |
| Not tested / human checks | CrUX unknown; IndexNow not configured and optional; rendering declaration missing in checker configuration; hreflang unnecessary for one English URL set; specialist YMYL review not triggered merely because a portfolio project is healthcare software |

## Proposed P0/P1/P2 plan

P0 means the first consistency/trust work to address, not a claim that Google has blocked the site.

| Priority | Work | Acceptance evidence |
| --- | --- | --- |
| P0 | Align `SITE_URL`, canonicals, OG URLs, Organization URL and sitemap to `https://www.siliconmotives.com`; keep owner routing separate | All 13 final pages self-canonicalize; sitemap entries return 200 without host redirects; robots names the matching sitemap |
| P0 | Confirm testimonial/logo permissions and delivery attribution before amplification | Owner-supplied approval/source records; no unsupported claims or new testimonials introduced |
| P1 | Reconcile CMS service taxonomy and founder identity | Three intended capabilities render consistently; both founder links/names agree across homepage and About |
| P1 | Build four commercial service pages using the keyword map, in stages | Distinct scope, buyer problem, deliverables, actual evidence, visible internal links and relevant enquiry CTA on every new page |
| P1 | Improve Woobe first, then Picbox or Uniwayin as evidence permits | Approved/redacted screenshots; actual scope, contributors, dates, decisions, verified stack and outcomes. Preserve all six existing project URLs |
| P1 | Strengthen the agency page | Explicit partnership scope and delivery arrangements; relevant project/service links; agency-mode CTA retained |
| P1 | Establish GSC and enquiry measurement; obtain U.S. keyword data | Verified domain ownership, submitted final-host sitemap, recorded indexing status, aggregate query/country/landing-page baseline, documented qualification events |
| P1 | Improve mobile LCP using measured bottlenecks | Comparable cold-load lab runs improve without visual regression; field outcome tracked only when available |
| P2 | Add stable entity IDs and verified logo/social/founder connections; useful breadcrumbs | Markup matches visible facts; Rich Results Test/Schema validation applicable to the types used; no invented reviews, credentials, addresses or founding dates |
| P2 | Review production Vercel alias, image slots, public headers, fonts and public-content caching | Preserve owner/preview routing and admin no-store behavior; demonstrate actual benefit without delaying CMS changes unexpectedly |
| P2 | Publish evidence-based technical explanations, then evaluate additional agency/location pages | Founder-authored/approved content with useful original detail; commercial relevance; no thin city/keyword variants |

## GEO/AEO and international approach

Use clear company facts, direct answers about scope and working arrangements, accessible text, descriptive internal links and original engineering evidence. Build consistent public founder/company profiles once verified. Google requires the ordinary search foundations for its AI features and does not require special AI files or special schema. Avoid guaranteed AI-citation claims. [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)

Keep “engineering operations: Kerala, India” and “legal entity: Millionian LLC, Wyoming” distinct. Target U.S. buyers through the offer, delivery arrangements and proof; do not call the company a U.S. engineering office. Do not generate U.S. city pages, add a registered-agent address, or invent U.S. client history. One English site does not need invented regional hreflang variants.

## Implementation boundary

Recommended first approval: P0 technical hostname alignment, then the four service-page briefs and agency-page strengthening. Gather client/founder evidence in parallel. Re-run seo-ops after approved changes, review its heuristic failures, and compare against this baseline. Keep all existing projects and homepage client/testimonial sections; preserve the premium design and avoid homepage keyword stuffing.

No code or production change is included in this report. Measured U.S. demand and authenticated index/conversion data remain the next research inputs, rather than fabricated numbers.
