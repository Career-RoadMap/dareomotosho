"use client";

import { useEffect, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabase";
import { contactEmail } from "@/lib/site";
import {
  UNLOCK_COOKIE,
  UNLOCK_MAX_AGE,
  UNLOCK_STORAGE_KEY,
} from "@/lib/resource-gate";

/**
 * The email gate on a resource page, and the full body once open.
 *
 * The deliberate rule: email is asked for ONCE, ever. The first unlock
 * stores a token in localStorage and a cookie; from then on every resource
 * page (this one and all future ones) opens itself on load, fetching the
 * full body from /api/resources/<slug> — which only answers to the cookie,
 * so the gated markdown never ships in the crawlable page.
 *
 * The email goes to the SAME Resend audience as the site's Subscribe form,
 * via the existing /api/subscribe route (with the same Supabase
 * `subscribers` backup insert EmailCapture uses) — one list, not two.
 * Already-subscribed reads as success there, so a returning subscriber on
 * a fresh browser just unlocks again quietly.
 */

type GateStatus =
  | "checking" // deciding: token present or not?
  | "locked"
  | "sending"
  | "error"
  | "loading" // unlocked, fetching the body
  | "open";

function hasUnlockCookie(): boolean {
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${UNLOCK_COOKIE}=1`));
}

function storeUnlock() {
  try {
    localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable (private mode); the cookie still carries it.
  }
  document.cookie = `${UNLOCK_COOKIE}=1; path=/; max-age=${UNLOCK_MAX_AGE}; SameSite=Lax`;
}

function hasUnlock(): boolean {
  try {
    if (localStorage.getItem(UNLOCK_STORAGE_KEY) === "1") return true;
  } catch {
    // fall through to the cookie
  }
  return hasUnlockCookie();
}

export default function ResourceUnlock({ slug }: { slug: string }) {
  const [status, setStatus] = useState<GateStatus>("checking");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [fetchFailed, setFetchFailed] = useState(false);

  async function openContent() {
    // Re-assert the cookie from whichever store survived, then fetch.
    storeUnlock();
    setStatus("loading");
    setFetchFailed(false);
    try {
      const res = await fetch(`/api/resources/${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { body?: string };
      // An empty string is legitimate (a resource that is all preview).
      if (typeof data.body !== "string") throw new Error("malformed");
      setBody(data.body);
      setStatus("open");
    } catch {
      setFetchFailed(true);
      setStatus("open");
    }
  }

  useEffect(() => {
    if (hasUnlock()) {
      void openContent();
    } else {
      setStatus("locked");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!address || status === "sending") return;
    setStatus("sending");

    // Same submission pattern as EmailCapture: the Resend audience via
    // /api/subscribe, with the Supabase subscribers table as backup.
    // Either landing counts — the address is on the list.
    const [resendOk, supabaseOk] = await Promise.all([
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address }),
      })
        .then((res) => res.ok)
        .catch(() => false),
      supabase
        ? supabase
            .from("subscribers")
            .insert({ email: address, source: window.location.pathname })
            .then(({ error }) => !error || error.code === "23505")
        : Promise.resolve(false),
    ]);

    if (resendOk || supabaseOk) {
      // The confirmation note: what they signed up for, plus a way back to
      // this kit and the shelf. Deliberately not awaited and never fatal —
      // a mail failure must not cost the reader the unlock they just earned.
      void fetch("/api/resources/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address, slug }),
      }).catch(() => {});
      void openContent();
    } else {
      setStatus("error");
    }
  }

  if (status === "checking") {
    // One frame while localStorage is read; nothing worth painting.
    return null;
  }

  if (status === "open" || status === "loading") {
    return (
      <div aria-live="polite">
        {status === "loading" ? (
          <p className="text-small text-ink/55">Opening…</p>
        ) : fetchFailed ? (
          <p className="text-body text-ink/70" role="alert">
            You&apos;re unlocked, but the content didn&apos;t load. Refresh the
            page to try again, or write me at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="underline underline-offset-2 text-link"
            >
              {contactEmail}
            </a>
            .
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/[0.14] bg-ink/[0.02] px-5 py-4">
              <span className="text-small text-ink/70">
                Take this one with you:
              </span>
              <a
                href={`/api/resources/${encodeURIComponent(slug)}/download`}
                className="inline-flex items-center gap-2 rounded-lg bg-amber px-5 py-2.5 text-small font-medium text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97]"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M10 2a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 10.586V3a1 1 0 0 1 1-1zM4 15a1 1 0 0 1 1 1h10a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2 1 1 0 0 1 1-1z" />
                </svg>
                Download the kit (PDF)
              </a>
            </div>
            <div className="prose-entry mt-8 space-y-5 text-body text-ink">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    );
  }

  // Locked (or mid-submit / submit failed): the gate itself.
  return (
    <div className="card-accent rounded-2xl border border-ink/[0.14] bg-paper p-8 shadow-sm sm:p-10">
      <h2 className="font-serif text-h2 font-light text-ink">
        The full sheet is one email away.
      </h2>
      <p className="mt-3 max-w-prose text-body text-ink/70">
        Leave your email once and every kit on this site opens, this one and
        each new episode&apos;s tool after it, with the sheet yours to
        download. You won&apos;t be asked again on this browser.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="resource-unlock-email" className="sr-only">
          Email address
        </label>
        <input
          id="resource-unlock-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-signature px-6 py-3 text-small font-medium text-paper transition-all duration-300 ease-calm hover:bg-blue-lift disabled:opacity-60"
        >
          {status === "sending" ? "Unlocking…" : "Unlock every resource"}
        </button>
      </form>
      <p className="mt-3 text-small text-ink/55">
        Same list as Subscribe — resources and class dates, no noise. Already
        on it? Enter the same address; it just unlocks.
      </p>
      {status === "error" ? (
        <p className="mt-3 text-small text-ink/60" role="alert">
          That didn&apos;t go through. Try again in a moment, or write me at{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="underline underline-offset-2"
          >
            {contactEmail}
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
