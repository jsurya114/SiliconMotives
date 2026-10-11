-- Publish the real Woobe client project and retire the previous public portfolio entries.
-- Existing entries remain available as drafts in the admin panel.
create or replace function public.is_project_image_url(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select public.is_web_url(value) or (
    value ~ '^/images/[A-Za-z0-9._/-]+$'
    and value !~ '(^|/)\.\.(/|$)'
  );
$$;

alter table public.projects
  drop constraint if exists projects_image_url_check;

alter table public.projects
  add constraint projects_image_url_check check (public.is_project_image_url(image_url));

update public.projects
set published = false,
    updated_at = now()
where published
  and lower(title) <> lower('Woobe — Fashion, by Weight');

update public.projects
set category = 'Full-stack e-commerce',
    description = 'Co-developed with Jasil M for a real client, this production storefront pairs mobile-first shopping with intuitive ₹/kg pricing and secure checkout.',
    tags = array['Weight-based pricing', 'Razorpay & COD', 'AWS infrastructure'],
    image_url = '/images/woobe-fashion-cover.jpg',
    image_alt = 'Editorial fashion cover visual for the Woobe case study, not a screenshot of the live store.',
    project_url = 'https://github.com/jsurya114/Wobee-ecommerce',
    sort_order = 1,
    published = true,
    updated_at = now()
where lower(title) = lower('Woobe — Fashion, by Weight');

insert into public.projects (title, category, description, tags, image_url, image_alt, project_url, sort_order, published)
select
  'Woobe — Fashion, by Weight',
  'Full-stack e-commerce',
  'Co-developed with Jasil M for a real client, this production storefront pairs mobile-first shopping with intuitive ₹/kg pricing and secure checkout.',
  array['Weight-based pricing', 'Razorpay & COD', 'AWS infrastructure'],
  '/images/woobe-fashion-cover.jpg',
  'Editorial fashion cover visual for the Woobe case study, not a screenshot of the live store.',
  'https://github.com/jsurya114/Wobee-ecommerce',
  1,
  true
where not exists (
  select 1 from public.projects where lower(title) = lower('Woobe — Fashion, by Weight')
);
