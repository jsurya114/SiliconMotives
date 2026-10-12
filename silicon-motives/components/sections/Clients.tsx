import { site } from "@/content/site";
import type { ContentRow } from "@/lib/content";
import { safeImage, safeUrl } from "@/lib/urls";
import { Marquee } from "../motion/Marquee";
import { RevealText } from "../motion/RevealText";
import { SectionLabel } from "../ui/SectionLabel";

export function Clients({ rows }: { rows: ContentRow[] }) {
  return <section id="clients" data-header="light" aria-labelledby="clients-title" className="overflow-hidden bg-lagoon py-16 text-monsoon sm:py-20">
    <div className="wrap">
      <SectionLabel className="mb-4">{site.clients.eyebrow}</SectionLabel>
      <RevealText as="h2" id="clients-title" className="display t-h3 !text-[clamp(1.75rem,3vw,2.75rem)]">{site.clients.title}</RevealText>
    </div>
    <Marquee className="mt-10 sm:mt-14" speed={36} label="client showcase">
      <ul className="client-list flex shrink-0 items-center">
        {rows.map(row => {
          const logo = safeImage(row.logo_url);
          const url = safeUrl(row.website_url);
          const content = logo ? <img src={logo} alt={row.name} loading="lazy" decoding="async" className="h-16 w-auto max-w-[16rem] object-contain sm:h-20 sm:max-w-[20rem]" /> : <span className="display text-[clamp(3rem,8vw,7rem)] leading-[1.05]">{row.name}</span>;
          return <li key={row.id} className="flex items-center">
            {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="mx-8 flex min-h-24 items-center sm:mx-12">{content}</a> : <div className="mx-8 flex min-h-24 items-center sm:mx-12">{content}</div>}
            <span aria-hidden="true" className="inline-block size-3 rounded-full border-2 border-monsoon" />
          </li>;
        })}
      </ul>
    </Marquee>
  </section>;
}
