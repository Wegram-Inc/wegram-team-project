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
    // Total users
    const totalUsers = await sql`SELECT COUNT(*) as count FROM profiles`;

    // Total posts
    const totalPosts = await sql`SELECT COUNT(*) as count FROM posts`;

    // Total comments
    const totalComments = await sql`SELECT COUNT(*) as count FROM comments`;

    // Total likes
    const totalLikes = await sql`
      SELECT SUM(likes_count) as count FROM posts
    `;

    // Email users (profiles with email containing @)
    const emailUsers = await sql`
      SELECT COUNT(*) as count FROM profiles WHERE email LIKE '%@%'
    `;

    // Users with Twitter linked
    const xUsers = await sql`
      SELECT COUNT(*) as count FROM profiles WHERE twitter_link IS NOT NULL AND twitter_link != ''
    `;

    // Total views
    const totalViews = await sql`
      SELECT SUM(views_count) as count FROM posts
    `;

    // Total shares
    const totalShares = await sql`
      SELECT SUM(shares_count) as count FROM posts
    `;

    // Total follows
    const totalFollows = await sql`
      SELECT COUNT(*) as count FROM follows
    `;

    // Active users (posted in last 7 days)
    const activeUsers = await sql`
      SELECT COUNT(DISTINCT user_id) as count
      FROM posts
      WHERE created_at > NOW() - INTERVAL '7 days'
    `;

    // Posts today
    const postsToday = await sql`
      SELECT COUNT(*) as count
      FROM posts
      WHERE created_at::date = CURRENT_DATE
    `;

    // Average posts per user
    const avgPostsPerUser = totalUsers[0].count > 0
      ? (totalPosts[0].count / totalUsers[0].count).toFixed(2)
      : 0;

    // Engagement rate (likes + comments + shares per post)
    const totalEngagement =
      (parseInt(totalLikes[0].count) || 0) +
      (parseInt(totalComments[0].count) || 0) +
      (parseInt(totalShares[0].count) || 0);
    const engagementRate = totalPosts[0].count > 0
      ? (totalEngagement / totalPosts[0].count).toFixed(2)
      : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsers[0].count),
        totalPosts: parseInt(totalPosts[0].count),
        totalComments: parseInt(totalComments[0].count),
        totalLikes: parseInt(totalLikes[0].count) || 0,
        totalViews: parseInt(totalViews[0].count) || 0,
        totalShares: parseInt(totalShares[0].count) || 0,
        totalFollows: parseInt(totalFollows[0].count),
        emailUsers: parseInt(emailUsers[0].count),
        xUsers: parseInt(xUsers[0].count),
        activeUsersLast7Days: parseInt(activeUsers[0].count),
        postsToday: parseInt(postsToday[0].count),
        avgPostsPerUser: parseFloat(avgPostsPerUser),
        engagementRate: parseFloat(engagementRate),
        totalEngagement: totalEngagement
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
