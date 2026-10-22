import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/site-url';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata(
    'SiliconMotives — Custom Software, Cloud Infrastructure & DevOps',
    'A small engineering company in Kerala, India delivering custom software, cloud infrastructure, and DevOps for businesses and agencies.',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Schibsted+Grotesk:wght@400..900&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>;
}
