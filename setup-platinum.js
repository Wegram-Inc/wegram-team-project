// Setup Platinum Verification Script for Neon Postgres
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

let DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
console.log('🔍 Database URL found:', DATABASE_URL ? 'Yes' : 'No');

if (!DATABASE_URL) {
  console.error('❌ No database URL found in environment variables');
  console.log('Make sure your .env.local file exists and contains POSTGRES_URL or DATABASE_URL');
  process.exit(1);
}

// If it's a Prisma URL, extract the real PostgreSQL URL
if (DATABASE_URL.startsWith('prisma+postgres://')) {
  try {
    const url = new URL(DATABASE_URL);
    const apiKey = url.searchParams.get('api_key');
    if (apiKey) {
      const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
      DATABASE_URL = decoded.databaseUrl;
      console.log('🔧 Extracted PostgreSQL URL from Prisma format');
    }
  } catch (error) {
    console.error('❌ Failed to extract PostgreSQL URL from Prisma format:', error);
    process.exit(1);
  }
}

const sql = neon(DATABASE_URL);

async function setupPlatinum() {
  console.log('🚀 Setting up platinum verification system...');

  try {
    // Add verification_type column if it doesn't exist
    console.log('📝 Adding verification_type column...');
    await sql`
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS verification_type TEXT DEFAULT 'gold'
    `;
    console.log('✅ verification_type column added');

    // Set the 3 founder accounts to platinum
    console.log('👑 Setting founder accounts to platinum...');
    const result = await sql`
      UPDATE profiles
      SET verification_type = 'platinum'
      WHERE username IN ('puff012', '_fudder', 'TheWegramApp', '@puff012', '@_fudder', '@TheWegramApp')
      RETURNING username, verification_type
    `;

    console.log(`✅ Updated ${result.length} founder accounts to platinum`);
    result.forEach(user => {
      console.log(`   👑 ${user.username} → ${user.verification_type}`);
    });

    console.log(`\n🎉 Platinum verification system setup complete!`);

  } catch (error) {
    console.error('❌ Failed to setup platinum verification:', error);
    process.exit(1);
  }
}

setupPlatinum();