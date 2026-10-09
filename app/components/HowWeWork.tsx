"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, Cloud, Code2, Compass, FileText, Search } from "lucide-react";

const steps = [
  {
    title: "Understand",
    description: "We start with your goals, your users, and the problem worth solving.",
    outcome: "Shared goals and the right problem.",
    icon: Search,
  },
  {
    title: "Define",
    description: "Together, we agree on scope, priorities, and a practical technical direction.",
    outcome: "A focused scope and a clear plan.",
    icon: FileText,
  },
  {
    title: "Build & refine",
    description: "Our engineers work in clear iterations, sharing progress and incorporating feedback.",
    outcome: "Useful software, improved with you.",
    icon: Code2,
  },
  {
    title: "Launch & evolve",
    description: "We deliver carefully, document what matters, and plan the next improvements.",
    outcome: "A considered release and next steps.",
    icon: Cloud,
  },
];

export default function HowWeWork() {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const index = Number((visible.target as HTMLElement).dataset.step);
          if (Number.isFinite(index)) setActiveStep(index);
        }
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -25% 0px" },
    );

    stepsRef.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-we-work" className="approach-section">
      <div className="shell approach-layout">
        <div className="approach-intro">
          <span className="eyebrow">05 / HOW WE WORK</span>
          <h2>
            Good work takes shape.
            <br />
            <span className="muted">One clear step at a time.</span>
          </h2>
          <p>A thoughtful process keeps the right people involved, the next step clear, and the work moving forward.</p>

          <div className="approach-progress" aria-live="polite">
            <div className="approach-progress-meta mono">
              <span>YOUR PROJECT JOURNEY</span>
              <span><strong>{String(activeStep + 1).padStart(2, "0")}</strong> / 04</span>
            </div>
            <div
              className="approach-progress-track"
              role="progressbar"
              aria-label="Project journey progress"
              aria-valuemin={1}
              aria-valuemax={4}
              aria-valuenow={activeStep + 1}
            >
              <span style={{ transform: `scaleX(${(activeStep + 1) / steps.length})` }} />
            </div>
            <span className="approach-progress-title">{steps[activeStep].title}</span>
          </div>
          <div className="approach-aside-note"><Compass size={16} /> One team, from first conversation to launch.</div>
        </div>

        <div className="approach-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                className={`approach-step${activeStep === index ? " is-current" : ""}`}
                data-reveal
                data-step={index}
                key={step.title}
                ref={(node) => { stepsRef.current[index] = node; }}
              >
                <div className="approach-step-mark">
                  <span className="approach-step-number">0{index + 1}</span>
                  <span className="approach-step-icon"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
                </div>
                <div className="approach-step-copy">
                  <div className="approach-step-heading">
                    <h3>{step.title}</h3>
                    <span className="approach-step-arrow"><ArrowDownRight size={19} /></span>
                  </div>
                  <p>{step.description}</p>
                  <div className="approach-outcome"><span className="mono">{["FIRST, WE ALIGN ON", "THEN, WE SET", "NEXT, WE MAKE", "READY FOR WHAT’S NEXT"][index]}</span><span>{step.outcome}</span></div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
