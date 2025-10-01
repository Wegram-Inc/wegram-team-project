# WEGRAM Database Setup Guide

This guide will help you set up a complete database for your WEGRAM project using Supabase. The database includes all necessary tables for a full-featured social media platform with Web3 integration.

## 🚀 Quick Start (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Click "New Project"
5. Enter project details:
   - **Name**: `wegram` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase_migration.sql`
4. Paste into the SQL editor
5. Click "Run" to create all tables and security policies

### 5. Enable Authentication Providers

#### Google OAuth (Recommended)
1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

#### Email Authentication
1. In **Authentication** → **Providers**
2. **Email** is enabled by default
3. Configure email templates if needed

### 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your app and try to:
   - Sign up with Google/email
   - Create a post
   - Like a post
   - Check your profile

## 📊 Database Schema Overview

Your database now includes these tables:

### Core Tables
- **`profiles`** - User profiles with username, bio, avatar, follower counts
- **`posts`** - User posts with engagement metrics
- **`likes`** - Post likes tracking
- **`comments`** - Post comments
- **`follows`** - User following relationships

### Web3 Tables
- **`user_wallets`** - Solana wallets for each user
- **`wallet_balances`** - Token balances (WGM, SOL, USDC, etc.)
- **`wallet_transactions`** - Transaction history
- **`rewards`** - User rewards and achievements
- **`reward_claims`** - Reward claim history

### Key Features
- ✅ **Row Level Security** - Users can only access their own data
- ✅ **Automatic Counters** - Follower counts, post counts update automatically
- ✅ **Real-time Updates** - Live updates for posts, likes, comments
- ✅ **Performance Indexes** - Optimized for common queries
- ✅ **Foreign Key Constraints** - Data integrity maintained

## 🔧 Advanced Configuration

### Customizing Authentication

1. **Email Templates**: Go to **Authentication** → **Email Templates**
2. **Password Requirements**: Go to **Authentication** → **Settings**
3. **Session Management**: Configure session timeouts and refresh tokens

### Database Customization

1. **Storage**: Go to **Storage** to enable file uploads for avatars and post images
2. **Edge Functions**: Create serverless functions for complex operations
3. **Real-time**: Configure real-time subscriptions for live updates

### Security Settings

1. **API Keys**: Rotate keys regularly in **Settings** → **API**
2. **Database Access**: Configure connection pooling and SSL
3. **Backup**: Set up automated backups in **Settings** → **Database**

## 🚨 Important Security Notes

### Production Deployment
- **Never commit your `.env` file** to version control
- **Use environment variables** in production
- **Enable SSL** for all connections
- **Rotate API keys** regularly

### Wallet Security
- **Encrypt private keys** before storing (implement encryption in production)
- **Use secure key derivation** for wallet generation
- **Implement proper backup** for wallet recovery

### Data Protection
- **Enable RLS policies** (already configured)
- **Regular security audits** of your database
- **Monitor for suspicious activity**

## 🐛 Troubleshooting

### Common Issues

1. **"Supabase not connected"**
   - Check your `.env` file has correct credentials
   - Verify your Supabase project is active
   - Check browser console for connection errors

2. **"Permission denied"**
   - Ensure RLS policies are enabled
   - Check user authentication status
   - Verify user has proper permissions

3. **"Table doesn't exist"**
   - Run the migration script again
   - Check if all tables were created successfully
   - Verify you're using the correct database

### Getting Help

1. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
2. **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
3. **Discord**: Join the Supabase Discord community

## 📈 Next Steps

Once your database is set up:

1. **Test all features** - Create posts, like, comment, follow users
2. **Customize the UI** - Modify components to match your brand
3. **Add Web3 features** - Implement wallet connections and token rewards
4. **Deploy to production** - Use Vercel, Netlify, or your preferred platform
5. **Monitor performance** - Use Supabase analytics to track usage

## 🎉 You're Ready!

Your WEGRAM database is now fully configured with:
- ✅ Complete social media functionality
- ✅ Web3 wallet integration
- ✅ Real-time updates
- ✅ Secure authentication
- ✅ Performance optimization

Start building your Web3 social media platform! 🚀
