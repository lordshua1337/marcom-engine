import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabase_service_key: !!process.env.SUPABASE_SERVICE_KEY,
    anthropic_key: !!process.env.ANTHROPIC_API_KEY,
    resend_key: !!process.env.RESEND_API_KEY,
    marcom_admin_email: !!process.env.MARCOM_ADMIN_EMAIL,
  }
  const healthy = Object.values(checks).every(Boolean)
  return NextResponse.json(
    { status: healthy ? 'healthy' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  )
}
