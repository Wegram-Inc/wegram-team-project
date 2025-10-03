// Email/Password Login API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { pbkdf2Sync } from 'crypto';

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':');
    const computedHash = pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
    return hash === computedHash;
  } catch (error) {
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL || 
                         process.env.DATABASE_URL || 
                         process.env.POSTGRES_PRISMA_URL;
    
    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Find user by email
    const result = await sql`
      SELECT 
        id, username, email, password_hash, avatar_url, bio, 
        verified, followers_count, following_count, posts_count,
        twitter_id, twitter_username, created_at, updated_at
      FROM profiles 
      WHERE email = ${email.toLowerCase()}
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result[0];

    // Verify password
    if (!user.password_hash || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user data (excluding password_hash)
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
        verified: user.verified,
        followers_count: user.followers_count,
        following_count: user.following_count,
        posts_count: user.posts_count,
        twitter_id: user.twitter_id,
        twitter_username: user.twitter_username,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Failed to login',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

