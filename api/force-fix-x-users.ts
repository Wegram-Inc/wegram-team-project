// Force fix ALL X users - reset their Wegram follower counts to 0
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
    // First, show current X users
    const xUsers = await sql`
      SELECT id, username, followers_count, following_count, twitter_followers_count, twitter_following_count
      FROM profiles
      WHERE twitter_id IS NOT NULL
    `;

    // Force update ALL X users - move their current follower counts to Twitter fields
    // and reset Wegram counts to 0
    const result = await sql`
      UPDATE profiles
      SET
        twitter_followers_count = COALESCE(twitter_followers_count, followers_count),
        twitter_following_count = COALESCE(twitter_following_count, following_count),
        followers_count = 0,
        following_count = 0
      WHERE twitter_id IS NOT NULL
      RETURNING id, username, followers_count, following_count, twitter_followers_count, twitter_following_count
    `;

    return res.status(200).json({
      success: true,
      message: 'ALL X users fixed - Wegram follower counts reset to 0',
      beforeUpdate: xUsers,
      afterUpdate: result,
      usersUpdated: result.length
    });

  } catch (error) {
    console.error('Force fix X users error:', error);
    return res.status(500).json({
      error: 'Failed to fix X users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}