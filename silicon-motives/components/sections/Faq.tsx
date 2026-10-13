"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { PlusIcon } from "../ui/icons";
import type { ContentRow } from "@/lib/content";

const { faq } = site;

function Item({ item }: { item: ContentRow }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${item.id}`;
  return (
    <div className="faq-row border-b border-ink/20" data-open={open || undefined}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-6 px-0 py-6 text-left font-display text-[clamp(1.125rem,1.8vw,1.625rem)] leading-[1.25] font-semibold tracking-[-0.025em] transition-colors hover:text-lagoon-ink sm:py-7"
        >
          {item.question}
          <span className="faq-plus mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-ink/25">
            <PlusIcon size={18} />
          </span>
        </button>
      </h3>
      {/* Height animates through grid rows (0fr → 1fr), which every browser
          supports; positions below are re-measured once it settles. */}
      <div
        id={id}
        role="region"
        aria-label={String(item.question)}
        inert={!open}
        className="faq-panel"
        onTransitionEnd={(e) => {
          if (e.propertyName === "grid-template-rows") ScrollTrigger.refresh();
        }}
      >
        <div className="overflow-hidden">
          <p className="max-w-[38rem] whitespace-pre-line pb-7 text-[1.0625rem] leading-[1.65] text-slate">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq({ rows }: { rows: ContentRow[] }) {
  return (
    <section id="faq" data-header="light" aria-labelledby="faq-title" className="section-y bg-cloud-2 text-ink">
      <div className="wrap grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <SectionLabel index={faq.index}>{faq.eyebrow}</SectionLabel>
            </Reveal>
            <RevealText as="h2" id="faq-title" lines={faq.title} className="display t-h2 mt-8" />
          </div>
        </div>
        <Reveal as="div" stagger={0.08} className="border-t border-ink/20 lg:col-span-7">
          {rows.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
