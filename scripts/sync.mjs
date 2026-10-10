import { cp, mkdir } from 'node:fs/promises';
const target = new URL('../silicon-motives/', import.meta.url);
await mkdir(target, { recursive: true });
// Explicit allowlist: credentials, .git, and local artifacts never enter the mirror.
for (const entry of ['api','lib','supabase','tests','scripts','dist','server.mjs','package.json','vercel.json','.gitignore','.env.example','README.md','ADMIN-SETUP.md']) {
  await cp(new URL(`../${entry}`, import.meta.url), new URL(entry, target), { recursive: true });
}
console.log('Root and nested deployment copies synchronized.');
