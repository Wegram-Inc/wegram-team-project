// Add platinum verification type to profiles table
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
    // Add verification_type column to profiles table
    await sql`
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS verification_type TEXT DEFAULT 'gold'
    `;

    // Set the 3 founder accounts to platinum
    const result = await sql`
      UPDATE profiles
      SET verification_type = 'platinum'
      WHERE username IN ('puff012', '_fudder', 'TheWegramApp', '@puff012', '@_fudder', '@TheWegramApp')
      RETURNING username, verification_type
    `;

    return res.status(200).json({
      success: true,
      message: 'Platinum verification system added successfully',
      updatedUsers: result
    });

  } catch (error) {
    console.error('Add platinum verification error:', error);
    return res.status(500).json({
      error: 'Failed to add platinum verification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}