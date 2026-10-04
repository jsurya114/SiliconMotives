import type { Metadata } from "next";
import { siteUrl, siteDescription } from "./lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: {
    default: "SiliconMotives | Remote Software Engineering, Kerala to Worldwide",
    template: "%s | SiliconMotives",
  },
  description: siteDescription,
  applicationName: "SiliconMotives",
  authors: [{ name: "Jasil M" }, { name: "Jayasoorya S" }],
  creator: "SiliconMotives",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SiliconMotives",
    title: "SiliconMotives — World-class software. Zero overhead.",
    description: siteDescription,
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "SiliconMotives — Engineering value, not overhead",
    description: siteDescription,
  },
  robots: { index: !!siteUrl, follow: true },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SiliconMotives",
  description: siteDescription,
  ...(siteUrl
    ? {
        url: siteUrl,
        "@id": `${siteUrl}/#organization`,
        logo: `${siteUrl}/icon.svg`,
      }
    : {}),
  founder: [
    { "@type": "Person", name: "Jasil M", jobTitle: "Founder" },
    { "@type": "Person", name: "Jayasoorya S", jobTitle: "Co-founder" },
  ],
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
