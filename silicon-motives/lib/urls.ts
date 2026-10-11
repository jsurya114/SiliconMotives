export function safeUrl(value: unknown): string {
  return typeof value === 'string' && /^https?:\/\//i.test(value) ? value : '';
}
export function safeImage(value: unknown): string {
  return safeUrl(value) || (typeof value === 'string' && /^\/images\/[A-Za-z0-9._/-]+$/.test(value) && !/(?:^|\/)\.\.(?:\/|$)/.test(value) ? value : '');
}
export const initials = (name: string) => String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
export const pad = (number: number) => String(number).padStart(2, '0');
export function whatsappUrl(number = '918590184265') {
  const phone = /^\d{6,20}$/.test(number) ? number : '918590184265';
  return `https://wa.me/${phone}?text=${encodeURIComponent('Hi Silicon Motives! I have a project in mind and would love to explore how we can bring it to life. Could we discuss the right solution, timeline, and estimate?')}`;
}
