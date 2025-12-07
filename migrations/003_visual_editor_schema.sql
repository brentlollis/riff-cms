-- 003_visual_editor_schema.sql

-- Add columns for Visual Editor workflow
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS draft_content JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS published_content JSONB DEFAULT '{}';

-- Move existing content to published_content (migration path)
UPDATE pages 
SET published_content = content 
WHERE content IS NOT NULL AND published_content = '{}';

-- Initialize draft_content from published_content if empty
UPDATE pages 
SET draft_content = published_content 
WHERE draft_content = '{}';

-- (Optional) We can keep the 'content' column for legacy support or drop it later.
-- For now, we will leave it.
