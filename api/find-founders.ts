// Find Founder Accounts API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL ||
                         process.env.DATABASE_URL ||
                         process.env.POSTGRES_PRISMA_URL;

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Search for founder accounts
    // Look for variations of the usernames with and without @ symbols
    const founders = await sql`
      SELECT
        id, username, email, avatar_url, bio, verified,
        followers_count, following_count, posts_count,
        twitter_username, created_at
      FROM profiles
      WHERE (
        username ILIKE '%puff012%'
        OR username ILIKE '%_fudder%'
        OR username ILIKE '%thewegramapp%'
        OR username ILIKE '%wegram%'
      )
      ORDER BY
        CASE
          WHEN verified = true THEN 1
          ELSE 2
        END,
        created_at ASC
    `;

    // Format results to show exact usernames
    const formattedFounders = founders.map(user => ({
      id: user.id,
      exactUsername: user.username, // Show the exact username as stored
      displayName: user.username.replace('@', ''),
      email: user.email,
      avatar_url: user.avatar_url,
      bio: user.bio,
      verified: user.verified,
      followers_count: user.followers_count || 0,
      following_count: user.following_count || 0,
      posts_count: user.posts_count || 0,
      twitter_username: user.twitter_username,
      created_at: user.created_at
    }));

    return res.status(200).json({
      success: true,
      founders: formattedFounders,
      count: formattedFounders.length,
      message: 'Found potential founder accounts'
    });

  } catch (error) {
    console.error('Find founders error:', error);
    return res.status(500).json({
      error: 'Failed to find founder accounts',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}