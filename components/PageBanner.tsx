import type { ReactNode } from "react";

type PageBannerProps = {
  /** Background banner image (placeholder until the real artwork is dropped in). */
  image: string;
  imageAlt?: string;
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Key info / CTAs surfaced above the fold, under the intro. */
  children?: ReactNode;
  /** Optional foreground figure (e.g. the About portrait) shown beside the copy. */
  figure?: ReactNode;
};

/**
 * Full-bleed page banner, the landing-style opening every section now uses.
 * A deep Ink band carries the (placeholder) banner image behind the headline,
 * sized so the key information lands above the fold without scrolling. An amber
 * hairline closes the band; a gradient keeps Paper-toned copy legible over any
 * image.
 */
export default function PageBanner({
  image,
  imageAlt = "",
  kicker,
  title,
  intro,
  children,
  figure,
}: PageBannerProps) {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] w-full items-center overflow-hidden bg-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-40 animate-fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink/80 to-ink/55" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-amber/50" aria-hidden />

      <div className="container-content relative z-10 py-14 sm:py-20">
        {figure ? (
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <Copy kicker={kicker} title={title} intro={intro}>
                {children}
              </Copy>
            </div>
            <div className="order-first lg:order-none">{figure}</div>
          </div>
        ) : (
          <Copy kicker={kicker} title={title} intro={intro}>
            {children}
          </Copy>
        )}
      </div>
    </section>
  );
}

function Copy({
  kicker,
  title,
  intro,
  children,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      {kicker ? (
        <p className="kicker text-amber animate-fade-up">{kicker}</p>
      ) : null}
      <h1 className="mt-6 max-w-4xl font-serif text-display font-light text-paper animate-hero-rise">
        {title}
      </h1>
      <span
        className="mt-10 block h-px w-16 bg-amber animate-fade-up"
        style={{ animationDelay: "160ms" }}
        aria-hidden
      />
      {intro ? (
        <div
          className="mt-8 max-w-2xl text-body text-paper/75 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          {intro}
        </div>
      ) : null}
      {children ? (
        <div className="mt-8 sm:mt-10 animate-fade-up" style={{ animationDelay: "320ms" }}>
          {children}
        </div>
      ) : null}
    </>
  );
}
