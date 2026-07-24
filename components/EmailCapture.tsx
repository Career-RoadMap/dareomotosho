"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
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

type Status = "idle" | "sending" | "done" | "error";

/**
 * Email capture, wired to the Resend audience via /api/subscribe, with the
 * Supabase `subscribers` table kept in sync as a backup list (see
 * supabase/migrations/0001_schema.sql; anon inserts only). A duplicate
 * signup reads as success (the address is on the list either way), and a
 * real failure says so honestly instead of pretending.
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

    const [resendOk, supabaseOk] = await Promise.all([
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address }),
      })
        .then((res) => res.ok)
        .catch(() => false),
      // Backup list; 23505 = unique violation: already subscribed, which is
      // still success.
      supabase
        ? supabase
            .from("subscribers")
            .insert({ email: address, source: window.location.pathname })
            .then(({ error }) => !error || error.code === "23505")
        : Promise.resolve(false),
    ]);

    setStatus(resendOk || supabaseOk ? "done" : "error");
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

      {status === "done" ? (
        <p
          className={`mt-6 text-body ${dark ? "text-amber" : "text-signature"}`}
          role="status"
        >
          Thank you, you're on the list.
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
              That didn't go through. Try again in a moment, or write me at{" "}
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
