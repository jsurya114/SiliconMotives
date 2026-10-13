-- Add JJC Artworks (church interior woodworkers) to the portfolio and client list,
-- and a suggested testimonial from Jils Joby for client review.
-- The testimonial is suggested copy, not a verified client statement: it stays
-- unpublished until Jils approves the wording, then it can be published from the admin.
-- Re-running this migration preserves existing edits and publication choices.
begin;

insert into public.projects (title, category, description, tags, image_url, image_alt, project_url, sort_order, published)
select
  'JJC Artworks — Church Interior Woodwork',
  'Business website',
  'A website for JJC Artworks, church interior woodworkers, presenting their craftsmanship and completed work so parishes and churches can see what they make and get in touch.',
  '{}'::text[],
  '/images/jjc-artworks-cover.jpg',
  'Illustrative carved wooden church arches for JJC Artworks, not a photograph of their work or a site screenshot.',
  'https://jjcartworks.in',
  6,
  true
where not exists (
  select 1 from public.projects where lower(title) = lower('JJC Artworks — Church Interior Woodwork')
);

insert into public.clients (name, logo_url, website_url, sort_order, published)
select
  'JJC Artworks',
  'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/jjc-artworks.svg',
  '',
  6,
  true
where not exists (
  select 1 from public.clients where lower(name) = lower('JJC Artworks')
);

insert into public.testimonials (quote, author_name, author_role, company, sort_order, published)
select
  'Our work is all about detail, and we wanted a website that does it justice. The team took the time to understand our craft and built a clean site that presents our church interior woodwork clearly.',
  'Jils Joby',
  '',
  'JJC Artworks',
  4,
  false
where not exists (
  select 1 from public.testimonials
  where lower(trim(author_name)) = lower('Jils Joby') and lower(trim(company)) = lower('JJC Artworks')
);

commit;
