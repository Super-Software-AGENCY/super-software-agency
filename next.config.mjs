/** @type {import('next').NextConfig} */

// The admin panel, the team login and the whole payout ledger live behind these
// routes. Without these headers a page on another site could frame the admin
// screen and trick a click into something the admin never meant to do, and the
// site could be used to sniff out which browser or plugin the visitor has.
const securityHeaders = [
  // Clickjacking. deny rather than sameorigin: nothing legitimate frames us.
  { key: 'X-Frame-Options', value: 'DENY' },
  // The modern equivalent, for browsers that ignore X-Frame-Options.
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  // Stops a browser second-guessing a text/javascript response and running it.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Only ever talk over HTTPS once the browser knows the site is secure.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Do not hand out the full URL to other sites. The admin and team paths carry
  // ids in them, which is exactly the sort of thing that should not leak out.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Geolocation, camera, microphone and payment access are all unused.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Save people an hour of confusion.
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
