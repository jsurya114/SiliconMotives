import Image from 'next/image';
import { site } from '@/content/site';
import { ContentSection, MarketingPage, PageIntro } from '@/components/site/marketing-page';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('About | SiliconMotives', 'Meet the founders and learn about SiliconMotives, an engineering company based in Kerala, India.', '/about');

const architecture = ['Users', 'ALB', 'Auto Scaling Group', 'EC2 instances', 'Application / backend', 'Database'];

export default function AboutPage() {
  return (
    <MarketingPage>
      <PageIntro eyebrow="About SiliconMotives" title="A small engineering company, built around real work.">
        <p>SiliconMotives is an engineering company focused on Custom Software, Cloud Infrastructure, and DevOps. From Kerala, India, we work with Indian businesses and are building relationships with international teams.</p>
      </PageIntro>

      <ContentSection title="What we do">
        <p>We work on business software, cloud foundations, and the delivery and operation of software systems.</p>
        <ul className="grid gap-4 text-ink sm:grid-cols-3">
          {['Custom Software Engineering', 'Cloud Infrastructure Engineering', 'DevOps & Reliability'].map((capability) => <li key={capability} className="border-t border-ink/15 pt-4 font-display font-semibold">{capability}</li>)}
        </ul>
      </ContentSection>

      <ContentSection title="The founders">
        <div className="grid gap-8 sm:grid-cols-2">
          {site.people.founders.map((founder) => (
            <article key={founder.name} className="grid gap-5 sm:grid-cols-[8rem_1fr] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-full bg-cloud-2 sm:size-32">
                <Image src={founder.image} alt={`${founder.name}, ${founder.role}`} fill className="object-cover" sizes="(min-width: 640px) 8rem, 50vw" />
              </div>
              <div>
                <h3 className="display text-2xl font-bold">{founder.name}</h3>
                <p className="mt-2 text-base text-slate">{founder.role}</p>
                <a className="link-line mt-4 inline-block" href={founder.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="How we work remotely">
        <p>We work remotely from Kerala and agree communication and review points with each partner.</p>
      </ContentSection>

      <ContentSection title="Illustrative architecture reference">
        <p>This common web deployment path is an explanatory example. It does not represent a client environment.</p>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {architecture.map((step, index) => <li key={step} className="flex min-h-16 items-center gap-3 border border-ink/15 p-4">
            <span className="label text-lagoon-ink">{String(index + 1).padStart(2, '0')}</span><span className="font-display text-sm font-semibold">{step}</span>
          </li>)}
        </ol>
      </ContentSection>

      <ContentSection title="Company information">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[12rem_1fr]">
          <dt className="font-display font-semibold">Operating brand</dt><dd>SiliconMotives</dd>
          <dt className="font-display font-semibold">Legal entity</dt><dd>Millionian LLC</dd>
          <dt className="font-display font-semibold">Jurisdiction</dt><dd>Wyoming, USA</dd>
          <dt className="font-display font-semibold">Engineering operations</dt><dd>Kerala, India</dd>
          <dt className="font-display font-semibold">Delivery</dt><dd>Remote-first</dd>
        </dl>
        <p>Millionian LLC is a legal entity in Wyoming. SiliconMotives’ engineering operations are in Kerala, India; Wyoming is not presented as a U.S. office.</p>
      </ContentSection>
    </MarketingPage>
  );
}
