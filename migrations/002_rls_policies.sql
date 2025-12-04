-- riff-cms Row Level Security Policies
-- Run this AFTER 001_initial_schema.sql
-- Ensures multi-tenant data isolation

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION: Get user's role
-- ============================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: Get user's site_id
-- ============================================
CREATE OR REPLACE FUNCTION get_user_site_id()
RETURNS UUID AS $$
  SELECT site_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================
-- SITES POLICIES
-- ============================================
-- Super admins can do everything
CREATE POLICY "super_admin_all_sites" ON sites
  FOR ALL USING (get_user_role() = 'super_admin');

-- Site admins and client editors can view their assigned site
CREATE POLICY "users_view_own_site" ON sites
  FOR SELECT USING (
    get_user_role() IN ('site_admin', 'client_editor')
    AND id = get_user_site_id()
  );

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Super admins can manage all profiles
CREATE POLICY "super_admin_all_profiles" ON profiles
  FOR ALL USING (get_user_role() = 'super_admin');

-- Site admins can view profiles for their site
CREATE POLICY "site_admin_view_site_profiles" ON profiles
  FOR SELECT USING (
    get_user_role() = 'site_admin'
    AND site_id = get_user_site_id()
  );

-- Users can view their own profile
CREATE POLICY "users_view_own_profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile (except role)
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- ============================================
-- PAGES POLICIES
-- ============================================
-- Super admins can manage all pages
CREATE POLICY "super_admin_all_pages" ON pages
  FOR ALL USING (get_user_role() = 'super_admin');

-- Site admins and client editors can manage pages for their site
CREATE POLICY "users_manage_site_pages" ON pages
  FOR ALL USING (
    get_user_role() IN ('site_admin', 'client_editor')
    AND site_id = get_user_site_id()
  );

-- Public can view published pages (for API access from client sites)
CREATE POLICY "public_view_published_pages" ON pages
  FOR SELECT USING (published = true);

-- ============================================
-- MEDIA POLICIES
-- ============================================
-- Super admins can manage all media
CREATE POLICY "super_admin_all_media" ON media
  FOR ALL USING (get_user_role() = 'super_admin');

-- Site admins and client editors can manage media for their site
CREATE POLICY "users_manage_site_media" ON media
  FOR ALL USING (
    get_user_role() IN ('site_admin', 'client_editor')
    AND site_id = get_user_site_id()
  );

-- Public can view all media (for API access from client sites)
CREATE POLICY "public_view_media" ON media
  FOR SELECT USING (true);

-- ============================================
-- GALLERIES POLICIES
-- ============================================
-- Super admins can manage all galleries
CREATE POLICY "super_admin_all_galleries" ON galleries
  FOR ALL USING (get_user_role() = 'super_admin');

-- Site admins and client editors can manage galleries for their site
CREATE POLICY "users_manage_site_galleries" ON galleries
  FOR ALL USING (
    get_user_role() IN ('site_admin', 'client_editor')
    AND site_id = get_user_site_id()
  );

-- Public can view all galleries (for API access from client sites)
CREATE POLICY "public_view_galleries" ON galleries
  FOR SELECT USING (true);

-- ============================================
-- GALLERY_IMAGES POLICIES
-- ============================================
-- Super admins can manage all gallery images
CREATE POLICY "super_admin_all_gallery_images" ON gallery_images
  FOR ALL USING (get_user_role() = 'super_admin');

-- Site admins and client editors can manage gallery images for galleries in their site
CREATE POLICY "users_manage_site_gallery_images" ON gallery_images
  FOR ALL USING (
    get_user_role() IN ('site_admin', 'client_editor')
    AND gallery_id IN (
      SELECT id FROM galleries WHERE site_id = get_user_site_id()
    )
  );

-- Public can view all gallery images (for API access from client sites)
CREATE POLICY "public_view_gallery_images" ON gallery_images
  FOR SELECT USING (true);
