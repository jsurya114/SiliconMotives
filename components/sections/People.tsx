import { site } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { RevealImage } from "../motion/RevealImage";
import { SectionLabel } from "../ui/SectionLabel";
import { ArrowUpRight, LinkedInIcon } from "../ui/icons";
import type { ContentRow } from "@/lib/content";
import { initials, safeImage } from "@/lib/urls";

const { people } = site;

export function People({ rows }: { rows: ContentRow[] }) {
  return (
    <section id="team" data-header="dark" aria-labelledby="people-title" className="grain on-dark section-y bg-monsoon text-cloud">
      <div className="wrap">
        <Reveal>
          <SectionLabel index={people.index} tone="dark">
            {people.eyebrow}
          </SectionLabel>
        </Reveal>
        <RevealText as="h2" id="people-title" lines={people.title} className="display t-h1 mt-8" />

        <div className="mt-12 grid gap-y-14 lg:mt-16 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <Reveal stagger={0.1} className="space-y-6">
              {people.body.map((p) => (
                <p key={p} className="text-[1.1875rem] leading-[1.6] text-cloud/85">
                  {p}
                </p>
              ))}
              <p className="label inline-flex items-center gap-2 rounded-full px-4 py-2 text-lagoon ring-1 ring-lagoon/40">
                {people.badge}
              </p>
            </Reveal>
          </div>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:col-span-7 lg:col-start-6">
            {rows.map((f, i) => {
              const founder = people.founders.find(person => person.name.toLowerCase() === String(f.name).trim().toLowerCase());
              const photo = safeImage(f.photo_url || founder?.image);
              return <li key={f.id} className="max-w-[17rem]">
                {photo ? <RevealImage
                  src={photo}
                  alt=""
                  sizes="(min-width: 640px) 17rem, 50vw"
                  radius={20}
                  className="aspect-[4/5] bg-harbour"
                  imgClassName="object-[50%_25%]"
                  parallax
                /> : <div aria-hidden="true" className="display grid aspect-[4/5] place-items-center rounded-[20px] bg-harbour text-[3.5rem] text-lagoon">{initials(f.name)}</div>}
                <Reveal className="mt-5 flex flex-col items-start gap-4">
                  <div>
                    <p className="label text-mist">{f.kicker || `Team ${String(i + 1).padStart(2, '0')}`}</p>
                    <h3 className="mt-2 font-display text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.1] font-bold tracking-[-0.03em]">{f.name}</h3>
                    <p className="mt-1 text-cloud/80">{founder?.role || f.role}</p>
                  </div>
                  {founder && <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 font-display text-[0.8125rem] font-semibold ring-1 ring-cloud/25 transition-colors hover:bg-cloud hover:text-monsoon"
                  >
                    <LinkedInIcon size={14} />
                    <span>
                      <span className="hidden sm:inline">{people.linkedinLabel}</span>
                      <span className="sm:hidden">LinkedIn</span>
                      <span className="sr-only">: {f.name}</span>
                    </span>
                    <ArrowUpRight size={14} />
                  </a>}
                </Reveal>
              </li>;
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
