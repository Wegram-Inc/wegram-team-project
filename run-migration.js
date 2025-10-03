// Run database migration for password authentication
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: '.env.local' });

const DATABASE_URL = process.env.POSTGRES_URL || 
                     process.env.DATABASE_URL || 
                     process.env.POSTGRES_PRISMA_URL;

if (!DATABASE_URL) {
  console.error('❌ No database URL found in environment variables');
  process.exit(1);
}

console.log('✅ Database URL found');
console.log('🔄 Running migration...\n');

const sql = neon(DATABASE_URL);

async function runMigration() {
  try {
    // Add password_hash column
    console.log('Adding password_hash column...');
    await sql`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS password_hash TEXT
    `;
    console.log('✅ password_hash column added');

    // Make email unique
    console.log('Making email unique...');
    try {
      await sql`
        ALTER TABLE profiles 
        ADD CONSTRAINT profiles_email_unique UNIQUE (email)
      `;
      console.log('✅ Email unique constraint added');
    } catch (e) {
      console.log('⚠️  Email constraint may already exist:', e.message);
    }

    // Add index for faster email lookups
    console.log('Adding email index...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email)
    `;
    console.log('✅ Email index added');

    console.log('\n🎉 Migration completed successfully!');
    console.log('Users can now sign up with email/password.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

