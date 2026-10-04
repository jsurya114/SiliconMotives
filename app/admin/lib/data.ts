"use client";
/**
 * Admin data layer: replaces the old Express REST endpoints with Supabase
 * calls. Row-level security enforces that only admin users can write.
 * Functions return camelCase shapes (with `_id`) the admin pages already use,
 * and throw an Error with a readable message on failure.
 */
import { getBrowserClient } from "@/app/lib/supabase/browser";
import type { Json } from "@/app/lib/supabase/database.types";

const db = () => getBrowserClient();

function unwrap<R extends { data: unknown; error: { message: string } | null }>(
  result: R,
): NonNullable<R["data"]> {
  if (result.error) throw new Error(result.error.message);
  return result.data as NonNullable<R["data"]>;
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

// ── Site content sections ───────────────────────────────────────────────
const SECTION_COLUMNS = {
  hero: "hero",
  funFact: "fun_fact",
  about: "about",
  contactInfo: "contact_info",
  footer: "footer",
} as const;
export type Section = keyof typeof SECTION_COLUMNS;

export async function getContent<T = Record<string, unknown>>(section: Section): Promise<T> {
  const column = SECTION_COLUMNS[section];
  const row = unwrap(
    await db().from("site_content").select(column).eq("id", 1).single(),
  ) as Record<string, unknown>;
  return row[column] as T;
}

export async function updateContent(section: Section, value: unknown) {
  const column = SECTION_COLUMNS[section];
  unwrap(
    await db()
      .from("site_content")
      .update({ [column]: value } as Partial<Record<(typeof SECTION_COLUMNS)[Section], Json>>)
      .eq("id", 1)
      .select("id")
      .single(),
  );
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
  const r = unwrap(await db().from("seo_settings").select("*").eq("id", 1).single());
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
  unwrap(
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
}

// ── Services ────────────────────────────────────────────────────────────
export interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  features: string[];
}
export type ServiceInput = Omit<ServiceItem, "_id">;

export async function listServices(): Promise<ServiceItem[]> {
  const rows = unwrap(
    await db()
      .from("services")
      .select("id, title, description, icon, image, features")
      .order("sort_order")
      .order("created_at"),
  );
  return rows.map(({ id, ...r }) => ({ _id: id, ...r }));
}

export async function saveService(id: string | null, input: ServiceInput) {
  const row = { ...input, image: input.image || null };
  unwrap(
    id
      ? await db().from("services").update(row).eq("id", id).select("id").single()
      : await db().from("services").insert(row).select("id").single(),
  );
}

export async function deleteService(id: string) {
  unwrap(await db().from("services").delete().eq("id", id));
}

// ── Portfolio ───────────────────────────────────────────────────────────
export interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  clientName?: string;
  image: string;
  link: string;
  description: string;
}
export type PortfolioInput = Omit<PortfolioItem, "_id">;

export async function listPortfolio(): Promise<PortfolioItem[]> {
  const rows = unwrap(
    await db()
      .from("portfolio")
      .select("id, title, category, client_name, image, link, description")
      .order("sort_order")
      .order("created_at"),
  );
  return rows.map((r) => ({
    _id: r.id,
    title: r.title,
    category: r.category,
    clientName: r.client_name,
    image: r.image ?? "",
    link: r.link,
    description: r.description,
  }));
}

export async function savePortfolio(id: string | null, f: PortfolioInput) {
  const row = {
    title: f.title,
    category: f.category,
    client_name: f.clientName ?? "",
    image: f.image || null,
    link: f.link,
    description: f.description,
  };
  unwrap(
    id
      ? await db().from("portfolio").update(row).eq("id", id).select("id").single()
      : await db().from("portfolio").insert(row).select("id").single(),
  );
}

export async function deletePortfolio(id: string) {
  unwrap(await db().from("portfolio").delete().eq("id", id));
}

// ── Testimonials ────────────────────────────────────────────────────────
export type TestimonialStatus = "pending" | "approved" | "rejected";
export interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  status: TestimonialStatus;
  createdAt: string;
}

export async function listTestimonials(): Promise<TestimonialItem[]> {
  const rows = unwrap(
    await db()
      .from("testimonials")
      .select("id, name, role, quote, rating, initials, status, created_at")
      .order("created_at", { ascending: false }),
  );
  return rows.map(({ id, created_at, ...r }) => ({ _id: id, createdAt: created_at, ...r }));
}

export async function setTestimonialStatus(id: string, status: TestimonialStatus) {
  unwrap(
    await db()
      .from("testimonials")
      .update({ status, reviewed_at: status === "pending" ? null : new Date().toISOString() })
      .eq("id", id)
      .select("id")
      .single(),
  );
}

export async function deleteTestimonial(id: string) {
  unwrap(await db().from("testimonials").delete().eq("id", id));
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
  const rows = unwrap(
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
  unwrap(
    await db()
      .from("contact_submissions")
      .update({ is_read: isRead })
      .eq("id", id)
      .select("id")
      .single(),
  );
}

export async function deleteSubmission(id: string) {
  unwrap(await db().from("contact_submissions").delete().eq("id", id));
}

// ── Dashboard ───────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const head = { count: "exact" as const, head: true };
  const total = ({ count, error }: { count: number | null; error: { message: string } | null }) => {
    if (error) throw new Error(error.message);
    return count ?? 0;
  };
  const [services, portfolio, testimonials, unreadContacts] = await Promise.all([
    db().from("services").select("id", head).then(total),
    db().from("portfolio").select("id", head).then(total),
    db().from("testimonials").select("id", head).then(total),
    db().from("contact_submissions").select("id", head).eq("is_read", false).then(total),
  ]);
  return { services, portfolio, testimonials, unreadContacts };
}

// ── Media uploads (Supabase Storage) ────────────────────────────────────
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadImage(file: File | Blob): Promise<string> {
  const ext = EXTENSIONS[file.type];
  if (!ext) throw new Error("Only JPG, PNG, WebP, and AVIF images are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("File too large — max 5MB allowed");
  const path = `uploads/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db()
    .storage.from("media")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return db().storage.from("media").getPublicUrl(path).data.publicUrl;
}
