import type { Metadata, Viewport } from "next";
import { fraunces, inter } from "./fonts";
import { brand, siteUrl, social } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${brand.name}, ${brand.byline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.oneLine,
  metadataBase: new URL(siteUrl),
  alternates: {
    // "./" resolves against the current route, so every page gets a correct
    // self-referencing canonical without repeating it per page.
    canonical: "./",
    types: { "application/rss+xml": `${siteUrl}/feed.xml` },
  },
  openGraph: {
    title: `${brand.name}, ${brand.byline}`,
    description: brand.oneLine,
    type: "website",
    siteName: brand.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name}, ${brand.byline}`,
    description: brand.oneLine,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5F0",
};

// Person + WebSite structured data for rich search results.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: brand.name,
      url: siteUrl,
      image: `${siteUrl}/portraits/dare.jpg`,
      jobTitle:
        "Technical mentor, cloud engineer, cybersecurity engineer, solutions architect, and AI architect",
      description: brand.oneLine,
      // Only real profiles; the X handle is still a placeholder in lib/site.
      sameAs: Object.values(social).filter((u) => !u.includes("your-handle")),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: brand.name,
      description: brand.oneLine,
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

// Warm up the TLS handshake for the origins the client talks to right after
// hydration: Supabase (realtime questions/reactions) and YouTube thumbnails.
const supabaseOrigin = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
})();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {supabaseOrigin ? (
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        ) : null}
        <link rel="preconnect" href="https://i.ytimg.com" />
        <script
          type="application/ld+json"
          // Static, build-time JSON built entirely from lib/site constants.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signature focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
