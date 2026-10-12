import { site } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { ArrowIcon } from "../ui/icons";

const { footer } = site;

export function Footer() {
  return (
    <footer data-header="dark" className="grain on-dark overflow-hidden bg-monsoon pt-24 text-cloud lg:pt-32">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-lagoon">{footer.eyebrow}</p>
            <RevealText as="h2" lines={footer.title} className="display t-h2 mt-6" />
          </div>
          <Reveal>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 font-display text-[1.25rem] font-semibold tracking-[-0.02em]"
            >
              <span className="link-line">{footer.cta}</span>
              <span className="grid size-11 place-items-center rounded-full bg-lagoon text-monsoon transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-rotate-45">
                <ArrowIcon />
              </span>
            </a>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-cloud/15 pt-12 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-4">
            <p className="font-display text-[1.25rem] font-extrabold tracking-[-0.04em]">{site.brand.name}</p>
            <p className="mt-4 font-serif text-[1.375rem] leading-[1.3] text-cloud/85">
              {footer.tagline.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
            <p className="label mt-6 text-mist">{footer.meta}</p>
          </div>
          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
              <p className="label text-mist">{col.title}</p>
              <ul className="mt-5 space-y-2.5 font-display text-[1rem] font-medium">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="opacity-85 transition-opacity hover:opacity-100">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 lg:col-span-4">
            <p className="label text-mist">{footer.based.title}</p>
            <p className="mt-5 font-display text-[1rem] font-medium">
              {footer.based.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
            <p className="mt-4 text-cloud/80">
              {footer.based.remote.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-2 font-display text-[0.9375rem] font-semibold text-lagoon">
              <span className="link-line">{footer.based.cta}</span>
              <ArrowIcon size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20 select-none lg:mt-28" aria-hidden="true">
        <RevealText
          as="p"
          split="chars"
          start="top 95%"
          className="display text-center text-[12.4vw] !leading-[0.8] !tracking-[-0.06em] whitespace-nowrap text-lagoon"
        >
          {site.brand.name}
        </RevealText>
      </div>

      <div className="wrap mt-8 flex flex-col gap-3 border-t border-cloud/15 py-6 text-[0.9375rem] text-mist sm:flex-row sm:items-center sm:justify-between">
        <p>{footer.copyright}</p>
        <p>{site.brand.tagline}</p>
        <a href="#home" className="label inline-flex items-center gap-2 text-cloud">
          {footer.backToTop}
          <span className="-rotate-90">
            <ArrowIcon size={14} />
          </span>
        </a>
      </div>
    </footer>
  );
}
