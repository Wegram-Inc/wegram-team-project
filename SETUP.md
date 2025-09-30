# WEGRAM Database Setup Guide

This guide will help you set up Supabase for WEGRAM in just a few minutes.

## 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

## 2. Create New Project

1. Click "New Project"
2. Choose your organization
3. Enter project details:
   - **Name**: `wegram` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

## 3. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

## 4. Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 5. Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" to create all tables and security policies

## 6. Enable Authentication Providers

### Google OAuth (Recommended)
1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

### Email Authentication
1. In **Authentication** → **Providers**
2. **Email** is enabled by default
3. Configure email templates if needed

## 7. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app and try:
   - Sign up with Google or email
   - Create a post
   - Like posts
   - Check that data appears in Supabase dashboard

## 8. Deploy to Vercel

1. Push your code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env` file exists and has correct values
- Restart development server after adding env vars

### Authentication not working
- Verify OAuth redirect URLs in provider settings
- Check that providers are enabled in Supabase

### Database errors
- Ensure migration was run successfully
- Check RLS policies are enabled
- Verify user has proper permissions

## Next Steps

- Customize the database schema as needed
- Add more authentication providers
- Set up email templates
- Configure storage for file uploads
- Add real-time subscriptions

Your WEGRAM app is now fully functional with a real database! 🚀