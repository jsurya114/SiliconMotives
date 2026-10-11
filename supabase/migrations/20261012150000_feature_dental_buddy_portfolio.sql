-- Add Dental Buddy to the editable portfolio without changing other projects.
begin;

update public.projects
set category = 'Dental clinic EMR',
    description = 'Used daily in a live dental clinic, Dental Buddy brings patient records, prescriptions, appointments, and billing together with role-based access for clinic teams.',
    tags = '{}'::text[],
    image_url = '/images/dental-buddy-cover.jpg',
    image_alt = 'Illustrative dental clinic scene for Dental Buddy, not a photograph of the client clinic or a product screenshot.',
    project_url = 'https://github.com/jsurya114/Dental-Buddy',
    sort_order = 5,
    published = true,
    updated_at = now()
where lower(title) = lower('Dental Buddy — Smart Dental EMR System');

insert into public.projects (title, category, description, tags, image_url, image_alt, project_url, sort_order, published)
select
  'Dental Buddy — Smart Dental EMR System',
  'Dental clinic EMR',
  'Used daily in a live dental clinic, Dental Buddy brings patient records, prescriptions, appointments, and billing together with role-based access for clinic teams.',
  '{}'::text[],
  '/images/dental-buddy-cover.jpg',
  'Illustrative dental clinic scene for Dental Buddy, not a photograph of the client clinic or a product screenshot.',
  'https://github.com/jsurya114/Dental-Buddy',
  5,
  true
where not exists (
  select 1 from public.projects where lower(title) = lower('Dental Buddy — Smart Dental EMR System')
);

commit;
