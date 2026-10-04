import { getSeoSettings } from "./api";
import { siteUrl } from "./site";

/** Canonical origin: SITE_URL env first, then the CMS SEO canonical URL. */
export async function getCanonicalUrl(): Promise<string | undefined> {
  if (siteUrl) return siteUrl;
  const seo = await getSeoSettings();
  if (!seo?.canonicalUrl) return undefined;
  try {
    return new URL(seo.canonicalUrl).origin;
  } catch {
    return undefined;
  }
}
