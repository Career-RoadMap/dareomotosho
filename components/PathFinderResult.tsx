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

  function buildPdfHtml() {
    const tempHtml = temperament
      ? `<div class="temp-box">
          <span class="label">Temperament</span>
          <span class="code">${temperament.code}</span>
          <span class="sep">·</span>
          <span class="family">${temperament.family.name}</span>
          <p class="blurb">${temperament.family.blurb}</p>
        </div>`
      : "";
    const roadmapHtml = track.roadmap
      .map(
        (r, i) => `<div class="roadmap-item">
          <div class="roadmap-num">${String(i + 1).padStart(2, "0")}</div>
          <div><strong>${r.step}</strong><p>${r.body}</p></div>
        </div>`,
      )
      .join("");
    const salaryHtml = track.salary
      .map(
        (s) => `<div class="salary-card">
          <div class="level">${s.level}</div>
          <div class="amount">${s.usd}</div>
        </div>`,
      )
      .join("");
    const certsHtml = track.certifications
      .map((c) => `<span class="cert">${c}</span>`)
      .join("");
    const resourcesHtml = track.resources
      .map((r, i) => `<li>${i + 1}. ${r.label}</li>`)
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cloud Career Path Report: ${track.title}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,serif;color:#0f1b2d;background:#fff;padding:48px;max-width:820px;margin:0 auto;font-size:15px;line-height:1.7}
  .header{border-bottom:3px solid #e0a951;padding-bottom:20px;margin-bottom:32px}
  .kicker{font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#e0a951}
  h1{font-size:2.1rem;font-weight:400;line-height:1.15;margin:8px 0 6px;color:#0f1b2d}
  .tagline{font-size:1.1rem;color:#555;font-style:italic}
  .why{margin-top:14px;color:#444}
  .section{margin-top:36px}
  h2{font-family:Arial,sans-serif;font-size:.85rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1e3a5f;border-bottom:1px solid #e0a951;padding-bottom:6px;margin-bottom:16px}
  .temp-box{background:#f5f0e8;border:1px solid rgba(224,169,81,.5);border-radius:8px;padding:14px 18px;display:inline-flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:4px}
  .temp-box .label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#e0a951}
  .temp-box .code{font-size:1.6rem;font-weight:700;color:#1e3a5f}
  .temp-box .sep{color:#bbb}
  .temp-box .family{font-size:1.05rem;font-weight:600;color:#1e3a5f}
  .temp-box .blurb{width:100%;margin-top:4px;font-size:.88rem;color:#666;font-style:italic}
  .salary-grid{display:flex;gap:12px;margin-top:8px}
  .salary-card{flex:1;border:1px solid #ddd;border-radius:8px;padding:14px 16px}
  .salary-card .level{font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#1e3a5f}
  .salary-card .amount{font-size:1.45rem;font-weight:700;color:#0f1b2d;margin-top:4px}
  .pacing{background:#f8f8f8;border-left:3px solid #e0a951;padding:12px 16px;margin-bottom:20px;font-size:.9rem;color:#666;font-style:italic}
  .roadmap-item{display:flex;gap:16px;margin-bottom:20px}
  .roadmap-num{font-size:1.8rem;font-weight:700;color:#e0a951;min-width:44px;line-height:1.1;font-family:Georgia,serif}
  .roadmap-item strong{font-size:1rem;color:#0f1b2d;display:block;margin-bottom:2px}
  .roadmap-item p{font-size:.9rem;color:#666;margin:0}
  .certs{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
  .cert{background:#e8f0f8;border:1px solid rgba(30,58,95,.25);border-radius:20px;padding:4px 14px;font-family:Arial,sans-serif;font-size:.82rem;color:#1e3a5f;font-weight:600}
  .project-box{background:#fffbf0;border:1px solid rgba(224,169,81,.4);border-radius:10px;padding:20px 24px}
  .project-text{font-size:1.05rem;color:#333;margin:8px 0 0}
  .project-note{margin-top:10px;font-size:.85rem;color:#888;font-style:italic}
  .resource-list{list-style:none;padding:0}
  .resource-list li{padding:8px 0;border-bottom:1px solid #eee;font-size:.95rem;color:#333}
  .resource-list li:last-child{border-bottom:none}
  .disclaimer{margin-top:40px;padding:16px 18px;background:#f8f8f8;border-radius:8px;font-family:Arial,sans-serif;font-size:.78rem;color:#999;line-height:1.6}
  .footer{margin-top:20px;text-align:center;font-family:Arial,sans-serif;font-size:.75rem;color:#bbb}
  @media print{@page{margin:0;size:A4}body{padding:1.5cm;max-width:none}}
</style>
</head>
<body>
<div class="header">
  <div class="kicker">Cloud Career Path Report · dareomotosho.com</div>
  <h1>${track.title}</h1>
  <div class="tagline">${track.tagline}</div>
  <div class="why">${track.whyItFits}</div>
</div>
${tempHtml}
<div class="section">
  <h2>Salary Reference (USD)</h2>
  <div class="salary-grid">${salaryHtml}</div>
  <p style="margin-top:10px;font-family:Arial,sans-serif;font-size:.78rem;color:#aaa">Educational reference only. Not financial or career advice. Varies by company, location, and experience.</p>
</div>
<div class="section">
  <h2>Your Roadmap, In Order</h2>
  ${pacing ? `<div class="pacing">${pacing}</div>` : ""}
  ${roadmapHtml}
  <div style="margin-top:16px">
    <strong style="font-size:.9rem;color:#1e3a5f">Certifications worth holding:</strong>
    <div class="certs">${certsHtml}</div>
  </div>
</div>
<div class="section">
  <h2>Build This First</h2>
  <div class="project-box">
    <div class="kicker">Start here</div>
    <div class="project-text">${track.firstProject}</div>
    <p class="project-note">Confidence comes from shipping, not from reading. Start it in week one, badly if necessary.</p>
  </div>
</div>
<div class="section">
  <h2>Read These, In This Order</h2>
  <ol class="resource-list">${resourcesHtml}</ol>
</div>
<p class="disclaimer">${resultDisclaimer}</p>
<p class="footer">Generated from dareomotosho.com/path-finder &nbsp;·&nbsp; For education only</p>
</body>
</html>`;
  }

  function downloadPdf() {
    // Print from a hidden same-origin iframe: printing an about:blank popup
    // fails to save in several browsers, this path does not.
    const html = buildPdfHtml();
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) {
      iframe.remove();
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();
    const printFrame = () => {
      const win = iframe.contentWindow;
      if (!win) {
        iframe.remove();
        return;
      }
      win.addEventListener("afterprint", () => iframe.remove(), { once: true });
      // Fallback cleanup in case afterprint never fires.
      setTimeout(() => {
        if (document.body.contains(iframe)) iframe.remove();
      }, 60000);
      win.focus();
      win.print();
    };
    // Give the frame a beat to lay out before opening the print dialog.
    if (doc.readyState === "complete") {
      setTimeout(printFrame, 200);
    } else {
      iframe.addEventListener("load", () => setTimeout(printFrame, 200), { once: true });
    }
  }

  function buildEmailFields(): Record<string, string> {
    // FormSubmit only delivers named form fields (rendered as rows by its
    // "table" template) — arbitrary keys like _html are silently dropped, so
    // the whole report goes out as one field per row.
    const fields: Record<string, string> = {
      email: emailAddr,
      _cc: emailAddr,
      _subject: `Your cloud career path: ${track.title}`,
      _template: "table",
      _captcha: "false",
      "Your path": track.title,
      Tagline: track.tagline,
      "Why it fits": track.whyItFits,
    };
    if (temperament) {
      fields["Temperament"] = `${temperament.code} · ${temperament.family.name} — ${temperament.family.blurb}`;
    }
    track.salary.forEach((s) => {
      fields[`Salary — ${s.level}`] = s.usd;
    });
    if (pacing) fields["Pacing"] = pacing;
    track.roadmap.forEach((r, i) => {
      fields[`Roadmap step ${i + 1}`] = `${r.step} — ${r.body}`;
    });
    fields["Certifications worth holding"] = track.certifications.join(" · ");
    fields["Build this first"] = track.firstProject;
    track.resources.forEach((r, i) => {
      const url = `${siteUrl}${r.href.startsWith("/") ? r.href : `/${r.href}`}`;
      fields[`Read ${i + 1}`] = `${r.label} — ${url}`;
    });
    fields["Your result page"] = `${siteUrl}${resultPath}`;
    fields["Note"] =
      "Educational reference only. Not professional, career, or financial advice.";
    return fields;
  }

  async function sendToEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!emailAddr || emailStatus === "sending") return;
    setEmailStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/dare@dareomotosho.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildEmailFields()),
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
      const params = new URLSearchParams({ track: track.id });
      if (temperament?.code) params.set("t", temperament.code);
      const res = await fetch(`/api/download-image?${params}`);
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
            {downloading ? "Preparing…" : "Download image"}
          </button>

          <button
            type="button"
            onClick={downloadPdf}
            className="inline-flex items-center gap-2 rounded-lg border border-paper/30 px-5 py-2.5 text-small font-medium text-paper transition-all duration-300 ease-calm hover:border-amber hover:bg-paper/10 hover:text-amber"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Download PDF
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
