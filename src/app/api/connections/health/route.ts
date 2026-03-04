import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { runConnectionChecks } from '@/lib/connection-checker'

// GET: read current connection statuses from DB
export async function GET() {
  await requireUser()

  const { data } = await adminClient
    .from('connection_health')
    .select('*')
    .order('service')

  return NextResponse.json({ connections: data ?? [] })
}

// POST: trigger a fresh health check
export async function POST() {
  await requireUser()

  const results = await runConnectionChecks()
  return NextResponse.json({ checked: results })
}
