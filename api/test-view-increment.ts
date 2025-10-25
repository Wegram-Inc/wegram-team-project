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
    // Get the first post to test with
    const posts = await sql`SELECT id, views_count FROM posts ORDER BY created_at DESC LIMIT 1`;

    if (posts.length === 0) {
      return res.status(404).json({ error: 'No posts found to test with' });
    }

    const testPost = posts[0];
    const beforeCount = testPost.views_count || 0;

    // Try to increment the view count
    await sql`
      UPDATE posts
      SET views_count = COALESCE(views_count, 0) + 1
      WHERE id = ${testPost.id}
    `;

    // Check if it actually updated
    const afterCheck = await sql`SELECT id, views_count FROM posts WHERE id = ${testPost.id}`;
    const afterCount = afterCheck[0].views_count || 0;

    return res.status(200).json({
      success: true,
      message: 'Test completed',
      postId: testPost.id,
      beforeCount: beforeCount,
      afterCount: afterCount,
      didIncrement: afterCount > beforeCount,
      diagnosis: afterCount > beforeCount
        ? '✅ Database UPDATE works! Problem is frontend not calling the API.'
        : '❌ Database UPDATE failed! The SQL query is not working.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      diagnosis: '❌ Database error - see details above'
    });
  }
}
