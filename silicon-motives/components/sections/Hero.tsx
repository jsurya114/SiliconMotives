import Image from 'next/image';
import { site } from '@/content/site';
import { ButtonLink } from '../ui/Button';
import { ChatIcon, PinIcon } from '../ui/icons';

// The reference's initial composition, without its intro, pinning or parallax.
export function Hero() {
  const { hero } = site;
  return <section id="home" data-header="light" aria-label={site.brand.name} className="hero-static relative overflow-hidden bg-cloud">
    <Image src="/images/cloud-sky.jpg" alt="" fill preload sizes="100vw" className="object-cover object-[30%_50%]" />
    <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(236,240,242,.72) 0%, rgba(236,240,242,.35) 45%, rgba(236,240,242,0) 75%), linear-gradient(0deg, rgba(236,240,242,.6) 0%, rgba(236,240,242,0) 30%)' }} />
    <div className="wrap relative flex min-h-svh flex-col justify-end pt-32 pb-6 sm:pb-8">
      <p className="label mb-6 flex items-center gap-3 sm:mb-8"><span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />{hero.eyebrow}</p>
      <h1 className="hero-title display text-[13vw] leading-[0.9] sm:text-[11vw] md:text-[9.4vw] 2xl:text-[11.5rem]">
        {hero.title.map((line, i) => <span key={line} className="block md:whitespace-nowrap">{line}{i === 0 ? ' ' : null}</span>)}
      </h1>
      <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-12 md:items-end">
        <p className="max-w-[34rem] text-[1.0625rem] leading-[1.55] text-ink/85 sm:text-[1.1875rem] md:col-span-6 lg:col-span-5">{hero.lead}</p>
        <div className="md:col-span-6 md:justify-self-end lg:col-span-7"><ButtonLink href={hero.cta.href} icon={<ChatIcon />}>{hero.cta.label}</ButtonLink></div>
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-ink/15 pt-4 sm:mt-14">
        <p className="label flex items-center gap-2"><PinIcon size={15} />{hero.location}</p>
        <p className="label hidden sm:block">{hero.promise}</p>
      </div>
    </div>
  </section>;
}
