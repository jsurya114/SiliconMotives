"use client";
import { useEffect, useRef } from "react";

const EASE = "cubic-bezier(.2,.7,.2,1)";
/** Blocks that fade up as they enter the viewport. */
const REVEAL =
  "[data-reveal], .section-heading > p, .faq-intro, .faq-list details, .contact-grid > *, .svc-card, .approach-intro > p, .case-copy > p, .case-stats";
/** Headings that wipe in from a mask. */
const HEADINGS =
  ".section-heading h2, .approach-intro h2, .faq-intro h2, .case-copy h2, .team-grid h2, .contact-grid h2";

/**
 * Scroll motion as progressive enhancement: content is fully visible without
 * JavaScript, and all motion is skipped when the visitor prefers reduced motion.
 * Revealed elements also receive `.in-view`, which drives CSS detail animations
 * (chart bars, pipeline steps, timeline lines) scoped under `html.motion-js`.
 */
export default function ScrollReveal() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const hero = document.querySelector<HTMLElement>(".hero");
    const heroImage = hero?.querySelector<HTMLElement>(".hero-background");
    const heroContent = hero?.querySelector<HTMLElement>(".hero-content");
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = root.scrollHeight - window.innerHeight;
        progress.current?.style.setProperty(
          "transform",
          `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`,
        );
        if (motion.matches || !hero) return;
        const y = window.scrollY;
        if (y > hero.offsetHeight) return;
        heroImage?.style.setProperty(
          "transform",
          `translate3d(0, ${y * 0.28}px, 0) scale(1.06)`,
        );
        heroContent?.style.setProperty(
          "opacity",
          String(Math.max(0.15, 1 - y / (hero.offsetHeight * 0.85))),
        );
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (motion.matches || !("IntersectionObserver" in window)) {
      return () => window.removeEventListener("scroll", onScroll);
    }
    root.classList.add("motion-js");
    const animations = new Set<Animation>();
    const play = (el: Element, keyframes: Keyframe[], delay: number, duration = 750) => {
      const a = el.animate(keyframes, { duration, delay, easing: EASE, fill: "backwards" });
      animations.add(a);
      a.onfinish = () => animations.delete(a);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        let batch = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);
          el.classList.add("in-view");
          const delay = Math.min(batch++, 5) * 90;
          if (el.matches(HEADINGS)) {
            play(
              el,
              [
                { clipPath: "inset(0 0 100% 0)", transform: "translateY(28px)" },
                { clipPath: "inset(0 0 -12% 0)", transform: "translateY(0)" },
              ],
              delay,
              950,
            );
          } else {
            play(
              el,
              [
                { opacity: 0, transform: "translateY(28px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              delay,
            );
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document
      .querySelectorAll(`${REVEAL}, ${HEADINGS}`)
      .forEach((node) => observer.observe(node));
    const stop = () => {
      if (!motion.matches) return;
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      root.classList.remove("motion-js", "motion-ok");
      heroImage?.style.removeProperty("transform");
      heroContent?.style.removeProperty("opacity");
    };
    motion.addEventListener("change", stop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      motion.removeEventListener("change", stop);
      root.classList.remove("motion-js");
    };
  }, []);
  return <div ref={progress} className="scroll-progress" aria-hidden="true" />;
}
