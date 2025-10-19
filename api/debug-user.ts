// Debug API to check user data in database
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    // Get user data from database
    const user = await sql`
      SELECT id, username, email, avatar_url, bio, verified, twitter_link, discord_link, telegram_link, created_at, updated_at
      FROM profiles
      WHERE id = ${user_id}
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: user[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug user error:', error);
    return res.status(500).json({
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}