import { ImageResponse } from "next/og";
import { trackById } from "@/lib/pathfinder";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: id } = await params;
  const track = trackById(id);
  const title = track?.title ?? "Cloud Career Path";
  const tagline = track?.tagline ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0F1B2D 0%, #1E3A5F 100%)",
          color: "#F7F5F0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 80,
              height: 9,
              borderRadius: 5,
              background: "#E0A951",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 26,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#E0A951",
            }}
          >
            Cloud Career Path
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              maxWidth: 1000,
              fontSize: title.length > 34 ? 62 : 76,
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {tagline ? (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                maxWidth: 940,
                fontSize: 30,
                lineHeight: 1.4,
                color: "rgba(247, 245, 240, 0.72)",
              }}
            >
              {tagline}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            <div style={{ display: "flex", fontSize: 26, color: "#E0A951" }}>
              Find your path in 3 minutes
            </div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 24, color: "rgba(247,245,240,0.85)" }}>
              dareomotosho.com/path-finder
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
