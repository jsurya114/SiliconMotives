/**
 * Service + location landing pages. Each page targets a distinct search intent
 * and carries its own copy and FAQs; avoid cloning text between pages, since
 * near-duplicate "doorway" pages are penalised by search engines.
 */
export interface LandingPage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string[];
  serviceHeading: string;
  services: { title: string; text: string }[];
  whyHeading: string;
  why: { title: string; text: string }[];
  localHeading: string;
  local: string[];
  faqs: { q: string; a: string }[];
  serviceType: string;
  areaServed: string;
}

export const landingPages: LandingPage[] = [
  {
    slug: "web-design-company-kochi",
    metaTitle: "Website Design Company in Kochi, Kerala",
    metaDescription:
      "Looking for a website design company in Kochi? SiliconMotives designs fast, responsive, SEO-ready websites for Kochi businesses, built by engineers, not overhead.",
    keywords: [
      "web design Kochi",
      "website design company Kochi",
      "web designers in Kochi",
      "best website design Kochi",
      "website development Ernakulam",
    ],
    eyebrow: "WEBSITE DESIGN · KOCHI, KERALA",
    h1: "Website design company in Kochi, built for businesses that want results.",
    intro: [
      "Your website is often the first conversation a customer has with your business. We design and build websites for Kochi companies that load fast, read clearly on every phone, and are structured so search engines understand exactly what you offer.",
      "SiliconMotives is a remote-first engineering team based in Kochi. Because we don’t carry the cost of a large office, more of your budget goes into design, engineering, and the quality of the finished site.",
    ],
    serviceHeading: "Websites we design and build in Kochi",
    services: [
      {
        title: "Business & company websites",
        text: "Clear, credible websites for Kochi companies, professional firms, and startups, with content your team can update without calling a developer.",
      },
      {
        title: "Landing pages that convert",
        text: "Focused pages for campaigns and launches, built to load in a blink and guide visitors to one clear action.",
      },
      {
        title: "Website redesigns",
        text: "Outdated or slow site? We rebuild it on modern foundations while protecting the search rankings you already have.",
      },
      {
        title: "WordPress & Shopify sites",
        text: "When a familiar CMS or hosted store is the right fit, we set it up properly: fast themes, clean structure, and sensible plugins.",
      },
    ],
    whyHeading: "Why Kochi businesses work with us",
    why: [
      {
        title: "Mobile-first by default",
        text: "Most of your visitors arrive on a phone. Every layout is designed for small screens first, then scaled up.",
      },
      {
        title: "SEO foundations included",
        text: "Semantic HTML, page titles, meta descriptions, structured data, sitemaps, and fast load times are part of the build, not an upsell.",
      },
      {
        title: "Talk to the people building it",
        text: "No account-manager layers. You speak directly with the designers and engineers working on your site.",
      },
      {
        title: "Value, not overhead",
        text: "Our lean, remote-first model means you pay for design and engineering rather than office rent.",
      },
    ],
    localHeading: "Based in Kochi, working wherever you are",
    local: [
      "We’re a Kochi-based team that works remotely by design. Whether your business is in Ernakulam, Kakkanad, Edappally, or Fort Kochi, we run the project through clear milestones, regular demos, and written updates, so you always know what’s happening without needing to block out meetings.",
    ],
    faqs: [
      {
        q: "How much does a website cost in Kochi?",
        a: "It depends on the number of pages, features, and integrations. We discuss your goals first, then share a clear scope and estimate before any work begins, so there are no surprises.",
      },
      {
        q: "Will my website be mobile-friendly and SEO-ready?",
        a: "Yes. Every site we build is responsive, fast, and includes on-page SEO essentials such as titles, descriptions, structured data, and an XML sitemap.",
      },
      {
        q: "Can you redesign our existing website?",
        a: "Yes. We review what you have, keep what works, and rebuild the rest on a modern stack, taking care to preserve existing search visibility.",
      },
    ],
    serviceType: "Website design",
    areaServed: "Kochi",
  },
  {
    slug: "web-application-development-kochi",
    metaTitle: "Web Application Development Company in Kochi",
    metaDescription:
      "Custom web application development in Kochi, Kerala. SiliconMotives builds dashboards, portals, SaaS products, and business systems with React, Next.js, Node.js, and PostgreSQL.",
    keywords: [
      "web app development Kochi",
      "web application development company Kochi",
      "custom software development Kochi",
      "SaaS development Kerala",
      "React developers Kochi",
    ],
    eyebrow: "WEB APPLICATION DEVELOPMENT · KOCHI",
    h1: "Custom web application development in Kochi.",
    intro: [
      "Spreadsheets, disconnected tools, and manual workarounds slow teams down. We build custom web applications (portals, dashboards, internal tools, and SaaS products) shaped around how your business actually works.",
      "Our Kochi-based engineers handle the whole journey: product design, APIs, databases, testing, and cloud deployment. One accountable team, from first idea to a dependable product in production.",
    ],
    serviceHeading: "What we build",
    services: [
      {
        title: "Customer & partner portals",
        text: "Secure portals where your customers or partners can log in, track orders, download documents, and manage their accounts.",
      },
      {
        title: "Dashboards & internal tools",
        text: "Replace scattered spreadsheets with one source of truth: role-based access, reporting, and the workflows your team uses daily.",
      },
      {
        title: "SaaS products & MVPs",
        text: "Shape an idea into a launchable product, built to grow with subscriptions, multi-tenant data, and clean APIs.",
      },
      {
        title: "Integrations & automation",
        text: "Connect payment gateways, CRMs, accounting systems, and third-party APIs so data flows without manual copying.",
      },
    ],
    whyHeading: "How we engineer web applications",
    why: [
      {
        title: "Modern, proven stack",
        text: "React and Next.js on the front end, Node.js and PostgreSQL behind it, deployed on AWS: technology chosen for longevity, not trends.",
      },
      {
        title: "Small iterations, regular demos",
        text: "You see working software early and often, so priorities can shift before they become expensive changes.",
      },
      {
        title: "Built to be maintained",
        text: "Readable code, documentation, and automated deployments make your application easy to extend long after launch.",
      },
      {
        title: "Lean team, focused budget",
        text: "Being remote-first keeps overhead low, so your investment goes into engineering hours and infrastructure.",
      },
    ],
    localHeading: "A Kochi engineering team for Kerala and beyond",
    local: [
      "We’re based in Kochi and build web applications for businesses across Kerala, India, and abroad. Our remote-first process (agreed milestones, demos, and written progress updates) works just as well whether you’re in Infopark or on another continent.",
    ],
    faqs: [
      {
        q: "How long does it take to build a web application?",
        a: "A focused first version can often be scoped into a few iterations. After discovery we share a delivery plan with milestones, so you know what will be ready and when.",
      },
      {
        q: "Who owns the code and data?",
        a: "Ownership terms are agreed in writing before the project starts. We’re happy to discuss the arrangement that suits your business.",
      },
      {
        q: "Do you provide support after launch?",
        a: "Yes. We offer deployment, maintenance, and ongoing support so your application stays secure and dependable.",
      },
    ],
    serviceType: "Web application development",
    areaServed: "Kochi",
  },
  {
    slug: "ecommerce-website-development-kerala",
    metaTitle: "E-commerce Website Development in Kerala",
    metaDescription:
      "E-commerce website development in Kerala: custom online stores, Shopify, and WooCommerce with payments, inventory, and fast checkout. Built by SiliconMotives, Kochi.",
    keywords: [
      "e-commerce website development Kerala",
      "online store development Kochi",
      "Shopify developer Kerala",
      "WooCommerce development Kochi",
      "custom e-commerce development India",
    ],
    eyebrow: "E-COMMERCE DEVELOPMENT · KERALA",
    h1: "E-commerce website development in Kerala.",
    intro: [
      "Selling online takes more than a product grid. It needs a fast storefront, a checkout people trust, and tools that make orders and inventory easy to manage. We build online stores for Kerala businesses that do all three.",
      "Whether Shopify gets you selling quickly or your catalogue and checkout need a custom platform, we recommend the option that fits your business, not the one that’s easiest for us.",
    ],
    serviceHeading: "Online stores we build",
    services: [
      {
        title: "Custom e-commerce platforms",
        text: "Your catalogue, your checkout, your rules: built from the ground up when off-the-shelf platforms can’t fit how you sell.",
      },
      {
        title: "Shopify stores",
        text: "Shopify setups with clean themes, product structure, and the apps you actually need, ready for your team to run.",
      },
      {
        title: "WooCommerce on WordPress",
        text: "Flexible stores for businesses already on WordPress or needing rich content alongside products.",
      },
      {
        title: "Payments, shipping & inventory",
        text: "Integrations with Indian and international payment gateways, shipping partners, and stock management.",
      },
    ],
    whyHeading: "What makes a store sell",
    why: [
      {
        title: "Speed that keeps buyers",
        text: "Optimised images, lean code, and good hosting so product pages load quickly on mobile data.",
      },
      {
        title: "Checkout people trust",
        text: "Clear pricing, familiar payment options, and as few steps as possible between cart and confirmation.",
      },
      {
        title: "Search-friendly catalogue",
        text: "Clean URLs, product structured data, and category pages organised for both shoppers and search engines.",
      },
      {
        title: "Easy to run day to day",
        text: "An admin your team can actually use for orders, stock, discounts, and reporting.",
      },
    ],
    localHeading: "From Kochi to stores across Kerala",
    local: [
      "Our team is based in Kochi and builds online stores for retailers, brands, and producers across Kerala, from Thiruvananthapuram to Kozhikode, as well as for businesses selling to customers across India and overseas.",
    ],
    faqs: [
      {
        q: "Should I choose Shopify or a custom e-commerce website?",
        a: "Shopify is great for getting a standard store live quickly. A custom platform makes sense when your catalogue, pricing, or checkout has needs that off-the-shelf tools can’t meet. We’ll walk you through the trade-offs honestly.",
      },
      {
        q: "Can you integrate Indian payment gateways?",
        a: "Yes. We integrate popular Indian payment gateways as well as international options, depending on where your customers are.",
      },
      {
        q: "Can you migrate my existing store?",
        a: "Yes. We can move products, customers, and orders to a new platform while protecting your existing URLs and search rankings.",
      },
    ],
    serviceType: "E-commerce website development",
    areaServed: "Kerala",
  },
  {
    slug: "website-design-kottayam",
    metaTitle: "Website Design & Development in Kottayam",
    metaDescription:
      "Website design and development for Kottayam businesses. SiliconMotives builds fast, mobile-friendly websites and web apps, with clear communication and no overhead.",
    keywords: [
      "website design Kottayam",
      "web design company Kottayam",
      "web development Kottayam",
      "website developers Kottayam",
      "web app development Kottayam",
    ],
    eyebrow: "WEBSITE DESIGN · KOTTAYAM",
    h1: "Website design and development for Kottayam businesses.",
    intro: [
      "Kottayam businesses deserve websites that are as dependable as they are. Whether you run a school, a clinic, a shop, or a service firm, we design and develop fast, mobile-friendly websites and web applications that fit how you work.",
      "We’re a remote-first engineering team based in Kochi. You get direct access to the people building your site, and a budget that goes into engineering rather than office overhead.",
    ],
    serviceHeading: "How we help Kottayam businesses",
    services: [
      {
        title: "Websites for local businesses",
        text: "Professional sites that clearly explain your services, show up properly on Google, and make it easy for customers to reach you.",
      },
      {
        title: "Institution & organisation websites",
        text: "Well-structured sites for schools, colleges, hospitals, and associations, with content that’s simple to keep up to date.",
      },
      {
        title: "Online stores",
        text: "Sell local products to customers across Kerala and beyond with Shopify, WooCommerce, or a custom store.",
      },
      {
        title: "Business web applications",
        text: "Booking systems, member portals, and internal tools that replace paperwork and spreadsheets.",
      },
    ],
    whyHeading: "Why work with SiliconMotives",
    why: [
      {
        title: "Remote, not distant",
        text: "Agreed milestones, regular demos, and written updates keep you close to the work without frequent travel.",
      },
      {
        title: "Built to be found",
        text: "Local SEO foundations (page titles, structured data, and fast load times) help nearby customers find you.",
      },
      {
        title: "Plain-language communication",
        text: "We explain options and trade-offs clearly, so you can make confident decisions.",
      },
      {
        title: "Support after launch",
        text: "Hosting, maintenance, and updates so your website stays secure and current.",
      },
    ],
    localHeading: "A Kochi team working with Kottayam",
    local: [
      "From our base in Kochi, we work with businesses in Kottayam town, Changanassery, Pala, Ettumanoor, Vaikom, and across the district. Our remote-first process means distance never slows a project down.",
    ],
    faqs: [
      {
        q: "Do you work with small businesses in Kottayam?",
        a: "Yes. We work with businesses of all sizes and recommend a scope that fits your goals and budget.",
      },
      {
        q: "Can we meet to discuss the project?",
        a: "We usually start with a video call to understand your needs. Communication channels and meeting rhythm are agreed together at the start of the project.",
      },
      {
        q: "Will my site help customers find us on Google?",
        a: "Every site includes on-page SEO essentials. Ranking also depends on content, reviews, and your Google Business Profile, and we’ll advise you on those too.",
      },
    ],
    serviceType: "Website design",
    areaServed: "Kottayam",
  },
  {
    slug: "web-development-company-kerala",
    metaTitle: "Web Development Company in Kerala, India",
    metaDescription:
      "SiliconMotives is a remote-first web development company in Kerala, India, building websites, web applications, e-commerce, and CRM/ERP systems for clients in India and worldwide.",
    keywords: [
      "web development company Kerala",
      "web development company India",
      "software company Kerala",
      "remote web development team India",
      "CRM ERP development Kerala",
    ],
    eyebrow: "WEB DEVELOPMENT · KERALA, INDIA",
    h1: "A web development company in Kerala, working with clients worldwide.",
    intro: [
      "SiliconMotives is a remote-first web development company based in Kochi, Kerala. We design, build, and deploy websites, web applications, e-commerce platforms, and business systems for clients across India and around the world.",
      "We believe great software doesn’t require a large office. It requires talented people, strong engineering practices, clear communication, and accountability. Staying lean lets us put your budget where it matters: engineering and quality.",
    ],
    serviceHeading: "Our development services",
    services: [
      {
        title: "Custom web applications",
        text: "Portals, dashboards, and SaaS products built with React, Next.js, Node.js, and PostgreSQL.",
      },
      {
        title: "E-commerce development",
        text: "Custom storefronts, Shopify, and WooCommerce with payments, inventory, and fast checkout.",
      },
      {
        title: "CRM & ERP systems",
        text: "Leads, customers, operations, and reporting brought together in one connected workflow.",
      },
      {
        title: "Cloud & deployment",
        text: "AWS hosting, CI/CD pipelines, SSL, backups, monitoring, and ongoing maintenance.",
      },
    ],
    whyHeading: "Why clients in India and abroad choose us",
    why: [
      {
        title: "Engineering value, not overhead",
        text: "Our remote-first model keeps costs lean, so more of your investment goes into skilled people and good infrastructure.",
      },
      {
        title: "Time zones planned in",
        text: "For international clients we agree overlapping working hours and rely on clear written updates.",
      },
      {
        title: "Direct access to engineers",
        text: "You work with the people building your product, with no layers in between.",
      },
      {
        title: "Ownership from start to finish",
        text: "One accountable team covers design, development, testing, deployment, and support.",
      },
    ],
    localHeading: "Rooted in Kerala, working worldwide",
    local: [
      "Kerala has a deep pool of engineering talent, and we’re proud to be part of it. From our base in Kochi, we collaborate with businesses across Kerala, the rest of India, and abroad.",
    ],
    faqs: [
      {
        q: "Do you work with international clients?",
        a: "Yes. Our remote-first process (agreed milestones, demos, and written updates) is built for collaborating across time zones.",
      },
      {
        q: "Which technologies do you use?",
        a: "Mostly React, Next.js, TypeScript, Node.js, and PostgreSQL, deployed on AWS, plus Shopify, WordPress, and WooCommerce where they fit best.",
      },
      {
        q: "How do we get started?",
        a: "Send us a short note about your project. We’ll set up a call to understand your goals, then propose a scope and estimate.",
      },
    ],
    serviceType: "Web development",
    areaServed: "Kerala",
  },
];

export const getLandingPage = (slug: string) =>
  landingPages.find((p) => p.slug === slug);
