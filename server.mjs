import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import auth from './api/auth.js';
import content from './api/content.js';
import upload from './api/upload.js';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const handlers = { '/api/auth': auth, '/api/content': content, '/api/upload': upload };
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const port = Number(process.env.PORT || 3000);
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (Object.hasOwn(handlers, pathname)) return await handlers[pathname](request, response);
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end('Method not allowed'); return; }
    const route = pathname === '/' ? '/index.html' : ['/admin','/admin/'].includes(pathname) ? '/admin/index.html' : pathname;
    const target = path.resolve(root, '.' + route);
    if (!target.startsWith(path.resolve(root) + path.sep)) { response.writeHead(403).end('Forbidden'); return; }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(target)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Silicon Motives: http://127.0.0.1:${port} · Admin: /admin`));
