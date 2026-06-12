"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf7f2",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c0392b",
            marginBottom: "1rem",
          }}
        >
          Something went wrong
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#2c2c2c",
            marginBottom: "0.75rem",
          }}
        >
          Poncho Spanish
        </h1>
        <p style={{ color: "#888", marginBottom: "2rem" }}>
          An unexpected error occurred. Try refreshing the page.
        </p>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#e8a020",
            color: "#fff",
            border: "none",
            borderRadius: "9999px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
