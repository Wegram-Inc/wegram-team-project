// Setup script to add blocked_users table to Neon database
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('❌ POSTGRES_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupBlockedUsers() {
  try {
    console.log('🔧 Setting up blocked_users table...');

    // Create blocked_users table
    await sql`
      CREATE TABLE IF NOT EXISTS blocked_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(blocker_id, blocked_id),
        CHECK (blocker_id != blocked_id)
      )
    `;
    console.log('✅ blocked_users table created');

    // Create indexes for performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON blocked_users(blocker_id)
    `;
    console.log('✅ Index created on blocker_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON blocked_users(blocked_id)
    `;
    console.log('✅ Index created on blocked_id');

    console.log('🎉 Blocked users table setup complete!');
  } catch (error) {
    console.error('❌ Error setting up blocked_users table:', error);
    process.exit(1);
  }
}

setupBlockedUsers();
