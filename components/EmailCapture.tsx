"use client";

import { useState, type FormEvent } from "react";
import { submitEmail } from "@/lib/subscribe";
import { contactEmail } from "@/lib/site";

type EmailCaptureProps = {
  /** "light" sits on Paper; "dark" sits on a Signature/Ink surface (footer). */
  tone?: "light" | "dark";
  label?: string;
  hint?: string;
  /** Tighter type and spacing, for the footer. */
  compact?: boolean;
  className?: string;
};

type Status = "idle" | "sending" | "done" | "already" | "error";

/**
 * Email capture, wired through lib/subscribe to the Resend audience and the
 * Supabase `subscribers` table as a backup list (see
 * supabase/migrations/0001_schema.sql; anon inserts only).
 *
 * A duplicate signup is still success — the address is on the list either way
 * — but it says "already on the list" rather than thanking them as if they
 * were new, which is the difference between reassurance and confusion. A real
 * failure says so honestly instead of pretending.
 */
export default function EmailCapture({
  tone = "light",
  label = "Get the occasional, useful note.",
  hint = "Resources and class dates. No noise, no hype.",
  compact = false,
  className = "",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!address || status === "sending") return;
    setStatus("sending");

    const { ok, alreadySubscribed } = await submitEmail(
      address,
      window.location.pathname,
    );

    setStatus(ok ? (alreadySubscribed ? "already" : "done") : "error");
  }

  const dark = tone === "dark";

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`}>
      <label
        htmlFor="email-capture"
        className={`block font-serif leading-tight ${compact ? "text-xl" : "text-h2"} ${dark ? "text-paper" : "text-ink"}`}
      >
        {label}
      </label>
      <p className={`${compact ? "mt-2" : "mt-3"} text-small ${dark ? "text-paper/65" : "text-ink/60"}`}>{hint}</p>

      {status === "done" || status === "already" ? (
        <p
          className={`mt-6 text-body ${dark ? "text-amber" : "text-signature"}`}
          role="status"
        >
          {status === "already"
            ? "You're already on the list, so nothing changed."
            : "Thank you, you're on the list."}
        </p>
      ) : (
        <>
          <div className={`${compact ? "mt-4" : "mt-6"} flex flex-col gap-3 sm:flex-row`}>
            <input
              id="email-capture"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`flex-1 rounded-lg border px-4 ${compact ? "py-2.5" : "py-3"} text-body outline-none transition-colors duration-300 ease-calm ${
                dark
                  ? "border-paper/20 bg-paper/5 text-paper placeholder:text-paper/40 focus:border-amber"
                  : "border-ink/15 bg-paper text-ink placeholder:text-ink/35 focus:border-blue-lift"
              }`}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className={`rounded-lg px-6 ${compact ? "py-2.5" : "py-3"} text-small font-medium transition-all duration-300 ease-calm disabled:opacity-60 ${
                dark
                  ? "bg-amber text-ink hover:brightness-[0.97]"
                  : "bg-signature text-paper hover:bg-blue-lift"
              }`}
            >
              {status === "sending" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {status === "error" ? (
            <p
              className={`mt-3 text-small ${dark ? "text-paper/70" : "text-ink/60"}`}
              role="alert"
            >
              That didn't go through. Try again in a moment, or write to{" "}
              <a href={`mailto:${contactEmail}`} className="underline underline-offset-2">
                {contactEmail}
              </a>
              .
            </p>
          ) : null}
        </>
      )}
    </form>
  );
}
