/**
 * Content API for public pages, backed by Supabase.
 *
 * - Only published / approved / publicly-cleared rows are visible (enforced
 *   by row-level security; these queries add the same filters for clarity).
 * - When Supabase is not configured or unreachable, content falls back to
 *   content/defaults.json (real, verified copy). When it IS configured, the
 *   database is the source of truth, including empty results.
 * - Client names are never exposed for confidential projects or anonymized
 *   case studies.
 */
import defaults from "@/content/defaults.json";
import { createPublicClient } from "./supabase/public";
import type { Json } from "./supabase/database.types";

// ── Domain types ────────────────────────────────────────────────────────
import { ARCHITECTURE_TYPES, type ArchitectureNode } from "./content-types";
export * from "./content-types";

export interface Metric {
  value: string;
  label: string;
}
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  tools: string[];
}
export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  linkedin: string;
  photo: string | null;
}
export interface Faq {
  id: string;
  topic: string;
  question: string;
  shortAnswer: string;
  answer: string;
  linkLabel: string;
  linkHref: string;
}
export interface Client {
  id: string;
  name: string;
  logo: string | null;
  website: string;
  industry: string;
}
export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  projectType: string;
  summary: string;
  description: string;
  coverImage: string | null;
  gallery: string[];
  techStack: string[];
  services: string[];
  url: string;
  /** Public client name, or null when confidential / not cleared. */
  clientName: string | null;
  clientLogo: string | null;
  confidential: boolean;
  startDate: string | null;
  endDate: string | null;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
}
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  /** Public client name, or null when anonymized / not cleared. */
  clientName: string | null;
  projectSlug: string | null;
  headline: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  responsibilities: string[];
  technologies: string[];
  metrics: Metric[];
  architecture: ArchitectureNode[];
  coverImage: string | null;
  gallery: string[];
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
}
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo: string | null;
  quote: string;
  rating: number;
  initials: string;
  profileUrl: string;
}
export interface HomeSettings {
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    intro: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    bottomLine: string;
  };
  proof: Metric[];
  contact: { email: string; bookingUrl: string };
}

// ── Helpers ─────────────────────────────────────────────────────────────
type Db = NonNullable<ReturnType<typeof createPublicClient>>;
type Result = { data: unknown; error: { message: string } | null };

/** Runs a query; returns undefined when Supabase is unavailable (use defaults). */
async function load<R extends Result>(
  label: string,
  run: (db: Db) => PromiseLike<R>,
): Promise<NonNullable<R["data"]> | undefined> {
  const db = createPublicClient();
  if (!db) return undefined;
  try {
    const { data, error } = await run(db);
    if (error) {
      console.error(`Content query failed: ${label} — ${error.message}`);
      return undefined;
    }
    return (data ?? undefined) as NonNullable<R["data"]> | undefined;
  } catch (error) {
    console.error(`Content unreachable: ${label}`, (error as Error).message);
    return undefined;
  }
}

const asArray = <T>(value: Json | undefined): T[] =>
  Array.isArray(value) ? (value as unknown as T[]) : [];

const isArchitectureNode = (n: ArchitectureNode) =>
  ARCHITECTURE_TYPES.includes(n?.type) && typeof n?.label === "string";

// ── Defaults (real content; used only when Supabase is unavailable) ─────
const fallback = {
  services: defaults.services.map((s, i): Service => ({ id: `default-service-${i}`, ...s })),
  team: defaults.team.map((t, i): TeamMember => ({ id: `default-team-${i}`, photo: null, ...t })),
  faqs: defaults.faqs.map((f, i): Faq => ({ id: `default-faq-${i}`, ...f })),
  projects: defaults.projects.map(
    (p): Project => ({
      id: `default-project-${p.slug}`,
      slug: p.slug,
      title: p.title,
      category: p.category,
      projectType: p.projectType,
      summary: p.summary,
      description: p.description,
      coverImage: null,
      gallery: [],
      techStack: p.techStack,
      services: p.services,
      url: "",
      clientName: null,
      clientLogo: null,
      confidential: p.confidential,
      startDate: null,
      endDate: null,
      seoTitle: "",
      seoDescription: "",
      ogImage: null,
    }),
  ),
  caseStudies: defaults.caseStudies.map(
    (c): CaseStudy => ({
      id: `default-case-${c.slug}`,
      slug: c.slug,
      title: c.title,
      clientName: null,
      projectSlug: c.projectSlug,
      headline: c.headline,
      summary: c.summary,
      challenge: c.challenge,
      solution: c.solution,
      outcome: c.outcome,
      responsibilities: c.responsibilities,
      technologies: c.technologies,
      metrics: c.metrics,
      architecture: c.architecture as ArchitectureNode[],
      coverImage: null,
      gallery: [],
      seoTitle: "",
      seoDescription: "",
      ogImage: null,
    }),
  ),
};

// ── Home settings ───────────────────────────────────────────────────────
export async function getHomeSettings(): Promise<HomeSettings> {
  const row = await load("site_content.home", (db) =>
    db.from("site_content").select("home").eq("id", 1).maybeSingle(),
  );
  const home = (row?.home ?? {}) as Partial<HomeSettings>;
  return {
    hero: { ...defaults.settings.hero, ...(home.hero ?? {}) },
    proof: Array.isArray(home.proof) ? home.proof : defaults.settings.proof,
    contact: { ...defaults.settings.contact, ...(home.contact ?? {}) },
  };
}

// ── Services (capability pillars) ───────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  const rows = await load("services", (db) =>
    db
      .from("services")
      .select("id, title, description, icon, features, tools")
      .eq("published", true)
      .order("sort_order")
      .order("created_at"),
  );
  return rows ?? fallback.services;
}

// ── Team ────────────────────────────────────────────────────────────────
export async function getTeam(): Promise<TeamMember[]> {
  const rows = await load("team_members", (db) =>
    db
      .from("team_members")
      .select("id, name, initials, role, focus, linkedin, photo")
      .eq("published", true)
      .order("sort_order")
      .order("created_at"),
  );
  return rows ?? fallback.team;
}

// ── FAQs ────────────────────────────────────────────────────────────────
export async function getFaqs({ homeOnly = false } = {}): Promise<Faq[]> {
  const rows = await load("faqs", (db) => {
    let q = db
      .from("faqs")
      .select("id, topic, question, short_answer, answer, link_label, link_href")
      .eq("published", true);
    if (homeOnly) q = q.eq("show_on_home", true);
    return q.order("sort_order").order("created_at");
  });
  if (!rows) return fallback.faqs;
  return rows.map((r) => ({
    id: r.id,
    topic: r.topic,
    question: r.question,
    shortAnswer: r.short_answer,
    answer: r.answer,
    linkLabel: r.link_label,
    linkHref: r.link_href,
  }));
}

// ── Clients ─────────────────────────────────────────────────────────────
export async function getClients({ featuredOnly = false } = {}): Promise<Client[]> {
  const rows = await load("clients", (db) => {
    let q = db
      .from("clients")
      .select("id, name, logo, website, industry")
      .eq("is_public", true);
    if (featuredOnly) q = q.eq("featured", true);
    return q.order("sort_order").order("name");
  });
  return rows ?? [];
}

/** Client names/links for published projects, with confidentiality applied in the database. */
async function projectDetails() {
  const rows = await load("public_project_details", (db) => db.rpc("public_project_details"));
  return new Map((rows ?? []).map((r) => [r.project_id, r]));
}

// ── Projects ────────────────────────────────────────────────────────────
// Only columns the public role may read (see 20261005130000_restrict_public_columns.sql).
const PROJECT_COLUMNS =
  "id, slug, title, category, project_type, summary, description, cover_image, gallery, tech_stack, services, confidential, start_date, end_date, seo_title, seo_description, og_image";

export async function getProjects({
  featuredOnly = false,
  limit,
}: { featuredOnly?: boolean; limit?: number } = {}): Promise<Project[]> {
  const rows = await load("projects", (db) => {
    let q = db.from("projects").select(PROJECT_COLUMNS).eq("published", true);
    if (featuredOnly) q = q.eq("featured", true);
    q = q.order("sort_order").order("created_at", { ascending: false });
    return limit ? q.limit(limit) : q;
  });
  if (!rows) return limit ? fallback.projects.slice(0, limit) : fallback.projects;
  const details = await projectDetails();
  return rows.map((r) => {
    const d = details.get(r.id);
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      projectType: r.project_type,
      summary: r.summary,
      description: r.description,
      coverImage: r.cover_image,
      gallery: r.gallery,
      techStack: r.tech_stack,
      services: r.services,
      url: d?.url ?? "",
      clientName: d?.client_name ?? null,
      clientLogo: d?.client_logo ?? null,
      confidential: r.confidential,
      startDate: r.start_date,
      endDate: r.end_date,
      seoTitle: r.seo_title,
      seoDescription: r.seo_description,
      ogImage: r.og_image,
    };
  });
}

export async function getProject(slug: string): Promise<Project | null> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug) ?? null;
}

// ── Case studies ────────────────────────────────────────────────────────
const CASE_COLUMNS =
  "id, slug, title, project_id, anonymized, headline, summary, challenge, solution, outcome, responsibilities, technologies, metrics, architecture, cover_image, gallery, seo_title, seo_description, og_image";

export async function getCaseStudies({
  featuredOnly = false,
  limit,
}: { featuredOnly?: boolean; limit?: number } = {}): Promise<CaseStudy[]> {
  const rows = await load("case_studies", (db) => {
    let q = db.from("case_studies").select(CASE_COLUMNS).eq("published", true);
    if (featuredOnly) q = q.eq("featured", true);
    q = q.order("sort_order").order("created_at", { ascending: false });
    return limit ? q.limit(limit) : q;
  });
  if (!rows) return limit ? fallback.caseStudies.slice(0, limit) : fallback.caseStudies;

  const caseClients = new Map(
    ((await load("public_case_study_clients", (db) => db.rpc("public_case_study_clients"))) ?? []).map(
      (r) => [r.case_study_id, r.client_name],
    ),
  );
  const projectIds = rows.map((r) => r.project_id).filter((id): id is string => !!id);
  const projects = projectIds.length
    ? (await load("case study projects", (db) =>
        db.from("projects").select("id, slug").eq("published", true).in("id", projectIds),
      )) ?? []
    : [];
  const projectSlug = new Map(projects.map((p) => [p.id, p.slug]));

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    clientName: caseClients.get(r.id) ?? null,
    projectSlug: r.project_id ? projectSlug.get(r.project_id) ?? null : null,
    headline: r.headline,
    summary: r.summary,
    challenge: r.challenge,
    solution: r.solution,
    outcome: r.outcome,
    responsibilities: r.responsibilities,
    technologies: r.technologies,
    metrics: asArray<Metric>(r.metrics),
    architecture: asArray<ArchitectureNode>(r.architecture).filter(isArchitectureNode),
    coverImage: r.cover_image,
    gallery: r.gallery,
    seoTitle: r.seo_title,
    seoDescription: r.seo_description,
    ogImage: r.og_image,
  }));
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const list = await getCaseStudies();
  return list.find((c) => c.slug === slug) ?? null;
}

// ── Testimonials ────────────────────────────────────────────────────────
/** Approved testimonials; featured first. ip_hash is never selectable. */
export async function getTestimonials({ limit }: { limit?: number } = {}): Promise<Testimonial[]> {
  const rows = await load("testimonials", (db) => {
    const q = db
      .from("testimonials")
      .select("id, name, role, quote, rating, initials, company, company_logo, profile_url, featured")
      .eq("status", "approved")
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false });
    return limit ? q.limit(limit) : q;
  });
  return (rows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    company: r.company,
    companyLogo: r.company_logo,
    quote: r.quote,
    rating: r.rating,
    initials: r.initials,
    profileUrl: r.profile_url,
  }));
}

// ── SEO settings (CMS canonical URL fallback) ───────────────────────────
export async function getSeoSettings() {
  const row = await load("seo_settings", (db) =>
    db.from("seo_settings").select("canonical_url").eq("id", 1).maybeSingle(),
  );
  return row ? { canonicalUrl: row.canonical_url } : null;
}
