import { preload } from 'react-dom';
import { site } from '@/content/site';
import { ButtonLink } from '../ui/Button';
import { PinIcon } from '../ui/icons';
import { SkyFlight } from '../motion/SkyFlight';

const DIR = '/images/sky';
// A 1×1 transparent GIF: phones match this source first and never download the layer.
const NONE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

type Cloud = {
  name: string;
  widths: number[];
  /** Intrinsic size of the largest file, for the aspect ratio before it loads. */
  size: [number, number];
  sizes: string;
  /** Distance from the camera at rest; the copy sits at 7. */
  depth: number;
  /** Distances over which the plane thins out as the camera reaches it. */
  near?: string;
  /** Extra upward travel, as a share of the stage height, over the flight. */
  rise?: number;
  /** Tablet and desktop only. */
  wide?: boolean;
  priority?: boolean;
};

// Back to front. Sky, far and mid are cut from the original hero photograph, so the
// opening frame keeps the site's sky; the rest are keyed from licensed photographs
// (docs/sky-hero.md lists the sources and how the layers were made).
const BEHIND: Cloud[] = [
  { name: 'sky', widths: [960, 1920], size: [1920, 1080], sizes: '100vw', depth: 60, near: '0,0', priority: true },
  { name: 'far', widths: [1100, 1672], size: [1672, 941], sizes: '100vw', depth: 14, near: '0,0' },
  { name: 'mid', widths: [1100, 1672], size: [1672, 941], sizes: '100vw', depth: 9, near: '0,0', priority: true },
  { name: 'wisp', widths: [900, 1400], size: [1400, 894], sizes: '(min-width: 1024px) 27vw, 36vw', depth: 8, near: '0,0', wide: true },
];
const AHEAD: Cloud[] = [
  { name: 'bank', widths: [1100, 2000], size: [2000, 1221], sizes: '(min-width: 1024px) 74vw, 90vw', depth: 3.4, near: '1,0.5', rise: 0.42, wide: true },
  // The deck is defocused, so phones can ask for less than its 170vw box.
  { name: 'deck', widths: [1400, 2600], size: [2600, 1760], sizes: '(min-width: 768px) 100vw, 120vw', depth: 2.7, near: '0.5,0.12', rise: 0.5 },
  { name: 'fg-a', widths: [1200, 2000], size: [2000, 939], sizes: '(min-width: 1024px) 47vw, (min-width: 768px) 62vw, 70vw', depth: 2.5, near: '1,0.45' },
  { name: 'fg-b', widths: [900, 1400], size: [1400, 1067], sizes: '(min-width: 1024px) 21vw, 30vw', depth: 2, near: '1,0.5', wide: true },
];

const srcSet = (c: Cloud, ext: string) => c.widths.map((w) => `${DIR}/${c.name}-${w}.${ext} ${w}w`).join(', ');

function Layer({ cloud }: { cloud: Cloud }) {
  const largest = cloud.widths[cloud.widths.length - 1];
  return (
    <picture>
      {cloud.wide ? <source media="(max-width: 767.98px)" srcSet={NONE} /> : null}
      <source type="image/avif" srcSet={srcSet(cloud, 'avif')} sizes={cloud.sizes} />
      <img
        className={`sky-cloud sky-cloud--${cloud.name}`}
        src={`${DIR}/${cloud.name}-${largest}.webp`}
        srcSet={srcSet(cloud, 'webp')}
        sizes={cloud.sizes}
        width={cloud.size[0]}
        height={cloud.size[1]}
        alt=""
        draggable={false}
        decoding="async"
        loading={cloud.priority ? 'eager' : 'lazy'}
        fetchPriority={cloud.priority ? 'high' : 'low'}
        data-depth={cloud.depth}
        data-near={cloud.near}
        data-rise={cloud.rise}
      />
    </picture>
  );
}

export function Hero() {
  const { hero } = site;
  for (const cloud of BEHIND.filter((c) => c.priority)) {
    preload(`${DIR}/${cloud.name}-${cloud.widths[cloud.widths.length - 1]}.avif`, {
      as: 'image',
      type: 'image/avif',
      fetchPriority: 'high',
      imageSrcSet: srcSet(cloud, 'avif'),
      imageSizes: cloud.sizes,
    });
  }

  return (
    <SkyFlight id="home" data-header="light" aria-label={site.brand.name} className="sky-hero">
      <div data-sky-stage className="sky-hero__stage">
        <div aria-hidden="true" className="sky-hero__scene">
          {BEHIND.map((cloud) => <Layer key={cloud.name} cloud={cloud} />)}
          <div className="sky-hero__sun" />
          <div className="sky-hero__scrim" data-fade="0.18,0.5,1,0" />
        </div>

        <div data-sky-copy data-depth="7" data-near="0,0" data-origin="0% 62%" className="sky-hero__copy wrap">
          <div data-fade="0.24,0.54,1,0">
            <p className="label mb-6 flex min-w-0 items-center gap-3 sm:mb-8"><span aria-hidden="true" className="h-px w-8 shrink-0 bg-current opacity-40" />{hero.eyebrow}</p>
            <h1 className="hero-title display max-w-full text-[clamp(2.5rem,7.6vw,8rem)] !leading-[1.02] [overflow-wrap:break-word]">
              {hero.title.map((line, i) => <span key={line} className="block">{line}{i === 0 ? ' ' : null}</span>)}
            </h1>
          </div>
          <div data-fade="0.08,0.28,1,0" data-interactive className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-12 md:items-end">
            <p className="max-w-[34rem] text-[1.0625rem] leading-[1.55] text-ink/85 sm:text-[1.1875rem] md:col-span-6 lg:col-span-5">{hero.lead}</p>
            <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-self-end lg:col-span-7">
              <ButtonLink href={hero.cta.href} variant="lagoon">{hero.cta.label}</ButtonLink>
              <ButtonLink href={hero.agencyCta.href} variant="ghost" className="on-light">{hero.agencyCta.label}</ButtonLink>
            </div>
          </div>
          <div data-fade="0.02,0.14,1,0" className="hero-footer-row mt-10 grid grid-cols-2 items-center gap-6 border-t border-ink/15 pt-4 sm:mt-14">
            <p className="label flex items-center gap-2 text-[0.6875rem] sm:text-[0.8125rem]"><span className="shrink-0"><PinIcon size={15} /></span>{hero.location}</p>
            <p className="label max-w-[20rem] justify-self-end text-right text-[0.6875rem] sm:text-[0.8125rem]">{hero.promise}</p>
          </div>
        </div>

        <div aria-hidden="true" className="sky-hero__ahead">
          {AHEAD.map((cloud) => <Layer key={cloud.name} cloud={cloud} />)}
          <div className="sky-hero__haze" data-fade="0.6,0.95,0,0.8" />
          <div className="sky-hero__floor" data-fade="0.72,1,0,1" />
        </div>
      </div>
    </SkyFlight>
  );
}
