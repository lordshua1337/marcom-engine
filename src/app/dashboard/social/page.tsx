"use client";

import Link from "next/link";

export default function SocialEnginePage() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Social Engine
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Multi-platform posting with AI captions and Flux image generation.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
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
            Post Queue
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            View and manage scheduled posts across all platforms.
          </p>
          <Link
            href="/dashboard/social/posts"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            View Queue
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
            Create Post
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Generate AI captions and images for Twitter, Instagram, LinkedIn,
            Facebook.
          </p>
          <Link
            href="/dashboard/social/posts/new"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            New Post
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
            Analytics
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Per-platform performance metrics and engagement tracking.
          </p>
          <Link
            href="/dashboard/social/analytics"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
