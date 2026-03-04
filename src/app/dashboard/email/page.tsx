"use client";

import Link from "next/link";

export default function EmailEnginePage() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Email Engine
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Campaign builder, email sequences, inbound processing, and delivery
        tracking.
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
            Campaigns
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Create AI-generated email sequences targeting your contact lists.
          </p>
          <Link
            href="/dashboard/email/campaigns"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            Manage Campaigns
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
            Inbound
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            View incoming emails classified by AI with draft responses.
          </p>
          <Link
            href="/dashboard/email/inbound"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            View Inbound
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
            Send Log
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Track delivery status: sent, opened, clicked, bounced.
          </p>
        </div>
      </div>
    </div>
  );
}
