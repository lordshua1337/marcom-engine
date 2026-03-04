'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ApprovalItem {
  id: string
  item_type: string
  priority: string
  ai_confidence: number | null
  preview_data: Record<string, unknown> | null
  status: string
  created_at: string
}

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sync')
      .then((r) => r.json())
      .then((data) => {
        setItems(data.pending_approvals ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Approvals</span>
      </nav>
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Approval Queue</h1>
        <p style={{ color: '#64748b', marginBottom: 8 }}>
          Review pending emails, social posts, and inbound responses before they go live.
        </p>
        <p style={{ color: '#475569', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginBottom: 24 }}>
          Keyboard: A = Approve | R = Reject | E = Edit | J/K = Next/Prev
        </p>

        {loading ? (
          <p style={{ color: '#475569' }}>Loading...</p>
        ) : items.length === 0 ? (
          <div style={{
            background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 40,
            textAlign: 'center',
          }}>
            <p style={{ color: '#4ade80', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>All clear</p>
            <p style={{ color: '#475569', fontSize: 14 }}>No items pending review.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item) => (
              <div key={item.id} style={{
                background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    padding: '2px 8px', borderRadius: 4,
                    background: item.priority === 'urgent' ? '#2a0f0f' : '#1e1e2e',
                    color: item.priority === 'urgent' ? '#f87171' : '#94a3b8',
                    marginRight: 8,
                  }}>
                    {item.item_type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 14 }}>
                    {(item.preview_data as Record<string, string>)?.subject ?? (item.preview_data as Record<string, string>)?.from ?? item.id.slice(0, 8)}
                  </span>
                  {item.ai_confidence !== null && (
                    <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>
                      AI: {Math.round(item.ai_confidence * 100)}%
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ padding: '4px 12px', background: '#0f2a0f', border: '1px solid #166534', borderRadius: 4, color: '#4ade80', fontSize: 12, cursor: 'pointer' }}>
                    Approve
                  </button>
                  <button style={{ padding: '4px 12px', background: '#2a0f0f', border: '1px solid #991b1b', borderRadius: 4, color: '#f87171', fontSize: 12, cursor: 'pointer' }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
