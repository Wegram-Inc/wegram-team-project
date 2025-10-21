// Save user's wallet to database
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    const { user_id, publicKey, privateKey, mnemonic } = req.body;

    if (!user_id || !publicKey || !privateKey) {
      return res.status(400).json({ error: 'user_id, publicKey, and privateKey required' });
    }

    // Save wallet to database
    await sql`
      UPDATE profiles
      SET
        wallet_public_key = ${publicKey},
        wallet_private_key = ${privateKey},
        wallet_mnemonic = ${mnemonic || null}
      WHERE id = ${user_id}
    `;

    return res.status(200).json({
      success: true,
      message: 'Wallet saved successfully'
    });

  } catch (error) {
    console.error('Save wallet error:', error);
    return res.status(500).json({
      error: 'Failed to save wallet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
