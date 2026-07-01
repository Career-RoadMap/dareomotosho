import type { Metadata } from "next";
import { fraunces, inter } from "./fonts";
import { brand } from "@/lib/site";
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
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: `${brand.name}, ${brand.byline}`,
    description: brand.oneLine,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
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
