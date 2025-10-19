// Jupiter Token List Proxy API
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch token list from Jupiter
    const response = await fetch('https://token.jup.ag/strict');

    if (!response.ok) {
      throw new Error(`Jupiter API returned ${response.status}`);
    }

    const tokens = await response.json();

    // Return tokens with CORS headers
    return res.status(200).json({
      success: true,
      tokens,
      count: tokens.length
    });

  } catch (error) {
    console.error('Jupiter tokens API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch token list',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
