// Get user's wallet from database
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
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    // Get wallet from database
    const result = await sql`
      SELECT wallet_public_key, wallet_private_key, wallet_mnemonic
      FROM profiles
      WHERE id = ${user_id as string}
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const wallet = result[0];

    if (!wallet.wallet_public_key) {
      return res.status(200).json({
        success: false,
        error: 'No wallet found for user'
      });
    }

    return res.status(200).json({
      success: true,
      wallet: {
        publicKey: wallet.wallet_public_key,
        privateKey: wallet.wallet_private_key,
        mnemonic: wallet.wallet_mnemonic
      }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get wallet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
