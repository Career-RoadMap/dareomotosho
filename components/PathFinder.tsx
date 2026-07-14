"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";
import {
  pacingNotes,
  questions,
  scoreAnswers,
  trackById,
  type Track,
} from "@/lib/pathfinder";

/**
 * The Cloud Career Path Finder: a four-question assessment that resolves to
 * one of five role tracks, with a salary reference band, an ordered roadmap,
 * a first project, and a reading list drawn from the site's own library.
 * The result is reflected into ?path=<track> so a shared link opens straight
 * onto the result view.
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
    return <Result track={result} pacing={timelineIdx !== null ? pacingNotes[timelineIdx] : null} onRestart={restart} />;
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

function Result({
  track,
  pacing,
  onRestart,
}: {
  track: Track;
  pacing: string | null;
  onRestart: () => void;
}) {
  return (
    <div className="animate-fade-up">
      {/* The verdict. */}
      <div className="rounded-3xl bg-ink p-8 text-paper sm:p-12">
        <p className="kicker text-amber">Your path</p>
        <h2 className="mt-4 max-w-2xl font-serif text-h1 font-light leading-tight text-paper">
          {track.title}
        </h2>
        <p className="mt-4 max-w-2xl text-body text-paper/75">{track.tagline}</p>
        <p className="mt-6 max-w-2xl text-body text-paper/90">{track.whyItFits}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-lg border border-paper/30 px-5 py-2.5 text-small text-paper transition-colors duration-300 ease-calm hover:border-amber hover:text-amber"
          >
            Retake
          </button>
          <span className="inline-flex items-center gap-1 rounded-lg bg-paper/10 px-3 py-2">
            <span className="pr-1 text-small text-paper/70">Share your path</span>
            <span className="[&_button]:text-paper/80 [&_button:hover]:bg-paper/10">
              <ShareButtons path={`/path-finder?path=${track.id}`} title={`My cloud career path: ${track.title}`} />
            </span>
          </span>
        </div>
      </div>

      {/* Salary reference. */}
      <div className="mt-6 rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
        <h3 className="font-serif text-h2 font-light text-signature">
          What the role tends to pay
        </h3>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {track.salary.map((s) => (
            <div key={s.level} className="bg-paper p-6">
              <p className="kicker text-blue-lift">{s.level}</p>
              <p className="mt-3 font-serif text-h2 font-light text-ink">{s.usd}</p>
              <p className="mt-1 text-small text-ink/60">{s.ngn} (Nigeria)</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/50 lg:whitespace-nowrap">
          Educational reference only, not professional, career, or financial
          advice or a recommendation. Actual pay varies by company, location,
          and experience.
        </p>
        <Link href="/tools/career-salary-explorer.html" target="_blank" className="link-quiet mt-2 inline-block text-small">
          Compare against 30 roles in the salary explorer
        </Link>
      </div>

      {/* The roadmap. */}
      <div className="mt-6 rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
        <h3 className="font-serif text-h2 font-light text-signature">Your roadmap, in order</h3>
        {pacing ? <p className="mt-3 max-w-prose text-small text-ink/70">{pacing}</p> : null}
        <ol className="mt-8 space-y-6">
          {track.roadmap.map((r, i) => (
            <li key={r.step} className="flex gap-5">
              <span className="font-serif text-h2 font-light leading-none text-amber">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-serif text-lg font-medium text-ink">{r.step}</p>
                <p className="mt-1 max-w-prose text-small text-ink/70">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-small text-ink/70">
          <span className="font-medium text-signature">Certifications worth holding:</span>{" "}
          {track.certifications.join(" · ")}
        </p>
      </div>

      {/* First project + reading list. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber/40 bg-paper p-8 sm:p-10">
          <p className="kicker text-amber">Build this first</p>
          <p className="mt-5 font-serif text-xl font-light leading-snug text-ink">
            {track.firstProject}
          </p>
          <p className="mt-4 text-small text-ink/60">
            Confidence comes from shipping, not from reading. Start it in week
            one, badly if necessary.
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
          <p className="kicker text-blue-lift">Read these, in this order</p>
          <ol className="mt-5 space-y-3">
            {track.resources.map((r, i) => (
              <li key={r.href} className="flex gap-3">
                <span className="text-small text-amber">{i + 1}.</span>
                <Link href={r.href} className="link-quiet text-body">
                  {r.label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Close: capture + human help. */}
      <div className="mt-6 rounded-3xl bg-signature p-8 text-paper sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <EmailCapture
            tone="dark"
            label="Keep this path warm."
            hint="New resources for your track, the next live class, and nothing else."
          />
          <div className="lg:text-right">
            <p className="text-body text-paper/75">
              Want the human version of this result?
            </p>
            <div className="mt-4">
              <Button href="/book" variant="accent">
                Book a call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
