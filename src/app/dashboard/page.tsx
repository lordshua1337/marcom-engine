'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ConnectionHealth {
  service: string
  status: string
  last_ping: string | null
  last_error: string | null
  checked_at: string
}

interface DashboardStats {
  emails_sent_7d: number
  posts_published_7d: number
  pending_approvals: number
  total_contacts: number
}

interface EngineSettings {
  engine: string
  auto_mode: boolean
}

const CONNECTION_META: Record<string, { label: string; required_by: string[] }> = {
  supabase: { label: 'Supabase', required_by: ['email', 'social', 'creative', 'contacts'] },
  anthropic: { label: 'Anthropic (Claude)', required_by: ['email', 'social', 'creative'] },
  resend: { label: 'Resend', required_by: ['email'] },
  ayrshare: { label: 'Ayrshare', required_by: ['social'] },
  apollo: { label: 'Apollo.io', required_by: ['contacts'] },
  cloudflare_email: { label: 'Cloudflare Email', required_by: ['email'] },
  flux_local: { label: 'Flux (Local)', required_by: ['creative', 'social'] },
}

const ENGINE_DEPS: Record<string, string[]> = {
  email: ['supabase', 'resend'],
  social: ['supabase', 'ayrshare'],
  creative: ['supabase', 'anthropic', 'flux_local'],
  contacts: ['supabase', 'apollo'],
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    connected: '#00ff88',
    error: '#ff4444',
    unconfigured: '#444',
  }
  const symbols: Record<string, string> = {
    connected: '\u25CF',
    error: '\u25CC',
    unconfigured: '\u25CB',
  }
  return (
    <span style={{ color: colors[status] ?? '#444', fontSize: 16, marginRight: 8 }}>
      {symbols[status] ?? '\u25CB'}
    </span>
  )
}

export default function DashboardPage() {
  const [connections, setConnections] = useState<ConnectionHealth[]>([])
  const [stats, setStats] = useState<DashboardStats>({ emails_sent_7d: 0, posts_published_7d: 0, pending_approvals: 0, total_contacts: 0 })
  const [settings, setSettings] = useState<EngineSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    fetch('/api/sync')
      .then((r) => r.json())
      .then((data) => {
        setConnections(data.connections ?? [])
        setStats(data.stats ?? { emails_sent_7d: 0, posts_published_7d: 0, pending_approvals: 0, total_contacts: 0 })
        setSettings(data.engine_settings ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const recheckConnections = async () => {
    setChecking(true)
    await fetch('/api/connections/health', { method: 'POST' })
    const r = await fetch('/api/connections/health')
    const data = await r.json()
    setConnections(data.connections ?? [])
    setChecking(false)
  }

  function isEngineUnlocked(engine: string): boolean {
    const deps = ENGINE_DEPS[engine] ?? []
    return deps.every((dep) => {
      const conn = connections.find((c) => c.service === dep)
      return conn?.status === 'connected'
    })
  }

  function missingDeps(engine: string): string[] {
    const deps = ENGINE_DEPS[engine] ?? []
    return deps
      .filter((dep) => {
        const conn = connections.find((c) => c.service === dep)
        return conn?.status !== 'connected'
      })
      .map((dep) => CONNECTION_META[dep]?.label ?? dep)
  }

  const lastCheck = connections.length > 0
    ? connections.reduce((latest, c) => {
        const t = new Date(c.checked_at).getTime()
        return t > latest ? t : latest
      }, 0)
    : null

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>Loading Mission Control...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Top nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '12px 24px',
        borderBottom: '1px solid #1e1e2e',
        background: '#0d0d14',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6366f1', fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>
          MARCOM
        </span>
        {['Dashboard', 'Email', 'Social', 'Creative', 'Contacts', 'Approvals'].map((item) => {
          const engine = item.toLowerCase()
          const locked = ['email', 'social', 'creative', 'contacts'].includes(engine) && !isEngineUnlocked(engine)
          return (
            <Link
              key={item}
              href={engine === 'dashboard' ? '/dashboard' : `/dashboard/${engine}`}
              style={{
                color: locked ? '#333' : '#94a3b8',
                textDecoration: 'none',
                fontSize: 14,
                cursor: locked ? 'not-allowed' : 'pointer',
                opacity: locked ? 0.4 : 1,
              }}
            >
              {item} {locked ? '\uD83D\uDD12' : ''}
            </Link>
          )
        })}
      </nav>

      {/* Pending approvals banner */}
      {stats.pending_approvals > 0 && (
        <div style={{
          padding: '10px 24px',
          background: '#1a1a0f',
          borderBottom: '1px solid #854d0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: '#fbbf24', fontSize: 14 }}>
            {stats.pending_approvals} item{stats.pending_approvals > 1 ? 's' : ''} pending your review
          </span>
          <Link href="/dashboard/approvals" style={{ color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
            Review Now
          </Link>
        </div>
      )}

      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Mission Control</h1>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Emails Sent', value: stats.emails_sent_7d, sub: '7 days' },
            { label: 'Posts Published', value: stats.posts_published_7d, sub: '7 days' },
            { label: 'Pending Approvals', value: stats.pending_approvals, sub: stats.pending_approvals > 0 ? 'needs review' : 'all clear' },
            { label: 'Total Contacts', value: stats.total_contacts, sub: 'in database' },
          ].map((card) => (
            <div key={card.label} style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: 8,
              padding: 20,
            }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                {card.value}
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Connections panel */}
        <div style={{
          background: '#111118',
          border: '1px solid #1e1e2e',
          borderRadius: 8,
          padding: 20,
          marginBottom: 32,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>
              CONNECTIONS
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {lastCheck && (
                <span style={{ fontSize: 12, color: '#475569' }}>
                  Last check: {timeAgo(new Date(lastCheck).toISOString())}
                </span>
              )}
              <button
                onClick={recheckConnections}
                disabled={checking}
                style={{
                  background: '#1e1e2e',
                  border: '1px solid #2d2d3d',
                  borderRadius: 6,
                  color: '#94a3b8',
                  padding: '6px 12px',
                  fontSize: 12,
                  cursor: checking ? 'not-allowed' : 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {checking ? 'Checking...' : 'Recheck'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {connections.map((conn) => {
              const meta = CONNECTION_META[conn.service]
              return (
                <div
                  key={conn.service}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: conn.status === 'unconfigured' ? 'transparent' : '#0d0d14',
                    opacity: conn.status === 'unconfigured' ? 0.5 : 1,
                  }}
                >
                  <StatusDot status={conn.status} />
                  <span style={{ width: 160, fontWeight: 500, fontSize: 14 }}>
                    {meta?.label ?? conn.service}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: conn.status === 'connected' ? '#00ff88' : conn.status === 'error' ? '#ff4444' : '#555',
                  }}>
                    {conn.status === 'connected' ? `OK ${timeAgo(conn.last_ping)}` : conn.status === 'error' ? conn.last_error ?? 'Error' : 'Not configured'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Engine status cards */}
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>
          ENGINES
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { name: 'email', label: 'Email Engine', desc: 'Campaign sequences, inbound processing, delivery tracking' },
            { name: 'social', label: 'Social Engine', desc: 'Multi-platform posting, AI captions, image generation' },
            { name: 'creative', label: 'Creative Engine', desc: 'Standalone asset generator, Flux integration' },
            { name: 'contacts', label: 'Contacts Engine', desc: 'Database, CSV import, Apollo enrichment, lists' },
          ].map((engine) => {
            const unlocked = isEngineUnlocked(engine.name)
            const missing = missingDeps(engine.name)
            const setting = settings.find((s) => s.engine === engine.name)
            return (
              <div
                key={engine.name}
                style={{
                  background: '#111118',
                  border: `1px solid ${unlocked ? '#1e1e2e' : '#1a1010'}`,
                  borderRadius: 8,
                  padding: 20,
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{engine.label}</h3>
                  {unlocked && setting && (
                    <span style={{
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: setting.auto_mode ? '#0f2a0f' : '#1e1e2e',
                      color: setting.auto_mode ? '#4ade80' : '#64748b',
                    }}>
                      {setting.auto_mode ? 'AUTO' : 'REVIEW'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{engine.desc}</p>
                {!unlocked && (
                  <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>
                    Connect {missing.join(' + ')} to unlock
                  </p>
                )}
                {unlocked && (
                  <Link
                    href={`/dashboard/${engine.name}`}
                    style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1', fontWeight: 500 }}
                  >
                    Open Engine
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
