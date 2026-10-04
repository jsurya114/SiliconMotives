/**
 * Server-side API fetching helpers.
 * Used in Next.js Server Components to fetch data from the Express backend.
 *
 * Includes graceful fallbacks — if the API is unreachable, components
 * render with their default hardcoded values.
 */

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

/**
 * Generic fetch wrapper with error handling and caching.
 * Returns null on failure so components can fall back to defaults.
 */
async function fetchAPI<T>(
  endpoint: string,
  revalidate = 60,
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate }, // ISR — revalidate every 60s by default
    });

    if (!res.ok) {
      console.error(`API fetch failed: ${endpoint} — ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error(`API unreachable: ${endpoint}`, (error as Error).message);
    return null;
  }
}

/**
 * Fetch all site content (hero, funFact, about, contactInfo, footer).
 */
export async function getSiteContent() {
  return fetchAPI<{
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
  }>("/content");
}

/**
 * Fetch active services.
 */
export async function getServices() {
  return fetchAPI<
    {
      _id: string;
      title: string;
      description: string;
      image: string | null;
      alt: string;
      href: string;
      order: number;
    }[]
  >("/services");
}

/**
 * Fetch active portfolio projects.
 */
export async function getPortfolio() {
  return fetchAPI<
    {
      _id: string;
      title: string;
      category: string;
      description: string;
      image: string | null;
      link: string;
      clientName?: string;
      alt: string;
      order: number;
    }[]
  >("/portfolio");
}

/**
 * Fetch approved testimonials.
 */
export async function getTestimonials() {
  return fetchAPI<
    {
      _id: string;
      name: string;
      role: string;
      quote: string;
      rating: number;
      initials: string;
    }[]
  >("/testimonials");
}

/**
 * Fetch SEO settings.
 */
export async function getSeoSettings() {
  return fetchAPI<{
    siteName: string;
    canonicalUrl: string;
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultKeywords: string;
    googleSiteVerification: string;
    ogImage: string | null;
  }>("/seo");
}
