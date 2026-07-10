import { ImageResponse } from "next/og";

/**
 * Apple touch icon, generated at build time. Same monogram as app/icon.svg,
 * sized and slightly larger-set for the home-screen tile.
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E3A5F",
          color: "#F7F5F0",
          fontSize: 84,
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex" }}>DO</div>
        <div
          style={{
            width: 56,
            height: 8,
            marginTop: 6,
            borderRadius: 4,
            background: "#E0A951",
          }}
        />
      </div>
    ),
    size,
  );
}
