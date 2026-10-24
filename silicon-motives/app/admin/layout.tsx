import type { Metadata } from 'next';
import './admin.css';
export const metadata: Metadata = { title: 'Admin — Silicon Motives', robots: { index: false, follow: false } };
export default function AdminLayout({children}: {children: React.ReactNode}) {
  return <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link rel="stylesheet" precedence="admin-fonts" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" />
    {children}
  </>;
}
