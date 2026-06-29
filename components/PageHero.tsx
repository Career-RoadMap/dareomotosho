import type { ReactNode } from "react";

type PageHeroProps = {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Executive pages run cooler/graver; warm pages let Paper + amber breathe. */
  tone?: "cool" | "warm";
};

/**
 * Inner-page hero. Large Fraunces headline with ample whitespace —
 * one idea per region, in type form. Animates up gently on load.
 */
export default function PageHero({ kicker, title, intro, tone = "cool" }: PageHeroProps) {
  return (
    <section className="container-content pt-20 pb-12 sm:pt-28 sm:pb-16">
      <div className="max-w-3xl">
        <p className="kicker animate-fade-in">{kicker}</p>
        <h1
          className={`mt-6 font-serif text-h1 font-light animate-hero-rise ${
            tone === "warm" ? "text-ink" : "text-signature"
          }`}
        >
          {title}
        </h1>
        {intro ? (
          <div
            className="mt-8 max-w-prose text-body text-ink animate-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            {intro}
          </div>
        ) : null}
      </div>
    </section>
  );
}
