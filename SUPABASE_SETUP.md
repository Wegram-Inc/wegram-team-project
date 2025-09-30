# SUPABASE SETUP FOR TESTING

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login
3. Click "New Project"
4. Name: `wegram-test` (or whatever you want)
5. Generate strong password
6. Wait 2-3 minutes for setup

### 2. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public key** (long string starting with `eyJ`)

### 3. Add to Environment
1. Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Database Migration
1. In Supabase dashboard → **SQL Editor**
2. Click "New query"
3. Copy contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"

### 5. Enable Google Auth (Optional)
1. **Authentication** → **Providers** → **Google**
2. Enable and add OAuth credentials
3. Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 6. Test the App
```bash
npm run dev
```

## ✅ What Should Work:
- Sign up with Google/email
- Create posts
- Like posts
- Send gifts
- Real-time updates
- User profiles

## 🔄 For Client Handoff:
- Don't commit your `.env` file
- Client creates their own Supabase project
- Client follows same steps with their credentials
- They own their data completely

---

**Need help?** Check the main `SETUP.md` for detailed instructions.