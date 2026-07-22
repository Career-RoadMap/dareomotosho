import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { trackById, temperamentFamilies } from "@/lib/pathfinder";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const trackId = request.nextUrl.searchParams.get("track") ?? "";
  const tCode = request.nextUrl.searchParams.get("t") ?? "";

  const track = trackById(trackId);
  if (!track) return new Response("Track not found", { status: 404 });

  // Derive temperament family from 4-letter code (mirrors temperamentOf logic).
  let tFamily: string | null = null;
  if (tCode.length === 4) {
    const key =
      tCode.includes("S") && tCode.includes("J")
        ? "SJ"
        : tCode.includes("S")
          ? "SP"
          : tCode.includes("T")
            ? "NT"
            : "NF";
    tFamily = temperamentFamilies[key]?.name ?? null;
  }

  const title = track.title;
  const hasTempament = Boolean(tCode && tFamily);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(170deg, #0F1B2D 0%, #1a2e4a 55%, #0F1B2D 100%)",
          padding: "72px 64px",
          color: "#F7F5F0",
        }}
      >
        {/* Top bar: kicker + site */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 6, height: 40, background: "#E0A951", borderRadius: 3 }} />
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#E0A951",
              }}
            >
              Cloud Career Path
            </div>
          </div>
          <div style={{ fontSize: 16, color: "rgba(247,245,240,0.35)" }}>
            dareomotosho.com
          </div>
        </div>

        {/* Role title */}
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(247,245,240,0.45)",
              marginBottom: 16,
            }}
          >
            Your path
          </div>
          <div
            style={{
              fontSize: title.length > 38 ? 46 : 58,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#F7F5F0",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 22,
              color: "rgba(247,245,240,0.6)",
              lineHeight: 1.5,
            }}
          >
            {track.tagline}
          </div>
        </div>

        {/* Temperament chip */}
        {hasTempament ? (
          <div
            style={{
              marginTop: 32,
              display: "flex",
              background: "rgba(224,169,81,0.12)",
              border: "1px solid rgba(224,169,81,0.4)",
              borderRadius: 14,
              padding: "14px 22px",
              gap: 16,
              alignItems: "center",
              width: "fit-content",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#E0A951",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Temperament
            </div>
            <div style={{ width: 1, height: 22, background: "rgba(224,169,81,0.4)" }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: "#F7F5F0" }}>{tCode}</div>
            <div style={{ fontSize: 20, color: "rgba(247,245,240,0.4)" }}>·</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "rgba(247,245,240,0.85)" }}>
              {tFamily}
            </div>
          </div>
        ) : null}

        {/* Roadmap preview */}
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#E0A951",
              marginBottom: 4,
            }}
          >
            Roadmap
          </div>
          {track.roadmap.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#E0A951",
                  minWidth: 40,
                  lineHeight: 1.1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 19, color: "rgba(247,245,240,0.85)", lineHeight: 1.3 }}>
                {r.step}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{ marginTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {track.certifications.map((c, i) => (
            <div
              key={i}
              style={{
                fontSize: 13,
                background: "rgba(30,58,95,0.9)",
                color: "#A8C4E0",
                borderRadius: 8,
                padding: "5px 14px",
                border: "1px solid rgba(168,196,224,0.3)",
              }}
            >
              {c}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(247,245,240,0.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "rgba(247,245,240,0.3)" }}>
            Educational reference only · Not professional advice
          </div>
          <div style={{ fontSize: 18, color: "#E0A951", fontWeight: 600 }}>
            Find your path in 3 minutes →
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 },
  );
}
