import type { Metadata } from "next";
import { ArrowUpRight, ArrowRight, Globe2, Check, Plus } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "./components/ScrollReveal";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Clients from "./components/Clients";
import Technologies from "./components/Technologies";
import Services from "./components/Services";
import Approach from "./components/Approach";
import FAQ from "./components/FAQ";
import { getPortfolio, getTestimonials } from "./lib/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import { getCanonicalUrl } from "./lib/canonical";
import { faqSchema, jsonLd } from "./lib/schema";
import { faqs } from "./components/FAQ";
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const url = await getCanonicalUrl();
  return { alternates: url ? { canonical: url } : undefined };
}
const principles = [
  "ENGINEERING OVER OVERHEAD",
  "PEOPLE OVER POSTCODES",
  "QUALITY OVER SQUARE FEET",
  "OWNERSHIP OVER HANDOFFS",
  "LOCATION NEVER DECIDES QUALITY",
];
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
            quality={85}
          />
          <div className="hero-shade" aria-hidden="true" />
          <div className="shell hero-content">
            <div className="hero-topline mono">
              <span>
                <i className="status-dot" /> WEB DESIGN &amp; WEB APP DEVELOPMENT · KOCHI
              </span>
              <span>KERALA, INDIA · WORKING WORLDWIDE</span>
            </div>
            <div className="hero-grid">
              <div className="hero-copy">
                <h1>
                  <span className="hero-line">
                    <span>World-class</span>
                  </span>
                  <span className="hero-line">
                    <span>software.</span>
                  </span>
                  <span className="hero-line is-muted">
                    <span>Zero overhead.</span>
                  </span>
                </h1>
                <p>
                  Your budget should build software, not office buildings.
                  SiliconMotives is a remote-first web design and web app
                  development team based in Kochi, Kerala, working with clients
                  across India and worldwide. Every part of your investment goes
                  into skilled engineers, modern technology, and software built
                  to last.
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#contact">
                    Start your project <ArrowUpRight size={18} />
                  </a>
                  <a className="text-link" href="#about">
                    Why remote-first works <ArrowRight size={17} />
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-bottom">
              <span>
                Location doesn’t decide quality. People and practices do.
              </span>
              <a href="#services" className="mono">
                EXPLORE WHAT WE DO <span>↓</span>
              </a>
            </div>
          </div>
        </section>
        <div className="principle-strip">
          <div className="marquee">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div
                  className="marquee-group"
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {principles.map((x) => (
                    <span key={x}>
                      {x}
                      <Plus size={15} aria-hidden="true" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Services />
        <Portfolio data={portfolio} />
        <Clients projects={portfolio} reviews={testimonials} />
        <Approach />
        <Technologies />
        <Testimonials data={testimonials} />
        <section id="about" className="section shell about-grid">
          <div>
            <span className="eyebrow">06 / OUR MOTIVE</span>
            <h2>
              Rooted in Kochi.
              <br />
              <span className="muted">Working worldwide.</span>
            </h2>
            <div className="location-card">
              <Globe2 size={100} strokeWidth={0.65} />
              <div>
                <span className="mono">OUR BASE, NOT OUR BOUNDARY</span>
                <strong>
                  Kochi, Kerala, India <span>↗</span>
                </strong>
                <span className="location-note">
                  <i className="status-dot" /> Serving clients around the
                  world
                </span>
              </div>
            </div>
            <div className="budget-split" data-reveal>
              <span className="mono">WHERE YOUR BUDGET GOES</span>
              <div className="budget-cols">
                <div>
                  <strong>Into your product</strong>
                  <ul>
                    <li>Talented, experienced engineers</li>
                    <li>Modern tools &amp; infrastructure</li>
                    <li>Testing, quality &amp; care</li>
                  </ul>
                </div>
                <div className="budget-not">
                  <strong>Not into overhead</strong>
                  <ul>
                    <li>Large office spaces</li>
                    <li>Daily commutes</li>
                    <li>Layers between you and the team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="about-copy">
            <p className="lead">
              Great software doesn’t need a large office. It needs talented
              people who genuinely care about the product they’re building.
            </p>
            <p>
              SiliconMotives is a remote-first engineering company led by Jasil
              M, Founder, and Jayasoorya S, Co-founder. We’re built on a simple
              belief: strong engineering practices, clear communication, and
              real accountability make exceptional work possible from anywhere.
            </p>
            <p>
              Working remotely keeps us lean, so we invest where it matters
              most: our people, our technology, our infrastructure, and the
              quality of the software we deliver. You pay for engineering
              value, not unnecessary overhead.
            </p>
            <p>
              Wherever your business is, the way we work stays the same. Our
              goal is simple: build a highly efficient engineering company
              where location never determines quality.
            </p>
            <div className="founders">
              <div>
                <span className="avatar">JM</span>
                <div>
                  <strong>Jasil M</strong>
                  <span>Founder</span>
                </div>
              </div>
              <div>
                <span className="avatar">JS</span>
                <div>
                  <strong>Jayasoorya S</strong>
                  <span>Co-founder</span>
                </div>
              </div>
            </div>
            <div className="responsibility">
              <span className="tiny-plus">↗</span>
              <p>
                <strong>A lighter footprint, by design.</strong> Less daily
                commuting, and less dependence on large offices and the energy
                they consume. A small but meaningful step toward operating more
                responsibly.
              </p>
            </div>
          </div>
        </section>
        <section className="values-section">
          <div className="shell values-grid">
            <span className="eyebrow">OUR NON-NEGOTIABLES</span>
            {[
              "Strong engineering practices",
              "Clear communication",
              "Real accountability",
              "Genuine care for the product",
            ].map((x) => (
              <span key={x}>
                <Check size={16} />
                {x}
              </span>
            ))}
          </div>
        </section>
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
