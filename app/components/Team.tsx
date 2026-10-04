import { ArrowUpRight } from "lucide-react";
import { founders } from "../lib/company";

const remotePoints = [
  "Direct communication with the engineers on your project",
  "Clear ownership, from architecture to operations",
  "Working hours that overlap with yours where needed",
];

export default function Team() {
  return (
    <section id="team" className="section shell team-grid">
      <div>
        <span className="eyebrow">05 / TEAM</span>
        <h2>
          Small enough that every project matters.
          <br />
          <span className="muted">Experienced enough to own production systems.</span>
        </h2>
        <p className="team-lead">
          These are the people who will actually work on your product.
        </p>
        <ul className="founder-list">
          {founders.map((f) => (
            <li className="founder-card" key={f.name} data-reveal>
              <span className="avatar" aria-hidden="true">
                {f.initials}
              </span>
              <div>
                <strong>{f.name}</strong>
                <span>{f.role}</span>
                <em>{f.focus}</em>
              </div>
              <a
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${f.name} on LinkedIn`}
                className="founder-link"
              >
                LinkedIn <ArrowUpRight size={14} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="remote-block" data-reveal>
        <span className="mono">HOW WE’RE BUILT</span>
        <h3>Remote by design.</h3>
        <p>
          We’re a distributed engineering team based in Kerala, India. Instead
          of spending on large offices and layers of management, we put the
          budget into engineering talent, infrastructure, tools, testing and
          product quality.
        </p>
        <ul>
          {remotePoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="remote-footprint">
          <strong>A lighter footprint, by design.</strong> Less daily commuting
          and less reliance on large offices means less unnecessary resource
          use.
        </p>
      </div>
    </section>
  );
}
