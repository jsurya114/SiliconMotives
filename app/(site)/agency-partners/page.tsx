import { MarketingPage } from '@/components/site/marketing-page';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('Agency Partners | SiliconMotives', 'Engineering delivery support for U.S. agencies.', '/agency-partners');

const capabilities = [
  ['01', 'Custom software', 'Web applications and business tools shaped around your client’s requirements.'],
  ['02', 'Cloud infrastructure', 'Practical architecture and implementation for clear, maintainable deployments.'],
  ['03', 'DevOps & reliability', 'Delivery pipelines, deployment workflows, and operational improvements.'],
];

export default function AgencyPartnersPage() {
  return (
    <MarketingPage>
      <section className="wrap section-y !pt-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="label text-lagoon-ink">For U.S. agencies</p>
            <h1 className="display t-h1 mt-5 max-w-4xl">Your client.<br className="hidden sm:block" /> Our engineering.</h1>
          </div>
          <div className="max-w-2xl text-[1.125rem] leading-[1.7] text-slate lg:col-span-5 lg:justify-self-end">
            <p>Keep the client relationship. Bring in a focused engineering partner to plan, build, deploy, and operate the software behind your work. Jasil M, Founder, is the technical contact for systems, cloud, and architecture.</p>
            <a href="/contact?type=agency" className="btn btn--lagoon mt-6">
              <span className="btn__label"><span>Discuss a partnership</span><span aria-hidden="true">Discuss a partnership</span></span>
              <span className="btn__icon" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {[
            ['01', 'Plan together'],
            ['02', 'Build with your team'],
            ['03', 'Deliver with care'],
          ].map(([number, label]) => (
            <div key={number} className="flex items-center gap-4 bg-cloud px-5 py-4 sm:px-6">
              <span className="label text-lagoon-ink">{number}</span>
              <span className="font-display text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap grid gap-8 border-t border-ink/15 py-12 sm:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="label text-lagoon-ink">Working together</p>
          <h2 className="display t-h3 mt-3">Clear from kickoff to handover.</h2>
        </div>
        <div className="grid gap-0 lg:col-span-8">
          {[
            ['Time-zone overlap', 'Our engineering operations work on India Standard Time (UTC+05:30). Meeting overlap with U.S. teams depends on their time zone and daylight-saving season; we agree a shared window and use written updates between calls.'],
            ['Updates and demos', 'A weekly written progress update and a demo at each agreed milestone are our working default. We set the exact rhythm together before delivery begins.'],
            ['Starting scope and changes', 'Start with one clearly scoped delivery milestone. We document scope changes and agree their impact before adding them to the work.'],
            ['Confidentiality and handover', 'Confidentiality terms, repository access and ownership, and handover arrangements are agreed in writing before work begins.'],
          ].map(([title, description], index) => (
            <article key={title} className="grid gap-2 border-t border-ink/15 py-5 sm:grid-cols-[3rem_1fr] sm:gap-4">
              <span className="label pt-1 text-lagoon-ink">{String(index + 1).padStart(2, '0')}</span>
              <div className="grid gap-2 md:grid-cols-[minmax(10rem,0.8fr)_1.2fr] md:gap-8">
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="text-base leading-7 text-slate">{description}</p>
              </div>
            </article>
          ))}
          <div className="border-t border-ink/15" />
        </div>
      </section>

      <section className="wrap grid gap-8 border-t border-ink/15 py-12 sm:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="label text-lagoon-ink">Engineering support</p>
          <h2 className="display t-h3 mt-3">Where we can help</h2>
        </div>
        <div className="lg:col-span-8">
          {capabilities.map(([number, title, description]) => (
            <article key={number} className="grid gap-2 border-t border-ink/15 py-5 sm:grid-cols-[3rem_1fr] sm:gap-4">
              <span className="label pt-1 text-lagoon-ink">{number}</span>
              <div className="grid gap-2 md:grid-cols-[minmax(10rem,0.8fr)_1.2fr] md:gap-8">
                <h3 className="font-display text-xl font-semibold tracking-[-0.03em]">{title}</h3>
                <p className="text-base leading-7 text-slate">{description}</p>
              </div>
            </article>
          ))}
          <div className="border-t border-ink/15" />
        </div>
      </section>

      <section className="wrap grid gap-8 border-t border-ink/15 py-12 sm:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="label text-lagoon-ink">A clear working relationship</p>
          <h2 className="display t-h3 mt-3">Fits your delivery model</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <article className="border border-ink/15 p-6 sm:p-7">
            <h3 className="font-display text-lg font-semibold">Behind the scenes</h3>
            <p className="mt-3 text-base leading-7 text-slate">We work with your team under agreed ownership, communication, and client visibility.</p>
          </article>
          <article className="border border-ink/15 p-6 sm:p-7">
            <h3 className="font-display text-lg font-semibold">In the room</h3>
            <p className="mt-3 text-base leading-7 text-slate">We can join technical conversations with your client when the role and scope are clear.</p>
          </article>
          <p className="text-base leading-7 text-slate sm:col-span-2">We align on scope, responsibilities, and communication before work begins. Each engagement is documented with the agency in the relevant proposal and contract.</p>
        </div>
      </section>
    </MarketingPage>
  );
}
