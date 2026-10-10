import { cp, mkdir, writeFile } from 'node:fs/promises';
import { browserConfig } from './config.mjs';

const output = new URL('../build/', import.meta.url);
await mkdir(output, { recursive: true });
await cp(new URL('../dist/', import.meta.url), output, { recursive: true });
await writeFile(new URL('config.js', output), browserConfig());
console.log('Static site built in build/.');
