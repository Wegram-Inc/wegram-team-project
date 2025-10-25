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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, username, referralCode } = req.body;

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

    // Hash password
    const passwordHash = hashPassword(password);

    // Check total user count to auto-verify first 200 users
    const userCountResult = await sql`SELECT COUNT(*) as count FROM profiles`;
    const userCount = parseInt(userCountResult[0].count);
    const shouldAutoVerify = userCount < 200;

    // Create user
    const result = await sql`
      INSERT INTO profiles (
        username, email, password_hash,
        followers_count, following_count, posts_count,
        bio, verified
      ) VALUES (
        ${username.toLowerCase()},
        ${email.toLowerCase()},
        ${passwordHash},
        ${0},
        ${0},
        ${0},
        ${'Welcome to WEGRAM! 🚀'},
        ${shouldAutoVerify}
      )
      RETURNING id, username, email, avatar_url, bio, verified, followers_count, following_count, posts_count, created_at
    `;

    const user = result[0];

    // Handle referral if referralCode was provided
    if (referralCode) {
      try {
        const referralResponse = await fetch(`${req.headers.origin || 'https://wegram.social'}/api/referrals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer_username: referralCode,
            referred_user_id: user.id
          })
        });

        const referralData = await referralResponse.json();
        console.log('Referral processed:', referralData);
      } catch (referralError) {
        console.error('Failed to process referral:', referralError);
        // Don't fail signup if referral processing fails
      }
    }

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
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: 'Failed to create account',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

