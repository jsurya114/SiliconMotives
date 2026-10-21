-- Align the public team records and capability cards with the verified site copy.
begin;

update public.team_members
set role = 'Founder · Systems, cloud & architecture',
    kicker = 'FOUNDER',
    updated_at = now()
where lower(trim(name)) = 'jasil m';

update public.team_members
set name = 'Jayasoorya Suryadas',
    role = 'Co-founder',
    kicker = 'CO-FOUNDER',
    photo_url = case when photo_url = '' then '/images/jayasoorya.jpg' else photo_url end,
    updated_at = now()
where lower(trim(name)) in ('jayasoorya s', 'jayasoorya suryadas');

update public.services
set kicker = 'PRODUCT BUILD',
    title = 'Custom Software Engineering',
    description = 'Thoughtful web applications and business software shaped around your workflows and users.',
    sort_order = 1,
    updated_at = now()
where lower(trim(title)) = 'web & product development';

update public.services
set published = false,
    updated_at = now()
where lower(trim(title)) = 'custom software';

update public.services
set kicker = 'CLOUD FOUNDATION',
    title = 'Cloud Infrastructure Engineering',
    description = 'Cloud environments and deployment foundations designed for the needs of your software.',
    sort_order = 2,
    updated_at = now()
where lower(trim(title)) = 'cloud & infrastructure';

update public.services
set kicker = 'AFTER LAUNCH',
    title = 'DevOps & Reliability',
    description = 'Delivery automation, operational practices, and ongoing improvements to help services run reliably.',
    sort_order = 3,
    updated_at = now()
where lower(trim(title)) = 'ongoing engineering';

commit;
