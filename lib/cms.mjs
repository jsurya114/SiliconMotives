import { randomUUID } from 'node:crypto';
import { validateContent } from '../dist/content-model.js';
export class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
export function configured() { return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY); }
export function json(res, status, body) { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.end(JSON.stringify(body)); }
export function handleError(res, error) { json(res, error.status || 500, { error: error.status ? error.message : 'Something went wrong. Please try again.' }); }
export async function body(req, limit = 64000) {
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw new HttpError(415, 'Send JSON content.');
  if (req.body != null) {
    const size = Buffer.byteLength(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    if (size > limit) throw new HttpError(413, 'The request is too large.');
    if (typeof req.body === 'object') return req.body;
    try { return JSON.parse(req.body); } catch { throw new HttpError(400, 'Invalid JSON.'); }
  }
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > limit) throw new HttpError(413, 'The request is too large.'); chunks.push(chunk); }
  try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw new HttpError(400, 'Invalid JSON.'); }
}
export function sameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  let expected;
  try { expected = process.env.APP_ORIGIN ? new URL(process.env.APP_ORIGIN).origin : `${req.headers['x-forwarded-proto'] === 'https' || process.env.VERCEL ? 'https' : 'http'}://${host}`; }
  catch { throw new HttpError(503, 'The admin origin is not configured correctly.'); }
  if (origin !== expected) throw new HttpError(403, 'This request must come from the admin website.');
}
export function sessionCookie(req, token = '', seconds = 0) {
  const secure = process.env.VERCEL || req.headers['x-forwarded-proto'] === 'https';
  return `sm_admin=${encodeURIComponent(token)}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${Math.min(3600, Math.max(0, seconds))}${secure ? '; Secure' : ''}`;
}
function accessToken(req) {
  const cookie = String(req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('sm_admin='));
  try { return cookie ? decodeURIComponent(cookie.slice(9)) : ''; } catch { return ''; }
}
export async function supabase(path, { token, method = 'GET', payload, headers = {}, raw } = {}) {
  if (!configured()) throw new HttpError(503, 'Connect the database to enable content management. See ADMIN-SETUP.md.');
  const url = process.env.SUPABASE_URL.replace(/\/$/, '');
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  let response;
  try {
    response = await fetch(`${url}${path}`, { method, headers: { apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(payload ? { 'Content-Type': 'application/json' } : {}), ...headers }, body: raw || (payload ? JSON.stringify(payload) : undefined), signal: AbortSignal.timeout(12000) });
  } catch { throw new HttpError(502, 'The database is unavailable. Please try again.'); }
  const text = await response.text(); let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!response.ok) {
    if (response.status === 429) throw new HttpError(429, 'Too many attempts. Please wait a little and try again.');
    if (response.status === 401) throw new HttpError(401, 'Your session has expired. Sign in again.');
    if (response.status === 403) throw new HttpError(403, 'You do not have permission to make this change.');
    if (path.startsWith('/auth/v1/token')) throw new HttpError(401, 'Unable to sign in. Check your email and password.');
    throw new HttpError(502, 'The database could not complete this request. Check the database setup and try again.');
  }
  return data;
}
export async function requireAdmin(req, suppliedToken) {
  const token = suppliedToken || accessToken(req);
  if (!token) throw new HttpError(401, 'Sign in to manage your website.');
  const user = await supabase('/auth/v1/user', { token });
  const members = await supabase(`/rest/v1/site_admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`, { token });
  if (!Array.isArray(members) || members.length !== 1) throw new HttpError(403, 'This account does not have admin access.');
  return { token, user };
}
export function recordId(value) { if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || '')) throw new HttpError(400, 'Invalid record ID.'); return value; }
export function validated(input) { try { return validateContent(input); } catch(error) { throw new HttpError(400, error.message); } }
export function imageUpload(input) {
  const types = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  if (!Object.hasOwn(types, input?.type) || typeof input.base64 !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(input.base64)) throw new HttpError(400, 'Choose a JPG, PNG, or WebP image.');
  const bytes = Buffer.from(input.base64, 'base64');
  if (bytes.length > 2 * 1024 * 1024 || bytes.length < 12) throw new HttpError(400, 'Images must be smaller than 2 MB.');
  const isJpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const isPng = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const isWebp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (!(input.type === 'image/jpeg' && isJpg || input.type === 'image/png' && isPng || input.type === 'image/webp' && isWebp)) throw new HttpError(400, 'The image file does not match its format.');
  return { bytes, path: `${randomUUID()}.${types[input.type]}`, type: input.type };
}
