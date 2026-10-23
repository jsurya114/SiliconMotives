import { site } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { ArrowIcon, InstagramIcon } from "../ui/icons";
import { INSTAGRAM_URL } from '@/lib/social-links';
import { BrandLogo } from '../BrandLogo';

const { footer } = site;

export function Footer() {
  return (
    <footer data-header="dark" className="grain on-dark overflow-hidden bg-monsoon pt-20 text-cloud lg:pt-24">
      <div className="wrap">
        <div className="relative z-[2] grid grid-cols-2 items-start gap-x-8 gap-y-12 md:gap-x-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
          <div className="col-span-2 min-w-0 lg:col-span-4">
            <a href="/" aria-label={site.ui.homeLabel} className="inline-flex min-h-11 items-center"><BrandLogo light /></a>
            <p className="mt-4 font-serif text-[1.375rem] leading-[1.3] text-cloud/85">{site.brand.tagline}</p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-mist">Custom Software · Cloud Infrastructure · DevOps</p>
          </div>

          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="min-w-0 lg:col-span-2">
              <p className="label text-mist">{col.title}</p>
              <ul className="mt-5 space-y-2.5 font-display text-[1rem] font-medium">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="opacity-85 transition-opacity hover:opacity-100">{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 min-w-0 lg:col-span-4">
            <p className="label text-mist">Kerala, India · Remote-first</p>
            <div className="mt-5 border-t border-cloud/15 pt-4 text-sm leading-6 text-mist">
              <p>SiliconMotives is operated by Millionian LLC, a Wyoming limited liability company.</p>
            </div>
            <div className="mt-5 flex flex-col items-start gap-3">
              <a className="font-display text-sm font-semibold text-lagoon" href="mailto:hello@siliconmotives.com">hello@siliconmotives.com</a>
              <a href="/contact" className="inline-flex items-center gap-2 font-display text-[0.9375rem] font-semibold text-lagoon">
                <span className="link-line">Start a conversation</span>
                <ArrowIcon size={14} />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-medium text-cloud/85 transition-colors hover:text-lagoon"><InstagramIcon size={16} />Instagram</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 select-none lg:mt-20" aria-hidden="true">
        <RevealText
          as="p"
          split="chars"
          start="top 95%"
          className="display whitespace-nowrap text-center text-[12.4vw] !leading-[0.8] !tracking-[-0.06em] text-lagoon"
        >
          {site.brand.name}
        </RevealText>
      </div>

      <div className="wrap mt-8 grid grid-cols-1 gap-4 border-t border-cloud/15 py-6 text-[0.9375rem] text-mist sm:grid-cols-3 sm:items-center sm:gap-6">
        <p>{footer.copyright}</p>
        <p className="sm:text-center">{site.brand.tagline}</p>
        <a href="#main" className="label inline-flex items-center gap-2 text-cloud sm:justify-self-end">
          {footer.backToTop}
          <span className="-rotate-90"><ArrowIcon size={14} /></span>
        </a>
      </div>
    </footer>
  );
}
