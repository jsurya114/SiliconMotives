import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import { getCaseStudies, getProject, getProjects } from "../../lib/content";
import { pageMetadata, paragraphs } from "../../lib/pages";
import { getCanonicalUrl } from "../../lib/canonical";
import { breadcrumbSchema, jsonLd, orgId } from "../../lib/schema";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProject(params.slug);
  if (!p) return {};
  return pageMetadata({
    path: `/projects/${p.slug}`,
    title: p.seoTitle || `${p.title} — ${p.category} project`,
    description: p.seoDescription || p.summary,
    image: p.ogImage || p.coverImage,
  });
}

const formatMonth = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : null;

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, caseStudies, url] = await Promise.all([
    getProject(params.slug),
    getCaseStudies(),
    getCanonicalUrl(),
  ]);
  if (!project) notFound();
  const related = caseStudies.find((c) => c.projectSlug === project.slug);
  const start = formatMonth(project.startDate);
  const end = formatMonth(project.endDate);
  const facts = [
    ["Category", project.category],
    ["Type", project.projectType],
    ["Client", project.clientName ?? (project.confidential ? "Confidential" : "")],
    ["Timeline", start ? `${start} – ${end ?? "Ongoing"}` : ""],
  ].filter(([, v]) => v);

  const schemas = url
    ? [
        breadcrumbSchema(url, [
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.summary,
          url: `${url}/projects/${project.slug}`,
          creator: { "@id": orgId(url) },
          ...(project.coverImage ? { image: project.coverImage } : {}),
          keywords: project.techStack.join(", "),
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
              <a href="/projects">PROJECTS</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{project.title.toUpperCase()}</span>
            </nav>
            <span className="eyebrow">{project.category.toUpperCase()}</span>
            <h1>{project.title}</h1>
            <div className="lp-intro">
              <p>{project.summary}</p>
            </div>
            <dl className="detail-facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="mono">{k.toUpperCase()}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {project.url && (
              <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">
                Visit the live project <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </section>

        {project.coverImage && (
          <div className="shell detail-cover">
            <Image src={project.coverImage} alt={`${project.title} cover`} fill priority sizes="(max-width: 1440px) 100vw, 1328px" className="object-cover" />
          </div>
        )}

        <section className="section shell detail-grid">
          <div className="detail-body">
            {paragraphs(project.description).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
            {related && (
              <a className="button button-primary" href={`/case-studies/${related.slug}`}>
                Read the technical case study <ArrowUpRight size={18} />
              </a>
            )}
          </div>
          <aside className="detail-aside">
            {project.services.length > 0 && (
              <div>
                <span className="mono">WHAT WE BUILT</span>
                <ul>
                  {project.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.techStack.length > 0 && (
              <div>
                <span className="mono">TECHNOLOGY</span>
                <div className="cap-tools">
                  {project.techStack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>

        {project.gallery.length > 0 && (
          <section className="shell detail-gallery" aria-label="Screenshots">
            {project.gallery.map((src, i) => (
              <div key={src} className="detail-shot" data-reveal>
                <Image src={src} alt={`${project.title} screenshot ${i + 1}`} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
              </div>
            ))}
          </section>
        )}

        <section className="section shell lp-cta">
          <div>
            <span className="eyebrow">LET’S TALK</span>
            <h2>Building something similar?</h2>
            <p>Tell us about it. An engineer will reply.</p>
          </div>
          <a className="button button-primary" href="/#contact">
            Start a project <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
