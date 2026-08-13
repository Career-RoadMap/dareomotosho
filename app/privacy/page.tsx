import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { privacyEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How this site collects, uses, and protects your personal information, under the NDPR and, where applicable, the GDPR.",
};

const SITE_URL = "dareomotosho.com";
const LAST_UPDATED = "12 August 2026";

const linkCls = "text-link underline underline-offset-2";
/** Inline cookie / storage key names. */
const codeCls =
  "rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-signature";

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
              This Privacy Policy explains how {SITE_URL} (the &ldquo;Site&rdquo;, and
              &ldquo;the Site operator&rdquo;) collects, uses, and protects your
              personal information when you visit it.
            </p>
            <p className="mt-4">
              The Site operator is based in Nigeria. This policy is written to reflect the Nigeria
              Data Protection Regulation (NDPR) and, where applicable, the EU General
              Data Protection Regulation (GDPR) for visitors from the European Union
              and United Kingdom.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              2. What information the Site collects
            </h2>
            <p className="mt-4">
              Only what&rsquo;s needed to run the Site and communicate with
              people who choose to engage with it.
            </p>
            <p className="mt-4 font-medium text-signature">
              Information you provide directly:
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
              <li>
                Comments and reactions &mdash; if you comment on a library entry.
                Providing a name is optional; comments are held for review before
                they appear publicly.
              </li>
              <li>
                Inquiry and booking details &mdash; name, email, and message content
                when you send an advisory, speaking, or contact inquiry, or book a
                call through the scheduling link.
              </li>
              <li>
                Email address &mdash; when you open The Field Kit (the free
                one-page tool that ships with each episode). This is the{" "}
                <strong>same list</strong> as the Site&rsquo;s Subscribe form, not
                a separate one, so unlocking a kit and subscribing put you in
                exactly one place. Entering an address that is already on the list
                adds nothing and sends no further confirmation email.
              </li>
            </ul>
            <p className="mt-4">
              The Field Kit unlock records only your email address. It does not
              record which kits you opened, which you downloaded, or when.
            </p>
            <p className="mt-4">
              The Career Path Finder is different by design: your answers are
              processed entirely in your browser and are never transmitted to or
              stored on the Site&rsquo;s systems. Sharing or downloading a result shares only the
              resulting role page, not your answers.
            </p>
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
                operation. It sets two of its own:{" "}
                <code className={codeCls}>cookie_consent</code> (your choice on
                the cookie notice) and{" "}
                <code className={codeCls}>resources_unlocked</code> (set only
                after you choose to unlock The Field Kit, so you are not asked
                again). Neither contains your email address or any other personal
                detail. The Site does not currently use tracking or advertising cookies.
                The{" "}
                <a href="/cookies" className={linkCls}>
                  Cookie Policy
                </a>{" "}
                lists both in full, along with the two matching local-storage
                items.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              3. How your information is used
            </h2>
            <p className="mt-4">Your information is used only for these purposes:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>To send you updates, resources, or newsletters you signed up for</li>
              <li>
                To open The Field Kit for you and keep it open, and to send one
                confirmation email after your first unlock telling you what you
                signed up for and how to get back to the kits. That confirmation
                is sent once per address, not once per kit
              </li>
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
              Personal information is never sold, and never shared with third
              parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              4. Third parties that process your data
            </h2>
            <p className="mt-4">
              To operate the Site, these service providers process data on the Site
              operator&rsquo;s behalf:
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
                Supabase &mdash; database storage for signups (including Field
                Kit unlocks) and content library entries.{" "}
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
              <li>
                Resend &mdash; delivers advisory, speaking, and contact form
                submissions to the Site operator&rsquo;s inbox, emailed results you request, the Field
                Kit confirmation email, and the subscriber list, which is held as
                a Resend audience (processes the name, email, and message you
                send).{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Resend Privacy Policy
                </a>
              </li>
              <li>
                Calendly &mdash; appointment scheduling when you book a call
                (processes the details you enter on Calendly&rsquo;s booking page).{" "}
                <a
                  href="https://calendly.com/legal/privacy-notice"
                  target="_blank"
                  rel="noreferrer"
                  className={linkCls}
                >
                  Calendly Privacy Notice
                </a>
              </li>
            </ul>
            <p className="mt-4">
              These providers are contractually required to protect your data and use
              it only for the services they provide to the Site.
            </p>
            <p className="mt-4">
              Additional providers may be added in future &mdash; for example, an
              email newsletter service or a website analytics service. This policy
              will be updated to list them before they begin to be used.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              5. How long information is kept
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Email and name (signups, including Field Kit unlocks): kept for as
                long as you remain subscribed. You may unsubscribe at any time
                (see Section 8). Unsubscribing removes you from the mailing list;
                on request the stored record is deleted as well.
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
              6. How your information is protected
            </h2>
            <p className="mt-4">
              Your data is stored with reputable service providers (Vercel, Supabase)
              who apply industry-standard security measures, including encryption in
              transit and at rest. Access to your data is restricted to the Site operator and to the
              automated systems required to operate the Site.
            </p>
            <p className="mt-4">
              No system is 100% secure. If a data breach occurs that affects your
              personal information, affected users and the relevant
              authorities will be notified as required by applicable law.
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
              <li>Access &mdash; request a copy of the personal information held about you</li>
              <li>Correction &mdash; request that inaccurate information be corrected</li>
              <li>Deletion &mdash; request deletion of your personal information</li>
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
              To exercise any of these rights, get in touch using the details in Section
              11.
            </p>
            <p className="mt-4">
              To unsubscribe from emails, use the unsubscribe link in any email sent
              from the Site, or use the contact details in Section 11.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              9. Children
            </h2>
            <p className="mt-4">
              The Site is not directed at children under 13, and does not knowingly
              collect personal information from children under 13. If you believe a
              child has provided personal information through the Site, get in touch
              using Section 11 and it will be deleted.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              10. Changes to this policy
            </h2>
            <p className="mt-4">
              This Privacy Policy may be updated from time to time &mdash; for example,
              when a new service provider or a new Site feature affects data
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
