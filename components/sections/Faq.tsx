import { site } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { PlusIcon } from "../ui/icons";
import type { ContentRow } from "@/lib/content";

const { faq } = site;

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
            <details key={item.id} className="faq-item group border-b border-ink/20">
              <summary className="flex items-start justify-between gap-6 py-7 font-display text-[clamp(1.25rem,1.8vw,1.625rem)] leading-[1.2] font-semibold tracking-[-0.025em] transition-colors hover:text-lagoon-ink">
                {item.question}
                <span className="faq-plus mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-ink/25 group-open:bg-ink group-open:text-cloud">
                  <PlusIcon size={18} />
                </span>
              </summary>
              <p className="max-w-[38rem] whitespace-pre-line pb-8 text-[1.0625rem] leading-[1.65] text-slate">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
