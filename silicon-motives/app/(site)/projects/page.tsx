import Image from 'next/image';
import type { Metadata } from 'next';
import { loadContent } from '@/lib/content';
import { MarketingPage, PageIntro, ContentSection } from '@/components/site/marketing-page';
import { safeImage } from '@/lib/urls';

export const metadata: Metadata = {
  title: 'Projects | SiliconMotives',
  description: 'Selected production software and engineering projects.',
};

export default async function ProjectsPage() {
  const { projects } = await loadContent();
  return <MarketingPage>
    <PageIntro eyebrow="Selected projects" title="Software built around the work people do.">
      <p>These projects reflect the range of business software we have built with Indian clients. Cover images are illustrative where noted; we do not present them as product screenshots. Stack and delivery details appear where documented in the project records.</p>
    </PageIntro>

    <section className="wrap grid gap-6 pb-16 md:grid-cols-2" aria-label="Project showcase">
      {projects.map((project) => {
        const image = safeImage(project.image_url);
        return <article key={project.id} className="overflow-hidden rounded-2xl bg-monsoon text-cloud">
          <div className="relative aspect-[16/9] bg-harbour">
            {image && <Image src={image} alt={project.image_alt || ''} fill className="object-cover" sizes="(min-width: 768px) 45vw, 100vw" />}
          </div>
          <div className="p-6 sm:p-8">
            <p className="label text-lagoon">{project.category}</p>
            <h2 className="display mt-3 text-3xl font-bold">{project.title}</h2>
            <p className="mt-4 leading-7 text-mist">{project.description}</p>
            {Array.isArray(project.tags) && project.tags.length > 0 && <div className="mt-5">
              <p className="label text-mist">Recorded stack &amp; delivery details</p>
              <p className="mt-2 text-sm text-lagoon">{project.tags.join(' · ')}</p>
            </div>}
          </div>
        </article>;
      })}
    </section>

    <ContentSection title="Flagship case study: Woobe">
      <p>Woobe is a production commerce platform co-developed with Jasil M for a real client. The storefront supports shopping by weight, ₹/kg pricing, and checkout with Razorpay and cash-on-delivery options. The project record identifies AWS infrastructure.</p>
      <p><strong className="text-ink">Problem:</strong> Standard product quantity flows did not fit a fashion business selling by weight.</p>
      <p><strong className="text-ink">What we built:</strong> A mobile-first storefront with weight-aware product selection and payment options.</p>
      <p><strong className="text-ink">Responsibilities:</strong> Full-stack commerce development and AWS infrastructure, as documented in the project record.</p>
      <p><strong className="text-ink">Stack:</strong> The public project record lists weight-based pricing, Razorpay and cash on delivery, and AWS infrastructure. It does not specify the application framework or database.</p>
      <p><strong className="text-ink">Screenshots:</strong> The available Woobe asset is an editorial cover, not a product screenshot. Product screenshots can be added when approved assets are available.</p>
    </ContentSection>

    <ContentSection title="Illustrative deployment path">
      <p>This simplified reference diagram shows one common deployment shape. It does not describe a client&apos;s specific environment.</p>
      <div className="overflow-x-auto pb-3">
        <ol className="flex min-w-[760px] items-center gap-2 text-center text-sm font-semibold">
          {['Users', 'ALB', 'Auto Scaling Group', 'EC2 instances', 'Application / backend', 'Database'].map((step, index, steps) => <li key={step} className="flex flex-1 items-center gap-2">
            <div className="flex min-h-20 flex-1 items-center justify-center rounded-xl bg-cloud-2 p-3 text-ink">{step}</div>
            {index < steps.length - 1 && <span aria-hidden="true">→</span>}
          </li>)}
        </ol>
      </div>
    </ContentSection>
  </MarketingPage>;
}
