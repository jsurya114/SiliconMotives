export const CONTENT_TYPES = {
  projects: { label: 'Projects', singular: 'project', title: 'Project name', description: 'Show the products and systems you build.', fields: [
    { key: 'summary', label: 'Short description', type: 'textarea', required: true, max: 600 },
    { key: 'category', label: 'Category', required: true, max: 80 },
    { key: 'image_url', label: 'Project image', type: 'image', max: 2048 },
    { key: 'link_url', label: 'Project website (optional)', type: 'url', max: 2048 },
    { key: 'tags', label: 'Tags, separated by commas', max: 200 },
  ] },
  clients: { label: 'Clients', singular: 'client', title: 'Client name', description: 'Manage the clients displayed on your website.', fields: [
    { key: 'image_url', label: 'Client logo', type: 'image', max: 2048 },
    { key: 'link_url', label: 'Client website (optional)', type: 'url', max: 2048 },
  ] },
  testimonials: { label: 'Testimonials', singular: 'testimonial', title: 'Client name', description: 'Publish feedback with your clients’ permission.', fields: [
    { key: 'quote', label: 'Client feedback', type: 'textarea', required: true, max: 2000 },
    { key: 'role', label: 'Role (optional)', max: 100 },
    { key: 'company', label: 'Company', required: true, max: 120 },
    { key: 'image_url', label: 'Client photo (optional)', type: 'image', max: 2048 },
  ] },
  faqs: { label: 'FAQs', singular: 'FAQ', title: 'Question', description: 'Keep answers to common questions up to date.', fields: [
    { key: 'answer', label: 'Answer', type: 'textarea', required: true, max: 4000 },
  ] },
};
export function safeUrl(value) {
  if (!value) return '';
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; }
  catch { return ''; }
}
export function validateContent(input) {
  if (!input || typeof input !== 'object' || !Object.hasOwn(CONTENT_TYPES, input.kind)) throw new Error('Choose a valid content type.');
  const model = CONTENT_TYPES[input.kind];
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (!title || title.length > 180) throw new Error(`${model.title} must be between 1 and 180 characters.`);
  if (typeof input.published !== 'boolean') throw new Error('Choose draft or published.');
  if (!Number.isInteger(input.sort_order) || input.sort_order < 0 || input.sort_order > 9999) throw new Error('Display order must be a whole number between 0 and 9999.');
  const data = {};
  for (const field of model.fields) {
    const value = input.data?.[field.key] ?? '';
    if (typeof value !== 'string') throw new Error(`${field.label} must be text.`);
    const text = value.trim();
    if (field.required && !text) throw new Error(`${field.label} is required.`);
    if (text.length > field.max) throw new Error(`${field.label} is too long (maximum ${field.max} characters).`);
    if (['url', 'image'].includes(field.type) && text && !safeUrl(text)) throw new Error(`${field.label} must be a full HTTPS URL.`);
    data[field.key] = text;
  }
  return { kind: input.kind, title, data, published: input.published, sort_order: input.sort_order };
}
