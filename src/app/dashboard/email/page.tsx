'use client'

import Link from 'next/link'

export default function EmailEnginePage() {
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
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Email</span>
      </nav>
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Email Engine</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Campaign builder, email sequences, inbound processing, and delivery tracking.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Campaigns</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Create AI-generated email sequences targeting your contact lists.</p>
            <Link href="/dashboard/email/campaigns" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1' }}>
              Manage Campaigns
            </Link>
          </div>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Inbound</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>View incoming emails classified by AI with draft responses.</p>
            <Link href="/dashboard/email/inbound" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1' }}>
              View Inbound
            </Link>
          </div>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Send Log</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Track delivery status: sent, opened, clicked, bounced.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
