import { Fraunces, Inter } from "next/font/google";

/**
 * Headlines / display — Fraunces, a warm "soft serif".
 * Restrained weights only (Light + Medium). Optical sizing on for display.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "500"],
  variable: "--font-fraunces",
});

/**
 * Body / UI / labels — Inter. Clean, neutral, gets out of the way.
 * Regular + one emphasis weight (Medium).
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-inter",
});
