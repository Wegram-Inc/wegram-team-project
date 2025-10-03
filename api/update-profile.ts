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

    // Update user profile in database - NO FALLBACKS, this is a live site
    // Only update bio and avatar for now (social media columns will be added later)
    const result = await sql`
      UPDATE profiles
      SET
        bio = ${bio || null},
        avatar_url = ${avatar_url || null},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `;

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
