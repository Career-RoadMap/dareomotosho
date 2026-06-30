"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

/** Slugify a title into a URL-safe, unique-ish slug. */
function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "question"
  ) + "-" + Math.random().toString(36).slice(2, 7);
}

/**
 * Submit a new community question. It's stored as an unpublished
 * user_question entry (the moderation gate); once published it appears live in
 * the library via realtime. With no Supabase it just confirms locally.
 */
export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [asker, setAsker] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (supabase) {
      await supabase.from("entries").insert({
        slug: slugify(title),
        type: "user_question",
        title: title.trim(),
        summary: title.trim(),
        body: "",
        topic: "cloud",
        level: "newcomer",
        asker: asker.trim() ? `asked by ${asker.trim()}` : "asked by a visitor",
        published: false,
      });
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-body text-signature" role="status">
        Thank you, your question is in. Once reviewed, it'll appear in the
        library for everyone.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="q-title" className="block text-small font-medium text-ink">
          Your question <span className="text-amber">*</span>
        </label>
        <input
          id="q-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What would you like to know?"
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
        />
      </div>
      <div>
        <label htmlFor="q-asker" className="block text-small font-medium text-ink">
          Name to credit (optional)
        </label>
        <input
          id="q-asker"
          type="text"
          value={asker}
          onChange={(e) => setAsker(e.target.value)}
          placeholder="a learner, or your name"
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-signature px-7 py-3.5 text-small font-medium text-paper transition-colors duration-300 ease-calm hover:bg-blue-lift"
      >
        Submit question
      </button>
    </form>
  );
}
