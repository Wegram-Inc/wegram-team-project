// Vercel Serverless Function - Update User Profile
import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, bio, avatar_url, twitter_link, discord_link, telegram_link } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get database connection - Vercel Neon integration uses POSTGRES_URL
    const DATABASE_URL = process.env.POSTGRES_URL || 
                         process.env.DATABASE_URL || 
                         process.env.POSTGRES_PRISMA_URL ||
                         process.env.NEON_DATABASE_URL;
    
    if (!DATABASE_URL) {
      return res.status(500).json({ 
        error: 'Database not configured. Vercel Neon integration may not be set up properly.'
      });
    }

    const sql = neon(DATABASE_URL);

    // First, check if social media columns exist by attempting the update with graceful fallback
    let result;
    try {
      // Try updating with social media fields
      result = await sql`
        UPDATE profiles
        SET
          bio = ${bio || null},
          avatar_url = ${avatar_url || null},
          twitter_link = ${twitter_link || null},
          discord_link = ${discord_link || null},
          telegram_link = ${telegram_link || null},
          updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `;
    } catch (socialFieldsError) {
      console.log('Social media columns may not exist yet, updating without them:', socialFieldsError);

      // Fallback: update without social media fields
      result = await sql`
        UPDATE profiles
        SET
          bio = ${bio || null},
          avatar_url = ${avatar_url || null},
          updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `;

      // Add social media fields to the result manually for frontend compatibility
      if (result.length > 0) {
        result[0].twitter_link = null;
        result[0].discord_link = null;
        result[0].telegram_link = null;
      }
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found in database' });
    }


    return res.status(200).json({
      success: true,
      profile: result[0]
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
