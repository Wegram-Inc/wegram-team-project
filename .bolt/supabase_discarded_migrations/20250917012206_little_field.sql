/*
  # Wallet System Schema

  This migration adds wallet functionality to WEGRAM.
  Run this when you're ready to enable real wallet features.

  ## What this adds:
  1. User wallets with Solana keypairs
  2. Token balances (WGR, SOL, USDC, etc.)
  3. Transaction history
  4. Reward tracking

  ## Tables Created:
  - `user_wallets` - Stores wallet keypairs for each user
  - `wallet_balances` - Tracks token balances per user
  - `wallet_transactions` - Transaction history
  - `reward_claims` - Reward claim history

  ## Security:
  - Row Level Security enabled on all tables
  - Users can only access their own wallet data
  - Private keys are encrypted (implement encryption in production)
*/

-- User Wallets Table
CREATE TABLE IF NOT EXISTS user_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  public_key text NOT NULL,
  private_key_encrypted text NOT NULL, -- Encrypt this in production!
  mnemonic_encrypted text, -- Encrypt this in production!
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Wallet Balances Table
CREATE TABLE IF NOT EXISTS wallet_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  token_symbol text NOT NULL,
  token_name text NOT NULL,
  balance decimal(20,8) DEFAULT 0,
  usd_value decimal(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, token_symbol)
);

-- Wallet Transactions Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('deposit', 'withdraw', 'reward', 'gift_sent', 'gift_received')),
  token_symbol text NOT NULL,
  amount decimal(20,8) NOT NULL,
  usd_value decimal(12,2),
  description text,
  transaction_hash text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Reward Claims Table
CREATE TABLE IF NOT EXISTS reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reward_type text NOT NULL,
  amount decimal(20,8) NOT NULL,
  token_symbol text NOT NULL DEFAULT 'WGR',
  claimed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_wallets
CREATE POLICY "Users can read own wallet"
  ON user_wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
  ON user_wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON user_wallets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for wallet_balances
CREATE POLICY "Users can read own balances"
  ON wallet_balances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own balances"
  ON wallet_balances
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own balances"
  ON wallet_balances
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can read own transactions"
  ON wallet_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON wallet_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for reward_claims
CREATE POLICY "Users can read own reward claims"
  ON reward_claims
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reward claims"
  ON reward_claims
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_balances_updated_at
  BEFORE UPDATE ON wallet_balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();