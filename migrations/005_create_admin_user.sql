-- 005_create_admin_user_v2.sql

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Update the password for the existing user
UPDATE auth.users
SET encrypted_password = crypt('riff-2025!', gen_salt('bf')),
    updated_at = NOW(),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()) -- Confirm if not already
WHERE email = 'brent@creativestate.com';

-- 2. Ensure they are super_admin in the profiles table
-- (The profile should exist via trigger, but we update the role)
UPDATE profiles
SET role = 'super_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'brent@creativestate.com');
