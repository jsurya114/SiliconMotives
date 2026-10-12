import { site } from "@/content/site";
import { ScrubWords } from "../motion/ScrubWords";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";

const { belief } = site;

export function Belief() {
  return (
    <section id="about" data-header="light" aria-labelledby="belief-title" className="section-y bg-cloud text-ink">
      <div className="wrap grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <Reveal className="lg:col-span-3 lg:pt-4">
          <SectionLabel index={belief.index}>{belief.eyebrow}</SectionLabel>
        </Reveal>
        <div className="lg:col-span-9">
          <ScrubWords
            as="h2"
            id="belief-title"
            lines={belief.statement}
            from="#76848f"
            to="#0b1a2b"
            className="font-display text-[clamp(2.1rem,4.7vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.04em]"
          />
          <Reveal className="mt-12 grid gap-6 md:grid-cols-9 lg:mt-16">
            <p className="text-[1.1875rem] leading-[1.6] text-slate md:col-span-5 md:col-start-5">{belief.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
