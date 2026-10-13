"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SectionLabel } from "../ui/SectionLabel";
import { PinIcon } from "../ui/icons";

const { remote } = site;
const N = remote.principles.length;

// The section holds in place while each principle slides up over the last;
// it releases once the final card has settled. Without motion the cards
// simply sit in a list.
export function Remote() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-principle]", section);
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
        const bar = section.querySelector("[data-progress]");
        gsap.set(cards.slice(1), { yPercent: 115, opacity: 0 });
        gsap.set(steps.slice(1), { opacity: 0.35 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (N - 1) * 0.75}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(bar, { scaleX: 1 / N }, { scaleX: 1, ease: "none", duration: N - 1 }, 0);
        cards.slice(1).forEach((card, i) => {
          const at = i;
          tl.to(card, { yPercent: 0, opacity: 1 }, at)
            .to(cards[i], { scale: 0.94, opacity: 0, yPercent: -6 }, at)
            .to(steps[i + 1], { opacity: 1, duration: 0.4 }, at + 0.3)
            .to(steps[i], { opacity: 0.35, duration: 0.4 }, at + 0.3);
        });
        // A short beat at the end so the last card reads before the section moves on.
        tl.to({}, { duration: 0.35 });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      data-header="dark"
      aria-labelledby="remote-title"
      className="grain on-dark flex min-h-svh items-center overflow-hidden bg-harbour py-20 text-cloud lg:py-24"
    >
      <div className="wrap relative z-[2] grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-6">
          <SectionLabel index={remote.index} tone="dark">
            {remote.eyebrow}
          </SectionLabel>
          <h2 id="remote-title" className="display t-h2 mt-6 lg:mt-8">
            {remote.title.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i < remote.title.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[30rem] font-serif text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.3] text-cloud/90 lg:mt-8">{remote.lead}</p>
          <p className="label mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-lagoon ring-1 ring-lagoon/40 lg:mt-10">
            <PinIcon size={14} />
            {remote.badge}
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div aria-hidden="true" className="remote-steps mb-5 items-center gap-4">
            <div className="flex gap-3">
              {remote.principles.map((p, i) => (
                <span key={p.name} data-step="" className="label tabular-nums text-lagoon">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
            <span className="relative h-px flex-1 overflow-hidden bg-cloud/15">
              <span data-progress="" className="absolute inset-0 origin-left bg-lagoon" />
            </span>
          </div>
          <ul className="remote-stack grid gap-3">
            {remote.principles.map((p, i) => (
              <li
                key={p.name}
                data-principle=""
                className="rounded-[22px] bg-monsoon p-6 ring-1 ring-cloud/10 sm:p-8"
              >
                <p className="label tabular-nums text-lagoon">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] font-bold tracking-[-0.03em]">{p.name}</h3>
                <p className="mt-3 text-[1.0625rem] leading-[1.6] text-mist">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
