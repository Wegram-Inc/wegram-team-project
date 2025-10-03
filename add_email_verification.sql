-- Add email verification fields to profiles table
ALTER TABLE profiles
ADD COLUMN email_verified BOOLEAN DEFAULT false,
ADD COLUMN verification_token TEXT,
ADD COLUMN verification_token_expires TIMESTAMP WITH TIME ZONE;

-- Add index for verification token lookups
CREATE INDEX idx_profiles_verification_token ON profiles(verification_token);

-- Add index for email verification status
CREATE INDEX idx_profiles_email_verified ON profiles(email_verified);
