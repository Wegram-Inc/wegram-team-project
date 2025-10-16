// Member Count API - Get total number of users
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
    // Get total count of users
    const result = await sql`
      SELECT COUNT(*) as total_members FROM profiles
    `;

    const memberCount = parseInt(result[0].total_members);

    return res.status(200).json({
      success: true,
      member_count: memberCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Member count API error:', error);
    return res.status(500).json({
      error: 'Failed to get member count',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}