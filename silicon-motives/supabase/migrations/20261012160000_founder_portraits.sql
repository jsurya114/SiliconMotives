-- Allow bundled portraits to be managed alongside uploaded team photos.
begin;

alter table public.team_members
  drop constraint if exists team_members_photo_url_check;
alter table public.team_members
  add constraint team_members_photo_url_check
  check (public.is_project_image_url(photo_url));

-- Preserve any custom photos already chosen in the admin.
update public.team_members
set photo_url = case lower(trim(name))
      when 'jasil m' then '/images/jasil.jpg'
      when 'jayasoorya s' then '/images/jayasoorya.jpg'
    end,
    updated_at = now()
where lower(trim(name)) in ('jasil m', 'jayasoorya s')
  and photo_url = '';

commit;
