// API endpoint to save Twitter users to Neon Postgres
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const twitterData = req.body;

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL ||
                         process.env.DATABASE_URL ||
                         process.env.POSTGRES_PRISMA_URL;

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Create or update Twitter user in Neon Postgres
    const result = await sql`
      INSERT INTO profiles (
        username, avatar_url, bio, verified,
        twitter_id, twitter_username,
        followers_count, following_count, posts_count
      ) VALUES (
        ${twitterData.username || `@${twitterData.twitter_username}`},
        ${twitterData.avatar_url || twitterData.profile_image_url || null},
        ${twitterData.bio || twitterData.description || `Twitter user`},
        ${twitterData.verified || false},
        ${twitterData.twitter_id || twitterData.id},
        ${twitterData.twitter_username || twitterData.username?.replace('@', '')},
        ${twitterData.followers_count || 0},
        ${twitterData.following_count || 0},
        ${twitterData.posts_count || 0}
      )
      ON CONFLICT (twitter_id)
      DO UPDATE SET
        avatar_url = EXCLUDED.avatar_url,
        followers_count = EXCLUDED.followers_count,
        bio = EXCLUDED.bio,
        updated_at = NOW()
      RETURNING *
    `;

    const user = result[0];

    return res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error saving Twitter user to Neon:', error);
    return res.status(500).json({
      error: 'Failed to save user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
