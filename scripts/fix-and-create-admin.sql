-- Fix trigger issue and create super admin
-- Copy and run this entire script in Supabase SQL Editor
-- https://supabase.com/dashboard/project/dtuzljwxuqqlehkrcvnj/sql/new

-- Step 1: Drop the problematic trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop and recreate the trigger function (fixes potential issues)
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name)
  VALUES (
    NEW.id,
    'client_editor',
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Step 4: Now you can create the user
-- Go to: https://supabase.com/dashboard/project/dtuzljwxuqqlehkrcvnj/auth/users
-- Click "Add user" -> "Create new user"
-- Email: brent@creativestate.com
-- Password: R!FF7177
-- Then come back and run ONLY this part (Step 5) with the user ID:

-- Step 5: After creating user above, update their profile to super_admin
-- Replace 'PASTE_USER_ID_HERE' with the actual user ID from the auth dashboard
UPDATE public.profiles
SET role = 'super_admin', name = 'Brent Lollis'
WHERE id = 'PASTE_USER_ID_HERE';

-- Verify it worked
SELECT p.id, p.role, p.name, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id;
