-- Link published work and client feedback to the client record.
-- Project records also serve as the case-study record; this keeps the existing CMS usable.
begin;

alter table public.projects add column if not exists client_id uuid references public.clients(id) on delete set null;
alter table public.testimonials add column if not exists client_id uuid references public.clients(id) on delete set null;
alter table public.testimonials add column if not exists project_id uuid references public.projects(id) on delete set null;

update public.projects p set client_id = c.id
from public.clients c
where p.client_id is null
  and regexp_replace(lower(split_part(p.title, ' — ', 1)), 's$', '') = regexp_replace(lower(c.name), 's$', '');

update public.testimonials t set client_id = c.id
from public.clients c
where t.client_id is null
  and regexp_replace(lower(t.company), 's$', '') = regexp_replace(lower(c.name), 's$', '');

update public.testimonials t set project_id = p.id
from public.projects p
where t.project_id is null and t.client_id = p.client_id;

create index if not exists projects_client_id_idx on public.projects(client_id);
create index if not exists testimonials_client_id_idx on public.testimonials(client_id);
create index if not exists testimonials_project_id_idx on public.testimonials(project_id);

create or replace function public.link_project_client()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.client_id is null then
    select c.id into new.client_id
    from public.clients c
    where regexp_replace(lower(c.name), 's$', '') =
      regexp_replace(lower(split_part(new.title, ' — ', 1)), 's$', '')
    order by c.sort_order
    limit 1;
  end if;
  return new;
end;
$$;

create or replace function public.link_testimonial_client_project()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.client_id is null then
    select c.id into new.client_id
    from public.clients c
    where regexp_replace(lower(c.name), 's$', '') =
      regexp_replace(lower(new.company), 's$', '')
    order by c.sort_order
    limit 1;
  end if;

  if new.project_id is null and new.client_id is not null then
    select p.id into new.project_id
    from public.projects p
    where p.client_id = new.client_id
    order by p.sort_order
    limit 1;
  end if;
  return new;
end;
$$;

revoke all on function public.link_project_client() from public, anon, authenticated;
revoke all on function public.link_testimonial_client_project() from public, anon, authenticated;

create trigger link_project_client_before_write
before insert or update of title, client_id on public.projects
for each row execute function public.link_project_client();

create trigger link_testimonial_client_project_before_write
before insert or update of company, client_id, project_id on public.testimonials
for each row execute function public.link_testimonial_client_project();

commit;
