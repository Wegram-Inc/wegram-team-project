// Direct Messages API for Neon Postgres
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
        // Send a message
        const { sender_id, receiver_id, content } = req.body;

        if (!sender_id || !receiver_id || !content) {
          return res.status(400).json({ error: 'sender_id, receiver_id, and content are required' });
        }

        if (sender_id === receiver_id) {
          return res.status(400).json({ error: 'Cannot send message to yourself' });
        }

        // Create message
        const newMessage = await sql`
          INSERT INTO messages (sender_id, receiver_id, content)
          VALUES (${sender_id}, ${receiver_id}, ${content})
          RETURNING *
        `;

        return res.status(201).json({ 
          success: true, 
          message: newMessage[0] 
        });

      case 'GET':
        // Get messages between two users
        const { user1_id, user2_id } = req.query;

        if (!user1_id || !user2_id) {
          return res.status(400).json({ error: 'user1_id and user2_id are required' });
        }

        const messages = await sql`
          SELECT 
            m.*,
            s.username as sender_username,
            s.avatar_url as sender_avatar,
            r.username as receiver_username,
            r.avatar_url as receiver_avatar
          FROM messages m
          JOIN profiles s ON m.sender_id = s.id
          JOIN profiles r ON m.receiver_id = r.id
          WHERE (m.sender_id = ${user1_id} AND m.receiver_id = ${user2_id})
             OR (m.sender_id = ${user2_id} AND m.receiver_id = ${user1_id})
          ORDER BY m.created_at ASC
        `;

        return res.status(200).json({ messages });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Messages API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
