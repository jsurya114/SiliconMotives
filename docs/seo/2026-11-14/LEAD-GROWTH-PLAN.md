# Lead-growth SEO plan and first implementation

14 November 2026. Internal project record, not public copy. Builds on the 22–26 October work in this folder.

## Audit findings (live site, 14 November)

Already sound: canonicals, sitemap and robots, unique titles/descriptions/H1s, Organization and WebSite schema, Service and Breadcrumb schema on service pages, 7 service pages, 6 project case studies, an agency page and the Kochi website-design page.

Gaps that limit lead generation:

1. No blog or informational content. Every page targets buyers who already know what to hire; nothing captures earlier-stage searches.
2. No analytics or conversion tracking. Form submissions, WhatsApp, phone and email clicks could not be attributed to pages.
3. Contact page had a minimal title and one-line description.
4. Organization `sameAs` lists only Instagram. The two LinkedIn links are personal profiles; there is no company page, Clutch/GoodFirms profile or Google Business Profile.
5. Sitemap had no `lastmod`.
6. Search Console / GA4 ownership should sit with an account the business controls.

## Implemented 14 November

- `/blog` index and `/blog/[slug]` template with BlogPosting and Breadcrumb schema, internal links to services and projects, and an enquiry CTA. Footer link added. Blog URLs added to the sitemap with `lastmod`.
- Two launch posts: website design cost in Kerala (links to the Kochi page and Woobe); choosing a white-label development partner (links to agency, backend and AWS pages). Posts contain no invented prices, statistics, client claims or outcomes.
- GA4 support, **off by default**. Set `NEXT_PUBLIC_GA_ID` (format `G-XXXXXXXXXX`) to enable. Events: `generate_lead` (form success, with `enquiry_type`), `phone_click`, `email_click`, `whatsapp_click`. When enabled, the privacy page text switches to disclose Google Analytics cookies.
- Contact page title and description rewritten. `lastmod` on `/blog`, `/contact` and posts only; other pages are left undated because their edit dates are not tracked.

## Needs the owners

- GA4 property created (18 November). Measurement ID `G-NZF61Y4YB0` is the default in `lib/analytics.ts`; `NEXT_PUBLIC_GA_ID` overrides it (empty value disables). Still to decide: a cookie-consent banner for EU/UK visitors.
- Provide real price ranges for website projects. A cost post with honest ranges would rank and convert better than one with none.
- Create a company LinkedIn page, then add it to `sameAs`.
- Confirm the Search Console property is owned by a business account and the sitemap is submitted.

## Backlinks: realistic monthly target is 5–10 earned links

Do not buy or mass-submit links; Google's spam policies target link schemes and a new domain is exposed to them.

- "Built by SiliconMotives" credits on client sites (Woobe, Nasa Logistics, Picbox, Uniwayin, Dental Buddy, JJC Artworks), with the client's permission.
- Profiles on Clutch, GoodFirms and DesignRush once there are client references to show.
- Company LinkedIn page; GitHub organisation linking to the site.
- Guest posts and founder interviews on Kerala/India startup and developer publications.
- Local business directories and Kochi/Kerala business associations the company genuinely qualifies for.

## Content calendar (4 strong posts per month, each tied to one service page)

| Target page | Post idea |
| --- | --- |
| `/services/aws-devops` | AWS deployment checklist for a first production launch |
| `/services/custom-software-development` | Spreadsheet to custom software: when a business should switch |
| `/services/backend-development` | REST vs GraphQL vs tRPC: how to choose for a business app |
| `/services/devops-consulting` | CI/CD for small teams: the minimum pipeline worth having |
| `/services/website-design-kochi` | Ecommerce for Indian SMEs: Razorpay, GST invoices and shipping basics |
| `/agency-partners` | Handing a client project to a partner: a delivery handover checklist |

Each post should have a real byline approved by the author, at least two internal links to service/project pages, and an update date when revised.

## Measurement

Search Console: impressions, clicks, query/page pairs for the target queries in `2026-10-24/KEYWORD-MAP.md`. GA4 (once enabled): `generate_lead` by landing page. Review monthly; no ranking guarantees are made.
