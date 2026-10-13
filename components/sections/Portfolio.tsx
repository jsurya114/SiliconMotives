"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { animate, stagger, utils } from "animejs";
import { site } from "@/content/site";
import { MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { ArrowIcon, ArrowUpRight } from "../ui/icons";
import type { ContentRow } from "@/lib/content";
import { safeImage, safeUrl, initials, pad } from "@/lib/urls";

const { portfolio } = site;
const EASE = "outExpo";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia(MQ.reduced).matches;

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

function Tags({ item, className = "" }: { item: ContentRow; className?: string }) {
  const tags = tagList(item.tags);
  return tags.length ? (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag} className="label rounded-full border border-cloud/20 px-3 py-1 text-cloud/80">
          {tag}
        </li>
      ))}
    </ul>
  ) : null;
}

function ProjectLink({ item, className = "" }: { item: ContentRow; className?: string }) {
  const href = safeUrl(item.project_url);
  const { name } = splitTitle(item.title);
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`label inline-flex items-center gap-2 text-lagoon underline-offset-4 hover:underline ${className}`}
    >
      View {name} <ArrowUpRight size={14} />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : null;
}

function Cover({ item, sizes, className = "" }: { item: ContentRow; sizes: string; className?: string }) {
  const image = safeImage(item.image_url);
  return image ? (
    <Image
      src={image}
      alt={item.image_alt || ""}
      fill
      unoptimized={!image.startsWith("/images/")}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  ) : (
    <div aria-hidden="true" className="display grid h-full place-items-center bg-tide text-[6rem] text-lagoon">
      {initials(item.title)}
    </div>
  );
}

/** Plays `run` once when `el` first scrolls into view, unless it is already on screen at load. */
function useEnter(ref: React.RefObject<HTMLElement | null>, prepare: (el: HTMLElement) => void, run: (el: HTMLElement) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return;
    prepare(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run(el);
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ── Desktop: a numbered index beside one large live preview ──────────────── */

function WorkIndex({ rows }: { rows: ContentRow[] }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Entrance: rows rise in turn while the preview opens out of an inset frame.
  useEnter(
    root,
    (el) => {
      utils.set(el.querySelectorAll("[data-row]"), { opacity: 0, translateY: 36 });
      utils.set(el.querySelector("[data-frame]")!, { clipPath: "inset(12% 10% 12% 10% round 28px)" });
      utils.set(el.querySelectorAll("[data-caption] > *"), { opacity: 0, translateY: 20 });
    },
    (el) => {
      animate(el.querySelectorAll("[data-row]"), { opacity: 1, translateY: 0, duration: 1100, delay: stagger(70), ease: EASE });
      animate(el.querySelector("[data-frame]")!, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1400, ease: EASE });
      animate(el.querySelectorAll("[data-caption] > *"), { opacity: 1, translateY: 0, duration: 900, delay: stagger(70, { start: 500 }), ease: EASE });
      moveIndicator(0, false);
    },
  );

  // The lagoon bar beside the list follows the selected project.
  const moveIndicator = (index: number, animated = true) => {
    const bar = root.current?.querySelector<HTMLElement>("[data-indicator]");
    const tab = tabs.current[index];
    if (!bar || !tab) return;
    const to = { translateY: tab.offsetTop, height: tab.offsetHeight };
    if (!animated || reducedMotion()) utils.set(bar, to);
    else animate(bar, { ...to, duration: 700, ease: EASE });
  };

  useEffect(() => {
    moveIndicator(active, false);
    const onResize = () => moveIndicator(previous.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap the preview: the next cover wipes in along the direction of travel,
  // with a thin lagoon scan line riding the edge.
  useEffect(() => {
    const from = previous.current;
    if (from === active || !root.current) return;
    previous.current = active;
    moveIndicator(active);

    const frame = root.current.querySelector<HTMLElement>("[data-frame]")!;
    const slides = Array.from(frame.querySelectorAll<HTMLElement>("[data-slide]"));
    const incoming = slides[active];
    const outgoing = slides[from];
    const scan = frame.querySelector<HTMLElement>("[data-scan]")!;
    const caption = root.current.querySelectorAll("[data-caption] > *");

    slides.forEach((s, i) => {
      utils.remove(s);
      utils.set(s, {
        zIndex: i === active ? 2 : i === from ? 1 : 0,
        visibility: i === active || i === from ? "visible" : "hidden",
        clipPath: "inset(0% 0% 0% 0%)",
      });
    });

    if (reducedMotion()) return;

    const down = active > from;
    const h = frame.offsetHeight;
    animate(incoming, {
      clipPath: [down ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
      duration: 950,
      ease: EASE,
    });
    animate(incoming.querySelector("img") ?? incoming, { scale: [1.14, 1], duration: 1500, ease: EASE });
    if (outgoing) animate(outgoing.querySelector("img") ?? outgoing, { scale: [1, 1.06], duration: 950, ease: EASE });
    animate(scan, {
      translateY: down ? [h, 0] : [0, h],
      opacity: [{ to: 1, duration: 80 }, { to: 1, duration: 620 }, { to: 0, duration: 250 }],
      duration: 950,
      ease: EASE,
    });
    utils.remove(caption);
    animate(caption, { opacity: [0, 1], translateY: [18, 0], duration: 800, delay: stagger(60, { start: 160 }), ease: EASE });
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = rows.length - 1;
    const next =
      e.key === "ArrowDown" ? Math.min(active + 1, last)
      : e.key === "ArrowUp" ? Math.max(active - 1, 0)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const current = rows[active];
  const { name, descriptor } = splitTitle(current?.title);
  const finePointer = () => window.matchMedia(MQ.finePointer).matches;

  return (
    <div ref={root} className="hidden lg:grid lg:grid-cols-12 lg:gap-x-10">
      <div className="col-span-5 flex flex-col">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby="portfolio-title"
          onKeyDown={onKeyDown}
          className="relative border-t border-cloud/15"
        >
          <span data-indicator="" aria-hidden="true" className="absolute top-0 left-0 w-0.5 bg-lagoon" />
          {rows.map((item, i) => {
            const row = splitTitle(item.title);
            const selected = i === active;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`work-tab-${item.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="work-panel"
                tabIndex={selected ? 0 : -1}
                data-row=""
                onClick={() => setActive(i)}
                onPointerEnter={() => finePointer() && setActive(i)}
                className={`group grid w-full grid-cols-[2.75rem_1fr_auto] items-center gap-x-3 border-b border-cloud/15 py-5 pr-2 pl-5 text-left transition-colors duration-300 ${
                  selected ? "bg-cloud/[0.04]" : "hover:bg-cloud/[0.02]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`label self-start pt-2 tabular-nums transition-colors duration-300 ${selected ? "text-lagoon" : "text-mist/70"}`}
                >
                  {pad(i + 1)}
                </span>
                <span className="block min-w-0">
                  <span
                    className={`display block text-[clamp(1.5rem,2.15vw,2.25rem)] transition-colors duration-300 ${
                      selected ? "text-cloud" : "text-mist group-hover:text-cloud/90"
                    }`}
                  >
                    {row.name}
                  </span>
                  {row.descriptor ? (
                    <span className="mt-1.5 block font-display text-[0.9375rem] font-semibold tracking-[-0.01em] text-mist">
                      {row.descriptor}
                    </span>
                  ) : null}
                </span>
                <span
                  aria-hidden="true"
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300 ease-[var(--ease-expo)] ${
                    selected ? "translate-x-0 bg-lagoon text-monsoon opacity-100" : "-translate-x-3 opacity-0"
                  }`}
                >
                  <ArrowIcon size={15} />
                </span>
              </button>
            );
          })}
        </div>

        <div data-row="" className="mt-auto flex items-end justify-between gap-6 pt-10">
          <p className="max-w-[17rem] text-[1rem] leading-[1.55] text-mist">
            Have something similar in mind? We’ll help you shape it into software that works.
          </p>
          <a
            href="#contact"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-lagoon py-3 pr-3 pl-6 font-display text-[0.9375rem] font-semibold text-monsoon transition-colors hover:bg-lagoon-deep"
          >
            Start a project
            <span className="grid size-8 place-items-center rounded-full bg-monsoon text-lagoon transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1">
              <ArrowIcon size={14} />
            </span>
          </a>
        </div>
      </div>

      <div
        id="work-panel"
        role="tabpanel"
        aria-labelledby={current ? `work-tab-${current.id}` : undefined}
        className="col-span-7"
      >
        <div data-frame="" className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-harbour ring-1 ring-cloud/10">
          {rows.map((item, i) => (
            <div
              key={item.id}
              data-slide=""
              aria-hidden={i !== active}
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: i === active ? 2 : 0, visibility: i === active ? "visible" : "hidden" }}
            >
              <Cover item={item} sizes="(min-width: 1024px) 56vw, 100vw" />
            </div>
          ))}
          <span
            data-scan=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-0.5 bg-lagoon opacity-0 shadow-[0_0_24px_4px_rgba(126,226,209,0.55)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_top,rgba(11,26,43,0.96)_0%,rgba(11,26,43,0.78)_32%,rgba(11,26,43,0)_62%),linear-gradient(to_bottom,rgba(11,26,43,0.45),rgba(11,26,43,0)_22%)]"
          />
          <div className="absolute inset-x-0 top-0 z-[4] flex items-center justify-between p-6">
            <span className="label rounded-full border border-cloud/20 bg-monsoon/50 px-3.5 py-1.5 tracking-[0.06em] text-lagoon backdrop-blur-md">
              {current?.category}
            </span>
            <span className="label rounded-full bg-monsoon/50 px-3.5 py-1.5 tabular-nums text-cloud/90 backdrop-blur-md">
              {pad(active + 1)} <span className="text-mist">/ {pad(rows.length)}</span>
            </span>
          </div>
          <div data-caption="" className="absolute inset-x-0 bottom-0 z-[4] p-8 xl:p-10">
            <h3 className="display text-[clamp(2.5rem,4vw,3.75rem)] text-cloud">
              {name}
              {descriptor ? <span className="sr-only"> — {descriptor}</span> : null}
            </h3>
            {descriptor ? (
              <p aria-hidden="true" className="mt-2 font-display text-[1.0625rem] font-semibold tracking-[-0.01em] text-lagoon">
                {descriptor}
              </p>
            ) : null}
            <p className="mt-4 max-w-[38rem] text-[1.0625rem] leading-[1.6] text-cloud/85">{current?.description}</p>
            {current && (tagList(current.tags).length || safeUrl(current.project_url)) ? (
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Tags item={current} />
                <ProjectLink item={current} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tablet and phone: a swipeable rail of cards with controls ─────────────── */

function WorkCard({ item }: { item: ContentRow }) {
  const { name, descriptor } = splitTitle(item.title);
  return (
    <article
      aria-labelledby={`work-card-${item.id}`}
      className="flex h-full flex-col overflow-hidden rounded-[24px] border border-cloud/10 bg-harbour"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-tide">
        <Cover item={item} sizes="(min-width: 768px) 60vw, 86vw" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,26,43,0.5),rgba(11,26,43,0)_35%)]" />
        <span className="label absolute top-4 left-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-monsoon/60 px-3 py-1.5 tracking-[0.06em] text-lagoon backdrop-blur-md">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 id={`work-card-${item.id}`}>
          <span className="display block text-[clamp(2rem,6.5vw,2.75rem)]">{name}</span>
          {descriptor ? <span className="sr-only"> — </span> : null}
          {descriptor ? (
            <span className="mt-2 block font-display text-[1rem] font-semibold tracking-[-0.01em] text-lagoon">{descriptor}</span>
          ) : null}
        </h3>
        <p className="mt-4 text-[1.0625rem] leading-[1.6] text-cloud/80">{item.description}</p>
        <Tags item={item} className="mt-5" />
        <ProjectLink item={item} className="mt-auto pt-5" />
      </div>
    </article>
  );
}

function WorkRail({ rows }: { rows: ContentRow[] }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLUListElement>(null);

  useEnter(
    root,
    (el) => utils.set(el.querySelectorAll("[data-card]"), { opacity: 0, translateX: 60 }),
    (el) => animate(el.querySelectorAll("[data-card]"), { opacity: 1, translateX: 0, duration: 1200, delay: stagger(90), ease: EASE }),
  );

  // The card whose left edge sits nearest the rail's start is the current one.
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    let nearest = 0;
    items.forEach((item, i) => {
      if (Math.abs(item.offsetLeft - el.scrollLeft - el.offsetLeft) < Math.abs(items[nearest].offsetLeft - el.scrollLeft - el.offsetLeft)) nearest = i;
    });
    // At the far end the last card may never reach the start edge.
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) nearest = items.length - 1;
    setActive(nearest);
  };

  const go = (index: number) => {
    const el = rail.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const control =
    "grid size-12 place-items-center rounded-full border border-cloud/20 text-cloud transition-colors hover:border-lagoon hover:text-lagoon disabled:pointer-events-none disabled:opacity-35";

  return (
    <div ref={root} className="lg:hidden">
      <ul
        ref={rail}
        onScroll={onScroll}
        aria-label="Projects"
        className="-mx-[clamp(1rem,4vw,3rem)] flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,3rem)] gap-4 overflow-x-auto px-[clamp(1rem,4vw,3rem)] pb-2 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {rows.map((item) => (
          <li key={item.id} data-card="" className="w-[86%] shrink-0 snap-start sm:w-[70%] md:w-[58%]">
            <WorkCard item={item} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-5">
        <div className="relative h-px flex-1 bg-cloud/15" aria-hidden="true">
          <span
            className="absolute inset-y-0 left-0 -top-px h-[3px] rounded-full bg-lagoon transition-[width] duration-500 ease-[var(--ease-expo)]"
            style={{ width: `${((active + 1) / rows.length) * 100}%` }}
          />
        </div>
        <p className="label tabular-nums text-cloud/90" aria-live="polite">
          <span className="sr-only">Project </span>
          {pad(active + 1)} <span className="text-mist">/ {pad(rows.length)}</span>
        </p>
        <div className="flex gap-2">
          <button type="button" className={control} onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous project">
            <span className="rotate-180">
              <ArrowIcon size={16} />
            </span>
          </button>
          <button type="button" className={control} onClick={() => go(active + 1)} disabled={active === rows.length - 1} aria-label="Next project">
            <ArrowIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  return (
    <section id="portfolio" data-header="dark" aria-labelledby="portfolio-title" className="grain on-dark overflow-hidden bg-monsoon py-20 text-cloud sm:py-24 lg:py-28">
      <div className="wrap relative z-[2]">
        <Reveal>
          <SectionLabel index={portfolio.index} tone="dark">
            {portfolio.eyebrow}
          </SectionLabel>
        </Reveal>
        <div className="mt-6 mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <RevealText as="h2" id="portfolio-title" split="chars" className="display text-[clamp(3rem,7vw,6rem)] !leading-[0.88]">
            {portfolio.title}
          </RevealText>
          <Reveal className="flex items-end gap-8 lg:max-w-[30rem] lg:pb-3">
            <p className="font-serif text-[clamp(1.5rem,2vw,1.875rem)] leading-[1.25] text-cloud/90">{portfolio.lead}</p>
            {rows.length ? (
              <p className="hidden shrink-0 border-l border-cloud/15 pl-6 sm:block">
                <span className="display block text-[2.75rem] tabular-nums text-lagoon">{pad(rows.length)}</span>
                <span className="label mt-1 block text-mist">Projects</span>
              </p>
            ) : null}
          </Reveal>
        </div>

        {rows.length ? (
          <>
            <WorkIndex rows={rows} />
            <WorkRail rows={rows} />
          </>
        ) : null}
      </div>
    </section>
  );
}
