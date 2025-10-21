// Check wallet data in database
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
    // Check if wallet columns exist
    const columns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'profiles'
      AND column_name LIKE 'wallet%'
    `;

    // Check how many users have wallets
    let walletCount = 0;
    let wallets = [];

    if (columns.length > 0) {
      const result = await sql`
        SELECT wallet_public_key, username
        FROM profiles
        WHERE wallet_public_key IS NOT NULL
        LIMIT 10
      `;
      walletCount = result.length;
      wallets = result;
    }

    return res.status(200).json({
      success: true,
      columns: columns.map(c => c.column_name),
      walletCount,
      wallets
    });

  } catch (error) {
    console.error('Check wallets error:', error);
    return res.status(500).json({
      error: 'Failed to check wallets',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
