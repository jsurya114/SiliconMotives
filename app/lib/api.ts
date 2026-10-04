/**
 * Server-side data helpers for public pages, backed by Supabase.
 *
 * Each helper returns null when Supabase is not configured or unreachable, so
 * components fall back to their built-in defaults. Rows are mapped to the
 * camelCase shapes (with `_id`) the components already use.
 */
import { createPublicClient } from "./supabase/public";

type Result = { data: unknown; error: { message: string } | null };

async function query<R extends Result>(
  run: (db: NonNullable<ReturnType<typeof createPublicClient>>) => PromiseLike<R>,
  label: string,
): Promise<R["data"] | null> {
  const db = createPublicClient();
  if (!db) return null;
  try {
    const { data, error } = await run(db);
    if (error) {
      console.error(`Supabase query failed: ${label} — ${error.message}`);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Supabase unreachable: ${label}`, (error as Error).message);
    return null;
  }
}

export interface SiteContent {
  hero: {
    headline: string;
    highlightedText: string;
    subheading: string;
    ctaText: string;
    backgroundImage: string | null;
  };
  funFact: {
    title: string;
    description: string;
    stats: { number: string; label: string }[];
  };
  about: {
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    founders: { name: string; title: string; initials: string }[];
    stats: { value: string; label: string }[];
  };
  contactInfo: {
    phone: string;
    email: string;
    whatsappNumber: string;
    whatsappMessage: string;
    address: { line1: string; line2: string; line3: string };
    businessHours: { weekday: string; saturday: string };
  };
  footer: {
    tagline: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      linkedin: string;
      twitter: string;
    };
  };
}

/** Site content (hero, funFact, about, contactInfo, footer). */
export async function getSiteContent(): Promise<SiteContent | null> {
  const row = await query(
    (db) =>
      db
        .from("site_content")
        .select("hero, fun_fact, about, contact_info, footer")
        .eq("id", 1)
        .maybeSingle(),
    "site_content",
  );
  if (!row) return null;
  return {
    hero: row.hero,
    funFact: row.fun_fact,
    about: row.about,
    contactInfo: row.contact_info,
    footer: row.footer,
  } as unknown as SiteContent;
}

/** Active services. */
export async function getServices() {
  const rows = await query(
    (db) =>
      db
        .from("services")
        .select("id, title, description, image, alt, href, sort_order")
        .eq("is_active", true)
        .order("sort_order")
        .order("created_at"),
    "services",
  );
  return (
    rows?.map((r) => ({
      _id: r.id as string,
      title: r.title as string,
      description: r.description as string,
      image: r.image as string | null,
      alt: r.alt as string,
      href: r.href as string,
      order: r.sort_order as number,
    })) ?? null
  );
}

/** Active portfolio projects. */
export async function getPortfolio() {
  const rows = await query(
    (db) =>
      db
        .from("portfolio")
        .select("id, title, client_name, category, description, image, link, alt, sort_order")
        .eq("is_active", true)
        .order("sort_order")
        .order("created_at"),
    "portfolio",
  );
  return (
    rows?.map((r) => ({
      _id: r.id as string,
      title: r.title as string,
      category: r.category as string,
      description: r.description as string,
      image: r.image as string | null,
      link: r.link as string,
      clientName: (r.client_name as string) || undefined,
      alt: r.alt as string,
      order: r.sort_order as number,
    })) ?? null
  );
}

/** Approved testimonials (public columns only). */
export async function getTestimonials() {
  const rows = await query(
    (db) =>
      db
        .from("testimonials")
        .select("id, name, role, quote, rating, initials")
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
    "testimonials",
  );
  return (
    rows?.map((r) => ({
      _id: r.id as string,
      name: r.name as string,
      role: r.role as string,
      quote: r.quote as string,
      rating: r.rating as number,
      initials: r.initials as string,
    })) ?? null
  );
}

/** SEO settings. */
export async function getSeoSettings() {
  const row = await query(
    (db) => db.from("seo_settings").select("*").eq("id", 1).maybeSingle(),
    "seo_settings",
  );
  if (!row) return null;
  return {
    siteName: row.site_name as string,
    canonicalUrl: row.canonical_url as string,
    defaultTitle: row.default_title as string,
    titleTemplate: row.title_template as string,
    defaultDescription: row.default_description as string,
    defaultKeywords: row.default_keywords as string,
    googleSiteVerification: row.google_site_verification as string,
    ogImage: (row.og_image as string) || null,
  };
}
