import { ArrowUpRight, Check } from "lucide-react";
import { partnerPrinciples, partnerScope } from "../lib/partners";

export default function Partners() {
  return (
    <section id="partners" className="section shell partners">
      <div className="section-heading">
        <div>
          <span className="eyebrow">04 / AGENCY PARTNERS</span>
          <h2>
            Your client.
            <br />
            Our engineering.
          </h2>
        </div>
        <p>
          A white-label or overflow engineering partner for agencies that need
          backend, cloud or DevOps capacity they don’t have in-house.
        </p>
      </div>
      <div className="partners-grid">
        <div className="partners-card" data-reveal>
          <span className="mono">WHAT WE TAKE ON</span>
          <ul className="partners-scope">
            {partnerScope.map((s) => (
              <li key={s.title}>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="partners-card partners-principles" data-reveal>
          <span className="mono">HOW WE WORK WITH AGENCIES</span>
          <ul>
            {partnerPrinciples.map((p) => (
              <li key={p.title}>
                <Check size={16} aria-hidden="true" />
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </div>
              </li>
            ))}
          </ul>
          <a href="/agency-partners" className="button button-primary">
            Partner with us <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
