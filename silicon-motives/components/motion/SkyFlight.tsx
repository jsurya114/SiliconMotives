"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { ScrollTrigger, MQ } from "@/lib/gsap";
import { useSmoothScroll } from "./SmoothScroll";

/*
 * A scroll-driven camera for the hero. Each [data-depth] element is a flat plane at
 * that distance from the camera. Scroll progress moves the camera forward (and a
 * little down); every plane is then projected about the vanishing point, so nearer
 * planes grow and slide faster than distant ones. Planes the camera reaches thin out
 * over their [data-near] range; [data-origin] pins a plane's scaling to a fixed point
 * instead (the copy grows from its left edge, so it never slides off-screen).
 * [data-fade="from,to,start,end"] maps progress to opacity.
 *
 * Only transform and opacity are written, and only when progress changes; the idle
 * drift of the clouds is a CSS animation on the compositor. Under reduced motion
 * (or on very short screens, see --flight in site.css) the camera never moves and the
 * stage stays a still, layered hero; only the headline cloud is placed.
 */

type Plane = { el: HTMLElement; z: number; rise: number; near: [number, number]; origin?: string; o: string; t: string };
type Fade = { el: HTMLElement; a: number; b: number; from: number; to: number; interactive: boolean; o: string };

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function SkyFlight({ children, ...rest }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const scrollToRef = useRef(scrollTo);
  useEffect(() => {
    scrollToRef.current = scrollTo;
  });

  useEffect(() => {
    const root = ref.current;
    const stage = root?.querySelector<HTMLElement>("[data-sky-stage]");
    const copy = root?.querySelector<HTMLElement>("[data-sky-copy]");
    if (!root || !stage || !copy) return;

    const planes: Plane[] = [...root.querySelectorAll<HTMLElement>("[data-depth]")].map((el) => {
      const [n0, n1] = (el.dataset.near ?? "0.7,0.3").split(",").map(Number);
      return { el, z: Number(el.dataset.depth), rise: Number(el.dataset.rise ?? 0), near: [n0, n1], origin: el.dataset.origin, o: "", t: "" };
    });
    const fades: Fade[] = [...root.querySelectorAll<HTMLElement>("[data-fade]")].map((el) => {
      const [a, b, from, to] = el.dataset.fade!.split(",").map(Number);
      return { el, a, b, from, to, interactive: el.hasAttribute("data-interactive"), o: "" };
    });

    // The nearest cloud is placed by the headline itself: its dense edge sits over the
    // last letters of the longest line, however the title wraps, while staying below the
    // eyebrow and above the buttons. Until this has run the cloud stays hidden (see
    // [data-anchored] in site.css), so placing it never shifts layout.
    const title = copy.querySelector("h1");
    const place = () => {
      if (!title) return;
      const prev = copy.style.transform;
      copy.style.transform = "none";
      // Text nodes only: the title's block spans would report the full column width.
      const lines: DOMRect[] = [];
      const range = document.createRange();
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) if (r.width > 1) lines.push(r);
      }
      const box = stage.getBoundingClientRect();
      const actions = copy.querySelector("[data-interactive]")?.getBoundingClientRect();
      const eyebrow = title.previousElementSibling?.getBoundingClientRect();
      copy.style.transform = prev;
      if (!lines.length) return;
      if (actions) stage.style.setProperty("--cta-y", `${(actions.top - box.top).toFixed(1)}px`);
      if (eyebrow) stage.style.setProperty("--eyebrow-y", `${(eyebrow.bottom - box.top + 6).toFixed(1)}px`);
      const longest = lines.reduce((a, r) => (r.right > a.right ? r : a));
      stage.style.setProperty("--title-x", `${(longest.right - box.left).toFixed(1)}px`);
      stage.style.setProperty("--title-y", `${(longest.top + longest.height / 2 - box.top).toFixed(1)}px`);
      stage.style.setProperty("--title-em", getComputedStyle(title).fontSize);
      stage.dataset.anchored = "";
    };
    place();
    // Re-place whenever the copy moves: the title rewraps on width changes, the
    // bottom-aligned copy shifts on height changes, and a web font arriving rewraps the
    // lead, which moves the title without resizing it.
    const replace = () => {
      place();
      if (trigger) {
        measure();
        render();
      }
    };
    const resized = new ResizeObserver(replace);
    for (const block of [copy, ...copy.children]) resized.observe(block);
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) replace();
    });

    const reduced = window.matchMedia(MQ.reduced);
    let trigger: ScrollTrigger | null = null;
    let raf = 0;
    let last = 0;
    let p = 0;
    let target = 0;
    const cam = { w: 0, h: 0, vx: 0, vy: 0, d: 2, y: 0, x: 0, pitch: 0 };

    const measure = () => {
      const cs = getComputedStyle(stage);
      const num = (name: string, fallback: number) => {
        const v = parseFloat(cs.getPropertyValue(name));
        return Number.isFinite(v) ? v : fallback;
      };
      cam.w = stage.clientWidth;
      cam.h = stage.clientHeight;
      cam.vx = num("--vp-x", 0.6) * cam.w;
      cam.vy = num("--vp-y", 0.5) * cam.h;
      cam.d = num("--cam-d", 2);
      cam.y = num("--cam-y", 0) * cam.h;
      cam.x = num("--cam-x", 0) * cam.w;
      cam.pitch = num("--pitch", 0) * cam.h;
      for (const plane of planes) {
        if (plane.origin) {
          plane.el.style.transformOrigin = plane.origin;
          continue;
        }
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = plane.el;
        while (node && node !== stage) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        plane.el.style.transformOrigin = `${(cam.vx - x).toFixed(1)}px ${(cam.vy - y).toFixed(1)}px`;
      }
    };

    const render = () => {
      // Forward travel eases in, so the first scroll reads as the camera starting to move.
      const d = cam.d * (0.25 * p + 0.75 * p * p);
      const lift = cam.y * smooth(0, 1, p);
      const side = cam.x * p;
      const pitch = cam.pitch * smooth(0.1, 1, p);
      const rise = smooth(0.05, 0.95, p);
      for (const plane of planes) {
        const zr = Math.max(plane.z - d, 0.04);
        const s = plane.z / zr;
        const tx = -side / zr;
        const ty = -lift / zr - pitch - plane.rise * cam.h * rise * s;
        const [n0, n1] = plane.near;
        const o = smooth(n1, n0, zr);
        const t = o < 0.002 ? "" : `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
        const os = o > 0.998 ? "" : o.toFixed(3);
        if (t && t !== plane.t) plane.el.style.transform = plane.t = t;
        if (os !== plane.o) {
          plane.el.style.opacity = plane.o = os;
          plane.el.style.visibility = o < 0.002 ? "hidden" : "";
        }
      }
      for (const f of fades) {
        const v = f.from + (f.to - f.from) * smooth(f.a, f.b, p);
        const os = v.toFixed(3);
        if (os === f.o) continue;
        f.el.style.opacity = f.o = os;
        if (f.interactive) f.el.style.pointerEvents = v < 0.15 ? "none" : "";
      }
    };

    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      // A short time constant smooths stepped wheel input without adding noticeable lag.
      p += (target - p) * (1 - Math.exp(-dt / 0.075));
      if (Math.abs(target - p) < 0.0004) p = target;
      render();
      raf = p === target ? 0 : requestAnimationFrame(loop);
      if (!raf) last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const reset = () => {
      for (const el of [...planes.map((x) => x.el), ...fades.map((x) => x.el)]) {
        el.style.removeProperty("transform");
        el.style.removeProperty("transform-origin");
        el.style.removeProperty("opacity");
        el.style.removeProperty("visibility");
        el.style.removeProperty("pointer-events");
      }
      for (const plane of planes) plane.o = plane.t = "";
      for (const f of fades) f.o = "";
    };

    const stop = () => {
      trigger?.kill();
      trigger = null;
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      reset();
    };

    const start = () => {
      stop();
      if (reduced.matches) return;
      if (getComputedStyle(stage).getPropertyValue("--flight").trim() !== "1") return;
      trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onRefresh: (self) => {
          measure();
          p = target = self.progress;
          render();
        },
        onUpdate: (self) => {
          target = self.progress;
          kick();
        },
      });
    };

    // The flight only exists on tall-enough screens, so re-check on resize.
    let flying = getComputedStyle(stage).getPropertyValue("--flight").trim() === "1";
    const onResize = () => {
      const next = getComputedStyle(stage).getPropertyValue("--flight").trim() === "1";
      if (next !== flying) {
        flying = next;
        start();
        ScrollTrigger.refresh();
      }
    };

    // Keyboard focus inside the hero copy brings the scene back to its opening frame.
    const onFocus = () => {
      if (trigger && p > 0.2) scrollToRef.current(0);
    };

    start();
    reduced.addEventListener("change", start);
    window.addEventListener("resize", onResize);
    copy.addEventListener("focusin", onFocus);
    return () => {
      disposed = true;
      stop();
      resized.disconnect();
      reduced.removeEventListener("change", start);
      window.removeEventListener("resize", onResize);
      copy.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <section ref={ref} {...rest}>
      {children}
    </section>
  );
}
