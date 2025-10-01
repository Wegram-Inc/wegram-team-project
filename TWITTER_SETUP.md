# Twitter OAuth 2.0 Setup Guide

## Problem
Getting "Something went wrong - You weren't able to give access to the App" error when trying to authorize.

## Solution
You need to configure the callback URLs in your Twitter Developer Portal.

## Steps to Fix

### 1. Go to Twitter Developer Portal
- Visit: https://developer.twitter.com/en/portal/dashboard
- Log in with your Twitter account

### 2. Find Your App
- Click on your app (the one with Client ID: `Q3FhWHhNdWtHR19YTGJtNUhSRWY6MTpjaQ`)

### 3. Configure OAuth 2.0 Settings
- Click on "Settings" or "App Settings"
- Scroll to "User authentication settings"
- Click "Set up" or "Edit"

### 4. Add Callback URLs
Add these URLs to your OAuth 2.0 callback URLs:

**For Local Development:**
```
http://localhost:5001/twitter/callback
```

**For Vercel Production:**
```
https://wegram-sept31.vercel.app/twitter/callback
```

### 5. Set App Permissions
Make sure these are enabled:
- ✅ Read (to get user profile, followers, tweets)
- ❌ Write (NOT needed - we're not posting to Twitter)
- ❌ Direct Messages (NOT needed)

### 6. Set OAuth 2.0 Client Type
- Select: **Public client** (for web apps)
- Enable: **OAuth 2.0 with PKCE**

### 7. Website URL
Add your website URL:
```
http://localhost:5001
```
or
```
https://wegram-sept31.vercel.app
```

### 8. Save Changes
- Click "Save" at the bottom
- Wait a few seconds for changes to propagate

## What We're Pulling from Twitter
- ✅ Username
- ✅ Display name
- ✅ Profile picture
- ✅ Bio
- ✅ Follower count
- ✅ Following count
- ✅ Tweet count
- ✅ Verified status

## What We're NOT Doing
- ❌ Posting tweets to Twitter
- ❌ Updating Twitter profile
- ❌ Sending DMs on Twitter
- ❌ Following/unfollowing on Twitter
- ❌ Any write operations to Twitter

This is **ONE-WAY READ-ONLY** - we only pull your data when you sign in!

## After Setup
1. Try the "Authorize app" button again
2. You should see Twitter's authorization screen
3. Click "Authorize app" on Twitter
4. You'll be redirected back with your real data
5. Your profile will show YOUR real Twitter info!

## Still Having Issues?
Check these:
- Is your Twitter API app in "Production" mode (not Development)?
- Did you regenerate keys after making changes?
- Are the callback URLs EXACTLY matching (no trailing slashes)?
- Is OAuth 2.0 enabled (not OAuth 1.0a)?

