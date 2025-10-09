import { neon } from '@neondatabase/serverless';

const isServerSide = typeof window === 'undefined';

// Safely detect database URL from Vite or Node environments
const DATABASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    (import.meta.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL)) ||
  (typeof process !== 'undefined' && process.env && process.env.DATABASE_URL) ||
  null;

// Initialize Neon SQL client only on the server
const sql = DATABASE_URL && isServerSide ? neon(DATABASE_URL) : null;

if (!DATABASE_URL && isServerSide) {
  console.warn('⚠️ No DATABASE_URL found. Database features will be disabled.');
}

export interface Profile {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  twitter_id?: string;
  twitter_username?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  username?: string;
  avatar_url?: string;
  verified?: boolean;
}

export class NeonSimpleService {
  // Create or update user from Twitter data (UPSERT)
  async createUserFromTwitter(twitterData: any): Promise<Profile> {
    if (!sql) {
      throw new Error('Database connection not available. Cannot create user.');
    }

    const result = await sql`
      INSERT INTO profiles (
        username, avatar_url, bio, verified, 
        twitter_id, twitter_username,
        followers_count, following_count
      ) VALUES (
        ${`@${twitterData.username}`},
        ${twitterData.profile_image_url || null},
        ${twitterData.description || `Twitter user ${twitterData.name}`},
        ${twitterData.verified || false},
        ${twitterData.id},
        ${twitterData.username},
        ${twitterData.followers_count || 0},
        ${0}
      )
      ON CONFLICT (twitter_id) 
      DO UPDATE SET
        followers_count = EXCLUDED.followers_count,
        updated_at = NOW()
      RETURNING *
    `;

    return result[0] as Profile;
  }

  // Get user by Twitter ID
  async getUserByTwitterId(twitterId: string): Promise<Profile | null> {
    if (!sql) return null;

    const result = await sql`
      SELECT * FROM profiles WHERE twitter_id = ${twitterId}
    `;

    return (result[0] as Profile) || null;
  }

  // Get user feed
  async getFeedPosts(userId: string, limit = 20): Promise<Post[]> {
    if (!sql) return [];

    const result = await sql`
      SELECT 
        p.*,
        pr.username,
        pr.avatar_url,
        pr.verified
      FROM posts p
      JOIN profiles pr ON p.user_id = pr.id
      JOIN follows f ON p.user_id = f.following_id
      WHERE f.follower_id = ${userId}
      ORDER BY p.created_at DESC
      LIMIT ${limit}
    `;

    return result as Post[];
  }

  // Create post
  async createPost(
    userId: string,
    content: string,
    imageUrl?: string
  ): Promise<Post> {
    if (!sql) throw new Error('Database connection not available.');

    const result = await sql`
      INSERT INTO posts (user_id, content, image_url)
      VALUES (${userId}, ${content}, ${imageUrl || null})
      RETURNING *
    `;

    return result[0] as Post;
  }

  // 🧩 Like post
  async likePost(userId: string, postId: string): Promise<boolean> {
    if (!sql) return false;

    try {
      await sql`
        INSERT INTO likes (user_id, post_id)
        VALUES (${userId}, ${postId})
        ON CONFLICT (user_id, post_id) DO NOTHING
      `;

      await sql`
        UPDATE posts 
        SET likes_count = (
          SELECT COUNT(*) FROM likes WHERE post_id = ${postId}
        )
        WHERE id = ${postId}
      `;

      return true;
    } catch (error) {
      console.error('Like error:', error);
      return false;
    }
  }

  // Follow user
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    if (!sql) return false;

    try {
      await sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${followerId}, ${followingId})
        ON CONFLICT (follower_id, following_id) DO NOTHING
      `;

      return true;
    } catch (error) {
      console.error('Follow error:', error);
      return false;
    }
  }

  // 🧩 Get trending posts
  async getTrendingPosts(limit = 20): Promise<Post[]> {
    if (!sql) return [];

    const result = await sql`
      SELECT
        p.*,
        pr.username,
        pr.avatar_url,
        pr.verified
      FROM posts p
      JOIN profiles pr ON p.user_id = pr.id
      WHERE p.created_at > NOW() - INTERVAL '24 hours'
      ORDER BY p.likes_count DESC, p.created_at DESC
      LIMIT ${limit}
    `;

    return result as Post[];
  }

  // Bookmark post
  async bookmarkPost(userId: string, postId: string): Promise<boolean> {
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
  }

  // Remove bookmark
  async removeBookmark(userId: string, postId: string): Promise<boolean> {
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

  // Get user bookmarks
  async getUserBookmarks(userId: string, limit = 20): Promise<Post[]> {
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

      return result as Post[];
    } catch (error) {
      console.error('Get bookmarks error:', error);
      return [];
    }
  }

  // Check if post is bookmarked
  async isPostBookmarked(userId: string, postId: string): Promise<boolean> {
    if (!sql) return false;

    try {
      const result = await sql`
        SELECT id FROM bookmarks
        WHERE user_id = ${userId} AND post_id = ${postId}
      `;
      return result.length > 0;
    } catch (error) {
      console.error('Check bookmark error:', error);
      return false;
    }
  }
}

export const neonSimple = new NeonSimpleService();
