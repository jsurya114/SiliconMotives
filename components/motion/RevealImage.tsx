"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Oversize the image and drift it against the scroll. */
  parallax?: boolean;
  radius?: number;
};

/** Clip-path opens from an inset frame while the photo settles from 1.3x. */
export function RevealImage({ src, alt, sizes, className = "", imgClassName = "", parallax = false, radius = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelector("[data-inner]");
      const img = el.querySelector("img");
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(el, { opacity: 1 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        tl.fromTo(
          el,
          { clipPath: `inset(16% 12% 16% 12% round ${radius}px)` },
          { clipPath: `inset(0% 0% 0% 0% round ${radius}px)`, duration: 1.5, ease: "expo.out" },
        ).fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);

        if (parallax && inner) {
          gsap.fromTo(
            inner,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-reveal=""
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: radius }}
    >
      <div data-inner="" className={`absolute ${parallax ? "-inset-y-[10%] inset-x-0" : "inset-0"}`}>
        <Image src={src} alt={alt} fill unoptimized={!src.startsWith('/images/')} quality={90} sizes={sizes} className={`object-cover ${imgClassName}`} />
      </div>
    </div>
  );
}
