import type { Metadata } from "next";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "./components/ScrollReveal";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Capabilities from "./components/Capabilities";
import CaseStudy from "./components/CaseStudy";
import Approach from "./components/Approach";
import Partners from "./components/Partners";
import Team from "./components/Team";
import FAQ, { faqs } from "./components/FAQ";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import { getPortfolio, getTestimonials } from "./lib/api";
import { getCanonicalUrl } from "./lib/canonical";
import { faqSchema, jsonLd } from "./lib/schema";
import { proof } from "./lib/company";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const url = await getCanonicalUrl();
  return { alternates: url ? { canonical: url } : undefined };
}

export default async function Home() {
  const [portfolio, testimonials] = await Promise.all([
    getPortfolio(),
    getTestimonials(),
  ]);
  return (
    <div className="silicon-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            faqSchema(faqs.map(({ q, short, a }) => ({ q, a: `${short} ${a}` }))),
          ),
        }}
      />
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
                <i className="status-dot" /> CUSTOM SOFTWARE · CLOUD
                INFRASTRUCTURE · DEVOPS
              </span>
              <span>KERALA, INDIA</span>
            </div>
            <div className="hero-grid">
              <div className="hero-copy">
                <h1>
                  <span className="hero-line">
                    <span>Software built to scale.</span>
                  </span>
                  <span className="hero-line is-muted">
                    <span>Infrastructure built to last.</span>
                  </span>
                </h1>
                <p>
                  SiliconMotives designs, builds and operates production software
                  and AWS infrastructure for growing businesses and technology
                  teams. One focused engineering team, from architecture to
                  day-to-day operations.
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#contact">
                    Start a project <ArrowUpRight size={18} />
                  </a>
                  <a className="text-link" href="#case-study">
                    See a production case study <ArrowRight size={17} />
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-bottom">
              <span>Based in Kerala, India · now open to U.S. &amp; international teams</span>
              <a href="#capabilities" className="mono">
                EXPLORE CAPABILITIES <span>↓</span>
              </a>
            </div>
          </div>
        </section>

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

        <Capabilities />
        <CaseStudy />
        <Portfolio data={portfolio} />
        <Testimonials data={testimonials} />
        <Approach />
        <Partners />
        <Team />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
