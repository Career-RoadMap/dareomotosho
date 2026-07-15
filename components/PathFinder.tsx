"use client";

import { useEffect, useState } from "react";
import PathFinderResult from "@/components/PathFinderResult";
import {
  pacingNotes,
  questions,
  scoreAnswers,
  trackById,
  type Track,
} from "@/lib/pathfinder";

/**
 * The Cloud Career Path Finder quiz: a four-question assessment that resolves
 * to one of five role tracks. On completion it reflects the result into
 * ?path=<track> (so a shared quiz link reopens on the result) and hands off
 * to PathFinderResult for the verdict, roadmap, and share/download options.
 */
export default function PathFinder() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Track | null>(null);
  const step = answers.length;

  // A shared link (?path=…) opens directly on that result.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("path");
    const t = id ? trackById(id) : undefined;
    if (t) setResult(t);
  }, []);

  function choose(optIdx: number) {
    const next = [...answers, optIdx];
    setAnswers(next);
    if (next.length === questions.length) {
      const track = scoreAnswers(next);
      setResult(track);
      const url = new URL(window.location.href);
      url.searchParams.set("path", track.id);
      window.history.replaceState(null, "", url.toString());
    }
  }

  function back() {
    setAnswers((prev) => prev.slice(0, -1));
  }

  function restart() {
    setAnswers([]);
    setResult(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("path");
    window.history.replaceState(null, "", url.toString());
  }

  if (result) {
    const timelineIdx = answers.length === questions.length ? answers[3] : null;
    return (
      <PathFinderResult
        track={result}
        pacing={timelineIdx !== null ? pacingNotes[timelineIdx] : null}
        onRestart={restart}
      />
    );
  }

  const q = questions[step];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="flex items-center gap-2" aria-hidden>
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ease-calm ${
              i < step ? "bg-amber" : i === step ? "bg-blue-lift" : "bg-ink/10"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-small text-ink/50">
        Question {step + 1} of {questions.length}
      </p>

      <div key={q.id} className="animate-fade-up">
        <h2 className="mt-6 font-serif text-h2 font-light text-signature">
          {q.prompt}
        </h2>
        <ul className="mt-8 space-y-3">
          {q.options.map((opt, i) => (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => choose(i)}
                className="group w-full rounded-2xl border border-ink/10 bg-paper p-5 text-left transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-md hover:shadow-ink/5 sm:p-6"
              >
                <span className="block font-serif text-lg font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                  {opt.label}
                </span>
                {opt.detail ? (
                  <span className="mt-1 block text-small text-ink/60">{opt.detail}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {step > 0 ? (
        <button
          type="button"
          onClick={back}
          className="link-quiet mt-8 text-small"
        >
          ← Back a question
        </button>
      ) : null}
    </div>
  );
}
