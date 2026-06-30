"use client";

import { useState, type FormEvent } from "react";

type EmailCaptureProps = {
  /** "light" sits on Paper; "dark" sits on a Signature/Ink surface (footer). */
  tone?: "light" | "dark";
  label?: string;
  hint?: string;
  className?: string;
};

/**
 * Email capture. UI only, wire `onSubmit` to your provider (Supabase, etc.)
 * at integration time. This is a deliberate seam: it validates and reflects
 * state, but does not post anywhere yet.
 */
export default function EmailCapture({
  tone = "light",
  label = "Get the occasional, useful note.",
  hint = "Resources and class dates. No noise, no hype.",
  className = "",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO(integration): POST to email provider. For now, reflect success.
    setDone(true);
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

      {done ? (
        <p
          className={`mt-6 text-body ${dark ? "text-amber" : "text-signature"}`}
          role="status"
        >
          Thank you, you're on the list.
        </p>
      ) : (
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
            className={`rounded-lg px-6 py-3 text-small font-medium transition-all duration-300 ease-calm ${
              dark
                ? "bg-amber text-ink hover:brightness-[0.97]"
                : "bg-signature text-paper hover:bg-blue-lift"
            }`}
          >
            Subscribe
          </button>
        </div>
      )}
    </form>
  );
}
