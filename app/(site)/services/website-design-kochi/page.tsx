import Image from 'next/image';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRight, PlusIcon } from '@/components/ui/icons';
import { getProjectCase } from '@/content/project-cases';
import { websiteDesign } from '@/content/website-design';
import { pageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site-url';

export const metadata = pageMetadata(websiteDesign.title, websiteDesign.description, websiteDesign.path);

const pageUrl = new URL(websiteDesign.path, SITE_URL).toString();
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: 'Website design and development in Kochi',
      serviceType: 'Website design and development',
      url: pageUrl,
      description: websiteDesign.description,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Kochi' },
        { '@type': 'State', name: 'Kerala' },
        { '@type': 'Country', name: 'India' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
        { '@type': 'ListItem', position: 3, name: 'Website design in Kochi', item: pageUrl },
      ],
    },
  ],
};

export default function WebsiteDesignPage() {
  const projects = websiteDesign.projectEvidence.flatMap(evidence => {
    const project = getProjectCase(evidence.slug);
    return project ? [{ project, evidence }] : [];
  });

  return (
    <MarketingPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      <div className="wrap">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-ink">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/services" className="inline-flex min-h-11 items-center hover:text-ink">Services</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Website design in Kochi</span>
        </nav>
      </div>

      <section className="wrap grid gap-8 pt-6 pb-12 sm:pt-10 sm:pb-16 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-8">
          <p className="label text-lagoon-ink">Kochi, Kerala · Remote-first</p>
          <h1 className="display mt-5 max-w-4xl text-[clamp(2.5rem,6.4vw,6rem)] !leading-[0.98]">
            Website design<br className="hidden sm:block" /> &amp; development<br className="hidden sm:block" /> in Kochi.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate sm:text-lg sm:leading-8">
            A website that explains your business and gives people a clear next step. SiliconMotives designs and builds business websites and commerce storefronts from Kochi, Kerala, with remote delivery across India.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={websiteDesign.enquiryHref} variant="lagoon">Discuss your website</ButtonLink>
            <a href="#website-work" className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold">
              <span className="link-line">Explore related work</span><ArrowUpRight />
            </a>
          </div>
        </div>
        <aside aria-label="What we focus on" className="rounded-2xl border border-ink/15 bg-cloud-2 p-6 sm:p-8 lg:col-span-4">
          <p className="label text-lagoon-ink">Built around your business</p>
          <p className="mt-4 font-serif text-3xl italic leading-tight">Clear to read.<br />Easy to explore.</p>
          <ul className="mt-6 divide-y divide-ink/15 text-base text-slate">
            {['Content with a clear purpose', 'Layouts for mobile and desktop', 'A useful path to enquiry or checkout'].map((item, index) => (
              <li key={item} className="flex gap-3 py-3"><span aria-hidden="true" className="label pt-1 text-lagoon-ink">0{index + 1}</span><span>{item}</span></li>
            ))}
          </ul>
        </aside>
      </section>

      <section id="website-work" data-header="dark" className="on-dark bg-monsoon py-10 text-cloud sm:py-14" aria-labelledby="website-work-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><p className="label text-lagoon">Related work</p><h2 id="website-work-title" className="display t-h2 mt-4">Different businesses.<br />Different requirements.</h2></div>
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-lagoon"><span className="link-line">All six projects</span><ArrowUpRight /></Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
            {projects.map(({ project, evidence }) => (
              <article key={project.slug} className="min-w-0 border-t border-cloud/20 pt-6">
                <p className="label text-lagoon">{project.category}</p>
                <h3 className="display mt-4 text-3xl !leading-tight">{project.name}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-cloud/80">{project.summary}</p>
                {project.story?.screenshots?.[0] && <figure className="mt-5">
                  <Link href={`/projects/${project.slug}`} className="block overflow-hidden rounded-xl border border-cloud/20 bg-cloud-2" aria-label={`View ${project.name} screenshots and project overview`}>
                    <Image src={project.story.screenshots[0].src} alt={project.story.screenshots[0].alt} width={project.story.screenshots[0].width} height={project.story.screenshots[0].height} sizes="(min-width: 1440px) 40rem, (min-width: 768px) 46vw, 92vw" loading="lazy" className="h-auto w-full" />
                  </Link>
                  <figcaption className="mt-3 text-sm leading-6 text-mist">{project.story.screenshots[0].caption}</figcaption>
                </figure>}
                <dl className="mt-5 space-y-4 text-base leading-7">
                  <div><dt className="font-display font-semibold text-cloud">The business need</dt><dd className="mt-1 ml-0 text-cloud/80">{evidence.need}</dd></div>
                  <div><dt className="font-display font-semibold text-cloud">The implementation</dt><dd className="mt-1 ml-0 text-cloud/80">{evidence.approach}</dd></div>
                </dl>
                <p className="mt-4 text-sm leading-6 text-mist">{evidence.evidence}</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                  <Link href={`/projects/${project.slug}`} className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-lagoon"><span className="link-line">Explore {project.name}</span><ArrowUpRight /></Link>
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-lagoon"><span className="link-line">Visit live website</span><ArrowUpRight /></a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-10 sm:py-14" aria-labelledby="website-scope-title">
        <p className="label text-lagoon-ink">What we can build</p>
        <h2 id="website-scope-title" className="display t-h2 mt-4 max-w-3xl">A website with a clear job to do.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
          {websiteDesign.offers.map((offer, index) => (
            <article key={offer.name} className="border-t border-ink/20 pt-5">
              <p className="label text-lagoon-ink">0{index + 1}</p>
              <h3 className="display mt-5 text-2xl !leading-tight">{offer.name}</h3>
              <p className="mt-3 text-base leading-7 text-slate">{offer.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap border-y border-ink/15 py-10 sm:py-14" aria-labelledby="website-deliverables-title">
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5"><p className="label text-lagoon-ink">Before you commit</p><h2 id="website-deliverables-title" className="display t-h2 mt-4">Know what’s<br />in the scope.</h2></div>
          <p className="max-w-2xl self-end text-base leading-7 text-slate lg:col-span-7">A useful proposal should make the deliverables, dependencies and ongoing costs clear. We work through these decisions before agreeing the build.</p>
        </div>
        <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {websiteDesign.scopeItems.map(item => <div key={item.name} className="border-t border-ink/15 pt-5"><dt className="font-display text-xl font-semibold">{item.name}</dt><dd className="mt-3 text-base leading-7 text-slate">{item.description}</dd></div>)}
        </dl>
      </section>

      <section className="wrap py-10 sm:py-14" aria-labelledby="website-process-title">
        <p className="label text-lagoon-ink">From conversation to launch</p>
        <h2 id="website-process-title" className="display t-h2 mt-4 max-w-3xl">A clear process.<br />Room for your feedback.</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {websiteDesign.lifecycle.map(([name, description], index) => (
            <li key={name} className="border-t border-ink/20 pt-4">
              <p aria-hidden="true" className="label text-lagoon-ink">0{index + 1}</p>
              <h3 className="mt-4 font-display text-lg font-semibold">{name}</h3>
              <p className="mt-2 text-base leading-7 text-slate">{description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-4 border-t border-ink/15 pt-6 md:grid-cols-2 md:gap-10">
          <p className="text-base leading-7 text-slate">Work directly with the founders: <Link href="/about#jasil-m" className="link-line font-semibold text-ink">Jasil M</Link> focuses on systems, cloud and architecture; <Link href="/about#jayasoorya-suryadas" className="link-line font-semibold text-ink">Jayasoorya Suryadas</Link> focuses on systems and software engineering. We agree review checkpoints, content responsibilities and support boundaries before work begins.</p>
          <p className="text-base leading-7 text-slate">Have an existing website? Share what is difficult to manage or what your customers struggle to find. If you are delivering for a client, explore our <Link href="/agency-partners" className="link-line font-semibold text-ink">agency partnership approach</Link>.</p>
        </div>
        <aside className="mt-6 border-t border-ink/15 pt-6" aria-labelledby="website-software-title">
          <h3 id="website-software-title" className="font-display text-xl font-semibold">Need more than a website?</h3>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate">If the project needs staff workflows, customer accounts or application business rules, explore our <Link href="/services/custom-software-development" className="link-line font-semibold text-ink">custom software engineering</Link>. For APIs, data models and integrations, see <Link href="/services/backend-development" className="link-line font-semibold text-ink">backend development</Link>.</p>
        </aside>
      </section>

      <section className="wrap grid gap-6 border-t border-ink/15 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12" aria-labelledby="website-faq-title">
        <div className="lg:col-span-4"><p className="label text-lagoon-ink">Before we start</p><h2 id="website-faq-title" className="display t-h2 mt-4">A few useful<br />answers.</h2></div>
        <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
          {websiteDesign.faqs.map(faq => (
            <details key={faq.question} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-base font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}<span aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none"><PlusIcon size={18} /></span>
              </summary>
              <p className="max-w-3xl pb-5 pr-6 text-base leading-7 text-slate">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section data-header="light" className="bg-lagoon py-10 sm:py-14" aria-labelledby="website-contact-title">
        <div className="wrap flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-12">
          <div className="max-w-2xl"><p className="label">Have a website in mind?</p><h2 id="website-contact-title" className="display t-h2 mt-4">Let’s give it<br />a clear purpose.</h2><p className="mt-4 text-base leading-7">Tell us about your business, the pages or features you need, and any existing website you want to improve.</p></div>
          <div className="flex flex-col items-start gap-4"><ButtonLink href={websiteDesign.enquiryHref}>Start a website project</ButtonLink><a href="mailto:hello@siliconmotives.com" className="inline-flex min-h-11 items-center font-display text-sm font-semibold"><span className="link-line">hello@siliconmotives.com</span></a></div>
        </div>
      </section>
    </MarketingPage>
  );
}
