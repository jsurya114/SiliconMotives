import { cp, mkdir } from 'node:fs/promises';
const source = new URL('../', import.meta.url);
const nested = new URL('../silicon-motives/', import.meta.url);
await mkdir(nested, { recursive: true });
// Keep the repository's visible nested website checkout deployable alongside the root.
for (const entry of ['dist', 'supabase/migrations', '.openai', 'scripts/config.mjs', 'scripts/build.mjs', 'scripts/seed-admin.mjs', '.env.example', 'server.mjs', 'package.json', 'vercel.json', '.gitignore', 'README.md', 'HERO-IMAGE.md']) {
  const destination = new URL(entry, nested);
  const slash = entry.lastIndexOf('/');
  if (slash >= 0) await mkdir(new URL(`${entry.slice(0, slash + 1)}`, nested), { recursive: true });
  await cp(new URL(entry, source), destination, { recursive: true, force: true });
}
// Sync is run from the repository root; the nested deployment copy does not host this script.
const nestedPackage = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('package.json', nested), 'utf8'));
delete nestedPackage.scripts.sync;
await (await import('node:fs/promises')).writeFile(new URL('package.json', nested), `${JSON.stringify(nestedPackage, null, 2)}\n`);
console.log('Nested website copy synchronized.');
