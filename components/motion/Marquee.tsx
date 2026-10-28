"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds for one item to pass at rest. The pace is per item, so a longer list
   *  takes longer to loop instead of moving faster. */
  speed?: number;
};

/** A continuous ticker with enough hidden copies to fill the viewport. It eases to a
 *  stop while a mouse is over it or something inside has focus. */
export function Marquee({ children, className = "", speed = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);
  const hovered = useRef(false);
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
        // The children's items: a single list's entries, or the children themselves.
        const list = primary.childElementCount === 1 ? primary.firstElementChild! : primary;
        let width = 0;
        let x = 0;
        let rate = 1;
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
          if (!visible || document.hidden || width <= 0) return;
          // Limit delayed frames so resuming a tab never jumps through the list.
          const step = Math.min(dt, 64);
          const target = focused.current || hovered.current ? 0 : 1;
          rate += (target - rate) * (1 - Math.exp(-step / 180));
          if (target === 0 && rate < 0.002) rate = 0;
          if (!rate) return;
          // Wrap by one measured content run, regardless of the number of copies.
          const items = Math.max(list.childElementCount, 1);
          x = (x - (width / (Math.max(speed, 0.1) * items)) * rate * (step / 1000)) % width;
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
    <div
      ref={ref}
      className={`marquee overflow-hidden ${className}`}
      onPointerEnter={event => { if (event.pointerType === "mouse") hovered.current = true; }}
      onPointerLeave={() => { hovered.current = false; }}
    >
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
