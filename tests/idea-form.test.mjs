import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../dist/script.js', import.meta.url), 'utf8');
// Isolate the vanilla-JS form from unrelated navigation and animation setup.
const formScript = script.slice(script.indexOf('const briefDialog ='), script.indexOf('// Motion is progressive enhancement'));

function setup(fetcher) {
  const listeners = {};
  const submit = { disabled: false };
  const status = { textContent: '' };
  const fields = { name: 'Visitor', email: 'visitor@example.com', project: 'Our idea', website: '' };
  const form = {
    resets: 0,
    addEventListener(type, fn) { listeners[type] = fn; },
    querySelector() { return submit; },
    setAttribute() {}, removeAttribute() {},
    reset() { this.resets++; },
  };
  const control = { addEventListener() {} };
  const context = {
    document: { querySelector: selector => selector === '#brief-form' ? form : selector === '#brief-status' ? status : control },
    FormData: class { get(name) { return fields[name]; } },
    AbortSignal,
    fetch: fetcher,
  };
  vm.runInNewContext(formScript, context);
  return { form, status, submit, send: () => listeners.submit({ preventDefault() {} }) };
}

test('form sends directly to the email endpoint and resets only after success', async () => {
  let payload;
  const ui = setup(async (url, options) => {
    assert.equal(url, '/api/contact');
    assert.equal(options.method, 'POST');
    payload = JSON.parse(options.body);
    return { ok: true, json: async () => ({ ok: true }) };
  });
  await ui.send();
  assert.equal(payload.message, 'Our idea');
  assert.equal(ui.form.resets, 1);
  assert.match(ui.status.textContent, /sent to our team/);
  assert.equal(ui.submit.disabled, false);
});

test('server and network failures keep the idea and re-enable submission', async () => {
  for (const fetcher of [
    async () => ({ ok: false, json: async () => ({ error: 'Email is temporarily unavailable.' }) }),
    async () => { throw new Error('Failed to fetch'); },
  ]) {
    const ui = setup(fetcher);
    await ui.send();
    assert.equal(ui.form.resets, 0);
    assert.match(ui.status.textContent, /could not be sent/);
    assert.equal(ui.submit.disabled, false);
  }
});

test('repeated submit events during sending produce only one request', async () => {
  let complete, calls = 0;
  const ui = setup(() => { calls++; return new Promise(resolve => { complete = resolve; }); });
  const first = ui.send();
  assert.equal(ui.submit.disabled, true);
  await ui.send();
  assert.equal(calls, 1);
  complete({ ok: true, json: async () => ({ ok: true }) });
  await first;
  assert.equal(ui.submit.disabled, false);
});
