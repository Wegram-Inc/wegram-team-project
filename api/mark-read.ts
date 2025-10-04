// Mark Messages as Read API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, other_user_id } = req.body;

    if (!user_id || !other_user_id) {
      return res.status(400).json({ error: 'user_id and other_user_id are required' });
    }

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL ||
                         process.env.DATABASE_URL ||
                         process.env.POSTGRES_PRISMA_URL;

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Mark all messages from other_user to user_id as read
    const result = await sql`
      UPDATE messages
      SET read_at = NOW()
      WHERE sender_id = ${other_user_id}
        AND receiver_id = ${user_id}
        AND read_at IS NULL
      RETURNING id
    `;

    return res.status(200).json({
      success: true,
      marked_read_count: result.length
    });

  } catch (error) {
    console.error('Mark read API error:', error);
    return res.status(500).json({
      error: 'Failed to mark messages as read',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}