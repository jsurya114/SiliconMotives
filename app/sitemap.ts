import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "./lib/canonical";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getCanonicalUrl();
  // /blog is excluded while it is a noindex placeholder; add it once articles exist.
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
