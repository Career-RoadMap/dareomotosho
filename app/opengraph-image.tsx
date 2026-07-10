import { ImageResponse } from "next/og";
import { brand } from "@/lib/site";

/**
 * Site-wide Open Graph share card, generated at build time. Deep Signature
 * ground, Paper type, one amber rule — the same restraint as the site itself.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${brand.name}, ${brand.byline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "linear-gradient(135deg, #0F1B2D 0%, #1E3A5F 100%)",
          color: "#F7F5F0",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 88,
            height: 10,
            borderRadius: 5,
            background: "#E0A951",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 88,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 38,
            color: "#E0A951",
            letterSpacing: "0.08em",
          }}
        >
          {brand.byline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            maxWidth: 900,
            fontSize: 32,
            lineHeight: 1.45,
            color: "rgba(247, 245, 240, 0.75)",
          }}
        >
          {brand.oneLine}
        </div>
      </div>
    ),
    size,
  );
}
