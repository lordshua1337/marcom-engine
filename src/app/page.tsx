import Link from "next/link";

const FEATURES = [
  {
    title: "Email Engine",
    description:
      "AI-generated campaign sequences, inbound classification, delivery tracking. Resend + Claude powered.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
  {
    title: "Social Engine",
    description:
      "Multi-platform posting with AI captions, image generation, and scheduled publishing via Ayrshare.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
  {
    title: "Creative Studio",
    description:
      "Standalone asset generator powered by Flux. Create branded images, social cards, and campaign visuals.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    title: "Contact Intelligence",
    description:
      "Database management, CSV import, Apollo enrichment, smart lists, and segmentation.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
] as const;

const STATS = [
  { label: "7 Integrations", sub: "Connected services" },
  { label: "AI-Powered", sub: "Claude + Flux" },
  { label: "Full Automation", sub: "End-to-end pipelines" },
] as const;

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Minimal top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-nav)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--accent)",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 2,
          }}
        >
          MARCOM ENGINE
        </span>
        <Link
          href="/auth"
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "80px 32px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--accent)",
            letterSpacing: 1,
            marginBottom: 24,
          }}
        >
          INTERNAL PLATFORM v0.1
        </div>

        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 20px",
            color: "var(--text-primary)",
          }}
        >
          Marcom Engine
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: 600,
            margin: "0 auto 40px",
          }}
        >
          Internal marketing automation platform. Email campaigns, social
          posting, AI creative -- one mission control dashboard.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            Launch Mission Control
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/auth"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 32px",
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 32px 64px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 24,
              }}
            >
              <div style={{ marginBottom: 16 }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: "var(--text-primary)",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 32px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            borderTop: "1px solid var(--border)",
            paddingTop: 48,
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 32px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono)",
          }}
        >
          MARCOM ENGINE v0.1 -- Internal Use Only
        </span>
      </footer>
    </div>
  );
}
