// User Search API for Messaging
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
    const { q: query, exclude_user } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL ||
                         process.env.DATABASE_URL ||
                         process.env.POSTGRES_PRISMA_URL;

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Search for users by username or display name
    // Exclude the current user from search results
    const searchPattern = `%${query.toLowerCase()}%`;
    let searchQuery;

    if (exclude_user) {
      searchQuery = sql`
        SELECT
          id, username, email, avatar_url, bio, verified,
          followers_count, following_count, posts_count,
          twitter_username, created_at
        FROM profiles
        WHERE (
          LOWER(username) LIKE ${searchPattern}
          OR LOWER(COALESCE(bio, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(twitter_username, '')) LIKE ${searchPattern}
        )
        AND id != ${exclude_user}
        ORDER BY
          CASE
            WHEN LOWER(username) = ${query.toLowerCase()} THEN 1
            WHEN LOWER(username) LIKE ${query.toLowerCase() + '%'} THEN 2
            ELSE 3
          END,
          followers_count DESC
        LIMIT 20
      `;
    } else {
      searchQuery = sql`
        SELECT
          id, username, email, avatar_url, bio, verified,
          followers_count, following_count, posts_count,
          twitter_username, created_at
        FROM profiles
        WHERE (
          LOWER(username) LIKE ${searchPattern}
          OR LOWER(COALESCE(bio, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(twitter_username, '')) LIKE ${searchPattern}
        )
        ORDER BY
          CASE
            WHEN LOWER(username) = ${query.toLowerCase()} THEN 1
            WHEN LOWER(username) LIKE ${query.toLowerCase() + '%'} THEN 2
            ELSE 3
          END,
          followers_count DESC
        LIMIT 20
      `;
    }

    const users = await searchQuery;

    // Format results for frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username.startsWith('@') ? user.username : `@${user.username}`,
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
      users: formattedUsers,
      count: formattedUsers.length
    });

  } catch (error) {
    console.error('User search error:', error);
    return res.status(500).json({
      error: 'Failed to search users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}