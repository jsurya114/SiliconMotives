import { site } from '@/content/site';
import { RevealText } from '../motion/RevealText';
import { Reveal } from '../motion/Reveal';
import { SectionLabel } from '../ui/SectionLabel';

const { remote } = site;

export function Remote() {
  return (
    <section data-header="dark" aria-labelledby="remote-title" className="on-dark section-y bg-harbour text-cloud">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal><SectionLabel index={remote.index} tone="dark">{remote.eyebrow}</SectionLabel></Reveal>
            <RevealText as="h2" id="remote-title" lines={remote.title} className="display t-h2 mt-7" />
            <Reveal className="mt-6 max-w-[36rem]">
              <p className="font-serif text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.35] text-cloud/90">{remote.lead}</p>
            </Reveal>
          </div>
          <aside className="border-t border-cloud/20 pt-5 lg:col-span-4 lg:col-start-9">
            <p className="label text-lagoon">Engineering operations</p>
            <p className="mt-3 font-display text-2xl font-semibold">Kerala, India</p>
            <p className="mt-2 text-base text-mist">India Standard Time · UTC+05:30</p>
            <p className="mt-4 text-sm leading-6 text-mist">We agree meeting windows with each partner and keep decisions and progress visible in writing.</p>
          </aside>
        </div>

        <ul className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-16">
          {remote.principles.map((principle, index) => (
            <li key={principle.name} className="border-t border-cloud/15 pt-5">
              <p className="label text-lagoon">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="display t-h3 mt-3">{principle.name}</h3>
              <p className="mt-3 text-base leading-7 text-mist">{principle.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
