"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";

type Ctx = { lenis: () => Lenis | null; scrollTo: (target: string | number | HTMLElement) => void };

const LenisContext = createContext<Ctx>({ lenis: () => null, scrollTo: () => {} });

export function useSmoothScroll() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    const media = window.matchMedia(MQ.reduced);
    let stop: (() => void) | undefined;
    let disposed = false;
    const update = () => {
      stop?.();
      stop = undefined;
      document.documentElement.classList.toggle('motion-ready', !media.matches);
      if (media.matches) return;
      const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 }, autoRaf: false });
      ref.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => { gsap.ticker.remove(tick); lenis.destroy(); ref.current = null; };
    };
    update();
    media.addEventListener('change', update);
    document.fonts?.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => {
      disposed = true;
      stop?.();
      media.removeEventListener('change', update);
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  const value: Ctx = {
    lenis: () => ref.current,
    scrollTo: (target) => {
      const lenis = ref.current;
      if (lenis) {
        lenis.scrollTo(target as never, { duration: 1.4 });
        return;
      }
      if (typeof target === "number") window.scrollTo({ top: target });
      else {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView();
      }
    },
  };

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
