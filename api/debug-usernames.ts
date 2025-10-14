// Debug API to see exactly what usernames are in the database
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
    // Get all usernames to see the actual data
    const allUsers = await sql`
      SELECT id, username, created_at
      FROM profiles
      ORDER BY created_at DESC
      LIMIT 20
    `;

    // Specifically look for users with @ symbols
    const usersWithAt = await sql`
      SELECT id, username, created_at
      FROM profiles
      WHERE username LIKE '%@%'
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      success: true,
      total_users: allUsers.length,
      recent_users: allUsers,
      users_with_at: usersWithAt,
      users_with_double_at: usersWithAt.filter(u => u.username.includes('@@'))
    });

  } catch (error) {
    console.error('Debug usernames error:', error);
    return res.status(500).json({
      error: 'Failed to debug usernames',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}