import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/social-links';
import { InstagramIcon, ArrowUpRight } from '../ui/icons';

export function Instagram() {
  return (
    <section id="instagram" data-header="light" aria-labelledby="instagram-title" className="bg-cloud py-10 text-ink sm:py-14">
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-7 rounded-[28px] border border-ink/15 bg-cloud-2 p-6 sm:p-9 lg:flex-row lg:items-center lg:gap-10">
          <div className="max-w-xl">
            <p className="label flex items-center gap-2 text-lagoon-ink"><InstagramIcon size={17} /> Find us on Instagram</p>
            <h2 id="instagram-title" className="display t-h3 mt-4">Stay connected.</h2>
            <p className="mt-3 text-base leading-7 text-slate">Follow SiliconMotives on Instagram.</p>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="group flex min-h-14 w-full items-center justify-between gap-6 rounded-2xl bg-monsoon px-5 py-4 font-display text-cloud transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lagoon-ink sm:w-auto sm:min-w-72">
            <span><span className="block text-lg font-semibold">{INSTAGRAM_HANDLE}</span><span className="mt-1 block text-sm text-mist">Follow on Instagram</span></span>
            <ArrowUpRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
