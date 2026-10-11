import { loadContent } from '@/lib/content';
import { Header } from '@/components/site/header';
import { Hero, Belief, Solutions, Remote, Work, Footer } from '@/components/site/marketing-sections';
import { Clients, Services, Portfolio, Testimonials, Faqs } from '@/components/site/content-sections';
import { Founders } from '@/components/site/founders';
import { Contact, WhatsAppFloat } from '@/components/site/contact';
import { SiteMotion } from '@/components/site/site-motion';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const content = await loadContent();
  return <>
    <a className="skip-link" href="#main">Skip to content</a><Header />
    <main id="main"><Hero /><Belief /><Clients rows={content.clients} /><Services rows={content.services} /><Solutions /><Remote /><Work /><Portfolio rows={content.projects} /><Testimonials rows={content.testimonials} /><Faqs rows={content.faqs} /><Founders rows={content.team_members} /><Contact settings={content.settings} /></main>
    <Footer /><WhatsAppFloat number={content.settings.whatsapp_number} /><SiteMotion />
  </>;
}
