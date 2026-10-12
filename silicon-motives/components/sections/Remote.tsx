"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { PinIcon } from "../ui/icons";

const { remote } = site;

// Kochi sits at the origin; arcs reach out to collaborators anywhere.
const ORIGIN = { x: 200, y: 250 };
const PEERS = [
  { x: 40, y: 70 },
  { x: 150, y: 40 },
  { x: 330, y: 60 },
  { x: 380, y: 170 },
  { x: 360, y: 330 },
  { x: 60, y: 350 },
];

function arc(to: { x: number; y: number }) {
  const mx = (ORIGIN.x + to.x) / 2;
  const my = (ORIGIN.y + to.y) / 2 - Math.hypot(to.x - ORIGIN.x, to.y - ORIGIN.y) * 0.35;
  return `M${ORIGIN.x} ${ORIGIN.y} Q${mx} ${my} ${to.x} ${to.y}`;
}

function SignalMap() {
  return (
    <svg viewBox="0 0 420 400" className="h-auto w-full overflow-visible" aria-hidden="true" focusable="false">
      <g stroke="currentColor" fill="none" className="text-cloud/15">
        {[60, 110, 160, 210].map((r) => (
          <circle key={r} data-ring="" cx={ORIGIN.x} cy={ORIGIN.y} r={r} strokeWidth="1" />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-lagoon">
        {PEERS.map((p, i) => (
          <path key={i} data-arc="" d={arc(p)} />
        ))}
      </g>
      {PEERS.map((p, i) => (
        <circle key={i} data-peer="" cx={p.x} cy={p.y} r="5" className="fill-monsoon stroke-cloud/70" strokeWidth="1.4" />
      ))}
      <circle data-pulse="" cx={ORIGIN.x} cy={ORIGIN.y} r="18" className="fill-lagoon/20" />
      <circle cx={ORIGIN.x} cy={ORIGIN.y} r="7" className="fill-lagoon" />
    </svg>
  );
}

export function Remote() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const map = ref.current!.querySelector("[data-map]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: map, start: "top 80%", end: "bottom 40%", scrub: 0.8 },
        });
        tl.from("[data-ring]", { scale: 0.4, opacity: 0, transformOrigin: "50% 50%", stagger: 0.1, ease: "power2.out" })
          .from("[data-arc]", { drawSVG: 0, stagger: 0.08, ease: "power2.inOut" }, 0.1)
          .from("[data-peer]", { scale: 0, transformOrigin: "50% 50%", stagger: 0.08, ease: "back.out(3)" }, 0.4);
        gsap.to("[data-pulse]", {
          scale: 2.2,
          opacity: 0,
          transformOrigin: "50% 50%",
          duration: 2.4,
          repeat: -1,
          ease: "power2.out",
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      data-header="dark"
      aria-labelledby="remote-title"
      className="grain on-dark section-y overflow-hidden bg-harbour text-cloud"
    >
      <div className="wrap">
        <div className="grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index={remote.index} tone="dark">
                {remote.eyebrow}
              </SectionLabel>
            </Reveal>
            <RevealText as="h2" id="remote-title" lines={remote.title} className="display t-h2 mt-8" />
            <Reveal className="mt-8 max-w-[32rem]">
              <p className="font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.25] text-cloud/90">{remote.lead}</p>
            </Reveal>
            <Reveal className="mt-10">
              <p className="label inline-flex items-center gap-2 rounded-full px-4 py-2 text-lagoon ring-1 ring-lagoon/40">
                <PinIcon size={14} />
                {remote.badge}
              </p>
            </Reveal>
          </div>
          <div data-map="" className="mx-auto w-full max-w-[30rem] lg:col-span-5">
            <SignalMap />
          </div>
        </div>

        <Reveal as="ul" stagger={0.1} className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-28">
          {remote.principles.map((p) => (
            <li key={p.name} className="border-t border-cloud/15 pt-6">
              <h3 className="display t-h3">{p.name}</h3>
              <p className="mt-4 text-[1.0625rem] leading-[1.6] text-mist">{p.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
