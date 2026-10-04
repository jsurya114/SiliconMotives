import { ArrowUpRight, Cloud, Code2, GitBranch } from "lucide-react";
import { stack } from "../lib/company";

const pillars = [
  {
    icon: Code2,
    title: "Custom software engineering",
    text: "Business applications, SaaS platforms and backend systems shaped around how your business actually works.",
    items: [
      "Custom business applications & internal tools",
      "SaaS platforms & customer portals",
      "Backend systems & REST APIs",
      "CRM / ERP systems & dashboards",
      "Payment & third-party integrations",
    ],
    tools: stack.software,
  },
  {
    icon: Cloud,
    title: "Cloud & infrastructure engineering",
    text: "AWS architecture for production workloads: designed, built and kept healthy as your traffic and data grow.",
    items: [
      "AWS architecture & production setup",
      "CDN, DNS & networking",
      "Scaling, backups & recovery",
      "Cloud cost optimization",
      "Migrations to AWS",
    ],
    tools: stack.cloud,
  },
  {
    icon: GitBranch,
    title: "DevOps & reliability",
    text: "Repeatable delivery and steady production operations, so releases are routine and problems surface early.",
    items: [
      "CI/CD & automated deployments",
      "Infrastructure as code with Terraform",
      "Monitoring, logging & alerts",
      "Security hardening & backup strategy",
      "Ongoing production support",
    ],
    tools: stack.devops,
  },
];

export default function Capabilities() {
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
        {pillars.map((pillar, i) => (
          <article className="cap-card" key={pillar.title} data-reveal>
            <div className="cap-top">
              <pillar.icon size={26} strokeWidth={1.4} aria-hidden="true" />
              <span className="mono">0{i + 1}</span>
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
            <ul className="cap-list">
              {pillar.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="cap-tools" aria-label="Tools">
              {pillar.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </article>
        ))}
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
