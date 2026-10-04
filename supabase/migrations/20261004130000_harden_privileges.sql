-- Hide visitor IP hashes from every API role, not just anon.
-- Signed-in non-admins could otherwise read ip_hash on approved testimonials,
-- and admins never need it in the client. Rate limiting reads it with the
-- service role, which bypasses these grants.
revoke select on public.testimonials from anon, authenticated;
grant select (id, name, role, quote, rating, initials, status, reviewed_at, created_at, updated_at)
  on public.testimonials to anon, authenticated;

revoke select on public.contact_submissions from anon, authenticated;
grant select (id, name, email, phone, service, message, is_read, created_at)
  on public.contact_submissions to authenticated;
