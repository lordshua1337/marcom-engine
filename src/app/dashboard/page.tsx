"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  BarChart3,
  ArrowUpRight,
  Circle,
} from "lucide-react";

// -- Demo data seeded on first visit via localStorage --

const STORAGE_KEY = "marcom-dashboard-state";

interface DashboardState {
  readonly emailsSent: number;
  readonly emailsOpened: number;
  readonly postsPublished: number;
  readonly pendingApprovals: number;
  readonly totalContacts: number;
  readonly openRate: number;
  readonly clickRate: number;
  readonly activityLog: readonly ActivityEntry[];
  readonly campaigns: readonly CampaignEntry[];
  readonly seededAt: string;
}

interface ActivityEntry {
  readonly id: string;
  readonly type: "email_sent" | "post_published" | "contact_added" | "campaign_started" | "approval_needed";
  readonly message: string;
  readonly timestamp: string;
}

interface CampaignEntry {
  readonly id: string;
  readonly name: string;
  readonly status: "active" | "draft" | "completed" | "paused";
  readonly sent: number;
  readonly opened: number;
  readonly clicked: number;
  readonly createdAt: string;
}

interface Connection {
  readonly service: string;
  readonly label: string;
  readonly status: "connected" | "unconfigured" | "checking";
  readonly detail: string;
}

function seedDashboardState(): DashboardState {
  const now = new Date();
  const activities: ActivityEntry[] = [
    { id: "a1", type: "email_sent", message: "Welcome sequence sent to 142 new contacts", timestamp: new Date(now.getTime() - 8 * 60000).toISOString() },
    { id: "a2", type: "campaign_started", message: "Q1 Product Launch campaign activated", timestamp: new Date(now.getTime() - 25 * 60000).toISOString() },
    { id: "a3", type: "post_published", message: "LinkedIn thought leadership post published", timestamp: new Date(now.getTime() - 48 * 60000).toISOString() },
    { id: "a4", type: "contact_added", message: "87 contacts imported from CSV upload", timestamp: new Date(now.getTime() - 90 * 60000).toISOString() },
    { id: "a5", type: "approval_needed", message: "Email draft 'March Newsletter' needs review", timestamp: new Date(now.getTime() - 120 * 60000).toISOString() },
    { id: "a6", type: "email_sent", message: "Re-engagement campaign sent to 328 dormant contacts", timestamp: new Date(now.getTime() - 180 * 60000).toISOString() },
    { id: "a7", type: "post_published", message: "Twitter thread on product updates auto-posted", timestamp: new Date(now.getTime() - 240 * 60000).toISOString() },
    { id: "a8", type: "campaign_started", message: "Onboarding drip sequence activated for tier 2", timestamp: new Date(now.getTime() - 360 * 60000).toISOString() },
  ];

  const campaigns: CampaignEntry[] = [
    { id: "c1", name: "Q1 Product Launch", status: "active", sent: 1247, opened: 412, clicked: 89, createdAt: new Date(now.getTime() - 5 * 86400000).toISOString() },
    { id: "c2", name: "Welcome Sequence", status: "active", sent: 892, opened: 534, clicked: 156, createdAt: new Date(now.getTime() - 14 * 86400000).toISOString() },
    { id: "c3", name: "Re-engagement Series", status: "completed", sent: 2100, opened: 630, clicked: 84, createdAt: new Date(now.getTime() - 30 * 86400000).toISOString() },
    { id: "c4", name: "March Newsletter", status: "draft", sent: 0, opened: 0, clicked: 0, createdAt: new Date(now.getTime() - 2 * 86400000).toISOString() },
    { id: "c5", name: "Feature Announcement", status: "paused", sent: 450, opened: 180, clicked: 32, createdAt: new Date(now.getTime() - 7 * 86400000).toISOString() },
  ];

  return {
    emailsSent: 4689,
    emailsOpened: 1756,
    postsPublished: 38,
    pendingApprovals: 3,
    totalContacts: 4892,
    openRate: 37.4,
    clickRate: 7.8,
    activityLog: activities,
    campaigns,
    seededAt: now.toISOString(),
  };
}

function loadDashboardState(): DashboardState {
  if (typeof window === "undefined") return seedDashboardState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DashboardState;
    const state = seedDashboardState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  } catch {
    return seedDashboardState();
  }
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const ACTIVITY_ICONS: Record<ActivityEntry["type"], typeof Mail> = {
  email_sent: Send,
  post_published: BarChart3,
  contact_added: Users,
  campaign_started: Zap,
  approval_needed: Clock,
};

const ACTIVITY_COLORS: Record<ActivityEntry["type"], string> = {
  email_sent: "var(--accent)",
  post_published: "#22c55e",
  contact_added: "#06b6d4",
  campaign_started: "#f59e0b",
  approval_needed: "#ef4444",
};

const STATUS_COLORS: Record<CampaignEntry["status"], string> = {
  active: "#22c55e",
  draft: "var(--text-dim)",
  completed: "var(--accent)",
  paused: "#f59e0b",
};

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "live" | "demo">("checking");

  useEffect(() => {
    setState(loadDashboardState());
    // Check if Resend is configured
    fetch("/api/email/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      .then((res) => setApiStatus(res.status === 503 ? "demo" : res.status === 400 ? "live" : "demo"))
      .catch(() => setApiStatus("demo"));
  }, []);

  const connections: Connection[] = useMemo(() => [
    { service: "resend", label: "Resend (Email)", status: apiStatus === "live" ? "connected" : apiStatus === "checking" ? "checking" : "unconfigured", detail: apiStatus === "live" ? "API connected" : apiStatus === "checking" ? "Checking..." : "Add RESEND_API_KEY" },
    { service: "supabase", label: "Supabase", status: "unconfigured", detail: "Not configured" },
    { service: "anthropic", label: "Claude AI", status: "unconfigured", detail: "Not configured" },
  ], [apiStatus]);

  if (!state) return null;

  const statCards = [
    { label: "Emails Sent", value: state.emailsSent.toLocaleString(), icon: Send, color: "var(--accent)", sub: "last 30 days" },
    { label: "Open Rate", value: `${state.openRate}%`, icon: Mail, color: "#22c55e", sub: `${state.emailsOpened.toLocaleString()} opened` },
    { label: "Click Rate", value: `${state.clickRate}%`, icon: TrendingUp, color: "#06b6d4", sub: "vs. 5.2% industry avg" },
    { label: "Total Contacts", value: state.totalContacts.toLocaleString(), icon: Users, color: "#f59e0b", sub: "in database" },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Mission Control</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
            Real-time overview of all marketing operations
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href="/dashboard/email/compose"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: "var(--accent)", color: "white", textDecoration: "none",
            }}
          >
            <Mail size={14} /> Compose Email
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{card.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={card.color} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                {card.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Active Campaigns */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={16} color="var(--accent)" /> Campaigns
              </h2>
              <Link href="/dashboard/email" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                View All <ArrowUpRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {state.campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 8, background: "var(--bg-nav)",
                  }}
                >
                  <Circle size={8} fill={STATUS_COLORS[campaign.status]} color={STATUS_COLORS[campaign.status]} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{campaign.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                      {campaign.status === "draft" ? "Draft" :
                        `${campaign.sent.toLocaleString()} sent / ${campaign.opened.toLocaleString()} opened / ${campaign.clicked} clicked`}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                      padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5,
                      background: `${STATUS_COLORS[campaign.status]}15`,
                      color: STATUS_COLORS[campaign.status],
                    }}
                  >
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connections */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={16} color="var(--accent)" /> Service Connections
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {connections.map((conn) => (
                <div
                  key={conn.service}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 8,
                    background: conn.status === "connected" ? "var(--bg-nav)" : "transparent",
                    opacity: conn.status === "unconfigured" ? 0.5 : 1,
                  }}
                >
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: conn.status === "connected" ? "var(--connected)" :
                        conn.status === "checking" ? "#f59e0b" : "var(--unconfigured)",
                    }}
                  />
                  <span style={{ width: 160, fontWeight: 500, fontSize: 13 }}>{conn.label}</span>
                  <span style={{
                    fontSize: 11, fontFamily: "var(--font-mono)",
                    color: conn.status === "connected" ? "var(--connected)" : "var(--text-dim)",
                  }}>
                    {conn.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={16} color="var(--accent)" /> Activity Feed
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {state.activityLog.map((entry) => {
              const Icon = ACTIVITY_ICONS[entry.type];
              const color = ACTIVITY_COLORS[entry.type];
              return (
                <div
                  key={entry.id}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 8px", borderRadius: 6,
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0, marginTop: 2,
                    background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={13} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, margin: 0, lineHeight: 1.4 }}>{entry.message}</p>
                    <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{timeAgo(entry.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 24 }}>
        {[
          { label: "Compose Email", href: "/dashboard/email/compose", icon: Mail, desc: "Write and send emails" },
          { label: "Email Engine", href: "/dashboard/email", icon: Send, desc: "Campaigns & sequences" },
          { label: "Social Engine", href: "/dashboard/social", icon: BarChart3, desc: "Posts & scheduling" },
          { label: "Contacts", href: "/dashboard/contacts", icon: Users, desc: "Manage contacts" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
                padding: 20, textDecoration: "none", transition: "border-color 0.2s",
              }}
            >
              <Icon size={20} color="var(--accent)" />
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "12px 0 4px", color: "var(--text-primary)" }}>
                {action.label}
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{action.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
