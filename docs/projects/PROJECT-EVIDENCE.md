# Project evidence and remaining inputs

Updated 23 October 2026. This is an internal editorial record, not public page copy.

## Published scope

The Woobe, Picbox and Uniwayin pages have business-need and workflow sections. Woobe also has implementation decisions, a stack and public source references. Other existing projects remain accessible. Relevant service pages already link to these project URLs, and project pages link back to related services.

Woobe now includes two actual public storefront captures and a live-site link, following Jayasoorya's supplied `woobe.in` URL. Contributor assignments, delivery dates and measured results remain absent pending confirmation. Existing editorial covers are not used as product captures.

## Public storefront captures, 23 October 2026

- Canonical storefront observed: `https://www.woobe.in/` (the supplied apex domain redirects there).
- Product observed: `https://www.woobe.in/products/maroon-printed-relaxed-shirt`.
- Images: `public/images/projects/woobe/storefront-2026-10-23.webp` and `product-detail-2026-10-23.webp`.
- Both are unaltered browser viewport captures, 2880 × 1432 pixels, taken without signing in or submitting a form. No cart, checkout or account actions were performed.
- Public navigation, promotional content, product options and weight-based pricing are visible. No private customer or staff records are included.
- Captions identify the capture date and note that product prices and availability can change. The screenshots establish the public interface at that time, not launch history, contributor roles or measured business outcomes.

## Woobe source evidence

Public repository: `jsurya114/Wobee-ecommerce`.
Reviewed source snapshot: `c6cac10926e95697991bb7c7a5c7e83af7b23f0d`.

| Public statement | Evidence at that snapshot |
| --- | --- |
| Next.js storefront and staff admin; Express API; modular application boundaries | `Readme.md`, `apps/web/package.json`, `apps/api/package.json` |
| Shared types, Zod validation, UI primitives and utilities | `Readme.md`, application manifests |
| Grams/paise pricing arithmetic and display conversion | `packages/utils/src/weight.ts`, `packages/utils/src/money.ts` |
| PostgreSQL and Prisma | `packages/database/prisma/schema.prisma`, `packages/database/package.json` |
| Redis and Razorpay in the application stack | `Readme.md`, `apps/api/package.json` |
| AWS infrastructure | Existing website project record; no topology or reliability metrics added |

These observations describe source code. They do not establish the production deployment version, commercial outcome, launch date or division of responsibility between contributors. Public source references are pinned so readers can inspect the same implementation.

Picbox and Uniwayin workflow copy uses existing website scope records. Earlier claims about invoice counts, lead counts, staff counts, API counts and security have not been reintroduced.

## Inputs still required

For Woobe and Picbox or Uniwayin, supply:

- Picbox or Uniwayin screenshots, and any additional Woobe administration view: with client permission and personal/business-sensitive records removed. Use demo records where possible.
- Who built which parts: Jasil, Jayasoorya and any other contributors, with actual responsibilities.
- Delivery period, plus whether work predates Millionian LLC. Attribute earlier work to the people who performed it, with an accurate description of the company relationship.
- Any publishable outcome: metric, measurement period/date, context and supporting evidence, or an approved named client quote. A feature list alone is not a measured result.
- Any live product URL the client approves for linking.

Optional story fields support screenshot dimensions/captions, contributors, delivery period and a sourced result. Leave a field absent until its content is confirmed. Do not place publishing reminders or missing-evidence notes in public page copy.

## Implementation checks

- Production webpack build and TypeScript compilation passed.
- Built Woobe page inspected in the browser; the local development preview had stale content, so the production build was used for inspection.
- `git diff --check` passed.
- No contact enquiries or client messages were sent.
