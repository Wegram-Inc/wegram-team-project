// Database Setup Script for Neon Postgres
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
console.log('🔍 Database URL found:', DATABASE_URL ? 'Yes' : 'No');

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  console.log('Make sure your .env.local file exists and contains DATABASE_URL');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupDatabase() {
  console.log('🚀 Setting up WEGRAM database tables...');
  
  try {
    // Create profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        avatar_url TEXT,
        bio TEXT,
        verified BOOLEAN DEFAULT false,
        followers_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        posts_count INTEGER DEFAULT 0,
        twitter_id TEXT UNIQUE,
        twitter_username TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Profiles table created');

    // Create posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        image_url TEXT,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        shares_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Posts table created');

    // Create likes table
    await sql`
      CREATE TABLE IF NOT EXISTS likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, post_id)
      )
    `;
    console.log('✅ Likes table created');

    // Create comments table
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Comments table created');

    // Create follows table
    await sql`
      CREATE TABLE IF NOT EXISTS follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(follower_id, following_id),
        CHECK (follower_id != following_id)
      )
    `;
    console.log('✅ Follows table created');

    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_twitter_id ON profiles(twitter_id)`;
    console.log('✅ Performance indexes created');

    // Create update timestamp function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;
    console.log('✅ Update timestamp function created');

    // Create triggers (one at a time)
    try {
      await sql`DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles`;
      await sql`CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`;
      
      await sql`DROP TRIGGER IF EXISTS update_posts_updated_at ON posts`;
      await sql`CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`;
      
      await sql`DROP TRIGGER IF EXISTS update_comments_updated_at ON comments`;
      await sql`CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`;
      
      console.log('✅ Update triggers created');
    } catch (triggerError) {
      console.log('⚠️  Triggers skipped (not critical):', triggerError.message);
    }

    // Test the connection by counting tables
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`\n🎉 Database setup complete!`);
    console.log(`📊 Created ${result.length} tables:`, result.map(r => r.table_name).join(', '));
    console.log(`\n✅ Your WEGRAM database is ready for X login!`);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
