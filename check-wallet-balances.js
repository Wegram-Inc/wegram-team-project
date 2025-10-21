// Check if anyone has significant funds in their wallets
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Database URL not found');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function checkWalletBalances() {
  console.log('🔍 Checking wallet data in database...\n');

  try {
    // First check if wallet columns exist
    const columns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'profiles'
      AND column_name LIKE 'wallet%'
    `;

    console.log('Wallet columns in database:', columns.map(c => c.column_name));

    if (columns.length === 0) {
      console.log('\n✅ No wallet columns exist yet - safe to add them fresh');
      return;
    }

    // Check how many users have wallets stored
    const wallets = await sql`
      SELECT wallet_public_key, username
      FROM profiles
      WHERE wallet_public_key IS NOT NULL
    `;

    console.log(`\n📊 Found ${wallets.length} users with wallets in database`);

    if (wallets.length > 0) {
      console.log('\nWallet addresses:');
      wallets.forEach(w => {
        console.log(`- ${w.username}: ${w.wallet_public_key}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWalletBalances();
