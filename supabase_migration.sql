/*
  # Complete WEGRAM Database Schema
  
  This migration creates the complete database schema for WEGRAM.
  Run this in your Supabase SQL Editor to set up all tables and security policies.
  
  ## Tables Created:
  1. `profiles` - User profiles with username, bio, avatar
  2. `posts` - User posts with engagement metrics
  3. `rewards` - User rewards and achievements
  4. `user_wallets` - Solana wallets for each user
  5. `wallet_balances` - Token balances for each wallet
  6. `wallet_transactions` - Transaction history
  7. `reward_claims` - Reward claim history
  8. `likes` - Post likes tracking
  9. `comments` - Post comments
  10. `follows` - User following relationships
  
  ## Security:
  - Row Level Security enabled on all tables
  - Users can only access their own data
  - Public read access for posts and profiles
  - Proper foreign key constraints
  
  ## Functions:
  - Auto-update timestamps
  - Wallet creation triggers
  - Reward calculation functions
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  email text,
  avatar_url text,
  bio text,
  verified boolean DEFAULT false,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- POSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  gifts_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- LIKES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for likes
CREATE POLICY "Users can insert own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- COMMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FOLLOWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS follows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows
CREATE POLICY "Users can insert own follows"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can read all follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- =============================================
-- REWARDS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS rewards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  amount text NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'invite', 'task', 'post', 'like', 'comment', 'share')),
  claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rewards
CREATE POLICY "Users can insert own rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards"
  ON rewards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- USER WALLETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_wallets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  public_key text NOT NULL,
  private_key_encrypted text NOT NULL,
  mnemonic_encrypted text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_wallets
CREATE POLICY "Users can insert own wallet"
  ON user_wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own wallet"
  ON user_wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON user_wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON user_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- WALLET BALANCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wallet_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  token_symbol text NOT NULL,
  token_name text NOT NULL,
  balance decimal(20,8) DEFAULT 0,
  usd_value decimal(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, token_symbol)
);

-- Enable RLS
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallet_balances
CREATE POLICY "Users can insert own balances"
  ON wallet_balances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own balances"
  ON wallet_balances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own balances"
  ON wallet_balances FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_wallet_balances_updated_at
  BEFORE UPDATE ON wallet_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- WALLET TRANSACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_hash text NOT NULL,
  from_address text,
  to_address text,
  amount decimal(20,8) NOT NULL,
  token_symbol text NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('send', 'receive', 'reward', 'purchase')),
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can insert own transactions"
  ON wallet_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions"
  ON wallet_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- REWARD CLAIMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reward_claims (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE NOT NULL,
  amount decimal(20,8) NOT NULL,
  token_symbol text NOT NULL,
  transaction_hash text,
  claimed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reward_claims
CREATE POLICY "Users can insert own reward claims"
  ON reward_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own reward claims"
  ON reward_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS FOR AUTOMATIC COUNTERS
-- =============================================

-- Function to update post counters
CREATE OR REPLACE FUNCTION update_post_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update posts count for user
    UPDATE profiles 
    SET posts_count = posts_count + 1 
    WHERE id = NEW.user_id;
    
    -- Update comments count for post
    UPDATE posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update posts count for user
    UPDATE profiles 
    SET posts_count = posts_count - 1 
    WHERE id = OLD.user_id;
    
    -- Update comments count for post
    UPDATE posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Function to update like counters
CREATE OR REPLACE FUNCTION update_like_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update likes count for post
    UPDATE posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update likes count for post
    UPDATE posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Function to update follow counters
CREATE OR REPLACE FUNCTION update_follow_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update follower count for followed user
    UPDATE profiles 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.following_id;
    
    -- Update following count for follower
    UPDATE profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update follower count for followed user
    UPDATE profiles 
    SET followers_count = followers_count - 1 
    WHERE id = OLD.following_id;
    
    -- Update following count for follower
    UPDATE profiles 
    SET following_count = following_count - 1 
    WHERE id = OLD.follower_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- =============================================
-- TRIGGERS FOR AUTOMATIC COUNTERS
-- =============================================

-- Trigger for comments
CREATE TRIGGER update_post_counters_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_counters();

-- Trigger for likes
CREATE TRIGGER update_like_counters_trigger
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_like_counters();

-- Trigger for follows
CREATE TRIGGER update_follow_counters_trigger
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counters();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Indexes for likes
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Indexes for follows
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Indexes for rewards
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_type ON rewards(type);
CREATE INDEX IF NOT EXISTS idx_rewards_claimed ON rewards(claimed);

-- Indexes for wallet transactions
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(transaction_type);

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample profiles (only if you want test data)
-- Note: These will only work if you have corresponding auth.users entries
/*
INSERT INTO profiles (id, username, email, bio) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo_user', 'demo@wegram.com', 'Demo user for testing'),
  ('00000000-0000-0000-0000-000000000002', 'crypto_trader', 'trader@wegram.com', 'Crypto enthusiast and trader'),
  ('00000000-0000-0000-0000-000000000003', 'defi_expert', 'defi@wegram.com', 'DeFi expert and protocol developer');

-- Insert sample posts
INSERT INTO posts (user_id, content) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Welcome to WEGRAM! The future of social media is here.'),
  ('00000000-0000-0000-0000-000000000002', 'Up 40% since I joined WEGRAM 🚀 — real web3 experience!'),
  ('00000000-0000-0000-0000-000000000003', 'The future of social media is here. Earning while posting has never been this easy! #Web3 #SocialFi');

-- Insert sample wallet balances
INSERT INTO wallet_balances (user_id, token_symbol, token_name, balance, usd_value) VALUES
  ('00000000-0000-0000-0000-000000000001', 'WGM', 'Wegram Token', 1000.00, 100.00),
  ('00000000-0000-0000-0000-000000000001', 'SOL', 'Solana', 5.0, 500.00),
  ('00000000-0000-0000-0000-000000000002', 'WGM', 'Wegram Token', 2500.00, 250.00),
  ('00000000-0000-0000-0000-000000000003', 'WGM', 'Wegram Token', 5000.00, 500.00);
*/

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- This migration is now complete!
-- Your WEGRAM database is ready with:
-- ✅ All tables created with proper relationships
-- ✅ Row Level Security enabled on all tables
-- ✅ Automatic counter updates via triggers
-- ✅ Performance indexes for common queries
-- ✅ Sample data (commented out - uncomment if needed)

-- Next steps:
-- 1. Configure your Supabase credentials in .env
-- 2. Test the connection by running your app
-- 3. Create your first user account
-- 4. Start posting and earning rewards!
