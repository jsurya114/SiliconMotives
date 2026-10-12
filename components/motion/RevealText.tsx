"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
  /** Explicit display lines. Rendered as blocks with a space between them. */
  lines?: readonly string[];
  children?: ReactNode;
  className?: string;
  lineClassName?: string;
  split?: "lines" | "chars";
  delay?: number;
  start?: string;
  /** Play on mount instead of on scroll. */
  immediate?: boolean;
  /** Restore plain text once the intro has played. */
  revertOnComplete?: boolean;
  id?: string;
};

/**
 * Lines (or characters) rise out of line masks. Headings get SplitText's
 * aria-label; other tags render an sr-only twin and split an aria-hidden copy.
 */
export function RevealText({
  as: Tag = "h2",
  lines,
  children,
  className,
  lineClassName = "block",
  split = "lines",
  delay = 0,
  start = "top 85%",
  immediate = false,
  revertOnComplete = false,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // One concrete tag type keeps JSX typing simple; the rendered tag is still `as`.
  const Comp = Tag as "div";
  const isHeading = /^h[1-6]$/.test(Tag);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const target = isHeading ? el : (el.querySelector("[data-split]") as HTMLElement);
        let done = false;
        const st = SplitText.create(target, {
          type: split === "chars" ? "lines,words,chars" : "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          aria: isHeading ? "auto" : "none",
          onSplit(self) {
            gsap.set(el, { opacity: 1 });
            if (done) return;
            return gsap.from(split === "chars" ? self.chars : self.lines, {
              yPercent: 115,
              duration: split === "chars" ? 1.1 : 1.2,
              ease: "expo.out",
              stagger: split === "chars" ? 0.03 : 0.09,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
              onComplete: () => {
                if (revertOnComplete) {
                  done = true;
                  self.revert();
                }
              },
            });
          },
        });
        return () => st.revert();
      });
    },
    { scope: ref },
  );

  const content = lines
    ? lines.map((line, i) => (
        <span key={i} className={lineClassName}>
          {line}
          {i < lines.length - 1 ? " " : null}
        </span>
      ))
    : children;

  if (isHeading) {
    return (
      <Comp ref={ref} id={id} className={className} data-reveal="">
        {content}
      </Comp>
    );
  }

  const text = lines ? lines.join(" ") : typeof children === "string" ? children : undefined;
  return (
    <Comp ref={ref} id={id} className={className} data-reveal="">
      {text ? <span className="sr-only">{text}</span> : null}
      <span aria-hidden={text ? true : undefined} data-split="" className="block">
        {content}
      </span>
    </Comp>
  );
}
