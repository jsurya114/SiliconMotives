"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";

const processContent = site.process;
const N = processContent.steps.length;

/** A wave that passes through each node at mid-height, built at real pixel size. */
function routePath(w: number, h: number) {
  const col = w / N;
  const xs = Array.from({ length: N }, (_, i) => col * i + col / 2);
  const mid = h / 2;
  let d = `M${xs[0]} ${mid}`;
  for (let i = 1; i < N; i++) {
    const a = xs[i - 1];
    const b = xs[i];
    const amp = (i % 2 ? -1 : 1) * h * 0.42;
    d += ` C${a + col * 0.35} ${mid + amp} ${b - col * 0.35} ${mid + amp} ${b} ${mid}`;
  }
  return { d, xs };
}

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 120 });

  useEffect(() => {
    const el = routeRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.round(e.contentRect.width), h: 120 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { d, xs } = size.w ? routePath(size.w, size.h) : { d: "", xs: [] as number[] };

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
      const activate = (i: number, on: boolean) => steps[i]?.toggleAttribute("data-active", on);

      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, desktop: MQ.desktop, reduced: MQ.reduced }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) {
          steps.forEach((_, i) => activate(i, true));
          return;
        }
        if (desktop) {
          if (!size.w) return;
          const path = section.querySelector<SVGPathElement>("[data-route]")!;
          const beacon = section.querySelector<SVGCircleElement>("[data-beacon]")!;
          const stage = section.querySelector<HTMLElement>("[data-process-stage]")!;
          activate(0, true);
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=160%",
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => steps.forEach((_, i) => activate(i, self.progress >= i / (N - 1) - 0.02)),
            },
          });
          tl.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%" }, 0).to(
            beacon,
            { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] } },
            0,
          );
        } else {
          const line = section.querySelector("[data-vline]");
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: section.querySelector("[data-steps]"), start: "top 70%", end: "bottom 60%", scrub: true },
            },
          );
          steps.forEach((step, i) =>
            gsap.timeline({
              scrollTrigger: {
                trigger: step,
                start: "top 65%",
                onEnter: () => activate(i, true),
                onLeaveBack: () => activate(i, false),
              },
            }),
          );
        }
      });
      // This pin is created after layout is measured, i.e. after the triggers
      // further down the page. Re-order and re-measure everything.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
    { scope: ref, dependencies: [size.w], revertOnUpdate: true },
  );

  return (
    <section ref={ref} data-header="light" aria-labelledby="process-title" className="overflow-hidden bg-cloud-2 text-ink">
      <div
        data-process-stage=""
        className="wrap section-y lg:flex lg:h-svh lg:min-h-[720px] lg:flex-col lg:justify-center lg:!pt-20 lg:!pb-0"
      >
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <Reveal className="lg:col-span-12">
            <SectionLabel index={processContent.index}>{processContent.eyebrow}</SectionLabel>
          </Reveal>
          <RevealText as="h2" id="process-title" lines={processContent.title} className="display t-h2 lg:col-span-8" />
          <Reveal className="self-end lg:col-span-4">
            <p className="text-[1.1875rem] leading-[1.55] text-slate">{processContent.lead}</p>
          </Reveal>
        </div>

        {/* Desktop route */}
        <div ref={routeRef} className="relative mt-[8vh] hidden h-[120px] lg:block" aria-hidden="true">
          {size.w ? (
            <svg width={size.w} height={size.h} className="absolute inset-0 overflow-visible">
              <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 7" className="text-ink/25" />
              <path data-route="" d={d} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-lagoon-ink" />
              {xs.map((x, i) => (
                <circle key={i} cx={x} cy={size.h / 2} r="9" className="fill-cloud-2 stroke-ink/30" strokeWidth="1.5" />
              ))}
              <circle data-beacon="" cx={xs[0]} cy={size.h / 2} r="7" className="fill-lagoon-ink" />
            </svg>
          ) : null}
        </div>

        <ol data-steps="" className="relative mt-16 grid gap-12 pl-10 lg:mt-10 lg:grid-cols-5 lg:gap-6 lg:pl-0">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-ink/15 lg:hidden" />
          <span
            data-vline=""
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[11px] w-0.5 origin-top bg-lagoon-ink lg:hidden"
          />
          {processContent.steps.map((step, i) => (
            <li key={step.name} data-step="" className="group relative lg:text-center">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-10 size-[23px] rounded-full border-2 border-ink/25 bg-cloud-2 transition-colors duration-500 group-data-active:border-lagoon-ink group-data-active:bg-lagoon lg:hidden"
              />
              <p className="label text-slate transition-colors duration-500 group-data-active:text-lagoon-ink">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display t-h3 mt-3 text-slate transition-colors duration-500 group-data-active:text-ink">
                {step.name}
              </h3>
              <p className="mx-auto mt-4 max-w-[19rem] text-[1.0625rem] leading-[1.6] text-slate lg:mt-5">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
