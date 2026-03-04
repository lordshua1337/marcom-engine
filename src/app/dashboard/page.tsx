"use client";

import Link from "next/link";

/* -----------------------------------------------------------
   Static demo data for GitHub Pages static export.
   When Supabase is connected, these would come from API calls.
   ----------------------------------------------------------- */

const DEMO_STATS = [
  { label: "Emails Sent", value: "1,247", sub: "7 days" },
  { label: "Posts Published", value: "38", sub: "7 days" },
  { label: "Pending Approvals", value: "3", sub: "needs review" },
  { label: "Total Contacts", value: "4,892", sub: "in database" },
] as const;

interface Connection {
  readonly service: string;
  readonly label: string;
  readonly status: "connected" | "unconfigured" | "error";
  readonly detail: string;
}

const DEMO_CONNECTIONS: readonly Connection[] = [
  { service: "supabase", label: "Supabase", status: "connected", detail: "OK 2m ago" },
  { service: "anthropic", label: "Anthropic (Claude)", status: "connected", detail: "OK 2m ago" },
  { service: "resend", label: "Resend", status: "connected", detail: "OK 5m ago" },
  { service: "ayrshare", label: "Ayrshare", status: "connected", detail: "OK 5m ago" },
  { service: "apollo", label: "Apollo.io", status: "unconfigured", detail: "Not configured" },
  { service: "cloudflare_email", label: "Cloudflare Email", status: "unconfigured", detail: "Not configured" },
  { service: "flux_local", label: "Flux (Local)", status: "unconfigured", detail: "Not configured" },
] as const;

interface Engine {
  readonly name: string;
  readonly label: string;
  readonly desc: string;
  readonly locked: boolean;
}

const DEMO_ENGINES: readonly Engine[] = [
  {
    name: "email",
    label: "Email Engine",
    desc: "Campaign sequences, inbound processing, delivery tracking",
    locked: false,
  },
  {
    name: "social",
    label: "Social Engine",
    desc: "Multi-platform posting, AI captions, image generation",
    locked: false,
  },
  {
    name: "creative",
    label: "Creative Studio",
    desc: "Standalone asset generator, Flux integration",
    locked: true,
  },
  {
    name: "contacts",
    label: "Contact Intelligence",
    desc: "Database, CSV import, Apollo enrichment, lists",
    locked: true,
  },
] as const;

/* -----------------------------------------------------------
   Status dot component
   ----------------------------------------------------------- */

function StatusDot({ status }: { status: Connection["status"] }) {
  const colors: Record<string, string> = {
    connected: "var(--connected)",
    error: "var(--error)",
    unconfigured: "var(--unconfigured)",
  };

  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: colors[status] ?? "var(--unconfigured)",
        flexShrink: 0,
      }}
    />
  );
}

/* -----------------------------------------------------------
   Lock icon (inline SVG, no external deps)
   ----------------------------------------------------------- */

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-dim)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* -----------------------------------------------------------
   Dashboard page
   ----------------------------------------------------------- */

export default function DashboardPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Page title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Mission Control
        </h1>
        <span
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--text-dim)",
          }}
        >
          Static demo -- connect Supabase for live data
        </span>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {DEMO_STATS.map((card) => (
          <div
            key={card.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: "var(--text-primary)",
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-dim)",
                marginTop: 4,
              }}
            >
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Connections panel */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              letterSpacing: 1,
              margin: 0,
            }}
          >
            CONNECTIONS
          </h2>
          <Link
            href="/dashboard/connections"
            style={{
              fontSize: 12,
              color: "var(--accent)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
            }}
          >
            Manage
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DEMO_CONNECTIONS.map((conn) => (
            <div
              key={conn.service}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 6,
                background:
                  conn.status === "unconfigured"
                    ? "transparent"
                    : "var(--bg-nav)",
                opacity: conn.status === "unconfigured" ? 0.5 : 1,
              }}
            >
              <StatusDot status={conn.status} />
              <span
                style={{
                  width: 180,
                  fontWeight: 500,
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                {conn.label}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  color:
                    conn.status === "connected"
                      ? "var(--connected)"
                      : conn.status === "error"
                        ? "var(--error)"
                        : "var(--text-dim)",
                }}
              >
                {conn.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Engine status cards */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 16,
          fontFamily: "var(--font-mono)",
          letterSpacing: 1,
        }}
      >
        ENGINES
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {DEMO_ENGINES.map((engine) => (
          <div
            key={engine.name}
            style={{
              background: "var(--surface)",
              border: `1px solid ${engine.locked ? "var(--border)" : "var(--border)"}`,
              borderRadius: 8,
              padding: 20,
              opacity: engine.locked ? 0.5 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--text-primary)",
                }}
              >
                {engine.label}
              </h3>
              {engine.locked && <LockIcon />}
              {!engine.locked && (
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: "var(--success-bg)",
                    color: "#4ade80",
                  }}
                >
                  READY
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              {engine.desc}
            </p>
            {engine.locked && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--error)",
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                Connect missing services to unlock
              </p>
            )}
            {!engine.locked && (
              <Link
                href={`/dashboard/${engine.name}`}
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Open Engine
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
