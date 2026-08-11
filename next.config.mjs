const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy for the Next.js app itself.
 * 'unsafe-inline' in script-src is required by Next's inline hydration
 * payloads (a nonce-based CSP needs middleware; revisit if that lands).
 * 'unsafe-eval' is dev-only, for React Refresh.
 */
const appCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.ytimg.com",
  "font-src 'self'",
  // Supabase REST + realtime websocket; forms and email relay stay same-origin.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Looser policy scoped to the static tools under /tools (the salary
 * explorer), which legitimately load Tailwind's CDN, lucide from unpkg, and
 * Google Fonts, and use inline onclick handlers.
 */
const toolsCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const sharedHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Isolates this site's browsing context from cross-origin openers
  // (mitigates tab-nabbing / cross-window attacks).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Episode resources are read from disk at render time (lib/resources.ts).
  // Make sure the markdown files travel with the serverless output for every
  // route that reads them, so ISR re-renders and the content API keep
  // working after deploy — this is what keeps the RESOURCES-CONTRACT
  // "drop a file in, page exists" guarantee true in production.
  outputFileTracingIncludes: {
    "/resources": ["./contents/resources/**/*"],
    "/resources/[slug]": ["./contents/resources/**/*"],
    "/api/resources/[slug]": ["./contents/resources/**/*"],
    "/sitemap.xml": ["./contents/resources/**/*"],
  },
  async headers() {
    return [
      {
        // Everything except /tools/* gets the strict app CSP.
        source: "/((?!tools/).*)",
        headers: [
          ...sharedHeaders,
          { key: "Content-Security-Policy", value: appCsp },
        ],
      },
      {
        source: "/tools/:path*",
        headers: [
          ...sharedHeaders,
          { key: "Content-Security-Policy", value: toolsCsp },
        ],
      },
      {
        // API responses are not pages; keep them out of search indexes.
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Static artwork changes rarely; let browsers keep it for a day and
        // serve stale for a week while revalidating in the background.
        source: "/:dir(banners|portraits)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
