import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../lib/content";

/** Concise engineering-first project card: what we built, with what. */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card" data-reveal>
      <a href={`/projects/${project.slug}`} className="project-card-link">
        {project.coverImage && (
          <div className="project-cover">
            <Image
              src={project.coverImage}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="project-body">
          <div className="project-meta mono">
            <span>{project.category}</span>
            {project.clientName && <span>{project.clientName}</span>}
          </div>
          <h3>
            {project.title}
            <ArrowUpRight size={18} aria-hidden="true" />
          </h3>
          <p>{project.summary}</p>
          {project.services.length > 0 && (
            <p className="project-built">
              <span className="mono">WHAT WE BUILT</span>
              {project.services.slice(0, 4).join(" · ")}
            </p>
          )}
          {project.techStack.length > 0 && (
            <div className="cap-tools" aria-label="Technologies">
              {project.techStack.slice(0, 5).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </a>
    </article>
  );
}
