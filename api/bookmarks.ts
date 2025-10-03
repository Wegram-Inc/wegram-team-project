// Bookmarks API for Neon Postgres
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
        // Get user's bookmarks
        const { user_id } = req.query;
        
        if (!user_id) {
          return res.status(400).json({ error: 'user_id is required' });
        }

        const bookmarks = await sql`
          SELECT 
            b.id,
            b.user_id,
            b.post_id,
            b.created_at,
            p.content,
            p.image_url,
            p.likes_count,
            p.comments_count,
            p.shares_count,
            p.gifts_count,
            p.created_at as post_created_at,
            p.updated_at as post_updated_at,
            pr.username,
            pr.avatar_url
          FROM bookmarks b
          JOIN posts p ON b.post_id = p.id
          JOIN profiles pr ON p.user_id = pr.id
          WHERE b.user_id = ${user_id}
          ORDER BY b.created_at DESC
        `;

        // Transform the data to match our interface
        const transformedBookmarks = bookmarks.map(bookmark => ({
          id: bookmark.id,
          user_id: bookmark.user_id,
          post_id: bookmark.post_id,
          created_at: bookmark.created_at,
          post: {
            id: bookmark.post_id,
            user_id: bookmark.user_id,
            content: bookmark.content,
            image_url: bookmark.image_url,
            likes_count: bookmark.likes_count,
            comments_count: bookmark.comments_count,
            shares_count: bookmark.shares_count,
            gifts_count: bookmark.gifts_count,
            created_at: bookmark.post_created_at,
            updated_at: bookmark.post_updated_at,
            username: bookmark.username,
            avatar_url: bookmark.avatar_url
          }
        }));

        return res.status(200).json({ bookmarks: transformedBookmarks });

      case 'POST':
        // Add bookmark
        const { post_id, user_id: bookmark_user_id } = req.body;
        
        if (!post_id || !bookmark_user_id) {
          return res.status(400).json({ error: 'post_id and user_id are required' });
        }

        // Check if bookmark already exists
        const existingBookmark = await sql`
          SELECT id FROM bookmarks 
          WHERE user_id = ${bookmark_user_id} AND post_id = ${post_id}
        `;

        if (existingBookmark.length > 0) {
          return res.status(200).json({ success: true, message: 'Already bookmarked' });
        }

        // Add bookmark
        await sql`
          INSERT INTO bookmarks (user_id, post_id)
          VALUES (${bookmark_user_id}, ${post_id})
        `;

        return res.status(200).json({ success: true });

      case 'DELETE':
        // Remove bookmark or clear all bookmarks
        const { post_id: delete_post_id, user_id: delete_user_id, clear_all } = req.body;
        
        if (!delete_user_id) {
          return res.status(400).json({ error: 'user_id is required' });
        }

        if (clear_all) {
          // Clear all bookmarks for user
          await sql`
            DELETE FROM bookmarks 
            WHERE user_id = ${delete_user_id}
          `;
        } else if (delete_post_id) {
          // Remove specific bookmark
          await sql`
            DELETE FROM bookmarks 
            WHERE user_id = ${delete_user_id} AND post_id = ${delete_post_id}
          `;
        } else {
          return res.status(400).json({ error: 'post_id or clear_all is required' });
        }

        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Bookmarks API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
