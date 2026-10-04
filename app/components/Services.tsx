import {
  ArrowUpRight,
  Cloud,
  FileCode2,
  Layers3,
  Workflow,
} from "lucide-react";
const featured = [
  {
    title: "Custom web applications",
    text: "Platforms, portals, dashboards, and SaaS products shaped around how your business actually works, not around a template.",
    includes: [
      "Product design & UX",
      "APIs & business logic",
      "Admin dashboards & roles",
      "Integrations & automation",
    ],
    stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
    visual: "app",
  },
  {
    title: "Custom e-commerce platforms",
    text: "Storefronts built from the ground up when off-the-shelf won’t fit: your catalogue, your checkout, your rules.",
    includes: [
      "Custom storefront & checkout",
      "Payments & order management",
      "Inventory & catalogue tools",
      "Store admin & reporting",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
    visual: "store",
  },
] as const;
const services = [
  {
    icon: Workflow,
    title: "CRM & ERP systems",
    text: "Leads, customers, operations, and reporting in one connected workflow.",
    tags: "CRM / ERP / AUTOMATION",
  },
  {
    icon: Layers3,
    title: "Shopify & WordPress",
    text: "Shopify stores, WordPress sites, and WooCommerce, set up for your team to run.",
    tags: "SHOPIFY / WORDPRESS / WOO",
  },
  {
    icon: FileCode2,
    title: "Business websites",
    text: "Fast company sites and landing pages with clear content and solid SEO foundations.",
    tags: "LANDING PAGES / SEO",
  },
  {
    icon: Cloud,
    title: "Cloud & deployment",
    text: "AWS hosting, CI/CD, and ongoing maintenance to go live and stay dependable.",
    tags: "AWS / CI/CD / SUPPORT",
  },
];
function AppVisual() {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" className="svc-visual">
      <rect x="0.5" y="0.5" width="319" height="199" rx="6" className="svc-frame" />
      <line x1="0" y1="22" x2="320" y2="22" />
      <circle cx="12" cy="11" r="2.5" className="svc-fill" />
      <circle cx="21" cy="11" r="2.5" className="svc-fill" />
      <circle cx="30" cy="11" r="2.5" className="svc-fill" />
      <line x1="64" y1="22" x2="64" y2="200" />
      <rect x="12" y="34" width="40" height="5" rx="2" className="svc-fill" />
      <rect x="12" y="48" width="30" height="5" rx="2" className="svc-dim" />
      <rect x="12" y="62" width="34" height="5" rx="2" className="svc-dim" />
      <rect x="12" y="76" width="26" height="5" rx="2" className="svc-dim" />
      <rect x="78" y="34" width="68" height="36" rx="3" />
      <rect x="156" y="34" width="68" height="36" rx="3" />
      <rect x="234" y="34" width="72" height="36" rx="3" />
      <rect x="86" y="44" width="22" height="4" rx="2" className="svc-dim" />
      <rect x="86" y="54" width="36" height="7" rx="2" className="svc-fill" />
      <rect x="164" y="44" width="22" height="4" rx="2" className="svc-dim" />
      <rect x="164" y="54" width="30" height="7" rx="2" className="svc-fill" />
      <rect x="242" y="44" width="22" height="4" rx="2" className="svc-dim" />
      <rect x="242" y="54" width="40" height="7" rx="2" className="svc-fill" />
      <rect x="78" y="80" width="228" height="106" rx="3" />
      <g className="svc-bars">
        {[46, 62, 38, 74, 56, 84, 66, 92, 70, 80].map((h, i) => (
          <rect
            key={i}
            x={94 + i * 21}
            y={176 - h}
            width="11"
            height={h}
            className={i === 7 ? "svc-fill" : "svc-dim"}
          />
        ))}
      </g>
    </svg>
  );
}
function StoreVisual() {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" className="svc-visual">
      <rect x="0.5" y="0.5" width="319" height="199" rx="6" className="svc-frame" />
      <line x1="0" y1="22" x2="320" y2="22" />
      <rect x="12" y="8" width="34" height="6" rx="2" className="svc-fill" />
      <rect x="128" y="9" width="20" height="4" rx="2" className="svc-dim" />
      <rect x="156" y="9" width="20" height="4" rx="2" className="svc-dim" />
      <rect x="184" y="9" width="20" height="4" rx="2" className="svc-dim" />
      <rect x="294" y="6" width="14" height="10" rx="2" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={12 + i * 66} y="34" width="56" height="64" rx="3" />
          <rect x={12 + i * 66} y="106" width="40" height="4" rx="2" className="svc-dim" />
          <rect x={12 + i * 66} y="116" width="22" height="5" rx="2" className="svc-fill" />
          <rect x={12 + i * 66} y="128" width="56" height="14" rx="3" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={12 + i * 66} y="152" width="56" height="36" rx="3" className="svc-ghost" />
      ))}
      <rect x="214" y="34" width="94" height="154" rx="3" />
      <rect x="224" y="44" width="40" height="5" rx="2" className="svc-fill" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="224" y={60 + i * 24} width="16" height="16" rx="2" className="svc-dim" />
          <rect x="246" y={63 + i * 24} width="34" height="4" rx="2" className="svc-dim" />
          <rect x="246" y={70 + i * 24} width="20" height="4" rx="2" className="svc-dim" />
        </g>
      ))}
      <line x1="224" y1="140" x2="298" y2="140" />
      <rect x="224" y="148" width="26" height="4" rx="2" className="svc-dim" />
      <rect x="276" y="147" width="22" height="6" rx="2" className="svc-fill" />
      <rect x="224" y="164" width="74" height="16" rx="3" className="svc-fill" />
    </svg>
  );
}
export default function Services() {
  return (
    <section id="services" className="section shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / WEB DESIGN &amp; DEVELOPMENT</span>
          <h2>
            Software built for your business.
            <br />
            By the people you talk to.
          </h2>
        </div>
        <p>
          One accountable team designs, builds, and deploys your software, with
          no hand-offs and no layers between you and the engineers.
        </p>
      </div>
      <div className="svc-featured">
        {featured.map((item, i) => (
          <article className="svc-feature" key={item.title} data-reveal>
            <div className="svc-feature-copy">
              <span className="svc-kicker mono">
                0{i + 1} / {i === 0 ? "FLAGSHIP" : "CUSTOM BUILD"}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ul className="svc-includes">
                {item.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="svc-visual-wrap">
              {item.visual === "app" ? <AppVisual /> : <StoreVisual />}
            </div>
            <div className="svc-feature-foot">
              <span className="svc-stack mono">
                BUILT WITH {item.stack.join(" · ").toUpperCase()}
              </span>
              <a
                href="#contact"
                className="svc-cta"
                aria-label={`Discuss ${item.title.toLowerCase()}`}
              >
                Discuss a project <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="svc-grid">
        {services.map((service, i) => (
          <article className="svc-card" key={service.title} data-reveal>
            <div className="svc-card-top">
              <service.icon size={24} strokeWidth={1.4} />
              <span className="mono">0{i + 3}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <span className="svc-card-tags mono">{service.tags}</span>
            <a
              href="#contact"
              aria-label={`Discuss ${service.title.toLowerCase()}`}
              className="svc-card-link"
            >
              <ArrowUpRight size={20} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
