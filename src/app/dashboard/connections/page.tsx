'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ConnectionHealth {
  service: string
  status: string
  last_ping: string | null
  last_error: string | null
  metadata: Record<string, unknown> | null
  checked_at: string
}

const CONNECTION_INFO: Record<string, { label: string; description: string; docs: string }> = {
  supabase: { label: 'Supabase', description: 'Database, auth, and storage', docs: 'https://supabase.com/dashboard' },
  anthropic: { label: 'Anthropic (Claude)', description: 'AI copy generation for emails and social posts', docs: 'https://console.anthropic.com' },
  resend: { label: 'Resend', description: 'Transactional and campaign email sending', docs: 'https://resend.com/api-keys' },
  ayrshare: { label: 'Ayrshare', description: 'Multi-platform social media posting', docs: 'https://www.ayrshare.com/dashboard' },
  apollo: { label: 'Apollo.io', description: 'Contact enrichment and lead data', docs: 'https://developer.apollo.io' },
  cloudflare_email: { label: 'Cloudflare Email', description: 'Inbound email routing via webhook', docs: 'https://dash.cloudflare.com' },
  flux_local: { label: 'Flux (Local)', description: 'AI image generation on Mac Studio', docs: '' },
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<ConnectionHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  const load = async () => {
    const r = await fetch('/api/connections/health')
    const data = await r.json()
    setConnections(data.connections ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const recheck = async () => {
    setChecking(true)
    await fetch('/api/connections/health', { method: 'POST' })
    await load()
    setChecking(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 24, padding: '12px 24px',
        borderBottom: '1px solid #1e1e2e', background: '#0d0d14',
      }}>
        <Link href="/dashboard" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6366f1', fontWeight: 700, fontSize: 14, letterSpacing: 1, textDecoration: 'none' }}>
          MARCOM
        </Link>
        <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Dashboard</Link>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Connections</span>
      </nav>
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Connection Manager</h1>
          <button
            onClick={recheck}
            disabled={checking}
            style={{
              padding: '8px 16px', background: '#6366f1', border: 'none',
              borderRadius: 6, color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: checking ? 'not-allowed' : 'pointer',
            }}
          >
            {checking ? 'Checking...' : 'Test All Connections'}
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#475569' }}>Loading connections...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {connections.map((conn) => {
              const info = CONNECTION_INFO[conn.service]
              const statusColors: Record<string, string> = {
                connected: '#00ff88',
                error: '#ff4444',
                unconfigured: '#555',
              }
              return (
                <div key={conn.service} style={{
                  background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 20,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: statusColors[conn.status] ?? '#555',
                      display: 'inline-block',
                    }} />
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{info?.label ?? conn.service}</h3>
                    <span style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      padding: '2px 8px', borderRadius: 4,
                      background: conn.status === 'connected' ? '#0f2a0f' : conn.status === 'error' ? '#2a0f0f' : '#1e1e2e',
                      color: statusColors[conn.status],
                    }}>
                      {conn.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 8px 22px' }}>
                    {info?.description}
                  </p>
                  {conn.last_error && (
                    <p style={{ fontSize: 12, color: '#f87171', margin: '0 0 0 22px', fontFamily: "'JetBrains Mono', monospace" }}>
                      {conn.last_error}
                    </p>
                  )}
                  {conn.status === 'unconfigured' && info?.docs && (
                    <p style={{ fontSize: 12, color: '#6366f1', margin: '8px 0 0 22px' }}>
                      Add the API key to your .env.local file.{' '}
                      <a href={info.docs} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8' }}>
                        Get API key
                      </a>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
