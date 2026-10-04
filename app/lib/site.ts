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
  "Web Design & Web App Development in Kochi, Kerala | SiliconMotives";
export const siteDescription =
  "SiliconMotives is a remote-first web design and web application development company based in Kochi, Kerala, India. Custom websites, web apps, e-commerce, and CRM/ERP systems for clients in Kochi, Kottayam, across Kerala, and worldwide.";
export const siteKeywords = [
  "web design Kochi",
  "website design company Kochi",
  "web development company Kochi",
  "web app development Kochi",
  "web application development Kerala",
  "website design Kerala",
  "web design company Kerala",
  "website design Kottayam",
  "web development Kottayam",
  "e-commerce website development Kerala",
  "custom web application development India",
  "software development company Kochi",
  "CRM ERP development Kerala",
  "Shopify developer Kochi",
  "WordPress website design Kerala",
  "Next.js development India",
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
    "Website design",
    "Web application development",
    "E-commerce website development",
    "CRM and ERP development",
    "Shopify and WordPress development",
    "Cloud hosting and deployment",
  ],
};
