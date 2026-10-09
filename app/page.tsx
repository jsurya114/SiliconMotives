import type { Metadata } from "next";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "./components/ScrollReveal";
import Capabilities from "./components/Capabilities";
import CaseStudy from "./components/CaseStudy";
import SelectedProjects from "./components/SelectedProjects";
import ClientLogos from "./components/ClientLogos";
import Testimonials from "./components/Testimonials";
import Partners from "./components/Partners";
import RemoteFirst from "./components/RemoteFirst";
import HowWeWork from "./components/HowWeWork";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import {
  getCaseStudies,
  getClients,
  getFaqs,
  getHomeSettings,
  getProjects,
  getServices,
  getTeam,
  getTestimonials,
} from "./lib/content";
import { getCanonicalUrl } from "./lib/canonical";
import { faqSchema, jsonLd } from "./lib/schema";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const url = await getCanonicalUrl();
  return { alternates: url ? { canonical: url } : undefined };
}

export default async function Home() {
  const [settings, services, [caseStudy], projects, clients, testimonials, team, faqs] =
    await Promise.all([
      getHomeSettings(),
      getServices(),
      getCaseStudies({ featuredOnly: true, limit: 1 }),
      getProjects({ featuredOnly: true, limit: 5 }),
      getClients({ featuredOnly: true }),
      getTestimonials({ limit: 3 }),
      getTeam(),
      getFaqs({ homeOnly: true }),
    ]);
  // Don't repeat the featured case study's project in "Selected projects".
  const selected = projects.filter((p) => p.slug !== caseStudy?.projectSlug).slice(0, 4);
  const { hero, proof } = settings;

  return (
    <div className="silicon-site">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              faqSchema(faqs.map((f) => ({ q: f.question, a: `${f.shortAnswer} ${f.answer}`.trim() }))),
            ),
          }}
        />
      )}
      <Navbar />
      <ScrollReveal />
      <main id="main-content">
        <section id="hero" className="hero">
          <Image
            className="hero-background"
            src="/images/siliconmotives-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="hero-shade" aria-hidden="true" />
          <div className="shell hero-content">
            <div className="hero-topline mono">
              <span>
                <i className="status-dot" /> {hero.eyebrow.toUpperCase()}
              </span>
              <span>KERALA, INDIA</span>
            </div>
            <div className="hero-grid">
              <div className="hero-copy">
                <h1>
                  <span className="hero-line">
                    <span>{hero.line1}</span>
                  </span>
                  {hero.line2 && (
                    <span className="hero-line is-muted">
                      <span>{hero.line2}</span>
                    </span>
                  )}
                </h1>
                <p>{hero.intro}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#contact">
                    {hero.primaryCtaLabel} <ArrowUpRight size={18} />
                  </a>
                  {caseStudy && (
                    <a className="text-link" href="#case-study">
                      {hero.secondaryCtaLabel} <ArrowRight size={17} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="hero-bottom">
              <span>{hero.bottomLine}</span>
              <a href="#capabilities" className="mono">
                EXPLORE CAPABILITIES <span>↓</span>
              </a>
            </div>
          </div>
        </section>

        {proof.length > 0 && (
          <section className="proof-strip" aria-label="At a glance">
            <dl className="shell proof-grid">
              {proof.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <Capabilities services={services} />
        <CaseStudy data={caseStudy} />
        <SelectedProjects projects={selected} />
        <ClientLogos clients={clients} />
        <Testimonials items={testimonials} />
        <Partners />
        <HowWeWork />
        <RemoteFirst />
        <Team members={team} />
        <FAQ faqs={faqs} />
        <Contact contact={settings.contact} />
      </main>
      <Footer />
    </div>
  );
}
