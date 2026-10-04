import { ArrowUpRight, Plus } from "lucide-react";
export const faqs = [
  {
    topic: "Scope",
    q: "What kinds of projects do you take on?",
    short: "Custom software, AWS infrastructure and DevOps, plus the operations that follow.",
    a: "Typical work includes business applications and SaaS platforms, backend systems and APIs, AWS environments, CI/CD and production support. For businesses in India we also build websites, Shopify and WordPress stores.",
    link: ["See capabilities", "#capabilities"],
  },
  {
    topic: "Existing systems",
    q: "Can you take over an existing production system?",
    short: "Yes. We start by understanding it before changing anything.",
    a: "We review the code, infrastructure, deployments and monitoring, document what we find, and agree priorities with you. Then we stabilise, improve and take on day-to-day operations.",
    link: ["Discuss your system", "#contact"],
  },
  {
    topic: "International",
    q: "Do you work with international clients?",
    short: "Our client work so far has been in India, and we’re now opening to U.S. and international teams.",
    a: "We’ve built and operate production systems for businesses in India, including an e-commerce platform with 5,000+ users on AWS. We’re now taking on projects and agency partnerships with U.S. and international companies, often starting with a small, well-scoped pilot.",
    link: ["Agency partnerships", "/agency-partners"],
  },
  {
    topic: "Time zones",
    q: "How do you communicate across time zones?",
    short: "Agreed overlap hours, written updates and regular demos.",
    a: "We agree communication channels and overlapping hours at the start. Written progress updates and demos of working software mean progress never waits on a meeting, and you can always talk to the engineers directly.",
    link: ["How we work", "#process"],
  },
  {
    topic: "After launch",
    q: "What happens after launch?",
    short: "We stay responsible for keeping it running.",
    a: "We can run the production system for you: monitoring and alerts, backups, security updates, incident response and planned improvements, on a retainer that fits your needs.",
    link: ["Start a project", "#contact"],
  },
];
export default function FAQ() {
  return (
    <section id="faq" className="faq-wrap">
      <div className="section shell faq-section">
        <div className="faq-intro">
          <span className="eyebrow">06 / QUESTIONS</span>
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
