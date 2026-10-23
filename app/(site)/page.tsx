import { loadContent } from '@/lib/content';
import { Header } from '@/components/Header';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Hero } from '@/components/sections/Hero';
import { Belief } from '@/components/sections/Belief';
import { Clients } from '@/components/sections/Clients';
import { Services } from '@/components/sections/Services';
import { Solutions } from '@/components/sections/Solutions';
import { Remote } from '@/components/sections/Remote';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { Faq } from '@/components/sections/Faq';
import { People } from '@/components/sections/People';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/content/site';
import { SITE_URL } from '@/lib/site-url';

export const dynamic = 'force-dynamic';
export const metadata = pageMetadata(
  site.seo.title,
  site.seo.description,
  '/',
);

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: site.brand.name,
  alternateName: 'Silicon Motives',
  description: site.seo.description,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export default async function Home() {
  const content = await loadContent();
  return <div className="public-site"><SmoothScroll>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }} />
    <Header settings={content.settings} />
    <main id="main">
      <Hero />
      <Belief />
      <Clients rows={content.clients} />
      <Services rows={content.services} />
      <Solutions />
      <Remote />
      <Process />
      <Testimonials rows={content.testimonials} clients={content.clients} />
      <Faq rows={content.faqs} />
      <People rows={content.team_members} />
      <Contact settings={content.settings} />
    </main>
    <Footer />
    <FloatingWhatsApp number={content.settings.whatsapp_number} />
  </SmoothScroll></div>;
}
