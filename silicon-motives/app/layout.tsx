import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Silicon Motives — Good software. Clear purpose.',
  description: 'Silicon Motives is a remote-first software engineering company based in Kochi, Kerala. Thoughtful software, clear communication, and engineering that matters.',
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#102b46' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=Manrope:wght@400;500;600;650;700;750;800&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>;
}
