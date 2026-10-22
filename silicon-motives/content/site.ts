// Presentation copy for the Silicon Motives website. Published CMS content is loaded separately.

const whatsappText =
  "Hi SiliconMotives! I have a project in mind and would love to explore how we can bring it to life. Could we discuss the right solution, timeline, and estimate?";

export const site = {
  brand: {
    name: "SiliconMotives",
    tagline: "Good software. Clear purpose.",
  },

  seo: {
    title: "SiliconMotives — Custom Software, Cloud Infrastructure & DevOps",
    description:
      "A small remote-first engineering company working from Kerala, India on custom software, cloud infrastructure, and DevOps.",
  },

  contact: {
    email: "hello@siliconmotives.com",
    phone: "+91 85901 84265",
    phoneHref: "tel:+918590184265",
    whatsappHref: `https://wa.me/918590184265?text=${encodeURIComponent(whatsappText)}`,
    location: "Kochi, Kerala, India",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/projects" },
    { label: "Agency partners", href: "/agency-partners" },
  ],
  navCta: { label: "Let’s talk", href: "#contact" },

  hero: {
    eyebrow: "Custom Software · Cloud Infrastructure · DevOps",
    title: ["Engineering for", "businesses & agencies."],
    lead: "Custom Software Engineering, Cloud Infrastructure, and DevOps for businesses and agencies, delivered remotely from Kerala, India.",
    cta: { label: "Start a project", href: "/contact?type=project" },
    agencyCta: { label: "Agency partnerships", href: "/agency-partners" },
    location: "Kerala, India · Remote-first",
    promise: "For businesses and agencies",
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
  },

  services: {
    index: "02",
    eyebrow: "What we do",
    title: ["Three capabilities.", "One engineering partner."],
    lead: "Custom Software Engineering, Cloud Infrastructure Engineering, and DevOps & Reliability.",
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
    title: ["Remote-first.", "Engineering-focused."],
    lead: "Our engineering operations are in Kerala, India. We work with teams through planned overlap, focused work, and written progress.",
    principles: [
      {
        name: "Room for engineering",
        body: "A lean remote model keeps more of the budget focused on engineering work.",
      },
      {
        name: "Clear collaboration",
        body: "We agree on meeting overlap, written updates, and review checkpoints with each team.",
      },
      {
        name: "Focused work",
        body: "Working remotely makes it possible to hire beyond one city and avoid unnecessary commuting.",
      },
    ],
  },

  process: {
    index: "05",
    eyebrow: "How we work",
    title: ["Simple steps.", "Thoughtful software."],
    lead: "From the first conversation to launch, we keep you involved and the next step clear.",
    steps: [
      { name: "Discover", body: "We understand the users, business need, constraints, and measures of success." },
      { name: "Architect", body: "We shape the system, delivery plan, and technical decisions before implementation." },
      { name: "Build", body: "We build in small steps, sharing progress and refining with your feedback." },
      { name: "Deploy", body: "We release with care and make the operational handover clear." },
      { name: "Operate", body: "We monitor, maintain, and improve the system with an agreed support model." },
    ],
  },

  portfolio: {
    index: "08",
    eyebrow: "Portfolio",
    title: "Selected work.",
    lead: "A commerce storefront and an event-rental operations system, described by the capabilities they provide.",
  },

  testimonials: {
    index: "07",
    eyebrow: "What our clients say",
    title: ["Their experience.", "In their own words."],
    lead: "We’ll share client feedback here when it’s ready to be published.",
  },

  faq: {
    index: "10",
    eyebrow: "Frequently asked questions",
    title: ["Before we", "get started."],
  },

  people: {
    index: "11",
    eyebrow: "The people behind the purpose",
    title: ["Built by people.", "Driven by a shared motive."],
    body: [
      "SiliconMotives is led by Jasil M and Jayasoorya Suryadas from Kerala, India.",
      "Jasil is Founder, focused on systems, cloud, and architecture. Jayasoorya is Co-founder.",
    ],
    badge: "Kerala · Remote-first",
    founders: [
      {
        label: "Founder 01",
        name: "Jasil M",
        role: "Founder · Systems, cloud & architecture",
        image: "/images/jasil.jpg",
        linkedin: "https://www.linkedin.com/in/jasilmeledath/",
      },
      {
        label: "Founder 02",
        name: "Jayasoorya Suryadas",
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
    body: "Tell us a little about your idea. We’ll reply by email.",
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
      timeout: "Sending is taking longer than expected. Please email hello@siliconmotives.com if you need to follow up.",
      network: "Please check your connection or email hello@siliconmotives.com directly.",
      generic: "Please try again or email hello@siliconmotives.com directly.",
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
          { label: "Services", href: "/#services" },
          { label: "Projects", href: "/projects" },
          { label: "Agency Partners", href: "/agency-partners" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
    based: {
      title: "Based in Kerala",
      lines: ["Kochi, Kerala", "India"],
      remote: ["Open to remote collaboration", "across locations."],
      cta: "Start a conversation",
    },
    copyright: "© 2026 SiliconMotives",
    legal: "SiliconMotives is operated by Millionian LLC, a Wyoming limited liability company.",
    backToTop: "Back to top",
  },

  floating: { line1: "Have an idea?", line2: "Let’s talk on WhatsApp" },

  // New micro-copy introduced by this build.
  ui: {
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    homeLabel: "SiliconMotives home",
    mainNav: "Main navigation",
    servicesRail: "Services",
    toggleFaq: "Show answer",
    notFoundTitle: "This page could not be found.",
    notFoundCta: "Back to home",
  },
} as const;

export type Site = typeof site;
