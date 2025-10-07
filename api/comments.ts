// Comments API for Neon Postgres
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
        // Fetch comments for a specific post
        const { postId } = req.query;

        if (!postId) {
          return res.status(400).json({ error: 'postId is required' });
        }

        const comments = await sql`
          SELECT
            c.id,
            c.content,
            c.user_id,
            c.likes_count,
            c.created_at,
            pr.username,
            pr.avatar_url
          FROM comments c
          JOIN profiles pr ON c.user_id = pr.id
          WHERE c.post_id = ${postId}
          ORDER BY c.created_at ASC
        `;

        return res.status(200).json({ success: true, comments });

      case 'POST':
        // Create a new comment
        const { content, post_id, user_id, username, image_url } = req.body;

        if (!content || !post_id || !user_id) {
          return res.status(400).json({ error: 'content, post_id, and user_id are required' });
        }

        if (content.length > 280) {
          return res.status(400).json({ error: 'Comment content too long (max 280 characters)' });
        }

        // Insert the comment
        const newComment = await sql`
          INSERT INTO comments (content, post_id, user_id, likes_count)
          VALUES (${content}, ${post_id}, ${user_id}, 0)
          RETURNING *
        `;

        // Update the post's comment count
        await sql`
          UPDATE posts
          SET comments_count = comments_count + 1
          WHERE id = ${post_id}
        `;

        // Get post owner and commenter info for notification
        const postDetails = await sql`
          SELECT p.user_id as post_owner_id, pr.username as commenter_username
          FROM posts p, profiles pr
          WHERE p.id = ${post_id} AND pr.id = ${user_id}
        `;

        if (postDetails.length > 0 && postDetails[0].post_owner_id !== user_id) {
          // Create notification for post owner (don't notify yourself)
          const message = `${postDetails[0].commenter_username} commented on your post`;
          await sql`
            INSERT INTO notifications (user_id, from_user_id, type, message, post_id, read)
            VALUES (${postDetails[0].post_owner_id}, ${user_id}, 'comment', ${message}, ${post_id}, false)
          `;
        }

        return res.status(201).json({ success: true, comment: newComment[0] });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Comments API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}