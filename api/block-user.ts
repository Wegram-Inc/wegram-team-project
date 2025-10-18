// Block/Unblock User API for Neon Postgres
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
    switch (req.method) {
      case 'POST':
        // Block a user
        const { blocker_id, blocked_id } = req.body;

        if (!blocker_id || !blocked_id) {
          return res.status(400).json({ error: 'blocker_id and blocked_id are required' });
        }

        if (blocker_id === blocked_id) {
          return res.status(400).json({ error: 'Cannot block yourself' });
        }

        // Check if already blocked
        const existingBlock = await sql`
          SELECT id FROM blocked_users
          WHERE blocker_id = ${blocker_id} AND blocked_id = ${blocked_id}
        `;

        if (existingBlock.length > 0) {
          return res.status(400).json({ error: 'User already blocked' });
        }

        // Create block relationship
        await sql`
          INSERT INTO blocked_users (blocker_id, blocked_id)
          VALUES (${blocker_id}, ${blocked_id})
        `;

        // Automatically unfollow the blocked user (both directions)
        await sql`
          DELETE FROM follows
          WHERE (follower_id = ${blocker_id} AND following_id = ${blocked_id})
          OR (follower_id = ${blocked_id} AND following_id = ${blocker_id})
        `;

        // Update follower/following counts
        await sql`
          UPDATE profiles
          SET following_count = (
            SELECT COUNT(*) FROM follows WHERE follower_id = profiles.id
          ),
          followers_count = (
            SELECT COUNT(*) FROM follows WHERE following_id = profiles.id
          )
          WHERE id = ${blocker_id} OR id = ${blocked_id}
        `;

        return res.status(201).json({ success: true, message: 'User blocked successfully' });

      case 'DELETE':
        // Unblock a user
        const { blocker_id: unblocker_id, blocked_id: unblocked_id } = req.body;

        if (!unblocker_id || !unblocked_id) {
          return res.status(400).json({ error: 'blocker_id and blocked_id are required' });
        }

        // Check if blocked
        const blockToDelete = await sql`
          SELECT id FROM blocked_users
          WHERE blocker_id = ${unblocker_id} AND blocked_id = ${unblocked_id}
        `;

        if (blockToDelete.length === 0) {
          return res.status(400).json({ error: 'User is not blocked' });
        }

        // Delete block relationship
        await sql`
          DELETE FROM blocked_users
          WHERE blocker_id = ${unblocker_id} AND blocked_id = ${unblocked_id}
        `;

        return res.status(200).json({ success: true, message: 'User unblocked successfully' });

      case 'GET':
        // Get blocked users for a user
        const { user_id } = req.query;

        if (!user_id) {
          return res.status(400).json({ error: 'user_id is required' });
        }

        const blockedUsers = await sql`
          SELECT
            p.id,
            p.username,
            p.avatar_url,
            p.bio,
            p.verified,
            bu.created_at as blocked_at
          FROM blocked_users bu
          JOIN profiles p ON p.id = bu.blocked_id
          WHERE bu.blocker_id = ${user_id}
          ORDER BY bu.created_at DESC
        `;

        return res.status(200).json({ success: true, blocked_users: blockedUsers });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Block user error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
