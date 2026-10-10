import { body, handleError, HttpError, json, recordId, requireAdmin, sameOrigin, supabase, validated } from '../lib/cms.mjs';
export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && url.searchParams.get('scope') !== 'admin') {
      const items = await supabase('/rest/v1/site_content?published=eq.true&select=id,kind,title,data,sort_order&order=sort_order.asc,created_at.asc&limit=1000');
      return json(res, 200, { items });
    }
    if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(req.method)) throw new HttpError(405, 'Method not allowed.');
    if (req.method !== 'GET') sameOrigin(req);
    const { token } = await requireAdmin(req);
    if (req.method === 'GET') return json(res, 200, { items: await supabase('/rest/v1/site_content?select=*&order=sort_order.asc,created_at.asc&limit=1000', { token }) });
    if (req.method === 'POST') {
      const input = validated(await body(req));
      const rows = await supabase('/rest/v1/site_content', { token, method: 'POST', payload: input, headers: { Prefer: 'return=representation' } });
      return json(res, 201, { item: rows[0] });
    }
    const id = recordId(url.searchParams.get('id'));
    const input = await body(req);
    if (typeof input?.updated_at !== 'string' || Number.isNaN(Date.parse(input.updated_at))) throw new HttpError(400, 'Reload this record before saving.');
    const filter = `id=eq.${id}&updated_at=eq.${encodeURIComponent(input.updated_at)}`;
    const options = { token, method: req.method, headers: { Prefer: 'return=representation' } };
    if (req.method === 'PATCH') options.payload = validated(input);
    const rows = await supabase(`/rest/v1/site_content?${filter}`, options);
    if (!rows?.length) throw new HttpError(409, 'This item changed in another session. Close the editor and refresh before trying again.');
    return json(res, 200, { item: req.method === 'PATCH' ? rows[0] : null });
  } catch (error) { handleError(res, error); }
}
