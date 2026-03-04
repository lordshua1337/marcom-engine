'use client'

import Link from 'next/link'

export default function SocialEnginePage() {
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
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Social</span>
      </nav>
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Social Engine</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Multi-platform posting with AI captions and Flux image generation.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Post Queue</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>View and manage scheduled posts across all platforms.</p>
            <Link href="/dashboard/social/posts" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1' }}>
              View Queue
            </Link>
          </div>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Create Post</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Generate AI captions and images for Twitter, Instagram, LinkedIn, Facebook.</p>
            <Link href="/dashboard/social/posts/new" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1' }}>
              New Post
            </Link>
          </div>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Analytics</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Per-platform performance metrics and engagement tracking.</p>
            <Link href="/dashboard/social/analytics" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6366f1' }}>
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
