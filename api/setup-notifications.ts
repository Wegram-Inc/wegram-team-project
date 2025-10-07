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
    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        from_user_id VARCHAR(255),
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        post_id VARCHAR(255),
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)`;

    // Test insert to verify table works
    const testResult = await sql`
      INSERT INTO notifications (user_id, from_user_id, type, message, read)
      VALUES ('test_user', 'test_from', 'test', 'Table creation test', true)
      RETURNING id
    `;

    // Clean up test record
    await sql`DELETE FROM notifications WHERE id = ${testResult[0].id}`;

    return res.status(200).json({
      success: true,
      message: 'Notifications table created successfully'
    });

  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({
      error: 'Failed to setup notifications table',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}