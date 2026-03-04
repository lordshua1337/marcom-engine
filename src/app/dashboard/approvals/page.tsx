"use client";

const DEMO_APPROVALS = [
  {
    id: "apr-001",
    type: "EMAIL",
    subject: "Q1 Product Launch Announcement",
    confidence: 0.92,
    priority: "normal" as const,
  },
  {
    id: "apr-002",
    type: "SOCIAL",
    subject: "LinkedIn: Industry Trends Post",
    confidence: 0.87,
    priority: "normal" as const,
  },
  {
    id: "apr-003",
    type: "INBOUND",
    subject: "Re: Partnership Inquiry from Acme Corp",
    confidence: 0.74,
    priority: "urgent" as const,
  },
] as const;

export default function ApprovalsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Approval Queue
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>
        Review pending emails, social posts, and inbound responses before they
        go live.
      </p>
      <p
        style={{
          color: "var(--text-dim)",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          marginBottom: 24,
        }}
      >
        Keyboard: A = Approve | R = Reject | E = Edit | J/K = Next/Prev
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DEMO_APPROVALS.map((item) => (
          <div
            key={item.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background:
                    item.priority === "urgent"
                      ? "var(--error-bg)"
                      : "var(--surface)",
                  color:
                    item.priority === "urgent"
                      ? "var(--error)"
                      : "var(--text-secondary)",
                  border: `1px solid ${item.priority === "urgent" ? "#991b1b" : "var(--border)"}`,
                }}
              >
                {item.type}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                {item.subject}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                AI: {Math.round(item.confidence * 100)}%
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  padding: "4px 12px",
                  background: "var(--success-bg)",
                  border: "1px solid var(--success-border)",
                  borderRadius: 4,
                  color: "#4ade80",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Approve
              </button>
              <button
                style={{
                  padding: "4px 12px",
                  background: "var(--error-bg)",
                  border: "1px solid #991b1b",
                  borderRadius: 4,
                  color: "var(--error)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
