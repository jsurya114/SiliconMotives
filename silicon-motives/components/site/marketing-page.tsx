import type { ReactNode } from 'react';
import { loadContent } from '@/lib/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/sections/Footer';
import { SmoothScroll } from '@/components/motion/SmoothScroll';

export async function MarketingPage({ children }: { children: ReactNode }) {
  const content = await loadContent();
  return <div className="public-site"><SmoothScroll><Header settings={content.settings} /><main id="main" className="min-h-screen pt-24">{children}</main><Footer /></SmoothScroll></div>;
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <header className="wrap section-y !pt-12"><p className="label text-lagoon-ink">{eyebrow}</p><h1 className="display t-h1 mt-5 max-w-5xl">{title}</h1><div className="mt-7 max-w-3xl text-[1.1875rem] leading-[1.65] text-slate">{children}</div></header>;
}

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="wrap border-t border-ink/15 py-12 sm:py-16"><h2 className="display t-h3">{title}</h2><div className="mt-6 max-w-4xl space-y-5 text-[1.0625rem] leading-[1.7] text-slate">{children}</div></section>;
}
