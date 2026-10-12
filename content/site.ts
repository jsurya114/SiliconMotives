// Every visible string on the site lives here, copied from the previous
// devaxistechnologies.in build. New UI micro-copy is grouped under `ui`.

const whatsappText =
  "Hi Silicon Motives! I have a project in mind and would love to explore how we can bring it to life. Could we discuss the right solution, timeline, and estimate?";

export const site = {
  brand: {
    name: "Silicon Motives",
    tagline: "Good software. Clear purpose.",
    url: "https://www.devaxistechnologies.in",
  },

  seo: {
    title: "Silicon Motives — Good software. Clear purpose.",
    description:
      "Silicon Motives is a remote-first software engineering company based in Kochi, Kerala. Thoughtful software, clear communication, and engineering that matters.",
  },

  contact: {
    email: "siliconmotives@gmail.com",
    phone: "+91 85901 84265",
    phoneHref: "tel:+918590184265",
    whatsappHref: `https://wa.me/918590184265?text=${encodeURIComponent(whatsappText)}`,
    location: "Kochi, Kerala, India",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Solutions", href: "#solutions" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Portfolio", href: "#portfolio" },
  ],
  navCta: { label: "Let’s talk", href: "#contact" },

  hero: {
    eyebrow: "Remote engineering. Real business value.",
    title: ["Your vision.", "Built with purpose."],
    lead: "Turn your ideas into software that moves your business forward. A remote engineering partner who understands your goals and cares about what you build.",
    cta: { label: "Let’s discuss your project", href: "#contact" },
    location: "Kochi, Kerala, India",
    promise: "Remote by design. Invested in your success.",
  },

  belief: {
    index: "01",
    eyebrow: "Our belief",
    statement: [
      "Great software starts with",
      "great people. And the space to do their best work.",
    ],
    body: "We believe quality comes from talented people, strong engineering practices, and a team that cares about what it builds. Our company is built around those essentials.",
  },

  clients: {
    eyebrow: "Our clients",
    title: "People we build with.",
    note: "Illustrative client names for this preview.",
    names: ["Northline", "Aster Labs", "Velora", "Orbit & Co.", "Luma Studio", "Fieldwork"],
  },

  services: {
    index: "02",
    eyebrow: "What we do",
    title: ["Built around what", "your business needs."],
    lead: "Practical engineering for the things your business needs to build, improve, and grow.",
    items: [
      {
        slug: "web",
        kicker: "Product build",
        name: "Web & product development",
        body: "Thoughtful websites and web applications that turn a business need into a useful, intuitive product.",
        cta: "Discuss your project",
      },
      {
        slug: "custom",
        kicker: "Built around you",
        name: "Custom software",
        body: "Software shaped around your workflows, from internal tools to the systems that keep your business moving.",
        cta: "Discuss your project",
      },
      {
        slug: "cloud",
        kicker: "Cloud foundation",
        name: "Cloud & infrastructure",
        body: "A considered foundation for your software, with dependable deployments and room to evolve.",
        cta: "Discuss your project",
      },
      {
        slug: "ongoing",
        kicker: "After launch",
        name: "Ongoing engineering",
        body: "Keep improving after launch. Resolve issues, refine performance, and build the next useful feature.",
        cta: "Discuss your project",
      },
    ],
  },

  solutions: {
    index: "03",
    eyebrow: "Solutions for your business",
    title: ["Start with the challenge.", "Build what makes a difference."],
    lead: "Technology shaped around your goals, your customers, and the way you work.",
    items: [
      {
        kicker: "Bring an idea to life",
        name: "Launch your digital product",
        body: "Turn an early idea into a focused first release. Define the essentials, build a useful experience, and learn from your users.",
        cta: "Discuss your idea",
      },
      {
        kicker: "Simplify everyday work",
        name: "Connect your operations",
        body: "Replace disconnected tools and repetitive tasks with custom workflows, integrations, and a clearer view of your business.",
        cta: "Explore your workflow",
      },
      {
        kicker: "Build for what’s next",
        name: "Improve your existing platform",
        body: "Give your software a stronger foundation with cloud infrastructure, thoughtful updates, and ongoing engineering support.",
        cta: "Plan your next step",
      },
    ],
  },

  remote: {
    index: "04",
    eyebrow: "Remote, with intention",
    title: ["A smaller footprint.", "A sharper focus."],
    lead: "Our best work doesn’t depend on a shared office. It depends on a shared standard.",
    badge: "Based in Kochi · Built to work remotely",
    principles: [
      {
        name: "Engineering value first",
        body: "We keep our company lean and put resources into our people, technology, and the quality of our work.",
      },
      {
        name: "Clarity at every step",
        body: "Clear communication, visible progress, and personal accountability keep everyone moving together.",
      },
      {
        name: "More considered by design",
        body: "Less daily commuting and less reliance on large offices are small, meaningful steps toward working more responsibly.",
      },
    ],
  },

  process: {
    index: "05",
    eyebrow: "How we work",
    title: ["Simple steps.", "Thoughtful software."],
    lead: "From the first conversation to launch, we keep you involved and the next step clear.",
    steps: [
      { name: "Understand", body: "We listen, ask questions, and get clear on what your business needs." },
      { name: "Plan", body: "We agree on the scope, priorities, and a practical way forward." },
      { name: "Build", body: "We build in small steps, sharing progress and refining with your feedback." },
      { name: "Launch & improve", body: "We release with care, hand over clearly, and plan what comes next." },
    ],
  },

  portfolio: {
    index: "06",
    eyebrow: "Portfolio",
    title: "Selected work.",
    lead: "Real businesses. Software built around them.",
    items: [
      {
        slug: "woobe",
        kicker: "Full-stack e-commerce",
        name: "Woobe — Fashion, by Weight",
        body: "Co-developed with Jasil M for a real client, this production storefront pairs mobile-first shopping with intuitive ₹/kg pricing and secure checkout.",
        image: "/images/woobe-fashion-cover.jpg",
        alt: "Editorial fashion cover visual for the Woobe case study, not a screenshot of the live store.",
      },
      {
        slug: "nasalogistic",
        kicker: "Logistics platform",
        name: "NasaLogistic — Driver & Logistics Management",
        body: "A production platform for driver availability, order workflows, and admin operations, built for a real client.",
        image: "/images/nasalogistic-cover.jpg",
        alt: "Editorial logistics cover visual for the NasaLogistic case study, not a product screenshot.",
      },
      {
        slug: "picbox",
        kicker: "Inventory & invoicing",
        name: "Picbox — Inventory & Invoicing System",
        body: "Built for a local events client, this production app manages rental inventory, jobs, wages, and invoicing; more than 190 PDF invoices have been generated.",
        image: "/images/picbox-cover.jpg",
        alt: "Editorial event rental and inventory cover visual for Picbox, not a product screenshot.",
      },
      {
        slug: "uniwayin",
        kicker: "Education consultancy CRM",
        name: "Uniwayin — Education Consultancy CRM",
        body: "A production CRM for four staff managing 280+ active leads, with follow-ups, notes, analytics, and role-based access.",
        image: "/images/uniwayin-cover.jpg",
        alt: "Editorial education consultancy cover visual for Uniwayin, not a product screenshot.",
      },
      {
        slug: "dental-buddy",
        kicker: "Dental clinic EMR",
        name: "Dental Buddy — Smart Dental EMR System",
        body: "Used daily in a live dental clinic, Dental Buddy brings patient records, prescriptions, appointments, and billing together with role-based access for clinic teams.",
        image: "/images/dental-buddy-cover.jpg",
        alt: "Illustrative dental clinic scene for Dental Buddy, not a photograph of the client clinic or a product screenshot.",
      },
    ],
  },

  testimonials: {
    index: "07",
    eyebrow: "What our clients say",
    title: ["Their experience.", "In their own words."],
    lead: "Client feedback will appear here once it’s ready to share.",
    placeholder: {
      label: "Testimonial coming soon",
      quote: "This space is reserved for feedback from a Silicon Motives client.",
      name: "Client name",
      role: "Role & company",
    },
    count: 6,
  },

  faq: {
    index: "08",
    eyebrow: "Frequently asked questions",
    title: ["Before we", "get started."],
    items: [
      {
        q: "How does working with a remote team work?",
        a: "We agree on communication channels, review points, and a working rhythm at the beginning. Written updates, shared documentation, and scheduled conversations help keep decisions and progress clear.",
      },
      {
        q: "Can you help with an existing product?",
        a: "Yes. We can start by understanding the existing software, its constraints, and your priorities, then agree on a focused plan for fixes, improvements, or new features.",
      },
      {
        q: "How do you estimate cost and timelines?",
        a: "We first need to understand your requirements and the current state of the project. From there, we can define the scope, discuss tradeoffs, and agree on an estimate before work begins.",
      },
      {
        q: "Where is Silicon Motives based?",
        a: "We are based in Kochi, Kerala, India, and work remotely. Our working arrangements and meeting times can be discussed around the needs of each project.",
      },
      {
        q: "What should I have ready for a first conversation?",
        a: "A short description of your idea or challenge is a great start. If you have a timeline, budget range, or existing product, those details help us understand what a useful next step looks like.",
      },
    ],
  },

  people: {
    index: "09",
    eyebrow: "The people behind the purpose",
    title: ["Built by people.", "Driven by a shared motive."],
    body: [
      "Silicon Motives was founded by Jayasoorya S and Jasil M in Kochi, Kerala, with a simple idea: build an efficient engineering company where location doesn’t determine quality.",
      "We’re shaping a team that values ownership, honest conversations, and pride in the product. A company where clients pay for engineering value, and where good people have the space to do meaningful work.",
    ],
    badge: "Independent by design",
    founders: [
      {
        label: "Founder 01",
        name: "Jasil M",
        role: "Co-founder",
        image: "/images/jasil.jpg",
        linkedin: "https://www.linkedin.com/in/jasilmeledath/",
      },
      {
        label: "Founder 02",
        name: "Jayasoorya S",
        role: "Co-founder",
        image: "/images/jayasoorya.jpg",
        linkedin: "https://www.linkedin.com/in/jayasoorya-suryadas/",
      },
    ],
    linkedinLabel: "Connect on LinkedIn",
    signoff: "From Kochi, with a shared ambition.",
  },

  contactSection: {
    eyebrow: "Your next chapter starts with a conversation",
    title: ["Something in mind?", "Let’s make it matter."],
    body: "Tell us what you’re thinking. A new idea, an existing product, or a problem that needs a fresh perspective.",
    cta: "Tell us about your idea",
    hello: {
      eyebrow: "Let’s build something great",
      title: "Your next big idea starts with a hello.",
      body: "A website, a product, or a fresh start. Tell us what you have in mind and let’s explore it together.",
      cta: "Chat on WhatsApp",
    },
    signoff: "Good people. Thoughtful engineering.",
    place: "Kochi, India",
  },

  form: {
    eyebrow: "Let’s start with your idea",
    title: ["A little context.", "A better start."],
    body: "Tell us a little about your idea. Your message goes straight to siliconmotives@gmail.com, and we’ll reply to your email.",
    fields: {
      name: { label: "Your name", placeholder: "Full name" },
      email: { label: "Email address", placeholder: "you@company.com" },
      project: { label: "What would you like to build?", placeholder: "Your idea, goals, and anything we should know…" },
      honeypot: "Leave this field empty",
    },
    submit: "Send your idea",
    close: "Close idea form",
    sending: "Sending your idea…",
    success: "Thank you! Your idea has been sent to our team. We’ll reply by email.",
    failurePrefix: "Your idea could not be sent.",
    errors: {
      timeout: "Sending is taking longer than expected. Please email siliconmotives@gmail.com if you need to follow up.",
      network: "Please check your connection or email siliconmotives@gmail.com directly.",
      generic: "Please try again or email siliconmotives@gmail.com directly.",
    },
  },

  footer: {
    eyebrow: "Have a project in mind?",
    title: ["Let’s build something", "that matters."],
    cta: "Tell us what you’re planning",
    tagline: ["Independent minds.", "Thoughtful software.", "One shared purpose."],
    meta: "Remote first · Kochi, Kerala",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Services", href: "#services" },
          { label: "Solutions", href: "#solutions" },
          { label: "Projects", href: "#portfolio" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About us", href: "#about" },
          { label: "Clients", href: "#clients" },
          { label: "Testimonials", href: "#testimonials" },
          { label: "Frequently asked questions", href: "#faq" },
        ],
      },
    ],
    based: {
      title: "Based in Kerala",
      lines: ["Kochi, Kerala", "India"],
      remote: ["Working remotely", "with teams everywhere."],
      cta: "Start a conversation",
    },
    copyright: "© 2026 Silicon Motives",
    backToTop: "Back to top",
  },

  floating: { line1: "Have an idea?", line2: "Let’s talk on WhatsApp" },

  // New micro-copy introduced by this build.
  ui: {
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    homeLabel: "Silicon Motives home",
    mainNav: "Main navigation",
    servicesRail: "Services",
    toggleFaq: "Show answer",
    notFoundTitle: "This page could not be found.",
    notFoundCta: "Back to home",
  },
} as const;

export type Site = typeof site;
