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
