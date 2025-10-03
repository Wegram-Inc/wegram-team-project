// Posts API for Neon Postgres
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
        // Fetch all posts with user profiles
        const posts = await sql`
          SELECT 
            p.id,
            p.user_id,
            p.content,
            p.image_url,
            p.likes_count as likes,
            p.comments_count as replies,
            p.shares_count as shares,
            p.created_at,
            p.updated_at,
            pr.username,
            pr.avatar_url
          FROM posts p
          JOIN profiles pr ON p.user_id = pr.id
          ORDER BY p.created_at DESC
          LIMIT 50
        `;
        
        return res.status(200).json({ posts });

      case 'POST':
        // Create a new post
        const { content, user_id } = req.body;

        if (!content || !user_id) {
          return res.status(400).json({ error: 'Content and user_id are required' });
        }

        if (content.length > 500) {
          return res.status(400).json({ error: 'Post content too long (max 500 characters)' });
        }

        const newPost = await sql`
          INSERT INTO posts (content, user_id, likes_count, comments_count, shares_count)
          VALUES (${content}, ${user_id}, 0, 0, 0)
          RETURNING *
        `;

        // Get the post with user profile
        const postWithProfile = await sql`
          SELECT 
            p.id,
            p.user_id,
            p.content,
            p.image_url,
            p.likes_count as likes,
            p.comments_count as replies,
            p.shares_count as shares,
            p.created_at,
            p.updated_at,
            pr.username,
            pr.avatar_url
          FROM posts p
          JOIN profiles pr ON p.user_id = pr.id
          WHERE p.id = ${newPost[0].id}
        `;

        return res.status(201).json({ post: postWithProfile[0] });

      case 'PUT':
        // Update post (like, gift, etc.)
        const { post_id, action } = req.body;

        if (!post_id || !action) {
          return res.status(400).json({ error: 'post_id and action are required' });
        }

        let updateQuery;
        switch (action) {
          case 'like':
            updateQuery = sql`UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${post_id} RETURNING *`;
            break;
          case 'gift':
            updateQuery = sql`UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${post_id} RETURNING *`;
            break;
          case 'share':
            updateQuery = sql`UPDATE posts SET shares_count = shares_count + 1 WHERE id = ${post_id} RETURNING *`;
            break;
          default:
            return res.status(400).json({ error: 'Invalid action' });
        }

        const updatedPost = await updateQuery;
        
        if (updatedPost.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(200).json({ post: updatedPost[0] });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Posts API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
