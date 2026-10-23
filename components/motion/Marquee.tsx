"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop at rest. */
  speed?: number;
};

/** A continuous ticker with enough hidden copies to fill the viewport. */
export function Marquee({ children, className = "", speed = 40 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);
  const [copies, setCopies] = useState(2);

  useGSAP(
    () => {
      const el = ref.current;
      const track = el?.querySelector<HTMLElement>("[data-track]");
      const primary = el?.querySelector<HTMLElement>("[data-primary]");
      if (!el || !track || !primary) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const setX = gsap.quickSetter(track, "x", "px");
        let width = 0;
        let x = 0;
        let visible = true;

        const measure = () => {
          const nextWidth = primary.getBoundingClientRect().width;
          if (nextWidth <= 0) return;
          // Preserve the position within the loop when fonts or layout change.
          x = width > 0 ? (x / width) * nextWidth : 0;
          width = nextWidth;
          setCopies(Math.max(2, Math.ceil(el.clientWidth / width) + 1));
          setX(x);
        };
        const resize = new ResizeObserver(measure);
        resize.observe(el);
        resize.observe(primary);
        measure();

        const intersection = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        intersection.observe(el);

        const tick = (_t: number, dt: number) => {
          if (!visible || focused.current || document.hidden || width <= 0) return;
          // Wrap by one measured content run, regardless of the number of copies.
          // Limit delayed frames so resuming a tab never jumps through the list.
          x = (x - (width / Math.max(speed, 1)) * (Math.min(dt, 64) / 1000)) % width;
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          resize.disconnect();
          intersection.disconnect();
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [speed], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={`marquee overflow-hidden ${className}`}>
      <div onFocusCapture={() => { focused.current = true; }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) focused.current = false; }}>
        <div data-track="" className="flex w-max will-change-transform">
          <div data-primary="" className="flex shrink-0">{children}</div>
          {Array.from({ length: copies - 1 }, (_, index) => (
            <div key={index} data-duplicate="" className="flex shrink-0" aria-hidden="true" inert>
              {children}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
