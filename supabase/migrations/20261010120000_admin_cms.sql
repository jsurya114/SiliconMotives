-- Silicon Motives — content and admin schema for the static site.
--
-- Security model
--   * Visitors (anon) can read published content and site settings, and can
--     only INSERT name/email/message into contact_submissions.
--   * Admins are Supabase Auth users listed in public.admin_users. Everything
--     else (writes, unpublished rows, submissions, media uploads) requires
--     public.is_admin().
--   * Signing up does not grant access: a new Auth user sees only what a
--     visitor sees until someone adds them to admin_users.

create extension if not exists pgcrypto;

-- ── Admins ────────────────────────────────────────────────────────────────
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- No policies: the table is only readable through is_admin().
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- URLs shown on the public site must be http(s) so a stored value can never
-- become a javascript: link.
create or replace function public.is_web_url(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value is null or value = '' or value ~* '^https?://[^\s]+$';
$$;

-- ── Site settings (single row) ────────────────────────────────────────────
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  contact_email text not null default '' check (char_length(contact_email) <= 254),
  contact_phone text not null default '' check (char_length(contact_phone) <= 40),
  whatsapp_number text not null default '' check (whatsapp_number ~ '^[0-9]{0,20}$'),
  linkedin_url text not null default '' check (public.is_web_url(linkedin_url)),
  instagram_url text not null default '' check (public.is_web_url(instagram_url)),
  accepting_briefs boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

-- ── Content collections ───────────────────────────────────────────────────
create table public.services (
  id uuid primary key default gen_random_uuid(),
  kicker text not null default '' check (char_length(kicker) <= 40),
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '' check (char_length(description) <= 400),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  role text not null default '' check (char_length(role) <= 80),
  kicker text not null default '' check (char_length(kicker) <= 40),
  photo_url text not null default '' check (public.is_web_url(photo_url)),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  category text not null default '' check (char_length(category) <= 60),
  description text not null default '' check (char_length(description) <= 500),
  tags text[] not null default '{}' check (cardinality(tags) <= 8),
  image_url text not null default '' check (public.is_web_url(image_url)),
  image_alt text not null default '' check (char_length(image_alt) <= 200),
  project_url text not null default '' check (public.is_web_url(project_url)),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  logo_url text not null default '' check (public.is_web_url(logo_url)),
  website_url text not null default '' check (public.is_web_url(website_url)),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null check (char_length(quote) between 1 and 800),
  author_name text not null check (char_length(author_name) between 1 and 80),
  author_role text not null default '' check (char_length(author_role) <= 80),
  company text not null default '' check (char_length(company) <= 80),
  avatar_url text not null default '' check (public.is_web_url(avatar_url)),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 200),
  answer text not null check (char_length(answer) between 1 and 1500),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Shared triggers, RLS and grants for every content table.
do $$
declare
  t text;
begin
  foreach t in array array['site_settings', 'services', 'team_members', 'projects', 'clients', 'testimonials', 'faqs']
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('create policy "Admins manage %s" on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t, t);
  end loop;

  foreach t in array array['services', 'team_members', 'projects', 'clients', 'testimonials', 'faqs']
  loop
    execute format('create policy "Published %s are public" on public.%I for select to anon, authenticated using (published)', t, t);
    execute format('create index %I on public.%I (sort_order, created_at)', t || '_order_idx', t);
  end loop;
end;
$$;

create policy "Site settings are public" on public.site_settings
  for select to anon, authenticated using (true);

-- Settings is a single row: it can be edited but never added or removed.
revoke insert, delete on public.site_settings from authenticated;

-- ── Contact submissions ───────────────────────────────────────────────────
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index contact_submissions_created_idx on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;
revoke all on public.contact_submissions from anon, authenticated;
-- Visitors can only supply these three columns; status and created_at keep
-- their defaults.
grant insert (name, email, message) on public.contact_submissions to anon, authenticated;
grant select, update (status), delete on public.contact_submissions to authenticated;

create policy "Anyone can send a brief" on public.contact_submissions
  for insert to anon, authenticated
  with check (
    status = 'new'
    and (select accepting_briefs from public.site_settings where id = 1)
  );

create policy "Admins read submissions" on public.contact_submissions
  for select to authenticated using ((select public.is_admin()));

create policy "Admins update submissions" on public.contact_submissions
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins delete submissions" on public.contact_submissions
  for delete to authenticated using ((select public.is_admin()));

-- Basic abuse protection for the public form: at most 3 briefs per email
-- address per hour and 200 overall per hour. Runs as definer because
-- visitors cannot read the table.
create or replace function public.limit_contact_submissions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.contact_submissions
      where lower(email) = lower(new.email) and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Too many briefs from this email address. Please try again later.'
      using errcode = 'P0001';
  end if;
  if (select count(*) from public.contact_submissions
      where created_at > now() - interval '1 hour') >= 200 then
    raise exception 'We are receiving too many briefs right now. Please try again later.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke all on function public.limit_contact_submissions() from public;

create trigger limit_contact_submissions
  before insert on public.contact_submissions
  for each row execute function public.limit_contact_submissions();

-- ── Media storage ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "Admins upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admins update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admins delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

-- ── Starting content (matches the copy currently on the site) ─────────────
insert into public.services (kicker, title, description, sort_order) values
  ('PRODUCT BUILD', 'Web & product development', 'Thoughtful websites and web applications that turn a business need into a useful, intuitive product.', 1),
  ('BUILT AROUND YOU', 'Custom software', 'Software shaped around your workflows, from internal tools to the systems that keep your business moving.', 2),
  ('CLOUD FOUNDATION', 'Cloud & infrastructure', 'A considered foundation for your software, with dependable deployments and room to evolve.', 3),
  ('AFTER LAUNCH', 'Ongoing engineering', 'Keep improving after launch. Resolve issues, refine performance, and build the next useful feature.', 4);

insert into public.team_members (name, role, kicker, sort_order) values
  ('Jasil M', 'Co-founder', 'FOUNDER 01', 1),
  ('Jayasoorya S', 'Co-founder', 'FOUNDER 02', 2);

insert into public.faqs (question, answer, sort_order) values
  ('How does working with a remote team work?', 'We agree on communication channels, review points, and a working rhythm at the beginning. Written updates, shared documentation, and scheduled conversations help keep decisions and progress clear.', 1),
  ('Can you help with an existing product?', 'Yes. We can start by understanding the existing software, its constraints, and your priorities, then agree on a focused plan for fixes, improvements, or new features.', 2),
  ('How do you estimate cost and timelines?', 'We first need to understand your requirements and the current state of the project. From there, we can define the scope, discuss tradeoffs, and agree on an estimate before work begins.', 3),
  ('Where is Silicon Motives based?', 'We are based in Kochi, Kerala, India, and work remotely. Our working arrangements and meeting times can be discussed around the needs of each project.', 4),
  ('What should I have ready for a first conversation?', 'A short description of your idea or challenge is a great start. If you have a timeline, budget range, or existing product, those details help us understand what a useful next step looks like.', 5);
