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
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-harbour">
        {image ? (
          <Image
            src={image}
            alt={item.image_alt || ""}
            fill
            unoptimized={!image.startsWith("/images/")}
            quality={90}
            sizes="(min-width: 1440px) 430px, (min-width: 1024px) 30vw, (min-width: 640px) 48vw, 100vw"
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

      <div className="mt-5 flex flex-1 flex-col">
        {item.category ? <p className="label tracking-[0.06em] text-lagoon">{item.category}</p> : null}
        <h3 id={`project-${item.id}`} className="mt-1.5">
          <span className="block font-display text-[1.375rem] leading-[1.15] font-bold tracking-[-0.025em] lg:text-[1.5rem]">{name}</span>
          {descriptor ? <span className="sr-only"> — </span> : null}
          {descriptor ? <span className="mt-1 block font-serif text-[0.9375rem] leading-[1.35] text-mist italic">{descriptor}</span> : null}
        </h3>
        {item.description ? (
          <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-[1.55] text-cloud/65">{item.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  const ref = useRef<HTMLElement>(null);

  // Desktop: each card rises with the scroll, later columns a little later.
  // Phones: the list pins and shows one project at a time — the next slides
  // up as the previous one sinks away — and plays back in reverse.
  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const grid = section.querySelector<HTMLElement>("[data-grid]");
      const stage = section.querySelector<HTMLElement>("[data-stage]");
      if (!grid || !stage) return;
      const slots = gsap.utils.toArray<HTMLElement>("[data-slot]", grid);
      const mm = gsap.matchMedia();

      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        slots.forEach((slot) => {
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

      mm.add(`${MQ.motion} and ${MQ.mobile}`, () => {
        if (slots.length < 2) return;
        const counter = stage.querySelector("[data-counter]");
        const bar = stage.querySelector("[data-bar]");
        const steps = slots.length - 1;
        gsap.set(slots.slice(1), { yPercent: 100, opacity: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: stage,
            start: "center center",
            end: () => `+=${window.innerHeight * 0.8 * steps}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: { snapTo: 1 / steps, duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
            onUpdate: (self) => {
              if (counter) counter.textContent = pad(Math.round(self.progress * steps) + 1);
            },
          },
        });
        tl.fromTo(bar, { scaleX: 1 / slots.length }, { scaleX: 1, ease: "none", duration: steps }, 0);
        slots.slice(1).forEach((slot, i) => {
          tl.to(slot, { yPercent: 0, opacity: 1 }, i).to(slots[i], { yPercent: -12, scale: 0.92, opacity: 0 }, i);
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

        <div data-stage="" className="mt-12 lg:mt-16">
        <ol data-grid="" className="project-stack flex flex-wrap justify-center gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8 lg:gap-y-16" aria-label="Projects">
          {rows.map((item, i) => (
            <li key={item.id} data-slot="" className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]">
              <Project item={item} index={i} />
            </li>
          ))}
        </ol>
        <div aria-hidden="true" className="project-progress mt-6 items-center gap-4">
          <span className="label tabular-nums text-lagoon">
            <span data-counter="">01</span> / {pad(rows.length)}
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-cloud/15">
            <span data-bar="" className="absolute inset-0 origin-left bg-lagoon" />
          </span>
        </div>
        </div>
      </div>
    </section>
  );
}
