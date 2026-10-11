-- Suggested copy for client review, not verified client statements.
-- Keep unpublished until each named client approves the wording.
-- Re-running this migration preserves existing edits and publication choices.
begin;

insert into public.testimonials (quote, author_name, author_role, company, sort_order, published)
select draft.quote, draft.author_name, draft.author_role, draft.company, draft.sort_order, false
from (values
  (
    'The team understood how we manage driver availability and orders. NasaLogistic brings those tasks into one place and is straightforward for our team to use.',
    'Abdul Rahman',
    'CEO',
    'NasaLogistic',
    1
  ),
  (
    'Dental Buddy brings patient records, appointments, and billing into one place. The team listened to our clinic''s needs and kept the system practical for day-to-day use.',
    'Rakhi S',
    '',
    'Dental Buddy',
    2
  ),
  (
    'Woobe''s weight-based shopping needed a clear, simple experience. The team worked through the details with us and built a storefront that fits the way we sell.',
    'Gokul',
    '',
    'Woobe',
    3
  )
) as draft(quote, author_name, author_role, company, sort_order)
where not exists (
  select 1 from public.testimonials existing
  where lower(trim(existing.author_name)) = lower(draft.author_name)
    and lower(trim(existing.company)) = lower(draft.company)
);

commit;
