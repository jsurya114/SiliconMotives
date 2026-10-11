import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
const source = new URL('../', import.meta.url);
const nested = new URL('../silicon-motives/', import.meta.url);
await mkdir(nested, { recursive: true });
// Both repository roots deploy the same Next.js app; credentials never sync.
for (const entry of ['app', 'components', 'public', 'lib', 'tests', 'supabase/migrations', '.openai', 'scripts/config.mjs', 'scripts/seed-admin.mjs', 'package.json', 'package-lock.json', 'next.config.ts', 'postcss.config.mjs', 'tsconfig.json', 'vercel.json', '.env.example', '.gitignore', 'README.md', 'HERO-IMAGE.md']) {
  const destination = new URL(entry, nested);
  const slash = entry.lastIndexOf('/');
  if (slash >= 0) await mkdir(new URL(`${entry.slice(0, slash + 1)}`, nested), { recursive: true });
  await cp(new URL(entry, source), destination, { recursive: true, force: true });
}
const pkg = JSON.parse(await readFile(new URL('package.json', nested), 'utf8'));
delete pkg.scripts.sync;
await writeFile(new URL('package.json', nested), `${JSON.stringify(pkg, null, 2)}\n`);
console.log('Nested Next.js app synchronized.');
