import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    // Create referrals table
    await sql`
      CREATE TABLE IF NOT EXISTS referrals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        reward_amount INTEGER NOT NULL DEFAULT 5,
        tier_name VARCHAR(50) DEFAULT 'Bronze',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(referred_id)
      )
    `;

    // Add referral stats columns to profiles table if they don't exist
    await sql`
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_referral_earnings INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS referral_code VARCHAR(100) UNIQUE
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id)
    `;

    return res.status(200).json({
      success: true,
      message: 'Referrals table and columns created successfully'
    });
  } catch (error) {
    console.error('Setup referrals error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
