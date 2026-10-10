# Silicon Motives

Responsive company website for Silicon Motives, Kochi, Kerala, with an admin panel for managing its content.

## Run locally

Requires Node.js. No dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:3000 for the site and http://127.0.0.1:3000/admin for the admin panel. The deployable static site is in `dist/`. From the repository root, run `npm run sync` after content or design changes to update the visible `silicon-motives/` project copy.

## Project layout

- `dist/index.html`: page sections and the built-in copy
- `dist/styles.css`: typography, colors, and responsive layouts
- `dist/script.js`: navigation, scroll reveals, and the project brief form
- `dist/content.js`: loads published content from Supabase and renders it into the page
- `dist/config.js`: Supabase project URL and anon key (shared by the site and the admin)
- `dist/admin/`: the admin panel (`/admin/`)
- `supabase/migrations/`: database tables, security policies, media storage, and starting content

Until `dist/config.js` is filled in, the site shows the copy written in `index.html`, and the brief form downloads a text file instead of sending it.

## Admin panel

Signed-in admins can:

- **Submissions**: read project briefs sent from the contact form, mark them read, replied, or archived, reply by email, delete them, and export them to CSV
- **Services, Team, Portfolio, Clients, Testimonials, FAQs**: add, edit, reorder, publish or hide, and delete entries, with image uploads where relevant
- **Contact & settings**: set the contact email, phone, WhatsApp, LinkedIn, and Instagram shown on the site, and turn the brief form on or off

Changes appear on the site as soon as they are saved. A section keeps its built-in copy until it has at least one published entry, so the client logos, testimonials, and portfolio placeholders stay until real ones are published.

## Setting up Supabase (one time)

1. Create a project at https://supabase.com.
2. Run the migration: either paste `supabase/migrations/20261010120000_admin_cms.sql` into **SQL Editor** and run it, or use the Supabase CLI (`supabase link` then `supabase db push`). This creates the tables, row-level security, the `media` storage bucket, and the current services, team, and FAQ copy.
3. In **Project Settings → API**, copy the project URL and the anon (publishable) key into `dist/config.js`. Both are safe to publish. Never use the service-role (secret) key in this file.
4. Create the admin login: **Authentication → Users → Add user**, with an email and a strong password (tick "Auto Confirm User").
5. Grant that user admin access in **SQL Editor**:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

6. In **Authentication → URL Configuration**, set the Site URL to your live domain and add `https://your-domain/admin/` (and `http://127.0.0.1:3000/admin` for local use) to the redirect URLs so password reset links work.
7. Recommended: in **Authentication → Providers → Email**, turn off "Allow new users to sign up". New accounts get no admin access either way, but this keeps the user list clean.

To add another admin later, repeat steps 4 and 5. To remove one, delete the row from `public.admin_users` or delete the user.

## Security

- The database enforces access through row-level security, not the browser. Visitors can read published content and settings, and can only send name, email, and message to `contact_submissions`. They cannot read submissions or change anything.
- Only users listed in `admin_users` can see hidden entries, edit content, read submissions, or upload media.
- Links and image URLs must be `http(s)`, and all content is escaped when rendered.
- The brief form is limited to 3 briefs per email address per hour and 200 per hour overall, and has a hidden field that catches simple bots.
