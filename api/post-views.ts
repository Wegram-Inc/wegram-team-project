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
    if (req.method === 'POST') {
      const { post_id } = req.body;

      if (!post_id) {
        return res.status(400).json({ error: 'post_id is required' });
      }

      // Increment view count
      const result = await sql`
        UPDATE posts
        SET views_count = COALESCE(views_count, 0) + 1
        WHERE id = ${post_id}
        RETURNING views_count
      `;

      return res.status(200).json({
        success: true,
        views_count: result[0]?.views_count || 0
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Post views API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
