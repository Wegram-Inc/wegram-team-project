// Add social link columns to profiles table
import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_2TMrF4Iztcwm@ep-small-pond-adj3uvcc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function addSocialColumns() {
  console.log('🚀 Adding social link columns to profiles table...');

  try {
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_link TEXT`;
    console.log('✅ Added twitter_link column');

    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS discord_link TEXT`;
    console.log('✅ Added discord_link column');

    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_link TEXT`;
    console.log('✅ Added telegram_link column');

    console.log('\n🎉 Social link columns added successfully!');
  } catch (error) {
    console.error('❌ Error adding columns:', error);
    process.exit(1);
  }
}

addSocialColumns();
