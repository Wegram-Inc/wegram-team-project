// Database migration script to create bookmarks table
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_2TMrF4Iztcwm@ep-small-pond-adj3uvcc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function runMigration() {
  const sql = neon(DATABASE_URL);

  try {
    console.log('🚀 Starting bookmarks table migration...');

    // Create bookmarks table
    await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, post_id)
      )
    `;

    console.log('✅ Bookmarks table created successfully');

    // Add performance indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON bookmarks(post_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC)`;

    console.log('✅ Indexes created successfully');

    // Verify table exists
    const result = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'bookmarks'
    `;

    if (result.length > 0) {
      console.log('✅ Migration completed successfully! Bookmarks table is ready.');
    } else {
      console.log('❌ Migration failed - table not found');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();