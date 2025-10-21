// Check if database wallets have any SOL balance
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

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
    // Get all wallets from database
    const wallets = await sql`
      SELECT wallet_public_key, username
      FROM profiles
      WHERE wallet_public_key IS NOT NULL
    `;

    // Check balance for each wallet
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    const balances = await Promise.all(
      wallets.map(async (wallet) => {
        try {
          const publicKey = new PublicKey(wallet.wallet_public_key);
          const balance = await connection.getBalance(publicKey);
          const solBalance = balance / LAMPORTS_PER_SOL;

          return {
            username: wallet.username,
            publicKey: wallet.wallet_public_key,
            balance: solBalance,
            balanceUSD: solBalance * 140 // Rough SOL price estimate
          };
        } catch (error) {
          return {
            username: wallet.username,
            publicKey: wallet.wallet_public_key,
            balance: 0,
            error: 'Failed to fetch balance'
          };
        }
      })
    );

    const totalSOL = balances.reduce((sum, w) => sum + (w.balance || 0), 0);
    const walletsWithFunds = balances.filter(w => w.balance > 0);

    return res.status(200).json({
      success: true,
      totalWallets: wallets.length,
      walletsWithFunds: walletsWithFunds.length,
      totalSOL,
      totalUSD: totalSOL * 140,
      balances
    });

  } catch (error) {
    console.error('Check wallet funds error:', error);
    return res.status(500).json({
      error: 'Failed to check wallet funds',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
