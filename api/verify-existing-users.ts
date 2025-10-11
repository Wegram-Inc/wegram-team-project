// One-time API to verify all existing users (first 200)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL ||
                         process.env.DATABASE_URL ||
                         process.env.POSTGRES_PRISMA_URL;

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Update all existing users to be verified (they're part of the first 200)
    const result = await sql`
      UPDATE profiles
      SET verified = true, updated_at = NOW()
      WHERE verified = false
    `;

    // Get count of updated users
    const updatedCount = result.count || 0;

    return res.status(200).json({
      success: true,
      message: `${updatedCount} existing users have been verified as part of the first 200`,
      updatedCount
    });
  } catch (error) {
    console.error('Error verifying existing users:', error);
    return res.status(500).json({
      error: 'Failed to verify existing users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}