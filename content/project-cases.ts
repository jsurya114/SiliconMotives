import { clientLogos } from '@/lib/client-logos';

export type ProjectStory = {
  need: string;
  approach: string;
  workflow: [string, string][];
  decisions?: { title: string; explanation: string }[];
  stack?: string[];
  references?: { label: string; href: string }[];
  // Add only approved, redacted product captures. Keep the gallery absent otherwise.
  screenshots?: { src: string; alt: string; caption: string; width: number; height: number }[];
  deliveryPeriod?: string;
  contributors?: { name: string; responsibility: string }[];
  result?: { statement: string; context: string; sourceLabel: string; sourceUrl?: string };
};

export type ProjectCase = {
  slug: string;
  name: string;
  logo?: string;
  descriptor: string;
  category: string;
  summary: string;
  scope: string[];
  technicalNotes: string[];
  liveUrl?: string;
  story?: ProjectStory;
};

// Public copy is limited to product scope documented in the project records.
// Dates, contributor roles, metrics, and security claims need client-approved
// evidence before they can be published.
export const projectCases: ProjectCase[] = [
  {
    slug: 'woobe',
    name: 'Woobe',
    logo: clientLogos.woobe,
    descriptor: 'Weight-based commerce',
    category: 'Commerce',
    summary: 'A commerce storefront designed for products priced by weight.',
    scope: [
      'Product prices shown per kilogram (₹/kg).',
      'Weight-based product selection.',
      'Checkout options include Razorpay and cash on delivery.',
    ],
    technicalNotes: ['Cloud infrastructure: AWS.'],
    liveUrl: 'https://www.woobe.in/',
    story: {
      need: 'Woobe’s clothing storefront needs to explain a pricing model based on weight. Customers need to understand the rate per kilogram, the weight of a product, and how that translates into a payable amount.',
      approach: 'The application separates customer shopping, staff administration and backend business rules. The storefront and staff admin are Next.js applications; both communicate with an Express API rather than accessing the database directly.',
      workflow: [
        ['Browse', 'Explore garments with a displayed rate per kilogram and product weight.'],
        ['Calculate', 'Calculate weight-based prices using integer grams and paise, then format the amount for display.'],
        ['Check out', 'Continue through checkout with Razorpay or cash-on-delivery options.'],
        ['Administer', 'Use a separate staff application for catalog, inventory and order workflows.'],
      ],
      decisions: [
        { title: 'Keep pricing arithmetic explicit', explanation: 'The shared pricing function multiplies weight in grams by the rate in paise per kilogram, divides by 1,000, and rounds to the nearest paisa. Money and weight remain integers during the calculation; rupees and kilograms are display formats.' },
        { title: 'Give business rules a clear boundary', explanation: 'Customer and admin applications use the API for reads and writes. The API is organized into modules with domain, application, infrastructure and interface layers, keeping the business logic separate from the web interface.' },
        { title: 'Share definitions between applications', explanation: 'The repository contains shared packages for TypeScript types, Zod validation, UI primitives and pure utility functions. The two interfaces can use the same definitions for inputs and pricing displays.' },
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'Zod', 'Razorpay'],
      screenshots: [
        {
          src: '/images/projects/woobe/storefront-2026-10-23.webp',
          alt: 'Woobe storefront with the navigation, promotional banner and clothing category links.',
          caption: 'Public storefront and category navigation. Captured from woobe.in on 23 October 2026.',
          width: 2880,
          height: 1432,
        },
        {
          src: '/images/projects/woobe/product-detail-2026-10-23.webp',
          alt: 'Woobe product page showing a maroon shirt, its price, weight in grams, rate per kilogram and size selection.',
          caption: 'Product detail showing weight-based pricing and product options. Captured on 23 October 2026; prices and availability may change.',
          width: 2880,
          height: 1432,
        },
      ],
      references: [
        { label: 'Application structure', href: 'https://github.com/jsurya114/Wobee-ecommerce/blob/c6cac10926e95697991bb7c7a5c7e83af7b23f0d/Readme.md' },
        { label: 'Weight-based pricing implementation', href: 'https://github.com/jsurya114/Wobee-ecommerce/blob/c6cac10926e95697991bb7c7a5c7e83af7b23f0d/packages/utils/src/weight.ts' },
        { label: 'Money representation', href: 'https://github.com/jsurya114/Wobee-ecommerce/blob/c6cac10926e95697991bb7c7a5c7e83af7b23f0d/packages/utils/src/money.ts' },
      ],
    },
  },
  {
    slug: 'nasalogistics',
    name: 'NasaLogistics',
    logo: clientLogos.nasalogistics,
    descriptor: 'Driver & logistics management',
    category: 'Logistics software',
    summary: 'A logistics platform for driver availability, order workflows, and administration.',
    scope: [
      'Driver availability workflows.',
      'Order management for logistics operations.',
      'Administrative tools for day-to-day operations.',
    ],
    technicalNotes: [],
  },
  {
    slug: 'picbox',
    name: 'Picbox',
    logo: clientLogos.picbox,
    descriptor: 'Event-rental inventory & invoicing',
    category: 'Business software',
    summary: 'An inventory and invoicing system for an event-rental business.',
    scope: [
      'Rental inventory and job records.',
      'Wage tracking for event work.',
      'PDF invoice generation.',
    ],
    technicalNotes: [],
    story: {
      need: 'Event-rental operations connect equipment, jobs, staff wages and customer invoices. Picbox brings those records into an application built around the rental workflow.',
      approach: 'The product scope combines rental inventory and job records with wage tracking and PDF invoice generation. These functions give the business a place to manage the operational and billing parts of event work.',
      workflow: [
        ['Inventory', 'Maintain records for rental equipment.'],
        ['Jobs', 'Manage the records for event-rental work.'],
        ['Wages', 'Track wages associated with event work.'],
        ['Invoices', 'Generate PDF invoices for customer billing.'],
      ],
    },
  },
  {
    slug: 'uniwayin',
    name: 'Uniwayin',
    logo: clientLogos.uniwayin,
    descriptor: 'Education consultancy CRM',
    category: 'Business software',
    summary: 'A CRM for education consultancy lead and follow-up workflows.',
    scope: [
      'Lead records and follow-up tracking.',
      'Notes and analytics for consultancy workflows.',
      'Role-based access for staff.',
    ],
    technicalNotes: [],
    liveUrl: 'https://ums.theuniway.co.in/',
    story: {
      need: 'Education consultancy work depends on keeping lead details, conversation notes and follow-ups together. Uniwayin organizes those activities in a CRM for consultancy staff.',
      approach: 'The CRM combines lead records, follow-up tracking, notes and analytics. Role-based access distinguishes what staff can access within the application.',
      workflow: [
        ['Record', 'Keep enquiry and lead information in the CRM.'],
        ['Follow up', 'Track follow-up activity and retain notes for context.'],
        ['Review', 'Use analytics to review consultancy workflows.'],
        ['Control access', 'Apply staff access according to their role.'],
      ],
      screenshots: [
        {
          src: '/images/projects/uniwayin/sign-in-2026-10-24.webp',
          alt: 'The Uniwayin public sign-in screen with its brand logo, email and password fields, and sign-in button.',
          caption: 'Public sign-in screen at ums.theuniway.co.in, captured on 24 October 2026. Authenticated CRM screens are not shown.',
          width: 1920,
          height: 958,
        },
      ],
    },
  },
  {
    slug: 'dental-buddy',
    name: 'Dental Buddy',
    logo: clientLogos.dentalbuddy,
    descriptor: 'Dental clinic management software',
    category: 'Healthcare software',
    summary: 'Clinic software bringing patient records, prescriptions, appointments, and billing into one workflow.',
    scope: [
      'Patient records and prescriptions.',
      'Appointment management.',
      'Clinic billing workflows.',
    ],
    technicalNotes: [],
  },
  {
    slug: 'jjc-artworks',
    name: 'JJC Artworks',
    logo: clientLogos.jjcartworks,
    descriptor: 'Website for church interior woodwork',
    category: 'Business website',
    summary: 'A website presenting JJC Artworks’ church interior woodwork and completed projects.',
    scope: [
      'Company and craftsmanship information.',
      'Presentation of completed work.',
      'Contact information for prospective clients.',
    ],
    technicalNotes: [],
    liveUrl: 'https://www.jjcartwork.in/',
    story: {
      need: 'A chapel-interior and woodwork business needs a clear way to explain its services and help prospective customers begin an enquiry. The website brings service information, company background and contact routes into one public experience.',
      approach: 'The homepage introduces the business and links visitors to its work and enquiry routes. The services page breaks the offering into seating, altar furniture, custom woodwork and other service categories, with contextual links to the contact page. Portfolio and gallery navigation provide separate places to explore the presentation of work.',
      workflow: [
        ['Discover', 'Understand the business through its homepage, imagery and company information.'],
        ['Explore services', 'Read individual service descriptions and review the accompanying imagery.'],
        ['Browse', 'Use the portfolio and gallery navigation to explore the website further.'],
        ['Enquire', 'Continue to the public contact page or WhatsApp link to discuss a requirement.'],
      ],
      screenshots: [
        {
          src: '/images/projects/jjc-artworks/homepage-2026-10-24.webp',
          alt: 'JJC website homepage showing its navigation, chapel interior image and links to view work or start an enquiry.',
          caption: 'Public homepage at jjcartwork.in. Captured on 24 October 2026.',
          width: 1905,
          height: 951,
        },
        {
          src: '/images/projects/jjc-artworks/services-2026-10-24.webp',
          alt: 'JJC services page showing chapel seating information, a pew image and an enquiry link, followed by altar furniture content.',
          caption: 'Public services page, framed at the chapel-seating section. Captured on 24 October 2026.',
          width: 1905,
          height: 951,
        },
      ],
    },
  },
];

export function getProjectCase(slug: string) {
  return projectCases.find((project) => project.slug === slug);
}
