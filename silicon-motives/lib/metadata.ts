import type { Metadata } from 'next';
import { SITE_URL } from './site-url';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'SiliconMotives',
      title,
      description,
      url,
      images: [{ url: '/brand/social/siliconmotives-og-navy.png', width: 1200, height: 630, alt: 'SiliconMotives' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/social/siliconmotives-og-navy.png'],
    },
  };
}
