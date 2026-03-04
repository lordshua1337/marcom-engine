"use client";

interface ConnectionDetail {
  readonly service: string;
  readonly label: string;
  readonly description: string;
  readonly status: "connected" | "unconfigured" | "error";
  readonly docs: string;
}

const DEMO_CONNECTIONS: readonly ConnectionDetail[] = [
  {
    service: "supabase",
    label: "Supabase",
    description: "Database, auth, and storage",
    status: "connected",
    docs: "https://supabase.com/dashboard",
  },
  {
    service: "anthropic",
    label: "Anthropic (Claude)",
    description: "AI copy generation for emails and social posts",
    status: "connected",
    docs: "https://console.anthropic.com",
  },
  {
    service: "resend",
    label: "Resend",
    description: "Transactional and campaign email sending",
    status: "connected",
    docs: "https://resend.com/api-keys",
  },
  {
    service: "ayrshare",
    label: "Ayrshare",
    description: "Multi-platform social media posting",
    status: "connected",
    docs: "https://www.ayrshare.com/dashboard",
  },
  {
    service: "apollo",
    label: "Apollo.io",
    description: "Contact enrichment and lead data",
    status: "unconfigured",
    docs: "https://developer.apollo.io",
  },
  {
    service: "cloudflare_email",
    label: "Cloudflare Email",
    description: "Inbound email routing via webhook",
    status: "unconfigured",
    docs: "https://dash.cloudflare.com",
  },
  {
    service: "flux_local",
    label: "Flux (Local)",
    description: "AI image generation on Mac Studio",
    status: "unconfigured",
    docs: "",
  },
];

function StatusDot({ status }: { status: ConnectionDetail["status"] }) {
  const colors: Record<string, string> = {
    connected: "var(--connected)",
    error: "var(--error)",
    unconfigured: "var(--unconfigured)",
  };

  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: colors[status] ?? "var(--unconfigured)",
        flexShrink: 0,
      }}
    />
  );
}

export default function ConnectionsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Connection Manager
        </h1>
        <span
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--text-dim)",
          }}
        >
          Static demo
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DEMO_CONNECTIONS.map((conn) => {
          const statusLabel =
            conn.status === "connected"
              ? "CONNECTED"
              : conn.status === "error"
                ? "ERROR"
                : "UNCONFIGURED";
          const statusBg =
            conn.status === "connected"
              ? "var(--success-bg)"
              : conn.status === "error"
                ? "var(--error-bg)"
                : "var(--surface)";
          const statusColor =
            conn.status === "connected"
              ? "var(--connected)"
              : conn.status === "error"
                ? "var(--error)"
                : "var(--text-dim)";

          return (
            <div
              key={conn.service}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <StatusDot status={conn.status} />
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  {conn.label}
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: statusBg,
                    color: statusColor,
                  }}
                >
                  {statusLabel}
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  margin: "0 0 0 22px",
                }}
              >
                {conn.description}
              </p>
              {conn.status === "unconfigured" && conn.docs && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    margin: "8px 0 0 22px",
                  }}
                >
                  Add the API key to your .env.local file.{" "}
                  <a
                    href={conn.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent-hover)" }}
                  >
                    Get API key
                  </a>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
