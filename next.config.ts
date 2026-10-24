import type { NextConfig } from 'next';
const ownerHost = [{ type: 'host' as const, value: 'owner\\.siliconmotives\\.com' }];
const adminHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'same-origin' },
  { key: 'Cache-Control', value: 'no-store' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
];
const config: NextConfig = {
  poweredByHeader: false,
  // Project covers and portraits are served at 90 for crisp detail; 75 stays the default.
  images: { qualities: [75, 90] },
  async headers() {
    return [
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/admin/:path*', headers: adminHeaders },
      { source: '/:path*', has: ownerHost, headers: adminHeaders },
    ];
  },
  async redirects() {
    return [
      // Retain the old domain while search engines migrate to SiliconMotives.
      ...['devaxistechnologies\\.in', 'www\\.devaxistechnologies\\.in'].map(host => ({
        source: '/:path*', has: [{ type: 'host' as const, value: host }],
        destination: 'https://www.siliconmotives.com/:path*', permanent: true,
      })),
      { source: '/admin/index.html', destination: '/admin', permanent: true },
      { source: '/admin/:path*', has: ownerHost, destination: '/:path*', permanent: false },
      ...['siliconmotives\\.com', 'www\\.siliconmotives\\.com', 'silicon-motives\\.vercel\\.app'].map(host => ({
        source: '/admin/:path*', has: [{ type: 'host' as const, value: host }],
        destination: 'https://owner.siliconmotives.com/:path*', permanent: false,
      })),
    ];
  },
  async rewrites() {
    return { beforeFiles: [{ source: '/', has: ownerHost, destination: '/admin' }] };
  },
};
export default config;
