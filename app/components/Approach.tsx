import { Check } from "lucide-react";
const steps = [
  {
    title: "Discovery",
    text: "We learn your goals, constraints and any existing systems before proposing anything.",
  },
  {
    title: "Architecture",
    text: "We design the system, data model and infrastructure, and agree the delivery plan and estimate.",
  },
  {
    title: "Build",
    text: "Small iterations with regular demos and code review, so priorities can change before they get expensive.",
  },
  {
    title: "Deploy",
    text: "Automated pipelines take code to production the same way every time, into an environment we set up properly.",
  },
  {
    title: "Operate",
    text: "After launch we keep the system healthy: monitoring, maintenance, updates and improvements.",
  },
];
const afterLaunch = [
  "Monitoring, logging and alerts",
  "Backups, patches and security updates",
  "Incident response and fixes",
  "Planned improvements as you grow",
];
export default function Approach() {
  return (
    <section id="process" className="approach section">
      <div className="shell approach-layout">
        <div className="approach-intro">
          <span className="eyebrow">03 / PROCESS</span>
          <h2>
            From discovery
            <br />
            to production.
          </h2>
          <p>
            A clear engineering process, and one team that owns the result. We
            don’t build something and disappear.
          </p>
          <div className="rhythm-card" data-reveal>
            <span className="mono">AFTER LAUNCH, WE STAY ON</span>
            <ul>
              {afterLaunch.map((item) => (
                <li key={item}>
                  <Check size={15} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ol className="approach-steps">
          {steps.map((step, i) => (
            <li className="approach-step" key={step.title} data-reveal>
              <span className="approach-numeral" aria-hidden="true">
                0{i + 1}
              </span>
              <div className="approach-step-body">
                <span className="mono">
                  STEP 0{i + 1} / 0{steps.length}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
