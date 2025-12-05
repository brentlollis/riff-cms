-- Create Flash Painting site in riff-cms
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/dtuzljwxuqqlehkrcvnj/sql/new

INSERT INTO sites (name, domain, settings)
VALUES (
  'Flash Painting & Remodeling',
  'flashpainting.com',
  '{
    "logo": "",
    "colors": {
      "primary": "#E63946",
      "secondary": "#1D3557"
    },
    "contact": {
      "email": "info@flashpainting.com",
      "phone": "(918) 555-0100",
      "address": "Tulsa, OK"
    }
  }'::jsonb
)
RETURNING id, name, domain;

-- Verify it was created
SELECT id, name, domain, settings FROM sites;
