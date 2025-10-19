// Maintenance Mode API
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
    if (req.method === 'GET') {
      // Get current maintenance mode status
      const settings = await sql`SELECT maintenance_mode FROM site_settings LIMIT 1`;

      if (settings.length === 0) {
        return res.status(200).json({ maintenance_mode: false });
      }

      return res.status(200).json({
        maintenance_mode: settings[0].maintenance_mode
      });
    }

    if (req.method === 'POST') {
      // Toggle maintenance mode with password
      const { password } = req.body;

      if (password !== 'mode10') {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Get current status
      const current = await sql`SELECT maintenance_mode FROM site_settings LIMIT 1`;
      const currentMode = current[0]?.maintenance_mode || false;

      // Toggle it
      await sql`
        UPDATE site_settings
        SET maintenance_mode = ${!currentMode}, updated_at = NOW()
        WHERE id = 1
      `;

      return res.status(200).json({
        success: true,
        maintenance_mode: !currentMode
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Maintenance API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
