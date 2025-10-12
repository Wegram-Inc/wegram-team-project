// Follow/Unfollow API for Neon Postgres
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
      case 'POST':
        // Follow a user
        const { follower_id, following_id } = req.body;

        if (!follower_id || !following_id) {
          return res.status(400).json({ error: 'follower_id and following_id are required' });
        }

        if (follower_id === following_id) {
          return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        // Check if already following
        const existingFollow = await sql`
          SELECT id FROM follows 
          WHERE follower_id = ${follower_id} AND following_id = ${following_id}
        `;

        if (existingFollow.length > 0) {
          return res.status(400).json({ error: 'Already following this user' });
        }

        // Create follow relationship
        await sql`
          INSERT INTO follows (follower_id, following_id)
          VALUES (${follower_id}, ${following_id})
        `;

        // Update follower count
        await sql`
          UPDATE profiles 
          SET following_count = following_count + 1 
          WHERE id = ${follower_id}
        `;

        // Update following count
        await sql`
          UPDATE profiles
          SET followers_count = followers_count + 1
          WHERE id = ${following_id}
        `;

        // Get follower's username for notification message
        const followerProfile = await sql`
          SELECT username FROM profiles WHERE id = ${follower_id}
        `;

        if (followerProfile.length > 0) {
          // Create notification for the user being followed
          const message = `${followerProfile[0].username} started following you`;
          await sql`
            INSERT INTO notifications (user_id, from_user_id, type, message, read)
            VALUES (${following_id}, ${follower_id}, 'follow', ${message}, false)
          `;
        }

        return res.status(201).json({ success: true, message: 'User followed successfully' });

      case 'DELETE':
        // Unfollow a user
        const { follower_id: unfollower_id, following_id: unfollowing_id } = req.body;

        if (!unfollower_id || !unfollowing_id) {
          return res.status(400).json({ error: 'follower_id and following_id are required' });
        }

        // Check if following
        const followToDelete = await sql`
          SELECT id FROM follows 
          WHERE follower_id = ${unfollower_id} AND following_id = ${unfollowing_id}
        `;

        if (followToDelete.length === 0) {
          return res.status(400).json({ error: 'Not following this user' });
        }

        // Delete follow relationship
        await sql`
          DELETE FROM follows 
          WHERE follower_id = ${unfollower_id} AND following_id = ${unfollowing_id}
        `;

        // Update follower count
        await sql`
          UPDATE profiles 
          SET following_count = following_count - 1 
          WHERE id = ${unfollower_id}
        `;

        // Update following count
        await sql`
          UPDATE profiles 
          SET followers_count = followers_count - 1 
          WHERE id = ${unfollowing_id}
        `;

        return res.status(200).json({ success: true, message: 'User unfollowed successfully' });

      case 'GET':
        const {
          follower_id: check_follower_id,
          following_id: check_following_id,
          user_id,
          type
        } = req.query;

        // Check if user is following another user
        if (check_follower_id && check_following_id) {
          const followStatus = await sql`
            SELECT id FROM follows
            WHERE follower_id = ${check_follower_id} AND following_id = ${check_following_id}
          `;

          return res.status(200).json({
            isFollowing: followStatus.length > 0
          });
        }

        // Get following or followers list
        if (user_id && type) {
          if (type === 'following') {
            // Get list of users this user is following
            const following = await sql`
              SELECT
                p.id,
                p.username,
                p.avatar_url,
                p.verified,
                p.bio,
                p.followers_count,
                f.created_at as followed_at
              FROM follows f
              JOIN profiles p ON f.following_id = p.id
              WHERE f.follower_id = ${user_id}
              ORDER BY f.created_at DESC
            `;

            return res.status(200).json({
              success: true,
              following,
              count: following.length
            });
          }

          if (type === 'followers') {
            // Get list of users following this user
            const followers = await sql`
              SELECT
                p.id,
                p.username,
                p.avatar_url,
                p.verified,
                p.bio,
                p.followers_count,
                f.created_at as followed_at
              FROM follows f
              JOIN profiles p ON f.follower_id = p.id
              WHERE f.following_id = ${user_id}
              ORDER BY f.created_at DESC
            `;

            return res.status(200).json({
              success: true,
              followers,
              count: followers.length
            });
          }

          return res.status(400).json({ error: 'Invalid type. Use "following" or "followers"' });
        }

        return res.status(400).json({ error: 'Invalid query parameters' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Follow API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
