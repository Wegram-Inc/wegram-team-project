// User Profile API for Neon Postgres
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
        // Get user profile by username
        const { username } = req.query;

        if (!username) {
          return res.status(400).json({ error: 'Username is required' });
        }

        // Clean username (remove @ if present)
        const cleanUsername = username.toString().replace('@', '');

        // Try with social media fields first, fallback to basic fields if columns don't exist
        let users;
        try {
          users = await sql`
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
              twitter_followers_count,
              twitter_following_count,
              twitter_link,
              discord_link,
              telegram_link,
              created_at,
              updated_at
            FROM profiles
            WHERE username = ${`@${cleanUsername}`} OR username = ${cleanUsername}
          `;
        } catch (socialFieldsError) {
          // Fallback to basic fields if social media columns don't exist
          users = await sql`
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
              twitter_followers_count,
              twitter_following_count,
              created_at,
              updated_at
            FROM profiles
            WHERE username = ${`@${cleanUsername}`} OR username = ${cleanUsername}
          `;
        }

        if (users.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Get user's posts
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
            pr.avatar_url,
            pr.verified
          FROM posts p
          JOIN profiles pr ON p.user_id = pr.id
          WHERE p.user_id = ${user.id}
          ORDER BY p.created_at DESC
          LIMIT 20
        `;

        return res.status(200).json({
          user: {
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
            twitter_followers_count: user.twitter_followers_count,
            twitter_following_count: user.twitter_following_count,
            twitter_link: user.twitter_link || null,
            discord_link: user.discord_link || null,
            telegram_link: user.telegram_link || null,
            created_at: user.created_at,
            updated_at: user.updated_at
          },
          posts
        });

      case 'PUT':
        // Update username only
        const { id, username: newUsername } = req.body;

        if (!id || !newUsername) {
          return res.status(400).json({ error: 'User ID and username are required' });
        }

        // Add @ symbol if not present
        const formattedUsername = newUsername.startsWith('@') ? newUsername : `@${newUsername}`;

        // Check if username is unique
        const existingUser = await sql`
          SELECT id FROM profiles WHERE username = ${formattedUsername} AND id != ${id}
        `;

        if (existingUser.length > 0) {
          return res.status(400).json({ error: 'Username already taken' });
        }

        // Update username with @ symbol
        const updatedUser = await sql`
          UPDATE profiles
          SET username = ${formattedUsername}, updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, username, bio, avatar_url, verified
        `;

        if (updatedUser.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
          success: true,
          user: updatedUser[0]
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('User Profile API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
