import { site } from "@/content/site";
import Image from "next/image";
import type { ContentRow } from "@/lib/content";
import { initials, safeImage } from "@/lib/urls";
import { clientLogo } from "@/lib/client-logos";
import { clientPortrait } from '@/content/client-people';
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { Marquee } from "../motion/Marquee";
import { SectionLabel } from "../ui/SectionLabel";

export function Testimonials({ rows, clients = [] }: { rows: ContentRow[]; clients?: ContentRow[] }) {
  const { testimonials } = site;
  if (!rows.length) return null;
  const clientKey = (value: unknown) => String(value || '').trim().toLowerCase().replace(/s$/, '');
  const displayCompany = (value: unknown) => /^nasalogistics?$/i.test(String(value || '').trim()) ? 'NasaLogistics' : String(value || '');
  return <section id="testimonials" data-header="light" aria-labelledby="testimonials-title" className="section-y overflow-hidden bg-cloud text-ink">
    <div className="wrap grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
      <Reveal className="lg:col-span-12"><SectionLabel index={testimonials.index}>{testimonials.eyebrow}</SectionLabel></Reveal>
      <RevealText as="h2" id="testimonials-title" lines={testimonials.title} className="display t-h2 lg:col-span-8" />
    </div>
    {/* Phones get smaller cards and type, so a quote reads in one glance and the next card peeks in. */}
    <Marquee className="mt-10 sm:mt-16 lg:mt-20" speed={12}>
      <div className="review-list flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">
        {rows.map(row => { const company = displayCompany(row.company); const client = clients.find((item) => item.id === row.client_id || clientKey(item.name) === clientKey(company)); const portrait = clientPortrait(row.author_name, company); const avatar = portrait?.image || safeImage(row.avatar_url); return <figure key={row.id} className="flex w-[min(78vw,20rem)] shrink-0 flex-col rounded-[20px] bg-cloud-2 p-5 ring-1 ring-ink/10 sm:w-[min(84vw,26rem)] sm:rounded-[24px] sm:p-8">
          <span aria-hidden="true" className="font-serif text-[3rem] leading-[0.6] text-lagoon-ink sm:text-[4.5rem]">“</span>
          <blockquote className="mt-3 whitespace-pre-line font-serif text-[1.0625rem] leading-[1.5] sm:mt-6 sm:text-[1.375rem] sm:leading-[1.4]">{row.quote}</blockquote>
          <figcaption className="mt-auto flex items-center gap-3 pt-5 sm:pt-8">
            {avatar ? <span className="size-9 shrink-0 overflow-hidden rounded-full sm:size-11"><Image src={avatar} alt="" width={44} height={44} sizes={portrait ? '88px' : '44px'} unoptimized={!avatar.startsWith('/')} loading="lazy" className={`size-full object-cover ${portrait ? 'origin-[50%_25%] scale-200' : ''}`} style={portrait ? { objectPosition: portrait.position } : undefined} /></span> : <span aria-hidden="true" className="label grid size-9 shrink-0 place-items-center rounded-full bg-monsoon text-[0.6875rem] text-lagoon sm:size-11 sm:text-[0.8125rem]">{initials(row.author_name)}</span>}
            <span><span className="block font-display text-[0.875rem] font-semibold sm:text-[0.9375rem]">{row.author_name}</span><span className="block text-[0.875rem] text-slate sm:text-[1rem]">{[row.author_role, company].filter(Boolean).join(', ')}</span></span>
            {client && clientLogo(client.name, client.logo_url) && <Image src={clientLogo(client.name, client.logo_url)} alt={`${client.name} logo`} width={96} height={32} sizes="(min-width: 640px) 96px, 64px" unoptimized={!clientLogo(client.name, client.logo_url).startsWith('/')} loading="lazy" className="ml-auto h-6 w-16 object-contain sm:h-8 sm:w-24" />}
          </figcaption>
        </figure>; })}
      </div>
    </Marquee>
  </section>;
}
