// Email Verification API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL || 
                         process.env.DATABASE_URL || 
                         process.env.POSTGRES_PRISMA_URL;
    
    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Find user by verification token
    const result = await sql`
      SELECT 
        id, username, email, email_verified, verification_token_expires
      FROM profiles 
      WHERE verification_token = ${token}
    `;

    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    const user = result[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email already verified',
        alreadyVerified: true 
      });
    }

    // Check if token is expired
    const now = new Date();
    const tokenExpires = new Date(user.verification_token_expires);
    
    if (now > tokenExpires) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Verify the email
    await sql`
      UPDATE profiles 
      SET 
        email_verified = true,
        verification_token = null,
        verification_token_expires = null,
        updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        email_verified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
