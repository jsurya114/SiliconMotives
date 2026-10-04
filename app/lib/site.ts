/** Set SITE_URL to the confirmed production origin before launch. */
function getSiteUrl() {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("SITE_URL must be an HTTP(S) URL");
  return url.origin;
}
export const siteUrl = getSiteUrl();
export const siteDescription =
  "SiliconMotives is a remote-first software engineering company based in Kerala, India, working with clients worldwide. Custom web applications, e-commerce platforms, and CRM/ERP systems. Engineering value, not overhead.";
