-- Migration: 20260827000000_create_portfolio_tables.sql
-- Description: Setup database schema, RLS policies, triggers, and storage buckets for Portfolio CMS

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Automatic updated_at Trigger Function
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 2. Table: home_section
-- ==========================================
CREATE TABLE IF NOT EXISTS public.home_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL DEFAULT 'User Name',
    tagline TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    social_links JSONB DEFAULT '{"github": "", "linkedin": "", "instagram": "", "twitter": ""}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for home_section
ALTER TABLE public.home_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for home_section"
    ON public.home_section FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for home_section"
    ON public.home_section FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Trigger for home_section
DROP TRIGGER IF EXISTS set_home_section_updated_at ON public.home_section;
CREATE TRIGGER set_home_section_updated_at
    BEFORE UPDATE ON public.home_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default row if empty
INSERT INTO public.home_section (full_name, tagline, bio, social_links)
SELECT 'Yusril Maqoshidana', 'Fullstack Developer & Software Engineer', 'Passionate developer crafting modern web applications.', '{"github": "https://github.com", "linkedin": "https://linkedin.com", "instagram": "https://instagram.com"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.home_section);

-- ==========================================
-- 3. Table: project_section
-- ==========================================
CREATE TABLE IF NOT EXISTS public.project_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    tech_stack JSONB DEFAULT '[]'::jsonb,
    demo_url TEXT DEFAULT '',
    repo_url TEXT DEFAULT '',
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for project_section
ALTER TABLE public.project_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for project_section"
    ON public.project_section FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for project_section"
    ON public.project_section FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Trigger for project_section
DROP TRIGGER IF EXISTS set_project_section_updated_at ON public.project_section;
CREATE TRIGGER set_project_section_updated_at
    BEFORE UPDATE ON public.project_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 4. Table: skill_section
-- ==========================================
CREATE TABLE IF NOT EXISTS public.skill_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'frontend', -- e.g. "backend", "frontend", "mobile", "tools", "other"
    proficiency_level INT DEFAULT 3 CHECK (proficiency_level BETWEEN 1 AND 5),
    icon_url TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for skill_section
ALTER TABLE public.skill_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for skill_section"
    ON public.skill_section FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for skill_section"
    ON public.skill_section FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Trigger for skill_section
DROP TRIGGER IF EXISTS set_skill_section_updated_at ON public.skill_section;
CREATE TRIGGER set_skill_section_updated_at
    BEFORE UPDATE ON public.skill_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. Table: experience_section
-- ==========================================
CREATE TABLE IF NOT EXISTS public.experience_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_title TEXT NOT NULL,
    organization TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL, -- NULL indicates "Present / Sekarang"
    description TEXT DEFAULT '',
    location TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for experience_section
ALTER TABLE public.experience_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for experience_section"
    ON public.experience_section FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for experience_section"
    ON public.experience_section FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Trigger for experience_section
DROP TRIGGER IF EXISTS set_experience_section_updated_at ON public.experience_section;
CREATE TRIGGER set_experience_section_updated_at
    BEFORE UPDATE ON public.experience_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 6. Storage Buckets & Storage RLS Setup
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('thumbnails', 'thumbnails', true),
    ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Policies
DO $$ BEGIN
    CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Read Thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Read Resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin Storage Write Policies
DO $$ BEGIN
    CREATE POLICY "Admin Upload Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Admin Update Avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Admin Delete Avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin Upload Thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Admin Update Thumbnails" ON storage.objects FOR UPDATE USING (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Admin Delete Thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin Upload Resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Admin Update Resumes" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Admin Delete Resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
