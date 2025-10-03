// Test endpoint to verify feed filtering works
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const DATABASE_URL = process.env.POSTGRES_URL || 
                       process.env.DATABASE_URL || 
                       process.env.POSTGRES_PRISMA_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    // Test all three feed types
    const [trenchesPosts, trendingPosts, followingPosts] = await Promise.all([
      // Trenches - newest posts
      sql`
        SELECT 
          p.id,
          p.user_id,
          p.content,
          p.likes_count as likes,
          p.created_at,
          pr.username
        FROM posts p
        JOIN profiles pr ON p.user_id = pr.id
        ORDER BY p.created_at DESC
        LIMIT 5
      `,
      
      // Trending - most liked posts
      sql`
        SELECT 
          p.id,
          p.user_id,
          p.content,
          p.likes_count as likes,
          p.created_at,
          pr.username
        FROM posts p
        JOIN profiles pr ON p.user_id = pr.id
        ORDER BY p.likes_count DESC, p.created_at DESC
        LIMIT 5
      `,
      
      // Following - posts from followed users (using first user as example)
      sql`
        SELECT 
          p.id,
          p.user_id,
          p.content,
          p.likes_count as likes,
          p.created_at,
          pr.username
        FROM posts p
        JOIN profiles pr ON p.user_id = pr.id
        JOIN follows f ON f.following_id = p.user_id
        WHERE f.follower_id = (SELECT id FROM profiles LIMIT 1)
        ORDER BY p.created_at DESC
        LIMIT 5
      `
    ]);

    return res.status(200).json({
      success: true,
      test_results: {
        trenches: {
          count: trenchesPosts.length,
          posts: trenchesPosts
        },
        trending: {
          count: trendingPosts.length,
          posts: trendingPosts
        },
        following: {
          count: followingPosts.length,
          posts: followingPosts
        }
      },
      debug_info: {
        total_posts: (await sql`SELECT COUNT(*) FROM posts`)[0]?.count,
        total_profiles: (await sql`SELECT COUNT(*) FROM profiles`)[0]?.count,
        total_follows: (await sql`SELECT COUNT(*) FROM follows`)[0]?.count
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
