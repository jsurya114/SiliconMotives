import { site } from "@/content/site";
import Image from "next/image";
import type { ContentRow } from "@/lib/content";
import { safeUrl } from "@/lib/urls";
import { clientLogo } from "@/lib/client-logos";
import { clientPeople, clientCompanyKey } from '@/content/client-people';
import { Marquee } from "../motion/Marquee";
import { RevealText } from "../motion/RevealText";
import { SectionLabel } from "../ui/SectionLabel";

export function Clients({ rows }: { rows: ContentRow[] }) {
  const people = clientPeople.filter(person => rows.some(row => clientCompanyKey(row.name) === clientCompanyKey(person.company)));
  return <section id="clients" data-header="light" aria-labelledby="clients-title" className="overflow-hidden bg-lagoon py-16 text-monsoon sm:py-20">
    <div className="wrap">
      <SectionLabel className="mb-4">Companies we’ve worked with</SectionLabel>
      <RevealText as="h2" id="clients-title" className="display t-h3 !text-[clamp(1.75rem,3vw,2.75rem)]">{site.clients.title}</RevealText>
    </div>
    <Marquee className="mt-10 sm:mt-14" speed={36}>
      <ul className="client-list flex shrink-0 items-center">
        {rows.map(row => {
          const logo = clientLogo(row.name, row.logo_url);
          const url = safeUrl(row.website_url);
          const content = <span className="flex w-36 flex-col items-center gap-3">
            {logo && <Image src={logo} alt="" width={144} height={80} sizes="144px" unoptimized={!logo.startsWith('/')} loading="lazy" className="h-20 w-36 object-contain" />}
            <span className="font-display text-sm font-semibold tracking-wide sm:text-base">{row.name}</span>
          </span>;
          return <li key={row.id} className="flex items-center">
            {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="mx-8 flex min-h-24 items-center sm:mx-12">{content}</a> : <div className="mx-8 flex min-h-24 items-center sm:mx-12">{content}</div>}
          </li>;
        })}
      </ul>
    </Marquee>
    {people.length > 0 && <div className="wrap mt-8 sm:mt-10">
      <ul aria-label="Client representatives" className="grid grid-cols-3 gap-4 border-t border-monsoon/15 pt-6 sm:gap-8">
        {people.map(person => <li key={person.company} className="flex min-w-0 flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:text-left">
          <span className="size-16 shrink-0 overflow-hidden rounded-full"><Image src={person.image} alt={person.name} width={64} height={64} sizes="128px" loading="lazy" className="size-full origin-[50%_25%] scale-200 object-cover" style={{ objectPosition: person.position }} /></span>
          <span className="min-w-0 font-display"><span className="block text-sm font-semibold sm:text-base">{person.name}</span><span className="mt-0.5 block text-xs text-monsoon/75 sm:text-sm">{person.company}</span></span>
        </li>)}
      </ul>
    </div>}
  </section>;
}
