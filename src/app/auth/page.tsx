'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/auth/client'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createSupabaseBrowser()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: 40,
        background: '#111118',
        border: '1px solid #1e1e2e',
        borderRadius: 12,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            color: '#6366f1',
            letterSpacing: 2,
            marginBottom: 8,
          }}>MARCOM ENGINE</div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#e2e8f0',
            margin: 0,
          }}>Mission Control</h1>
          <p style={{
            color: '#64748b',
            fontSize: 14,
            marginTop: 8,
          }}>Admin access only. Sign in with your magic link.</p>
        </div>

        {sent ? (
          <div style={{
            textAlign: 'center',
            padding: 24,
            background: '#0f1a0f',
            border: '1px solid #166534',
            borderRadius: 8,
            color: '#86efac',
          }}>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Check your email</p>
            <p style={{ color: '#4ade80', fontSize: 14 }}>
              Magic link sent to {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <label style={{
              display: 'block',
              fontSize: 13,
              color: '#94a3b8',
              marginBottom: 6,
              fontFamily: "'JetBrains Mono', monospace",
            }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourdomain.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0a0a0f',
                border: '1px solid #2d2d3d',
                borderRadius: 8,
                color: '#e2e8f0',
                fontSize: 16,
                outline: 'none',
                marginBottom: 16,
                boxSizing: 'border-box',
              }}
            />

            {error && (
              <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: loading ? '#3730a3' : '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
