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
  // Supabase REST + realtime websocket, and the FormSubmit inquiry relay.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://formsubmit.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formsubmit.co",
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
    ];
  },
};

export default nextConfig;
