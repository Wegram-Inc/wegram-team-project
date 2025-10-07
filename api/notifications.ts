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
      case 'GET':
        // Get notifications for a user
        const { user_id } = req.query;

        if (!user_id) {
          return res.status(400).json({ error: 'user_id is required' });
        }

        // Cast user_id to UUID to ensure type compatibility
        const notifications = await sql`
          SELECT
            n.id,
            n.type,
            n.message,
            n.read,
            n.created_at,
            n.post_id,
            p_from.username as from_username,
            p_from.avatar_url as from_avatar_url,
            posts.content as post_content
          FROM notifications n
          LEFT JOIN profiles p_from ON n.from_user_id = p_from.id
          LEFT JOIN posts ON n.post_id = posts.id
          WHERE n.user_id = ${user_id}::uuid
          ORDER BY n.created_at DESC
          LIMIT 50
        `;

        return res.status(200).json({ notifications });

      case 'POST':
        // Create a new notification
        const { user_id: to_user_id, from_user_id, type, message, post_id } = req.body;

        if (!to_user_id || !type || !message) {
          return res.status(400).json({ error: 'user_id, type, and message are required' });
        }

        // Don't notify users about their own actions
        if (to_user_id === from_user_id) {
          return res.status(200).json({ success: true, message: 'No self-notification created' });
        }

        const newNotification = await sql`
          INSERT INTO notifications (user_id, from_user_id, type, message, post_id, read)
          VALUES (${to_user_id}, ${from_user_id || null}, ${type}, ${message}, ${post_id || null}, false)
          RETURNING *
        `;

        return res.status(201).json({ success: true, notification: newNotification[0] });

      case 'PUT':
        // Mark notifications as read
        const { notification_ids, mark_all_read, user_id: mark_user_id } = req.body;

        if (mark_all_read && mark_user_id) {
          // Mark all notifications as read for user
          await sql`
            UPDATE notifications
            SET read = true
            WHERE user_id = ${mark_user_id}::uuid AND read = false
          `;
          return res.status(200).json({ success: true, message: 'All notifications marked as read' });
        } else if (notification_ids && Array.isArray(notification_ids)) {
          // Mark specific notifications as read
          await sql`
            UPDATE notifications
            SET read = true
            WHERE id = ANY(${notification_ids})
          `;
          return res.status(200).json({ success: true, message: 'Notifications marked as read' });
        } else {
          return res.status(400).json({ error: 'notification_ids or mark_all_read with user_id required' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notifications API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}