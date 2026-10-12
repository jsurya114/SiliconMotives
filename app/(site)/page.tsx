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
import { Portfolio } from '@/components/sections/Portfolio';
import { Testimonials } from '@/components/sections/Testimonials';
import { Faq } from '@/components/sections/Faq';
import { People } from '@/components/sections/People';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await loadContent();
  return <div className="public-site"><SmoothScroll>
    <Header settings={content.settings} />
    <main id="main">
      <Hero />
      <Belief />
      <Clients rows={content.clients} />
      <Services rows={content.services} />
      <Solutions />
      <Remote />
      <Process />
      <Portfolio rows={content.projects} />
      <Testimonials rows={content.testimonials} />
      <Faq rows={content.faqs} />
      <People rows={content.team_members} />
      <Contact settings={content.settings} />
    </main>
    <Footer />
    <FloatingWhatsApp number={content.settings.whatsapp_number} />
  </SmoothScroll></div>;
}
