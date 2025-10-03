// User Search API for Neon Postgres
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
        // Search for users
        const { q, type = 'users' } = req.query;

        if (!q || typeof q !== 'string') {
          return res.status(400).json({ error: 'Search query is required' });
        }

        const searchTerm = q.trim();

        if (type === 'users') {
          // Search for users by username
          const users = await sql`
            SELECT 
              id,
              username,
              email,
              avatar_url,
              bio,
              verified,
              followers_count,
              following_count,
              posts_count,
              twitter_id,
              twitter_username,
              created_at
            FROM profiles 
            WHERE username ILIKE ${`%${searchTerm}%`} 
               OR username ILIKE ${`%@${searchTerm}%`}
               OR twitter_username ILIKE ${`%${searchTerm}%`}
            ORDER BY 
              CASE 
                WHEN username ILIKE ${`${searchTerm}%`} THEN 1
                WHEN username ILIKE ${`%@${searchTerm}%`} THEN 2
                WHEN twitter_username ILIKE ${`${searchTerm}%`} THEN 3
                ELSE 4
              END,
              followers_count DESC
            LIMIT 20
          `;

          return res.status(200).json({ 
            users: users.map(user => ({
              id: user.id,
              username: user.username,
              email: user.email,
              avatar_url: user.avatar_url,
              bio: user.bio,
              verified: user.verified,
              followers_count: user.followers_count,
              following_count: user.following_count,
              posts_count: user.posts_count,
              twitter_id: user.twitter_id,
              twitter_username: user.twitter_username,
              created_at: user.created_at
            }))
          });

        } else if (type === 'posts') {
          // Search for posts
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
            WHERE p.content ILIKE ${`%${searchTerm}%`}
            ORDER BY p.created_at DESC
            LIMIT 20
          `;

          return res.status(200).json({ posts });

        } else {
          return res.status(400).json({ error: 'Invalid search type' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
