# SiliconMotives

Next.js App Router + React + TypeScript + Tailwind CSS company website for SiliconMotives, Kerala, with a Supabase admin panel. The public homepage follows the visual direction in [SiliconMotivesv3](https://github.com/jasilmeledath/SiliconMotivesv3). Published content comes from Supabase; the remote first story and service copy use the bundled presentation content.

## Run locally

Requires Node.js 22 or newer. Copy `.env.example` to `.env`. Set the Supabase values for editable content and the SMTP values below for email delivery.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000 for the site and http://127.0.0.1:3000/admin for the admin panel. Restart the server after changing `.env`. From the repository root, run `npm run sync` after content or design changes to update the visible `silicon-motives/` project copy. Each copy uses its own ignored `.env`; sync never copies credentials.

## Deploy

Vercel uses the Next.js framework, installs dependencies with `npm ci`, and runs `npm run build` with output in `.next/`. The contact Route Handler runs in the Node.js runtime. Set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS` in the Vercel project environment variables and redeploy. Use either the repository root or the synchronized `silicon-motives/` directory as the Vercel Root Directory. Remove any old dashboard overrides for the Other framework or `build/` output. This app needs a Next.js server; static export does not support the email endpoint. Only the public Supabase URL and publishable key are passed to the admin browser.

For existing Vercel configurations, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are also accepted when the corresponding `SUPABASE_*` variable is empty. Both names must contain only the project URL and publishable key, never a secret or service-role key.

`.env`, `.next/`, and generated TypeScript files are Git-ignored. Only empty placeholders are committed. The URL and publishable key remain visible in the browser by design; database access is enforced by Supabase row-level security. Never use a secret or service-role key for `SUPABASE_PUBLISHABLE_KEY`.

## Email delivery

The project enquiry and agency partnership forms post to `/api/contact`. Nodemailer sends to `hello@siliconmotives.com`, with the visitor’s address in Reply-To. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS` for the company mailbox. The form never redirects to WhatsApp.

1. Get the SMTP hostname, port, TLS mode, mailbox username, and password from the domain email provider.
2. In Vercel → Project → Settings → Environment Variables, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER=hello@siliconmotives.com`, and `SMTP_PASS` for Production (and Preview if preview emails are wanted). Keep credentials out of source files and browser configuration.
3. Redeploy after saving the variables. For local development, put them in the ignored `.env` file and restart `npm run dev`.
4. Submit an enquiry from the deployed site and verify it arrives in the company inbox. A successful response means the SMTP server accepted the message; it does not guarantee inbox placement.

If Supabase is configured and **Save website enquiries in the admin inbox** is enabled, the server also saves a copy. Email delivery does not depend on that setting. A failed inbox copy is logged without visitor data and does not cause an already-sent email to be reported as failed.

Run `npm test`, `npm run check`, and `npm run build` before deployment. Automated tests mock external delivery and include real Nodemailer message generation without sending email; they do not verify mailbox credentials.

## Project layout

- `app/(site)/`: server-rendered homepage and reference theme styles
- `components/sections/` and `components/motion/`: public sections and scroll effects; the hero stays static
- `components/site/`: existing enquiry form, email integration, and original application components
- `app/globals.css`: Tailwind theme and shared utilities; public-site resets are scoped away from the admin
- `app/admin/` and `components/admin/`: authenticated React admin at `/admin`
- `lib/content.ts` and `lib/default-content.json`: published Supabase content and bundled fallbacks
- `app/api/contact/route.ts`, `lib/contact-route.mjs`, and `lib/contact.mjs`: server-side Nodemailer delivery and optional admin inbox copies
- `public/images/`: cloud imagery, project covers, and founder portraits
- `tests/`: delivery, Route Handler adapter, and contact submission tests
- `supabase/migrations/`: database tables, security policies, media storage, and starting content
- `.env.example`: environment variable names without credentials

Public content is fetched on each page request without caching. Refresh the public page after saving an admin edit. Without Supabase configuration (or if a collection is empty/unavailable), the site uses bundled fallback content. Email works independently of Supabase. Without SMTP credentials, the form retains the visitor’s input and shows a direct email address; it does not claim success or open WhatsApp.

To run the production server locally:

```sh
npm run build
npm start
```

## Admin panel

The production owner panel is served at **https://owner.siliconmotives.com/**. It uses the same Vercel project and Supabase admin accounts as the public website. The subdomain root internally serves the admin page; `/admin` on the public production domains redirects to the owner subdomain. Local development and preview deployments keep `/admin` available.

To activate the owner subdomain:

1. In the existing Vercel project, open **Settings → Domains** and add `owner.siliconmotives.com` to Production. Connect it to this project, without a domain redirect to the public website.
2. At the DNS provider for `siliconmotives.com`, create the `owner` CNAME with the exact target Vercel displays. If Vercel manages DNS, follow its automatic configuration. Wait until Vercel shows valid configuration and HTTPS is ready.
3. In Supabase **Authentication → URL Configuration**, add `https://owner.siliconmotives.com/` to **Redirect URLs** for password recovery. Keep local development URLs as needed.
4. Deploy these routing changes, then verify owner sign-in, password recovery, and the public website. The owner host sends `noindex, nofollow` headers and retains the existing authentication and admin membership checks.

Signed-in admins can:

- **Submissions**: read project briefs sent from the contact form, mark them read, replied, or archived, reply by email, delete them, and export them to CSV
- **Services, Team, Portfolio, Clients, Testimonials, FAQs**: add, edit, reorder, publish or hide, and delete entries, with image uploads where relevant
- **Contact & settings**: set the contact email, phone, WhatsApp, LinkedIn, and Instagram shown on the site, and enable or disable admin inbox copies of emailed enquiries

Saved changes appear on the next public page load. Existing Supabase tables, accounts, permissions, and uploaded media are retained; this framework migration requires no new database migration. Client, testimonial, portfolio, team, and FAQ sections display published CMS entries, with bundled fallbacks for portfolio, clients, FAQs, and founder details.

### Client testimonial drafts

Run `supabase/migrations/20261012170000_client_testimonial_drafts.sql` in Supabase SQL Editor to add three unpublished entries under **Admin → Testimonials**. Deploying the website does not apply this migration. It can be re-run without duplicating these entries or overwriting existing client feedback.

These are suggested wording for review, not quotes supplied or approved by the clients:

| Client | Suggested testimonial |
| --- | --- |
| Abdul Rahman — CEO, NasaLogistics | The team understood how we manage driver availability and orders. NasaLogistics brings those tasks into one place and is straightforward for our team to use. |
| Rakhi S — Dentist, Dental Buddy | Dental Buddy brings patient records, appointments, and billing into one place. The team listened to our clinic's needs and kept the system practical for day-to-day use. |
| Gokul — Entrepreneur, Woobe | Woobe's weight-based shopping needed a clear, simple experience. The team worked through the details with us and built a storefront that fits the way we sell. |

Review each entry with its named client, update the wording if needed, then publish it in admin. Published entries appear in the public testimonial reel. Run `20261012180000_testimonial_client_roles.sql` to set Rakhi S’s role to Dentist and Gokul’s to Entrepreneur. This preserves the saved quotes and publication status. Testimonials use a horizontal loop like the client showcase, pause on hover or keyboard focus, and use a static layout for reduced-motion preferences.

## Setting up Supabase (one time)

1. Create a project at https://supabase.com.
2. Run the migrations in `supabase/migrations/` in timestamp order: either paste each SQL file into **SQL Editor** and run it, or use the Supabase CLI (`supabase link` then `supabase db push`). The migrations create the CMS, starter content, and portfolio project records for Woobe, NasaLogistics, Picbox, Uniwayin, and Dental Buddy. Existing published projects are kept as unpublished drafts when Woobe is added. For an existing installation with the earlier migrations applied, run `20261012150000_feature_dental_buddy_portfolio.sql` to add Dental Buddy to the admin and live CMS portfolio. Deploying the website does not run database migrations. Run `20261012160000_founder_portraits.sql` to save the bundled founder portraits in the Team editor and allow local photo paths. The public site also uses these portraits for Jasil M and Jayasoorya S when their photo fields are empty.
3. Copy the project URL and publishable (or legacy anon) key from the project's **Connect** dialog into `.env` as `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. Set the same variables on your hosting provider. Never use the service-role or secret key.
4. Create the admin login: **Authentication → Users → Add user**, with an email and a strong password (tick "Auto Confirm User").
5. Grant that user admin access in **SQL Editor**:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

6. In **Authentication → URL Configuration**, set the Site URL to your live domain and add `https://owner.siliconmotives.com/` (and `http://127.0.0.1:3000/admin/` and `http://localhost:3000/admin/` for local use) to the redirect URLs so password reset links work.
7. Recommended: in **Authentication → Providers → Email**, turn off "Allow new users to sign up". New accounts get no admin access either way, but this keeps the user list clean.

To add another admin later, repeat steps 4 and 5. To remove one, delete the row from `public.admin_users` or delete the user.

### Seed an admin locally

After running the database migration, add `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SEED_EMAIL`, and `ADMIN_SEED_PASSWORD` to your ignored `.env`, then run `npm run seed:admin`. Use the legacy `service_role` key for this command. It creates an email-confirmed account (or updates the matching account's password), grants admin membership, and verifies the membership. The command is never run by the build. Remove the service-role key and seed password from `.env` after seeding. These values are never included in browser configuration.

## Security

- The database enforces access through row-level security, not the browser. Visitors can read published content and settings, and can only send name, email, and message to `contact_submissions`. They cannot read submissions or change anything.
- Only users listed in `admin_users` can see hidden entries, edit content, read submissions, or upload media.
- Links and image URLs must be `http(s)`, and all content is escaped when rendered.
- The email endpoint validates input, accepts same-origin JSON requests, discards honeypot submissions, fixes the recipient server-side, and keeps credentials out of the browser. Basic per-instance throttling allows 3 enquiries per email, 10 per IP, and 100 overall per hour. These counters reset on a cold start and are not shared across Vercel instances; configure a Vercel Firewall rate-limit rule for `/api/contact` for deployment-wide protection. Supabase separately limits admin inbox inserts to 3 per email and 200 overall per hour.
