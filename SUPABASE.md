# Supabase backend

The site uses Supabase for its database (Postgres), admin login (Auth), and
image uploads (Storage). The old Express/MongoDB server in `server/` is only
kept to run the one-time data migration; it no longer serves the site.

## 1. Create the project

1. Create a project at https://supabase.com (region: Mumbai `ap-south-1` is
   closest to Kerala).
2. Copy `.env.example` to `.env.local` and fill in, from
   **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (secret, server only)
   - `IP_HASH_SALT`: any long random string
3. Add the same variables to the hosting provider (e.g. Vercel).

## 2. Create the database schema

Either paste `supabase/migrations/20261004120000_initial_schema.sql` into
**SQL Editor → New query** and run it, or with the CLI:

```sh
npx supabase login
npx supabase init          # keeps the existing migrations folder
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates the tables, row-level security policies, and a public `media`
storage bucket.

## 3. Create the first admin

1. **Authentication → Users → Add user** (email + password, auto-confirm).
2. In **SQL Editor**, grant admin access:

```sql
insert into public.admin_users (user_id, name)
select id, 'Your Name' from auth.users where email = 'you@example.com';
```

3. Sign in at `/admin/login`.

Also set **Authentication → URL Configuration → Site URL** to the live
domain, and disable public sign-ups (**Authentication → Providers → Email →
Allow new users to sign up: off**). Admins are added by you, not self-service.

## 4. Migrate existing MongoDB data (one time)

```sh
cd server
npm install
# dry run first: prints what would be copied, writes nothing
MONGODB_URI=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  npm run migrate:supabase -- --dry-run
# then for real
MONGODB_URI=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  npm run migrate:supabase
```

- Copies site content, SEO settings, services, portfolio, testimonials, and
  contact submissions. Tables that already have rows are skipped.
- Old admin accounts get an invite email (or set `ADMIN_TEMP_PASSWORD` to
  create them with a temporary password). Passwords cannot be copied.
- Existing Cloudinary image URLs keep working; new uploads go to Supabase
  Storage.
- The SEO canonical URL is cleared, because the old domain is retired.

After verifying the data, the `server/` folder, `render.yaml`, and the Render
service can be deleted.

## Security model

| Who | Can do |
|---|---|
| Public visitors (anon key) | Read active services/portfolio, approved testimonials, site content, SEO settings |
| Contact & testimonial forms | Go through `/api/contact` and `/api/testimonials` (server, service role) with validation and per-visitor rate limits |
| Signed-in admins (`admin_users`) | Full read/write on all content, submissions, and the `media` bucket |
| Anyone else signed in | Nothing beyond public reads |

Visitor IPs are stored only as salted hashes (for rate limiting) and are never
readable through the public API.

## Changing the schema

Add a new file in `supabase/migrations/`, run `npx supabase db push`, then
regenerate types:

```sh
npx supabase gen types typescript --linked > app/lib/supabase/database.types.ts
```
