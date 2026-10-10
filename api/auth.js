import { body, configured, handleError, HttpError, json, requireAdmin, sameOrigin, sessionCookie, supabase } from '../lib/cms.mjs';
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!configured()) return json(res, 200, { configured: false, authenticated: false });
      try { const { user } = await requireAdmin(req); return json(res, 200, { configured: true, authenticated: true, email: user.email }); }
      catch (error) { if (error.status === 401 || error.status === 403) { res.setHeader('Set-Cookie', sessionCookie(req)); return json(res, 200, { configured: true, authenticated: false }); } throw error; }
    }
    if (!['POST', 'DELETE'].includes(req.method)) throw new HttpError(405, 'Method not allowed.');
    sameOrigin(req);
    if (req.method === 'DELETE') {
      res.setHeader('Set-Cookie', sessionCookie(req));
      // Revoke the upstream session when possible; always clear the browser cookie.
      try { const { token } = await requireAdmin(req); await supabase('/auth/v1/logout?scope=local', { token, method: 'POST' }); } catch {}
      return json(res, 200, { ok: true });
    }
    const input = await body(req);
    if (typeof input?.email !== 'string' || input.email.length > 254 || typeof input.password !== 'string' || !input.password || input.password.length > 1024) throw new HttpError(400, 'Enter your email and password.');
    const session = await supabase('/auth/v1/token?grant_type=password', { method: 'POST', payload: { email: input.email.trim(), password: input.password } });
    const { user } = await requireAdmin(req, session.access_token);
    res.setHeader('Set-Cookie', sessionCookie(req, session.access_token, session.expires_in || 3600));
    return json(res, 200, { authenticated: true, email: user.email });
  } catch (error) { handleError(res, error); }
}
