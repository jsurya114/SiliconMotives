import { Check } from "lucide-react";
const steps = [
  {
    title: "Understand",
    text: "We listen first. Together, we define the problem, the priorities, and what success looks like.",
    outcomes: ["Discovery conversation", "Agreed scope & priorities", "Estimate & delivery plan"],
  },
  {
    title: "Build with intent",
    text: "Small iterations, considered decisions, and regular demos keep your product moving in the right direction.",
    outcomes: ["Working demos", "Iterative releases", "Written progress updates"],
  },
  {
    title: "Deploy & evolve",
    text: "Testing, cloud setup, deployment, and clear documentation. We launch your product and keep its foundation solid for the next chapter.",
    outcomes: ["Testing & launch", "Cloud deployment", "Documentation & ongoing support"],
  },
];
const rhythm = [
  "Regular demos of real, working software",
  "Written updates you can read in minutes",
  "Direct conversations with the people building",
  "Overlapping working hours planned around your time zone",
];
export default function Approach() {
  return (
    <section id="approach" className="approach section">
      <div className="shell approach-layout">
        <div className="approach-intro">
          <span className="eyebrow">03 / THE WAY WE WORK</span>
          <h2>
            Close collaboration.
            <br />
            Wherever you are.
          </h2>
          <p>
            Remote is how we work. Accountability is how we deliver. There are
            no account-manager layers: you work directly with the engineers
            building your product.
          </p>
          <div className="rhythm-card" data-reveal>
            <span className="mono">HOW WE STAY CLOSE</span>
            <ul>
              {rhythm.map((item) => (
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
                <span className="mono">STEP 0{i + 1} / 03</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="approach-outcomes">
                  <span className="mono">WHAT YOU GET</span>
                  <ul>
                    {step.outcomes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
