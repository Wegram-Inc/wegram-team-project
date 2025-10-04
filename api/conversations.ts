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

    // Simple approach: get all messages involving this user
    const allMessages = await sql`
      SELECT
        m.id,
        m.sender_id,
        m.receiver_id,
        m.content,
        m.created_at,
        sender.username as sender_username,
        sender.avatar_url as sender_avatar,
        receiver.username as receiver_username,
        receiver.avatar_url as receiver_avatar,
        receiver.verified as receiver_verified,
        sender.verified as sender_verified
      FROM messages m
      JOIN profiles sender ON m.sender_id = sender.id
      JOIN profiles receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = ${user_id} OR m.receiver_id = ${user_id}
      ORDER BY m.created_at DESC
    `;

    // Group messages by the other person
    const conversationMap = new Map();

    allMessages.forEach(msg => {
      const isFromMe = msg.sender_id === user_id;
      const otherUserId = isFromMe ? msg.receiver_id : msg.sender_id;
      const otherUsername = isFromMe ? msg.receiver_username : msg.sender_username;
      const otherAvatar = isFromMe ? msg.receiver_avatar : msg.sender_avatar;
      const otherVerified = isFromMe ? msg.receiver_verified : msg.sender_verified;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          other_user_id: otherUserId,
          username: otherUsername,
          avatar_url: otherAvatar,
          verified: otherVerified,
          last_message: msg.content,
          last_message_time: msg.created_at,
          last_sender_id: msg.sender_id,
          unread_count: 0
        });
      }
    });

    const conversations = Array.from(conversationMap.values());

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