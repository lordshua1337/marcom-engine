'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Contact {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company: string | null
  source: string | null
  created_at: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/sync')
      .then((r) => r.json())
      .then((data) => {
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
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Contacts</span>
      </nav>
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Contacts</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Contact database with search, filter, CSV import, and Apollo enrichment.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/dashboard/contacts/import" style={{
              padding: '8px 16px', background: '#1e1e2e', border: '1px solid #2d2d3d',
              borderRadius: 6, color: '#94a3b8', fontSize: 13, textDecoration: 'none',
            }}>Import CSV</Link>
            <Link href="/dashboard/contacts/enrich" style={{
              padding: '8px 16px', background: '#1e1e2e', border: '1px solid #2d2d3d',
              borderRadius: 6, color: '#94a3b8', fontSize: 13, textDecoration: 'none',
            }}>Enrich</Link>
            <Link href="/dashboard/contacts/lists" style={{
              padding: '8px 16px', background: '#1e1e2e', border: '1px solid #2d2d3d',
              borderRadius: 6, color: '#94a3b8', fontSize: 13, textDecoration: 'none',
            }}>Lists</Link>
          </div>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts by name, email, company..."
          style={{
            width: '100%', padding: '10px 16px', background: '#111118',
            border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0',
            fontSize: 14, marginBottom: 16, boxSizing: 'border-box',
          }}
        />

        <div style={{
          background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 40,
          textAlign: 'center',
        }}>
          <p style={{ color: '#475569', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
            {loading ? 'Loading contacts...' : 'No contacts yet. Import a CSV or add contacts manually.'}
          </p>
        </div>
      </div>
    </div>
  )
}
