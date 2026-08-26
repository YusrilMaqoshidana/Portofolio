-- Migration: 20260827000001_create_admin_user.sql
-- Description: Create initial Admin user in auth.users and auth.identities tables

-- Ensure pgcrypto extension is active
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    user_email TEXT := 'yusrilmaqoshidana.work@gmail.com';
    user_password TEXT := 'Yusril2064.';
    encrypted_pw TEXT;
BEGIN
    -- Check if user already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
        RAISE NOTICE 'User % already exists. Updating password...', user_email;
        encrypted_pw := extensions.crypt(user_password, extensions.gen_salt('bf'));
        
        UPDATE auth.users 
        SET encrypted_password = encrypted_pw,
            email_confirmed_at = NOW(),
            updated_at = NOW()
        WHERE email = user_email;
    ELSE
        encrypted_pw := extensions.crypt(user_password, extensions.gen_salt('bf'));

        -- Insert into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            user_email,
            encrypted_pw,
            NOW(),
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{"full_name": "Yusril Maqoshidana", "role": "admin"}'::jsonb,
            NOW(),
            NOW()
        );

        -- Insert into auth.identities
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            new_user_id,
            jsonb_build_object('sub', new_user_id::text, 'email', user_email),
            'email',
            NOW(),
            NOW(),
            NOW()
        );

        RAISE NOTICE 'Admin user % successfully created with ID %', user_email, new_user_id;
    END IF;
END $$;
