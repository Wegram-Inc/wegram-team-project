// Search for founder usernames in database
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    // Search for users with usernames containing founder names
    const founders = await sql`
      SELECT username, verified, id
      FROM profiles
      WHERE username ILIKE '%puff012%'
         OR username ILIKE '%_fudder%'
         OR username ILIKE '%TheWegramApp%'
         OR username ILIKE '%wegram%'
      ORDER BY username
    `;

    return res.status(200).json({
      success: true,
      founders: founders,
      total: founders.length
    });

  } catch (error) {
    console.error('Search founders error:', error);
    return res.status(500).json({
      error: 'Failed to search founders',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}