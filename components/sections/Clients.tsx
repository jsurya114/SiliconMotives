import { site } from "@/content/site";
import Image from "next/image";
import type { ContentRow } from "@/lib/content";
import { initials, safeUrl } from "@/lib/urls";
import { clientLogo } from "@/lib/client-logos";
import { Marquee } from "../motion/Marquee";
import { RevealText } from "../motion/RevealText";
import { SectionLabel } from "../ui/SectionLabel";

export function Clients({ rows }: { rows: ContentRow[] }) {
  return <section id="clients" data-header="light" aria-labelledby="clients-title" className="overflow-hidden bg-lagoon py-10 text-monsoon sm:py-20">
    <div className="wrap">
      <SectionLabel className="mb-3 sm:mb-4">Companies we’ve worked with</SectionLabel>
      <RevealText as="h2" id="clients-title" className="display t-h3 !text-[1.5rem] sm:!text-[clamp(1.75rem,3vw,2.75rem)]">{site.clients.title}</RevealText>
    </div>
    {/* Phones get a compact strip: smaller logos, tighter spacing, three or more in view. */}
    <Marquee className="mt-6 sm:mt-14" speed={6}>
      <ul className="client-list flex shrink-0 items-center">
        {rows.map(row => {
          const logo = clientLogo(row.name, row.logo_url);
          const url = safeUrl(row.website_url);
          const content = <span className="flex w-24 flex-col items-center gap-2 sm:w-36 sm:gap-3">
            {/* A client without a logo keeps the same slot, so every name lines up. */}
            {logo ? <Image src={logo} alt="" width={144} height={80} sizes="(min-width: 640px) 144px, 96px" unoptimized={!logo.startsWith('/')} loading="lazy" className="h-12 w-24 object-contain sm:h-20 sm:w-36" /> : <span aria-hidden="true" className="display grid h-12 w-24 place-items-center text-[1.75rem] opacity-80 sm:h-20 sm:w-36 sm:text-[2.5rem]">{initials(row.name)}</span>}
            <span className="font-display text-xs font-semibold tracking-wide sm:text-base">{row.name}</span>
          </span>;
          return <li key={row.id} className="flex items-center">
            {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="mx-4 flex min-h-16 items-center sm:mx-12 sm:min-h-24">{content}</a> : <div className="mx-4 flex min-h-16 items-center sm:mx-12 sm:min-h-24">{content}</div>}
          </li>;
        })}
      </ul>
    </Marquee>
  </section>;
}
