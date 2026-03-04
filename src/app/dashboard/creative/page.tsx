"use client";

import Link from "next/link";

export default function CreativeEnginePage() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Creative Engine
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Standalone asset generator. Create social graphics, ad creatives, email
        headers, and hero images.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--text-primary)",
            }}
          >
            Generate Asset
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Describe what you need. Claude refines into a Flux prompt. Pick
            platform dimensions and generate.
          </p>
          <Link
            href="/dashboard/creative/generate"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            Start Creating
          </Link>
        </div>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--text-primary)",
            }}
          >
            Asset Library
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Browse all generated assets. Download or push to social queue.
          </p>
          <Link
            href="/dashboard/creative/library"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            View Library
          </Link>
        </div>
      </div>
    </div>
  );
}
