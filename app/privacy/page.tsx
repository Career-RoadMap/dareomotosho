import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { privacyEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How this site collects, uses, and protects your personal information, under the NDPR and, where applicable, the GDPR.",
};

const SITE_URL = "dareomotosho.com";
const LAST_UPDATED = "1 July 2026";

const linkCls = "text-link underline underline-offset-2";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Privacy Policy"
        intro={<p>Last updated: {LAST_UPDATED}</p>}
      />

      <section className="container-content pb-24">
        <div className="max-w-prose space-y-10 text-body text-ink">
          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              1. Who this policy is from
            </h2>
            <p className="mt-4">
              This Privacy Policy explains how {SITE_URL} (&ldquo;I,&rdquo;
              &ldquo;me,&rdquo; &ldquo;we&rdquo;) collects, uses, and protects your
              personal information when you visit {SITE_URL} (the &ldquo;Site&rdquo;).
            </p>
            <p className="mt-4">
              I am based in Nigeria. This policy is written to reflect the Nigeria
              Data Protection Regulation (NDPR) and, where applicable, the EU General
              Data Protection Regulation (GDPR) for visitors from the European Union
              and United Kingdom.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              2. What information I collect
            </h2>
            <p className="mt-4">
              I collect only what&rsquo;s needed to run the Site and communicate with
              people who choose to engage with it.
            </p>
            <p className="mt-4 font-medium text-signature">
              Information you give me directly:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Name and email address &mdash; when you sign up for updates, register
                for a live class or event, or submit a question through the Site.
              </li>
              <li>
                Question content &mdash; if you submit a question through the
                Site&rsquo;s question feature. Providing your name with your question
                is optional; you may submit anonymously.
              </li>
            </ul>
            <p className="mt-4 font-medium text-signature">
              Information collected automatically:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Basic technical data &mdash; IP address, browser type, device type,
                pages visited, and time spent on pages. This is collected through
                standard hosting logs (Vercel) and is used to keep the Site running
                and secure.
              </li>
              <li>
                Cookies &mdash; the Site uses functional cookies necessary for basic
                operation (e.g., session management by the hosting platform). I do not
                currently use tracking or advertising cookies.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              3. How I use your information
            </h2>
            <p className="mt-4">I use your information only for these purposes:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>To send you updates, resources, or newsletters you signed up for</li>
              <li>To confirm and manage your registration for live classes or events</li>
              <li>To respond to questions you submit</li>
              <li>
                To display your submitted question in the Site&rsquo;s public content
                library &mdash; with your name only if you chose to provide it
              </li>
              <li>To maintain, secure, and improve the Site</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-4">
              I do not sell your personal information. I do not share it with third
              parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              4. Third parties that process your data
            </h2>
            <p className="mt-4">
              To operate the Site, I use these service providers, who process data on
              my behalf:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Vercel &mdash; website hosting (processes traffic and hosting logs).{" "}
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
                Supabase &mdash; database storage for signups and content library
                entries.{" "}
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
                GitHub &mdash; code repository and automation (processes content during
                publishing workflows).{" "}
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
            <p className="mt-4">
              These providers are contractually required to protect your data and use
              it only for the services they provide to the Site.
            </p>
            <p className="mt-4">
              I may add additional providers in the future &mdash; for example, an
              email newsletter service or a website analytics service. When I do, I
              will update this policy and list them here before beginning to use them.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              5. How long I keep your information
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Email and name (signups): kept for as long as you remain subscribed.
                You may unsubscribe at any time (see Section 8).
              </li>
              <li>
                Class/event registration data: kept for the duration needed to run the
                class, plus a reasonable period afterward for follow-up and
                record-keeping.
              </li>
              <li>
                Submitted questions: kept as long as the content library is active,
                unless you request removal.
              </li>
              <li>
                Technical/hosting logs: kept in line with Vercel&rsquo;s standard
                retention (typically no more than 30 days for detailed logs).
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              6. How I protect your information
            </h2>
            <p className="mt-4">
              Your data is stored with reputable service providers (Vercel, Supabase)
              who apply industry-standard security measures, including encryption in
              transit and at rest. Access to your data is restricted to me and to the
              automated systems required to operate the Site.
            </p>
            <p className="mt-4">
              No system is 100% secure. If a data breach occurs that affects your
              personal information, I will notify affected users and relevant
              authorities as required by applicable law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              7. International data transfers
            </h2>
            <p className="mt-4">
              The service providers listed above (Vercel, Supabase, GitHub) may store
              or process data outside Nigeria, including in the United States and the
              European Union. These providers commit to safeguards for international
              data transfers under their own policies.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              8. Your rights
            </h2>
            <p className="mt-4">
              Depending on where you live, you have the following rights regarding your
              personal data:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Access &mdash; request a copy of the personal information I hold about you</li>
              <li>Correction &mdash; ask me to correct inaccurate information</li>
              <li>Deletion &mdash; ask me to delete your personal information</li>
              <li>
                Withdraw consent &mdash; unsubscribe from emails or withdraw consent
                for optional processing at any time
              </li>
              <li>Object &mdash; object to certain uses of your data</li>
              <li>
                Portability &mdash; receive your data in a portable format (where
                applicable under GDPR)
              </li>
              <li>
                Complain &mdash; lodge a complaint with a data protection authority (in
                Nigeria, the Nigeria Data Protection Commission; in the EU/UK, your
                local authority)
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact me using the details in Section
              11.
            </p>
            <p className="mt-4">
              To unsubscribe from emails, use the unsubscribe link in any email I send
              you, or contact me directly.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              9. Children
            </h2>
            <p className="mt-4">
              The Site is not directed at children under 13, and I do not knowingly
              collect personal information from children under 13. If you believe a
              child has provided personal information through the Site, contact me and I
              will delete it.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              10. Changes to this policy
            </h2>
            <p className="mt-4">
              I may update this Privacy Policy from time to time &mdash; for example,
              when I add a new service provider or a new Site feature that affects data
              handling. The &ldquo;Last updated&rdquo; date at the top will reflect the
              most recent change. Material changes will be communicated through the Site
              or by email where appropriate.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              11. Contact
            </h2>
            <p className="mt-4">
              For any privacy-related question, request, or concern, contact:
            </p>
            <p className="mt-4">
              {SITE_URL}
              <br />
              Email:{" "}
              <a href={`mailto:${privacyEmail}`} className={linkCls}>
                {privacyEmail}
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
