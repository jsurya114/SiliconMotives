-- Add the production NasaLogistic client project to the editable portfolio.
update public.projects
set category = 'Logistics platform',
    description = 'A production platform for driver availability, order workflows, and admin operations, built for a real client.',
    tags = array['Driver & order operations', 'JWT + RBAC', 'AWS RDS · EC2', 'React · Vercel'],
    image_url = '/images/nasalogistic-cover.jpg',
    image_alt = 'Editorial logistics cover visual for the NasaLogistic case study, not a product screenshot.',
    project_url = 'https://github.com/jsurya114/nasa',
    sort_order = 2,
    published = true,
    updated_at = now()
where lower(title) = lower('NasaLogistic — Driver & Logistics Management Platform');

insert into public.projects (title, category, description, tags, image_url, image_alt, project_url, sort_order, published)
select
  'NasaLogistic — Driver & Logistics Management Platform',
  'Logistics platform',
  'A production platform for driver availability, order workflows, and admin operations, built for a real client.',
  array['Driver & order operations', 'JWT + RBAC', 'AWS RDS · EC2', 'React · Vercel'],
  '/images/nasalogistic-cover.jpg',
  'Editorial logistics cover visual for the NasaLogistic case study, not a product screenshot.',
  'https://github.com/jsurya114/nasa',
  2,
  true
where not exists (
  select 1 from public.projects where lower(title) = lower('NasaLogistic — Driver & Logistics Management Platform')
);
