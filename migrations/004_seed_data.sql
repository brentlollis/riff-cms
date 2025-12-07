-- 004_seed_data.sql

-- 1. Create the Site
INSERT INTO sites (name, domain, settings)
VALUES (
  'Flash Painting & Remodeling', 
  'flashpainting.com', 
  '{"theme": "default"}'
) ON CONFLICT (domain) DO NOTHING;

-- 2. Create the Home Page with Section-based Content
-- We use a CTE to get the site_id we just created/found
WITH site_ref AS (
  SELECT id FROM sites WHERE domain = 'flashpainting.com' LIMIT 1
)
INSERT INTO pages (site_id, slug, title, published, draft_content, published_content)
SELECT 
  id, 
  'home', 
  'Home', 
  true,
  -- JSON Content (Sections Array)
  '{
    "sections": [
      {
        "id": "hero-1",
        "type": "Hero",
        "props": {
          "headline": "Expert painting & remodeling in Tulsa",
          "subheadline": "Keeping homes and businesses looking and functioning their best with expert painting & remodeling. Reliable. Efficient. Trusted.",
          "ctaText": "Our Services →",
          "ctaLink": "/services",
          "image": "/images/hero-house.jpg"
        }
      },
      {
        "id": "tagline-1",
        "type": "Tagline",
        "props": {
          "text": "Your vision, our expertise."
        }
      },
      {
        "id": "services-1",
        "type": "Services",
        "props": {}
      },
      {
        "id": "gallery-1",
        "type": "Gallery",
        "props": {}
      },
      {
        "id": "testimonials-1",
        "type": "Testimonials",
        "props": {}
      }
    ]
  }'::jsonb,
  '{
    "sections": [
       {
        "id": "hero-1",
        "type": "Hero",
        "props": {
          "headline": "Expert painting & remodeling in Tulsa",
          "subheadline": "Keeping homes and businesses looking and functioning their best with expert painting & remodeling. Reliable. Efficient. Trusted.",
          "ctaText": "Our Services →",
          "ctaLink": "/services",
          "image": "/images/hero-house.jpg"
        }
      }
    ]
  }'::jsonb
FROM site_ref
ON CONFLICT (site_id, slug) DO UPDATE SET 
  draft_content = EXCLUDED.draft_content;

-- 3. Instructions for User
-- You need to manually link your Supabase Auth User ID to the profiles table.
-- Run this after signing up/logging in:
-- INSERT INTO profiles (id, role, name) VALUES ('YOUR_AUTH_USER_ID', 'super_admin', 'Admin User');
