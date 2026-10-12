"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  as?: "p" | "h2" | "h3";
  lines: readonly string[];
  className?: string;
  /** Starting colour — must still reach 3:1 on the section background. */
  from: string;
  to: string;
  id?: string;
};

/** A statement that darkens word by word as it is read. */
export function ScrubWords({ as: Tag = "p", lines, className, from, to, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Comp = Tag as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const words = el.querySelectorAll("[data-word]");
        gsap.fromTo(
          words,
          { color: from },
          {
            color: to,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.4 },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Comp ref={ref} id={id} className={className} style={{ color: to }}>
      {lines.map((line, li) => (
      <span key={li} className="block">
        {line.split(" ").map((w, wi, arr) => (
          <span key={wi}>
            <span data-word="">{w}</span>
            {wi < arr.length - 1 || li < lines.length - 1 ? " " : null}
          </span>
        ))}
      </span>
      ))}
    </Comp>
  );
}
