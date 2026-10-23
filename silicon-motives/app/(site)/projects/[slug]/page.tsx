import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContentSection, MarketingPage, PageIntro } from '@/components/site/marketing-page';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRight } from '@/components/ui/icons';
import { getProjectCase, projectCases } from '@/content/project-cases';
import { pageMetadata } from '@/lib/metadata';
import { engineeringServices, servicePath } from '@/content/engineering-services';
import { websiteDesign } from '@/content/website-design';
import { SITE_URL } from '@/lib/site-url';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projectCases.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectCase((await params).slug);
  if (!project) return { title: 'Project not found | SiliconMotives' };
  return pageMetadata(`${project.name} — ${project.descriptor} | SiliconMotives`, project.summary, `/projects/${project.slug}`);
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = getProjectCase((await params).slug);
  if (!project) notFound();
  const story = project.story;
  const url = `${SITE_URL}/projects/${project.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
      { '@type': 'ListItem', position: 3, name: project.name, item: url },
    ],
  };

  return (
    <MarketingPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate">
          <Link href="/projects" className="inline-flex min-h-11 items-center"><span className="link-line">Projects</span></Link>
          <span aria-hidden="true">/</span><span aria-current="page">{project.name}</span>
        </nav>
      </div>
      <PageIntro eyebrow={`${story?.decisions?.length ? 'Engineering overview' : 'Project overview'} · ${project.category}`} title={story ? project.name : `${project.name} — ${project.descriptor}`}>
        {project.logo ? <div className="mb-5"><Image src={project.logo} alt={`${project.name} logo`} width={144} height={80} className="h-20 w-36 object-contain object-left" /></div> : null}
        {story && <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-lagoon-ink">{project.descriptor}</p>}
        <p>{project.summary}</p>
        {project.liveUrl && <div className="mt-5"><a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-display text-base font-semibold text-ink"><span className="link-line">Visit {project.name} live</span><ArrowUpRight size={16} /></a></div>}
        {story && <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-display text-sm font-semibold text-ink">
          {story.screenshots?.length ? <a href="#product-screens" className="inline-flex min-h-11 items-center gap-2"><span className="link-line">View product screenshots</span><ArrowUpRight size={16} /></a> : null}
          <a href="#project-workflow" className="inline-flex min-h-11 items-center gap-2"><span className="link-line">Explore the workflow</span><ArrowUpRight size={16} /></a>
          {story.decisions?.length ? <a href="#engineering-decisions" className="inline-flex min-h-11 items-center gap-2"><span className="link-line">Engineering decisions</span><ArrowUpRight size={16} /></a> : null}
        </div>}
      </PageIntro>

      {story?.screenshots?.length ? <section id="product-screens" className="wrap py-10 sm:py-14" aria-labelledby="product-screens-title">
        <p className="label text-lagoon-ink">Inside the product</p><h2 id="product-screens-title" className="display t-h2 mt-4">The working interface.</h2>
        <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
          {story.screenshots.map(screenshot => <figure key={screenshot.src} className="min-w-0"><a href={screenshot.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-ink/15 bg-cloud-2" aria-label={`Open full-size image: ${screenshot.alt}`}><Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} sizes="(min-width: 1440px) 40rem, (min-width: 768px) 46vw, 92vw" className="h-auto w-full object-contain" /></a><figcaption className="mt-3 text-sm leading-6 text-slate">{screenshot.caption}</figcaption></figure>)}
        </div>
      </section> : null}

      {story && <section className="wrap grid gap-8 border-t border-ink/15 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4"><p className="label text-lagoon-ink">The business need</p><h2 className="display t-h3 mt-4">What the application needs to do.</h2></div>
        <div className="space-y-5 text-base leading-8 text-slate lg:col-span-8 sm:text-lg"><p>{story.need}</p><p>{story.approach}</p></div>
      </section>}

      {story && <section id="project-workflow" data-header="dark" className="on-dark bg-monsoon py-10 text-cloud sm:py-14">
        <div className="wrap"><p className="label text-lagoon">Product workflow</p><h2 className="display t-h2 mt-4">How the work connects.</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {story.workflow.map(([name, description], index) => <li key={name} className="border-t border-cloud/20 pt-5"><p className="label text-lagoon">{String(index + 1).padStart(2, '0')}</p><h3 className="mt-4 font-display text-xl font-semibold">{name}</h3><p className="mt-3 text-base leading-7 text-mist">{description}</p></li>)}
          </ol>
        </div>
      </section>}



      {story?.decisions?.length ? <section id="engineering-decisions" className="wrap grid gap-8 border-t border-ink/15 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4"><p className="label text-lagoon-ink">Engineering decisions</p><h2 className="display t-h3 mt-4">Make the rules explicit.</h2></div>
        <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">{story.decisions.map((decision, index) => <article key={decision.title} className="grid gap-4 py-6 sm:grid-cols-[2rem_1fr]"><span className="label text-lagoon-ink">{String(index + 1).padStart(2, '0')}</span><div><h3 className="font-display text-xl font-semibold">{decision.title}</h3><p className="mt-3 text-base leading-7 text-slate">{decision.explanation}</p></div></article>)}</div>
      </section> : null}

      <ContentSection title="What the software covers">
        <ul className="grid gap-4 sm:grid-cols-2">
          {project.scope.map(detail => <li key={detail} className="border-t border-ink/15 pt-4 text-ink">{detail}</li>)}
        </ul>
      </ContentSection>
      {story?.stack?.length ? <ContentSection title="Application stack">
        <ul className="flex flex-wrap gap-3">{story.stack.map(technology => <li key={technology} className="rounded-full border border-ink/15 px-4 py-2 font-display text-sm font-semibold text-ink">{technology}</li>)}</ul>
      </ContentSection> : null}
      {project.technicalNotes.length > 0 && <ContentSection title="Infrastructure">
        <ul className="grid gap-4 sm:grid-cols-2">{project.technicalNotes.map(detail => <li key={detail} className="border-t border-ink/15 pt-4 text-ink">{detail}</li>)}</ul>
      </ContentSection>}
      {story?.deliveryPeriod || story?.contributors?.length ? <ContentSection title="Delivery and responsibilities">
        {story.deliveryPeriod && <p>{story.deliveryPeriod}</p>}
        {story.contributors?.length ? <dl className="grid gap-5 sm:grid-cols-2">{story.contributors.map(person => <div key={person.name}><dt className="font-display font-semibold text-ink">{person.name}</dt><dd className="mt-2">{person.responsibility}</dd></div>)}</dl> : null}
      </ContentSection> : null}
      {story?.result && <ContentSection title="Result">
        <p className="font-display text-xl font-semibold text-ink">{story.result.statement}</p><p>{story.result.context}</p>
        <p className="text-sm">{story.result.sourceUrl ? <a href={story.result.sourceUrl} target="_blank" rel="noreferrer" className="link-line">{story.result.sourceLabel}</a> : story.result.sourceLabel}</p>
      </ContentSection>}
      {story?.references?.length ? <ContentSection title="Explore the implementation">
        <p>The technical notes above describe the application code in the linked source snapshot.</p>
        <ul className="grid gap-1">{story.references.map(reference => <li key={reference.href}><a href={reference.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 font-display text-base font-semibold text-ink"><span className="link-line">{reference.label}</span><ArrowUpRight size={16} /></a></li>)}</ul>
      </ContentSection> : null}
      {['jjc-artworks', 'woobe'].includes(project.slug) && <ContentSection title="Planning a website?">
        <p>Explore our <Link href={websiteDesign.path} className="link-line font-semibold text-ink">website design and development service</Link> from Kochi, Kerala, with remote delivery across India.</p>
      </ContentSection>}
      <ContentSection title="Related engineering services">
        <div className="flex flex-wrap gap-x-6 gap-y-2">{engineeringServices.filter(service => service.projects.includes(project.slug)).map(service => <Link key={service.slug} href={servicePath(service.slug)} className="inline-flex min-h-11 items-center text-base font-semibold text-ink"><span className="link-line">{service.name}</span></Link>)}<Link href="/services" className="inline-flex min-h-11 items-center text-base font-semibold text-ink"><span className="link-line">All engineering services</span></Link></div>
      </ContentSection>
      <section className="wrap border-t border-ink/15 py-10 sm:py-14">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div><p className="label text-lagoon-ink">Have a similar challenge?</p><h2 className="display t-h3 mt-3">Let’s talk through it.</h2></div>
          <ButtonLink href="/contact?type=project" variant="lagoon">Start a project</ButtonLink>
        </div>
        <Link href="/projects" className="mt-6 inline-flex min-h-11 items-center font-display text-sm font-semibold"><span className="link-line">View all six projects</span></Link>
      </section>
    </MarketingPage>
  );
}
