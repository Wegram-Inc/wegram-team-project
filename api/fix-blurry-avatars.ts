// Fix blurry Twitter/X avatar images by upgrading to higher resolution
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Accept both GET and POST
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    // Find all users with Twitter avatars that have '_normal' (low resolution)
    const usersWithBlurryAvatars = await sql`
      SELECT id, username, avatar_url
      FROM profiles
      WHERE avatar_url LIKE '%_normal%'
      AND twitter_id IS NOT NULL
    `;

    let updatedCount = 0;

    // Update each blurry avatar to high resolution
    for (const user of usersWithBlurryAvatars) {
      const highResAvatar = user.avatar_url.replace('_normal', '_400x400');

      await sql`
        UPDATE profiles
        SET avatar_url = ${highResAvatar}
        WHERE id = ${user.id}
      `;

      updatedCount++;
    }

    return res.status(200).json({
      success: true,
      message: 'Blurry Twitter/X avatars fixed - upgraded to 400x400 resolution',
      usersFound: usersWithBlurryAvatars.length,
      usersUpdated: updatedCount,
      example: usersWithBlurryAvatars.length > 0 ? {
        before: usersWithBlurryAvatars[0]?.avatar_url,
        after: usersWithBlurryAvatars[0]?.avatar_url?.replace('_normal', '_400x400')
      } : null
    });

  } catch (error) {
    console.error('Fix blurry avatars error:', error);
    return res.status(500).json({
      error: 'Failed to fix blurry avatars',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}