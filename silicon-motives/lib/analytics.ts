// GA4 measurement ID (public by design; it is visible in page source). Override with NEXT_PUBLIC_GA_ID,
// or set NEXT_PUBLIC_GA_ID to an empty value to turn analytics off. Invalid values disable it.
const DEFAULT_GA_ID = 'G-NZF61Y4YB0';
const rawId = process.env.NEXT_PUBLIC_GA_ID ?? DEFAULT_GA_ID;
export const GA_ID = /^G-[A-Z0-9]{4,}$/.test(rawId) ? rawId : '';

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/** Send a GA4 event. Safe to call when analytics is disabled or blocked. */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  try { (window as GtagWindow).gtag?.('event', name, params); } catch { /* analytics must never break the page */ }
}
