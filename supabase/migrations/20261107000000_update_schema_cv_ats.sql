-- Migration: 20261107000000_update_schema_cv_ats.sql
-- Description: Update database schema to match ATS CV structure and provide complete seed data

-- 1. Update home_section table with location and whatsapp_url
ALTER TABLE public.home_section
    ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Jember, East Java',
    ADD COLUMN IF NOT EXISTS whatsapp_url TEXT DEFAULT 'https://wa.link/jlntd2';

-- 2. Update project_section table with ATS fields
ALTER TABLE public.project_section
    ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT 'Mobile Apps',
    ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Mobile Development',
    ADD COLUMN IF NOT EXISTS period TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS repo_type TEXT DEFAULT 'public', -- 'public' or 'private'
    ADD COLUMN IF NOT EXISTS bullet_points JSONB DEFAULT '[]'::jsonb;

-- 3. Update experience_section table with ATS fields
ALTER TABLE public.experience_section
    ADD COLUMN IF NOT EXISTS period_text TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS bullet_points JSONB DEFAULT '[]'::jsonb;

-- 4. Create education_section table
CREATE TABLE IF NOT EXISTS public.education_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT DEFAULT 'Present',
    gpa TEXT DEFAULT '',
    coursework TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for education_section
ALTER TABLE public.education_section ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public read access for education_section"
        ON public.education_section FOR SELECT
        USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin write access for education_section"
        ON public.education_section FOR ALL
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger for education_section
DROP TRIGGER IF EXISTS set_education_section_updated_at ON public.education_section;
CREATE TRIGGER set_education_section_updated_at
    BEFORE UPDATE ON public.education_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Create achievement_section table
CREATE TABLE IF NOT EXISTS public.achievement_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    period TEXT DEFAULT '',
    description TEXT DEFAULT '',
    certificate_url TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for achievement_section
ALTER TABLE public.achievement_section ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public read access for achievement_section"
        ON public.achievement_section FOR SELECT
        USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin write access for achievement_section"
        ON public.achievement_section FOR ALL
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger for achievement_section
DROP TRIGGER IF EXISTS set_achievement_section_updated_at ON public.achievement_section;
CREATE TRIGGER set_achievement_section_updated_at
    BEFORE UPDATE ON public.achievement_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- Seed Data from CV_Moh.Yusril_Maqoshidana.md
-- ========================================================

-- Update default Home info if matching default or insert
DO $$
DECLARE
    home_id UUID;
BEGIN
    SELECT id INTO home_id FROM public.home_section LIMIT 1;
    IF home_id IS NOT NULL THEN
        UPDATE public.home_section
        SET full_name = 'Moh. Yusril Maqoshidana',
            tagline = 'Mobile & Android Developer | Flutter & Kotlin Enthusiast',
            bio = 'I am Information Technology student. 1 years of experience in Mobile Development. Have experience development mobile application using flutter, jetpack compose and xml. Proficient in implementing clean code with expertise in Kotlin and Dart programming languages. Interested in learning android development. Looking for an opportunity in mobile development.',
            location = 'Jember, East Java',
            whatsapp_url = 'https://wa.link/jlntd2',
            contact_email = 'yusrilmaqoshidana.work@gmail.com',
            social_links = '{
                "github": "https://github.com/YusrilMaqoshidana",
                "linkedin": "http://www.linkedin.com/in/moh-yusril-maqoshidana-ti222410102064",
                "whatsapp": "https://wa.link/jlntd2"
            }'::jsonb
        WHERE id = home_id;
    END IF;
END $$;

-- Seed Education if empty
INSERT INTO public.education_section (institution, degree, start_date, end_date, gpa, coursework, display_order)
SELECT 
    'University of Jember',
    'Information Technology, Faculty of Computer Science',
    'Aug 2022',
    'Present',
    '3.83 / 4.00',
    'Object Oriented Programming, Mobile Based Programming, Application Programming Interface, Software Analysis and Design, Software Development, Design Pattern.',
    1
WHERE NOT EXISTS (SELECT 1 FROM public.education_section);

-- Seed Achievements if empty
INSERT INTO public.achievement_section (title, period, description, certificate_url, display_order)
SELECT 
    'Winner Competition Software Development in CODE 2024, Yogyakarta',
    'Aug 2024',
    '3rd place from 16 teams',
    'https://drive.google.com/file/d/1IKi_yCSwTQAbNHTWim16YONZilWdkCcN/view?usp=sharing',
    1
WHERE NOT EXISTS (SELECT 1 FROM public.achievement_section WHERE title LIKE '%CODE 2024%');

INSERT INTO public.achievement_section (title, period, description, certificate_url, display_order)
SELECT 
    'Distinction Graduate - Mobile Development (Android), Indonesia',
    'Jan 2025',
    'Top 10% of 4,636 students from 400 universities',
    'https://drive.google.com/file/d/1Oi0mYaVI-R5Dmbxe4jvxQD81mmjLT9mG/view?usp=sharing',
    2
WHERE NOT EXISTS (SELECT 1 FROM public.achievement_section WHERE title LIKE '%Distinction Graduate%');
