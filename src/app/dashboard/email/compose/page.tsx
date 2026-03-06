"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Code,
  Sparkles,
} from "lucide-react";

type Mode = "compose" | "preview";
type SendState = "idle" | "sending" | "sent" | "error";

const EMAIL_TEMPLATES = [
  {
    name: "Welcome Email",
    subject: "Welcome to {{company}} -- Here's what's next",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <h1 style="font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px;">Welcome aboard!</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #4a4a5a;">Thanks for signing up. We're excited to have you.</p>
  <p style="font-size: 16px; line-height: 1.6; color: #4a4a5a;">Here's what you can do next:</p>
  <ul style="font-size: 16px; line-height: 1.8; color: #4a4a5a;">
    <li>Complete your profile setup</li>
    <li>Explore the dashboard</li>
    <li>Invite your team members</li>
  </ul>
  <a href="#" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Get Started</a>
  <p style="font-size: 14px; color: #94a3b8; margin-top: 32px;">Questions? Just reply to this email.</p>
</div>`,
  },
  {
    name: "Product Update",
    subject: "New in {{product}}: {{feature}}",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; border-radius: 12px; margin-bottom: 24px;">
    <h1 style="font-size: 24px; font-weight: 700; color: white; margin: 0;">Something new just dropped</h1>
  </div>
  <p style="font-size: 16px; line-height: 1.6; color: #4a4a5a;">We've been working on something we think you'll love.</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 16px 0;">
    <h2 style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 8px;">Feature Name</h2>
    <p style="font-size: 14px; line-height: 1.5; color: #64748b; margin: 0;">Brief description of what this feature does and why it matters.</p>
  </div>
  <a href="#" style="display: inline-block; margin-top: 8px; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Try It Now</a>
</div>`,
  },
  {
    name: "Blank Email",
    subject: "",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <p style="font-size: 16px; line-height: 1.6; color: #4a4a5a;">Write your email content here.</p>
</div>`,
  },
];

export default function ComposeEmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState(EMAIL_TEMPLATES[2].body);
  const [mode, setMode] = useState<Mode>("compose");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [sentLog, setSentLog] = useState<Array<{ to: string; subject: string; sentAt: string }>>([]);

  // Check API availability
  useEffect(() => {
    fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => setIsLive(res.status !== 503))
      .catch(() => setIsLive(false));

    // Load sent log
    try {
      const raw = localStorage.getItem("marcom-sent-log");
      if (raw) setSentLog(JSON.parse(raw));
    } catch { /* empty */ }
  }, []);

  const loadTemplate = useCallback((idx: number) => {
    setSubject(EMAIL_TEMPLATES[idx].subject);
    setHtmlBody(EMAIL_TEMPLATES[idx].body);
  }, []);

  const handleSend = useCallback(async () => {
    if (!to.trim() || !subject.trim()) return;
    setSendState("sending");
    setSendError(null);

    try {
      if (isLive) {
        const res = await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: to.trim(), subject: subject.trim(), html: htmlBody }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Send failed");
        setSendState("sent");
      } else {
        // Demo mode -- simulate send
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSendState("sent");
      }

      // Log the send
      const entry = { to: to.trim(), subject: subject.trim(), sentAt: new Date().toISOString() };
      const updated = [entry, ...sentLog].slice(0, 20);
      setSentLog(updated);
      localStorage.setItem("marcom-sent-log", JSON.stringify(updated));
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Send failed");
      setSendState("error");
    }
  }, [to, subject, htmlBody, isLive, sentLog]);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Link
          href="/dashboard"
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Compose Email</h1>
        </div>
        <span
          style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600,
            background: isLive ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
            color: isLive ? "#22c55e" : "#f59e0b",
          }}
        >
          {isLive === null ? "Checking..." : isLive ? "Resend Connected" : "Demo Mode"}
        </span>
      </div>

      {sendState === "sent" ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <CheckCircle size={48} color="#22c55e" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            {isLive ? "Email Sent!" : "Email Sent (Demo)"}
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
            {isLive ? `Delivered to ${to}` : `Simulated delivery to ${to}. Add RESEND_API_KEY to send real emails.`}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => { setSendState("idle"); setTo(""); setSubject(""); setHtmlBody(EMAIL_TEMPLATES[2].body); }}
              style={{
                padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "var(--accent)", color: "white", border: "none",
              }}
            >
              Compose Another
            </button>
            <Link
              href="/dashboard"
              style={{
                padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)", textDecoration: "none",
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
          {/* Main Compose Area */}
          <div>
            {/* Template Selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: "var(--text-dim)", alignSelf: "center", marginRight: 4 }}>Templates:</span>
              {EMAIL_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={tmpl.name}
                  onClick={() => loadTemplate(idx)}
                  style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                    background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)",
                  }}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>

            {/* To Field */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                To
              </label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14,
                  background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            {/* Subject Field */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14,
                  background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            {/* Mode Toggle */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              <button
                onClick={() => setMode("compose")}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: mode === "compose" ? "var(--accent)" : "var(--surface)",
                  color: mode === "compose" ? "white" : "var(--text-secondary)",
                  border: mode === "compose" ? "none" : "1px solid var(--border)",
                }}
              >
                <Code size={12} /> HTML
              </button>
              <button
                onClick={() => setMode("preview")}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: mode === "preview" ? "var(--accent)" : "var(--surface)",
                  color: mode === "preview" ? "white" : "var(--text-secondary)",
                  border: mode === "preview" ? "none" : "1px solid var(--border)",
                }}
              >
                <Eye size={12} /> Preview
              </button>
            </div>

            {/* Body */}
            {mode === "compose" ? (
              <textarea
                value={htmlBody}
                onChange={(e) => setHtmlBody(e.target.value)}
                rows={18}
                style={{
                  width: "100%", padding: "14px", borderRadius: 8, fontSize: 13,
                  fontFamily: "var(--font-mono)", lineHeight: 1.5, resize: "vertical",
                  background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            ) : (
              <div
                style={{
                  background: "#ffffff", borderRadius: 8, padding: 0, minHeight: 400,
                  border: "1px solid var(--border)", overflow: "hidden",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
              </div>
            )}

            {/* Send Error */}
            {sendState === "error" && sendError && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginTop: 12,
                padding: "10px 14px", borderRadius: 8, background: "var(--error-bg)", color: "#ef4444", fontSize: 13,
              }}>
                <AlertCircle size={14} /> {sendError}
              </div>
            )}

            {/* Send Button */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                onClick={handleSend}
                disabled={!to.trim() || !subject.trim() || sendState === "sending"}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
                  background: !to.trim() || !subject.trim() ? "var(--border)" : "var(--accent)",
                  color: "white", border: "none", opacity: sendState === "sending" ? 0.7 : 1,
                }}
              >
                {sendState === "sending" ? (
                  <><Loader2 size={14} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={14} /> Send Email</>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar: Recent Sends */}
          <div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: "var(--text-secondary)" }}>
                Recent Sends
              </h3>
              {sentLog.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--text-dim)" }}>No emails sent yet this session.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {sentLog.slice(0, 8).map((entry, idx) => (
                    <div key={idx} style={{ padding: "8px 10px", borderRadius: 6, background: "var(--bg-nav)" }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{entry.subject || "(no subject)"}</div>
                      <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>
                        To: {entry.to} -- {new Date(entry.sentAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginTop: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>
                <Sparkles size={14} color="var(--accent)" /> Tips
              </h3>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                <p style={{ margin: "0 0 8px" }}>Use HTML for full control over email layout and styling.</p>
                <p style={{ margin: "0 0 8px" }}>Click <strong>Preview</strong> to see how the email will look.</p>
                <p style={{ margin: 0 }}>
                  {isLive
                    ? "Emails are sent via Resend. Check your Resend dashboard for delivery analytics."
                    : "Add RESEND_API_KEY in Vercel to send real emails."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
