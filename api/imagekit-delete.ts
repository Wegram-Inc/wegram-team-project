import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileId } = req.body;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({ error: 'ImageKit configuration is missing' });
    }

    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    // Create base64 encoded authentication
    const auth = Buffer.from(`${privateKey}:`).toString('base64');

    // Delete the image from ImageKit
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ImageKit API error: ${errorData.message || response.statusText}`);
    }

    return res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return res.status(500).json({
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}