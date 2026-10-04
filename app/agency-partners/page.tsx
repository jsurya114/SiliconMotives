import type { Metadata } from "next";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { getCanonicalUrl } from "../lib/canonical";
import { breadcrumbSchema, faqSchema, jsonLd } from "../lib/schema";
import { partnerAudiences, partnerPrinciples, partnerScope } from "../lib/partners";
import { caseStudy } from "../lib/company";

const title = "White-label Engineering Partner for Agencies";
const description =
  "SiliconMotives is a white-label and overflow engineering partner for Shopify, e-commerce, design and software agencies: custom backends, integrations, AWS infrastructure and DevOps, delivered under your brand.";

const howItWorks = [
  { title: "Intro call", text: "We learn how your agency works, the kind of projects you take on, and where you need engineering help." },
  { title: "NDA & pilot", text: "We sign an NDA and agree one small, well-scoped pilot so you can judge the work with low risk." },
  { title: "Deliver", text: "We build under your brand, with communication through your team or directly with the engineers." },
  { title: "Ongoing", text: "If it works, we continue per project or on a monthly retainer for steady capacity." },
];

const faqs = [
  {
    q: "Will you ever contact our clients?",
    a: "No. The client relationship stays with your agency. We only talk to your clients if you ask us to, and always as part of your team.",
  },
  {
    q: "Have you worked with U.S. agencies before?",
    a: "Not yet. Our production work so far has been for businesses in India, including an e-commerce platform with 5,000+ users that we help develop and run on AWS. That’s why we suggest starting with a small pilot.",
  },
  {
    q: "How do you handle time zones?",
    a: "We agree overlapping hours for calls and use written updates and demos for everything else, so progress doesn’t wait on meetings.",
  },
  {
    q: "How is the work priced?",
    a: "Per project with an agreed scope and estimate, or as a monthly retainer for ongoing capacity. We’ll recommend whichever fits your pipeline.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const url = await getCanonicalUrl();
  return {
    title,
    description,
    keywords: [
      "white-label development partner",
      "Shopify agency development partner",
      "overflow development team",
      "backend development partner for agencies",
      "AWS DevOps partner for agencies",
    ],
    alternates: url ? { canonical: `${url}/agency-partners` } : undefined,
    openGraph: { title: `${title} | SiliconMotives`, description, ...(url ? { url: `${url}/agency-partners` } : {}) },
  };
}

export default async function AgencyPartnersPage() {
  const url = await getCanonicalUrl();
  const schemas = [
    faqSchema(faqs),
    ...(url
      ? [breadcrumbSchema(url, [
          { name: "Home", path: "/" },
          { name: "Agency partners", path: "/agency-partners" },
        ])]
      : []),
  ];
  return (
    <div className="silicon-site">
      <Navbar />
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schemas) }} />
      <main id="main-content">
        <section className="lp-hero">
          <div className="shell">
            <nav className="lp-breadcrumb mono" aria-label="Breadcrumb">
              <a href="/">HOME</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">AGENCY PARTNERS</span>
            </nav>
            <h1>Your client. Our engineering.</h1>
            <div className="lp-intro">
              <p>
                SiliconMotives works as a white-label or overflow engineering
                partner for agencies that need backend, cloud infrastructure or
                DevOps capability they don’t have in-house.
              </p>
              <p>
                You keep the client and the relationship. We do the engineering
                behind it, from custom integrations to the AWS infrastructure
                your client’s platform runs on.
              </p>
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href="/#contact">
                Discuss a pilot project <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="/#case-study">
                See a production case study <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="section shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / WHO WE PARTNER WITH</span>
              <h2>Built for agencies that sell more than they can engineer.</h2>
            </div>
          </div>
          <div className="partners-audience partners-audience-lg">
            {partnerAudiences.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
          <div className="svc-grid lp-services">
            {partnerScope.map((s, i) => (
              <article className="svc-card" key={s.title}>
                <div className="svc-card-top">
                  <span className="mono">0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-why">
          <div className="section shell">
            <div className="section-heading">
              <div>
                <span className="eyebrow">02 / PARTNERSHIP PRINCIPLES</span>
                <h2>How we work with agencies</h2>
              </div>
              <p>Clear rules up front, so working together is low-risk from day one.</p>
            </div>
            <ul className="lp-why-grid">
              {partnerPrinciples.map((p) => (
                <li key={p.title} data-reveal>
                  <Check size={18} aria-hidden="true" />
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / HOW IT WORKS</span>
              <h2>Start small. Grow if it works.</h2>
            </div>
            <p>
              Our proof so far: we help develop and operate a production
              e-commerce platform with {caseStudy.users} users on AWS.
            </p>
          </div>
          <ol className="partner-steps">
            {howItWorks.map((step, i) => (
              <li key={step.title} data-reveal>
                <span className="mono">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="faq-wrap">
          <div className="section shell lp-faq">
            <div>
              <span className="eyebrow">04 / QUESTIONS</span>
              <h2>What agencies ask us.</h2>
            </div>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <details key={f.q} {...{ name: "partner-faq" }} open={i === 0}>
                  <summary>
                    <span className="faq-num mono">Q.{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq-q">{f.q}</span>
                    <span className="faq-toggle" aria-hidden="true">
                      <Plus size={18} />
                    </span>
                  </summary>
                  <div className="faq-thread">
                    <span className="voice-avatar" aria-hidden="true">SM</span>
                    <div className="faq-reply">
                      <span className="mono">SILICONMOTIVES · TEAM REPLY</span>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell lp-cta">
          <div>
            <span className="eyebrow">LET’S TALK</span>
            <h2>Have a project that needs engineering?</h2>
            <p>
              Tell us about your agency and a piece of work we could start
              with. Choose “Agency partnership” in the form.
            </p>
          </div>
          <a className="button button-primary" href="/#contact">
            Start the conversation <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
