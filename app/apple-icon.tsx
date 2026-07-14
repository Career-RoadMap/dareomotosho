import { ImageResponse } from "next/og";

/**
 * Apple touch icon, generated at build time. The plain "DO" initials from
 * app/icon.svg, set on Paper here because iOS tiles don't support
 * transparency well.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F5F0",
          color: "#1E3A5F",
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: "-2px",
        }}
      >
        DO
      </div>
    ),
    size,
  );
}
