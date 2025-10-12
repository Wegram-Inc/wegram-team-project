// Fix existing X users - reset their Wegram follower counts to 0
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Accept both GET and POST
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    // First, move existing Twitter follower data to the new fields
    // and reset Wegram counts to 0 for X users
    const result = await sql`
      UPDATE profiles
      SET
        twitter_followers_count = followers_count,
        twitter_following_count = following_count,
        followers_count = 0,
        following_count = 0
      WHERE twitter_id IS NOT NULL
      AND (twitter_followers_count IS NULL OR twitter_followers_count = 0)
    `;

    return res.status(200).json({
      success: true,
      message: 'Existing X users fixed - Wegram follower counts reset to 0',
      usersUpdated: result.length
    });

  } catch (error) {
    console.error('Fix X users error:', error);
    return res.status(500).json({
      error: 'Failed to fix X users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}