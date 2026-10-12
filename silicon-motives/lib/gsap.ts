"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP);
  gsap.defaults({ ease: "expo.out" });
}

/** Shared matchMedia conditions. Every animated component uses these. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export type MQState = { [K in keyof typeof MQ]: boolean };

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP };
