-- Run once in the Supabase SQL editor. No service-role key is used by the website.
begin;
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;
drop policy if exists "Admins can check own membership" on public.site_admins;
create policy "Admins can check own membership" on public.site_admins for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('projects', 'clients', 'testimonials', 'faqs')),
  title text not null check (char_length(title) between 1 and 180),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 16000),
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;
create index if not exists site_content_public_order on public.site_content (published, sort_order, created_at);
drop policy if exists "Public sees published content" on public.site_content;
create policy "Public sees published content" on public.site_content for select to anon, authenticated using (published = true);
drop policy if exists "Admins manage content" on public.site_content;
create policy "Admins manage content" on public.site_content for all to authenticated
  using (exists (select 1 from public.site_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));

create or replace function public.stamp_site_content() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  if TG_OP = 'UPDATE' then new.created_at = old.created_at; new.id = old.id; end if;
  return new;
end;
$$;
revoke all on function public.stamp_site_content() from public;
drop trigger if exists stamp_site_content on public.site_content;
create trigger stamp_site_content before insert or update on public.site_content for each row execute function public.stamp_site_content();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg','image/png','image/webp'];
drop policy if exists "Admins upload site media" on storage.objects;
create policy "Admins upload site media" on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and exists (select 1 from public.site_admins where user_id = (select auth.uid())));
-- Image URLs are public. Deleting a content item does not delete potentially shared images.
commit;

-- After creating a confirmed user under Authentication > Users, grant access:
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
