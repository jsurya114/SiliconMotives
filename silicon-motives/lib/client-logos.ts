import { safeImage } from './urls';

/** Current site assets take precedence over older logo URLs stored in the CMS. */
export const clientLogos: Record<string, string> = {
  woobe: '/brand/logos/png/Woobe_logo_no_crown.svg',
  nasalogistics: '/brand/logos/png/nasa-transparent.png',
  picbox: '/brand/logos/png/pickbox.png',
  uniwayin: '/brand/logos/png/Uniway.png',
  dentalbuddy: '/images/client-logos/dental-buddy.svg',
  jjcartworks: '/images/client-logos/jjc-artworks.svg',
};

export function clientLogo(name: unknown, fallback?: unknown): string {
  const key = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return clientLogos[key === 'nasalogistic' ? 'nasalogistics' : key] || safeImage(fallback);
}
