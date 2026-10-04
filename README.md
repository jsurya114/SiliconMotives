# SiliconMotives

Remote-first engineering company based in Kerala, India. Jasil M is the Founder; Jayasoorya S is the Co-founder.

Next.js 14 website with a Supabase-backed CMS. Services cover CRM/ERP, e-commerce and Shopify, WordPress, static websites, custom applications, and AWS hosting/deployment.

## Run locally

```sh
npm install
npm run dev
```

The backend is Supabase (database, admin login, image storage). Copy `.env.example` to `.env.local` and follow [SUPABASE.md](./SUPABASE.md) to create the project, schema, and first admin.

## Content

- Portfolio and approved testimonials are fetched from Supabase.
- Add an optional **Client / company name** in the portfolio editor to include a client in the client section. Company names in approved testimonial roles (e.g. `Founder, Example Company`) are also used.
- When the API is unavailable, bundled portfolio images appear as labeled design previews. Client endorsements and client names are never fabricated.
- The service list, technologies, founder story, and other homepage copy are maintained in the page/components.
- A generated monochrome hero image replaces the earlier orbital artwork. Scroll reveals progressively enhance visible HTML and respect reduced-motion preferences.

Set `SITE_URL` to the confirmed production origin before building to enable indexable metadata and canonical/sitemap URLs. See [implementation notes](./SILICONMOTIVES.md) for deployment details.

```sh
npm run lint
npm run build
```
