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

/** Where each client is based, as supplied by the site owner. A CMS `location` value is the fallback. */
export const clientLocations: Record<string, string> = {
  nasalogistics: 'Dallas, USA',
  jjcartworks: 'Kottayam, Kerala',
  uniwayin: 'Bangalore, Karnataka',
  picbox: 'Malappuram, Kerala',
  woobe: 'Malappuram, Kerala',
  dentalbuddy: 'Trivandrum, Kerala',
};

const clientKey = (name: unknown) => {
  const key = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return ({ nasalogistic: 'nasalogistics', pickbox: 'picbox', jjc: 'jjcartworks' } as Record<string, string>)[key] || key;
};

export function clientLogo(name: unknown, fallback?: unknown): string {
  return clientLogos[clientKey(name)] || safeImage(fallback);
}

export function clientLocation(name: unknown, fallback?: unknown): string {
  return clientLocations[clientKey(name)] || String(fallback || '').trim();
}
