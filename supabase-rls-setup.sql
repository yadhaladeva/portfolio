-- ==============================================================================
-- DEVA YADHALA PORTFOLIO - SUPABASE ROW LEVEL SECURITY (RLS) & POLICY CONFIGURATION
-- ==============================================================================
-- This script configures Row Level Security (RLS) and least-privilege policies
-- on the Supabase PostgreSQL database.
--
-- ARCHITECTURE RULE:
-- 1. Public visitors: SELECT permissions ONLY on published portfolio content.
-- 2. Sensitive tables (admin_users, contact_messages): NO public/anonymous SELECT.
-- 3. CMS mutations (INSERT, UPDATE, DELETE): Strictly forbidden for anonymous users;
--    performed securely by Spring Boot backend using database connection/service credentials.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS header_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS header_nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hero_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS about_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS about_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS about_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS about_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS section_header_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. CLEAN UP ANY OLD CONFLICTING POLICIES (Idempotent execution)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read header_configs" ON header_configs;
DROP POLICY IF EXISTS "Public read header_nav_items" ON header_nav_items;
DROP POLICY IF EXISTS "Public read hero_content" ON hero_content;
DROP POLICY IF EXISTS "Public read hero_stages" ON hero_stages;
DROP POLICY IF EXISTS "Public read about_contents" ON about_contents;
DROP POLICY IF EXISTS "Public read about_capabilities" ON about_capabilities;
DROP POLICY IF EXISTS "Public read about_education" ON about_education;
DROP POLICY IF EXISTS "Public read about_roles" ON about_roles;
DROP POLICY IF EXISTS "Public read section_header_configs" ON section_header_configs;
DROP POLICY IF EXISTS "Public read skills" ON skills;
DROP POLICY IF EXISTS "Public read experience" ON experience;
DROP POLICY IF EXISTS "Public read projects" ON projects;
DROP POLICY IF EXISTS "Public read technologies" ON technologies;
DROP POLICY IF EXISTS "Public read project_technologies" ON project_technologies;
DROP POLICY IF EXISTS "Public read project_features" ON project_features;
DROP POLICY IF EXISTS "Public read certifications" ON certifications;
DROP POLICY IF EXISTS "Public read resumes" ON resumes;
DROP POLICY IF EXISTS "Public read contact_settings" ON contact_settings;
DROP POLICY IF EXISTS "Public read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Public read contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Public insert contact_messages" ON contact_messages;

-- ------------------------------------------------------------------------------
-- 3. CREATE PUBLIC SELECT POLICIES (Least Privilege Read-Only)
-- ------------------------------------------------------------------------------

-- Header & Brand Navigation
CREATE POLICY "Public read header_configs"
  ON header_configs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read header_nav_items"
  ON header_nav_items FOR SELECT
  TO anon, authenticated
  USING (visible IS TRUE);

-- Hero Section & Value Stages
CREATE POLICY "Public read hero_content"
  ON hero_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read hero_stages"
  ON hero_stages FOR SELECT
  TO anon, authenticated
  USING (visible IS TRUE);

-- About Section, Capabilities, Education, and Role
CREATE POLICY "Public read about_contents"
  ON about_contents FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read about_capabilities"
  ON about_capabilities FOR SELECT
  TO anon, authenticated
  USING (visible IS TRUE);

CREATE POLICY "Public read about_education"
  ON about_education FOR SELECT
  TO anon, authenticated
  USING (visible IS TRUE);

CREATE POLICY "Public read about_roles"
  ON about_roles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Section Headers (Skills, Experience, Projects, Certifications)
CREATE POLICY "Public read section_header_configs"
  ON section_header_configs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Skills & Categorized Capabilities
CREATE POLICY "Public read skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

-- Career Experience & Timeline
CREATE POLICY "Public read experience"
  ON experience FOR SELECT
  TO anon, authenticated
  USING (true);

-- Projects, Features, and Normalized Technologies
CREATE POLICY "Public read projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read technologies"
  ON technologies FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read project_technologies"
  ON project_technologies FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read project_features"
  ON project_features FOR SELECT
  TO anon, authenticated
  USING (true);

-- Professional Certifications & Credential Metadata
CREATE POLICY "Public read certifications"
  ON certifications FOR SELECT
  TO anon, authenticated
  USING (true);

-- Resumes: Expose active resume records only
CREATE POLICY "Public read resumes"
  ON resumes FOR SELECT
  TO anon, authenticated
  USING (active IS TRUE);

-- Public Contact Information & Form Placeholders
CREATE POLICY "Public read contact_settings"
  ON contact_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- ------------------------------------------------------------------------------
-- 4. PRIVATE TABLES - STRICTLY PROTECTED (Zero Public Read Access)
-- ------------------------------------------------------------------------------
-- admin_users: Password hashes and login credentials must NEVER be accessible publicly.
-- No SELECT policy is created for anon or authenticated.
-- Only the backend connection (postgres / service_role) can access this table.

-- contact_messages: Private visitor messages sent to admin.
-- 1. STRICT PRIVACY: Zero public read access. No SELECT policy for anon or authenticated.
--    Only the backend / service_role connection can read messages.
-- 2. RESILIENT SUBMISSION: Allow visitors to insert inquiries directly so contact form
--    works with zero latency, even if the Render backend is sleeping or inactive.
DROP POLICY IF EXISTS "Public insert contact_messages" ON contact_messages;
CREATE POLICY "Public insert contact_messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure permission is granted to insert into contact_messages and use sequences
GRANT INSERT ON TABLE contact_messages TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 5. STORAGE BUCKET POLICIES (Public read for resumes and certificates)
-- ------------------------------------------------------------------------------
-- Ensure public buckets exist and have read access for visitors
DO $$
BEGIN
  -- Insert bucket if not already present
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('portfolio-certifications', 'portfolio-certifications', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

  INSERT INTO storage.buckets (id, name, public)
  VALUES ('portfolio-resumes', 'portfolio-resumes', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
END $$;

-- Drop existing storage read policies if any
DROP POLICY IF EXISTS "Public read portfolio-certifications" ON storage.objects;
DROP POLICY IF EXISTS "Public read portfolio-resumes" ON storage.objects;

-- Allow public read access to stored certificate documents and resume PDFs
CREATE POLICY "Public read portfolio-certifications"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-certifications');

CREATE POLICY "Public read portfolio-resumes"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-resumes');
