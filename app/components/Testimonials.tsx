import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "../lib/content";

/** Up to three real, approved testimonials. Hidden when there are none. */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section id="testimonials" className="section testimonial-section">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CLIENTS</span>
            <h2>What our clients say.</h2>
          </div>
        </div>
        <div className="quote-grid">
          {items.map((t) => (
            <figure className="quote-card" key={t.id} data-reveal>
              <Quote size={26} strokeWidth={1} aria-hidden="true" />
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                {t.companyLogo ? (
                  <Image src={t.companyLogo} alt="" width={40} height={40} className="quote-logo" />
                ) : (
                  <span className="voice-avatar" aria-hidden="true">
                    {t.initials || t.name.charAt(0)}
                  </span>
                )}
                <div>
                  <strong>
                    {t.profileUrl ? (
                      <a href={t.profileUrl} target="_blank" rel="noopener noreferrer">
                        {t.name}
                      </a>
                    ) : (
                      t.name
                    )}
                  </strong>
                  <span>{[t.role, t.company].filter(Boolean).join(", ")}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
