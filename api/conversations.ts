// Conversations List API for Messages Page
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL ||
                         process.env.DATABASE_URL ||
                         process.env.POSTGRES_PRISMA_URL;

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Get all conversations for the user with the most recent message
    const conversations = await sql`
      WITH latest_messages AS (
        SELECT DISTINCT
          CASE
            WHEN sender_id = ${user_id} THEN receiver_id
            ELSE sender_id
          END as other_user_id,
          FIRST_VALUE(content) OVER (
            PARTITION BY CASE
              WHEN sender_id = ${user_id} THEN receiver_id
              ELSE sender_id
            END
            ORDER BY created_at DESC
          ) as last_message,
          FIRST_VALUE(created_at) OVER (
            PARTITION BY CASE
              WHEN sender_id = ${user_id} THEN receiver_id
              ELSE sender_id
            END
            ORDER BY created_at DESC
          ) as last_message_time,
          FIRST_VALUE(sender_id) OVER (
            PARTITION BY CASE
              WHEN sender_id = ${user_id} THEN receiver_id
              ELSE sender_id
            END
            ORDER BY created_at DESC
          ) as last_sender_id
        FROM messages
        WHERE sender_id = ${user_id} OR receiver_id = ${user_id}
      ),
      unread_counts AS (
        SELECT
          sender_id as other_user_id,
          COUNT(*) as unread_count
        FROM messages
        WHERE receiver_id = ${user_id} AND read_at IS NULL
        GROUP BY sender_id
      )
      SELECT
        lm.other_user_id,
        lm.last_message,
        lm.last_message_time,
        lm.last_sender_id,
        p.username,
        p.avatar_url,
        p.verified,
        COALESCE(uc.unread_count, 0) as unread_count
      FROM latest_messages lm
      JOIN profiles p ON lm.other_user_id = p.id
      LEFT JOIN unread_counts uc ON lm.other_user_id = uc.other_user_id
      ORDER BY lm.last_message_time DESC
    `;

    // Format conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const now = new Date();
      const messageTime = new Date(conv.last_message_time);
      const diffMs = now.getTime() - messageTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let timeAgo;
      if (diffMins < 1) {
        timeAgo = 'now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins}m`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours}h`;
      } else if (diffDays < 7) {
        timeAgo = `${diffDays}d`;
      } else {
        timeAgo = messageTime.toLocaleDateString();
      }

      return {
        id: conv.other_user_id,
        name: conv.username?.replace('@', '') || 'Unknown User',
        username: conv.username?.startsWith('@') ? conv.username : `@${conv.username}`,
        avatar: conv.username?.charAt(0)?.toUpperCase() || 'U',
        avatar_url: conv.avatar_url,
        lastMessage: conv.last_message,
        timestamp: timeAgo,
        unreadCount: parseInt(conv.unread_count) || 0,
        verified: conv.verified || false,
        isOnline: false, // We can implement online status later
        lastSenderId: conv.last_sender_id
      };
    });

    return res.status(200).json({
      success: true,
      conversations: formattedConversations,
      count: formattedConversations.length
    });

  } catch (error) {
    console.error('Conversations API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}