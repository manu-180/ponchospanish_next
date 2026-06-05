import { ImageResponse } from "next/og";

export const alt =
  "Poncho Spanish — Online Spanish lessons for kids & teens in the UK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social share card (used across the site unless a page overrides it).
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F2F0E9",
          padding: "72px 80px",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: "#E86C30",
            }}
          />
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 8,
              color: "#2A2521",
            }}
          >
            PONCHO SPANISH
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#2A2521",
              maxWidth: 980,
            }}
          >
            Online Spanish lessons for curious kids &amp; teens
          </div>
          <div style={{ fontSize: 34, color: "#7c6f63", maxWidth: 900 }}>
            Private classes, small groups, GCSE support &amp; an on-demand
            Academy — across the UK.
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 26,
              fontWeight: 600,
              color: "#C8841F",
            }}
          >
            Online · One-to-one · Group · GCSE
          </div>
          <div style={{ fontSize: 26, color: "#2A2521" }}>
            ponchospanish.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
