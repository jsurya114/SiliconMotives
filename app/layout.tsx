import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Silicon Motives — Good software. Clear purpose.',
  description: 'Silicon Motives is a remote-first software engineering company based in Kochi, Kerala. Thoughtful software, clear communication, and engineering that matters.',
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#0b1a2b' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Schibsted+Grotesk:wght@400..900&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>;
}
