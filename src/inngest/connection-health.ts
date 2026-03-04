import { inngest } from './client'
import { runConnectionChecks } from '@/lib/connection-checker'

export const connectionHealthCheck = inngest.createFunction(
  { id: 'connection-health-check', name: 'Connection Health Check' },
  { cron: '*/5 * * * *' },
  async () => {
    const results = await runConnectionChecks()
    return { checked: results.length, results }
  }
)
