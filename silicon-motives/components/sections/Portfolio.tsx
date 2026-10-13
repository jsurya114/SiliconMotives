"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
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

  // Cards rise from below with an eased stagger as each row reaches the
  // viewport; batching keeps later rows staggered when the grid wraps.
  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-project]", section);
        gsap.set(cards, { y: 80, opacity: 0 });
        ScrollTrigger.batch(cards, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.12, overwrite: true }),
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

        <ol className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:mt-16 xl:grid-cols-5" aria-label="Projects">
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
