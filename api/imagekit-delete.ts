import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return res.status(500).json({ error: 'ImageKit keys not configured' });
  }

  const { fileId } = req.body;

  if (!fileId) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${Buffer.from(privateKey + ':').toString('base64')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete file from ImageKit');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting from ImageKit:', error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
}
