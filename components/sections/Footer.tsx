import { site } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { ArrowIcon } from "../ui/icons";

const { footer } = site;

export function Footer() {
  return (
    <footer data-header="dark" className="grain on-dark overflow-hidden bg-monsoon pt-20 text-cloud lg:pt-24">
      <div className="wrap">
        <div className="relative z-[2] grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-8">
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

      <div className="mt-16 select-none lg:mt-20" aria-hidden="true">
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
