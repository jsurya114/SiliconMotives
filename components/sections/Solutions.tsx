import { site } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { SectionLabel } from "../ui/SectionLabel";
import { ArrowIcon } from "../ui/icons";

const { solutions } = site;

export function Solutions() {
  return (
    <section id="solutions" data-header="light" aria-labelledby="solutions-title" className="section-y bg-cloud text-ink">
      <div className="wrap">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
          <Reveal className="lg:col-span-12">
            <SectionLabel index={solutions.index}>{solutions.eyebrow}</SectionLabel>
          </Reveal>
          <RevealText as="h2" id="solutions-title" lines={solutions.title} className="display t-h2 lg:col-span-8" />
          <Reveal className="self-end lg:col-span-4">
            <p className="text-[1.125rem] leading-[1.55] text-slate">{solutions.lead}</p>
          </Reveal>
        </div>

        <Reveal as="ol" stagger={0.1} className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16 lg:gap-6">
          {solutions.items.map((item, i) => (
            <li key={item.name} className="flex flex-col rounded-[24px] bg-cloud-2 p-6 ring-1 ring-ink/[0.06] sm:p-8">
              <p className="label flex items-center justify-between text-lagoon-ink">
                <span>{item.kicker}</span>
                <span aria-hidden="true" className="tabular-nums text-slate">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </p>
              <h3 className="display mt-6 text-[clamp(1.625rem,2.2vw,2.125rem)] !leading-[1.02] !tracking-[-0.035em] sm:mt-10">{item.name}</h3>
              <p className="mt-4 text-[1.0625rem] leading-[1.6] text-slate">{item.body}</p>
              <a href="#contact" className="group mt-auto inline-flex items-center gap-2 self-start pt-6 font-display text-[0.9375rem] font-semibold sm:pt-8">
                <span className="link-line">{item.cta}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon size={14} />
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
