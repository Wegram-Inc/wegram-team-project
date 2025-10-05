// Database migration API for comments table
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    // Check if image_url column exists
    const columnCheck = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'comments'
      AND column_name = 'image_url'
    `;

    if (columnCheck.length === 0) {
      // Add the image_url column
      await sql`ALTER TABLE comments ADD COLUMN image_url TEXT`;
      console.log('✅ Added image_url column to comments table');
    }

    // Create indexes if they don't exist
    await sql`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at ASC)`;

    return res.status(200).json({
      success: true,
      message: 'Comments table migration completed successfully'
    });

  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}