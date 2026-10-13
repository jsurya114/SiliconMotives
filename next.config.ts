import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  // Project covers and portraits are served at 90 for crisp detail; 75 stays the default.
  images: { qualities: [75, 90] },
  async headers() {
    return [{ source: '/admin/:path*', headers: [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'same-origin' },
      { key: 'Cache-Control', value: 'no-store' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
    ] }];
  },
  async redirects() { return [{ source: '/admin/index.html', destination: '/admin', permanent: true }]; },
};
export default config;
