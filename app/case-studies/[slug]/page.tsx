import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import ArchitectureDiagram from "../../components/ArchitectureDiagram";
import { getCaseStudies, getCaseStudy } from "../../lib/content";
import { pageMetadata, paragraphs } from "../../lib/pages";
import { getCanonicalUrl } from "../../lib/canonical";
import { breadcrumbSchema, jsonLd, orgId } from "../../lib/schema";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await getCaseStudy(params.slug);
  if (!c) return {};
  return pageMetadata({
    path: `/case-studies/${c.slug}`,
    title: c.seoTitle || [c.title, c.headline].filter(Boolean).join(": "),
    description: c.seoDescription || c.summary,
    image: c.ogImage || c.coverImage,
  });
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const [study, url] = await Promise.all([getCaseStudy(params.slug), getCanonicalUrl()]);
  if (!study) notFound();
  const name = study.clientName ?? study.title;
  const story = [
    ["The challenge", study.challenge],
    ["The solution", study.solution],
    ["The outcome", study.outcome],
  ].filter(([, text]) => text);

  const schemas = url
    ? [
        breadcrumbSchema(url, [
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/case-studies" },
          { name: study.title, path: `/case-studies/${study.slug}` },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: [study.title, study.headline].filter(Boolean).join(": "),
          description: study.summary,
          url: `${url}/case-studies/${study.slug}`,
          author: { "@id": orgId(url) },
          publisher: { "@id": orgId(url) },
          ...(study.coverImage ? { image: study.coverImage } : {}),
        },
      ]
    : [];

  return (
    <div className="silicon-site">
      <Navbar />
      <ScrollReveal />
      {schemas.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schemas) }} />
      )}
      <main id="main-content">
        <section className="lp-hero">
          <div className="shell">
            <nav className="lp-breadcrumb mono" aria-label="Breadcrumb">
              <a href="/">HOME</a>
              <span aria-hidden="true">/</span>
              <a href="/case-studies">CASE STUDIES</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{study.title.toUpperCase()}</span>
            </nav>
            <span className="eyebrow">CASE STUDY</span>
            <h1>
              {name}
              {study.headline && (
                <>
                  <br />
                  <span className="muted">{study.headline}</span>
                </>
              )}
            </h1>
            {study.summary && (
              <div className="lp-intro">
                <p>{study.summary}</p>
              </div>
            )}
            {study.metrics.length > 0 && (
              <dl className="detail-facts">
                {study.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="mono">{m.label.toUpperCase()}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        <section className="case-section">
          <div className="section shell case-grid">
            <div className="case-copy">
              {study.responsibilities.length > 0 && (
                <>
                  <span className="mono case-role-label">WHAT WE OWN</span>
                  <ul className="case-role">
                    {study.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </>
              )}
              {study.technologies.length > 0 && (
                <>
                  <span className="mono case-role-label">TECHNOLOGY & INFRASTRUCTURE</span>
                  <ul className="case-role">
                    {study.technologies.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <ArchitectureDiagram nodes={study.architecture} />
          </div>
        </section>

        {story.length > 0 && (
          <section className="section shell story">
            {story.map(([heading, text]) => (
              <div className="story-block" key={heading} data-reveal>
                <h2>{heading}</h2>
                <div>
                  {paragraphs(text).map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {study.gallery.length > 0 && (
          <section className="shell detail-gallery" aria-label="Screenshots">
            {study.gallery.map((src, i) => (
              <div key={src} className="detail-shot" data-reveal>
                <Image src={src} alt={`${study.title} screenshot ${i + 1}`} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
              </div>
            ))}
          </section>
        )}

        <section className="section shell lp-cta">
          <div>
            <span className="eyebrow">LET’S TALK</span>
            <h2>Need a team that can own production?</h2>
            <p>Tell us about your system. An engineer will reply.</p>
          </div>
          <a className="button button-primary" href="/#contact">
            Discuss your project <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
