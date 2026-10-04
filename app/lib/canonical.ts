import { getSeoSettings } from "./api";
import { siteUrl } from "./site";

const FALLBACK_URL = "https://devaxistechnologies.in";

/** Canonical origin: SITE_URL env, then the CMS SEO canonical URL, then the known production domain. */
export async function getCanonicalUrl() {
  if (siteUrl) return siteUrl;
  const seo = await getSeoSettings();
  return (seo?.canonicalUrl || FALLBACK_URL).replace(/\/+$/, "");
}
