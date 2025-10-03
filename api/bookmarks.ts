import { neon } from '@neondatabase/serverless';

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Simplified bookmark functions for API
const bookmarkService = {
  async getUserBookmarks(userId: string, limit = 20) {
    if (!sql) return [];

    try {
      const result = await sql`
        SELECT
          p.*,
          pr.username,
          pr.avatar_url,
          pr.verified,
          b.created_at as bookmarked_at
        FROM bookmarks b
        JOIN posts p ON b.post_id = p.id
        JOIN profiles pr ON p.user_id = pr.id
        WHERE b.user_id = ${userId}
        ORDER BY b.created_at DESC
        LIMIT ${limit}
      `;
      return result;
    } catch (error) {
      console.error('Get bookmarks error:', error);
      return [];
    }
  },

  async bookmarkPost(userId: string, postId: string) {
    if (!sql) return false;

    try {
      await sql`
        INSERT INTO bookmarks (user_id, post_id)
        VALUES (${userId}, ${postId})
        ON CONFLICT (user_id, post_id) DO NOTHING
      `;
      return true;
    } catch (error) {
      console.error('Bookmark error:', error);
      return false;
    }
  },

  async removeBookmark(userId: string, postId: string) {
    if (!sql) return false;

    try {
      await sql`
        DELETE FROM bookmarks
        WHERE user_id = ${userId} AND post_id = ${postId}
      `;
      return true;
    } catch (error) {
      console.error('Remove bookmark error:', error);
      return false;
    }
  }
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        // Get user bookmarks
        const { userId } = req.query;

        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID is required'
          });
        }

        const bookmarks = await bookmarkService.getUserBookmarks(userId);
        return res.status(200).json({
          success: true,
          bookmarks
        });

      case 'POST':
        // Add bookmark
        const { userId: bookmarkUserId, postId } = req.body;

        if (!bookmarkUserId || !postId) {
          return res.status(400).json({
            success: false,
            error: 'User ID and Post ID are required'
          });
        }

        const bookmarkSuccess = await bookmarkService.bookmarkPost(bookmarkUserId, postId);

        if (bookmarkSuccess) {
          return res.status(200).json({
            success: true,
            message: 'Post bookmarked successfully'
          });
        } else {
          return res.status(500).json({
            success: false,
            error: 'Failed to bookmark post'
          });
        }

      case 'DELETE':
        // Remove bookmark
        const { userId: removeUserId, postId: removePostId } = req.body;

        if (!removeUserId || !removePostId) {
          return res.status(400).json({
            success: false,
            error: 'User ID and Post ID are required'
          });
        }

        const removeSuccess = await bookmarkService.removeBookmark(removeUserId, removePostId);

        if (removeSuccess) {
          return res.status(200).json({
            success: true,
            message: 'Bookmark removed successfully'
          });
        } else {
          return res.status(500).json({
            success: false,
            error: 'Failed to remove bookmark'
          });
        }

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Bookmarks API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}