import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import ProjectCard from "../components/ProjectCard";
import { getProjects } from "../lib/content";
import { pageMetadata } from "../lib/pages";

export const revalidate = 60;

export function generateMetadata() {
  return pageMetadata({
    path: "/projects",
    title: "Projects",
    description:
      "Custom software, e-commerce, infrastructure and DevOps projects built and operated by SiliconMotives, a software and cloud engineering team in Kerala, India.",
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const categories = Array.from(new Set(projects.map((p) => p.category)));
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
              <span aria-current="page">PROJECTS</span>
            </nav>
            <h1>Projects</h1>
            <div className="lp-intro">
              <p>
                Systems we’ve designed, built and run, from custom business
                software to production infrastructure. Some clients prefer to
                stay anonymous; those projects are described without names.
              </p>
            </div>
            {categories.length > 1 && (
              <ul className="category-list" aria-label="Categories">
                {categories.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <section className="section shell">
          {projects.length ? (
            <div className="project-grid">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <p className="lp-local">New projects are being added. In the meantime, read our <a href="/case-studies">case studies</a>.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
