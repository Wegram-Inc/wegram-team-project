// Delete User Account API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Delete user account and all related data
    // The CASCADE constraints will handle deleting related records

    // Delete in order to avoid foreign key constraints:
    // 1. Delete user's likes
    await sql`DELETE FROM likes WHERE user_id = ${user_id}`;

    // 2. Delete user's comment likes (if table exists)
    try {
      await sql`DELETE FROM comment_likes WHERE user_id = ${user_id}`;
    } catch (error) {
      // Table might not exist yet, continue
    }

    // 3. Delete user's comments
    await sql`DELETE FROM comments WHERE user_id = ${user_id}`;

    // 4. Delete user's posts
    await sql`DELETE FROM posts WHERE user_id = ${user_id}`;

    // 5. Delete user's follows (both following and followers)
    await sql`DELETE FROM follows WHERE follower_id = ${user_id} OR following_id = ${user_id}`;

    // 6. Delete user's notifications
    await sql`DELETE FROM notifications WHERE user_id = ${user_id} OR from_user_id = ${user_id}`;

    // 7. Delete user's messages
    await sql`DELETE FROM messages WHERE sender_id = ${user_id} OR receiver_id = ${user_id}`;

    // 8. Delete user's bookmarks (if table exists)
    try {
      await sql`DELETE FROM bookmarks WHERE user_id = ${user_id}`;
    } catch (error) {
      // Table might not exist yet, continue
    }

    // 9. Finally, delete the user profile
    const deletedUser = await sql`DELETE FROM profiles WHERE id = ${user_id} RETURNING id, username`;

    if (deletedUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
      deleted_user: deletedUser[0]
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({
      error: 'Failed to delete account',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}