import { ImageResponse } from "next/og";

// Branded favicon — a charcoal tile with a cream "P" monogram. Generated so we
// don't ship a squished wide logo as the favicon.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#2A2521",
          color: "#F2F0E9",
          fontSize: 46,
          fontWeight: 700,
        }}
      >
        P
      </div>
    ),
    size,
  );
}
