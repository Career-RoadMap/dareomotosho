import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms that govern your access to and use of this site, its content, submissions, and services.",
};

const SITE_URL = "dareomotosho.com";
const LAST_UPDATED = "1 July 2026";

const linkCls = "text-link underline underline-offset-2";

export default function TermsPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Terms and Conditions"
        intro={<p>Last updated: {LAST_UPDATED}</p>}
      />

      <section className="container-content pb-24">
        <div className="max-w-prose space-y-10 text-body text-ink">
          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              1. Agreement to these Terms
            </h2>
            <p className="mt-4">
              Welcome. These Terms and Conditions (&ldquo;Terms&rdquo;) govern your
              access to and use of {SITE_URL} (the &ldquo;Site&rdquo;), operated by
              {" "}
              {SITE_URL} (&ldquo;I,&rdquo; &ldquo;me,&rdquo; &ldquo;we&rdquo;).
            </p>
            <p className="mt-4">
              By accessing or using the Site, you agree to be bound by these Terms. If
              you do not agree, please do not use the Site.
            </p>
            <p className="mt-4">
              I may update these Terms from time to time. The &ldquo;Last updated&rdquo;
              date at the top will reflect the most recent change. Continued use of the
              Site after changes means you accept the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              2. Who may use the Site
            </h2>
            <p className="mt-4">
              You may use the Site if you are at least 13 years old and legally able to
              enter into a binding agreement. If you use the Site on behalf of an
              organization, you confirm you have authority to bind that organization to
              these Terms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              3. What the Site offers
            </h2>
            <p className="mt-4">The Site provides:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Educational content on cloud engineering, cybersecurity, and related
                fields, including case studies, questions and answers, and other
                resources
              </li>
              <li>
                Information about my professional work, speaking engagements, and
                advisory services
              </li>
              <li>Signup for live classes, events, and email updates</li>
              <li>
                A way to submit questions for possible inclusion in the public content
                library
              </li>
            </ul>
            <p className="mt-4">
              All content on the Site is provided for educational and informational
              purposes only. It is not professional advice. See Section 8.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              4. My content: what you can and can&rsquo;t do
            </h2>
            <p className="mt-4">
              The content on this Site, including case studies, written explanations,
              question-and-answer material, articles, images, and design, is owned by
              me or licensed to me, and is protected by copyright and other
              intellectual property laws.
            </p>
            <p className="mt-4 font-medium text-signature">You may:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Read, learn from, and personally use the content on the Site</li>
              <li>Share links to individual pages or resources</li>
              <li>
                Quote short excerpts for commentary, review, or discussion, with clear
                attribution to the Site
              </li>
            </ul>
            <p className="mt-4 font-medium text-signature">You may not:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Republish, redistribute, or repost substantial portions of the content
                on other sites, in publications, in courses, or elsewhere without my
                written permission
              </li>
              <li>Sell, license, or commercialize any of the content</li>
              <li>Modify the content and present it as your own</li>
              <li>
                Use the content to train machine learning models or AI systems without
                my written permission
              </li>
              <li>
                Use automated tools (scrapers, bots) to systematically extract content
                from the Site
              </li>
            </ul>
            <p className="mt-4">
              If you would like to use content in a way not permitted above, including
              using it in your own teaching, training programs, or business, contact
              me. Most reasonable requests receive a &ldquo;yes.&rdquo;
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              5. Questions you submit
            </h2>
            <p className="mt-4">
              If you submit a question or other content through the Site (for example,
              through the question submission feature):
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                You confirm the submission is yours to share and does not infringe
                anyone else&rsquo;s rights
              </li>
              <li>
                You grant me a non-exclusive, worldwide, royalty-free license to
                display, edit for clarity or length, categorize, and keep your
                submission available on the Site as part of the content library
              </li>
              <li>
                You may request removal of your submission at any time by contacting me
              </li>
              <li>
                If you provided your name with the submission, it may be displayed
                publicly alongside your question. If you did not provide a name, your
                submission will remain anonymous
              </li>
              <li>I may decline to publish any submission, at my discretion</li>
            </ul>
            <p className="mt-4">
              You retain ownership of the underlying content you submit; the license
              above is what allows me to publish and maintain it on the Site.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              6. Signups, classes, and events
            </h2>
            <p className="mt-4">
              If you sign up for a live class, event, or email updates:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>You are responsible for the accuracy of the information you provide</li>
              <li>
                Details of live classes and events (schedule, format, availability) may
                change; I will make reasonable effort to communicate changes in advance
              </li>
              <li>
                Free classes and resources are provided as-is, with no guarantee of
                continued availability
              </li>
              <li>
                You may unsubscribe from emails or withdraw from a class at any time;
                contact me or use the unsubscribe link in emails
              </li>
            </ul>
            <p className="mt-4">
              If paid services are offered on the Site in the future, additional terms
              will apply and will be presented at the point of purchase.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              7. Your conduct on the Site
            </h2>
            <p className="mt-4">When using the Site, you agree not to:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Attempt to disrupt or interfere with the Site&rsquo;s operation or security</li>
              <li>Access parts of the Site you are not authorized to access</li>
              <li>Use the Site for unlawful purposes or in violation of applicable law</li>
              <li>
                Submit content that is unlawful, harmful, threatening, defamatory,
                obscene, or infringes anyone else&rsquo;s rights
              </li>
              <li>Impersonate any person or misrepresent your affiliation</li>
              <li>
                Use the Site to spam, harass, or harvest information about other users
              </li>
            </ul>
            <p className="mt-4">
              I reserve the right to remove content, block access, or take other action
              against users who violate these Terms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              8. Disclaimer: educational content only, not professional advice
            </h2>
            <p className="mt-4">
              The content on this Site is provided for educational and informational
              purposes only. It does not constitute professional consulting,
              engineering, legal, financial, or security advice, and should not be
              relied upon as such.
            </p>
            <p className="mt-4">
              Cloud engineering, cybersecurity, and related decisions depend heavily on
              specific context: your systems, your business, your risk profile, your
              compliance obligations. Case studies and Q&amp;A on this Site describe
              scenarios and reasoning for learning purposes; they are not prescriptions
              for any specific real-world decision.
            </p>
            <p className="mt-4">
              Before acting on any information from the Site in a production environment
              or business context, consult a qualified professional who can assess your
              specific situation.
            </p>
            <p className="mt-4">
              If you are interested in direct professional advice, my advisory services
              are separate from the Site&rsquo;s content and are governed by their own
              engagement terms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              9. Limitation of liability
            </h2>
            <p className="mt-4">To the fullest extent permitted by law:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as
                available,&rdquo; without warranties of any kind, express or implied
              </li>
              <li>
                I do not warrant that the Site will be uninterrupted, error-free, or
                free of harmful components
              </li>
              <li>
                I am not liable for any indirect, incidental, special, consequential, or
                punitive damages arising out of your use of, or inability to use, the
                Site or its content
              </li>
              <li>
                I am not liable for any losses resulting from your reliance on Site
                content, including but not limited to system misconfiguration, security
                incidents, financial loss, or business impact
              </li>
            </ul>
            <p className="mt-4">
              Nothing in this section limits liability that cannot lawfully be excluded,
              for example, liability for fraud or for personal injury caused by
              negligence.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              10. Third-party links and services
            </h2>
            <p className="mt-4">
              The Site may link to third-party websites or services (for example,
              external articles, tools, or platforms referenced in content). I am not
              responsible for the content, policies, or practices of any third-party
              site. Following such links is at your own risk.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              11. Suspension and termination
            </h2>
            <p className="mt-4">
              I may suspend or terminate your access to the Site at any time, with or
              without notice, if you violate these Terms or if I discontinue any part of
              the Site.
            </p>
            <p className="mt-4">
              You may stop using the Site at any time. Provisions of these Terms that by
              their nature should survive termination (including Sections 4, 5, 8, 9,
              and 12) will survive.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              12. Governing law and disputes
            </h2>
            <p className="mt-4">
              These Terms are governed by the laws of the Federal Republic of Nigeria,
              without regard to conflict-of-laws principles.
            </p>
            <p className="mt-4">
              Any dispute arising out of or relating to these Terms or the Site will be
              resolved in the competent courts of Nigeria, unless applicable consumer
              protection laws in your jurisdiction require otherwise.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h2 font-light text-signature">
              13. Contact
            </h2>
            <p className="mt-4">
              For questions about these Terms, or to request permission for uses of
              content not permitted under Section 4, contact:
            </p>
            <p className="mt-4">
              {SITE_URL}
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
