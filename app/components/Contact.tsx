"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, CalendarDays, CheckCircle2, Mail } from "lucide-react";
export default function Contact({
  contact,
}: {
  contact?: { email: string; bookingUrl: string };
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Unable to send");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <section id="contact" className="contact-section">
      <div className="shell contact-grid">
        <div>
          <span className="eyebrow">09 / START A PROJECT</span>
          <h2>
            Something
            <br />
            on your mind<span>?</span>
          </h2>
          <p>
            A new product, a system that needs to scale, or infrastructure that
            needs an owner. Tell us about it and an engineer will reply.
          </p>
          <div className="contact-note">
            <span className="status-dot" /> Prefer to start small? Ask about a
            pilot project.
          </div>
          {(contact?.email || contact?.bookingUrl) && (
            <div className="contact-direct">
              {contact.bookingUrl && (
                <a href={contact.bookingUrl} target="_blank" rel="noopener noreferrer">
                  <CalendarDays size={16} aria-hidden="true" /> Book a call
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`}>
                  <Mail size={16} aria-hidden="true" /> {contact.email}
                </a>
              )}
            </div>
          )}
        </div>
        <form onSubmit={submit} className="contact-form">
          <div className="form-row">
            <label htmlFor="contact-name">
              Your name
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder="Alex Morgan"
                required
                maxLength={100}
              />
            </label>
            <label htmlFor="contact-email">
              Email address
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="alex@company.com"
                required
                maxLength={254}
              />
            </label>
          </div>
          <label htmlFor="contact-service">
            What can we help with?
            <select id="contact-service" name="service" defaultValue="">
              <option value="">Select a topic (optional)</option>
              <option value="custom-software">Custom software / backend</option>
              <option value="cloud-infrastructure">AWS cloud infrastructure</option>
              <option value="devops">DevOps, CI/CD &amp; reliability</option>
              <option value="takeover">Take over an existing system</option>
              <option value="agency-partnership">Agency partnership</option>
              <option value="website">Website, Shopify or WordPress</option>
              <option value="other">Something else</option>
            </select>
          </label>
          <label htmlFor="contact-message">
            A little about your project
            <textarea
              id="contact-message"
              name="message"
              placeholder="What would you like to build?"
              required
              minLength={10}
              maxLength={2000}
              rows={3}
            />
          </label>
          <p className="form-privacy">
            We’ll use these details to respond to your enquiry.
          </p>
          <button
            className="button button-primary"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending enquiry…" : "Start a conversation"}
            <ArrowUpRight size={18} />
          </button>
          <div aria-live="polite" aria-atomic="true">
            {status === "success" && (
              <p className="form-success">
                <CheckCircle2 size={18} />
                Thanks for reaching out. Your enquiry has been received.
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="form-error">
                Your enquiry couldn’t be sent. Your details are still
                here—please try again shortly.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
