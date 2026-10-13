"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { animate, stagger, utils } from "animejs";
import { site } from "@/content/site";
import { MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { ArrowIcon } from "../ui/icons";
import type { ContentRow } from "@/lib/content";
import { safeImage, initials } from "@/lib/urls";

const { portfolio } = site;
const EASE = "outExpo";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia(MQ.reduced).matches;

/** "Woobe — Fashion, by Weight" → ["Woobe", "Fashion, by Weight"] */
function splitTitle(title: unknown) {
  const [name, ...rest] = String(title ?? "").split(" — ");
  return { name, descriptor: rest.join(" — ") };
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

/* ── Desktop: an index of every project beside one large live preview ──────── */

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
      utils.set(el.querySelector("[data-frame]")!, { clipPath: "inset(12% 10% 12% 10% round 24px)" });
      utils.set(el.querySelector("[data-caption]")!, { opacity: 0 });
    },
    (el) => {
      animate(el.querySelectorAll("[data-row]"), { opacity: 1, translateY: 0, duration: 1100, delay: stagger(70), ease: EASE });
      animate(el.querySelector("[data-frame]")!, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1400, ease: EASE });
      animate(el.querySelector("[data-caption]")!, { opacity: 1, duration: 900, delay: 500, ease: EASE });
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
    animate(caption, { opacity: [0, 1], translateY: [14, 0], duration: 800, delay: stagger(60, { start: 120 }), ease: EASE });
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
  const finePointer = () => window.matchMedia(MQ.finePointer).matches;

  return (
    <div ref={root} className="hidden lg:grid lg:grid-cols-12 lg:gap-x-8">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-labelledby="portfolio-title"
        onKeyDown={onKeyDown}
        className="relative col-span-5 self-start border-t border-cloud/15"
      >
        <span data-indicator="" aria-hidden="true" className="absolute top-0 left-0 w-0.5 bg-lagoon" />
        {rows.map((item, i) => {
          const { name, descriptor } = splitTitle(item.title);
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
              className="group flex w-full items-center justify-between gap-4 border-b border-cloud/15 py-4 pr-2 pl-5 text-left"
            >
              <span className="block">
                <span
                  className={`display block text-[clamp(1.5rem,2.15vw,2.25rem)] transition-colors duration-300 ${
                    selected ? "text-cloud" : "text-mist group-hover:text-cloud/90"
                  }`}
                >
                  {name}
                </span>
                {descriptor ? (
                  <span className="mt-2 block font-display text-[0.9375rem] font-semibold tracking-[-0.01em] text-mist">
                    {descriptor}
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

      <div
        id="work-panel"
        role="tabpanel"
        aria-labelledby={current ? `work-tab-${current.id}` : undefined}
        className="col-span-7"
      >
        <div data-frame="" className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-harbour">
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
            className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-0.5 bg-lagoon opacity-0 shadow-[0_0_24px_4px_rgba(126,226,209,0.55)]"
          />
        </div>
        <div data-caption="" className="mt-5 grid min-h-[5rem] grid-cols-7 gap-x-6">
          <p className="label col-span-2 pt-1.5 tracking-[0.06em] text-lagoon">{current?.category}</p>
          <p className="col-span-5 text-[1.125rem] leading-[1.6] text-cloud/85">{current?.description}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Tablet and phone: compact cards, two up on tablets ────────────────────── */

function WorkCard({ item, wide = false }: { item: ContentRow; wide?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { name, descriptor } = splitTitle(item.title);

  useEnter(
    ref,
    (el) => {
      utils.set(el.querySelector("[data-cover]")!, { clipPath: "inset(14% 8% 14% 8% round 20px)" });
      utils.set(el.querySelectorAll("[data-text] > *"), { opacity: 0, translateY: 24 });
    },
    (el) => {
      animate(el.querySelector("[data-cover]")!, { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1300, ease: EASE });
      animate(el.querySelector("[data-cover] img") ?? el, { scale: [1.18, 1], duration: 1600, ease: EASE });
      animate(el.querySelectorAll("[data-text] > *"), { opacity: 1, translateY: 0, duration: 1000, delay: stagger(70, { start: 200 }), ease: EASE });
    },
  );

  return (
    <article ref={ref} aria-labelledby={`work-card-${item.id}`}>
      <div data-cover="" className={`relative aspect-[16/10] overflow-hidden rounded-[20px] bg-harbour ${wide ? "md:aspect-[21/9]" : ""}`}>
        <Cover item={item} sizes={wide ? "100vw" : "(min-width: 768px) 46vw, 100vw"} />
      </div>
      <div data-text="" className="mt-6">
        <p className="label tracking-[0.06em] text-lagoon">{item.category}</p>
        <h3 id={`work-card-${item.id}`} className="mt-3">
          <span className="display block text-[clamp(2rem,6.5vw,2.75rem)]">{name}</span>
          {descriptor ? <span className="sr-only"> — </span> : null}
          {descriptor ? (
            <span className="mt-2 block font-display text-[1rem] font-semibold tracking-[-0.01em] text-cloud/80">{descriptor}</span>
          ) : null}
        </h3>
        <p className="mt-4 text-[1.0625rem] leading-[1.6] text-mist">{item.description}</p>
      </div>
    </article>
  );
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  return (
    <section id="portfolio" data-header="dark" aria-labelledby="portfolio-title" className="grain on-dark bg-monsoon py-20 text-cloud sm:py-24 lg:py-28">
      <div className="wrap relative z-[2]">
        <Reveal>
          <SectionLabel index={portfolio.index} tone="dark">
            {portfolio.eyebrow}
          </SectionLabel>
        </Reveal>
        <div className="mt-6 mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <RevealText as="h2" id="portfolio-title" split="chars" className="display text-[clamp(3rem,7vw,6rem)] !leading-[0.88]">
            {portfolio.title}
          </RevealText>
          <Reveal className="lg:max-w-[22rem] lg:pb-3">
            <p className="font-serif text-[clamp(1.5rem,2vw,1.875rem)] leading-[1.25] text-cloud/90">{portfolio.lead}</p>
          </Reveal>
        </div>

        {rows.length ? <WorkIndex rows={rows} /> : null}

        <ul className="grid gap-10 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:hidden">
          {rows.map((item, i) => {
            // An odd one out on tablets spans both columns instead of sitting alone.
            const wide = rows.length % 2 === 1 && i === rows.length - 1;
            return (
              <li key={item.id} className={wide ? "md:col-span-2" : ""}>
                <WorkCard item={item} wide={wide} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
