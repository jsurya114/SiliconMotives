import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { browserConfig } from './scripts/config.mjs';

const root = path.resolve(fileURLToPath(new URL('./dist/', import.meta.url)));
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
const port = Number(process.env.PORT || 3000);
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === '/config.js') {
      response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(browserConfig());
      return;
    }
    let target = path.resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if ((await stat(target)).isDirectory()) {
      // Match static hosts: /admin redirects to /admin/, which serves its index.html.
      if (!pathname.endsWith('/')) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
        return;
      }
      target = path.join(target, 'index.html');
    }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(target)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Silicon Motives: http://127.0.0.1:${port} (admin: /admin/)`));
