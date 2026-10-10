# Silicon Motives: website + Content Studio (admin)

Company website for Silicon Motives (Kochi, Kerala) with a small admin for editing site content.
Plain HTML/CSS/JS, **zero npm dependencies, no build step**. Node 22+. Hosted on Vercel (static `dist/` plus `/api` functions). Data, auth and image storage are in Supabase.

Git repo root is this folder. Remote: `github.com/jsurya114/SiliconMotives`, branch `main`.

## Commands

- `npm run dev`: serves http://127.0.0.1:3000, admin at `/admin`. Loads `.env.local` if it exists.
- `npm run check`: syntax-checks every JS file.
- `npm test`: runs `tests/*.test.mjs` with `node --test` (the folder is empty today).
- `npm run sync`: copies the root into the nested `silicon-motives/` mirror (see gap 3).

## Layout

| Path | Role |
| --- | --- |
| `dist/index.html`, `styles.css`, `script.js` | Public one-page site. Demo content for every section is baked into the HTML. |
| `dist/content-model.js` | Single source of truth: `CONTENT_TYPES`, `validateContent`, `safeUrl`. Imported by the admin UI, the public renderer **and** the server. |
| `dist/public-content.js` | Public page fetches `GET /api/content` and re-renders Portfolio, Clients, Testimonials and FAQ from published rows. |
| `dist/admin/index.html`, `admin.css`, `admin.js` | Content Studio: login, sidebar per content kind, list with search/status filter/counts, `<dialog>` editor generated from `CONTENT_TYPES[kind].fields`, delete confirmation. |
| `api/auth.js` | `GET` session status, `POST` sign in, `DELETE` sign out. |
| `api/content.js` | `GET` published rows (public); `GET ?scope=admin` all rows; `POST` create; `PATCH`/`DELETE ?id=` update/remove. |
| `api/upload.js` | `POST {type, base64}` stores an image in the `site-media` bucket and returns its public URL. |
| `lib/cms.mjs` | Server helpers: `supabase()` REST wrapper, `requireAdmin`, `sameOrigin`, `sessionCookie`, `body`, `imageUpload`, `HttpError`. |
| `server.mjs` | Local dev server only. On Vercel, `api/*.js` run as functions and `vercel.json` supplies the `/admin` rewrite and admin CSP. |
| `supabase/schema.sql` | Run once in the Supabase SQL editor: `site_admins`, `site_content`, RLS policies, `updated_at` trigger, `site-media` bucket. |
| `silicon-motives/` (nested) | Older deployment mirror. Stale: no admin, no API. |

## How it works

**Sign in.** Browser posts email and password to `/api/auth`. The server exchanges them at Supabase `/auth/v1/token`, confirms the user has a row in `site_admins`, then sets the `sm_admin` cookie (HttpOnly, SameSite=Strict, `Path=/api`, at most 1 hour) holding the Supabase access token.

**Every admin call.** Cookie token, then `/auth/v1/user`, then a `site_admins` lookup, then the request is forwarded to PostgREST **as that user**, so RLS is the real authority. There is no service-role key anywhere; only `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.

**Content.** One table, `site_content`: `kind` (`projects` | `clients` | `testimonials` | `faqs`), `title`, `data` jsonb (the per-kind fields), `published`, `sort_order`, timestamps. Edits and deletes send the row's `updated_at`; if it no longer matches, the API returns 409 so two sessions cannot overwrite each other.

**Public page.** Any non-200 from `/api/content` leaves the static HTML untouched, so the site works with no database.

## Rules to keep

- Stay dependency-free vanilla ES modules. No framework, bundler or build step.
- Never introduce a service-role key. Writes go through the signed-in user's token and RLS.
- Every mutating route calls `sameOrigin(req)` first.
- Build DOM with `createElement`/`textContent`, never `innerHTML`. The admin CSP is `script-src 'self'; style-src 'self'`, so no inline `<script>`, `<style>` or `style=""`.
- URLs shown or stored must pass `safeUrl` (https only).
- Adding a content kind touches four places: `CONTENT_TYPES` in `dist/content-model.js`, the `kind` check constraint in `supabase/schema.sql` (plus an `alter table` for a database that already exists), a nav button in `dist/admin/index.html`, and a renderer in `dist/public-content.js`.
- Match the existing code style: dense, few comments, small helpers (`el`, `$`, `api`).

## State on 2026-10-10

- **All admin work is uncommitted.** `main` equals `origin/main` at `607ec30`. Modified: `.gitignore`, `dist/index.html`, `dist/styles.css`, `package.json`, `server.mjs`, `vercel.json`. Untracked: `api/`, `lib/`, `scripts/`, `supabase/`, `dist/admin/`, `dist/content-model.js`, `dist/public-content.js`, `.env.example`.
- **Checked locally with no database:** `/` and `/admin` return 200; `/api/auth` returns `{configured:false}`; public `/api/content` returns 503 and the page keeps its static content; admin routes return 401 without a cookie; a wrong `Origin` returns 403; `npm run check` passes.
- **Never run against Supabase.** There is no `.env.local`. Sign-in, create/edit/delete, image upload and the public page rendering real rows are untested end to end.
- **Not deployed** with the admin.

## Known gaps

1. `ADMIN-SETUP.md` does not exist, but the admin's "ready to connect" notice, the 503 message in `lib/cms.mjs` and the copy list in `scripts/sync.mjs` all point to it. `npm run sync` will error on that entry.
2. `tests/` is empty.
3. The nested mirror is stale, and it is unknown which folder Vercel uses as Root Directory (commit `be75254` added a `vercel.json` to both). If Vercel builds the nested folder, the admin will not deploy until it is synced. Check the Vercel project settings before deploying.
4. Once the database is connected, `public-content.js` replaces all four sections even when a kind has zero published rows. The built-in portfolio concepts, FAQs and so on disappear and "on the way" placeholders show instead. Either publish real content before connecting production, or change the renderer to keep the static section when a kind is empty.
5. Sessions last one hour with no refresh. On expiry the editor asks the user to sign in from another tab.
6. The earlier Next.js version of this site (removed in `d6bc1a3`) also had a `public.site_content` table with a different shape. Running `schema.sql` in that old Supabase project will fail. Use a new project or drop the old table first.
7. Uploaded images are never deleted from storage (noted in `schema.sql`).
8. Hero, services, founders and contact details are hardcoded in `dist/index.html` and cannot be edited in the admin. The public "project brief" form only downloads a `.txt`; nothing reaches the admin.

For scope ideas, the removed Next.js admin had hero, services, team, SEO, settings, case studies and a submissions inbox. Read it with `git show 'd6bc1a3^:app/admin/<path>'`.

## Next steps, in order

1. Write `ADMIN-SETUP.md`: create the Supabase project, run `supabase/schema.sql`, create a confirmed user, insert it into `site_admins`, set the two env vars locally and in Vercel.
2. Ask the owner for a Supabase project (URL and publishable key in `.env.local`), then test end to end: sign in, create/edit/publish/delete in each kind, upload an image, trigger a 409 from two tabs, check the public page.
3. Fix what that turns up and settle the empty-section behaviour (gap 4).
4. Add tests for `validateContent`, `safeUrl`, `imageUpload`, `sameOrigin`, `sessionCookie`, and the three handlers with `fetch` stubbed.
5. Settle the mirror and Vercel Root Directory (gap 3), commit, set env vars in Vercel, deploy, confirm `/admin` in production. Ask before committing, pushing or deploying.
6. Then extend: more content kinds (services, team), editable site settings and contact details, contact form to a submissions inbox, session refresh.
