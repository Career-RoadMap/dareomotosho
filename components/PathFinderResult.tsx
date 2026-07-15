"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";
import { resultDisclaimer, type Temperament, type Track } from "@/lib/pathfinder";
import { siteUrl } from "@/lib/site";

/**
 * The Path Finder result view: the verdict, salary band, roadmap, first
 * project, reading list, and the two share options (download the result card
 * as an image, or share the result link on X / LinkedIn). Used both inline
 * after the quiz and on the standalone /path-finder/<track> result page.
 *
 * `shared` renders the "this is someone's result, take it yourself" framing
 * for visitors who arrive via a shared link rather than finishing the quiz.
 */
export default function PathFinderResult({
  track,
  pacing = null,
  temperament = null,
  shared = false,
  onRestart,
}: {
  track: Track;
  pacing?: string | null;
  temperament?: Temperament | null;
  shared?: boolean;
  onRestart?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [emailAddr, setEmailAddr] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const resultPath = `/path-finder/${track.id}`;

  function buildEmailBody() {
    const lines: string[] = [];
    lines.push(`YOUR CLOUD CAREER PATH: ${track.title.toUpperCase()}`);
    lines.push("");
    lines.push(track.tagline);
    lines.push("");
    lines.push(track.whyItFits);
    if (temperament) {
      lines.push("");
      lines.push(`TEMPERAMENT LEANING: ${temperament.code} · ${temperament.family.name}`);
      lines.push(temperament.family.blurb);
    }
    lines.push("");
    lines.push("SALARY REFERENCE");
    track.salary.forEach((s) => {
      lines.push(`  ${s.level}: ${s.usd}  (${s.ngn} Nigeria)`);
    });
    lines.push("");
    lines.push("YOUR ROADMAP, IN ORDER");
    if (pacing) lines.push(pacing);
    lines.push("");
    track.roadmap.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.step}`);
      lines.push(`   ${r.body}`);
      lines.push("");
    });
    lines.push(`Certifications worth holding: ${track.certifications.join(" · ")}`);
    lines.push("");
    lines.push("BUILD THIS FIRST");
    lines.push(track.firstProject);
    lines.push("");
    lines.push("READ THESE, IN ORDER");
    track.resources.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.label}`);
      lines.push(`   ${siteUrl}${r.href.startsWith("/") ? r.href : `/${r.href}`}`);
    });
    lines.push("");
    lines.push(`Your result page: ${siteUrl}${resultPath}`);
    lines.push("");
    lines.push("—");
    lines.push("Educational reference only. Not professional, career, or financial advice.");
    lines.push("dareomotosho.com");
    return lines.join("\n");
  }

  async function sendToEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!emailAddr || emailStatus === "sending") return;
    setEmailStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/dare@dareomotosho.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: emailAddr,
          _cc: emailAddr,
          _subject: `Your cloud career path: ${track.title}`,
          _captcha: "false",
          message: buildEmailBody(),
        }),
      });
      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setEmailStatus("sent");
        setEmailAddr("");
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  }

  async function download() {
    if (downloading) return;
    setDownloading(true);
    try {
      // The result card IS the page's Open Graph image, so the download and
      // the social preview are guaranteed to match.
      const res = await fetch(`${resultPath}/opengraph-image`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cloud-career-path-${track.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Non-fatal: leave the share buttons as the fallback path.
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="animate-fade-up">
      {/* The verdict. */}
      <div className="rounded-3xl bg-ink p-8 text-paper sm:p-12">
        <p className="kicker text-amber">
          {shared ? "A cloud career path" : "Your path"}
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-h1 font-light leading-tight text-paper">
          {track.title}
        </h2>
        <p className="mt-4 max-w-2xl text-body text-paper/75">{track.tagline}</p>
        <p className="mt-6 max-w-2xl text-body text-paper/90">{track.whyItFits}</p>

        {temperament ? (
          <div className="mt-6 inline-flex max-w-2xl flex-wrap items-center gap-3 rounded-xl bg-paper/10 px-4 py-3">
            <span className="kicker text-amber">Temperament leaning</span>
            <span className="font-serif text-lg font-medium text-paper">
              {temperament.code} · {temperament.family.name}
            </span>
            <span className="text-small text-paper/70">{temperament.family.blurb}</span>
          </div>
        ) : null}

        {/* Two options: download the result image, or share the link. */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-amber px-5 py-2.5 text-small font-medium text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] disabled:opacity-60"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M10 2a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 10.586V3a1 1 0 0 1 1-1zM4 15a1 1 0 0 1 1 1h10a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2 1 1 0 0 1 1-1z" />
            </svg>
            {downloading ? "Preparing…" : "Download result"}
          </button>

          <span className="inline-flex items-center gap-1 rounded-lg bg-paper/10 px-3 py-2">
            <span className="pr-1 text-small text-paper/70">Share</span>
            <span className="[&_button]:text-paper/80 [&_button:hover]:bg-paper/10 [&_button:hover]:text-amber">
              <ShareButtons
                path={resultPath}
                title={`My cloud career path: ${track.title}. Find yours in 2 minutes.`}
              />
            </span>
          </span>

          {onRestart ? (
            <button
              type="button"
              onClick={onRestart}
              className="rounded-lg border border-paper/30 px-5 py-2.5 text-small text-paper transition-colors duration-300 ease-calm hover:border-amber hover:text-amber"
            >
              Retake
            </button>
          ) : (
            <Link
              href="/path-finder"
              className="rounded-lg border border-paper/30 px-5 py-2.5 text-small text-paper transition-colors duration-300 ease-calm hover:border-amber hover:text-amber"
            >
              Take the test yourself
            </Link>
          )}
        </div>

        {/* Email-to-self: send the result to the user's inbox. */}
        <div className="mt-8 border-t border-paper/15 pt-7">
          {emailStatus === "sent" ? (
            <p className="text-small text-amber">
              Sent. Check your inbox — it should arrive within a minute.
            </p>
          ) : (
            <>
              <p className="mb-3 text-small text-paper/70">
                Want a copy in your inbox?
              </p>
              <form onSubmit={sendToEmail} className="flex flex-wrap gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={emailAddr}
                  onChange={(e) => {
                    setEmailAddr(e.target.value);
                    if (emailStatus === "error") setEmailStatus("idle");
                  }}
                  disabled={emailStatus === "sending"}
                  className="flex-1 min-w-0 rounded-lg border border-paper/20 bg-paper/10 px-4 py-2.5 text-small text-paper placeholder-paper/40 focus:border-amber focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={emailStatus === "sending"}
                  className="shrink-0 rounded-lg bg-paper/15 px-5 py-2.5 text-small font-medium text-paper transition-colors duration-300 ease-calm hover:bg-amber hover:text-ink disabled:opacity-50"
                >
                  {emailStatus === "sending" ? "Sending…" : "Email me this"}
                </button>
              </form>
              {emailStatus === "error" ? (
                <p className="mt-2 text-xs text-red-400">
                  Something went wrong. Try again or reach out at dare@dareomotosho.com.
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Salary reference. */}
      <div className="mt-6 rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
        <h3 className="font-serif text-h2 font-light text-signature">
          What the role tends to pay
        </h3>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {track.salary.map((s) => (
            <div key={s.level} className="bg-paper p-6">
              <p className="kicker text-blue-lift">{s.level}</p>
              <p className="mt-3 font-serif text-h2 font-light text-ink">{s.usd}</p>
              <p className="mt-1 text-small text-ink/60">{s.ngn} (Nigeria)</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/50 lg:whitespace-nowrap">
          Educational reference only, not professional, career, or financial
          advice or a recommendation. Actual pay varies by company, location,
          and experience.
        </p>
        <Link
          href="/tools/career-salary-explorer.html"
          target="_blank"
          className="link-quiet mt-2 inline-block text-small"
        >
          Compare against 30 roles in the salary explorer
        </Link>
      </div>

      {/* The roadmap. */}
      <div className="mt-6 rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
        <h3 className="font-serif text-h2 font-light text-signature">Your roadmap, in order</h3>
        {pacing ? <p className="mt-3 max-w-prose text-small text-ink/70">{pacing}</p> : null}
        <ol className="mt-8 space-y-6">
          {track.roadmap.map((r, i) => (
            <li key={r.step} className="flex gap-5">
              <span className="font-serif text-h2 font-light leading-none text-amber">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-serif text-lg font-medium text-ink">{r.step}</p>
                <p className="mt-1 max-w-prose text-small text-ink/70">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-small text-ink/70">
          <span className="font-medium text-signature">Certifications worth holding:</span>{" "}
          {track.certifications.join(" · ")}
        </p>
      </div>

      {/* First project + reading list. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber/40 bg-paper p-8 sm:p-10">
          <p className="kicker text-amber">Build this first</p>
          <p className="mt-5 font-serif text-xl font-light leading-snug text-ink">
            {track.firstProject}
          </p>
          <p className="mt-4 text-small text-ink/60">
            Confidence comes from shipping, not from reading. Start it in week
            one, badly if necessary.
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
          <p className="kicker text-blue-lift">Read these, in this order</p>
          <ol className="mt-5 space-y-3">
            {track.resources.map((r, i) => (
              <li key={r.href} className="flex gap-3">
                <span className="text-small text-amber">{i + 1}.</span>
                <Link href={r.href} className="link-quiet text-body">
                  {r.label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Education-only disclaimer, always visible with the result. */}
      <p className="mt-6 rounded-xl border border-ink/10 bg-paper px-5 py-4 text-xs leading-relaxed text-ink/60">
        {resultDisclaimer}
      </p>

      {/* Close: capture + human help. */}
      <div className="mt-6 rounded-3xl bg-signature p-8 text-paper sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <EmailCapture
            tone="dark"
            label="Keep this path warm."
            hint="New resources for your track, the next live class, and nothing else."
          />
          <div className="lg:text-right">
            <p className="text-body text-paper/75">
              Want the human version of this result?
            </p>
            <div className="mt-4">
              <Button href="/book" variant="accent">
                Book a call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
