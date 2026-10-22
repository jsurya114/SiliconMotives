import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRight } from '@/components/ui/icons';
import { engineeringServices, servicePath } from '@/content/engineering-services';
import { getProjectCase } from '@/content/project-cases';
import { SITE_URL } from '@/lib/site-url';
import { MarketingPage } from '@/components/site/marketing-page';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('White-Label Software Development Partner for Agencies | SiliconMotives', 'White-label software, backend, AWS and DevOps engineering for U.S. agencies. Keep your client relationship; start with a scoped delivery milestone.', '/agency-partners');

const capabilities = [
  ['01', 'Custom software', 'Web applications and business tools shaped around your client’s requirements.'],
  ['02', 'Backend & integrations', 'API contracts, data workflows, application logic and integrations behind the interface.'],
  ['03', 'Cloud infrastructure', 'AWS architecture and environment implementation, with clear access and handover.'],
  ['04', 'DevOps & reliability', 'Delivery pipelines, deployment workflows, and operational improvements.'],
];

export default function AgencyPartnersPage() {
  return (
    <MarketingPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Service',
        '@id': `${SITE_URL}/agency-partners#service`, name: 'White-label engineering for agencies',
        url: `${SITE_URL}/agency-partners`, serviceType: 'White-label software development',
        provider: { '@id': `${SITE_URL}/#organization` },
      }).replace(/</g, '\\u003c') }} />
      <section className="wrap section-y !pt-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="label text-lagoon-ink">For U.S. agencies</p>
            <h1 className="display mt-5 max-w-full text-[clamp(2.5rem,6vw,6rem)] !leading-[1.02] [overflow-wrap:break-word]">Your client.<br /> Your brand.<br /> Our engineering.</h1>
          </div>
          <div className="max-w-2xl text-[1.125rem] leading-[1.7] text-slate lg:col-span-5 lg:justify-self-end">
            <p>When your client project goes beyond design, CMS or storefront development, SiliconMotives handles the engineering behind it. Keep the client relationship and your brand, with white-label software, backend, AWS and DevOps support delivered from Kerala, India. Jasil M, Founder, is the technical contact for systems, cloud, and architecture.</p>
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

      <section data-header="dark" className="on-dark bg-monsoon py-10 text-cloud sm:py-14">
        <div className="wrap"><p className="label text-lagoon">Relevant project work</p><h2 className="display t-h2 mt-4">Engineering behind the workflow.</h2><div className="mt-8 grid gap-6 md:grid-cols-3">
          {['woobe', 'picbox', 'uniwayin'].map(getProjectCase).filter(project => project !== undefined).map(project => <article key={project.slug} className="border-t border-cloud/20 pt-5"><p className="label text-lagoon">{project.category}</p><h3 className="display mt-4 text-3xl">{project.name}</h3><p className="mt-3 text-base leading-7 text-mist">{project.summary}</p><Link href={`/projects/${project.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-lagoon">Read project overview <ArrowUpRight /></Link></article>)}
        </div><p className="mt-6 max-w-3xl text-sm leading-6 text-mist">Explore the product workflows and documented scope in each overview. We can discuss relevant implementation details and permitted references during scoping.</p></div>
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
            ['Start with a pilot', 'Begin with one clearly scoped delivery milestone and agreed acceptance criteria. A project engagement or ongoing retainer can follow if the fit and capacity are right. Scope changes are documented and their impact agreed before work is added.'],
            ['Your relationship, protected', 'You own the client relationship. We agree NDA, white-label visibility and no-poach terms in writing before work begins. Repository access, source ownership, dependencies and handover are documented in the engagement.'],
            ['Direct engineering contact', 'Work directly with Jasil M for systems, cloud and architecture, and Jayasoorya Suryadas for systems and software engineering. Support hours, escalation routes and post-launch responsibilities are agreed in scope.'],
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
            <p className="mt-3 text-base leading-7 text-slate">White-label delivery behind your brand. Your team manages the client; we coordinate directly with your engineers and delivery lead under the agreed communication plan.</p>
          </article>
          <article className="border border-ink/15 p-6 sm:p-7">
            <h3 className="font-display text-lg font-semibold">In the room</h3>
            <p className="mt-3 text-base leading-7 text-slate">We can join technical conversations with your client when the role and scope are clear.</p>
          </article>
          <p className="text-base leading-7 text-slate sm:col-span-2">We align on scope, responsibilities, and communication before work begins. Each engagement is documented with the agency in the relevant proposal and contract.</p>
        </div>
      </section>
      <section className="wrap border-t border-ink/15 py-10 sm:py-14"><p className="label text-lagoon-ink">Explore the scope</p><h2 className="display t-h3 mt-4">Engineering services for your next delivery.</h2><div className="mt-5 flex flex-wrap gap-x-6 gap-y-1">{engineeringServices.map(service => <Link key={service.slug} href={servicePath(service.slug)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"><span className="link-line">{service.name}</span><ArrowUpRight /></Link>)}</div></section>
      <section data-header="light" className="bg-lagoon py-10 sm:py-14"><div className="wrap flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center"><div><p className="label">Start with one milestone</p><h2 className="display t-h2 mt-4">Bring us the engineering brief.</h2><p className="mt-4 max-w-2xl text-base leading-7">Tell us about your agency, the client context, the delivery gap and your timeline. We’ll discuss scope, working rhythm and the first useful milestone.</p></div><ButtonLink href="/contact?type=agency">Discuss agency delivery</ButtonLink></div></section>
    </MarketingPage>
  );
}
