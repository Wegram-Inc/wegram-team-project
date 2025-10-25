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
    // Add views_count column to posts table if it doesn't exist
    await sql`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views_count DESC)
    `;

    return res.status(200).json({
      success: true,
      message: 'Post views column created successfully'
    });
  } catch (error) {
    console.error('Setup post views error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
