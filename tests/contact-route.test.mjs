import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler, CONTACT_EMAIL } from '../lib/contact.mjs';
import { toWebHandler } from '../lib/contact-route.mjs';
const valid = {name: 'Visitor', email: 'visitor@example.com', message: 'Our idea'};
function route() {
  const sent = [];
  const handler = toWebHandler(createContactHandler({
    env: {SMTP_USER: CONTACT_EMAIL, SMTP_PASS: 'test-only'},
    createTransport: () => ({sendMail: async mail => {sent.push(mail); return {accepted: [CONTACT_EMAIL]};}}),
    archive: async () => {},
  }));
  return {handler, sent};
}
test('Next.js Web Request adapter preserves email service delivery and response headers', async () => {
  const {handler, sent} = route();
  const response = await handler(new Request('https://silicon.example/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json', Origin: 'https://silicon.example'}, body: JSON.stringify(valid)}));
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), {ok: true});
  assert.equal(response.headers.get('cache-control'), 'no-store'); assert.equal(sent[0].to, CONTACT_EMAIL);
});
test('Web Request adapter retains origin, body-size and malformed-JSON protection', async () => {
  const {handler, sent} = route();
  for (const [origin, body, status] of [['https://other.example', JSON.stringify(valid), 403], ['https://silicon.example', '{bad', 400], ['https://silicon.example', 'x'.repeat(25000), 413]]) {
    const response = await handler(new Request('https://silicon.example/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json', Origin: origin}, body}));
    assert.equal(response.status, status);
  }
  assert.equal(sent.length, 0);
});
