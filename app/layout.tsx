import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/site-url';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata(
    site.seo.title,
    site.seo.description,
    '/',
  ),
  icons: {
    icon: [
      { url: '/brand/web/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/brand/web/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/brand/web/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/brand/web/icons/site.webmanifest',
};
export const viewport: Viewport = { themeColor: '#0B2033' };

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'SiliconMotives',
  alternateName: 'Silicon Motives',
  legalName: 'Millionian LLC',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: `${SITE_URL}/brand/logos/png/siliconmotives-stacked-primary.png`,
    contentUrl: `${SITE_URL}/brand/logos/png/siliconmotives-stacked-primary.png`,
    width: 1200,
    height: 750,
    caption: 'SiliconMotives',
  },
  email: 'hello@siliconmotives.com',
  slogan: site.brand.tagline,
  description: site.seo.description,
  // Presentation order is independent of the visible founder cards.
  // Search engines determine whether and how founder information is displayed.
  founder: ['Jayasoorya Suryadas', 'Jasil M'].map(name => {
    const person = site.people.founders.find(founder => founder.name === name)!;
    return {
      '@type': 'Person',
      '@id': `${SITE_URL}/about#${person.slug}`,
      name: person.name,
      jobTitle: person.role,
      url: `${SITE_URL}/about#${person.slug}`,
      image: `${SITE_URL}${person.image}`,
      sameAs: [person.linkedin],
    };
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Schibsted+Grotesk:wght@400..900&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>;
}
