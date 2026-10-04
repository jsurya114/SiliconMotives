import { ArrowUpRight } from "lucide-react";
const layers = [
  {
    title: "Interfaces & applications",
    layer: "PRESENTATION",
    text: "Responsive interfaces and fast, maintainable web applications.",
    tools: [
      ["React", "UI library"],
      ["Next.js", "App framework"],
      ["TypeScript", "Typed code"],
      ["JavaScript", "Language"],
    ],
  },
  {
    title: "Commerce & content",
    layer: "COMMERCE / CMS",
    text: "Flexible storefronts and content your team can manage.",
    tools: [
      ["Shopify", "Hosted commerce"],
      ["WordPress", "Content management"],
      ["WooCommerce", "WordPress commerce"],
    ],
  },
  {
    title: "Data & backend",
    layer: "LOGIC / DATA",
    text: "Structured data, business logic, and connected systems.",
    tools: [
      ["PostgreSQL", "Relational database"],
      ["Node.js", "Server runtime"],
      ["REST APIs", "Integrations"],
    ],
  },
  {
    title: "Cloud & delivery",
    layer: "INFRASTRUCTURE",
    text: "Hosting, managed databases, content delivery, and domain configuration.",
    tools: [
      ["AWS", "Cloud platform"],
      ["EC2", "Compute"],
      ["S3", "Storage"],
      ["RDS", "Managed database"],
      ["CloudFront", "Content delivery"],
      ["Route 53", "DNS & domains"],
    ],
  },
];
const pipeline = [
  "Environment setup",
  "CI/CD pipelines",
  "SSL & domains",
  "Backups",
  "Monitoring & support",
];
export default function Technologies() {
  return (
    <section id="technologies" className="section shell technology-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">04 / OUR TOOLKIT</span>
          <h2>
            The right technology.
            <br />
            For the right reasons.
          </h2>
        </div>
        <p>
          Staying lean lets us invest in modern tools and solid infrastructure.
          We choose every stack around your product, not our habits.
        </p>
      </div>
      <ol className="stack-list" aria-label="Technology stack, from interface to infrastructure">
        {layers.map((layer, i) => (
          <li className="stack-layer" key={layer.title} data-reveal>
            <div className="stack-meta">
              <span className="stack-index mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="stack-depth" aria-hidden="true">
                {layers.map((_, j) => (
                  <i key={j} className={j === i ? "is-active" : undefined} />
                ))}
              </span>
              <span className="stack-label mono">{layer.layer}</span>
            </div>
            <div className="stack-summary">
              <h3>{layer.title}</h3>
              <p>{layer.text}</p>
            </div>
            <ul className="stack-tools">
              {layer.tools.map(([name, role]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span className="mono">{role}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className="deployment-banner" data-reveal>
        <div className="deployment-copy">
          <div>
            <span className="eyebrow">DEVELOPMENT → DEPLOYMENT → SUPPORT</span>
            <h3>Built well. Launched right.</h3>
            <p>
              We take care of the path from your repository to a working
              product, and keep it dependable after launch.
            </p>
          </div>
          <a href="#contact" className="button button-outline">
            Plan your launch <ArrowUpRight size={18} />
          </a>
        </div>
        <ol className="pipeline" aria-label="Deployment pipeline">
          {pipeline.map((step, i) => (
            <li key={step}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
