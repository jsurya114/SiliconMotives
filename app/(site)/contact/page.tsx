import { loadContent } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { MarketingPage, PageIntro } from '@/components/site/marketing-page';
import { Contact } from '@/components/sections/Contact';

export const metadata = pageMetadata('Contact SiliconMotives', 'Send a project enquiry or discuss an agency partnership.', '/contact');

type Props = { searchParams: Promise<{ type?: string | string[] }> };

export default async function ContactPage({ searchParams }: Props) {
  const [{ type }, content] = await Promise.all([searchParams, loadContent()]);
  const enquiryType = type === 'agency' ? 'agency' : 'project';
  const agency = enquiryType === 'agency';

  return (
    <MarketingPage>
      <PageIntro eyebrow={agency ? 'Agency partnership' : 'Contact'} title={agency ? 'Your client. Our engineering.' : 'Start with a clear conversation.'}>
        <p>{agency ? 'Tell us about your agency, client context, and the delivery support you need. We’ll use this to start a focused discussion.' : 'For a software project, tell us what you are trying to solve. Engineering operations are in Kerala, India; we work remote-first.'}</p>
        <p className="mt-4"><a className="link-line" href="mailto:hello@siliconmotives.com">hello@siliconmotives.com</a></p>
        <p className="mt-2">Kerala, India · Remote-first</p>
        <p className="mt-2"><a className="link-line" href="https://www.linkedin.com/in/jasilmeledath/" target="_blank" rel="noreferrer">Jasil M on LinkedIn ↗</a> · <a className="link-line" href="https://www.linkedin.com/in/jayasoorya-suryadas/" target="_blank" rel="noreferrer">Jayasoorya Suryadas on LinkedIn ↗</a></p>
      </PageIntro>
      <Contact settings={content.settings} enquiryType={enquiryType} />
    </MarketingPage>
  );
}
