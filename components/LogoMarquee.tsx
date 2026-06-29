import { toolkit } from "@/lib/content";

/**
 * Toolkit marquee — a continuous, unhurried roll of tool logos along the
 * bottom of the toolkit section. The track is rendered twice so the CSS
 * translateX(-50%) loop is seamless; it pauses on hover and freezes under
 * prefers-reduced-motion (handled globally in globals.css).
 *
 * Logos are placeholders in /public/logos — swap each for the official asset.
 */
export default function LogoMarquee() {
  const loop = [...toolkit, ...toolkit];

  return (
    <div
      className="marquee relative overflow-hidden py-2"
      aria-label="Tools and services in the toolkit"
      style={{
        // Alpha mask only (not a color gradient) — softens the two edges so
        // logos roll in and out rather than clipping hard.
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <ul className="marquee-track flex w-max items-center gap-10 sm:gap-14">
        {loop.map((tool, i) => (
          <li key={`${tool.name}-${i}`} className="shrink-0" aria-hidden={i >= toolkit.length}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.logo}
              alt={tool.name}
              width={180}
              height={48}
              loading="lazy"
              className="h-11 w-auto opacity-75 transition-opacity duration-300 ease-calm hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
