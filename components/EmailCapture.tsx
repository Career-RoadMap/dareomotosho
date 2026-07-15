"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { contactEmail } from "@/lib/site";

type EmailCaptureProps = {
  /** "light" sits on Paper; "dark" sits on a Signature/Ink surface (footer). */
  tone?: "light" | "dark";
  label?: string;
  hint?: string;
  className?: string;
};

type Status = "idle" | "sending" | "done" | "error";

/**
 * Email capture, wired to the Supabase `subscribers` table (see
 * supabase/migrations/0001_schema.sql). Anon inserts only; the list is
 * readable solely from the Supabase dashboard. A duplicate signup reads as
 * success (the address is on the list either way), and a real failure says
 * so honestly instead of pretending.
 */
export default function EmailCapture({
  tone = "light",
  label = "Get the occasional, useful note.",
  hint = "Resources and class dates. No noise, no hype.",
  className = "",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!address || status === "sending") return;
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("subscribers").insert({
      email: address,
      source: window.location.pathname,
    });
    // 23505 = unique violation: already subscribed, which is still success.
    if (!error || error.code === "23505") setStatus("done");
    else setStatus("error");
  }

  const dark = tone === "dark";

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`}>
      <label
        htmlFor="email-capture"
        className={`block font-serif text-h2 leading-tight ${dark ? "text-paper" : "text-ink"}`}
      >
        {label}
      </label>
      <p className={`mt-3 text-small ${dark ? "text-paper/65" : "text-ink/60"}`}>{hint}</p>

      {status === "done" ? (
        <p
          className={`mt-6 text-body ${dark ? "text-amber" : "text-signature"}`}
          role="status"
        >
          Thank you, you're on the list.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              id="email-capture"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`flex-1 rounded-lg border px-4 py-3 text-body outline-none transition-colors duration-300 ease-calm ${
                dark
                  ? "border-paper/20 bg-paper/5 text-paper placeholder:text-paper/40 focus:border-amber"
                  : "border-ink/15 bg-paper text-ink placeholder:text-ink/35 focus:border-blue-lift"
              }`}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className={`rounded-lg px-6 py-3 text-small font-medium transition-all duration-300 ease-calm disabled:opacity-60 ${
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
