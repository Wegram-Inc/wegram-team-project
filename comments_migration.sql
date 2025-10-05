-- Add image_url column to comments table
-- Run this in your Vercel Neon database Query tab

ALTER TABLE comments ADD COLUMN image_url TEXT;

-- Add index for comments by post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at ASC);