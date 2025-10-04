// Analytics API for user statistics
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
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL ||
                         process.env.DATABASE_URL ||
                         process.env.POSTGRES_PRISMA_URL;

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Get user's posts with stats
    const userPosts = await sql`
      SELECT
        id,
        content,
        likes_count,
        comments_count,
        shares_count,
        created_at,
        updated_at
      FROM posts
      WHERE user_id = ${user_id}
      ORDER BY created_at DESC
    `;

    // Get user's bookmarks count
    const bookmarksResult = await sql`
      SELECT COUNT(*) as bookmark_count
      FROM bookmarks
      WHERE user_id = ${user_id}
    `;

    // Get user's messages stats
    const messagesResult = await sql`
      SELECT
        COUNT(*) as total_messages,
        COUNT(CASE WHEN sender_id = ${user_id} THEN 1 END) as sent_messages,
        COUNT(CASE WHEN receiver_id = ${user_id} THEN 1 END) as received_messages
      FROM messages
      WHERE sender_id = ${user_id} OR receiver_id = ${user_id}
    `;

    // Get user's profile info for followers/following
    const profileResult = await sql`
      SELECT
        followers_count,
        following_count,
        posts_count,
        created_at
      FROM profiles
      WHERE id = ${user_id}
    `;

    // Calculate totals
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes_count || 0), 0);
    const totalComments = userPosts.reduce((sum, post) => sum + (post.comments_count || 0), 0);
    const totalShares = userPosts.reduce((sum, post) => sum + (post.shares_count || 0), 0);
    const totalEngagements = totalLikes + totalComments + totalShares;

    // Get top liked posts (top 5)
    const topLikedPosts = userPosts
      .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        content: post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        shares: post.shares_count || 0,
        created_at: post.created_at
      }));

    // Get posts by date for activity chart (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const postsActivity = await sql`
      SELECT
        DATE(created_at) as post_date,
        COUNT(*) as posts_count,
        SUM(likes_count) as daily_likes,
        SUM(comments_count) as daily_comments
      FROM posts
      WHERE user_id = ${user_id}
        AND created_at >= ${thirtyDaysAgo.toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY post_date DESC
    `;

    const profile = profileResult[0] || {};
    const messages = messagesResult[0] || {};
    const bookmarks = bookmarksResult[0] || {};

    // Calculate engagement rate
    const engagementRate = userPosts.length > 0
      ? ((totalEngagements / userPosts.length) * 100).toFixed(1)
      : '0';

    const analytics = {
      overview: {
        totalPosts: userPosts.length,
        totalLikes: totalLikes,
        totalComments: totalComments,
        totalShares: totalShares,
        totalEngagements: totalEngagements,
        engagementRate: parseFloat(engagementRate),
        bookmarks: parseInt(bookmarks.bookmark_count) || 0,
        followers: profile.followers_count || 0,
        following: profile.following_count || 0,
        messagesSent: parseInt(messages.sent_messages) || 0,
        messagesReceived: parseInt(messages.received_messages) || 0,
        totalMessages: parseInt(messages.total_messages) || 0,
        memberSince: profile.created_at
      },
      topLikedPosts,
      postsActivity: postsActivity.map(activity => ({
        date: activity.post_date,
        posts: parseInt(activity.posts_count),
        likes: parseInt(activity.daily_likes) || 0,
        comments: parseInt(activity.daily_comments) || 0
      }))
    };

    return res.status(200).json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}