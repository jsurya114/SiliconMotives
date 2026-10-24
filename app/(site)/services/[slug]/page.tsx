import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRight, PlusIcon } from '@/components/ui/icons';
import { engineeringServices, getEngineeringService, servicePath } from '@/content/engineering-services';
import { getProjectCase } from '@/content/project-cases';
import { SITE_URL } from '@/lib/site-url';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return engineeringServices.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getEngineeringService((await params).slug);
  return service ? pageMetadata(service.title, service.description, servicePath(service.slug)) : { title: 'Service not found | SiliconMotives' };
}

export default async function EngineeringServicePage({ params }: Props) {
  const service = getEngineeringService((await params).slug);
  if (!service) notFound();
  const url = `${SITE_URL}${servicePath(service.slug)}`;
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Service', '@id': `${url}#service`, name: service.name, description: service.description, url, provider: { '@id': `${SITE_URL}/#organization` }, areaServed: service.regions?.map(region => ({ '@type': region.type, name: region.name })), availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${SITE_URL}/contact?type=project` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
        { '@type': 'ListItem', position: 3, name: service.name, item: url },
      ] },
    ],
  };
  const projects = service.projects.map(getProjectCase).filter(project => project !== undefined);
  return <MarketingPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <div className="wrap"><nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate"><Link className="inline-flex min-h-11 items-center" href="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">{service.name}</span></nav></div>
    <section className="wrap grid gap-8 pt-6 pb-10 sm:py-12 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8"><p className="label text-lagoon-ink">{service.name}</p><h1 className="display mt-5 max-w-4xl text-[clamp(2.5rem,6vw,5.75rem)] !leading-[1.02]">{service.headline}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate">{service.intro}</p><div className="mt-6 flex flex-wrap gap-4"><ButtonLink href="/contact?type=project" variant="lagoon">Discuss your project</ButtonLink><Link className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold" href="/agency-partners">For agencies <ArrowUpRight /></Link></div></div>
      <aside className="border-l-2 border-lagoon pl-6 lg:col-span-4"><p className="label text-lagoon-ink">A focused starting point</p><p className="mt-4 text-base leading-7 text-slate">{service.audience}</p><p className="mt-4 text-sm leading-6 text-slate">Kerala, India · Remote delivery<br />Scope and meeting overlap agreed before kickoff.</p></aside>
    </section>
    <section className="wrap border-t border-ink/15 py-10 sm:py-14"><p className="label text-lagoon-ink">Scope</p><h2 className="display t-h2 mt-4">Where we can help.</h2><div className="mt-8 grid gap-6 md:grid-cols-3">{service.scope.map(([name, description], i) => <article key={name} className="border-t border-ink/20 pt-5"><p className="label text-lagoon-ink">0{i + 1}</p><h3 className="display mt-4 text-2xl !leading-tight">{name}</h3><p className="mt-3 text-base leading-7 text-slate">{description}</p></article>)}</div></section>
    {service.deliveryContext && <section className="wrap grid gap-6 border-t border-ink/15 py-10 sm:py-14 lg:grid-cols-2"><div><p className="label text-lagoon-ink">Working together</p><h2 className="display t-h3 mt-4">{service.deliveryContext.heading}</h2></div><div className="space-y-4 text-base leading-7 text-slate">{service.deliveryContext.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>}
    <section data-header="dark" className="on-dark bg-monsoon py-10 text-cloud sm:py-14"><div className="wrap"><p className="label text-lagoon">Related project work</p><h2 className="display t-h2 mt-4">Start with the product.</h2><p className="mt-5 max-w-3xl text-base leading-7 text-mist">{service.evidenceNote}</p><div className="mt-8 grid gap-6 md:grid-cols-3">{projects.map(project => <article key={project.slug} className="border-t border-cloud/20 pt-5"><p className="label text-lagoon">{project.category}</p><h3 className="display mt-4 text-3xl">{project.name}</h3><p className="mt-3 text-base leading-7 text-mist">{project.summary}</p><Link href={`/projects/${project.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-lagoon">Read project overview <ArrowUpRight /></Link></article>)}</div></div></section>
    <section className="wrap grid gap-8 py-10 sm:py-14 lg:grid-cols-2"><div><p className="label text-lagoon-ink">Delivery and ownership</p><h2 className="display t-h2 mt-4">Clear work.<br />Clear handover.</h2><p className="mt-5 max-w-xl text-base leading-7 text-slate">Discover → Architect → Build → Deploy → Operate. We agree the milestones, review checkpoints and responsibilities that apply to your engagement.</p><p className="mt-4 max-w-xl text-base leading-7 text-slate"><Link href="/about" className="link-line text-ink">Jasil M</Link> is the contact for systems, cloud and architecture. Jayasoorya Suryadas focuses on systems and software engineering.</p></div><div><h3 className="font-display text-xl font-semibold">What we agree before delivery</h3><ul className="mt-5 divide-y divide-ink/15 border-y border-ink/15">{service.deliverables.map(item => <li key={item} className="py-4 text-base leading-7 text-slate">{item}</li>)}</ul><p className="mt-4 text-sm leading-6 text-slate">Timeline, fees, support hours and acceptance criteria are set in the proposal. Ongoing support is scoped explicitly.</p></div></section>
    <section className="wrap grid gap-6 border-t border-ink/15 py-10 sm:py-14 lg:grid-cols-[1fr_2fr]"><div><p className="label text-lagoon-ink">Before we start</p><h2 className="display t-h3 mt-4">Useful answers.</h2></div><div className="divide-y divide-ink/15 border-y border-ink/15">{service.faqs.map(([question, answer]) => <details key={question} className="group"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display font-semibold [&::-webkit-details-marker]:hidden">{question}<span aria-hidden="true" className="shrink-0 group-open:rotate-45"><PlusIcon size={18} /></span></summary><p className="pb-5 pr-6 text-base leading-7 text-slate">{answer}</p></details>)}</div></section>
    <section className="wrap border-t border-ink/15 py-10 sm:py-14"><h2 className="display t-h3">Explore the engineering services.</h2><div className="mt-5 flex flex-wrap gap-x-6 gap-y-1">{engineeringServices.filter(item => item.slug !== service.slug).map(item => <Link key={item.slug} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold" href={servicePath(item.slug)}><span className="link-line">{item.name}</span><ArrowUpRight /></Link>)}</div></section>
    <section data-header="light" className="bg-lagoon py-10 sm:py-14"><div className="wrap flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center"><div><p className="label">Start with the challenge</p><h2 className="display t-h2 mt-4">What needs to work better?</h2><p className="mt-4 max-w-2xl text-base leading-7">Share the workflow, application or delivery problem you want to solve.</p></div><ButtonLink href="/contact?type=project">Discuss your project</ButtonLink></div></section>
  </MarketingPage>;
}
