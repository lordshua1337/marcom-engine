-- Marcom Engine Database Schema
-- Run in Supabase SQL Editor

-- Connection health log
CREATE TABLE connection_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  status text NOT NULL,
  last_ping timestamptz,
  last_error text,
  metadata jsonb,
  checked_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_connection_service ON connection_health(service);

-- Engine settings
CREATE TABLE engine_settings (
  engine text PRIMARY KEY,
  auto_mode boolean DEFAULT false,
  auto_mode_enabled_at timestamptz,
  auto_mode_enabled_by text,
  max_auto_sends_per_day integer DEFAULT 100,
  auto_confidence_threshold numeric DEFAULT 0.85,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Contacts / leads
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  company text,
  title text,
  website text,
  linkedin_url text,
  phone text,
  tags text[] DEFAULT '{}',
  source text,
  enriched_at timestamptz,
  unsubscribed_at timestamptz,
  unsubscribe_reason text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_contacts_tags ON contacts USING gin(tags);
CREATE INDEX idx_contacts_source ON contacts(source);

-- Contact lists
CREATE TABLE contact_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  filter_criteria jsonb,
  is_dynamic boolean DEFAULT false,
  contact_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE contact_list_members (
  list_id uuid REFERENCES contact_lists(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (list_id, contact_id)
);

-- Email campaigns
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  product text,
  campaign_type text NOT NULL,
  status text DEFAULT 'draft',
  list_id uuid REFERENCES contact_lists(id),
  ai_brief text,
  send_mode text DEFAULT 'review',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Campaign emails
CREATE TABLE campaign_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text NOT NULL,
  delay_days integer DEFAULT 0,
  delay_hours integer DEFAULT 0,
  send_at_hour integer DEFAULT 9,
  ai_generated boolean DEFAULT true,
  reviewed boolean DEFAULT false,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Email send log
CREATE TABLE email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_email_id uuid REFERENCES campaign_emails(id),
  contact_id uuid REFERENCES contacts(id),
  resend_message_id text UNIQUE,
  status text DEFAULT 'queued',
  queued_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  bounced_at timestamptz,
  bounce_reason text,
  metadata jsonb
);
CREATE INDEX idx_sends_campaign ON email_sends(campaign_email_id, status);
CREATE INDEX idx_sends_contact ON email_sends(contact_id);

-- Inbound emails
CREATE TABLE inbound_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_email text NOT NULL,
  from_name text,
  to_email text NOT NULL,
  subject text,
  body_text text,
  body_html text,
  contact_id uuid REFERENCES contacts(id),
  ai_classification text,
  ai_confidence numeric,
  ai_draft_response text,
  ai_notes text,
  status text DEFAULT 'pending',
  responded_at timestamptz,
  received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_inbound_status ON inbound_emails(status, received_at DESC);

-- Social posts
CREATE TABLE social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id),
  product text,
  platforms text[] NOT NULL,
  caption text NOT NULL,
  hashtags text[],
  image_url text,
  image_prompt text,
  post_mode text DEFAULT 'review',
  status text DEFAULT 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  ayrshare_post_id text,
  platform_results jsonb,
  ai_generated boolean DEFAULT true,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_status ON social_posts(status, scheduled_at);

-- Image assets
CREATE TABLE image_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_post_id uuid REFERENCES social_posts(id),
  prompt text NOT NULL,
  platform text NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  model text DEFAULT 'flux',
  generation_seconds numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Approval queue
CREATE TABLE approval_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  priority text DEFAULT 'normal',
  ai_confidence numeric,
  preview_data jsonb,
  status text DEFAULT 'pending',
  reviewed_at timestamptz,
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_approval_pending ON approval_queue(status, priority, created_at) WHERE status = 'pending';

-- Analytics events
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE connection_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE engine_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS policies (admin-only app, service key bypasses RLS)
-- Authenticated users can read all data (single-user app)
CREATE POLICY "auth_read_all" ON connection_health FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON engine_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON contact_lists FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON contact_list_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON campaign_emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON email_sends FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON inbound_emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON social_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON image_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON approval_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_all" ON analytics_events FOR SELECT TO authenticated USING (true);

-- Seed initial engine settings
INSERT INTO engine_settings (engine) VALUES ('email'), ('social'), ('inbound');

-- Seed initial connection health rows
INSERT INTO connection_health (service, status) VALUES
  ('supabase', 'unconfigured'),
  ('anthropic', 'unconfigured'),
  ('resend', 'unconfigured'),
  ('ayrshare', 'unconfigured'),
  ('apollo', 'unconfigured'),
  ('cloudflare_email', 'unconfigured'),
  ('flux_local', 'unconfigured');
