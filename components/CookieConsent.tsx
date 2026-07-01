"use client";

import { useEffect, useState } from "react";

const KEY = "cookie_consent";

/**
 * Cookie consent banner. Shows once until the visitor accepts or declines; the
 * choice is stored both in a first-party cookie (1 year) and localStorage, so
 * it persists across visits and the banner stays hidden thereafter.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(KEY) ||
        document.cookie.split("; ").find((c) => c.startsWith(`${KEY}=`))?.split("=")[1];
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, choice);
      document.cookie = `${KEY}=${choice}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    } catch {
      /* storage blocked — just dismiss */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-ink/10 bg-paper/95 backdrop-blur-md print:hidden"
    >
      <div className="container-content flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-small text-ink">
          This site uses cookies to remember your preferences and understand how the
          site is used. See how it works in the privacy notice.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-lg border border-ink/15 px-5 py-2 text-small font-medium text-ink transition-colors duration-300 ease-calm hover:border-ink/40"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-lg bg-signature px-5 py-2 text-small font-medium text-paper transition-colors duration-300 ease-calm hover:bg-blue-lift"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
