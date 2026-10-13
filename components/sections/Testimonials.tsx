import { site } from "@/content/site";
import type { ContentRow } from "@/lib/content";
import { initials, safeImage } from "@/lib/urls";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { Marquee } from "../motion/Marquee";
import { SectionLabel } from "../ui/SectionLabel";

export function Testimonials({ rows }: { rows: ContentRow[] }) {
  const { testimonials } = site;
  return <section id="testimonials" data-header="light" aria-labelledby="testimonials-title" className="section-y overflow-hidden bg-cloud text-ink">
    <div className="wrap grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
      <Reveal className="lg:col-span-12"><SectionLabel index={testimonials.index}>{testimonials.eyebrow}</SectionLabel></Reveal>
      <RevealText as="h2" id="testimonials-title" lines={testimonials.title} className="display t-h2 lg:col-span-8" />
      {!rows.length && <Reveal className="self-end lg:col-span-4"><p className="text-[1.1875rem] leading-[1.55] text-slate">{testimonials.lead}</p></Reveal>}
    </div>
    {rows.length ? <Marquee className="mt-16 lg:mt-20" speed={70}>
      <div className="review-list flex shrink-0 gap-5 pr-5">
        {rows.map(row => <figure key={row.id} className="flex w-[min(84vw,26rem)] shrink-0 flex-col rounded-[24px] border border-ink/20 bg-cloud-2 p-7 sm:p-8">
          <span aria-hidden="true" className="font-serif text-[4.5rem] leading-[0.6] text-lagoon-ink">“</span>
          <blockquote className="mt-6 whitespace-pre-line font-serif text-[1.375rem] leading-[1.4]">{row.quote}</blockquote>
          <figcaption className="mt-auto flex items-center gap-3 pt-8">
            {safeImage(row.avatar_url) ? <img src={safeImage(row.avatar_url)} alt="" loading="lazy" decoding="async" className="size-11 rounded-full object-cover" /> : <span aria-hidden="true" className="label grid size-11 shrink-0 place-items-center rounded-full bg-monsoon text-lagoon">{initials(row.author_name)}</span>}
            <span><span className="block font-display text-[0.9375rem] font-semibold">{row.author_name}</span><span className="block text-[1rem] text-slate">{[row.author_role, row.company].filter(Boolean).join(', ')}</span></span>
          </figcaption>
        </figure>)}
      </div>
    </Marquee> : <div className="wrap mt-12"><div className="rounded-[24px] border border-dashed border-ink/30 p-8 sm:p-10"><p className="label text-lagoon-ink">Client stories, coming soon</p><p className="mt-4 max-w-xl text-[1.375rem] leading-[1.4]">We’re collecting feedback from the people we build with. In the meantime, explore the projects that brought us together.</p><a href="#portfolio" className="label link-line mt-6 inline-block">Explore our work ↗</a></div></div>}
  </section>;
}
