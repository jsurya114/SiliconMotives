-- Publish the real client names shown in the project portfolio with custom
-- wordmark assets maintained in this repository.
with client_data(name, logo_url, sort_order) as (
  values
    ('NasaLogistics', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/nasalogistics.svg', 1),
    ('Woobe', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/woobe.svg', 2),
    ('Dental Buddy', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/dental-buddy.svg', 3),
    ('Picbox', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/picbox.svg', 4),
    ('Uniwayin', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/uniwayin.svg', 5)
)
update public.clients as existing
set name = client_data.name,
    logo_url = client_data.logo_url,
    website_url = '',
    sort_order = client_data.sort_order,
    published = true,
    updated_at = now()
from client_data
where lower(existing.name) = lower(client_data.name);

with client_data(name, logo_url, sort_order) as (
  values
    ('NasaLogistics', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/nasalogistics.svg', 1),
    ('Woobe', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/woobe.svg', 2),
    ('Dental Buddy', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/dental-buddy.svg', 3),
    ('Picbox', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/picbox.svg', 4),
    ('Uniwayin', 'https://raw.githubusercontent.com/jsurya114/SiliconMotives/main/public/images/client-logos/uniwayin.svg', 5)
)
insert into public.clients (name, logo_url, website_url, sort_order, published)
select client_data.name, client_data.logo_url, '', client_data.sort_order, true
from client_data
where not exists (
  select 1 from public.clients existing where lower(existing.name) = lower(client_data.name)
);

-- Retire the six invented preview labels if an older seed ever added them.
delete from public.clients
where lower(name) in ('northline', 'aster labs', 'velora', 'orbit & co.', 'luma studio', 'fieldwork');
