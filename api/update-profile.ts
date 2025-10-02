// Vercel Serverless Function - Update User Profile
import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, bio, avatar_url } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get database connection
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      console.error('DATABASE_URL not found');
      return res.status(500).json({ error: 'Database configuration error' });
    }

    const sql = neon(DATABASE_URL);

    // Update user profile in database
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
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Profile updated successfully:', result[0]);

    return res.status(200).json({
      success: true,
      profile: result[0]
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ 
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
