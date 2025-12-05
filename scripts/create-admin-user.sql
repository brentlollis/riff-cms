-- Create super admin user for riff-cms
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dtuzljwxuqqlehkrcvnj/sql/new

-- First, disable the trigger temporarily to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the user (replace with actual user ID from Supabase Auth after manual creation)
-- You'll need to:
-- 1. Go to https://supabase.com/dashboard/project/dtuzljwxuqqlehkrcvnj/auth/users
-- 2. Click "Add user" -> "Create new user"
-- 3. Email: brent@creativestate.com
-- 4. Password: R!FF7177
-- 5. Click "Create user"
-- 6. Copy the user ID
-- 7. Run this SQL, replacing 'USER_ID_HERE' with the actual ID:

INSERT INTO profiles (id, role, name)
VALUES (
  'USER_ID_HERE',  -- Replace this with the user ID from step 6
  'super_admin',
  'Brent Lollis'
)
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin', name = 'Brent Lollis';

-- Re-enable the trigger for future users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Verify the profile was created
SELECT id, role, name FROM profiles;
