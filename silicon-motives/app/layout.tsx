import type { Metadata, Viewport } from 'next';
import './globals.css';
import './fonts.css';
import { SITE_URL } from '@/lib/site-url';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/content/site';
import { INSTAGRAM_URL } from '@/lib/social-links';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata(
    site.seo.title,
    site.seo.description,
    '/',
  ),
  icons: {
    icon: [
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
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
  sameAs: [INSTAGRAM_URL],
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
    <link rel="preload" href="/fonts/schibsted-grotesk-v7-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/newsreader-v26-normal-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  </head><body>{children}</body></html>;
}
