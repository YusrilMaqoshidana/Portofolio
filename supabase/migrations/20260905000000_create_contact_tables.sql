-- Migration: 20260905000000_create_contact_tables.sql
-- Description: Add contact_email to home_section and create contact_messages table

-- 1. Add contact_email column to home_section if not exists
ALTER TABLE public.home_section ADD COLUMN IF NOT EXISTS contact_email TEXT DEFAULT 'yusril.maqoshidana@gmail.com';

-- 2. Create contact_messages table for user submitted messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public insert policy (allowing website visitors to send messages)
DROP POLICY IF EXISTS "Public insert access for contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert access for contact_messages"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

-- Admin read/write policy
DROP POLICY IF EXISTS "Admin access for contact_messages" ON public.contact_messages;
CREATE POLICY "Admin access for contact_messages"
    ON public.contact_messages FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
