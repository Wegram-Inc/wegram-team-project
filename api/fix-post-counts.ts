// Fix post counts for existing users
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed - use GET request' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    // Update posts_count for all users based on actual post count
    const result = await sql`
      UPDATE profiles
      SET posts_count = (
        SELECT COUNT(*)
        FROM posts
        WHERE posts.user_id = profiles.id
      )
    `;

    return res.status(200).json({
      success: true,
      message: 'Post counts updated successfully for all users',
      updated: result.length
    });

  } catch (error) {
    console.error('Fix post counts error:', error);
    return res.status(500).json({
      error: 'Failed to fix post counts',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}