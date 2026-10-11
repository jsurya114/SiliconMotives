-- Correct the client roles without changing quotes or publication status.
begin;

update public.testimonials
set author_role = 'Dentist', updated_at = now()
where lower(trim(author_name)) = 'rakhi s'
  and lower(trim(company)) = 'dental buddy';

update public.testimonials
set author_role = 'Entrepreneur', updated_at = now()
where lower(trim(author_name)) = 'gokul'
  and lower(trim(company)) = 'woobe';

commit;
