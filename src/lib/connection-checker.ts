import { adminClient } from '@/lib/supabase/client'

interface ConnectionDef {
  service: string
  label: string
  description: string
  required_by: string[]
  envKey?: string
  check: () => Promise<{ ok: boolean; error: string | null; metadata?: Record<string, unknown> }>
}

const CONNECTIONS: ConnectionDef[] = [
  {
    service: 'supabase',
    label: 'Supabase',
    description: 'Database and auth',
    required_by: ['email', 'social', 'creative', 'contacts'],
    check: async () => {
      const { error } = await adminClient.from('contacts').select('id').limit(1)
      return { ok: !error, error: error?.message ?? null }
    },
  },
  {
    service: 'anthropic',
    label: 'Anthropic (Claude)',
    description: 'AI copy generation',
    required_by: ['email', 'social', 'creative'],
    envKey: 'ANTHROPIC_API_KEY',
    check: async () => {
      const key = process.env.ANTHROPIC_API_KEY
      if (!key) return { ok: false, error: 'API key not configured' }
      const response = await fetch('https://api.anthropic.com/v1/models', {
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      })
      return { ok: response.ok, error: response.ok ? null : `HTTP ${response.status}` }
    },
  },
  {
    service: 'resend',
    label: 'Resend',
    description: 'Email sending',
    required_by: ['email'],
    envKey: 'RESEND_API_KEY',
    check: async () => {
      const key = process.env.RESEND_API_KEY
      if (!key) return { ok: false, error: 'API key not configured' }
      const response = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${key}` },
      })
      return { ok: response.ok, error: response.ok ? null : `HTTP ${response.status}` }
    },
  },
  {
    service: 'ayrshare',
    label: 'Ayrshare',
    description: 'Social media posting',
    required_by: ['social'],
    envKey: 'AYRSHARE_API_KEY',
    check: async () => {
      const key = process.env.AYRSHARE_API_KEY
      if (!key) return { ok: false, error: 'API key not configured' }
      const response = await fetch('https://app.ayrshare.com/api/user', {
        headers: { Authorization: `Bearer ${key}` },
      })
      return { ok: response.ok, error: response.ok ? null : `HTTP ${response.status}` }
    },
  },
  {
    service: 'apollo',
    label: 'Apollo.io',
    description: 'Lead enrichment',
    required_by: ['contacts'],
    envKey: 'APOLLO_API_KEY',
    check: async () => {
      const key = process.env.APOLLO_API_KEY
      if (!key) return { ok: false, error: 'API key not configured' }
      const response = await fetch('https://api.apollo.io/api/v1/auth/health', {
        headers: { 'x-api-key': key },
      })
      return { ok: response.ok, error: response.ok ? null : `HTTP ${response.status}` }
    },
  },
  {
    service: 'cloudflare_email',
    label: 'Cloudflare Email',
    description: 'Inbound email routing',
    required_by: ['email'],
    envKey: 'CLOUDFLARE_EMAIL_WEBHOOK_SECRET',
    check: async () => {
      const secret = process.env.CLOUDFLARE_EMAIL_WEBHOOK_SECRET
      if (!secret) return { ok: false, error: 'Webhook secret not configured' }
      const { data } = await adminClient
        .from('inbound_emails')
        .select('received_at')
        .order('received_at', { ascending: false })
        .limit(1)
      const lastReceived = data?.[0]?.received_at
      return {
        ok: true,
        error: null,
        metadata: { last_inbound: lastReceived ?? 'none yet' },
      }
    },
  },
  {
    service: 'flux_local',
    label: 'Flux (Local)',
    description: 'Image generation (Mac Studio)',
    required_by: ['creative', 'social'],
    check: async () => {
      const url = process.env.FLUX_SERVER_URL
      if (!url) return { ok: false, error: 'Server URL not configured' }
      try {
        const response = await fetch(`${url}/health`, {
          signal: AbortSignal.timeout(3000),
        })
        return { ok: response.ok, error: response.ok ? null : 'Server not responding' }
      } catch {
        return { ok: false, error: 'Server offline' }
      }
    },
  },
]

export { CONNECTIONS }

export async function runConnectionChecks() {
  const results: Array<{ service: string; status: string }> = []

  for (const conn of CONNECTIONS) {
    const result = await conn.check().catch((err: Error) => ({
      ok: false,
      error: err.message,
      metadata: undefined,
    }))

    const hasKey = conn.envKey ? !!process.env[conn.envKey] : true
    const status = result.ok ? 'connected' : (hasKey ? 'error' : 'unconfigured')

    await adminClient.from('connection_health').upsert(
      {
        service: conn.service,
        status,
        last_ping: result.ok ? new Date().toISOString() : undefined,
        last_error: result.error,
        metadata: result.metadata ?? null,
        checked_at: new Date().toISOString(),
      },
      { onConflict: 'service' }
    )

    results.push({ service: conn.service, status })
  }

  return results
}
