# SiliconMotives website

The public homepage is rebuilt around the founders' remote-first engineering positioning. It uses a white/dark palette, a locally stored generated architectural hero image, system fonts, and responsive layouts. No CSS gradients or external font requests are used. Hero artwork and its generation prompt are documented in `HERO-ASSET.md`.

## Local development

Run `npm install` and `npm run dev`. The Next.js website runs at http://localhost:3000. The existing Express backend remains a separate service.

## Production configuration

- Set `SITE_URL` to the **confirmed canonical origin**, including `https://`, before building. This enables homepage indexing, canonical metadata, sitemap entries, and production social-image URLs. Without it, the site deliberately uses `noindex` and emits no sitemap URLs rather than guessing the renamed company's domain.
- Optionally set `GOOGLE_SITE_VERIFICATION` to the Search Console verification token.
- Set server-side `API_URL` to the Express backend origin, without `/api`. It falls back to the existing `NEXT_PUBLIC_API_URL`, then `http://localhost:5001` for local development.
- The contact endpoint forwards validated enquiries to `/api/contact` on that backend. MongoDB, notification credentials, and the existing backend must be configured for actual delivery. The existing backend rate limiter remains active; behind the Next.js proxy it sees the proxy's IP, so review trusted-proxy/per-visitor rate limiting for production traffic.
- Public email and phone details are intentionally omitted until confirmed. No office address, made-up client results, or placeholder testimonials appear on the homepage.
- After the domain is confirmed, configure redirects from the old domain at the hosting provider and submit the new sitemap in Search Console. No hosting or DNS changes have been made.

## Content ownership

The new homepage copy lives in `app/page.tsx`; brand metadata lives in `app/lib/site.ts` and `app/layout.tsx`. Portfolio projects and approved testimonials are restored from the existing CMS with 60-second revalidation and a bounded request timeout. Client names come from the portfolio’s optional `clientName` field or company names in approved testimonial roles. When data is unavailable, bundled project images are labeled as archive design previews, and client/testimonial sections show honest empty states. Other marketing sections are maintained in code, so old seed data cannot overwrite the rebrand. Existing admin screens and database content are retained, but their legacy hero/service/about/SEO editors do not control the new homepage. Contact submissions still use the existing backend. Migrating CMS fields to the new page structure is separate work.

The existing `/blog` placeholder uses the new brand and is excluded from indexing until there are articles. `/testimonial` redirects to `/submit-testimonial`; submission pages are noindexed. Admin routes send an `X-Robots-Tag: noindex, nofollow` header and are excluded from robots crawling; the renamed admin cookie requires existing users to sign in again. Existing database credentials and content were not modified. Backend CORS origins now use `CLIENT_URL` and optional comma-separated `ADDITIONAL_CLIENT_ORIGINS`, rather than assuming ownership of a new domain. Future image uploads use the renamed folder; existing image URLs remain valid.

## Verification

- TypeScript, Next.js lint, and a production build.
- Playwright layout checks at 375, 768, 1024, and 1440 pixels, with one H1, no horizontal overflow, and no rendered gradients.
- Mobile navigation, Escape dismissal, section navigation, native FAQ disclosures, and reduced-motion behavior.
- Render checks for CMS project links, client deduplication, approved review data, empty review states, safe project URLs, and founder/client model fields.
- Simulated contact failures preserve inputs; simulated success clears the form and announces confirmation. These checks do not send real enquiries or validate notification delivery.
- Metadata, organization/founder JSON-LD, generated social image, robots, sitemap, and admin noindex checks.

SEO implementation references: [Next.js metadata conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata), [Google organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization).
