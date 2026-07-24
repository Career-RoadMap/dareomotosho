import Link from "next/link";
import { brand, nav, social } from "@/lib/site";
import EmailCapture from "./EmailCapture";

/**
 * Footer: the anchor weight of the page. Deep Signature Blue with Paper text.
 * Carries the social-feed area (YouTube primary, wire feeds at integration
 * time), a persistent email capture, and the Tier-1 byline.
 */
export default function Footer() {
  return (
    <footer className="mt-20 bg-signature text-paper print:hidden">
      <div className="container-content grid gap-6 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* Email capture + byline */}
        <div>
          <EmailCapture
            tone="dark"
            compact
            label="Stay close to the work."
            hint="The newest resource, the next live class, the latest episode, quietly."
          />
          <p className="kicker mt-4 text-paper/55">{brand.byline}</p>
        </div>

        {/* Social feed area (YouTube primary) + sitemap */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="kicker text-paper/55">Follow the build</h2>
            <ul className="mt-3 space-y-1.5 text-small">
              <li>
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="link-quiet !text-paper"
                >
                  YouTube
                </a>
              </li>
              {/* Hidden until the real handle replaces the placeholder in lib/site. */}
              {!social.x.includes("your-handle") ? (
                <li>
                  <a
                    href={social.x}
                    target="_blank"
                    rel="noreferrer"
                    className="link-quiet !text-paper"
                  >
                    X / Twitter
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="link-quiet !text-paper"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="/feed.xml" className="link-quiet !text-paper">
                  RSS feed
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="kicker text-paper/55">Explore</h2>
            <ul className="mt-3 space-y-1.5 text-small">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-amber !text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-content flex flex-col gap-2 py-3 text-small text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="link-amber !text-paper/70">
              Privacy
            </Link>
            <Link href="/terms" className="link-amber !text-paper/70">
              Terms
            </Link>
            <Link href="/cookies" className="link-amber !text-paper/70">
              Cookies
            </Link>
            <p className="text-xs text-paper/40">{brand.oneLine}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
