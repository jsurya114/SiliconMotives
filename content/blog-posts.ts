export type BlogSection = { heading: string; paragraphs?: string[]; list?: string[]; listAfter?: string[] };

export type BlogPost = {
  slug: string;
  title: string; // <title>, includes brand suffix
  headline: string; // visible H1
  description: string;
  date: string; // ISO date of first publication
  updated?: string; // ISO date of last substantive edit
  category: string;
  readingMinutes: number;
  intro: string;
  sections: BlogSection[];
  related: { label: string; href: string }[];
  cta: { label: string; href: string; text: string };
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'website-design-cost-kerala',
    title: 'Website Design Cost in Kerala: What Sets the Price | SiliconMotives',
    headline: 'Website design cost in Kerala: what actually sets the price',
    description: 'A practical guide to what drives the cost of a business website in Kerala: pages, design, content, features, ecommerce, integrations and hosting.',
    date: '2026-11-14',
    category: 'Website design',
    readingMinutes: 6,
    intro: 'If you ask three agencies in Kochi for a website quote, you can get three very different numbers. The gap is rarely about quality alone. It comes from what each quote includes. This guide explains what moves the price of a business website, so you can compare quotes fairly and decide what you actually need.',
    sections: [
      {
        heading: 'Price follows scope, not page count',
        paragraphs: [
          'A five-page brochure site and a five-page site with online booking, payments and a staff dashboard are very different projects. The number of pages matters less than the number of distinct page types (templates), and how much each one has to do.',
          'Before you ask for a price, write down what a visitor should be able to do on the site: call you, send an enquiry, book, pay, track an order. Every one of those actions adds design, build and testing work.',
        ],
      },
      {
        heading: 'Seven things that move the price',
        list: [
          'Pages and templates: a home page, service pages, a blog and a contact page each need their own layout. Many similar pages (for example, 30 product pages) cost less to build than 30 different layouts.',
          'Design approach: adapting a ready-made template is faster than designing a layout around your brand, customers and content from scratch.',
          'Content: who writes the copy, and who supplies photographs? Original writing and photography are real work. Websites held up by missing content are one of the most common causes of delay.',
          'Functionality: contact forms are simple. Booking, accounts, payments, quotes, multi-language support and customer areas each add logic that must be built and tested.',
          'Ecommerce: catalogue size, variants, payment gateways such as Razorpay, delivery rules, GST invoices and order management all affect scope.',
          'Integrations: connecting the site to a CRM, WhatsApp, email tools, inventory or accounting software means working with other systems and handling their edge cases.',
          'Search and performance setup: clean page structure, titles, descriptions, fast loading on mobile and correct indexing take planning. They are cheaper to build in than to fix later.',
        ],
      },
      {
        heading: 'Ready-made platform, template or custom build?',
        paragraphs: [
          'A website builder or a CMS theme can be the right answer for a small business that needs to be online quickly and will manage its own content. The trade-offs are less flexibility and, sometimes, slower pages.',
          'A custom build makes sense when your website is part of how the business operates: unusual pricing, bookings, a staff dashboard, or integrations with your own tools. It costs more to start, but it fits the way you work and you control the code.',
          'A good agency will tell you which of these fits instead of selling the biggest option. If the proposal never explains why it chose its approach, ask.',
        ],
      },
      {
        heading: 'What to include in a brief so quotes are comparable',
        list: [
          'Your business, who the customers are and what you want them to do on the site.',
          'Pages you expect, plus any existing site you want to improve.',
          'Features: forms, bookings, payments, accounts, languages, integrations.',
          'Who supplies content and images, and by when.',
          'Hosting and domain: do you already have them, and who will manage them?',
          'Who will update the site after launch, and how.',
        ],
      },
      {
        heading: 'Warning signs in a quote',
        list: [
          'No written scope. A price without a list of what is and is not included cannot be compared.',
          'Unclear ownership. You should own your domain, hosting account and source code or theme licences. Ask who holds the logins.',
          'No mention of mobile performance. Most visitors in India browse on phones; ask how the site will be tested on mid-range devices.',
          'No plan after launch. Ask what happens if something breaks, who does updates and what support costs.',
          'A fixed price before anyone has asked about your business. Fixed prices are fine once the scope is agreed, but a number given before any discovery is a guess.',
        ],
      },
      {
        heading: 'How we approach it',
        paragraphs: [
          'We work remotely from Kochi with businesses across Kerala and India. We agree scope, milestones, fees and handover in writing before starting, and we explain what each part of the proposal is for. Our website work covers business sites, ecommerce storefronts and redesigns.',
          'For a real example of a project with unusual pricing logic, see how we built Woobe, a storefront where clothing is priced by weight, with Razorpay and cash-on-delivery checkout.',
        ],
      },
    ],
    related: [
      { label: 'Website design & development in Kochi', href: '/services/website-design-kochi' },
      { label: 'Woobe: weight-based commerce project', href: '/projects/woobe' },
      { label: 'Custom software development in Kochi', href: '/services/custom-software-development' },
    ],
    cta: { label: 'Describe your website', href: '/contact?type=project&service=website-design', text: 'Tell us what your website needs to do and we will reply with questions and a scoped next step.' },
  },
  {
    slug: 'choosing-white-label-development-partner-agencies',
    title: 'How to Choose a White-Label Development Partner | SiliconMotives',
    headline: 'How to choose a white-label development partner for your agency',
    description: 'Eight questions agencies should ask before outsourcing software work to a white-label partner: ownership, communication, QA, security and how to run a pilot.',
    date: '2026-11-14',
    category: 'Agency partnerships',
    readingMinutes: 7,
    intro: 'Most agencies reach a point where client demand for custom software, backend work or cloud infrastructure outgrows the in-house team. Hiring takes months, and not every project justifies a permanent hire. A white-label development partner can fill the gap, if you choose carefully. These are the questions that matter.',
    sections: [
      {
        heading: 'What white-label development means',
        paragraphs: [
          'In a white-label arrangement the partner builds the work and you present it to your client under your own brand. The client relationship, pricing and communication stay with you. The partner works behind the scenes, following your process and, where needed, inside your repositories, project tools and chat.',
          'It is different from a freelancer marketplace. You are looking for a team you can brief repeatedly, that remembers how you work and takes responsibility for delivery, not for a single task.',
        ],
      },
      {
        heading: 'When it makes sense',
        list: [
          'You sell websites or marketing and clients increasingly ask for portals, CRMs, integrations or custom applications.',
          'Demand is uneven, so a full-time engineering hire would sit idle between projects.',
          'You need backend, API or AWS skills that your current developers do not have.',
          'You want to say yes to a client brief without taking on permanent payroll.',
        ],
      },
      {
        heading: 'Eight questions to ask before you commit',
        list: [
          'Who owns the code? Source code, repositories and cloud accounts should be yours or your client’s from day one, with that written into the contract.',
          'Will you sign an NDA and a clear agreement on confidentiality and non-solicitation of your clients?',
          'How do we communicate? Agree a time-zone overlap, response times, a single point of contact and written weekly updates.',
          'Who exactly will work on our projects, and what happens if they leave or are unavailable?',
          'How is work reviewed? Ask about code review, testing, staging environments and how you accept or reject a delivery.',
          'How are security and access handled? Ask about least-privilege access to your repositories and cloud accounts, secrets management and offboarding.',
          'Can you show relevant work? Look for real, documented projects similar to what you need, not generic claims.',
          'What does a typical estimate include? Understand assumptions, what is excluded and how changes to scope are handled.',
        ],
      },
      {
        heading: 'Working across time zones',
        paragraphs: [
          'If your agency is in the United States and your partner is in India, you will not share a whole working day. That is manageable when expectations are set early: a few hours of overlap for planning and review, clear written briefs, and updates that are ready when your morning starts.',
          'Be wary of partners who promise instant availability around the clock. Agree what is realistic, and put urgent-issue handling in writing.',
        ],
      },
      {
        heading: 'Start with a pilot, not a retainer',
        paragraphs: [
          'The safest way to evaluate a partner is a scoped first milestone: a small feature, an integration or an infrastructure setup, with agreed acceptance criteria and a deadline. You see how they communicate, how they handle ambiguity and how clean the handover is, before you rely on them for a larger client project.',
          'After the pilot, review it honestly: Was the estimate accurate? Were questions asked early? Was the code readable by your own developers? Those answers matter more than any sales pitch.',
        ],
      },
      {
        heading: 'Red flags',
        list: [
          'No written scope or acceptance criteria.',
          'Reluctance to give you direct access to repositories and hosting.',
          'Pressure to commit to a long retainer before any delivery.',
          'No named people, only a sales contact.',
          'Claims of guaranteed outcomes or unrealistic speed.',
        ],
      },
      {
        heading: 'How we work with agencies',
        paragraphs: [
          'SiliconMotives works with agencies as a remote engineering partner from Kerala, India, covering custom software, backend and API development, cloud infrastructure and AWS DevOps. You keep the client relationship; we agree milestones, ownership and handover before delivery begins, and we recommend starting with a scoped milestone.',
        ],
      },
    ],
    related: [
      { label: 'White-label development for agencies', href: '/agency-partners' },
      { label: 'Backend development services', href: '/services/backend-development' },
      { label: 'AWS DevOps engineering', href: '/services/aws-devops' },
    ],
    cta: { label: 'Discuss an agency partnership', href: '/contact?type=agency', text: 'Share your agency, the kind of work you need delivered and your timeline, and we will suggest a scoped first milestone.' },
  },
];

export const getBlogPost = (slug: string) => blogPosts.find(post => post.slug === slug);
export const blogPath = (slug: string) => `/blog/${slug}`;
export const sortedBlogPosts = () => [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
export const formatPostDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
