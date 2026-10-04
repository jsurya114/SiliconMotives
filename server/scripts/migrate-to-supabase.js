/**
 * One-time migration: MongoDB (old Express backend) → Supabase.
 *
 * Usage (from /server):
 *   MONGODB_URI=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/migrate-to-supabase.js [--dry-run]
 *
 * Optional: ADMIN_TEMP_PASSWORD=... creates admin logins with that password
 * (change it after first login). Without it, admins are sent an invite email.
 *
 * Safe to re-run: tables that already contain rows are skipped.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const { createClient } = require("@supabase/supabase-js");

const DRY_RUN = process.argv.includes("--dry-run");
const { MONGODB_URI, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_TEMP_PASSWORD } =
  process.env;

if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Set MONGODB_URI, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const iso = (d) => (d ? new Date(d).toISOString() : undefined);
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
/** Drop Mongo-only keys (_id, __v) recursively from embedded documents. */
const clean = (value) => {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => k !== "_id" && k !== "__v")
        .map(([k, v]) => [k, clean(v)]),
    );
  }
  return value;
};

async function isEmpty(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return (count ?? 0) === 0;
}

async function insertRows(table, rows) {
  if (!rows.length) return console.log(`  ${table}: nothing to migrate`);
  if (!(await isEmpty(table))) return console.log(`  ${table}: already has rows — skipped`);
  if (DRY_RUN) return console.log(`  ${table}: would insert ${rows.length} rows`);
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase.from(table).insert(rows.slice(i, i + 500));
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  console.log(`  ${table}: inserted ${rows.length} rows`);
}

/** Keep rows that satisfy the new schema's checks; report the rest. */
function validRows(table, rows, isValid) {
  const ok = rows.filter(isValid);
  const skipped = rows.length - ok.length;
  if (skipped) console.warn(`  ${table}: skipping ${skipped} row(s) that fail validation`);
  return ok;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const mongo = mongoose.connection.db;
  const all = (name) => mongo.collection(name).find({}).toArray();
  console.log(`Connected to MongoDB${DRY_RUN ? " (dry run)" : ""}\n`);

  // ── Singletons ──────────────────────────────────────────────────────
  const [content] = await all("sitecontents");
  if (content) {
    const patch = clean({
      hero: content.hero,
      fun_fact: content.funFact,
      about: content.about,
      contact_info: content.contactInfo,
      footer: content.footer,
    });
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    if (!DRY_RUN) {
      const { error } = await supabase.from("site_content").update(patch).eq("id", 1);
      if (error) throw new Error(`site_content: ${error.message}`);
    }
    console.log("  site_content: updated");
  }

  const [seo] = await all("seosettings");
  if (seo) {
    const patch = {
      title_template: seo.titleTemplate,
      default_title: seo.defaultTitle,
      default_description: seo.defaultDescription,
      default_keywords: seo.defaultKeywords,
      site_name: seo.siteName,
      // The old domain is retired; leave canonical empty so SITE_URL is used.
      canonical_url: "",
      google_site_verification: seo.googleSiteVerification ?? "",
      og_image: seo.ogImage ?? "/opengraph-image",
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    if (!DRY_RUN) {
      const { error } = await supabase.from("seo_settings").update(patch).eq("id", 1);
      if (error) throw new Error(`seo_settings: ${error.message}`);
    }
    console.log("  seo_settings: updated (canonical_url cleared)");
  }

  // ── Collections ─────────────────────────────────────────────────────
  const services = (await all("services")).map((s) => ({
    title: str(s.title, 100),
    description: str(s.description, 500),
    image: s.image || null,
    icon: s.icon || "Monitor",
    features: Array.isArray(s.features) ? s.features.map(String) : [],
    alt: str(s.alt, 200),
    href: s.href || "#contact",
    sort_order: Number(s.order) || 0,
    is_active: s.isActive !== false,
    created_at: iso(s.createdAt),
  }));
  await insertRows("services", validRows("services", services, (r) => r.title));

  const portfolio = (await all("portfolios")).map((p) => ({
    title: str(p.title, 150),
    client_name: str(p.clientName, 150),
    category: str(p.category, 100),
    description: str(p.description, 500),
    image: p.image || null,
    link: str(p.link, 2000),
    alt: str(p.alt, 200),
    sort_order: Number(p.order) || 0,
    is_active: p.isActive !== false,
    created_at: iso(p.createdAt),
  }));
  await insertRows(
    "portfolio",
    validRows("portfolio", portfolio, (r) => r.title && r.category),
  );

  const testimonials = (await all("testimonials")).map((t) => ({
    name: str(t.name, 100),
    role: str(t.role, 150),
    quote: str(t.quote, 1000),
    rating: Math.min(5, Math.max(1, Math.round(Number(t.rating) || 5))),
    initials: str(t.initials, 3),
    status: ["pending", "approved", "rejected"].includes(t.status) ? t.status : "pending",
    reviewed_at: iso(t.reviewedAt) ?? null,
    created_at: iso(t.createdAt),
  }));
  await insertRows(
    "testimonials",
    validRows(
      "testimonials",
      testimonials,
      (r) => r.name.length >= 2 && r.role.length >= 2 && r.quote.length >= 10,
    ),
  );

  const submissions = (await all("contactsubmissions")).map((c) => ({
    name: str(c.name, 100),
    email: str(c.email, 254).toLowerCase(),
    phone: str(c.phone, 20),
    service: str(c.service, 50),
    message: str(c.message, 2000),
    is_read: Boolean(c.isRead),
    created_at: iso(c.createdAt),
  }));
  await insertRows(
    "contact_submissions",
    validRows(
      "contact_submissions",
      submissions,
      (r) => r.name && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email) && r.message.length >= 10,
    ),
  );

  // ── Admin users → Supabase Auth ─────────────────────────────────────
  const admins = await all("adminusers");
  for (const admin of admins) {
    const email = String(admin.email).toLowerCase();
    if (DRY_RUN) {
      console.log(`  admin: would create ${email}`);
      continue;
    }
    const { data, error } = ADMIN_TEMP_PASSWORD
      ? await supabase.auth.admin.createUser({
          email,
          password: ADMIN_TEMP_PASSWORD,
          email_confirm: true,
          user_metadata: { name: admin.name },
        })
      : await supabase.auth.admin.inviteUserByEmail(email, {
          data: { name: admin.name },
        });
    if (error) {
      console.warn(`  admin ${email}: ${error.message} (create manually if needed)`);
      continue;
    }
    const { error: linkError } = await supabase
      .from("admin_users")
      .upsert({ user_id: data.user.id, name: str(admin.name, 100) });
    if (linkError) throw new Error(`admin_users: ${linkError.message}`);
    console.log(
      `  admin ${email}: ${ADMIN_TEMP_PASSWORD ? "created with temporary password" : "invite email sent"}`,
    );
  }

  console.log("\nMigration complete.");
}

main()
  .catch((error) => {
    console.error("\nMigration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
