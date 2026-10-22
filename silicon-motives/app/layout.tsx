import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/site-url';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata(
    'SiliconMotives — Custom Software, Cloud Infrastructure & DevOps',
    'SiliconMotives, founded by Jayasoorya Suryadas and Jasil M, delivers custom software, cloud infrastructure and DevOps from Kerala, India.',
    '/',
  ),
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#0b1a2b' };

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'SiliconMotives',
  legalName: 'Millionian LLC',
  url: SITE_URL,
  email: 'hello@siliconmotives.com',
  description: 'Custom Software, Cloud Infrastructure, and DevOps engineering from Kerala, India.',
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
