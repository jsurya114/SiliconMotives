export type ProjectCase = {
  slug: string;
  name: string;
  descriptor: string;
  category: string;
  summary: string;
  scope: string[];
  technicalNotes: string[];
};

// Public copy is deliberately limited to product scope documented in the
// project records. Dates, contributor roles, metrics, and security claims need
// client-approved evidence before they can be published.
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
];

export function getProjectCase(slug: string) {
  return projectCases.find((project) => project.slug === slug);
}
