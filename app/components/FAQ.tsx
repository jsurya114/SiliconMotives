import { ArrowUpRight, Plus } from "lucide-react";
import type { Faq } from "../lib/content";
export default function FAQ({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section id="faq" className="faq-wrap">
      <div className="section shell faq-section">
        <div className="faq-intro">
          <span className="eyebrow">07 / QUESTIONS</span>
          <h2>
            Good questions.
            <br />
            <span className="muted">Honest answers.</span>
          </h2>
          <p>
            The questions people usually ask before working with us, answered
            plainly.
          </p>
          <div className="faq-ask">
            <div className="faq-typing" aria-hidden="true">
              <span className="voice-avatar">SM</span>
              <span className="faq-dots">
                <i />
                <i />
                <i />
              </span>
            </div>
            <strong>Have a different question?</strong>
            <p>
              Send it our way. You’ll get an answer from an engineer, not a
              sales script.
            </p>
            <a href="#contact" className="button button-primary">
              Ask us directly <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <details key={item.id} {...{ name: "faq" }} open={i === 0}>
              <summary>
                <span className="faq-num mono">Q.{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-q">
                  <span className="faq-topic mono">{item.topic}</span>
                  {item.question}
                </span>
                <span className="faq-toggle" aria-hidden="true">
                  <Plus size={18} />
                </span>
              </summary>
              <div className="faq-thread">
                <span className="voice-avatar" aria-hidden="true">
                  SM
                </span>
                <div className="faq-reply">
                  <span className="mono">SILICONMOTIVES · TEAM REPLY</span>
                  {item.shortAnswer && <strong>{item.shortAnswer}</strong>}
                  <p>{item.answer}</p>
                  {item.linkLabel && item.linkHref && (
                    <a href={item.linkHref}>
                      {item.linkLabel} <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
