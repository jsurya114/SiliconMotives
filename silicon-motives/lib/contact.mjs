import { createHash } from 'node:crypto';
import nodemailer from 'nodemailer';

export const CONTACT_EMAIL = 'hello@siliconmotives.com';
const MAX_BODY_BYTES = 24 * 1024;
const HOUR = 60 * 60 * 1000;
const EMAIL = /^[^\s@<>,;:"\\\x00-\x1f\x7f]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;

function respond(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) throw { status: 413 };
  let raw = req.body;
  if (raw === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) throw { status: 413 };
      chunks.push(Buffer.from(chunk));
    }
    raw = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(raw)) raw = raw.toString('utf8');
  if (Buffer.byteLength(typeof raw === 'string' ? raw : JSON.stringify(raw)) > MAX_BODY_BYTES) throw { status: 413 };
  const body = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw { status: 400 };
  return body;
}

// Best-effort throttling per server instance; deployments should also use
// a Vercel Firewall rate-limit rule for /api/contact across all instances.
function createLimiter() {
  const buckets = new Map();
  return (ip, email) => {
    const now = Date.now();
    for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
    const hash = value => createHash('sha256').update(value).digest('hex');
    const limits = [['all', 100], [`ip:${hash(ip)}`, 10], [`email:${hash(email.toLowerCase())}`, 3]];
    if (limits.some(([key, limit]) => (buckets.get(key)?.count || 0) >= limit)) return false;
    for (const [key] of limits) {
      const bucket = buckets.get(key) || { count: 0, until: now + HOUR };
      bucket.count++;
      buckets.set(key, bucket);
    }
    return true;
  };
}

export async function archiveEnquiry(enquiry, env, fetcher = fetch) {
  const base = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/+$/, '');
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return;
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  const settings = await fetcher(`${base}/rest/v1/site_settings?select=accepting_briefs&id=eq.1`, {
    headers, signal: AbortSignal.timeout(3000),
  });
  if (!settings.ok) throw new Error('Inbox settings unavailable');
  if (!(await settings.json())[0]?.accepting_briefs) return;
  const result = await fetcher(`${base}/rest/v1/contact_submissions`, {
    method: 'POST', headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(enquiry), signal: AbortSignal.timeout(3000),
  });
  if (!result.ok) throw new Error('Inbox copy unavailable');
}

export function createContactHandler({ env = process.env, createTransport = nodemailer.createTransport, archive = archiveEnquiry, logger = console } = {}) {
  const allow = createLimiter();
  let transporter;
  return async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return respond(res, 405, { error: 'Use POST to send an enquiry.' });
    }
    if (req.headers.origin) {
      try {
        if (new URL(req.headers.origin).host !== req.headers.host) throw new Error();
      } catch {
        return respond(res, 403, { error: 'Please send your idea using the form on our website.' });
      }
    }
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
      return respond(res, 415, { error: 'Send the form as JSON.' });
    }
    let body;
    try { body = await readBody(req); } catch (error) {
      return respond(res, error.status === 413 ? 413 : 400, { error: 'Please check your form details and try again.' });
    }
    // Silently discard simple bot submissions without sending any mail.
    if (body.website) return respond(res, 200, { ok: true });
    const { name, email, message } = body;
    if (body.type !== undefined && !['project', 'agency'].includes(body.type)) {
      return respond(res, 400, { error: 'Choose a project enquiry or an agency partnership enquiry.' });
    }
    const enquiryType = body.type === 'agency' ? 'agency partnership' : 'project';
    if (![name, email, message].every(value => typeof value === 'string') ||
        !name.trim() || name.length > 100 || /[\x00-\x1f\x7f]/.test(name) ||
        email.length > 254 || !EMAIL.test(email.trim()) || /[\r\n]/.test(email) ||
        !message.trim() || message.length > 5000 || message.includes('\0')) {
      return respond(res, 400, { error: 'Enter your name, a valid email address, and an idea of up to 5,000 characters.' });
    }
    const user = env.SMTP_USER || CONTACT_EMAIL;
    const pass = env.SMTP_PASS?.replace(/\s/g, '');
    if (!env.SMTP_HOST || !pass || !EMAIL.test(user)) {
      return respond(res, 503, { error: `Email is temporarily unavailable. Please email ${CONTACT_EMAIL} directly.` });
    }
    const ip = env.VERCEL === '1' ? String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() : req.socket?.remoteAddress || 'local';
    if (!allow(ip, email.trim())) {
      res.setHeader('Retry-After', '3600');
      return respond(res, 429, { error: 'You’ve sent several enquiries. Please try again later or email us directly.' });
    }
    const enquiry = {
      name: name.trim(), email: email.trim(),
      message: `Enquiry type: ${enquiryType}\n\n${message.trim()}`,
    };
    try {
      transporter ||= createTransport({
        host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true', auth: { user, pass },
        dnsTimeout: 5000, connectionTimeout: 7000, greetingTimeout: 5000, socketTimeout: 10000,
        disableFileAccess: true, disableUrlAccess: true,
      });
      const result = await transporter.sendMail({
        from: { name: 'SiliconMotives website', address: user },
        to: CONTACT_EMAIL,
        replyTo: { name: enquiry.name, address: enquiry.email },
        subject: `${enquiryType[0].toUpperCase()}${enquiryType.slice(1)} enquiry — SiliconMotives`,
        text: `Name: ${enquiry.name}\nEmail: ${enquiry.email}\n\n${enquiry.message}`,
        disableFileAccess: true, disableUrlAccess: true,
      });
      if (!result.accepted?.includes(CONTACT_EMAIL)) throw new Error('Recipient not accepted');
    } catch {
      logger.error('Contact email delivery failed. Check server SMTP configuration.');
      return respond(res, 502, { error: `We couldn’t send your idea. Please try again or email ${CONTACT_EMAIL} directly.` });
    }
    // An optional inbox-copy failure must not report an already-sent email as failed.
    try { await archive(enquiry, env); } catch {
      logger.warn('Contact email sent, but its admin inbox copy could not be saved.');
    }
    return respond(res, 200, { ok: true });
  };
}
