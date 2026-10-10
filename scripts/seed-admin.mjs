import './config.mjs';

const base = process.env.SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_SEED_EMAIL;
const password = process.env.ADMIN_SEED_PASSWORD;

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    // Do not log response bodies that might contain account or token data.
    throw new Error(`Supabase request to ${path.split('?')[0]} failed (HTTP ${response.status}). Check the service-role key and database migration.`);
  }
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

try {
  if (!base || !key || !email || !password) {
    throw new Error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env before running the seed.');
  }
  // Verify the migration and privileged access before creating an account.
  await request('/rest/v1/admin_users?select=user_id&limit=0');
  let existing;
  for (let page = 1; ; page++) {
    const { users } = await request(`/auth/v1/admin/users?page=${page}&per_page=100`);
    existing = users.find(user => user.email?.toLowerCase() === email.toLowerCase());
    if (existing || users.length < 100) break;
  }
  const account = await request(existing ? `/auth/v1/admin/users/${existing.id}` : '/auth/v1/admin/users', {
    method: existing ? 'PUT' : 'POST',
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  const id = account.id || account.user?.id;
  if (!id) throw new Error('Supabase did not return a user ID.');
  await request('/rest/v1/admin_users?on_conflict=user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: id }),
  });
  const rows = await request(`/rest/v1/admin_users?user_id=eq.${encodeURIComponent(id)}&select=user_id`);
  if (rows?.[0]?.user_id !== id) throw new Error('Could not verify admin membership.');
  console.log('Admin account seeded and admin membership verified.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
