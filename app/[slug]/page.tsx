import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { getLandingPage, landingPages } from "../lib/landing";
import { getCanonicalUrl } from "../lib/canonical";
import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  serviceSchema,
} from "../lib/schema";

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return landingPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = getLandingPage(params.slug);
  if (!page) return {};
  const url = await getCanonicalUrl();
  const path = `/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: url ? { canonical: `${url}${path}` } : undefined,
    openGraph: {
      type: "website",
      title: `${page.metaTitle} | SiliconMotives`,
      description: page.metaDescription,
      ...(url ? { url: `${url}${path}` } : {}),
    },
    twitter: {
      title: `${page.metaTitle} | SiliconMotives`,
      description: page.metaDescription,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getLandingPage(params.slug);
  if (!page) notFound();
  const url = await getCanonicalUrl();
  const path = `/${page.slug}`;
  const schemas = [
    faqSchema(page.faqs),
    ...(url
      ? [
          serviceSchema(url, {
            path,
            name: page.metaTitle,
            description: page.metaDescription,
            serviceType: page.serviceType,
            areaServed: page.areaServed,
          }),
          breadcrumbSchema(url, [
            { name: "Home", path: "/" },
            { name: page.metaTitle, path },
          ]),
        ]
      : []),
  ];
  const related = landingPages.filter((p) => p.slug !== page.slug);
  return (
    <div className="silicon-site">
      <Navbar />
      <ScrollReveal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schemas) }}
      />
      <main id="main-content">
        <section className="lp-hero">
          <div className="shell">
            <nav className="lp-breadcrumb mono" aria-label="Breadcrumb">
              <a href="/">HOME</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.eyebrow}</span>
            </nav>
            <h1>{page.h1}</h1>
            <div className="lp-intro">
              {page.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href="/#contact">
                Start your project <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="/#portfolio">
                See our work <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="section shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / SERVICES</span>
              <h2>{page.serviceHeading}</h2>
            </div>
          </div>
          <div className="svc-grid lp-services">
            {page.services.map((s, i) => (
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
                <span className="eyebrow">02 / WHY SILICONMOTIVES</span>
                <h2>{page.whyHeading}</h2>
              </div>
              <p>
                Engineering value, not overhead: a lean, remote-first team that
                puts your budget into quality.
              </p>
            </div>
            <ul className="lp-why-grid">
              {page.why.map((w) => (
                <li key={w.title} data-reveal>
                  <Check size={18} aria-hidden="true" />
                  <div>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section shell lp-local">
          <span className="eyebrow">03 / WHERE WE WORK</span>
          <h2>{page.localHeading}</h2>
          {page.local.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </section>

        <section className="faq-wrap">
          <div className="section shell lp-faq">
            <div>
              <span className="eyebrow">04 / QUESTIONS</span>
              <h2>Good questions, answered.</h2>
            </div>
            <div className="faq-list">
              {page.faqs.map((f, i) => (
                <details key={f.q} {...{ name: "lp-faq" }} open={i === 0}>
                  <summary>
                    <span className="faq-num mono">
                      Q.{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-q">{f.q}</span>
                    <span className="faq-toggle" aria-hidden="true">
                      <Plus size={18} />
                    </span>
                  </summary>
                  <div className="faq-thread">
                    <span className="voice-avatar" aria-hidden="true">
                      SM
                    </span>
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
            <h2>Have a project in mind?</h2>
            <p>
              Tell us what you’re planning. You’ll hear back from the engineers
              who would actually build it.
            </p>
          </div>
          <a className="button button-primary" href="/#contact">
            Start your project <ArrowUpRight size={18} />
          </a>
        </section>

        <nav className="shell lp-related" aria-label="Related services">
          <span className="mono">RELATED SERVICES</span>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <a href={`/${r.slug}`}>
                  {r.metaTitle} <ArrowUpRight size={15} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
