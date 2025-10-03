// Email/Password Signup API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Simple server-side password hashing using Node's crypto
import { createHash, randomBytes, pbkdf2Sync } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

function getVerificationUrl(token: string): string {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:5007';
  return `${baseUrl}/verify-email?token=${token}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    // Get database connection
    const DATABASE_URL = process.env.POSTGRES_URL || 
                         process.env.DATABASE_URL || 
                         process.env.POSTGRES_PRISMA_URL;
    
    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const sql = neon(DATABASE_URL);

    // Check if email already exists
    const existingEmail = await sql`
      SELECT id FROM profiles WHERE email = ${email.toLowerCase()}
    `;

    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if username already exists
    const existingUsername = await sql`
      SELECT id FROM profiles WHERE username = ${username.toLowerCase()}
    `;

    if (existingUsername.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create user (without email verification for now)
    const result = await sql`
      INSERT INTO profiles (
        username, email, password_hash,
        followers_count, following_count, posts_count,
        bio, verified, email_verified
      ) VALUES (
        ${username.toLowerCase()},
        ${email.toLowerCase()},
        ${passwordHash},
        ${0},
        ${0},
        ${0},
        ${'Welcome to WEGRAM! 🚀'},
        ${false},
        ${true}
      )
      RETURNING id, username, email, avatar_url, bio, verified, followers_count, following_count, posts_count, created_at, email_verified
    `;

    const user = result[0];

    return res.status(201).json({
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
        created_at: user.created_at,
        email_verified: user.email_verified
      },
      message: 'Account created successfully!'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: 'Failed to create account',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

