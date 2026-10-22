export type ProjectCase = {
  slug: string;
  name: string;
  descriptor: string;
  category: string;
  summary: string;
  scope: string[];
  technicalNotes: string[];
};

// Public copy is limited to product scope documented in the project records.
// Dates, contributor roles, metrics, and security claims need client-approved
// evidence before they can be published.
export const projectCases: ProjectCase[] = [
  {
    slug: 'woobe',
    name: 'Woobe',
    descriptor: 'Weight-based commerce',
    category: 'Commerce',
    summary: 'A commerce storefront designed for products priced by weight.',
    scope: [
      'Product prices shown per kilogram (₹/kg).',
      'Weight-based product selection.',
      'Checkout options include Razorpay and cash on delivery.',
    ],
    technicalNotes: ['Cloud infrastructure: AWS.'],
  },
  {
    slug: 'nasalogistics',
    name: 'NasaLogistics',
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
    descriptor: 'Event-rental inventory & invoicing',
    category: 'Business software',
    summary: 'An inventory and invoicing system for an event-rental business.',
    scope: [
      'Rental inventory and job records.',
      'Wage tracking for event work.',
      'PDF invoice generation.',
    ],
    technicalNotes: [],
  },
  {
    slug: 'uniwayin',
    name: 'Uniwayin',
    descriptor: 'Education consultancy CRM',
    category: 'Business software',
    summary: 'A CRM for education consultancy lead and follow-up workflows.',
    scope: [
      'Lead records and follow-up tracking.',
      'Notes and analytics for consultancy workflows.',
      'Role-based access for staff.',
    ],
    technicalNotes: [],
  },
  {
    slug: 'dental-buddy',
    name: 'Dental Buddy',
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
    descriptor: 'Website for church interior woodwork',
    category: 'Business website',
    summary: 'A website presenting JJC Artworks’ church interior woodwork and completed projects.',
    scope: [
      'Company and craftsmanship information.',
      'Presentation of completed work.',
      'Contact information for prospective clients.',
    ],
    technicalNotes: [],
  },
];

export function getProjectCase(slug: string) {
  return projectCases.find((project) => project.slug === slug);
}
