import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContentSection, MarketingPage, PageIntro } from '@/components/site/marketing-page';
import { getProjectCase, projectCases } from '@/content/project-cases';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projectCases.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCase(slug);
  if (!project) return { title: 'Project not found | SiliconMotives' };
  return pageMetadata(`${project.name} | Projects | SiliconMotives`, project.summary, `/projects/${project.slug}`);
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectCase(slug);
  if (!project) notFound();

  return (
    <MarketingPage>
      <PageIntro eyebrow={`Project overview · ${project.category}`} title={`${project.name} — ${project.descriptor}`}>
        <p>{project.summary}</p>
      </PageIntro>
      <ContentSection title="What the software covers">
        <ul className="grid gap-4 sm:grid-cols-2">
          {project.scope.map((detail) => <li key={detail} className="border-t border-ink/15 pt-4 text-ink">{detail}</li>)}
        </ul>
      </ContentSection>
      {project.technicalNotes.length > 0 && <ContentSection title="Infrastructure">
        <ul className="grid gap-4 sm:grid-cols-2">
          {project.technicalNotes.map((detail) => <li key={detail} className="border-t border-ink/15 pt-4 text-ink">{detail}</li>)}
        </ul>
      </ContentSection>}
      <section className="wrap border-t border-ink/15 py-12 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div><p className="label text-lagoon-ink">Have a similar challenge?</p><h2 className="display t-h3 mt-3">Let’s talk through it.</h2></div>
          <Link href="/contact?type=project" className="btn btn--lagoon">Start a project <span className="btn__icon" aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </MarketingPage>
  );
}
