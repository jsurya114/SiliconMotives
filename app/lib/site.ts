/**
 * Canonical origin comes from SITE_URL (or NEXT_PUBLIC_SITE_URL), e.g.
 * https://www.siliconmotives.com. Without it, pages fall back to the CMS SEO
 * canonical URL (see canonical.ts) and stay noindex if neither is set.
 */
function getSiteUrl() {
  const value = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("SITE_URL must be an HTTP(S) URL");
  return url.origin;
}
export const siteUrl = getSiteUrl();
export const siteName = "SiliconMotives";
export const siteTitle =
  "SiliconMotives | Custom Software, AWS & DevOps Engineering";
export const siteDescription =
  "SiliconMotives designs, builds and operates custom software and AWS cloud infrastructure: backend systems, DevOps, CI/CD and production operations. An engineering team based in Kerala, India.";
export const siteKeywords = [
  "custom software development",
  "software engineering company",
  "backend development",
  "AWS infrastructure",
  "cloud infrastructure engineering",
  "DevOps services",
  "CI/CD",
  "Terraform",
  "Docker",
  "production operations",
  "system architecture",
  "white-label development partner",
  "software development company Kerala",
  "software development India",
];
/** Public business facts used in structured data. Only add verified details. */
export const business = {
  city: "Kochi",
  region: "Kerala",
  country: "IN",
  // TODO: add a public email / phone once confirmed; they strengthen local SEO.
  email: undefined as string | undefined,
  telephone: undefined as string | undefined,
  areaServed: [
    "Kochi",
    "Ernakulam",
    "Kottayam",
    "Thrissur",
    "Thiruvananthapuram",
    "Kozhikode",
    "Kerala",
    "India",
    "Worldwide",
  ],
  founders: [
    { name: "Jasil M", jobTitle: "Founder" },
    { name: "Jayasoorya S", jobTitle: "Co-founder" },
  ],
  services: [
    "Custom software engineering",
    "Backend and API development",
    "AWS cloud infrastructure engineering",
    "DevOps, CI/CD and reliability engineering",
    "Production operations and maintenance",
    "Website, Shopify and WordPress development",
  ],
};
