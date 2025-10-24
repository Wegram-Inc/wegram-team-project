# Backend Configuration for OAuth 2.0 Integration

## Environment Variables Needed

Add these environment variables to your backend deployment (wegram.onrender.com):

```bash
# Twitter OAuth 2.0 Credentials
TWITTER_CLIENT_ID=RHA0V29TbXVmNkxLcnQ1ejljUjE6MTpjaQ
TWITTER_CLIENT_SECRET=6N-q3fX_CF5YzoXMDxqdWdeW_dqkLUbA_54QhHyfGzeEV17vmX

# Callback URL (already configured in Twitter Developer Portal)
TWITTER_CALLBACK_URL=https://wegram.onrender.com/api/auth/twitter/callback

# Frontend URL for redirects
FRONTEND_URL=https://your-frontend-domain.com
FRONTEND_LOGIN_ENDPOINT=https://your-frontend-domain.com/twitter/callback

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# MongoDB URI (your existing database)
MONGODB_URI=your-mongodb-connection-string
```

## How to Update Render.com

1. Go to your Render.com dashboard
2. Select your wegram backend service
3. Go to "Environment" tab
4. Add the above environment variables
5. Redeploy the service

## Testing the Integration

After updating the environment variables:

1. **Test the auth endpoint**: Visit `https://wegram.onrender.com/api/auth/twitter`
2. **Should redirect to Twitter**: You'll be taken to Twitter's OAuth page
3. **After authorization**: You'll be redirected back to your frontend

## Frontend Integration

The frontend is now configured to:
- Redirect users to `https://wegram.onrender.com/api/auth/twitter`
- Handle the callback at `/twitter/callback`
- Store the JWT token for API calls

## Next Steps

1. Update your backend environment variables
2. Test the OAuth flow
3. The frontend will automatically work with your backend
