"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { ArrowIcon, ArrowUpRight } from "../ui/icons";
import type { ContentRow } from "@/lib/content";
import { safeImage, safeUrl, initials, pad } from "@/lib/urls";

const { portfolio } = site;

/** "Woobe — Fashion, by Weight" → ["Woobe", "Fashion, by Weight"] */
function splitTitle(title: unknown) {
  const [name, ...rest] = String(title ?? "").split(" — ");
  return { name, descriptor: rest.join(" — ") };
}

/** CMS rows may carry tags as an array or a comma-separated string. */
function tagList(tags: unknown): string[] {
  const list = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",") : [];
  return list.map((t) => String(t).trim()).filter(Boolean).slice(0, 4);
}

/* Cards alternate between a light and a dark face so each one reads as a new sheet on the pile. */
const faces = [
  {
    card: "bg-cloud text-ink",
    muted: "text-slate",
    accent: "text-lagoon-ink",
    rule: "border-ink/15",
    chip: "border-ink/15 text-ink/80",
    number: "text-ink/[0.07]",
  },
  {
    card: "bg-harbour text-cloud ring-1 ring-cloud/10",
    muted: "text-mist",
    accent: "text-lagoon",
    rule: "border-cloud/15",
    chip: "border-cloud/20 text-cloud/80",
    number: "text-cloud/[0.06]",
  },
];

function ProjectCard({ item, index, total }: { item: ContentRow; index: number; total: number }) {
  const face = faces[index % 2];
  const { name, descriptor } = splitTitle(item.title);
  const image = safeImage(item.image_url);
  const href = safeUrl(item.project_url);
  const tags = tagList(item.tags);

  return (
    <article
      data-card=""
      aria-labelledby={`project-${item.id}`}
      className={`relative grid origin-top overflow-hidden rounded-[28px] lg:min-h-[min(36rem,calc(100svh-9rem))] lg:grid-cols-12 lg:rounded-[36px] ${face.card}`}
    >
      <div className="relative flex flex-col p-6 sm:p-10 lg:col-span-5 lg:p-10 xl:p-12">
        <span
          aria-hidden="true"
          className={`display pointer-events-none absolute -right-2 -bottom-6 text-[clamp(8rem,16vw,15rem)] !leading-none tabular-nums select-none ${face.number}`}
        >
          {pad(index + 1)}
        </span>

        <div className={`flex items-center justify-between gap-4 border-b pb-5 ${face.rule}`}>
          <p className={`label tracking-[0.06em] ${face.accent}`}>{item.category}</p>
          <p aria-hidden="true" className={`label shrink-0 tabular-nums ${face.muted}`}>
            {pad(index + 1)} / {pad(total)}
          </p>
        </div>

        <h3 id={`project-${item.id}`} className="mt-8 lg:mt-10">
          <span className="display block text-[clamp(2.5rem,5vw,4.5rem)]">{name}</span>
          {descriptor ? <span className="sr-only"> — </span> : null}
          {descriptor ? (
            <span className={`mt-3 block font-serif text-[clamp(1.25rem,1.8vw,1.625rem)] leading-[1.25] italic ${face.muted}`}>
              {descriptor}
            </span>
          ) : null}
        </h3>

        <p className={`relative mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.65] ${face.muted}`}>{item.description}</p>

        {tags.length ? (
          <ul className="relative mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {tags.map((tag) => (
              <li key={tag} className={`label rounded-full border px-3 py-1 ${face.chip}`}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-auto lg:pt-10">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`label inline-flex items-center gap-2 underline-offset-4 hover:underline ${face.accent}`}
            >
              View {name} <ArrowUpRight size={14} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : null}
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 font-display text-[0.9375rem] font-semibold"
          >
            Build something like this
            <span className="grid size-9 place-items-center rounded-full bg-lagoon text-monsoon transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1">
              <ArrowIcon size={14} />
            </span>
          </a>
        </div>
      </div>

      <div className="relative order-first aspect-[16/10] overflow-hidden lg:order-none lg:col-span-7 lg:aspect-auto lg:m-3 lg:ml-0 lg:rounded-[28px]">
        {image ? (
          <Image
            data-cover=""
            src={image}
            alt={item.image_alt || ""}
            fill
            unoptimized={!image.startsWith("/images/")}
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div aria-hidden="true" className="display grid h-full place-items-center bg-tide text-[6rem] text-lagoon">
            {initials(item.title)}
          </div>
        )}
      </div>
    </article>
  );
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  const ref = useRef<HTMLElement>(null);

  // Each card pins under the header; as the next one slides over it, the one
  // beneath sinks back and dims so the pile reads as depth.
  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const slots = gsap.utils.toArray<HTMLElement>("[data-slot]", section);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        slots.forEach((slot, i) => {
          const next = slots[i + 1];
          const card = slot.querySelector<HTMLElement>("[data-card]");
          if (!next || !card) return;
          const depth = slots.length - 1 - i;
          gsap.to(card, {
            scale: 1 - Math.min(depth, 4) * 0.035,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
          });
        });
        slots.forEach((slot) => {
          const cover = slot.querySelector("[data-cover]");
          if (cover) gsap.fromTo(cover, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: slot, start: "top bottom", end: "top 20%", scrub: true } });
        });
      });
    },
    { scope: ref, dependencies: [rows.length] },
  );

  return (
    <section ref={ref} id="portfolio" data-header="dark" aria-labelledby="portfolio-title" className="grain on-dark bg-monsoon py-20 text-cloud sm:py-24 lg:py-28">
      <div className="wrap relative z-[2]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionLabel index={portfolio.index} tone="dark">
                {portfolio.eyebrow}
              </SectionLabel>
            </Reveal>
            <RevealText as="h2" id="portfolio-title" split="chars" className="display mt-6 text-[clamp(3rem,8vw,7.5rem)] !leading-[0.88]">
              {portfolio.title}
            </RevealText>
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3">
            <p className="font-serif text-[clamp(1.5rem,2vw,1.875rem)] leading-[1.25] text-cloud/90">{portfolio.lead}</p>
            {rows.length ? (
              <p className="label mt-5 flex items-center gap-3 text-mist">
                <span className="tabular-nums text-lagoon">{pad(rows.length)}</span>
                <span aria-hidden="true" className="h-px w-8 bg-cloud/25" />
                selected projects, built for real clients
              </p>
            ) : null}
          </Reveal>
        </div>

        <ol className="mt-12 grid gap-6 md:gap-8 lg:mt-16 lg:gap-[12vh]" aria-label="Projects">
          {rows.map((item, i) => (
            <li
              key={item.id}
              data-slot=""
              className="lg:sticky"
              // Each card pins a little lower than the last, leaving a sliver of the pile visible.
              style={{ top: `calc(6rem + ${i * 1.25}rem)` }}
            >
              <ProjectCard item={item} index={i} total={rows.length} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
