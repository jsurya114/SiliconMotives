import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "./lib/canonical";
import { landingPages } from "./lib/landing";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getCanonicalUrl();
  if (!baseUrl) return [];
  const now = new Date();
  // /blog is excluded while it is a noindex placeholder; add it once articles exist.
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/agency-partners`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...landingPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
