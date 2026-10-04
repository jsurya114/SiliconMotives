import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "./lib/canonical";
import { landingPages } from "./lib/landing";
import { getCaseStudies, getProjects } from "./lib/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getCanonicalUrl();
  if (!baseUrl) return [];
  const now = new Date();
  const [projects, caseStudies] = await Promise.all([getProjects(), getCaseStudies()]);
  // /blog is excluded while it is a noindex placeholder; add it once articles exist.
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/agency-partners`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...caseStudies.map((c) => ({
      url: `${baseUrl}/case-studies/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...landingPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
