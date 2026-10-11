import { Readable } from 'node:stream';
import { createContactHandler } from './contact.mjs';
// Adapt the existing validated email service to Next.js Request / Response.
export function toWebHandler(handler) {
  return async function handle(request) {
    const incoming = request.body ? Readable.fromWeb(request.body) : Readable.from([]);
    incoming.method = request.method;
    incoming.headers = Object.fromEntries(request.headers);
    incoming.headers.host ||= new URL(request.url).host;
    incoming.socket = { remoteAddress: 'local' };
    const headers = new Headers();
    let status = 200;
    let body = '';
    await handler(incoming, {
      setHeader(name, value) { headers.set(name, value); },
      writeHead(code, values) { status = code; for (const [name, value] of Object.entries(values)) headers.set(name, value); },
      end(value) { body = value; },
    });
    return new Response(body, { status, headers });
  };
}
export const handleContactRequest = toWebHandler(createContactHandler());
