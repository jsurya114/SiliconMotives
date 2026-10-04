import { ArrowRight } from "lucide-react";
import ArchitectureDiagram from "./ArchitectureDiagram";
import type { CaseStudy as CaseStudyData } from "../lib/content";

/** Featured technical case study on the homepage. */
export default function CaseStudy({ data }: { data: CaseStudyData | undefined }) {
  if (!data) return null;
  return (
    <section id="case-study" className="case-section">
      <div className="section shell case-grid">
        <div className="case-copy">
          <span className="eyebrow">02 / CASE STUDY</span>
          <h2>
            {data.clientName ?? data.title}
            {data.headline && (
              <>
                <br />
                <span className="muted">{data.headline}</span>
              </>
            )}
          </h2>
          {data.summary && <p>{data.summary}</p>}
          {data.responsibilities.length > 0 && (
            <>
              <span className="mono case-role-label">WHAT WE OWN</span>
              <ul className="case-role">
                {data.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}
          {data.metrics.length > 0 && (
            <dl className="case-stats">
              {data.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="mono">{m.label.toUpperCase()}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <a className="text-link case-more" href={`/case-studies/${data.slug}`}>
            Read the full case study <ArrowRight size={16} />
          </a>
        </div>
        <ArchitectureDiagram nodes={data.architecture} />
      </div>
    </section>
  );
}
