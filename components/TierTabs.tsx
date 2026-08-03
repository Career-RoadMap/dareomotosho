"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import Converge from "@/components/Converge";
import FlipCard from "@/components/FlipCard";
import FlipTile from "@/components/FlipTile";
import TierIcon from "@/components/TierIcon";
import type { Tier } from "@/lib/content";

/** Corner each grid tile converges from, in 2×2 order. */
const corners = ["tl", "tr", "bl", "br"] as const;

/**
 * The two Work tiers as side-by-side tabs rather than two stacked sections.
 * Both headings stay visible at once, so the shape of the work is legible
 * immediately, and only the selected tier's cards occupy the page. That
 * roughly halves the scroll through this part of /work.
 *
 * Implemented as a proper tablist: arrow keys and Home/End move between
 * tabs, the inactive panel is unmounted rather than hidden, and the panel is
 * keyed by tier so the card animations replay on each switch.
 */
export default function TierTabs({ tiers }: { tiers: Tier[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    const last = tiers.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const tier = tiers[active];
  const hero = tier.items.find((i) => i.hero);
  const feature = tier.items.find((i) => i.feature);
  const grid = tier.items.filter((i) => !i.hero && !i.feature);

  return (
    <>
      {/* The two tiers, always both visible, side by side. */}
      <div
        role="tablist"
        aria-label="Areas of work"
        onKeyDown={onKeyDown}
        className="grid gap-4 sm:grid-cols-2"
      >
        {tiers.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.kicker}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tier-tab-${i}`}
              aria-selected={selected}
              aria-controls="tier-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`tier-head group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ease-calm sm:p-6 ${
                selected
                  ? "card-accent border-ink/[0.14] bg-paper shadow-sm shadow-ink/[0.06]"
                  : "border-ink/[0.14] bg-transparent hover:bg-paper/70"
              }`}
            >
              <TierIcon name={t.icon} className="mt-0.5" />
              <span className="min-w-0">
                <span className="kicker block text-blue-lift">{t.kicker}</span>
                <span className="mt-2 block font-serif text-h2 font-light leading-tight text-signature">
                  {t.name}
                </span>
                <span className="mt-2 block text-small text-ink/75">{t.tagline}</span>
                <span
                  className={`mt-3 block text-small font-medium transition-colors duration-300 ease-calm ${
                    selected ? "text-amber" : "text-ink/45 group-hover:text-blue-lift"
                  }`}
                >
                  {selected ? "Showing this work" : "See this work →"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Only the selected tier's cards render, which is the whole point. */}
      <div
        key={tier.kicker}
        role="tabpanel"
        id="tier-panel"
        aria-labelledby={`tier-tab-${active}`}
        className="mt-8"
      >
        {hero && (
          <Reveal>
            <FlipCard
              metric={hero.metric ?? ""}
              metricLabel={hero.metricLabel ?? ""}
              title={hero.title}
              body={hero.body}
              hero
            />
          </Reveal>
        )}
        {feature && (
          <Reveal>
            <FlipTile title={feature.title} body={feature.body} />
          </Reveal>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {grid.map((item, i) => (
            <Converge key={item.title} from={corners[i % corners.length]} delay={i * 120}>
              <FlipTile title={item.title} body={item.body} />
            </Converge>
          ))}
        </div>

        <div className="mt-7">
          <Reveal>
            <p className="kicker text-blue-lift">Also in the kit</p>
          </Reveal>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {tier.capabilities
              .split("·")
              .map((c) => c.trim().replace(/\.$/, ""))
              .filter(Boolean)
              .map((cap, i) => (
                <Reveal as="li" key={cap} delay={i * 90}>
                  <span className="inline-block rounded-full bg-signature px-4 py-2 text-small text-paper transition-colors duration-300 ease-calm hover:bg-blue-lift">
                    {cap}
                  </span>
                </Reveal>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
