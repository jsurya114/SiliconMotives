-- Close column-level information disclosure on the content model.
--
-- Row-level security decides WHICH rows the public can read, but not which
-- columns. Without this migration anyone with the public anon key could query
-- the REST API directly and read, for published rows:
--   * projects.client_name / client_id / url  (even when confidential)
--   * case_studies.client_id                  (even when anonymized)
--   * clients.description                     (internal relationship notes)
--
-- Fix:
--   1. anon gets column grants for safe columns only.
--   2. Client names and project links are exposed only through SECURITY
--      DEFINER functions that apply the confidential / anonymized / public
--      display rules in the database.
--   3. Signed-in users only read these tables when they are admins (the
--      public site always reads as anon), so a non-admin account gains
--      nothing over an anonymous visitor.

-- ── Policies: public = anon; signed-in reads are admin-only ─────────────
do $$
declare
  t record;
begin
  for t in
    select * from (values
      ('projects', 'published'),
      ('case_studies', 'published'),
      ('clients', 'is_public')
    ) as v(name, visible)
  loop
    execute format('drop policy "public read visible %1$s" on public.%1$I', t.name);
    execute format(
      'create policy "public read visible %1$s" on public.%1$I for select to anon using (%2$I)',
      t.name, t.visible);
    execute format(
      'create policy "admins read %1$s" on public.%1$I for select to authenticated using ((select public.is_admin()))',
      t.name);
  end loop;
end;
$$;

-- ── Column grants for anon ──────────────────────────────────────────────
revoke select on public.projects from anon;
grant select (
  id, slug, title, category, project_type, summary, description, cover_image,
  gallery, tech_stack, services, alt, confidential, featured, published,
  sort_order, start_date, end_date, seo_title, seo_description, og_image,
  created_at, updated_at
) on public.projects to anon;

revoke select on public.case_studies from anon;
grant select (
  id, slug, title, project_id, anonymized, headline, summary, challenge,
  solution, outcome, responsibilities, technologies, metrics, architecture,
  cover_image, gallery, featured, published, sort_order, seo_title,
  seo_description, og_image, created_at, updated_at
) on public.case_studies to anon;

revoke select on public.clients from anon;
grant select (
  id, name, logo, website, industry, is_public, featured, sort_order,
  created_at, updated_at
) on public.clients to anon;

-- ── Public client/link details, with confidentiality rules applied ──────
create or replace function public.public_project_details()
returns table (project_id uuid, url text, client_name text, client_logo text)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    case when p.confidential then '' else p.url end,
    case when p.confidential or not coalesce(c.is_public, false) then null else c.name end,
    case when p.confidential or not coalesce(c.is_public, false) then null else c.logo end
  from public.projects p
  left join public.clients c on c.id = p.client_id
  where p.published;
$$;

create or replace function public.public_case_study_clients()
returns table (case_study_id uuid, client_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select cs.id, c.name
  from public.case_studies cs
  join public.clients c on c.id = cs.client_id
  where cs.published and not cs.anonymized and c.is_public;
$$;

revoke all on function public.public_project_details() from public;
revoke all on function public.public_case_study_clients() from public;
grant execute on function public.public_project_details() to anon, authenticated;
grant execute on function public.public_case_study_clients() to anon, authenticated;
