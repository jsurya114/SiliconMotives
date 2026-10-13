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
    <article
      data-project=""
      aria-labelledby={`project-${item.id}`}
      className="group relative grid grid-cols-[6.5rem_1fr] items-center gap-x-5 gap-y-3 py-6 sm:grid-cols-[9rem_1fr] sm:gap-x-8 lg:grid-cols-12 lg:gap-x-8 lg:py-7"
    >
      <span data-line="" aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-cloud/15" />

      <div
        data-thumb=""
        className="relative row-span-2 aspect-[4/3] overflow-hidden rounded-[14px] bg-harbour lg:order-last lg:col-span-2 lg:col-start-11 lg:row-span-1"
      >
        {image ? (
          <Image
            src={image}
            alt={item.image_alt || ""}
            fill
            unoptimized={!image.startsWith("/images/")}
            sizes="(min-width: 1024px) 15vw, 9rem"
            className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105"
          />
        ) : (
          <div aria-hidden="true" className="display grid h-full place-items-center bg-tide text-[2rem] text-lagoon">
            {initials(item.title)}
          </div>
        )}
      </div>

      <div data-text="" className="min-w-0 lg:col-span-5 lg:flex lg:items-baseline lg:gap-6">
        <span aria-hidden="true" className="label hidden tabular-nums text-lagoon lg:inline">
          {pad(index + 1)}
        </span>
        <h3 id={`project-${item.id}`}>
          <span className="block font-display text-[1.375rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[1.75rem] lg:text-[2rem]">
            {name}
          </span>
          {descriptor ? <span className="sr-only"> — </span> : null}
          {descriptor ? <span className="mt-1 block font-serif text-[1rem] leading-[1.35] text-mist italic sm:text-[1.0625rem]">{descriptor}</span> : null}
        </h3>
      </div>

      <div data-text="" className="min-w-0 lg:col-span-4">
        {item.category ? <p className="label tracking-[0.06em] text-lagoon">{item.category}</p> : null}
        {item.description ? (
          <p className="mt-2 hidden text-[0.9375rem] leading-[1.55] text-cloud/70 sm:line-clamp-3 sm:block">{item.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  const ref = useRef<HTMLElement>(null);

  // Each row draws its hairline, wipes its thumbnail open from the left and
  // slides its text in — once, as it enters. Same on touch and desktop.
  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-project]", section).forEach((project) => {
          gsap
            .timeline({ scrollTrigger: { trigger: project, start: "top 88%", once: true } })
            .fromTo(project.querySelector("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.inOut" })
            .fromTo(
              project.querySelector("[data-thumb]"),
              { clipPath: "inset(0% 100% 0% 0% round 14px)" },
              { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1, ease: "expo.inOut" },
              0.15,
            )
            .fromTo(
              project.querySelectorAll("[data-text]"),
              { x: 24, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
              0.35,
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
            <p className="text-[1.125rem] leading-[1.55] text-mist">{portfolio.lead}</p>
          </Reveal>
        </div>

        <ol className="mt-12 border-b border-cloud/15 lg:mt-16" aria-label="Projects">
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
