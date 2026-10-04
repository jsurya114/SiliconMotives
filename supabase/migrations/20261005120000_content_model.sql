-- SiliconMotives — structured content model
-- Projects, case studies, clients, team, FAQs, richer testimonials and
-- homepage settings, all managed from /admin.
--
-- Visibility rules (enforced by RLS, not just the UI):
--   * Public visitors only ever read rows that are published (projects,
--     case studies, team, FAQs, services), approved (testimonials) or
--     explicitly cleared for public display (clients).
--   * Only admins (public.admin_users) can create, edit or delete.

-- ── Shared helpers ───────────────────────────────────────────────────────
create or replace function public.is_slug(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(value) <= 80;
$$;

create or replace function public.is_http_url(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value = '' or value ~* '^https?://[^\s]+$';
$$;

-- Architecture diagrams are a controlled list of components, not free-form
-- drawings. Each item: { type, label, detail?, group, multiple? }.
create or replace function public.is_valid_architecture(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  item jsonb;
begin
  if jsonb_typeof(value) <> 'array' or jsonb_array_length(value) > 20 then
    return false;
  end if;
  for item in select * from jsonb_array_elements(value) loop
    if jsonb_typeof(item) <> 'object'
      or not (item->>'type' = any (array[
        'users', 'dns', 'cdn', 'alb', 'autoscaling', 'ec2', 'ecs', 'api',
        'app', 'database', 'cache', 'queue', 'storage', 'cicd', 'monitoring', 'backup'
      ]))
      or coalesce(char_length(item->>'label'), 0) not between 1 and 80
      or coalesce(char_length(item->>'detail'), 0) > 160
      or not (coalesce(item->>'group', 'flow') = any (array['flow', 'data', 'ops']))
    then
      return false;
    end if;
  end loop;
  return true;
end;
$$;

create or replace function public.is_valid_metrics(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  item jsonb;
begin
  if jsonb_typeof(value) <> 'array' or jsonb_array_length(value) > 8 then
    return false;
  end if;
  for item in select * from jsonb_array_elements(value) loop
    if coalesce(char_length(item->>'value'), 0) not between 1 and 30
      or coalesce(char_length(item->>'label'), 0) not between 1 and 80 then
      return false;
    end if;
  end loop;
  return true;
end;
$$;

-- ── Clients ──────────────────────────────────────────────────────────────
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 150),
  logo text,
  website text not null default '' check (public.is_http_url(website)),
  industry text not null default '' check (char_length(industry) <= 80),
  description text not null default '' check (char_length(description) <= 300),
  is_public boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on column public.clients.is_public is
  'Permission to display this client publicly. Hidden clients never appear on the site.';
create index clients_order_idx on public.clients (sort_order, name);

-- ── Projects (evolves the existing portfolio table, keeping its data) ────
alter table public.portfolio rename to projects;
alter index public.portfolio_order_idx rename to projects_order_idx;
alter trigger portfolio_updated on public.projects rename to projects_updated;
alter table public.projects rename column image to cover_image;
alter table public.projects rename column link to url;
alter table public.projects rename column description to summary;
alter table public.projects rename column is_active to published;

alter table public.projects
  add column slug text,
  add column description text not null default '' check (char_length(description) <= 5000),
  add column client_id uuid references public.clients (id) on delete set null,
  add column gallery text[] not null default '{}',
  add column tech_stack text[] not null default '{}',
  add column services text[] not null default '{}',
  add column project_type text not null default '' check (char_length(project_type) <= 80),
  add column featured boolean not null default false,
  add column confidential boolean not null default false,
  add column start_date date,
  add column end_date date,
  add column seo_title text not null default '' check (char_length(seo_title) <= 70),
  add column seo_description text not null default '' check (char_length(seo_description) <= 200),
  add column og_image text;

-- Give migrated rows unique slugs derived from their titles.
update public.projects p
set slug = left(
  trim(both '-' from regexp_replace(lower(p.title), '[^a-z0-9]+', '-', 'g')),
  70
) || '-' || left(p.id::text, 6)
where slug is null;

alter table public.projects
  alter column slug set not null,
  add constraint projects_slug_key unique (slug),
  add constraint projects_slug_format check (public.is_slug(slug)),
  add constraint projects_url_format check (public.is_http_url(url)),
  add constraint projects_dates check (end_date is null or start_date is null or end_date >= start_date);
alter table public.projects alter column published set default false;
create index projects_featured_idx on public.projects (featured, sort_order) where published;

-- ── Case studies ─────────────────────────────────────────────────────────
create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (public.is_slug(slug)),
  title text not null check (char_length(title) between 1 and 150),
  project_id uuid references public.projects (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  anonymized boolean not null default true,
  headline text not null default '' check (char_length(headline) <= 160),
  summary text not null default '' check (char_length(summary) <= 600),
  challenge text not null default '' check (char_length(challenge) <= 3000),
  solution text not null default '' check (char_length(solution) <= 5000),
  outcome text not null default '' check (char_length(outcome) <= 3000),
  responsibilities text[] not null default '{}',
  technologies text[] not null default '{}',
  metrics jsonb not null default '[]' check (public.is_valid_metrics(metrics)),
  architecture jsonb not null default '[]' check (public.is_valid_architecture(architecture)),
  cover_image text,
  gallery text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  seo_title text not null default '' check (char_length(seo_title) <= 70),
  seo_description text not null default '' check (char_length(seo_description) <= 200),
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on column public.case_studies.anonymized is
  'When true the client is never named on the site; the title is used instead.';
create index case_studies_featured_idx on public.case_studies (featured, sort_order) where published;

-- ── Team ─────────────────────────────────────────────────────────────────
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  initials text not null default '' check (char_length(initials) <= 3),
  role text not null default '' check (char_length(role) <= 80),
  focus text not null default '' check (char_length(focus) <= 160),
  linkedin text not null default '' check (public.is_http_url(linkedin)),
  photo text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── FAQs ─────────────────────────────────────────────────────────────────
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  topic text not null default '' check (char_length(topic) <= 40),
  question text not null check (char_length(question) between 5 and 200),
  short_answer text not null default '' check (char_length(short_answer) <= 200),
  answer text not null check (char_length(answer) between 5 and 1500),
  link_label text not null default '' check (char_length(link_label) <= 40),
  link_href text not null default '' check (link_href = '' or link_href ~ '^(/|#|https?://)'),
  show_on_home boolean not null default true,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Testimonials: richer attribution, featuring and ordering ─────────────
alter table public.testimonials
  add column company text not null default '' check (char_length(company) <= 150),
  add column company_logo text,
  add column profile_url text not null default '' check (public.is_http_url(profile_url)),
  add column project_id uuid references public.projects (id) on delete set null,
  add column featured boolean not null default false,
  add column sort_order integer not null default 0;

-- Column grants: ip_hash stays hidden (see 20261004130000_harden_privileges).
grant select (company, company_logo, profile_url, project_id, featured, sort_order)
  on public.testimonials to anon, authenticated;

-- ── Services: tool tags and consistent "published" naming ────────────────
alter table public.services rename column is_active to published;
alter table public.services add column tools text[] not null default '{}';

-- ── Homepage settings (hero, proof strip, contact details) ───────────────
alter table public.site_content add column home jsonb not null default '{}'
  check (jsonb_typeof(home) = 'object');
comment on column public.site_content.hero is 'Deprecated: superseded by site_content.home.';
comment on column public.site_content.fun_fact is 'Deprecated: no longer shown on the site.';
comment on column public.site_content.about is 'Deprecated: superseded by team_members.';

-- ── Triggers ─────────────────────────────────────────────────────────────
create trigger clients_updated before update on public.clients
  for each row execute function public.set_updated_at();
create trigger case_studies_updated before update on public.case_studies
  for each row execute function public.set_updated_at();
create trigger team_members_updated before update on public.team_members
  for each row execute function public.set_updated_at();
create trigger faqs_updated before update on public.faqs
  for each row execute function public.set_updated_at();

-- ── Row-level security ───────────────────────────────────────────────────
alter table public.clients enable row level security;
alter table public.case_studies enable row level security;
alter table public.team_members enable row level security;
alter table public.faqs enable row level security;

-- Replace the portfolio/services policies with "published"-based ones.
drop policy "public read active portfolio" on public.projects;
drop policy "admins insert portfolio" on public.projects;
drop policy "admins update portfolio" on public.projects;
drop policy "admins delete portfolio" on public.projects;
drop policy "public read active services" on public.services;

create policy "public read published services" on public.services
  for select to anon, authenticated using (published or (select public.is_admin()));

-- Generic policy set: public reads visible rows, admins do everything.
do $$
declare
  t record;
begin
  for t in
    select * from (values
      ('projects', 'published'),
      ('case_studies', 'published'),
      ('team_members', 'published'),
      ('faqs', 'published'),
      ('clients', 'is_public')
    ) as v(name, visible)
  loop
    execute format(
      'create policy "public read visible %1$s" on public.%1$I for select to anon, authenticated using (%2$I or (select public.is_admin()))',
      t.name, t.visible);
    execute format(
      'create policy "admins insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_admin()))',
      t.name);
    execute format(
      'create policy "admins update %1$s" on public.%1$I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',
      t.name);
    execute format(
      'create policy "admins delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_admin()))',
      t.name);
  end loop;
end;
$$;
