/**
 * Seed Supabase with the real default content in content/defaults.json.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:content
 *
 * Safe to re-run: settings are only written when empty, collections are only
 * seeded when empty, and projects/case studies are matched by slug.
 * Never seeds clients or testimonials (those must be real and added by you).
 */
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });
const content = JSON.parse(await readFile(new URL("../content/defaults.json", import.meta.url), "utf8"));

const fail = (label, error) => {
  throw new Error(`${label}: ${error.message}`);
};
const count = async (table) => {
  const { count: n, error } = await db.from(table).select("id", { count: "exact", head: true });
  if (error) fail(table, error);
  return n ?? 0;
};

async function seedSettings() {
  const { data, error } = await db.from("site_content").select("home").eq("id", 1).single();
  if (error) fail("site_content", error);
  if (data.home && Object.keys(data.home).length) return console.log("  settings: already set — skipped");
  const { error: e } = await db.from("site_content").update({ home: content.settings }).eq("id", 1);
  if (e) fail("settings", e);
  console.log("  settings: seeded");
}

async function seedCollection(table, rows) {
  if ((await count(table)) > 0) return console.log(`  ${table}: has rows — skipped`);
  const { error } = await db.from(table).insert(rows);
  if (error) fail(table, error);
  console.log(`  ${table}: inserted ${rows.length}`);
}

async function upsertBySlug(table, row) {
  const { data, error } = await db.from(table).select("id").eq("slug", row.slug).maybeSingle();
  if (error) fail(table, error);
  if (data) {
    console.log(`  ${table}/${row.slug}: exists — skipped`);
    return data.id;
  }
  const { data: inserted, error: e } = await db.from(table).insert(row).select("id").single();
  if (e) fail(`${table}/${row.slug}`, e);
  console.log(`  ${table}/${row.slug}: inserted`);
  return inserted.id;
}

console.log("Seeding SiliconMotives content…");
await seedSettings();

// Capabilities live in the existing services table. Older rows migrated from
// MongoDB have no tools; only seed when no published capability has tools.
const { data: pillars, error: pErr } = await db.from("services").select("id").eq("published", true).neq("tools", "{}");
if (pErr) fail("services", pErr);
if (pillars.length) console.log("  services: capability pillars exist — skipped");
else {
  await db.from("services").update({ published: false }).eq("published", true);
  const { error } = await db.from("services").insert(
    content.services.map((s, i) => ({ ...s, published: true, sort_order: i })),
  );
  if (error) fail("services", error);
  console.log(`  services: inserted ${content.services.length} pillars (older services unpublished)`);
}

await seedCollection(
  "team_members",
  content.team.map((t, i) => ({ ...t, published: true, sort_order: i })),
);
await seedCollection(
  "faqs",
  content.faqs.map((f, i) => ({
    topic: f.topic,
    question: f.question,
    short_answer: f.shortAnswer,
    answer: f.answer,
    link_label: f.linkLabel,
    link_href: f.linkHref,
    show_on_home: true,
    published: true,
    sort_order: i,
  })),
);

const projectIds = {};
for (const [i, p] of content.projects.entries()) {
  projectIds[p.slug] = await upsertBySlug("projects", {
    slug: p.slug,
    title: p.title,
    category: p.category,
    project_type: p.projectType,
    summary: p.summary,
    description: p.description,
    services: p.services,
    tech_stack: p.techStack,
    confidential: p.confidential,
    published: true,
    featured: true,
    sort_order: i,
  });
}
for (const [i, c] of content.caseStudies.entries()) {
  await upsertBySlug("case_studies", {
    slug: c.slug,
    title: c.title,
    project_id: projectIds[c.projectSlug] ?? null,
    anonymized: c.anonymized,
    headline: c.headline,
    summary: c.summary,
    challenge: c.challenge,
    solution: c.solution,
    outcome: c.outcome,
    responsibilities: c.responsibilities,
    technologies: c.technologies,
    metrics: c.metrics,
    architecture: c.architecture,
    published: true,
    featured: true,
    sort_order: i,
  });
}
console.log("Done.");
