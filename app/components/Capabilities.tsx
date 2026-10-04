import { ArrowUpRight, Cloud, Code2, GitBranch, Layers, Server, Workflow, type LucideIcon } from "lucide-react";
import type { Service } from "../lib/content";

const ICONS: Record<string, LucideIcon> = { Code2, Cloud, GitBranch, Layers, Server, Workflow };

export default function Capabilities({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <section id="capabilities" className="section shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / CAPABILITIES</span>
          <h2>
            Three disciplines.
            <br />
            One accountable team.
          </h2>
        </div>
        <p>
          The same engineers design your system, build it, deploy it and keep it
          running, so nothing is lost between hand-offs.
        </p>
      </div>
      <div className="cap-grid">
        {services.map((pillar, i) => {
          const Icon = ICONS[pillar.icon] ?? Code2;
          return (
          <article className="cap-card" key={pillar.id} data-reveal>
            <div className="cap-top">
              <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
              <span className="mono">0{i + 1}</span>
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
            <ul className="cap-list">
              {pillar.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="cap-tools" aria-label="Tools">
              {pillar.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </article>
          );
        })}
      </div>
      <p className="cap-also">
        <span className="mono">ALSO</span>
        Websites, Shopify and WordPress builds for businesses in India:{" "}
        <a href="/web-design-company-kochi">
          website design <ArrowUpRight size={13} />
        </a>{" "}
        <a href="/ecommerce-website-development-kerala">
          e-commerce <ArrowUpRight size={13} />
        </a>
      </p>
    </section>
  );
}
