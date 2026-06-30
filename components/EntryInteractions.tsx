"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { Interaction } from "@/lib/library";

/**
 * Realtime interaction layer for a single entry: an upvote count and a
 * comment thread. Approved interactions stream in live via Supabase realtime;
 * a new comment is posted pending moderation (and shown to its author
 * optimistically), while an upvote is auto-approved and appears immediately.
 *
 * With no Supabase configured it runs fully locally so the UI is demoable.
 */
export default function EntryInteractions({ entryId }: { entryId: string }) {
  const [comments, setComments] = useState<Interaction[]>([]);
  const [upvotes, setUpvotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  // Initial load + realtime subscription.
  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase
      .from("interactions")
      .select("*")
      .eq("entry_id", entryId)
      .eq("approved", true)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!active || !data) return;
        const rows = data as Interaction[];
        setComments(rows.filter((r) => r.kind === "comment"));
        setUpvotes(rows.filter((r) => r.kind === "reaction").length);
      });

    const channel = supabase
      .channel(`interactions-${entryId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "interactions",
          filter: `entry_id=eq.${entryId}`,
        },
        (payload) => {
          const row = payload.new as Interaction;
          if (!row.approved) return;
          if (row.kind === "reaction") setUpvotes((n) => n + 1);
          if (row.kind === "comment")
            setComments((prev) =>
              prev.some((c) => c.id === row.id) ? prev : [...prev, row],
            );
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase?.removeChannel(channel);
    };
  }, [entryId]);

  async function upvote() {
    if (voted) return;
    setVoted(true);
    setUpvotes((n) => n + 1); // optimistic
    if (supabase) {
      await supabase
        .from("interactions")
        .insert({ entry_id: entryId, kind: "reaction", approved: true });
    }
  }

  async function submitComment(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const text = body.trim();
    setBody("");
    setPending(text); // show the author their pending comment
    if (supabase) {
      await supabase.from("interactions").insert({
        entry_id: entryId,
        kind: "comment",
        body: text,
        author: author.trim() || null,
        approved: false,
      });
    }
  }

  return (
    <div className="mt-16 border-t border-ink/10 pt-12">
      <div className="flex items-center justify-between gap-6">
        <h2 className="font-serif text-h2 font-light text-ink">Discussion</h2>
        <button
          type="button"
          onClick={upvote}
          aria-pressed={voted}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-small transition-colors duration-300 ease-calm ${
            voted
              ? "border-amber bg-amber text-ink"
              : "border-ink/15 text-ink hover:border-amber"
          }`}
        >
          <span aria-hidden>▲</span>
          {voted ? "Upvoted" : "Upvote"}
          <span className="tabular-nums text-ink/60">{upvotes}</span>
        </button>
      </div>

      {/* Thread */}
      <ul className="mt-8 space-y-5">
        {comments.length === 0 && !pending ? (
          <li className="text-small text-ink/55">
            No comments yet — be the first to add one.
          </li>
        ) : null}
        {comments.map((c) => (
          <li key={c.id} className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-body text-ink">{c.body}</p>
            <p className="mt-2 text-small text-ink/50">{c.author || "A visitor"}</p>
          </li>
        ))}
        {pending ? (
          <li className="rounded-2xl border border-amber/40 bg-paper p-5">
            <p className="text-body text-ink">{pending}</p>
            <p className="mt-2 text-small text-amber">
              {author.trim() || "You"} · pending review
            </p>
          </li>
        ) : null}
      </ul>

      {/* New comment */}
      <form onSubmit={submitComment} className="mt-8 max-w-xl space-y-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          required
          placeholder="Add to the conversation…"
          className="w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
        />
        <button
          type="submit"
          className="rounded-lg bg-signature px-6 py-3 text-small font-medium text-paper transition-colors duration-300 ease-calm hover:bg-blue-lift"
        >
          Post comment
        </button>
        <p className="text-small text-ink/45">
          Comments appear once approved. Upvotes are live.
        </p>
      </form>
    </div>
  );
}
