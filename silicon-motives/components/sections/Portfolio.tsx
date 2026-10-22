import Link from 'next/link';
import { site } from '@/content/site';
import { projectCases } from '@/content/project-cases';
import { SectionLabel } from '../ui/SectionLabel';

export function Portfolio() {
  const { portfolio } = site;
  return (
    <section id="portfolio" data-header="dark" aria-labelledby="portfolio-title" className="on-dark bg-monsoon py-14 text-cloud sm:py-16 lg:py-20">
      <div className="wrap">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <SectionLabel index={portfolio.index} tone="dark">{portfolio.eyebrow}</SectionLabel>
            <h2 id="portfolio-title" className="display t-h2 mt-6">{portfolio.title}</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-mist lg:col-span-4 lg:justify-self-end">{portfolio.lead}</p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:mt-12">
          {projectCases.map((project, index) => (
            <article key={project.slug} className="flex h-full flex-col border-t border-cloud/20 py-5 sm:py-6">
              <div className="flex items-center justify-between gap-4">
                <p className="label text-lagoon">{project.category}</p>
                <span className="label text-mist">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{project.name}</h3>
              <p className="mt-1 font-serif text-lg italic text-mist">{project.descriptor}</p>
              <p className="mt-4 max-w-xl text-base leading-7 text-cloud/80">{project.summary}</p>
              <ul className="mt-5 grid gap-2 text-sm leading-6 text-cloud/70">
                {project.scope.slice(0, 2).map((detail) => <li key={detail} className="flex gap-3"><span className="text-lagoon" aria-hidden="true">—</span><span>{detail}</span></li>)}
              </ul>
              <Link href={`/projects/${project.slug}`} className="link-line mt-6 inline-flex w-fit items-center gap-2 font-display text-sm font-semibold text-lagoon">
                Project overview <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 border-t border-cloud/15 pt-6">
          <Link href="/projects" className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-cloud/30 px-5 text-cloud transition-colors hover:bg-cloud hover:text-monsoon">
            View all projects <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
