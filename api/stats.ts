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
    if (req.method === 'GET') {
      // Get total users
      const usersResult = await sql`
        SELECT COUNT(*) as total FROM profiles
      `;
      const totalUsers = parseInt(usersResult[0].total);

      // Get total posts
      const postsResult = await sql`
        SELECT COUNT(*) as total FROM posts
      `;
      const totalPosts = parseInt(postsResult[0].total);

      // Get total comments
      const commentsResult = await sql`
        SELECT COUNT(*) as total FROM comments
      `;
      const totalComments = parseInt(commentsResult[0].total);

      // Get total likes (sum of likes_count from all posts)
      const likesResult = await sql`
        SELECT COALESCE(SUM(likes_count), 0) as total FROM posts
      `;
      const totalLikes = parseInt(likesResult[0].total);

      return res.status(200).json({
        success: true,
        stats: {
          total_users: totalUsers,
          total_posts: totalPosts,
          total_comments: totalComments,
          total_likes: totalLikes
        }
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Stats API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
