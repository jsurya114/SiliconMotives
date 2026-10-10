// Supabase connection for the public site and the admin panel.
// Use the project URL and the anon / publishable key from Supabase → Project
// Settings → API. Both are safe to publish; access is enforced by the
// row-level security policies in supabase/migrations. Never put the
// service-role / secret key here.
window.SM_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
};
