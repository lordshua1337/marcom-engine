import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { connectionHealthCheck } from '@/inngest/connection-health'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [connectionHealthCheck],
})
