-- Add the Picbox and Uniwayin client projects to the editable portfolio.
update public.projects
set category = 'Inventory & invoicing',
    description = 'Built for a local events client, this production app manages rental inventory, jobs, wages, and invoicing; more than 190 PDF invoices have been generated.',
    tags = array['Expo mobile app', '50+ REST APIs', '190+ PDF invoices', 'MongoDB + AES-256'],
    image_url = '/images/picbox-cover.jpg',
    image_alt = 'Editorial event rental and inventory cover visual for Picbox, not a product screenshot.',
    project_url = '',
    sort_order = 3,
    published = true,
    updated_at = now()
where lower(title) = lower('Picbox — Inventory & Invoicing System');

insert into public.projects (title, category, description, tags, image_url, image_alt, project_url, sort_order, published)
select
  'Picbox — Inventory & Invoicing System',
  'Inventory & invoicing',
  'Built for a local events client, this production app manages rental inventory, jobs, wages, and invoicing; more than 190 PDF invoices have been generated.',
  array['Expo mobile app', '50+ REST APIs', '190+ PDF invoices', 'MongoDB + AES-256'],
  '/images/picbox-cover.jpg',
  'Editorial event rental and inventory cover visual for Picbox, not a product screenshot.',
  '',
  3,
  true
where not exists (
  select 1 from public.projects where lower(title) = lower('Picbox — Inventory & Invoicing System')
);

update public.projects
set category = 'Education consultancy CRM',
    description = 'A production CRM for four staff managing 280+ active leads, with follow-ups, notes, analytics, and role-based access.',
    tags = array['NestJS + MongoDB', '38 REST APIs', '280+ active leads', 'JWT + RBAC'],
    image_url = '/images/uniwayin-cover.jpg',
    image_alt = 'Editorial education consultancy cover visual for Uniwayin, not a product screenshot.',
    project_url = '',
    sort_order = 4,
    published = true,
    updated_at = now()
where lower(title) = lower('Uniwayin — Education Consultancy CRM');

insert into public.projects (title, category, description, tags, image_url, image_alt, project_url, sort_order, published)
select
  'Uniwayin — Education Consultancy CRM',
  'Education consultancy CRM',
  'A production CRM for four staff managing 280+ active leads, with follow-ups, notes, analytics, and role-based access.',
  array['NestJS + MongoDB', '38 REST APIs', '280+ active leads', 'JWT + RBAC'],
  '/images/uniwayin-cover.jpg',
  'Editorial education consultancy cover visual for Uniwayin, not a product screenshot.',
  '',
  4,
  true
where not exists (
  select 1 from public.projects where lower(title) = lower('Uniwayin — Education Consultancy CRM')
);
