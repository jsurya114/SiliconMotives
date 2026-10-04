import { ArrowUp, ArrowUpRight } from "lucide-react";
import Brand from "./Brand";
import LocalTime from "./LocalTime";
import { landingPages } from "../lib/landing";
const columns = [
  {
    title: "Capabilities",
    links: [
      ["Custom software", "/#capabilities"],
      ["Cloud infrastructure", "/#capabilities"],
      ["DevOps & reliability", "/#capabilities"],
      ["Case study", "/#case-study"],
      ["Agency partners", "/agency-partners"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Process", "/#process"],
      ["Team", "/#team"],
      ["Questions", "/#faq"],
      ["Engineering notes", "/blog"],
    ],
  },
  {
    title: "Services in India",
    links: landingPages.map((p) => [p.footerLabel, `/${p.slug}`]),
  },
  {
    title: "Get in touch",
    links: [
      ["Start a project", "/#contact"],
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
            Custom software,
            <br />
            cloud &amp; DevOps engineering.
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
        <span>Remote-first engineering, based in Kerala, India.</span>
        <a href="#" className="footer-top-link" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      </div>
    </footer>
  );
}
