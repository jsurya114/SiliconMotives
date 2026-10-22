import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import nodemailer from 'nodemailer';
import { createContactHandler, archiveEnquiry, CONTACT_EMAIL } from '../lib/contact.mjs';

const valid = { name: 'A visitor', email: 'visitor@example.com', message: 'A booking app for our business.', website: '' };
const env = { SMTP_HOST: 'smtp.example.com', SMTP_USER: CONTACT_EMAIL, SMTP_PASS: 'test-app-password' };

function setup(overrides = {}) {
  const sent = [], archived = [], logs = [];
  const handler = createContactHandler({
    env,
    createTransport: () => ({ sendMail: async mail => { sent.push(mail); return { accepted: [CONTACT_EMAIL] }; } }),
    archive: async enquiry => { archived.push(enquiry); },
    logger: { error: (...args) => logs.push(args), warn: (...args) => logs.push(args) },
    ...overrides,
  });
  return { handler, sent, archived, logs };
}

async function request(handler, body = valid, options = {}) {
  const req = Readable.from([options.raw ?? JSON.stringify(body)]);
  req.method = options.method || 'POST';
  req.headers = { host: 'silicon.example', origin: 'https://silicon.example', 'content-type': 'application/json', ...options.headers };
  req.socket = { remoteAddress: options.ip || '127.0.0.1' };
  if (options.parsed) req.body = body;
  const res = {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    writeHead(status, headers) { this.status = status; Object.assign(this.headers, headers); },
    end(body) { this.body = JSON.parse(body); },
  };
  await handler(req, res);
  return res;
}

test('sends to the fixed company inbox, with visitor Reply-To and trimmed admin copy', async () => {
  const ctx = setup();
  const res = await request(ctx.handler, { ...valid, name: '  A visitor  ', to: 'attacker@example.com', subject: 'Injected subject' }, { parsed: true });
  assert.equal(res.status, 200);
  assert.equal(ctx.sent[0].to, CONTACT_EMAIL);
  assert.equal(ctx.sent[0].from.address, CONTACT_EMAIL);
  assert.deepEqual(ctx.sent[0].replyTo, { name: 'A visitor', address: valid.email });
  assert.equal(ctx.sent[0].subject, 'Project enquiry — SiliconMotives');
  assert.equal(ctx.sent[0].html, undefined);
  assert.deepEqual(ctx.archived, [{ name: 'A visitor', email: valid.email, message: `Enquiry type: project\n\n${valid.message}` }]);
});

test('Nodemailer builds a real message with one fixed recipient and plain-text content', async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
  let built;
  const ctx = setup({ createTransport: () => ({ async sendMail(mail) {
    built = await transport.sendMail(mail);
    return { accepted: built.envelope.to };
  } }) });
  const res = await request(ctx.handler, { ...valid, message: '<script>alert(1)</script>' });
  assert.equal(res.status, 200);
  assert.deepEqual(built.envelope.to, [CONTACT_EMAIL]);
  assert.match(built.message.toString(), /Reply-To: A visitor <visitor@example.com>/);
  assert.match(built.message.toString(), /Content-Type: text\/plain/);
});

test('website enquiries retain service intent in the email and admin copy', async () => {
  const ctx = setup();
  const res = await request(ctx.handler, { ...valid, type: 'project', service: 'website-design' });
  assert.equal(res.status, 200);
  assert.equal(ctx.sent[0].subject, 'Website design enquiry — SiliconMotives');
  assert.match(ctx.sent[0].text, /Service: Website design & development/);
  assert.equal(ctx.archived[0].message, `Enquiry type: project\nService: Website design & development\n\n${valid.message}`);
});

test('unsupported service intent and agency/service combinations are rejected before delivery', async () => {
  const ctx = setup();
  for (const service of ['other', 'website-design\r\nBcc: attacker@example.com', ['website-design'], null]) {
    assert.equal((await request(ctx.handler, { ...valid, type: 'project', service })).status, 400);
  }
  assert.equal((await request(ctx.handler, { ...valid, type: 'agency', service: 'website-design' })).status, 400);
  assert.equal(ctx.sent.length, 0);
  assert.equal(ctx.archived.length, 0);
});

test('rejects invalid payloads and header injection without sending', async () => {
  const ctx = setup();
  for (const body of [null, [], {}, { ...valid, name: ' ' }, { ...valid, name: 'Name\r\nBcc: x@example.com' },
    { ...valid, email: 'a@example.com,b@example.com' }, { ...valid, email: 'visitor@example.com\r\n' },
    { ...valid, message: ' ' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, name: 123 }]) {
    assert.equal((await request(ctx.handler, body)).status, 400);
  }
  assert.equal(ctx.sent.length, 0);
});

test('rejects unsupported methods, cross-site requests, non-JSON, malformed and oversized bodies', async () => {
  const ctx = setup();
  assert.equal((await request(ctx.handler, valid, { method: 'GET' })).status, 405);
  assert.equal((await request(ctx.handler, valid, { headers: { origin: 'https://other.example' } })).status, 403);
  assert.equal((await request(ctx.handler, valid, { headers: { 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await request(ctx.handler, valid, { raw: '{invalid' })).status, 400);
  assert.equal((await request(ctx.handler, valid, { raw: 'x'.repeat(25000) })).status, 413);
  assert.equal((await request(ctx.handler, { ...valid, extra: 'x'.repeat(25000) }, { parsed: true })).status, 413);
  assert.equal(ctx.sent.length, 0);
});

test('honeypot submissions do not send or archive', async () => {
  const ctx = setup();
  assert.equal((await request(ctx.handler, { ...valid, website: 'spam.example' })).status, 200);
  assert.equal(ctx.sent.length, 0);
  assert.equal(ctx.archived.length, 0);
});

test('missing credentials return a useful error without exposing configuration', async () => {
  const ctx = setup({ env: {} });
  const res = await request(ctx.handler);
  assert.equal(res.status, 503);
  assert.match(res.body.error, /hello@siliconmotives.com/);
  assert.equal(ctx.sent.length, 0);
});

test('SMTP failure and rejected recipient never report success or save a misleading inbox copy', async () => {
  for (const sendMail of [async () => { throw new Error('private SMTP detail'); }, async () => ({ accepted: [] })]) {
    const ctx = setup({ createTransport: () => ({ sendMail }) });
    const res = await request(ctx.handler);
    assert.equal(res.status, 502);
    assert(!JSON.stringify(res).includes('private SMTP detail'));
    assert.equal(ctx.archived.length, 0);
  }
});

test('inbox-copy failure does not turn a sent email into a failed submission', async () => {
  const ctx = setup({ archive: async () => { throw new Error('database unavailable'); } });
  assert.equal((await request(ctx.handler)).status, 200);
  assert.equal(ctx.sent.length, 1);
  assert.equal(ctx.logs.length, 1);
});

test('same-email and same-IP bursts are throttled, including concurrent requests', async () => {
  const ctx = setup();
  const results = await Promise.all(Array.from({ length: 4 }, () => request(ctx.handler)));
  assert.deepEqual(results.map(res => res.status).sort(), [200, 200, 200, 429]);
  assert.equal(ctx.sent.length, 3);
  const byIp = setup();
  for (let i = 0; i < 11; i++) {
    const res = await request(byIp.handler, { ...valid, email: `visitor${i}@example.com` });
    assert.equal(res.status, i < 10 ? 200 : 429);
  }
});

test('optional archive respects the admin inbox switch and saves only enquiry fields', async () => {
  for (const enabled of [false, true]) for (const config of [
    { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'public-test-key' },
    { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-test-key' },
  ]) {
    const calls = [];
    await archiveEnquiry({ name: valid.name, email: valid.email, message: valid.message }, config, async (url, options) => {
      calls.push({ url, options });
      return { ok: true, json: async () => [{ accepting_briefs: enabled }] };
    });
    assert.equal(calls.length, enabled ? 2 : 1);
    if (enabled) {
      assert(calls[1].url.endsWith('/contact_submissions'));
      assert.deepEqual(JSON.parse(calls[1].options.body), { name: valid.name, email: valid.email, message: valid.message });
    }
  }
});
