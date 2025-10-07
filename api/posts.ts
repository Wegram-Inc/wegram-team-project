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
        // Check if this is a request for a single post
        const { id: postId } = req.query;

        if (postId) {
          // Fetch single post by ID
          const post = await sql`
            SELECT
              p.id,
              p.user_id,
              p.content,
              p.image_url,
              p.likes_count,
              p.comments_count,
              p.shares_count,
              p.created_at,
              pr.username,
              pr.avatar_url
            FROM posts p
            JOIN profiles pr ON p.user_id = pr.id
            WHERE p.id = ${postId}
          `;

          if (post.length === 0) {
            return res.status(404).json({ success: false, error: 'Post not found' });
          }

          return res.status(200).json({ success: true, post: post[0] });
        }

        // Fetch posts with different feed types
        const { feed_type = 'all', user_id: current_user_id, user_posts } = req.query;
        
        console.log('🔍 Feed API Debug:', {
          feed_type,
          current_user_id,
          user_posts,
          query: req.query
        });

        let posts;

        if (user_posts) {
          // Fetch posts by specific user
          posts = await sql`
            SELECT
              p.id,
              p.user_id,
              p.content,
              p.image_url,
              p.likes_count as likes,
              p.comments_count as replies,
              p.shares_count as shares,
              0 as gifts,
              p.created_at,
              p.updated_at,
              pr.username,
              pr.avatar_url
            FROM posts p
            JOIN profiles pr ON p.user_id = pr.id
            WHERE p.user_id = ${user_posts}
            ORDER BY p.created_at DESC
            LIMIT 50
          `;
        } else if (feed_type === 'following' && current_user_id) {
          // Following feed - posts from users the current user follows
          posts = await sql`
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
            JOIN follows f ON f.following_id = p.user_id
            WHERE f.follower_id = ${current_user_id}
            ORDER BY p.created_at DESC
            LIMIT 50
          `;
        } else if (feed_type === 'trending') {
          // Trending feed - most liked posts
          posts = await sql`
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
            ORDER BY p.likes_count DESC, p.created_at DESC
            LIMIT 50
          `;
        } else {
          // Trenches feed (default) - newest posts from all users
          posts = await sql`
            SELECT
              p.id,
              p.user_id,
              p.content,
              p.image_url,
              p.likes_count as likes,
              p.comments_count as replies,
              p.shares_count as shares,
              0 as gifts,
              p.created_at,
              p.updated_at,
              pr.username,
              pr.avatar_url
            FROM posts p
            JOIN profiles pr ON p.user_id = pr.id
            ORDER BY p.created_at DESC
            LIMIT 50
          `;
        }
        
        return res.status(200).json({ posts });

      case 'POST':
        // Create a new post - handle JSON with base64 images
        const { content, user_id, image_url } = req.body;

        if (!content || !user_id) {
          return res.status(400).json({ error: 'Content and user_id are required' });
        }

        if (content.length > 500) {
          return res.status(400).json({ error: 'Post content too long (max 500 characters)' });
        }

        const newPost = await sql`
          INSERT INTO posts (content, user_id, image_url, likes_count, comments_count, shares_count)
          VALUES (${content}, ${user_id}, ${image_url || null}, 0, 0, 0)
          RETURNING *
        `;

        // Update user's post count
        await sql`
          UPDATE profiles
          SET posts_count = posts_count + 1
          WHERE id = ${user_id}
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

        return res.status(201).json({ success: true, post: postWithProfile[0] });

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
