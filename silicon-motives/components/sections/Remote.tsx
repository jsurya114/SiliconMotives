import { site } from "@/content/site";
import { SectionLabel } from "../ui/SectionLabel";
import { PinIcon } from "../ui/icons";

const { remote } = site;

// A still section: the principles sit beside the statement as a short stack of cards.
export function Remote() {
  return (
    <section data-header="dark" aria-labelledby="remote-title" className="grain on-dark section-y overflow-hidden bg-harbour text-cloud">
      <div className="wrap relative z-[2] grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-6">
          <SectionLabel index={remote.index} tone="dark">
            {remote.eyebrow}
          </SectionLabel>
          <h2 id="remote-title" className="display t-h2 mt-8">
            {remote.title.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i < remote.title.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p className="mt-8 max-w-[30rem] font-serif text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.3] text-cloud/90">{remote.lead}</p>
          <p className="label mt-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-lagoon ring-1 ring-lagoon/40">
            <PinIcon size={14} />
            {remote.badge}
          </p>
        </div>

        <ul className="grid content-center gap-3 lg:col-span-6 lg:col-start-7">
          {remote.principles.map((p, i) => (
            <li key={p.name} className="grid grid-cols-[auto_1fr] gap-x-5 rounded-[22px] bg-monsoon/60 p-6 ring-1 ring-cloud/10 sm:p-7">
              <span
                aria-hidden="true"
                className="label grid size-10 place-items-center rounded-full bg-lagoon/10 tabular-nums text-lagoon ring-1 ring-lagoon/30"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-[1.375rem] leading-[1.15] font-bold tracking-[-0.025em]">{p.name}</h3>
                <p className="mt-2 text-[1.0625rem] leading-[1.6] text-mist">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
