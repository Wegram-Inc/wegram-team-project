// Jupiter Token List Proxy API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch token list from Jupiter using https module
    const data = await new Promise<string>((resolve, reject) => {
      https.get('https://token.jup.ag/strict', (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          resolve(data);
        });

        response.on('error', (error) => {
          reject(error);
        });
      }).on('error', (error) => {
        reject(error);
      });
    });

    const tokens = JSON.parse(data);

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
