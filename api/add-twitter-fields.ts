// Add Twitter follower fields to profiles table
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
    // Add Twitter follower fields to profiles table
    await sql`
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS twitter_followers_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS twitter_following_count INTEGER DEFAULT 0
    `;

    return res.status(200).json({
      success: true,
      message: 'Twitter follower fields added successfully'
    });

  } catch (error) {
    console.error('Add Twitter fields error:', error);
    return res.status(500).json({
      error: 'Failed to add Twitter fields',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}