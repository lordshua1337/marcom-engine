'use client'

import Link from 'next/link'

export default function CreativeEnginePage() {
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
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Creative</span>
      </nav>
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Creative Engine</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Standalone asset generator. Create social graphics, ad creatives, email headers, and hero images.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Generate Asset</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Describe what you need. Claude refines into a Flux prompt. Pick platform dimensions and generate.</p>
            <Link href="/dashboard/creative/generate" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1' }}>
              Start Creating
            </Link>
          </div>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Asset Library</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Browse all generated assets. Download or push to social queue.</p>
            <Link href="/dashboard/creative/library" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1' }}>
              View Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
