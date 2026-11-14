// GA4 is optional. Nothing loads unless NEXT_PUBLIC_GA_ID is set to a valid "G-XXXXXXXX" measurement ID.
const rawId = process.env.NEXT_PUBLIC_GA_ID ?? '';
export const GA_ID = /^G-[A-Z0-9]{4,}$/.test(rawId) ? rawId : '';

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/** Send a GA4 event. Safe to call when analytics is disabled or blocked. */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  try { (window as GtagWindow).gtag?.('event', name, params); } catch { /* analytics must never break the page */ }
}
