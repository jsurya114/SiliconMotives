"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import type { ContentRow } from "@/lib/content";
import { safeImage, initials } from "@/lib/urls";

const { portfolio } = site;

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-case]", section);

      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        cards.forEach((card, i) => {
          const img = card.querySelector("[data-case-img]");
          // Photo drifts inside its frame.
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.04,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            },
          );

          if (!desktop) {
            gsap.from(card.querySelector("[data-case-inner]"), {
              y: 60,
              opacity: 0,
              duration: 1.2,
              scrollTrigger: { trigger: card, start: "top 85%", once: true },
            });
            return;
          }

          // The previous card recedes as the next one slides over it.
          const next = cards[i + 1];
          if (!next) return;
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: next, start: "top 85%", end: "top top", scrub: true },
            })
            .to(card.querySelector("[data-case-inner]"), { scale: 0.92 }, 0)
            .to(card.querySelector("[data-case-shade]"), { opacity: 0.55 }, 0);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="portfolio"
      data-header="dark"
      aria-labelledby="portfolio-title"
      className="grain on-dark bg-monsoon text-cloud"
    >
      <div className="wrap section-y !pb-12 lg:!pb-16">
        <Reveal>
          <SectionLabel index={portfolio.index} tone="dark">
            {portfolio.eyebrow}
          </SectionLabel>
        </Reveal>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <RevealText as="h2" id="portfolio-title" split="chars" className="display text-[clamp(3.5rem,13vw,13rem)] !leading-[0.85]">
            {portfolio.title}
          </RevealText>
          <Reveal className="lg:max-w-[22rem] lg:pb-4">
            <p className="font-serif text-[clamp(1.5rem,2vw,1.875rem)] leading-[1.25] text-cloud/90">{portfolio.lead}</p>
          </Reveal>
        </div>
      </div>

      <ul className="wrap pb-24 lg:pb-[12vh]">
        {rows.map((item, i) => {
          const [name, ...rest] = String(item.title).split(" — ");
          const descriptor = rest.join(" — ");
          const image = safeImage(item.image_url);
          return (
            <li
              key={item.id}
              data-case=""
              className="relative py-3 lg:sticky lg:top-0 lg:flex lg:min-h-svh lg:items-center lg:py-[6vh] lg:[&:not(:last-child)]:mb-[45svh]"
              style={{ zIndex: i + 1 }}
            >
              <article aria-labelledby={`case-${item.id}`} className="w-full">
                <div
                  data-case-inner=""
                  className="relative grid w-full origin-top overflow-hidden rounded-[24px] bg-harbour shadow-[0_-30px_80px_-20px_rgba(4,10,18,0.6)] lg:h-[min(80svh,46rem)] lg:grid-cols-12"
                >
                  <div className="relative aspect-[4/3] overflow-hidden lg:col-span-7 lg:aspect-auto lg:h-full">
                    <div data-case-img="" className="absolute inset-0">
                      {image ? <Image src={image} alt={item.image_alt || ''} fill unoptimized={!image.startsWith('/images/')} sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" /> : <div className="display grid h-full place-items-center bg-tide text-[6rem] text-lagoon" aria-hidden="true">{initials(item.title)}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col p-6 sm:p-10 lg:col-span-5 lg:p-12">
                    <p className="label text-lagoon">{item.category}</p>
                    <h3 id={`case-${item.id}`} className="mt-6 lg:mt-auto">
                      <span className="display block text-[clamp(2.75rem,5vw,5rem)] !leading-[0.9]">{name}</span>
                      {descriptor ? <span className="sr-only"> — </span> : null}
                      {descriptor ? (
                        <span className="mt-3 block font-display text-[clamp(1.125rem,1.5vw,1.375rem)] font-semibold tracking-[-0.02em] text-cloud/80">
                          {descriptor}
                        </span>
                      ) : null}
                    </h3>
                    <p className="mt-6 text-[1.0625rem] leading-[1.6] text-mist">{item.description}</p>
                  </div>
                  <div
                    data-case-shade=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-monsoon opacity-0"
                  />
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
