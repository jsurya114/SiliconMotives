import defaults from './default-content.json';
export type ContentRow = Record<string, any>;
export type SiteContent = { services: ContentRow[]; projects: ContentRow[]; team_members: ContentRow[]; faqs: ContentRow[]; clients: ContentRow[]; testimonials: ContentRow[]; settings: ContentRow };
export function publicConfig() {
  return { supabaseUrl: process.env.SUPABASE_URL || '', supabaseAnonKey: process.env.SUPABASE_PUBLISHABLE_KEY || '' };
}
export async function loadContent(): Promise<SiteContent> {
  const content: SiteContent = { ...defaults, testimonials: [], settings: {} };
  const { supabaseUrl, supabaseAnonKey } = publicConfig();
  if (!supabaseUrl || !supabaseAnonKey) return content;
  const tables = ['services', 'projects', 'team_members', 'faqs', 'clients', 'testimonials', 'site_settings'] as const;
  await Promise.all(tables.map(async table => {
    try {
      const query = table === 'site_settings' ? 'select=*&id=eq.1' : 'select=*&published=eq.true&order=sort_order.asc,created_at.asc';
      const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${table}?${query}`, {
        headers: { apikey: supabaseAnonKey }, cache: 'no-store', signal: AbortSignal.timeout(4000),
      });
      if (!response.ok) return;
      const rows = await response.json();
      if (Array.isArray(rows) && rows.length) {
        if (table === 'site_settings') content.settings = rows[0];
        else content[table] = rows;
      }
    } catch { /* Keep existing fallback content when the CMS is unavailable. */ }
  }));
  return content;
}
