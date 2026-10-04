"use client";
/**
 * Admin data layer over Supabase. Row-level security enforces that only
 * admins can write; these helpers just keep the admin pages simple.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { getBrowserClient } from "@/app/lib/supabase/browser";

const db = () => getBrowserClient();
/** Untyped handle for the generic collection helpers (tables chosen at runtime). */
const anyDb = () => getBrowserClient() as unknown as SupabaseClient;

export type Row = Record<string, unknown> & { id: string };

function check<R extends { data: unknown; error: { message: string } | null }>(
  result: R,
): NonNullable<R["data"]> {
  if (result.error) throw new Error(friendlyError(result.error.message));
  return result.data as NonNullable<R["data"]>;
}

/** Turn common Postgres errors into messages an editor can act on. */
function friendlyError(message: string) {
  if (message.includes("duplicate key") && message.includes("slug"))
    return "That URL slug is already used. Choose a different slug.";
  if (message.includes("slug_format") || message.includes("is_slug"))
    return "Slugs may only contain lowercase letters, numbers and single hyphens.";
  if (message.includes("is_http_url") || message.includes("_url_format") || message.includes("website_check"))
    return "Links must start with http:// or https://.";
  if (message.includes("architecture_check"))
    return "Architecture: every component needs a type and a label (max 80 characters).";
  if (message.includes("metrics_check"))
    return "Metrics: each metric needs a value (max 30 characters) and a label.";
  if (message.includes("projects_dates")) return "The end date can’t be before the start date.";
  if (message.includes("row-level security") || message.includes("permission denied"))
    return "Your account doesn’t have permission to do that.";
  return message;
}

// ── Auth ────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { error } = await db().auth.signInWithPassword({ email, password });
  if (error) throw new Error("Invalid email or password");
  const { data: isAdmin } = await db().rpc("is_admin");
  if (isAdmin !== true) {
    await db().auth.signOut();
    throw new Error("This account does not have admin access");
  }
}

export async function signOut() {
  await db().auth.signOut();
}

/** Ask the server to refresh cached public pages (admin-only endpoint). */
export async function refreshSite() {
  await fetch("/api/revalidate", { method: "POST" }).catch(() => undefined);
}

// ── Generic collections ─────────────────────────────────────────────────
export type CollectionTable =
  | "projects"
  | "case_studies"
  | "clients"
  | "testimonials"
  | "team_members"
  | "services"
  | "faqs";

export async function listRows(table: CollectionTable, columns: string): Promise<Row[]> {
  return check(
    await anyDb()
      .from(table)
      .select(columns)
      .order("sort_order")
      .order("created_at", { ascending: false }),
  ) as unknown as Row[];
}

export async function saveRow(table: CollectionTable, id: string | null, values: Record<string, unknown>) {
  const result = id
    ? await anyDb().from(table).update(values).eq("id", id).select("id").single()
    : await anyDb().from(table).insert(values).select("id").single();
  const saved = check(result) as { id: string };
  await refreshSite();
  return saved;
}

async function writeRow(table: CollectionTable, id: string, values: Record<string, unknown>) {
  check(await anyDb().from(table).update(values).eq("id", id).select("id").single());
}

export async function updateRow(table: CollectionTable, id: string, values: Record<string, unknown>) {
  await writeRow(table, id, values);
  await refreshSite();
}

export async function deleteRow(table: CollectionTable, id: string) {
  check(await anyDb().from(table).delete().eq("id", id));
  await refreshSite();
}

/** Rewrite sort_order 0..n for the given ids, in order. */
export async function reorder(table: CollectionTable, ids: string[]) {
  await Promise.all(ids.map((id, i) => writeRow(table, id, { sort_order: i })));
  await refreshSite();
}

/** Options for relation fields (e.g. link a case study to a project). */
export async function listOptions(table: "projects" | "clients") {
  const rows = check(
    await anyDb()
      .from(table)
      .select(table === "projects" ? "id, title" : "id, name")
      .order("sort_order"),
  ) as { id: string; title?: string; name?: string }[];
  return rows.map((r) => ({ value: r.id, label: r.title ?? r.name ?? r.id }));
}

/** Distinct values already used in a text column (e.g. project categories). */
export async function distinctValues(table: CollectionTable, column: string) {
  const rows = check(await anyDb().from(table).select(column)) as unknown as Record<string, unknown>[];
  return Array.from(new Set(rows.map((r) => String(r[column] ?? "")).filter(Boolean))).sort();
}

// ── Homepage settings (site_content.home) ───────────────────────────────
export async function getHomeSettings(): Promise<Record<string, unknown>> {
  const row = check(await db().from("site_content").select("home").eq("id", 1).single());
  return (row.home ?? {}) as Record<string, unknown>;
}

export async function updateHomeSettings(home: Record<string, unknown>) {
  check(
    await anyDb().from("site_content").update({ home }).eq("id", 1).select("id").single(),
  );
  await refreshSite();
}

// ── SEO ─────────────────────────────────────────────────────────────────
export interface SeoForm {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  siteName: string;
  canonicalUrl: string;
  googleSiteVerification: string;
}

export async function getSeo(): Promise<SeoForm> {
  const r = check(await db().from("seo_settings").select("*").eq("id", 1).single());
  return {
    titleTemplate: r.title_template,
    defaultTitle: r.default_title,
    defaultDescription: r.default_description,
    defaultKeywords: r.default_keywords,
    siteName: r.site_name,
    canonicalUrl: r.canonical_url,
    googleSiteVerification: r.google_site_verification,
  };
}

export async function updateSeo(f: SeoForm) {
  check(
    await db()
      .from("seo_settings")
      .update({
        title_template: f.titleTemplate,
        default_title: f.defaultTitle,
        default_description: f.defaultDescription,
        default_keywords: f.defaultKeywords,
        site_name: f.siteName,
        canonical_url: f.canonicalUrl,
        google_site_verification: f.googleSiteVerification,
      })
      .eq("id", 1)
      .select("id")
      .single(),
  );
  await refreshSite();
}

// ── Contact submissions ─────────────────────────────────────────────────
export interface SubmissionItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function listSubmissions(): Promise<SubmissionItem[]> {
  const rows = check(
    await db()
      .from("contact_submissions")
      .select("id, name, email, phone, service, message, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  );
  return rows.map((r) => ({
    _id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    service: r.service,
    message: r.message,
    isRead: r.is_read,
    createdAt: r.created_at,
  }));
}

export async function setSubmissionRead(id: string, isRead: boolean) {
  check(
    await db()
      .from("contact_submissions")
      .update({ is_read: isRead })
      .eq("id", id)
      .select("id")
      .single(),
  );
}

export async function deleteSubmission(id: string) {
  check(await db().from("contact_submissions").delete().eq("id", id));
}

// ── Dashboard ───────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const head = { count: "exact" as const, head: true };
  const total = ({ count, error }: { count: number | null; error: { message: string } | null }) => {
    if (error) throw new Error(error.message);
    return count ?? 0;
  };
  const [projects, caseStudies, pendingTestimonials, unreadContacts] = await Promise.all([
    db().from("projects").select("id", head).then(total),
    db().from("case_studies").select("id", head).then(total),
    db().from("testimonials").select("id", head).eq("status", "pending").then(total),
    db().from("contact_submissions").select("id", head).eq("is_read", false).then(total),
  ]);
  return { projects, caseStudies, pendingTestimonials, unreadContacts };
}

// ── Media uploads (Supabase Storage) ────────────────────────────────────
const MAX_DIMENSION = 2400;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Downscale oversized images in the browser before upload so editors can't
 * accidentally publish multi-megabyte originals. Output is WebP (keeps alpha).
 */
async function prepareImage(file: File | Blob): Promise<Blob> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Only JPG, PNG, WebP and AVIF images are allowed");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process image"))), "image/webp", 0.86),
  );
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadImage(file: File | Blob, folder = "uploads"): Promise<string> {
  const prepared = await prepareImage(file);
  if (prepared.size > 5 * 1024 * 1024) throw new Error("File too large — max 5MB after resizing");
  const ext = EXTENSIONS[prepared.type] ?? "webp";
  const path = `${folder}/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db()
    .storage.from("media")
    .upload(path, prepared, { contentType: prepared.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return db().storage.from("media").getPublicUrl(path).data.publicUrl;
}
