// One-time setup API to create blocked_users table
// Call this once: https://www.wegram.social/api/setup-blocked-table
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
    // Create blocked_users table
    await sql`
      CREATE TABLE IF NOT EXISTS blocked_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(blocker_id, blocked_id),
        CHECK (blocker_id != blocked_id)
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON blocked_users(blocker_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON blocked_users(blocked_id)`;

    return res.status(200).json({
      success: true,
      message: 'blocked_users table created successfully'
    });
  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
