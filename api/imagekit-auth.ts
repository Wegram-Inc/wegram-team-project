import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      console.error('ImageKit private key not configured');
      return res.status(500).json({ error: 'ImageKit configuration is missing' });
    }

    // Generate a random token
    const token = crypto.randomBytes(16).toString('hex');

    // Set expiration time (10 minutes from now)
    const expire = Math.floor(Date.now() / 1000) + 600;

    // Create signature using HMAC-SHA1
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return res.status(200).json({
      token,
      expire,
      signature
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return res.status(500).json({ error: 'Failed to generate authentication parameters' });
  }
}