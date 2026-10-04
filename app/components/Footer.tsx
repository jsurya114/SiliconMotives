import { ArrowUp, ArrowUpRight } from "lucide-react";
import Brand from "./Brand";
import LocalTime from "./LocalTime";
import { landingPages } from "../lib/landing";
const columns = [
  {
    title: "Services",
    links: [
      ["Custom web applications", "/#services"],
      ["Custom e-commerce", "/#services"],
      ["CRM & ERP systems", "/#services"],
      ["Shopify & WordPress", "/#services"],
      ["Cloud & deployment", "/#services"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Our work", "/#portfolio"],
      ["How we work", "/#approach"],
      ["Technologies", "/#technologies"],
      ["Who we are", "/#about"],
      ["Engineering notes", "/blog"],
    ],
  },
  {
    title: "Kochi · Kerala · India",
    links: landingPages.map((p) => [p.metaTitle.replace(/ Company/, ""), `/${p.slug}`]),
  },
  {
    title: "Get in touch",
    links: [
      ["Start a project", "/#contact"],
      ["Good questions", "/#faq"],
      ["Client stories", "/#testimonials"],
      ["Share your experience", "/submit-testimonial"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <Brand />
          <p>
            Engineering value.
            <br />
            Not overhead.
          </p>
          <a href="/#contact" className="button button-primary">
            Start a project <ArrowUpRight size={18} />
          </a>
          <div className="footer-clock">
            <span className="status-dot" aria-hidden="true" />
            <span className="mono">KOCHI, KERALA</span>
            <span className="footer-time">
              <LocalTime /> <span className="mono">IST</span>
            </span>
          </div>
        </div>
        {columns.map((col) => (
          <nav className="footer-col" key={col.title} aria-label={col.title}>
            <span className="mono">{col.title.toUpperCase()}</span>
            <ul>
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} SiliconMotives. All rights reserved.</span>
        <span>Remote-first. Based in Kerala. Working with clients worldwide.</span>
        <a href="#" className="footer-top-link" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      </div>
    </footer>
  );
}
