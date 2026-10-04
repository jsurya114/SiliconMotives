import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "./lib/canonical";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getCanonicalUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/testimonial", "/submit-testimonial"],
    },
    ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml`, host: baseUrl } : {}),
  };
}
