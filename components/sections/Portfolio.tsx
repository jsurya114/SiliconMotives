"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import type { ContentRow } from "@/lib/content";
import { safeImage, initials, pad } from "@/lib/urls";

const { portfolio } = site;

/** "Woobe — Fashion, by Weight" → ["Woobe", "Fashion, by Weight"] */
function splitTitle(title: unknown) {
  const [name, ...rest] = String(title ?? "").split(" — ");
  return { name, descriptor: rest.join(" — ") };
}

function Project({ item, index }: { item: ContentRow; index: number }) {
  const { name, descriptor } = splitTitle(item.title);
  const image = safeImage(item.image_url);

  return (
    <article data-project="" aria-labelledby={`project-${item.id}`}>
      <div
        data-frame=""
        className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-harbour sm:aspect-[16/9] lg:aspect-[2/1] lg:rounded-[32px]"
      >
        {image ? (
          <div data-cover="" className="absolute -inset-y-[8%] inset-x-0">
            <Image
              src={image}
              alt={item.image_alt || ""}
              fill
              unoptimized={!image.startsWith("/images/")}
              sizes="(min-width: 1440px) 1344px, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div aria-hidden="true" className="display grid h-full place-items-center bg-tide text-[6rem] text-lagoon">
            {initials(item.title)}
          </div>
        )}
      </div>

      <div data-meta="" className="mt-6 grid gap-x-8 gap-y-3 sm:mt-8 md:grid-cols-12 md:items-baseline">
        <p aria-hidden="true" className="label tabular-nums text-lagoon md:col-span-1">
          {pad(index + 1)}
        </p>
        <h3 id={`project-${item.id}`} className="md:col-span-6">
          <span className="display block text-[clamp(2rem,4vw,3.5rem)]">{name}</span>
          {descriptor ? <span className="sr-only"> — </span> : null}
          {descriptor ? (
            <span className="mt-2 block font-serif text-[clamp(1.125rem,1.5vw,1.375rem)] leading-[1.3] text-mist italic">
              {descriptor}
            </span>
          ) : null}
        </h3>
        <div className="md:col-span-5">
          {item.category ? <p className="label tracking-[0.06em] text-mist">{item.category}</p> : null}
          {item.description ? (
            <p className="mt-3 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-cloud/75">{item.description}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  const ref = useRef<HTMLElement>(null);

  // Each frame opens from a rounded inset as it rises into view while the
  // cover drifts against the scroll. Scrubbed, so it runs on touch screens too.
  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-project]", section).forEach((project) => {
          const frame = project.querySelector("[data-frame]");
          const cover = project.querySelector("[data-cover]");
          const meta = project.querySelector("[data-meta]");
          gsap.fromTo(
            frame,
            { clipPath: "inset(10% 8% 0% 8% round 40px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: { trigger: project, start: "top bottom", end: "top 35%", scrub: true },
            },
          );
          if (cover)
            gsap.fromTo(
              cover,
              { yPercent: -6, scale: 1.12 },
              {
                yPercent: 6,
                scale: 1,
                ease: "none",
                scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          if (meta)
            gsap.fromTo(
              meta.children,
              { y: 32, opacity: 0 },
              { y: 0, opacity: 1, duration: 1, stagger: 0.08, scrollTrigger: { trigger: meta, start: "top 92%", once: true } },
            );
        });
      });
    },
    { scope: ref, dependencies: [rows.length] },
  );

  return (
    <section ref={ref} id="portfolio" data-header="dark" aria-labelledby="portfolio-title" className="grain on-dark section-y bg-monsoon text-cloud">
      <div className="wrap relative z-[2]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionLabel index={portfolio.index} tone="dark">
                {portfolio.eyebrow}
              </SectionLabel>
            </Reveal>
            <RevealText as="h2" id="portfolio-title" className="display t-h2 mt-6">
              {portfolio.title}
            </RevealText>
          </div>
          <Reveal className="lg:col-span-4 lg:pb-2">
            <p className="text-[1.1875rem] leading-[1.55] text-mist">{portfolio.lead}</p>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-20 sm:gap-24 lg:mt-20 lg:gap-32" aria-label="Projects">
          {rows.map((item, i) => (
            <li key={item.id}>
              <Project item={item} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
