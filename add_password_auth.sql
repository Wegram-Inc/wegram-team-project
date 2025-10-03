-- Add password authentication to existing profiles table
-- Run this in Neon SQL Editor

-- Add password_hash column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Make email unique for email/password auth
ALTER TABLE profiles 
ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Make twitter_id truly optional
ALTER TABLE profiles 
ALTER COLUMN twitter_id DROP NOT NULL;

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

