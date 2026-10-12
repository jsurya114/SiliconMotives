"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  as?: "div" | "ul" | "ol" | "section" | "p";
  children: ReactNode;
  className?: string;
  /** Stagger direct children instead of moving the block as one. */
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
  id?: string;
  [key: `data-${string}`]: string | undefined;
};

export function Reveal({ as: Tag = "div", children, className, stagger, y = 48, delay = 0, start = "top 85%", id, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Comp = Tag as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const targets = stagger ? Array.from(el.children) : [el];
        if (stagger) gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          targets,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: stagger ?? 0,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Comp ref={ref} id={id} className={className} data-reveal="" {...rest}>
      {children}
    </Comp>
  );
}
