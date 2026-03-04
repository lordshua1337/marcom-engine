import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'

// GET: pull all dashboard data
export async function GET() {
  await requireUser()

  const [connectionsRes, approvalsRes, campaignsRes, contactsRes, socialRes, settingsRes] = await Promise.all([
    adminClient.from('connection_health').select('*').order('service'),
    adminClient.from('approval_queue').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    adminClient.from('campaigns').select('*').order('updated_at', { ascending: false }).limit(20),
    adminClient.from('contacts').select('id', { count: 'exact', head: true }),
    adminClient.from('social_posts').select('*').order('created_at', { ascending: false }).limit(20),
    adminClient.from('engine_settings').select('*'),
  ])

  // Get 7-day stats
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [emailsSentRes, postsPublishedRes] = await Promise.all([
    adminClient.from('email_sends').select('id', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', sevenDaysAgo),
    adminClient.from('social_posts').select('id', { count: 'exact', head: true }).eq('status', 'published').gte('published_at', sevenDaysAgo),
  ])

  return NextResponse.json({
    connections: connectionsRes.data ?? [],
    pending_approvals: approvalsRes.data ?? [],
    campaigns: campaignsRes.data ?? [],
    contacts_count: contactsRes.count ?? 0,
    social_posts: socialRes.data ?? [],
    engine_settings: settingsRes.data ?? [],
    stats: {
      emails_sent_7d: emailsSentRes.count ?? 0,
      posts_published_7d: postsPublishedRes.count ?? 0,
      pending_approvals: approvalsRes.data?.length ?? 0,
      total_contacts: contactsRes.count ?? 0,
    },
  })
}
