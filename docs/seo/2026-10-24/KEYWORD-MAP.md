# Search-intent map and Kochi priorities

24 October 2026. Internal implementation plan, not public marketing copy.

## Source and limits

Reviewed Jasil M's nine-part SEO strategy shared on 24 October at 13:41–13:42 IST in the existing DM. Sources: [regional candidates](https://crew224.slack.com/archives/D0C5TCE3NLR/p1792829504222899), [page architecture](https://crew224.slack.com/archives/D0C5TCE3NLR/p1792829531586429), [execution checklist](https://crew224.slack.com/archives/D0C5TCE3NLR/p1792829533117449).

These are candidate queries. Search volume, keyword difficulty, conversion rate and top-10 feasibility have not been measured. The proposed 40/35/25 market allocation is a strategy suggestion, not market data. Current priority follows Jayasoorya's request for Kochi visibility while preserving the agency offering.

## Existing page ownership

| Priority | Existing URL | Main intent | Closely related candidates |
| --- | --- | --- | --- |
| P0 | `/services/website-design-kochi` | Website design and development in Kochi | website design Kochi; website development Kochi; business website development Kerala; ecommerce website development Kochi |
| P0 | `/services/custom-software-development` | Custom software development from Kochi, Kerala | custom software development Kochi; software development company Kerala; business software development Kerala; custom CRM development Kochi |
| P0 | `/agency-partners` | White-label software engineering for agencies | white label software development partner; development partner for agencies; outsourced engineering for US agencies |
| P1 | `/services/backend-development` | Backend, API and integration engineering | backend development company India; Node.js API development services; backend development partner for agencies |
| P1 | `/services/cloud-infrastructure` | Cloud infrastructure planning and implementation | cloud infrastructure consulting; AWS infrastructure consulting India; cloud infrastructure services Kerala |
| P1 | `/services/aws-devops` | AWS deployment and delivery implementation | AWS DevOps consulting services; AWS deployment services; CI/CD implementation |
| P1 | `/services/devops-consulting` | Review and improvement of an existing delivery workflow | DevOps consulting Kerala; DevOps consulting for startups; release workflow review |
| Supporting | `/projects/woobe` | Evidence for weight-based commerce and its implementation | project-specific architecture, pricing logic, public product screenshots |
| Supporting | Other five `/projects/...` URLs | Evidence for the documented product workflows | relevant inventory, CRM, logistics, clinic and business-website workflows |
| Brand | `/` and `/about` | SiliconMotives identity, founders, capabilities and operations | SiliconMotives; Silicon Motives; founders; remote-first engineering Kerala |

The website-design and custom-software pages serve different buying decisions. AWS implementation and DevOps consulting retain separate scopes. Do not create extra pages for spelling variations such as Kochi/Cochin or Bangalore/Bengaluru.

## Implemented first pass

- Reused the existing custom-software URL, now with a Kochi/Kerala title, description and H1.
- Added a regional delivery explanation covering actual remote operations, workflow discovery, acceptance criteria, source ownership and handover.
- Added a location-specific FAQ and Service areaServed data consistent with the visible copy.
- Kept links to Picbox, Uniwayin and Dental Buddy as the supporting product evidence. No outcomes, client locations or delivery dates were invented.
- The existing Kochi website-design page already has local service metadata, local Service data, real Woobe captures, project links, scope guidance and FAQs.
- The existing agency page already uses Jasil's suggested white-label title and a dedicated agency enquiry route.

## Hold until supported or validated

- Shopify-specific landing pages: first establish the relevant delivered Shopify/API work or a clearly defined, supportable offering.
- ERP, SaaS, maintenance and CI/CD landing pages: validate demand and define distinct deliverables/evidence before adding routes that overlap existing services.
- Bengaluru and other city pages: no office claims and no templated city duplicates. Serving a city remotely does not establish a physical office there.
- A separate Kerala hub: only if it provides information distinct from the existing service pages and About page; not needed merely to repeat location keywords.
- “Best”, “world-class”, “trusted worldwide”, fixed savings, uptime or security claims: do not convert keyword candidates into unsubstantiated claims.
- “Cheap” and “affordable”: do not promise pricing without a real basis or use the terms as the main brand positioning.

## What top 10 means and how to measure it

Track exact queries, country, device, landing page and date. Treat ordinary organic results separately from Google Maps/local-pack results. A top-10 goal applies to a specific query and audience; it cannot be promised for every search or every user.

Search Console should be reviewed for impressions, clicks, CTR, query/page pairs and average position once data is available. Its average position is not a fixed rank for every searcher. Review qualified project versus agency enquiries using the actual enquiry records; no new analytics or tracking cookies were installed in this change.

The previous check confirmed seven priority URLs indexed, with DevOps consulting discovered but waiting. Its live Google test said it could be indexed. Do not repeatedly request indexing of an unchanged page to try to accelerate Google's queue.

## Work requiring real business inputs

- Approved product screenshots, dates and contributor responsibilities for Picbox/Uniwayin and the other projects.
- Relevant client-owned links/citations and approved testimonials. Do not send outreach or create reviews automatically.
- Access to actual Keyword Planner or another reliable keyword dataset for demand estimates. Public search results alone do not establish search volumes or local rankings.
- Determine Google Business Profile eligibility from actual in-person customer contact; do not invent a public office for a remote-only company.
- Obtain a successful mobile lab-performance benchmark and fix measured bottlenecks without changing the cloud animation. The previous PageSpeed API attempt hit its daily quota.

## References

- https://developers.google.com/search/docs/fundamentals/do-i-need-seo
- https://developers.google.com/search/docs/essentials/spam-policies
- https://support.google.com/business/answer/7091
- https://support.google.com/webmasters/answer/7576553

No ranking guarantee or measured traffic improvement is claimed.

## Initial public search sample

Queries sampled on 24 October: `custom software development Kochi company`, `website design Kochi Kerala company`, and `DevOps consulting Kochi Kerala`. The search provider returned examples including [Bytekat](https://bytekat.com/), [Svastiq's custom-software page](https://svastiq.com/services/custom-software-development), and [W qube](https://www.wqube.com/).

The sampled pages make their offer and operating location clear and link to product or project evidence. This supports improving relevance and verifiable proof on our existing service pages. Their client counts, experience and other marketing claims were not independently checked or copied. This sample is not a Kochi-geolocated Google rank report and supplies no keyword-volume estimate.

## Validation of this pass

Production webpack build and TypeScript compilation passed. Local production HTTP checks passed for the custom-software and backend pages: HTTP 200, one H1, expected self-canonical, valid JSON-LD, and the intended region data only on the custom-software page. The custom-software page retained its Picbox, Uniwayin and Dental Buddy links. Git whitespace checks passed.
