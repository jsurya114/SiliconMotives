import { business, siteDescription, siteName } from "./site";

type Json = Record<string, unknown>;

/** Serialise JSON-LD safely for a <script> tag. */
export const jsonLd = (data: Json | Json[]) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export const orgId = (url: string) => `${url}/#organization`;

export function organizationSchema(url: string | undefined): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: siteName,
    description: siteDescription,
    ...(url
      ? {
          "@id": orgId(url),
          url,
          logo: `${url}/icon.svg`,
          image: `${url}/opengraph-image`,
        }
      : {}),
    ...(business.email ? { email: business.email } : {}),
    ...(business.telephone ? { telephone: business.telephone } : {}),
    founder: business.founders.map((f) => ({ "@type": "Person", ...f })),
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    areaServed: business.areaServed.map((name) =>
      name === "Worldwide"
        ? { "@type": "Place", name }
        : { "@type": name === "India" ? "Country" : "Place", name },
    ),
    knowsAbout: [
      "Custom software development",
      "Backend development",
      "System architecture",
      "Amazon Web Services",
      "DevOps",
      "Continuous integration and delivery",
      "Terraform",
      "Docker",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software, cloud and DevOps engineering services",
      itemListElement: business.services.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };
}

export function websiteSchema(url: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: siteName,
    inLanguage: "en-IN",
    publisher: { "@id": orgId(url) },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function serviceSchema(
  url: string,
  page: { path: string; name: string; description: string; serviceType: string; areaServed: string },
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}${page.path}#service`,
    name: page.name,
    description: page.description,
    serviceType: page.serviceType,
    url: `${url}${page.path}`,
    provider: { "@id": orgId(url) },
    areaServed: { "@type": "Place", name: page.areaServed },
  };
}

export function breadcrumbSchema(url: string, items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}
