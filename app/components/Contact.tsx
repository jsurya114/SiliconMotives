"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
export default function Contact() {
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
          <span className="eyebrow">08 / LET’S MAKE IT HAPPEN</span>
          <h2>
            Something
            <br />
            on your mind<span>?</span>
          </h2>
          <p>
            A new idea. A product to improve. A problem worth solving. Tell us
            what you’re thinking, and you’ll hear back from the people who
            would actually build it.
          </p>
          <div className="contact-note">
            <span className="status-dot" /> No sales scripts. Just a real
            conversation with engineers.
          </div>
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
            What can we help you with?
            <select id="contact-service" name="service" defaultValue="">
              <option value="">Select a service (optional)</option>
              <option value="web-development">Custom web application</option>
              <option value="custom-ecommerce">Custom e-commerce platform</option>
              <option value="crm-erp">CRM & ERP systems</option>
              <option value="shopify-wordpress">Shopify & WordPress</option>
              <option value="static-website">Business website</option>
              <option value="cloud-deployment">AWS hosting & deployment</option>
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
