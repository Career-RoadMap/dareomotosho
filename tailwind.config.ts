import type { Config } from "tailwindcss";

/**
 * Design system — strict 5-color token set.
 * Reference colors semantically (background, foreground, primary, link, accent);
 * the raw token names exist for the rare case a literal hex name reads clearer.
 * Do NOT introduce colors outside this set.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Raw tokens (exact hex from brand spec)
        ink: "#0F1B2D", // near-black, blue undertone — TEXT/contrast only
        signature: "#1E3A5F", // the brand heart — deep, calm, unsaturated
        "blue-lift": "#3D6491", // lighter blue — interactive/links only
        paper: "#F7F5F0", // warm off-white — primary background
        amber: "#E0A951", // the ONE warm accent — fresh, muted, never neon

        /**
         * Hover fills, deliberately SOLID.
         *
         * Hover states used to be alpha washes (bg-ink/[0.03] and friends),
         * which read as see-through and muddy over anything but flat Paper.
         * These are those exact blends flattened to opaque hex, so the fill is
         * solid. They are composites of the five brand tokens, not new brand
         * colors — do not use them as fills for anything other than an
         * interactive hover/active state.
         *
         * The first pass flattened the washes at their original strengths,
         * which made them technically solid and practically invisible:
         * hover-surface sat at a 1.10 contrast ratio against Paper, so tiles
         * "did not highlight" even though the rule was firing. Both are now
         * pitched to be seen — roughly a 1.2-1.3 ratio against Paper, which
         * reads as a highlight without shouting. Ink text stays above 12:1 on
         * either, so nothing is at risk of failing contrast.
         *
         * If you weaken these again, check them on a real screen rather than
         * in the hex: the failure mode is silent, because the CSS is correct.
         */
        "hover-surface": "#DCDBD7", // Paper under 12% Ink
        "hover-amber": "#EFDFC4", // Paper under 22% Amber
        "hover-ink": "#263141", // Ink under 10% Paper (hovers on dark cards)
        "hover-dot": "#9A9EA2", // Paper under 40% Ink (gallery dots)
        "dot-idle": "#C9C9C9", // Paper under 20% Ink

        // Semantic aliases
        background: "#F7F5F0",
        foreground: "#0F1B2D",
        primary: {
          DEFAULT: "#1E3A5F",
          foreground: "#F7F5F0",
        },
        link: "#3D6491",
        accent: {
          DEFAULT: "#E0A951",
          foreground: "#0F1B2D",
        },
      },
      fontFamily: {
        // Headlines/display carry gravitas + warmth; body carries clarity.
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tight type scale — ~5 sizes only. Emphasis comes from size + space.
        small: ["0.875rem", { lineHeight: "1.6" }],
        body: ["1.0625rem", { lineHeight: "1.7" }],
        h2: ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h1: ["clamp(2.5rem, 6vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        display: ["clamp(3rem, 8vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
      },
      letterSpacing: {
        kicker: "0.18em", // small-caps kickers/labels — slightly open
      },
      maxWidth: {
        prose: "65ch",
        content: "72rem",
      },
      transitionTimingFunction: {
        // ease-out / ease-in-out only. No spring, no bounce.
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        reveal: "700ms",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "hero-rise": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-rise": "hero-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
