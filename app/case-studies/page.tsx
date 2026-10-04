import { ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { getCaseStudies } from "../lib/content";
import { pageMetadata } from "../lib/pages";

export const revalidate = 60;

export function generateMetadata() {
  return pageMetadata({
    path: "/case-studies",
    title: "Case studies",
    description:
      "Technical case studies from SiliconMotives: the architecture, infrastructure and operations behind production systems we build and run.",
  });
}

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();
  return (
    <div className="silicon-site">
      <Navbar />
      <ScrollReveal />
      <main id="main-content">
        <section className="lp-hero">
          <div className="shell">
            <nav className="lp-breadcrumb mono" aria-label="Breadcrumb">
              <a href="/">HOME</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">CASE STUDIES</span>
            </nav>
            <h1>Case studies</h1>
            <div className="lp-intro">
              <p>
                The engineering behind production systems we build and operate:
                architecture, infrastructure and what we’re responsible for.
              </p>
            </div>
          </div>
        </section>
        <section className="section shell">
          <ul className="case-list">
            {studies.map((c) => (
              <li key={c.id} data-reveal>
                <a href={`/case-studies/${c.slug}`} className="case-list-item">
                  <div>
                    <span className="mono">{(c.clientName ?? "CASE STUDY").toUpperCase()}</span>
                    <h2>{c.title}</h2>
                    {c.headline && <p className="case-list-headline">{c.headline}</p>}
                    {c.summary && <p>{c.summary}</p>}
                  </div>
                  <ArrowUpRight size={24} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          {!studies.length && <p className="lp-local">Case studies are on their way.</p>}
        </section>
      </main>
      <Footer />
    </div>
  );
}
