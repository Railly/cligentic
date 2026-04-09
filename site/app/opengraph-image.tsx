import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "cligentic: Copy-paste CLI blocks for the agent era";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG image — rendered server-side by Next.js at build/request time.
 * Mirrors the landing hero aesthetic: pitch-black, swiss headline,
 * single orange accent, hairline frame.
 */
export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        padding: "80px",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      {/* Hairline frame */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          right: 40,
          height: 1,
          background: "#1A1A1A",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          height: 1,
          background: "#1A1A1A",
        }}
      />

      {/* Header: logo top-left */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          cligentic
        </span>
        <div style={{ width: 18, height: 18, background: "#FF6B1A" }} />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1, display: "flex" }} />

      {/* Headline */}
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: "-3px",
          maxWidth: 1000,
          display: "flex",
        }}
      >
        Your CLI is the last thing agents touch.
      </div>

      {/* Subtitle */}
      <div
        style={{
          color: "#8A8A8A",
          fontSize: 24,
          marginTop: 28,
          maxWidth: 800,
          lineHeight: 1.4,
          display: "flex",
        }}
      >
        Copy-paste CLI blocks for the agent era. Own your primitives.
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#FF6B1A",
            color: "#000000",
            padding: "14px 20px",
            borderRadius: 10,
            fontSize: 18,
            fontFamily: "monospace",
            fontWeight: 500,
          }}
        >
          bunx shadcn add cligentic.railly.dev/r/next-steps.json
        </div>
        <div
          style={{
            color: "#4A4A4A",
            fontSize: 16,
            display: "flex",
          }}
        >
          cligentic.railly.dev
        </div>
      </div>
    </div>,
    { ...size },
  );
}
