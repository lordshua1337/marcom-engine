import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const eventSchema = z.object({
  event_type: z.string().min(1).max(100),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(request: Request) {
  await requireUser()
  const body = await request.json()

  const isBatch = Array.isArray(body.events)
  const events = isBatch ? body.events : [body]

  const valid = events
    .map((e: unknown) => eventSchema.safeParse(e))
    .filter((r: { success: boolean }) => r.success)
    .map((r: { data: z.infer<typeof eventSchema> }) => r.data)

  if (valid.length === 0) {
    return NextResponse.json({ error: 'No valid events' }, { status: 400 })
  }

  const rows = valid.map((event: z.infer<typeof eventSchema>) => ({
    event_type: event.event_type,
    metadata: event.metadata ?? {},
  }))

  await adminClient.from('analytics_events').insert(rows)
  return NextResponse.json({ recorded: rows.length })
}
