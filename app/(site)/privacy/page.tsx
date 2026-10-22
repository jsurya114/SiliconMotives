import { MarketingPage, PageIntro, ContentSection } from '@/components/site/marketing-page';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('Privacy Policy | SiliconMotives', 'How SiliconMotives handles information submitted through this website.', '/privacy');

export default function PrivacyPage() {
  return (
    <MarketingPage>
      <PageIntro eyebrow="Privacy" title="Privacy Policy">
        <p>Last updated: October 22, 2026. This policy describes information handled through the SiliconMotives website.</p>
      </PageIntro>
      <ContentSection title="Information you send">
        <p>When you submit a project or agency enquiry, we collect your name, email address, enquiry type, and message so we can respond. The form also contains a hidden anti-spam field. Do not include sensitive personal, financial, or health information in an enquiry.</p>
      </ContentSection>
      <ContentSection title="How information is used">
        <p>We use enquiry details to respond and assess the requested work. The website sends submissions to our configured email provider and, when the site administrator has enabled inbox copies, stores them in the site’s Supabase database for follow-up.</p>
        <p>The contact endpoint uses the request IP address and email address in short-lived, hashed in-memory rate-limit counters to reduce spam. These counters are not a persistent analytics profile and may reset when the service restarts.</p>
      </ContentSection>
      <ContentSection title="Service providers and retention">
        <p>Email delivery is handled by the configured SMTP provider. Site content and optional enquiry inbox copies are hosted with Supabase. Pages load typefaces from Google Fonts, which receives the visitor’s browser request when font stylesheets and font files load. We retain enquiries as long as needed to respond, manage a potential or active business relationship, and meet applicable recordkeeping needs, then delete or anonymize them where practical.</p>
      </ContentSection>
      <ContentSection title="Cookies, analytics, and security">
        <p>The public website does not intentionally use advertising cookies or analytics tracking. The /admin area uses Supabase authentication for authorized administrators; authentication may use browser storage or cookies required for that session. We use reasonable technical safeguards, but no internet transmission or storage system can be guaranteed completely secure.</p>
      </ContentSection>
      <ContentSection title="Your choices and contact">
        <p>You may request access, correction, or deletion of an enquiry by emailing <a className="link-line" href="mailto:hello@siliconmotives.com">hello@siliconmotives.com</a>. We may retain information where required for legitimate business or legal purposes. SiliconMotives is operated by Millionian LLC, a Wyoming limited liability company; engineering operations are in Kerala, India.</p>
      </ContentSection>
    </MarketingPage>
  );
}
