import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';
import { ClickTracking } from './ClickTracking';

/** Renders nothing when GA_ID is empty (see lib/analytics.ts). */
export function Analytics() {
  if (!GA_ID) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');` }} />
    <ClickTracking />
  </>;
}
