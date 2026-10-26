export const websiteDesign = {
  path: '/services/website-design-kochi',
  enquiryHref: '/contact?type=project&service=website-design',
  title: 'Website Design & Development in Kochi | SiliconMotives',
  description: 'Website design and development from Kochi, Kerala. Business websites, commerce storefronts, and redesigns with remote delivery across India.',
  projectEvidence: [
    {
      slug: 'woobe',
      need: 'Help shoppers understand clothing sold by weight, rather than a fixed price per item.',
      approach: 'Product pages show the garment weight and rate per kilogram. Shared pricing logic calculates the amount in grams and paise, while a separate API handles application business rules.',
      evidence: 'See the public storefront, product-page captures and linked pricing implementation in the engineering overview.',
    },
    {
      slug: 'jjc-artworks',
      need: 'Help prospective customers understand a chapel-interior and woodwork business before making an enquiry.',
      approach: 'The website presents service categories with relevant imagery and contextual enquiry links. Visitors can move from the business introduction to a specific service and contact route.',
      evidence: 'See the public homepage and services-page captures. The live website presents the business as JJC Chapel Interiors.',
    },
  ],
  offers: [
    {
      name: 'Business websites',
      description: 'Explain what you do, show your work, and help the right people get in touch. We shape the pages around your services, your content, and the questions your customers ask.',
    },
    {
      name: 'Commerce storefronts',
      description: 'A shopping experience shaped around your products and how you sell them. We plan product information, selection, checkout, and the operational requirements together.',
    },
    {
      name: 'Website redesigns',
      description: 'Improve an existing website with clearer content, a more useful page structure, and layouts that work on phones. We start by understanding what needs to improve and what already works.',
    },
  ],
  scopeItems: [
    {
      name: 'Pages and content',
      description: 'Agree the sitemap, enquiry routes, and who supplies copy, product details, images and approvals. Existing content is reviewed before deciding what to keep.',
    },
    {
      name: 'Features and editing',
      description: 'Define the forms, product workflows, integrations and content editing you actually need. A brochure website and a custom commerce application require different scopes.',
    },
    {
      name: 'Launch preparation',
      description: 'Plan mobile layouts, page titles, descriptions, crawlable links, image handling and hosting. For a redesign, review existing URLs and agree redirects for pages that move.',
    },
    {
      name: 'Access and ongoing care',
      description: 'Agree domain and hosting account responsibilities, handover materials, and the boundaries of any maintenance or support. Recurring services are identified in the proposal.',
    },
  ],
  lifecycle: [
    ['Discover', 'Understand your business, audience, existing content, and the purpose of the website.'],
    ['Architect', 'Agree the pages, content structure, features, and technical approach.'],
    ['Build', 'Design and develop the experience, with review points for your feedback.'],
    ['Deploy', 'Prepare the agreed hosting and domain setup, check the release, and launch.'],
    ['Operate', 'Hand over access and documentation, with an agreed plan for updates and support.'],
  ],
  faqs: [
    {
      question: 'Are you based in Kochi?',
      answer: 'Our engineering operations are based in Kochi, Kerala, India. SiliconMotives works remotely, with communication and review points agreed for each project.',
    },
    {
      question: 'Can you build a website for a business outside Kerala?',
      answer: 'Yes. We offer remote website design and development for businesses across India. We agree how to share content, review progress, and make decisions before work begins.',
    },
    {
      question: 'How much will a website cost, and how long will it take?',
      answer: 'That depends on the pages, design requirements, functionality, integrations, and available content. Tell us what the website needs to do; we will agree the scope, estimate, and delivery milestones in a proposal.',
    },
    {
      question: 'Can I update the website after launch?',
      answer: 'We discuss who will manage content and which parts need to be editable when planning the website. The editing setup, access, documentation, and any ongoing support are part of the agreed scope.',
    },
    {
      question: 'Can you build an ecommerce website with custom pricing?',
      answer: 'We can discuss a commerce build around your product and pricing rules. Woobe is an example of weight-based pricing with product selection and Razorpay or cash-on-delivery checkout options. Your catalogue, payment requirements and order workflow determine the scope; a standard storefront and a custom commerce application are different projects.',
    },
    {
      question: 'Who will I work with, and what happens after I enquire?',
      answer: 'Jasil M focuses on systems, cloud and architecture; Jayasoorya Suryadas focuses on systems and software engineering. We review your brief, clarify content and functionality, and agree scope, review checkpoints and responsibilities before work begins. Communication and any support after launch are agreed for your project.',
    },
    {
      question: 'Do you consider search visibility when building a website?',
      answer: 'We consider readable content, mobile layouts, useful page structure, metadata, and crawlable pages. Search rankings also depend on the quality of the content, competition, and reputation of the business. A website launch does not guarantee a particular Google position.',
    },
    {
      question: 'Can you redesign my website without changing every URL?',
      answer: 'Yes. A redesign does not require changing every page address. We review existing pages and agree which URLs to retain. Where a page moves, redirects and internal links are part of the migration plan. Google still needs time to process changes, so rankings may fluctuate.',
    },
    {
      question: 'What should I send for a website estimate?',
      answer: 'Share your current website if you have one, what your business does, the pages or features you need, available content, and your preferred launch date. Include a budget range if one is set. We use this to discuss scope and identify questions before preparing a proposal.',
    },
  ],
} as const;
