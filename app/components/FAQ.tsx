import { ArrowUpRight, Plus } from "lucide-react";
export const faqs = [
  {
    topic: "Getting started",
    q: "We have an idea, but no detailed plan. Is that okay?",
    short: "Absolutely. Most great products start exactly there.",
    a: "We shape it with you: clarify your goals, map the features that matter most, and turn the idea into a clear scope before any code is written.",
    link: ["Start a conversation", "#contact"],
  },
  {
    topic: "Why remote-first",
    q: "Why remote-first? Isn’t an office team safer?",
    short: "Quality comes from people and practices, not postcodes.",
    a: "Running lean means your budget goes into engineering (skilled people, modern tools, solid infrastructure, and quality) rather than office overhead. With agreed rhythms, regular demos, and direct access to the team, working remotely never means being distant from your project.",
    link: ["Who we are", "#about"],
  },
  {
    topic: "Services",
    q: "What kinds of projects can we bring you?",
    short: "Custom software, from first idea to live product.",
    a: "We build custom web applications and e-commerce platforms, CRM and ERP systems, Shopify and WordPress stores, and business websites, and we handle AWS hosting and deployment too.",
    link: ["See what we do", "#services"],
  },
  {
    topic: "Cost & timeline",
    q: "How do you scope and price a project?",
    short: "Clearly, and before any work begins.",
    a: "We discuss your goals, requirements, and constraints, then propose a scope, delivery approach, and estimate so you can make an informed decision. If priorities change along the way, we talk it through with you first.",
    link: ["Get an estimate", "#contact"],
  },
  {
    topic: "Working together",
    q: "What is it like working with a remote team?",
    short: "Close. You’ll always know where things stand.",
    a: "We agree on communication channels, milestones, and a working rhythm from the start. Regular demos, written updates, and direct conversations with the people building keep you close to the work.",
    link: ["How we work", "#approach"],
  },
  {
    topic: "Existing products",
    q: "Can you improve a website or app we already have?",
    short: "Yes. We can start right where you are.",
    a: "We review what you have, what’s working, and what’s holding it back, then recommend whether to improve, extend, or rebuild, based on what’s right for your business.",
    link: ["Tell us about it", "#contact"],
  },
  {
    topic: "Location",
    q: "Do you work with clients outside India?",
    short: "Yes. We work with clients around the world.",
    a: "Kerala is our home base, but our remote-first model is built for international work. We plan overlapping working hours with you, agree communication channels from day one, and share written updates so progress never waits on a meeting.",
    link: ["Who we are", "#about"],
  },
  {
    topic: "After launch",
    q: "What happens after the product goes live?",
    short: "We don’t disappear. We stay with you.",
    a: "We offer deployment, maintenance, and ongoing support, so your product stays secure, dependable, and ready for its next chapter.",
    link: ["Plan your launch", "#contact"],
  },
];
export default function FAQ() {
  return (
    <section id="faq" className="faq-wrap">
      <div className="section shell faq-section">
        <div className="faq-intro">
          <span className="eyebrow">07 / GOOD QUESTIONS</span>
          <h2>
            Good questions.
            <br />
            <span className="muted">Honest answers.</span>
          </h2>
          <p>
            Everything you might want to know before starting a project with
            us, answered plainly. No jargon, no sales script.
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
              Send it our way. Every message is read by our team, not a bot.
            </p>
            <a href="#contact" className="button button-primary">
              Ask us directly <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <details key={item.q} {...{ name: "faq" }} open={i === 0}>
              <summary>
                <span className="faq-num mono">Q.{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-q">
                  <span className="faq-topic mono">{item.topic}</span>
                  {item.q}
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
                  <strong>{item.short}</strong>
                  <p>{item.a}</p>
                  <a href={item.link[1]}>
                    {item.link[0]} <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
