import { toolkit } from "@/lib/content";

/**
 * Toolkit marquee, a continuous, unhurried roll of tool logos along the
 * bottom of the toolkit section. The track is rendered twice so the CSS
 * translateX(-50%) loop is seamless; it pauses on hover and freezes under
 * prefers-reduced-motion (handled globally in globals.css).
 *
 * Logos are the official brand glyphs (Simple Icons set), rendered in the
 * site's ink tone with the tool name set beside each mark.
 */
export default function LogoMarquee() {
  const loop = [...toolkit, ...toolkit];

  return (
    <div
      className="marquee relative overflow-hidden py-2"
      aria-label="Tools and services in the toolkit"
      style={{
        // Alpha mask only (not a color gradient), softens the two edges so
        // logos roll in and out rather than clipping hard.
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <ul className="marquee-track flex w-max items-center gap-10 sm:gap-14">
        {loop.map((tool, i) => (
          <li
            key={`${tool.name}-${i}`}
            className="flex shrink-0 items-center gap-3 opacity-70 transition-opacity duration-300 ease-calm hover:opacity-100"
            aria-hidden={i >= toolkit.length}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.logo}
              alt={tool.name}
              width={32}
              height={32}
              loading="lazy"
              className="h-8 w-8"
            />
            <span className="whitespace-nowrap text-small font-medium text-ink">
              {tool.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
