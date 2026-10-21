export type Row = Record<string, any>;
export type Field = { name: string; label: string; type: string; required?: boolean; max?: number; help?: string; pattern?: string; allowLocal?: boolean };
export type Collection = { label: string; singular: string; intro: string; title: (row: Row) => string; subtitle: (row: Row) => string; image?: string; fields: Field[]; defaults: Row };
export const collections: Record<string, Collection> = {
  services: {
    label: 'Services',
    singular: 'service',
    intro: 'The three core capability cards in “What we do”. Order here is the order on the site.',
    title: (row) => row.title,
    subtitle: (row) => row.kicker,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 80 },
      { name: 'kicker', label: 'Small label', type: 'text', max: 40, help: 'Shown above the title, e.g. PRODUCT BUILD.' },
      { name: 'description', label: 'Description', type: 'textarea', max: 400 },
    ],
    defaults: { published: true },
  },
  team_members: {
    label: 'Team',
    singular: 'team member',
    intro: 'People shown in “The people behind the purpose”. The first person gets the featured card.',
    title: (row) => row.name,
    subtitle: (row) => row.role,
    image: 'photo_url',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, max: 80 },
      { name: 'role', label: 'Role', type: 'text', max: 80, help: 'e.g. Co-founder' },
      { name: 'kicker', label: 'Small label', type: 'text', max: 40, help: 'e.g. FOUNDER 01. Leave empty to use TEAM 01, TEAM 02…' },
      { name: 'photo_url', label: 'Photo', type: 'image', allowLocal: true, help: 'Upload a portrait or use a local /images/ path. Jasil and Jayasoorya use their default portraits when empty; other team members show initials.' },
    ],
    defaults: { published: true },
  },
  projects: {
    label: 'Portfolio',
    singular: 'project',
    intro: 'Published projects appear on the public site in this order. Use the published toggle to control visibility.',
    title: (row) => row.title,
    subtitle: (row) => row.category,
    image: 'image_url',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 100 },
      { name: 'category', label: 'Category', type: 'text', max: 60, help: 'e.g. Custom software' },
      { name: 'description', label: 'Description', type: 'textarea', max: 500 },
      { name: 'image_url', label: 'Cover image', type: 'image', allowLocal: true, help: 'Landscape, around 1200 × 800. Local /images/ paths are supported.' },
      { name: 'image_alt', label: 'Image description', type: 'text', max: 200, help: 'Describes the image for screen readers.' },
      { name: 'project_url', label: 'Project reference link', type: 'url', help: 'Optional admin reference. Project cards do not show an external link.' },
    ],
    defaults: { published: false, tags: [] },
  },
  clients: {
    label: 'Clients',
    singular: 'client',
    intro: 'Published logos appear in “Our clients”. Add a client-approved logo or use a custom wordmark asset.',
    title: (row) => row.name,
    subtitle: (row) => row.website_url,
    image: 'logo_url',
    fields: [
      { name: 'name', label: 'Client name', type: 'text', required: true, max: 80 },
      { name: 'logo_url', label: 'Logo', type: 'image', help: 'Transparent PNG or SVG. Without a logo, the name is shown.' },
      { name: 'website_url', label: 'Website', type: 'url' },
    ],
    defaults: { published: false },
  },
  testimonials: {
    label: 'Testimonials',
    singular: 'testimonial',
    intro: 'Client quotes. Only publish feedback the client has agreed to share.',
    title: (row) => row.author_name,
    subtitle: (row) => row.quote,
    image: 'avatar_url',
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea', required: true, max: 800, help: 'Suggested wording is a draft. Confirm it with the named client before publishing.' },
      { name: 'author_name', label: 'Name', type: 'text', required: true, max: 80 },
      { name: 'author_role', label: 'Role', type: 'text', max: 80 },
      { name: 'company', label: 'Company', type: 'text', max: 80 },
      { name: 'avatar_url', label: 'Photo', type: 'image' },
    ],
    defaults: { published: false },
  },
  faqs: {
    label: 'FAQs',
    singular: 'question',
    intro: 'Questions in “Before we get started”.',
    title: (row) => row.question,
    subtitle: (row) => row.answer,
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true, max: 200 },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true, max: 1500 },
    ],
    defaults: { published: true },
  },
};

export const settingsFields: Field[] = [
  { name: 'contact_phone', label: 'Phone', type: 'tel', max: 40 },
  { name: 'whatsapp_number', label: 'WhatsApp number', type: 'text', max: 20, help: 'Digits only, with country code, e.g. 919876543210.', pattern: '[0-9]*' },
  { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
  { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
];
