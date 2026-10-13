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
    <article data-project="" aria-labelledby={`project-${item.id}`} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-harbour">
        {image ? (
          <Image
            src={image}
            alt={item.image_alt || ""}
            fill
            unoptimized={!image.startsWith("/images/")}
            sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 46vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105"
          />
        ) : (
          <div aria-hidden="true" className="display grid h-full place-items-center bg-tide text-[2rem] text-lagoon">
            {initials(item.title)}
          </div>
        )}
        <span aria-hidden="true" className="label absolute top-2.5 left-2.5 rounded-full bg-monsoon/70 px-2.5 py-1 tabular-nums text-lagoon backdrop-blur-sm">
          {pad(index + 1)}
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {item.category ? <p className="label text-[0.6875rem] tracking-[0.06em] text-lagoon sm:text-[0.75rem]">{item.category}</p> : null}
        <h3 id={`project-${item.id}`} className="mt-1.5">
          <span className="block font-display text-[1.125rem] leading-[1.15] font-bold tracking-[-0.025em] sm:text-[1.3125rem]">{name}</span>
          {descriptor ? <span className="sr-only"> — </span> : null}
          {descriptor ? <span className="mt-1 block font-serif text-[0.9375rem] leading-[1.35] text-mist italic">{descriptor}</span> : null}
        </h3>
        {item.description ? (
          <p className="mt-3 line-clamp-3 hidden text-[0.875rem] leading-[1.55] text-cloud/65 sm:block">{item.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  const ref = useRef<HTMLElement>(null);

  // Each card rises from below as the page scrolls, tied to the scroll so the
  // motion is always visible. Cards further right start a little later, so a
  // row ripples up left to right. The list item is the trigger and the card
  // inside it moves, so measurements are never thrown off by the tween.
  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const grid = section.querySelector<HTMLElement>("[data-grid]");
      if (!grid) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-slot]", grid).forEach((slot) => {
          const card = slot.querySelector("[data-project]");
          const lag = () => Math.round(((slot.offsetLeft - grid.offsetLeft) / grid.offsetWidth) * 180);
          gsap.fromTo(
            card,
            { y: 140, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: slot,
                start: () => `top+=${lag()} bottom`,
                end: () => `top+=${lag()} 62%`,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
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

        <ol data-grid="" className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:mt-16 xl:grid-cols-5" aria-label="Projects">
          {rows.map((item, i) => (
            <li key={item.id} data-slot="">
              <Project item={item} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
