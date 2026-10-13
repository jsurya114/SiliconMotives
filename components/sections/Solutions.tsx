"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { ArrowIcon } from "../ui/icons";

const { solutions } = site;

export function Solutions() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-row]", ref.current).forEach((row) => {
          const rule = row.querySelector("[data-rule]");
          const parts = row.querySelectorAll("[data-part]");
          gsap.set(row, { opacity: 1 });
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 82%", once: true } })
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" })
            .fromTo(parts, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08 }, 0.25);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="solutions" data-header="light" aria-labelledby="solutions-title" className="section-y bg-cloud text-ink">
      <div className="wrap">
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <Reveal className="lg:col-span-12">
            <SectionLabel index={solutions.index}>{solutions.eyebrow}</SectionLabel>
          </Reveal>
          <RevealText as="h2" id="solutions-title" lines={solutions.title} className="display t-h2 lg:col-span-9" />
          <Reveal className="self-end lg:col-span-3">
            <p className="text-[1.1875rem] leading-[1.55] text-slate">{solutions.lead}</p>
          </Reveal>
        </div>

        <ol className="mt-14 border-b border-ink/20 lg:mt-20">
          {solutions.items.map((item) => (
            <li key={item.name} data-row="" data-reveal="" className="group relative">
              <span data-rule="" aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20" />
              <div className="grid gap-y-4 py-9 md:grid-cols-12 md:gap-x-8 lg:py-12">
                <p data-part="" className="label text-lagoon-ink md:col-span-3 md:pt-3">
                  {item.kicker}
                </p>
                <h3
                  data-part=""
                  className="display text-[clamp(2rem,4vw,3.75rem)] !leading-[0.96] transition-transform duration-700 ease-[var(--ease-expo)] md:col-span-5 lg:group-hover:translate-x-3"
                >
                  {item.name}
                </h3>
                <div data-part="" className="md:col-span-4 md:pt-2">
                  <p className="text-[1.0625rem] leading-[1.6] text-slate">{item.body}</p>
                  <a href="#contact" className="mt-5 inline-flex items-center gap-2 font-display text-[0.9375rem] font-semibold">
                    <span className="link-line">{item.cta}</span>
                    <ArrowIcon size={14} />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
