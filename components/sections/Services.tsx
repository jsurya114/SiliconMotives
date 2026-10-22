"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { websiteDesign } from "@/content/website-design";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { ArrowIcon } from "../ui/icons";
import { ServiceArt } from "./ServiceArt";
import type { ContentRow } from "@/lib/content";

const artSlugs = ["web", "custom", "cloud", "ongoing"];

const { services } = site;

export function Services({ rows }: { rows: ContentRow[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const pinEl = section.querySelector<HTMLElement>("[data-rail-pin]")!;
      const rail = section.querySelector<HTMLElement>("[data-rail]")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", section);

      const mm = gsap.matchMedia();
      // Desktop uses a pinned rail; mobile keeps a compact, swipeable row.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const drawCard = (card: HTMLElement) =>
          gsap.from(card.querySelectorAll("svg path, svg rect, svg circle"), {
            drawSVG: 0,
            duration: 1.6,
            stagger: 0.05,
            ease: "power2.inOut",
            paused: true,
          });

        gsap.set(rail, { overflowX: 'visible', scrollSnapType: 'none' });
        const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);
        const move = gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            // Pre-apply the pin a frame early so a fast scroll never catches it mid-switch.
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        cards.forEach((card, i) => {
          const art = drawCard(card);
          gsap.from(card, {
            x: 120,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: i === 0 ? undefined : move,
              start: i === 0 ? "top 80%" : "left 92%",
              once: true,
              onEnter: () => art.play(),
            },
          });
          const art3 = card.querySelector("[data-art]");
          if (art3)
            gsap.fromTo(
              art3,
              { xPercent: 10 },
              {
                xPercent: -10,
                ease: "none",
                scrollTrigger: { trigger: card, containerAnimation: move, start: "left right", end: "right left", scrub: true },
              },
            );
        });
      });
    },
    { scope: ref },
  );

  // Keyboard focus on an off-screen card scrolls the page to it.
  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    const section = ref.current;
    if (!card || !section || !window.matchMedia(`${MQ.motion} and ${MQ.desktop}`).matches) return;
    const rail = section.querySelector<HTMLElement>("[data-rail]")!;
    const pin = section.querySelector<HTMLElement>("[data-rail-pin]")!;
    const distance = rail.scrollWidth - window.innerWidth;
    const offset = Math.min(Math.max(card.offsetLeft - window.innerWidth * 0.1, 0), distance);
    const pinStart = pin.getBoundingClientRect().top + window.scrollY - (window.innerHeight - pin.offsetHeight) / 2;
    window.scrollTo({ top: pinStart + offset, behavior: "instant" });
  };

  return (
    <section
      ref={ref}
      id="services"
      data-header="dark"
      aria-labelledby="services-title"
      className="grain on-dark bg-monsoon text-cloud"
    >
      <div className="wrap grid gap-y-3 pt-8 pb-4 sm:gap-y-8 sm:pt-16 sm:pb-10 lg:grid-cols-12 lg:gap-x-8 lg:pt-[clamp(4.5rem,10vw,8.5rem)] lg:pb-0">
        <Reveal className="lg:col-span-12">
          <SectionLabel index={services.index} tone="dark">
            {services.eyebrow}
          </SectionLabel>
        </Reveal>
        <RevealText as="h2" id="services-title" lines={services.title} className="display text-[clamp(1.75rem,7.7vw,2.5rem)] sm:text-[clamp(2.5rem,6.2vw,6.25rem)] lg:col-span-9" />
        <Reveal className="self-end lg:col-span-3">
          <p className="text-sm leading-[1.5] text-mist sm:text-[1.1875rem] sm:leading-[1.55]">{services.lead}</p>
          <a href="/services" className="mt-2 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-lagoon"><span className="link-line">Explore engineering services</span><ArrowIcon size={14} /></a>
          <a href={websiteDesign.path} className="mt-2 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-lagoon"><span className="link-line">Website design in Kochi</span><ArrowIcon size={14} /></a>
        </Reveal>
      </div>

      <div data-rail-pin="" className="flex items-center overflow-x-clip pt-2 pb-8 sm:py-6 lg:h-svh lg:py-0">
        <ul data-rail="" aria-label={site.ui.servicesRail} className="rail w-full" onFocus={onFocus}>
          {rows.map((item, i) => (
            <li
              key={item.id}
              data-card=""
              className="grain flex w-[min(84vw,26rem)] shrink-0 flex-col overflow-hidden rounded-[24px] bg-harbour p-5 sm:p-8 lg:h-[min(72svh,40rem)] lg:w-[max(30rem,36vw)]"
            >
              <p className="label text-lagoon">{item.kicker}</p>
              <div className="my-3 flex h-16 items-center text-cloud/80 sm:my-8 sm:h-40 lg:my-auto lg:h-[min(30svh,13rem)]">
                <div data-art="" className="h-full">
                  <ServiceArt slug={artSlugs[i % artSlugs.length]} />
                </div>
              </div>
              <h3 className="display text-xl !leading-[0.98] !tracking-[-0.035em] sm:text-[clamp(1.5rem,2.4vw,2.25rem)] lg:!text-[clamp(2rem,3vw,3rem)]">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[30rem] text-sm leading-[1.5] text-mist sm:mt-4 sm:text-[1.0625rem] sm:leading-[1.6]">{item.description}</p>
              <a
                href="#contact"
                className="mt-4 inline-flex min-h-11 items-center gap-2 self-start font-display text-sm font-semibold text-cloud sm:mt-6 sm:min-h-0 sm:text-[0.9375rem]"
              >
                <span className="link-line">Discuss your project</span>
                <ArrowIcon size={14} />
              </a>
            </li>
          ))}
          <li aria-hidden="true" className="hidden w-[6vw] shrink-0 lg:block" />
        </ul>
      </div>
    </section>
  );
}
