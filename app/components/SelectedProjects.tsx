import { ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project } from "../lib/content";

/** Featured projects; hidden when there are none to show. */
export default function SelectedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section id="projects" className="section shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / SELECTED PROJECTS</span>
          <h2>
            Systems we’ve built
            <br />
            and still run.
          </h2>
        </div>
        <a className="text-link" href="/projects">
          View all projects <ArrowRight size={16} />
        </a>
      </div>
      <div className="project-grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
