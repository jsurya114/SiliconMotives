"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop at rest. */
  speed?: number;
  label: string;
};

/**
 * Velocity-reactive ticker. The first run is the real content; the second is
 * an aria-hidden duplicate so the loop is seamless.
 */
export function Marquee({ children, className = "", speed = 40, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const interaction = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      const track = el?.querySelector<HTMLElement>("[data-track]");
      if (!el || !track) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const setX = gsap.quickSetter(track, "xPercent");
        const wrap = gsap.utils.wrap(-50, 0);
        let x = 0;
        let dir = -1;
        let boost = 0;
        let visible = false;

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (visible = self.isActive),
          onUpdate: (self) => {
            const v = self.getVelocity();
            dir = v < 0 ? 1 : -1;
            boost = Math.min(Math.abs(v) / 300, 6);
          },
        });

        const tick = (_t: number, dt: number) => {
          if (!visible || paused.current || interaction.current || document.hidden) return;
          const base = (50 / speed) * (dt / 1000);
          x = wrap(x + dir * base * (1 + boost));
          boost *= 0.92;
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`marquee overflow-hidden ${className}`}>
      <div onPointerEnter={() => { interaction.current = true; }} onPointerLeave={() => { interaction.current = false; }} onFocusCapture={() => { interaction.current = true; }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) interaction.current = false; }}>
      <div data-track="" className="flex w-max will-change-transform">
        <div data-primary="" className="flex shrink-0">{children}</div>
        <div data-duplicate="" className="flex shrink-0" aria-hidden="true" inert>
          {children}
        </div>
      </div>
      </div>
      <div className="wrap mt-6 flex justify-end motion-reduce:hidden">
        <button type="button" className="label min-h-11 rounded-full border border-current/30 px-4" aria-label={`${isPaused ? 'Resume' : 'Pause'} ${label}`} aria-pressed={isPaused} onClick={() => { paused.current = !paused.current; setIsPaused(paused.current); }}>{isPaused ? 'Resume' : 'Pause'} <span aria-hidden="true">{isPaused ? '▶' : 'Ⅱ'}</span></button>
      </div>
    </div>
  );
}
