'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Records phone, email and WhatsApp link clicks as GA4 events (only mounted when analytics is enabled). */
export function ClickTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]');
      const href = link?.getAttribute('href') ?? '';
      if (href.startsWith('tel:')) trackEvent('phone_click', { page_path: location.pathname });
      else if (href.startsWith('mailto:')) trackEvent('email_click', { page_path: location.pathname });
      else if (/^https:\/\/wa\.me\//.test(href)) trackEvent('whatsapp_click', { page_path: location.pathname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
