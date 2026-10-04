"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
export interface PortfolioProject {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
  alt?: string;
  link?: string;
  clientName?: string;
}
const archive: PortfolioProject[] = [
  {
    _id: "archive-1",
    title: "StyleVault",
    category: "E-commerce",
    description: "A fashion storefront with a product-led shopping experience.",
    image: "/images/portfolio-ecommerce.png",
  },
  {
    _id: "archive-2",
    title: "Kerala Pearl",
    category: "Hospitality website",
    description: "A considered digital experience for a Kerala restaurant.",
    image: "/images/portfolio-restaurant.png",
  },
  {
    _id: "archive-3",
    title: "HomesKerala",
    category: "Property platform",
    description: "A property discovery experience built around clear listings.",
    image: "/images/portfolio-realestate.png",
  },
  {
    _id: "archive-4",
    title: "EliteFit",
    category: "Fitness website",
    description: "A bold, accessible website concept for a fitness brand.",
    image: "/images/portfolio-fitness.png",
  },
  {
    _id: "archive-5",
    title: "CareFirst",
    category: "Healthcare website",
    description:
      "A clear interface for services, practitioners, and appointments.",
    image: "/images/portfolio-healthcare.png",
  },
  {
    _id: "archive-6",
    title: "Explore Kerala",
    category: "Travel website",
    description: "A visual destination and tour discovery experience.",
    image: "/images/portfolio-travel.png",
  },
];
export function safeProjectLink(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
export default function Portfolio({
  data,
}: {
  data?: PortfolioProject[] | null;
}) {
  const preview = !data?.length;
  const projects = preview ? archive : data;
  const [active, setActive] = useState(0);
  // Collapsed: 6 projects on desktop, 3 on mobile (extras hidden via CSS).
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? projects : projects.slice(0, 6);
  const current = visible[active] ?? visible[0];
  const currentLink = safeProjectLink(current.link);
  const count = String(projects.length).padStart(2, "0");
  return (
    <section id="portfolio" className="section work-section">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / SELECTED WORK</span>
            <h2>
              Ideas made tangible.
              <br />
              Work made to matter.
            </h2>
          </div>
          <p>
            {preview
              ? "A look through our existing design archive. These previews show the visual direction of each concept; published client case studies will follow."
              : "A selection of websites, platforms, and digital experiences from our portfolio."}
          </p>
        </div>
        <div className="work-layout">
          <div className="work-index">
          <ol className="work-index-list">
            {visible.map((project, i) => {
              const link = safeProjectLink(project.link);
              const isActive = i === active;
              const mobileExtra = !expanded && i >= 3;
              return (
                <li
                  key={project._id}
                  className={`work-row${isActive ? " is-active" : ""}${mobileExtra ? " is-mobile-extra" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  data-reveal
                >
                  <button
                    type="button"
                    className="work-row-trigger"
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={isActive}
                    aria-controls="work-preview"
                  >
                    <span className="work-row-number mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="work-row-title">{project.title}</span>
                    <span className="work-row-category mono">
                      {project.category}
                    </span>
                  </button>
                  {link && (
                    <a
                      className="work-row-link"
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title}`}
                    >
                      <ArrowUpRight size={20} />
                    </a>
                  )}
                  <div className="work-row-media">
                    <div className="work-row-image">
                      <ProjectImage project={project} sizes="(max-width: 900px) 100vw, 1px" />
                    </div>
                    <p>{project.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {projects.length > 3 && (
            <button
              type="button"
              className={`work-more${projects.length <= 6 ? " is-mobile-only" : ""}`}
              aria-expanded={expanded}
              onClick={() => {
                if (expanded && active >= 6) setActive(0);
                setExpanded(!expanded);
              }}
            >
              {expanded ? "Show fewer projects" : "View more projects"}
              <span aria-hidden="true">{expanded ? "−" : "+"}</span>
            </button>
          )}
          </div>
          <div
            id="work-preview"
            className="work-preview"
            aria-live="polite"
            data-reveal
          >
            <div className="work-preview-frame">
              {visible.map((project, i) => (
                <div
                  key={project._id}
                  className={`work-preview-image${i === active ? " is-active" : ""}`}
                  aria-hidden={i !== active}
                >
                  <ProjectImage project={project} sizes="(max-width: 899px) 100vw, 55vw" />
                </div>
              ))}
              <span className="work-preview-tag mono">
                {String(active + 1).padStart(2, "0")} / {count}
                {preview ? " · DESIGN PREVIEW" : ""}
              </span>
            </div>
            <div className="work-preview-caption">
              <div>
                <span className="mono">{current.category}</span>
                <p>{current.description}</p>
              </div>
              {currentLink && (
                <a
                  href={currentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Visit project <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function ProjectImage({
  project,
  sizes,
}: {
  project: PortfolioProject;
  sizes: string;
}) {
  return project.image ? (
    <Image
      src={project.image}
      alt={project.alt || `${project.title} website preview`}
      fill
      sizes={sizes}
      className="object-cover"
      unoptimized={!project.image.startsWith("/")}
    />
  ) : (
    <div className="project-placeholder">
      <span>{project.title}</span>
    </div>
  );
}
