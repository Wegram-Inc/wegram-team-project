import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    return res.status(500).json({ error: 'ImageKit private key not configured' });
  }

  const token = req.query.token || crypto.randomBytes(16).toString('hex');
  const expire = req.query.expire || (Math.floor(Date.now() / 1000) + 2400).toString();

  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  return res.status(200).json({
    token,
    expire,
    signature,
  });
}
