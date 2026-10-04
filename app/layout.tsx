import type { Metadata, Viewport } from "next";
import {
  siteDescription,
  siteKeywords,
  siteName,
  siteTitle,
} from "./lib/site";
import { getCanonicalUrl } from "./lib/canonical";
import { jsonLd, organizationSchema, websiteSchema } from "./lib/schema";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const url = await getCanonicalUrl();
  return {
    metadataBase: new URL(url || "http://localhost:3000"),
    title: { default: siteTitle, template: `%s | ${siteName}` },
    description: siteDescription,
    keywords: siteKeywords,
    applicationName: siteName,
    authors: [{ name: "Jasil M" }, { name: "Jayasoorya S" }],
    creator: siteName,
    publisher: siteName,
    category: "technology",
    icons: { icon: "/icon.svg", apple: "/icon.svg" },
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName,
      title: `${siteName} — Software built to scale. Infrastructure built to last.`,
      description: siteDescription,
      ...(url ? { url } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — Custom software, AWS & DevOps engineering`,
      description: siteDescription,
    },
    robots: url
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: true },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = await getCanonicalUrl();
  const schemas = url
    ? [organizationSchema(url), websiteSchema(url)]
    : [organizationSchema(undefined)];
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')",
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(schemas),
          }}
        />
        {children}
      </body>
    </html>
  );
}
