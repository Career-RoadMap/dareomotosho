"use client";

import { useEffect, useRef, useState } from "react";
import { entryTypeMeta, type Entry } from "@/lib/library";
import { supabase } from "@/lib/supabase";
import CommunityQuestions from "./CommunityQuestions";

/**
 * Community Questions sidebar: unchanged from its original design. A live
 * news banner that folds in newly published questions via realtime, sticking
 * in view on desktop. Kept exactly as-is while the rest of /resources moves
 * to dedicated collection pages.
 */
export default function CommunityQuestionsSidebar({ initial }: { initial: Entry[] }) {
  const [items, setItems] = useState<Entry[]>(
    initial.filter((e) => e.type === "user_question" && e.published !== false),
  );
  const asideRef = useRef<HTMLElement | null>(null);

  // Nav links to /resources#community from other pages; Next's router doesn't
  // reliably scroll to a hash target that mounts after client hydration, so
  // do it ourselves once this section is actually in the DOM.
  useEffect(() => {
    if (window.location.hash === "#community") {
      asideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client
      .channel("resources-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entries" },
        (payload) => {
          const row = payload.new as Entry;
          if (!row || !row.published || row.type !== "user_question") return;
          setItems((prev) =>
            prev.some((e) => e.id === row.id)
              ? prev.map((e) => (e.id === row.id ? row : e))
              : [row, ...prev],
          );
        },
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, []);

  return (
    <aside ref={asideRef} id="community" className="scroll-mt-24 lg:sticky lg:top-24">
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
        </span>
        <p className="kicker text-blue-lift">{entryTypeMeta.user_question.label}</p>
      </div>
      <CommunityQuestions items={items} />
    </aside>
  );
}
