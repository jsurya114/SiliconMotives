"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote, Star } from "lucide-react";
export interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
}
const pad = (n: number) => String(n).padStart(2, "0");
const stars = (rating: number) => Math.min(5, Math.max(1, Math.round(rating)));
export default function Testimonials({
  data,
}: {
  data?: TestimonialData[] | null;
}) {
  const reviews = data ?? [];
  const [active, setActive] = useState(0);
  const current = reviews[active];
  const average =
    reviews.reduce((sum, r) => sum + stars(r.rating), 0) /
    Math.max(reviews.length, 1);
  if (!current) return null;
  const go = (step: number) =>
    setActive((i) => (i + step + reviews.length) % reviews.length);
  return (
    <section id="testimonials" className="section testimonial-section">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CLIENT STORIES</span>
            <h2>
              What our clients
              <br />
              say about us.
            </h2>
          </div>
          <p>
            The experience of working together matters as much as the software
            we deliver.
          </p>
        </div>
        <>
            <div className="voice-layout">
              <figure className="voice-feature" aria-live="polite">
                <div className="voice-feature-top">
                  <Quote size={36} strokeWidth={1} aria-hidden="true" />
                  <div
                    className="voice-stars"
                    role="img"
                    aria-label={`${stars(current.rating)} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        aria-hidden="true"
                        fill={i < stars(current.rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <blockquote key={current._id}>“{current.quote}”</blockquote>
                <figcaption>
                  <span className="voice-avatar">
                    {current.initials || current.name.charAt(0)}
                  </span>
                  <div>
                    <strong>{current.name}</strong>
                    <span>{current.role}</span>
                  </div>
                  {reviews.length > 1 && (
                    <div className="voice-controls">
                      <span className="mono">
                        {pad(active + 1)} / {pad(reviews.length)}
                      </span>
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Previous review"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Next review"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </figcaption>
              </figure>
              {reviews.length > 1 && (
                <ul className="voice-list" aria-label="All client reviews">
                  {reviews.map((item, i) => (
                    <li key={item._id}>
                      <button
                        type="button"
                        className={i === active ? "is-active" : undefined}
                        aria-pressed={i === active}
                        onClick={() => setActive(i)}
                      >
                        <span className="voice-avatar">
                          {item.initials || item.name.charAt(0)}
                        </span>
                        <span className="voice-list-text">
                          <strong>{item.name}</strong>
                          <span>{item.role}</span>
                        </span>
                        <span className="mono">{pad(i + 1)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="voice-summary">
              <div>
                <strong>{average.toFixed(1)}</strong>
                <span className="mono">AVERAGE RATING / 5</span>
              </div>
              <div>
                <strong>{pad(reviews.length)}</strong>
                <span className="mono">
                  {reviews.length === 1 ? "CLIENT REVIEW" : "CLIENT REVIEWS"}
                </span>
              </div>
              <a className="button button-outline" href="/submit-testimonial">
                Share your experience <ArrowUpRight size={18} />
              </a>
            </div>
        </>
      </div>
    </section>
  );
}
