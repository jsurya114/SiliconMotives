import Image from 'next/image';
import Link from 'next/link';
import { MarketingPage, PageIntro } from '@/components/site/marketing-page';
import { projectCases } from '@/content/project-cases';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('Projects | SiliconMotives', 'Selected software projects across commerce, logistics, business operations, healthcare, and business websites.', '/projects');

export default function ProjectsPage() {
  return (
    <MarketingPage>
      <PageIntro eyebrow="Selected projects" title="Software for business operations.">
        <p>Selected software projects across commerce, logistics, business operations, healthcare, and business websites.</p>
      </PageIntro>
      <section className="wrap grid gap-8 pb-16 md:grid-cols-2 md:gap-10" aria-label="Project showcase">
        {projectCases.map((project, index) => (
          <article key={project.slug} className="flex h-full flex-col border-t border-ink/20 py-6">
            <p className="label text-lagoon-ink">{project.category} <span className="ml-2 text-slate/70">/{String(index + 1).padStart(2, '0')}</span></p>
            <div className="mt-5 flex min-h-20 items-center">
              {project.logo ? <Image src={project.logo} alt={`${project.name} logo`} width={144} height={80} className="h-20 w-36 object-contain object-left" /> : <h2 className="display text-3xl font-bold tracking-[-0.04em]">{project.name}</h2>}
            </div>
            {project.logo ? <h2 className="sr-only">{project.name}</h2> : null}
            <p className="mt-1 font-serif text-xl italic text-slate">{project.descriptor}</p>
            <p className="mt-5 max-w-xl leading-7 text-slate">{project.summary}</p>
            <ul className="mt-5 grid gap-2 text-base leading-7 text-slate">
              {project.scope.map((detail) => <li key={detail} className="flex gap-3"><span aria-hidden="true" className="text-lagoon-ink">—</span><span>{detail}</span></li>)}
            </ul>
            <Link href={`/projects/${project.slug}`} className="link-line mt-6 inline-flex w-fit items-center gap-2 font-display font-semibold">
              {project.story?.decisions?.length ? 'Read engineering overview' : 'Read project overview'} <span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </section>
    </MarketingPage>
  );
}
