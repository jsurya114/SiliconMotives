-- SiliconMotives — initial Supabase schema
-- Replaces the Express/MongoDB backend. Security model:
--   * Public (anon) visitors can only READ published content.
--   * Public form submissions (contact, testimonials) go through Next.js API
--     routes that use the service-role key, so anon has no INSERT rights.
--   * Admins are Supabase Auth users listed in public.admin_users.

-- ── Helpers ──────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '' check (char_length(name) <= 100),
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so RLS policies can check admin status without
-- granting anyone read access to admin_users itself.
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

-- ── Singleton: site content (hero, fun fact, about, contact info, footer) ─
create table public.site_content (
  id smallint primary key default 1 check (id = 1),
  hero jsonb not null default jsonb_build_object(
    'headline', 'World-class software.',
    'highlightedText', 'Zero overhead.',
    'subheading', 'Remote-first web design and web app development from Kochi, Kerala.',
    'ctaText', 'Start your project',
    'backgroundImage', null
  ),
  fun_fact jsonb not null default jsonb_build_object(
    'title', 'Our fun fact', 'description', '', 'stats', '[]'::jsonb
  ),
  about jsonb not null default jsonb_build_object(
    'eyebrow', 'About Us',
    'headline', 'Rooted in Kochi. Working worldwide.',
    'paragraphs', '[]'::jsonb,
    'founders', jsonb_build_array(
      jsonb_build_object('name', 'Jasil M', 'title', 'Founder', 'initials', 'JM'),
      jsonb_build_object('name', 'Jayasoorya S', 'title', 'Co-founder', 'initials', 'JS')
    ),
    'stats', '[]'::jsonb
  ),
  contact_info jsonb not null default jsonb_build_object(
    'phone', '', 'email', '', 'whatsappNumber', '', 'whatsappMessage', '',
    'address', jsonb_build_object('line1', '', 'line2', 'Kochi, Kerala', 'line3', 'India'),
    'businessHours', jsonb_build_object('weekday', '', 'saturday', '')
  ),
  footer jsonb not null default jsonb_build_object(
    'tagline', 'Engineering value. Not overhead.',
    'socialLinks', jsonb_build_object('facebook', '', 'instagram', '', 'linkedin', '', 'twitter', '')
  ),
  updated_at timestamptz not null default now()
);
insert into public.site_content (id) values (1);

-- ── Singleton: SEO settings ──────────────────────────────────────────────
create table public.seo_settings (
  id smallint primary key default 1 check (id = 1),
  title_template text not null default '%s | SiliconMotives',
  default_title text not null default 'Web Design & Web App Development in Kochi, Kerala | SiliconMotives',
  default_description text not null default 'SiliconMotives is a remote-first web design and web application development company based in Kochi, Kerala, India.',
  default_keywords text not null default 'web design Kochi, web app development Kerala',
  site_name text not null default 'SiliconMotives',
  canonical_url text not null default '',
  google_site_verification text not null default '',
  og_image text not null default '/opengraph-image',
  updated_at timestamptz not null default now()
);
insert into public.seo_settings (id) values (1);

-- ── Services ─────────────────────────────────────────────────────────────
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  description text not null default '' check (char_length(description) <= 500),
  image text,
  icon text not null default 'Monitor',
  features text[] not null default '{}',
  alt text not null default '' check (char_length(alt) <= 200),
  href text not null default '#contact',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index services_order_idx on public.services (sort_order, created_at);

-- ── Portfolio ────────────────────────────────────────────────────────────
create table public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 150),
  client_name text not null default '' check (char_length(client_name) <= 150),
  category text not null check (char_length(category) between 1 and 100),
  description text not null default '' check (char_length(description) <= 500),
  image text,
  link text not null default '',
  alt text not null default '' check (char_length(alt) <= 200),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index portfolio_order_idx on public.portfolio (sort_order, created_at);

-- ── Testimonials ─────────────────────────────────────────────────────────
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  role text not null check (char_length(role) between 2 and 150),
  quote text not null check (char_length(quote) between 10 and 1000),
  rating smallint not null default 5 check (rating between 1 and 5),
  initials text not null default '' check (char_length(initials) <= 3),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index testimonials_status_idx on public.testimonials (status, created_at desc);
create index testimonials_ip_idx on public.testimonials (ip_hash, created_at desc);

create or replace function public.testimonials_initials()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if coalesce(new.initials, '') = '' then
    new.initials = upper(
      left(split_part(trim(new.name), ' ', 1), 1) ||
      left(split_part(trim(new.name), ' ', 2), 1)
    );
  end if;
  return new;
end;
$$;

-- ── Contact submissions ──────────────────────────────────────────────────
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text not null default '' check (char_length(phone) <= 20),
  service text not null default '' check (char_length(service) <= 50),
  message text not null check (char_length(message) between 10 and 2000),
  is_read boolean not null default false,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index contact_unread_idx on public.contact_submissions (is_read, created_at desc);
create index contact_ip_idx on public.contact_submissions (ip_hash, created_at desc);

-- ── Triggers ─────────────────────────────────────────────────────────────
create trigger site_content_updated before update on public.site_content
  for each row execute function public.set_updated_at();
create trigger seo_settings_updated before update on public.seo_settings
  for each row execute function public.set_updated_at();
create trigger services_updated before update on public.services
  for each row execute function public.set_updated_at();
create trigger portfolio_updated before update on public.portfolio
  for each row execute function public.set_updated_at();
create trigger testimonials_updated before update on public.testimonials
  for each row execute function public.set_updated_at();
create trigger testimonials_set_initials before insert or update of name, initials on public.testimonials
  for each row execute function public.testimonials_initials();

-- ── Row-level security ───────────────────────────────────────────────────
alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
alter table public.seo_settings enable row level security;
alter table public.services enable row level security;
alter table public.portfolio enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_submissions enable row level security;

-- admin_users: an admin can see the admin list; nobody manages it via the API
-- (add admins in the dashboard / SQL editor).
create policy "admins read admin list" on public.admin_users
  for select to authenticated using ((select public.is_admin()));

-- Public read of published content
create policy "public read site content" on public.site_content
  for select to anon, authenticated using (true);
create policy "public read seo" on public.seo_settings
  for select to anon, authenticated using (true);
create policy "public read active services" on public.services
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "public read active portfolio" on public.portfolio
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "public read approved testimonials" on public.testimonials
  for select to anon, authenticated using (status = 'approved' or (select public.is_admin()));

-- Admin writes
create policy "admins update site content" on public.site_content
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins update seo" on public.seo_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins insert services" on public.services
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins update services" on public.services
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete services" on public.services
  for delete to authenticated using ((select public.is_admin()));

create policy "admins insert portfolio" on public.portfolio
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins update portfolio" on public.portfolio
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete portfolio" on public.portfolio
  for delete to authenticated using ((select public.is_admin()));

create policy "admins insert testimonials" on public.testimonials
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins update testimonials" on public.testimonials
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete testimonials" on public.testimonials
  for delete to authenticated using ((select public.is_admin()));

create policy "admins read contact submissions" on public.contact_submissions
  for select to authenticated using ((select public.is_admin()));
create policy "admins update contact submissions" on public.contact_submissions
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete contact submissions" on public.contact_submissions
  for delete to authenticated using ((select public.is_admin()));

-- Column privileges: never expose visitor IP hashes through the public API.
-- (A column-level REVOKE is ineffective while a table-level grant exists, so
-- revoke the table and grant back only the safe columns.)
revoke select on public.testimonials from anon;
grant select (id, name, role, quote, rating, initials, status, reviewed_at, created_at, updated_at)
  on public.testimonials to anon;

-- ── Storage: public "media" bucket for site images ───────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));
