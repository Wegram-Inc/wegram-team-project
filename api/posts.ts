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
              pr.avatar_url,
              pr.verified
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
        const { feed_type = 'all', current_user_id, user_posts } = req.query;
        
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
              p.views_count as views,
              0 as gifts,
              p.created_at,
              p.updated_at,
              pr.username,
              pr.avatar_url,
              pr.verified
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
              p.views_count as views,
              p.created_at,
              p.updated_at,
              pr.username,
              pr.avatar_url,
              pr.verified
            FROM posts p
            JOIN profiles pr ON p.user_id = pr.id
            JOIN follows f ON f.following_id = p.user_id
            WHERE f.follower_id = ${current_user_id}
              AND NOT EXISTS (
                SELECT 1 FROM blocked_users bu
                WHERE (bu.blocker_id = ${current_user_id} AND bu.blocked_id = p.user_id)
                   OR (bu.blocker_id = p.user_id AND bu.blocked_id = ${current_user_id})
              )
            ORDER BY p.created_at DESC
            LIMIT 50
          `;
        } else if (feed_type === 'trending') {
          // Trending feed - most liked posts
          if (current_user_id) {
            posts = await sql`
              SELECT
                p.id,
                p.user_id,
                p.content,
                p.image_url,
                p.likes_count as likes,
                p.comments_count as replies,
                p.shares_count as shares,
                p.views_count as views,
                p.created_at,
                p.updated_at,
                pr.username,
                pr.avatar_url,
                pr.verified
              FROM posts p
              JOIN profiles pr ON p.user_id = pr.id
              WHERE NOT EXISTS (
                SELECT 1 FROM blocked_users bu
                WHERE (bu.blocker_id = ${current_user_id} AND bu.blocked_id = p.user_id)
                   OR (bu.blocker_id = p.user_id AND bu.blocked_id = ${current_user_id})
              )
              ORDER BY p.likes_count DESC, p.created_at DESC
              LIMIT 50
            `;
          } else {
            posts = await sql`
              SELECT
                p.id,
                p.user_id,
                p.content,
                p.image_url,
                p.likes_count as likes,
                p.comments_count as replies,
                p.shares_count as shares,
                p.views_count as views,
                p.created_at,
                p.updated_at,
                pr.username,
                pr.avatar_url,
                pr.verified
              FROM posts p
              JOIN profiles pr ON p.user_id = pr.id
              ORDER BY p.likes_count DESC, p.created_at DESC
              LIMIT 50
            `;
          }
        } else {
          // Trenches feed (default) - newest posts from all users
          if (current_user_id) {
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
                pr.avatar_url,
                pr.verified
              FROM posts p
              JOIN profiles pr ON p.user_id = pr.id
              WHERE NOT EXISTS (
                SELECT 1 FROM blocked_users bu
                WHERE (bu.blocker_id = ${current_user_id} AND bu.blocked_id = p.user_id)
                   OR (bu.blocker_id = p.user_id AND bu.blocked_id = ${current_user_id})
              )
              ORDER BY p.created_at DESC
              LIMIT 50
            `;
          } else {
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
                pr.avatar_url,
                pr.verified
              FROM posts p
              JOIN profiles pr ON p.user_id = pr.id
              ORDER BY p.created_at DESC
              LIMIT 50
            `;
          }
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
          INSERT INTO posts (content, user_id, image_url, likes_count, comments_count, shares_count, views_count)
          VALUES (${content}, ${user_id}, ${image_url || null}, 0, 0, 0, 0)
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
            p.views_count as views,
            p.created_at,
            p.updated_at,
            pr.username,
            pr.avatar_url,
            pr.verified
          FROM posts p
          JOIN profiles pr ON p.user_id = pr.id
          WHERE p.id = ${newPost[0].id}
        `;

        return res.status(201).json({ success: true, post: postWithProfile[0] });

      case 'PUT':
        // Update post (like, gift, etc.)
        const { post_id, action, user_id: actionUserId } = req.body;

        if (!post_id || !action) {
          return res.status(400).json({ error: 'post_id and action are required' });
        }

        let updateQuery;
        let notificationType;
        let notificationMessage;

        switch (action) {
          case 'like':
            // Check if user already liked this post
            const existingLike = await sql`
              SELECT id FROM likes WHERE post_id = ${post_id} AND user_id = ${actionUserId}
            `;

            if (existingLike.length > 0) {
              // Unlike - remove like and decrease count
              await sql`DELETE FROM likes WHERE post_id = ${post_id} AND user_id = ${actionUserId}`;
              updateQuery = sql`UPDATE posts SET likes_count = likes_count - 1 WHERE id = ${post_id} RETURNING *`;
              notificationType = null; // No notification for unlikes
              notificationMessage = '';
            } else {
              // Like - add like and increase count
              await sql`INSERT INTO likes (post_id, user_id) VALUES (${post_id}, ${actionUserId})`;
              updateQuery = sql`UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${post_id} RETURNING *`;
              notificationType = 'like';
              notificationMessage = 'liked your post';
            }
            break;
          case 'gift':
            updateQuery = sql`UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${post_id} RETURNING *`;
            notificationType = 'like';
            notificationMessage = 'gifted your post';
            break;
          case 'share':
            updateQuery = sql`UPDATE posts SET shares_count = shares_count + 1 WHERE id = ${post_id} RETURNING *`;
            notificationType = 'share';
            notificationMessage = 'shared your post';
            break;
          default:
            return res.status(400).json({ error: 'Invalid action' });
        }

        const updatedPost = await updateQuery;

        if (updatedPost.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }

        // Create notification for the post owner (if it's not their own action and there's a notification type)
        if (actionUserId && updatedPost[0].user_id !== actionUserId && notificationType) {
          try {
            await sql`
              INSERT INTO notifications (user_id, from_user_id, type, message, post_id, read)
              VALUES (${updatedPost[0].user_id}, ${actionUserId}, ${notificationType}, ${notificationMessage}, ${post_id}, false)
            `;
          } catch (notificationError) {
            console.error('Failed to create notification:', notificationError);
            // Don't fail the whole request if notification fails
          }
        }

        return res.status(200).json({ post: updatedPost[0] });

      case 'DELETE':
        // Delete a post
        const { post_id: deletePostId, user_id: deleteUserId } = req.body;

        if (!deletePostId || !deleteUserId) {
          return res.status(400).json({ error: 'post_id and user_id are required' });
        }

        // Check if the post exists and belongs to the user
        const postToDelete = await sql`
          SELECT user_id FROM posts WHERE id = ${deletePostId}
        `;

        if (postToDelete.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }

        if (postToDelete[0].user_id !== deleteUserId) {
          return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        // Delete the post (this will cascade delete likes and comments due to FK constraints)
        await sql`DELETE FROM posts WHERE id = ${deletePostId}`;

        // Update user's post count
        await sql`
          UPDATE profiles
          SET posts_count = posts_count - 1
          WHERE id = ${deleteUserId}
        `;

        return res.status(200).json({ success: true, message: 'Post deleted successfully' });

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
