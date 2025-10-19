// Create site_settings table for maintenance mode
import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_2TMrF4Iztcwm@ep-small-pond-adj3uvcc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function createSiteSettings() {
  console.log('🚀 Creating site_settings table...');

  try {
    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        maintenance_mode BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Created site_settings table');

    // Insert default row
    await sql`
      INSERT INTO site_settings (maintenance_mode)
      VALUES (FALSE)
      ON CONFLICT DO NOTHING
    `;
    console.log('✅ Inserted default settings');

    console.log('\n🎉 Site settings table created successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSiteSettings();
