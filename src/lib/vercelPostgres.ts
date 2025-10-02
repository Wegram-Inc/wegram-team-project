// Vercel Postgres Database Service for WEGRAM
import { sql } from '@vercel/postgres';

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
  // Joined data from queries
  username?: string;
  avatar_url?: string;
  verified?: boolean;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export class VercelPostgresService {
  
  // 🚀 Create user from Twitter data
  async createUserFromTwitter(twitterData: any): Promise<Profile> {
    const { rows } = await sql`
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
        ${twitterData.following_count || 0}
      )
      RETURNING *
    `;
    
    return rows[0] as Profile;
  }

  // 🚀 Get user by Twitter ID
  async getUserByTwitterId(twitterId: string): Promise<Profile | null> {
    const { rows } = await sql`
      SELECT * FROM profiles WHERE twitter_id = ${twitterId}
    `;
    
    return rows[0] as Profile || null;
  }

  // 🚀 Get user by ID
  async getUserById(userId: string): Promise<Profile | null> {
    const { rows } = await sql`
      SELECT * FROM profiles WHERE id = ${userId}
    `;
    
    return rows[0] as Profile || null;
  }

  // 🚀 Get user feed - SUPER FAST single query!
  async getFeedPosts(userId: string, limit = 20): Promise<Post[]> {
    const { rows } = await sql`
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
    
    return rows as Post[];
  }

  // 🚀 Get user's own posts
  async getUserPosts(userId: string, limit = 20): Promise<Post[]> {
    const { rows } = await sql`
      SELECT 
        p.*,
        pr.username,
        pr.avatar_url,
        pr.verified
      FROM posts p
      JOIN profiles pr ON p.user_id = pr.id
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
      LIMIT ${limit}
    `;
    
    return rows as Post[];
  }

  // 🚀 Create post
  async createPost(userId: string, content: string, imageUrl?: string): Promise<Post> {
    const { rows } = await sql`
      INSERT INTO posts (user_id, content, image_url)
      VALUES (${userId}, ${content}, ${imageUrl || null})
      RETURNING *
    `;
    
    // Update user's post count
    await sql`
      UPDATE profiles 
      SET posts_count = posts_count + 1 
      WHERE id = ${userId}
    `;
    
    return rows[0] as Post;
  }

  // 🚀 Like post
  async likePost(userId: string, postId: string): Promise<boolean> {
    try {
      // Insert like (ignore if already exists)
      await sql`
        INSERT INTO likes (user_id, post_id)
        VALUES (${userId}, ${postId})
        ON CONFLICT (user_id, post_id) DO NOTHING
      `;
      
      // Update likes count
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

  // 🚀 Unlike post
  async unlikePost(userId: string, postId: string): Promise<boolean> {
    try {
      // Remove like
      await sql`
        DELETE FROM likes 
        WHERE user_id = ${userId} AND post_id = ${postId}
      `;
      
      // Update likes count
      await sql`
        UPDATE posts 
        SET likes_count = (
          SELECT COUNT(*) FROM likes WHERE post_id = ${postId}
        )
        WHERE id = ${postId}
      `;
      
      return true;
    } catch (error) {
      console.error('Unlike error:', error);
      return false;
    }
  }

  // 🚀 Check if post is liked by user
  async isPostLiked(userId: string, postId: string): Promise<boolean> {
    const { rows } = await sql`
      SELECT 1 FROM likes 
      WHERE user_id = ${userId} AND post_id = ${postId}
    `;
    
    return rows.length > 0;
  }

  // 🚀 Follow user
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      // Insert follow relationship
      await sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${followerId}, ${followingId})
        ON CONFLICT (follower_id, following_id) DO NOTHING
      `;
      
      // Update follower count for the user being followed
      await sql`
        UPDATE profiles 
        SET followers_count = (
          SELECT COUNT(*) FROM follows WHERE following_id = ${followingId}
        )
        WHERE id = ${followingId}
      `;
      
      // Update following count for the user doing the following
      await sql`
        UPDATE profiles 
        SET following_count = (
          SELECT COUNT(*) FROM follows WHERE follower_id = ${followerId}
        )
        WHERE id = ${followerId}
      `;
      
      return true;
    } catch (error) {
      console.error('Follow error:', error);
      return false;
    }
  }

  // 🚀 Unfollow user
  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      // Remove follow relationship
      await sql`
        DELETE FROM follows 
        WHERE follower_id = ${followerId} AND following_id = ${followingId}
      `;
      
      // Update follower count for the user being unfollowed
      await sql`
        UPDATE profiles 
        SET followers_count = (
          SELECT COUNT(*) FROM follows WHERE following_id = ${followingId}
        )
        WHERE id = ${followingId}
      `;
      
      // Update following count for the user doing the unfollowing
      await sql`
        UPDATE profiles 
        SET following_count = (
          SELECT COUNT(*) FROM follows WHERE follower_id = ${followerId}
        )
        WHERE id = ${followerId}
      `;
      
      return true;
    } catch (error) {
      console.error('Unfollow error:', error);
      return false;
    }
  }

  // 🚀 Check if user is following another user
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { rows } = await sql`
      SELECT 1 FROM follows 
      WHERE follower_id = ${followerId} AND following_id = ${followingId}
    `;
    
    return rows.length > 0;
  }

  // 🚀 Get trending posts (most liked in last 24 hours)
  async getTrendingPosts(limit = 20): Promise<Post[]> {
    const { rows } = await sql`
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
    
    return rows as Post[];
  }

  // 🚀 Search users by username
  async searchUsers(query: string, limit = 10): Promise<Profile[]> {
    const { rows } = await sql`
      SELECT * FROM profiles 
      WHERE username ILIKE ${`%${query}%`}
      ORDER BY followers_count DESC
      LIMIT ${limit}
    `;
    
    return rows as Profile[];
  }

  // 🚀 Get user stats
  async getUserStats(userId: string) {
    const { rows } = await sql`
      SELECT 
        (SELECT COUNT(*) FROM posts WHERE user_id = ${userId}) as posts_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ${userId}) as following_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = ${userId}) as followers_count,
        (SELECT COUNT(*) FROM likes l JOIN posts p ON l.post_id = p.id WHERE p.user_id = ${userId}) as total_likes_received
    `;
    
    return rows[0];
  }
}

export const vercelPostgres = new VercelPostgresService();




