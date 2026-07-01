import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { brand, contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How this site uses cookies: functional cookies only, no tracking or advertising, and how to manage them.",
};

const LAST_UPDATED = "1 July 2026";
const linkCls = "text-link underline underline-offset-2";

export default function CookiesPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Cookie Policy"
        intro={<p>Last updated: {LAST_UPDATED}</p>}
      />

      <section className="container-content pb-24">
        <div className="max-w-prose space-y-10 text-body text-ink">
          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              1. What are cookies?
            </h2>
            <p className="mt-4">
              Cookies are small text files that a website places on your device
              (computer, tablet, or phone) when you visit it. They help the website
              function, remember your preferences, and in some cases, understand how
              visitors use the site.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              2. What cookies this Site uses
            </h2>
            <p className="mt-4">
              This Site currently uses only functional cookies. These are cookies
              necessary for the Site to work properly.
            </p>
            <p className="mt-4 font-medium text-signature">
              Functional cookies used on this Site:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Session cookies (set by Vercel, the Site&rsquo;s hosting platform):
                used to keep the Site running smoothly, manage traffic, and maintain
                basic security. These are automatically deleted when you close your
                browser.
              </li>
              <li>
                Preference cookies: remember basic settings such as whether you have
                dismissed this cookie notice, so you are not shown it repeatedly.
              </li>
            </ul>
            <p className="mt-4">
              These cookies do not track you across other sites, do not build a profile
              of your browsing behavior, and are not used for advertising.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              3. What cookies this Site does NOT use (currently)
            </h2>
            <p className="mt-4">This Site does not currently use:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Analytics cookies (such as Google Analytics or similar)</li>
              <li>Advertising or targeting cookies</li>
              <li>Social media tracking cookies</li>
              <li>Third-party marketing cookies</li>
            </ul>
            <p className="mt-4">
              If this changes in the future (for example, if analytics are added), this
              Cookie Policy will be updated before any such cookies are enabled, and a
              consent option will be provided for cookies that require it.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              4. How to manage cookies
            </h2>
            <p className="mt-4">
              You can control and delete cookies through your browser settings. Most
              browsers let you:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>See what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific sites</li>
              <li>Block all cookies entirely</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p className="mt-4">
              Note that if you block functional cookies, some parts of the Site may not
              work as expected.
            </p>
            <p className="mt-4 font-medium text-signature">
              Instructions for common browsers:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Chrome cookie settings
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Firefox cookie settings
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Safari cookie settings
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Edge cookie settings
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              5. Third-party cookies
            </h2>
            <p className="mt-4">
              The service providers that support this Site (Vercel for hosting,
              Supabase for the database, GitHub for automation) may set their own
              cookies as part of delivering their services. These are governed by their
              own cookie and privacy policies:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Vercel Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  GitHub Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              6. Changes to this policy
            </h2>
            <p className="mt-4">
              This Cookie Policy may be updated when the Site&rsquo;s cookie use
              changes, for example, when analytics or newsletter tools are added. The
              &ldquo;Last updated&rdquo; date at the top will reflect any change. Where
              a change requires your consent (for example, adding non-functional
              cookies), we will ask for it before those cookies are enabled.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              7. Contact
            </h2>
            <p className="mt-4">For questions about cookies on this Site, contact:</p>
            <p className="mt-4">
              {brand.name}
              <br />
              Email:{" "}
              <a href={`mailto:${contactEmail}`} className={linkCls}>
                {contactEmail}
              </a>
              <br />
              Location: Nigeria
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
