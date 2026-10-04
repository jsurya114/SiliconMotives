import { ArrowUpRight } from "lucide-react";
import { caseStudy } from "../lib/company";

/** Request path through the platform, top to bottom. */
const flow = [
  { tier: "USERS", name: "Customers", detail: "Web & mobile browsers" },
  { tier: "DNS", name: "Route 53", detail: "Domains & routing" },
  { tier: "EDGE", name: "CloudFront", detail: "CDN & edge caching" },
  { tier: "APPLICATION", name: "EC2", detail: "Application & API servers" },
];
const data = [
  { tier: "DATABASE", name: "RDS", detail: "Managed relational database" },
  { tier: "STORAGE", name: "S3", detail: "Media & static assets" },
];

export default function CaseStudy() {
  const label = caseStudy.clientName || caseStudy.title;
  return (
    <section id="case-study" className="case-section">
      <div className="section shell case-grid">
        <div className="case-copy">
          <span className="eyebrow">02 / CASE STUDY</span>
          <h2>
            {caseStudy.clientName ? `${caseStudy.clientName}.` : "A production e-commerce platform."}
            <br />
            <span className="muted">Built and operated by us.</span>
          </h2>
          <dl className="case-stats">
            <div>
              <dt className="mono">USERS</dt>
              <dd>{caseStudy.users}</dd>
            </div>
            <div>
              <dt className="mono">INFRASTRUCTURE</dt>
              <dd>AWS</dd>
            </div>
            <div>
              <dt className="mono">ENGAGEMENT</dt>
              <dd>Ongoing</dd>
            </div>
          </dl>
          <p>{caseStudy.summary}</p>
          <span className="mono case-role-label">OUR ROLE</span>
          <ul className="case-role">
            {caseStudy.role.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          {caseStudy.url && (
            <a
              className="text-link"
              href={caseStudy.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {label} <ArrowUpRight size={16} />
            </a>
          )}
        </div>

        <figure className="arch" data-reveal>
          <figcaption className="arch-caption mono">
            PRODUCTION ARCHITECTURE · AWS
          </figcaption>
          <ol className="arch-flow" aria-label="Request path">
            {flow.map((node, i) => (
              <li className="arch-node" key={node.name} style={{ "--i": i } as React.CSSProperties}>
                <span className="mono">{node.tier}</span>
                <strong>{node.name}</strong>
                <em>{node.detail}</em>
              </li>
            ))}
          </ol>
          <ul className="arch-data" aria-label="Data layer">
            {data.map((node, i) => (
              <li
                className="arch-node"
                key={node.name}
                style={{ "--i": flow.length + i } as React.CSSProperties}
              >
                <span className="mono">{node.tier}</span>
                <strong>{node.name}</strong>
                <em>{node.detail}</em>
              </li>
            ))}
          </ul>
          <div className="arch-ops">
            <div>
              <span className="mono">DELIVERY</span>
              <p>CI/CD pipeline → automated deployments</p>
            </div>
            <div>
              <span className="mono">OPERATIONS</span>
              <p>Monitoring · backups · maintenance</p>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
