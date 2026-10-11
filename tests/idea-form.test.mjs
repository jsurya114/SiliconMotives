import test from 'node:test';
import assert from 'node:assert/strict';
import { submitIdea } from '../lib/submit-idea.mjs';
const idea = { name: 'Visitor', email: 'visitor@example.com', message: 'Our idea', website: '' };
test('idea form sends JSON to the same email endpoint after migration', async () => {
  await submitIdea(idea, async (url, options) => {
    assert.equal(url, '/api/contact'); assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), idea);
    return { ok: true, json: async () => ({ ok: true }) };
  });
});
test('failed and non-JSON responses cannot be reported as sent', async () => {
  await assert.rejects(submitIdea(idea, async () => ({ok: false, json: async () => ({error: 'Email unavailable'})})), /Email unavailable/);
  await assert.rejects(submitIdea(idea, async () => ({ok: false, json: async () => {throw new Error('HTML response');}})), /email siliconmotives@gmail.com/);
  await assert.rejects(submitIdea(idea, async () => {throw new Error('Network error');}), /check your connection/);
});
