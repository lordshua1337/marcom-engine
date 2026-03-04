"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic email validation
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Dynamic import so static build succeeds even without Supabase env vars
      const { createSupabaseBrowser } = await import("@/lib/auth/client");
      const supabase = createSupabaseBrowser();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}/marcom-engine/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError(
        "Auth service not configured. Add Supabase keys to .env.local to enable sign-in."
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 40,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontSize: 14,
              fontFamily: "var(--font-mono)",
              color: "var(--accent)",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            MARCOM ENGINE
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Mission Control
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            Admin access only. Sign in with your magic link.
          </p>
        </div>

        {/* Success state */}
        {sent ? (
          <div
            style={{
              textAlign: "center",
              padding: 24,
              background: "var(--success-bg)",
              border: "1px solid var(--success-border)",
              borderRadius: 8,
              color: "var(--success-text)",
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 8 }}>
              Check your email
            </p>
            <p style={{ color: "#4ade80", fontSize: 14 }}>
              Magic link sent to {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 6,
                fontFamily: "var(--font-mono)",
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourdomain.com"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "var(--bg)",
                border: "1px solid var(--border-hover)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontSize: 16,
                outline: "none",
                marginBottom: 16,
                boxSizing: "border-box",
                fontFamily: "var(--font-sans)",
              }}
            />

            {error && (
              <p
                style={{
                  color: "var(--error)",
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: loading ? "var(--accent-dim)" : "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: "var(--font-sans)",
              }}
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        )}
      </div>

      {/* Back link */}
      <Link
        href="/"
        style={{
          marginTop: 24,
          fontSize: 13,
          color: "var(--text-dim)",
          textDecoration: "none",
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
