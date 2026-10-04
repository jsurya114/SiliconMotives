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

Either run every file in `supabase/migrations/` **in filename order** in
**SQL Editor → New query** (currently `20261004120000_initial_schema.sql`,
`20261004130000_harden_privileges.sql`, `20261005120000_content_model.sql`, then
`20261005130000_restrict_public_columns.sql`), or with the CLI:

```sh
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates the tables, row-level security policies, and a public `media`
storage bucket.

Then load the real default content (capabilities, team, FAQs, homepage
settings, and the flagship project + case study). It never creates clients or
testimonials, and it is safe to re-run:

```sh
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:content
```

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

## Managing content

Sign in at `/admin`. Every content type uses the same screen:

- **Projects**: portfolio entries. Star to feature on the homepage (3–4 ideal).
- **Case studies**: deeper technical stories, including the architecture
  diagram (a list of components, never IPs, hostnames or ports). The first
  featured, published case study is shown on the homepage.
- **Clients**: only shown when “Public display permission” is on.
- **Testimonials**: public submissions arrive as Pending; approve to publish.
- **Team**, **Capabilities**, **FAQs**, **Site settings** (hero, proof strip,
  public email/booking link), **SEO**, **Enquiries**.

Drafts are never visible publicly (enforced in the database). Saving in the
admin refreshes the public pages immediately via `/api/revalidate`
(admin-only); otherwise pages refresh every 60 seconds. Images are resized in
the browser to at most 2400px and converted to WebP before upload.

Without Supabase configured, public pages fall back to `content/defaults.json`.

## Local development

```sh
npx supabase start          # Docker; applies all migrations locally
# copy the printed API URL / anon key / service_role key into .env.local
npm run seed:content
npm run dev
```

Create a local admin in Studio (http://127.0.0.1:54323) or via the SQL in step 3.

## Security model

| Who | Can do |
|---|---|
| Public visitors (anon key) | Read published projects, case studies, capabilities, team and FAQs; approved testimonials; clients cleared for public display; site content and SEO settings |
| Contact & testimonial forms | Go through `/api/contact` and `/api/testimonials` (server, service role) with validation and per-visitor rate limits |
| Signed-in admins (`admin_users`) | Full read/write on all content, submissions, and the `media` bucket |
| Anyone else signed in | Nothing beyond public reads |

Visitor IPs are stored only as salted hashes (for rate limiting) and are never
readable through the public API.

Row-level security controls which rows are public; column grants control
which fields are. The public role cannot read project URLs, client links or
names, case-study client links, or internal client notes directly. Those are
served only through `public_project_details()` and `public_case_study_clients()`,
which apply the confidential / anonymized / public-display rules in the
database. Signed-in users can only read these tables if they are admins.

## Changing the schema

Add a new file in `supabase/migrations/`, run `npx supabase db push`, then
regenerate types:

```sh
npx supabase gen types typescript --linked > app/lib/supabase/database.types.ts
```
