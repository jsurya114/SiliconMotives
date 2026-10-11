# Silicon Motives

Responsive company website for Silicon Motives, Kochi, Kerala, with an admin panel for managing its content.

## Run locally

Requires Node.js 22 or newer. Copy `.env.example` to `.env`. Set the Supabase values for editable content and the SMTP values below for email delivery.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000 for the site and http://127.0.0.1:3000/admin for the admin panel. Restart the server after changing `.env`. From the repository root, run `npm run sync` after content or design changes to update the visible `silicon-motives/` project copy. Each copy uses its own ignored `.env`; sync never copies credentials.

## Deploy

Vercel installs dependencies with `npm ci`, builds the static site into `build/`, and deploys `api/contact.js` as a Node.js function. Set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SMTP_USER`, and `SMTP_PASS` in the Vercel project environment variables and redeploy. Deploy the repository, not just the `build/` directory: a static-only host cannot run the email endpoint. The build creates public browser configuration without editing tracked source in `dist/`.

`.env` and `build/` are Git-ignored. Only empty placeholders are committed. The URL and publishable key remain visible in the browser by design; database access is enforced by Supabase row-level security. Never use a secret or service-role key for `SUPABASE_PUBLISHABLE_KEY`.

## Email delivery

The **Tell us about your idea** form posts to `/api/contact`. Nodemailer sends to `siliconmotives@gmail.com`, with the visitor’s address in Reply-To. The sender and recipient are controlled on the server. Separate WhatsApp chat links remain available, but the form never redirects there.

1. Enable Google 2-Step Verification on the sending Gmail account and create an [App Password](https://myaccount.google.com/apppasswords). See [Nodemailer’s Gmail guide](https://nodemailer.com/guides/using-gmail).
2. In Vercel → Project → Settings → Environment Variables, set `SMTP_USER=siliconmotives@gmail.com` and `SMTP_PASS` to that App Password for Production (and Preview if preview emails are wanted). Do not use your regular Gmail password or put credentials in source files, browser configuration, or chat.
3. Redeploy after saving the variables. For local development, put them in the ignored `.env` file and restart `npm run dev`.
4. Submit a test idea from the deployed site and verify it arrives in the company inbox. A successful response means Gmail accepted the message; it does not guarantee inbox placement.

If Supabase is configured and **Save website enquiries in the admin inbox** is enabled, the server also saves a copy. Email delivery does not depend on that setting. A failed inbox copy is logged without visitor data and does not cause an already-sent email to be reported as failed. Gmail has sending limits; use a transactional email provider if enquiry volume outgrows it.

Run `npm test`, `npm run check`, and `npm run build` before deployment. Automated tests mock external delivery and include real Nodemailer message generation without sending email; they do not verify Gmail credentials.

## Project layout

- `dist/index.html`: page sections and the built-in copy
- `dist/styles.css`: typography, colors, and responsive layouts
- `dist/script.js`: navigation, scroll reveals, and the idea form
- `api/contact.js` and `lib/contact.mjs`: server-side Nodemailer delivery and optional admin inbox copies
- `tests/`: email handler and form tests
- `dist/content.js`: loads published content from Supabase and renders it into the page
- `dist/config.js`: empty fallback; the dev server and build generate configuration from environment variables
- `.env.example`: names of the required environment variables, without values
- `dist/admin/`: the admin panel (`/admin/`)
- `supabase/migrations/`: database tables, security policies, media storage, and starting content

Without Supabase configuration, the site uses the content in `index.html`. Email works independently of Supabase. Without SMTP credentials, the form retains the visitor’s input and shows a direct email address; it does not claim success or open WhatsApp.

## Admin panel

Signed-in admins can:

- **Submissions**: read project briefs sent from the contact form, mark them read, replied, or archived, reply by email, delete them, and export them to CSV
- **Services, Team, Portfolio, Clients, Testimonials, FAQs**: add, edit, reorder, publish or hide, and delete entries, with image uploads where relevant
- **Contact & settings**: set the contact email, phone, WhatsApp, LinkedIn, and Instagram shown on the site, and enable or disable admin inbox copies of emailed enquiries

Changes appear on the site as soon as they are saved. The client and testimonial sections keep their preview content until you publish real entries; the portfolio starts with the Woobe case study.

## Setting up Supabase (one time)

1. Create a project at https://supabase.com.
2. Run the migrations in `supabase/migrations/` in timestamp order: either paste each SQL file into **SQL Editor** and run it, or use the Supabase CLI (`supabase link` then `supabase db push`). The migrations create the CMS, starter content, and the published Woobe, NasaLogistic, Picbox, Uniwayin, and Dental Buddy portfolio projects. Existing published projects are kept as unpublished drafts when Woobe is added. For an existing installation with the earlier migrations applied, run `20261012150000_feature_dental_buddy_portfolio.sql` to add Dental Buddy to the admin and live CMS portfolio. Deploying the website does not run database migrations. Run `20261012160000_founder_portraits.sql` to save the bundled founder portraits in the Team editor and allow local photo paths. The public site also uses these portraits for Jasil M and Jayasoorya S when their photo fields are empty.
3. Copy the project URL and publishable (or legacy anon) key from the project's **Connect** dialog into `.env` as `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. Set the same variables on your hosting provider. Never use the service-role or secret key.
4. Create the admin login: **Authentication → Users → Add user**, with an email and a strong password (tick "Auto Confirm User").
5. Grant that user admin access in **SQL Editor**:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

6. In **Authentication → URL Configuration**, set the Site URL to your live domain and add `https://your-domain/admin/` (and `http://127.0.0.1:3000/admin` for local use) to the redirect URLs so password reset links work.
7. Recommended: in **Authentication → Providers → Email**, turn off "Allow new users to sign up". New accounts get no admin access either way, but this keeps the user list clean.

To add another admin later, repeat steps 4 and 5. To remove one, delete the row from `public.admin_users` or delete the user.

### Seed an admin locally

After running the database migration, add `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SEED_EMAIL`, and `ADMIN_SEED_PASSWORD` to your ignored `.env`, then run `npm run seed:admin`. Use the legacy `service_role` key for this command. It creates an email-confirmed account (or updates the matching account's password), grants admin membership, and verifies the membership. The command is never run by the build. Remove the service-role key and seed password from `.env` after seeding. These values are never included in browser configuration.

## Security

- The database enforces access through row-level security, not the browser. Visitors can read published content and settings, and can only send name, email, and message to `contact_submissions`. They cannot read submissions or change anything.
- Only users listed in `admin_users` can see hidden entries, edit content, read submissions, or upload media.
- Links and image URLs must be `http(s)`, and all content is escaped when rendered.
- The email endpoint validates input, accepts same-origin JSON requests, discards honeypot submissions, fixes the recipient server-side, and keeps credentials out of the browser. Basic per-instance throttling allows 3 enquiries per email, 10 per IP, and 100 overall per hour. These counters reset on a cold start and are not shared across Vercel instances; configure a Vercel Firewall rate-limit rule for `/api/contact` for deployment-wide protection. Supabase separately limits admin inbox inserts to 3 per email and 200 overall per hour.
