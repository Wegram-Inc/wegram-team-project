// Vercel Serverless Function for Twitter OAuth Token Exchange
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TWITTER_API_KEY = process.env.VITE_TWITTER_API_KEY || 'Q3FhWHhNdWtHR19YTGJtNUhSRWY6MTpjaQ';
const TWITTER_API_SECRET = process.env.VITE_TWITTER_API_SECRET || 'yVLRkNMGNMr0alpbKCSPdKDlwMmZeySkR9wnMIojSc6wPjcztI';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, codeVerifier, redirectUri } = req.body;

  if (!code || !codeVerifier || !redirectUri) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Step 1: Exchange code for token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${TWITTER_API_KEY}:${TWITTER_API_SECRET}`).toString('base64')
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: TWITTER_API_KEY,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Twitter token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        errorText,
        requestBody: {
          code: code.substring(0, 20) + '...',
          grant_type: 'authorization_code',
          client_id: TWITTER_API_KEY,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier.substring(0, 20) + '...'
        }
      });
      return res.status(tokenResponse.status).json({ 
        error: 'Token exchange failed',
        details: errorText,
        status: tokenResponse.status,
        hint: 'Check Vercel function logs for details'
      });
    }

    const tokenData = await tokenResponse.json();

    // Get user information
    const userResponse = await fetch(
      'https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,description,verified,public_metrics',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error('Twitter user fetch failed:', errorData);
      return res.status(userResponse.status).json({ 
        error: 'User fetch failed',
        details: errorData 
      });
    }

    const userData = await userResponse.json();

    // Return user data and tokens
    return res.status(200).json({
      success: true,
      user: {
        id: userData.data.id,
        username: userData.data.username,
        name: userData.data.name,
        profile_image_url: userData.data.profile_image_url,
        description: userData.data.description,
        verified: userData.data.verified,
        followers_count: userData.data.public_metrics?.followers_count || 0,
        following_count: userData.data.public_metrics?.following_count || 0,
        tweet_count: userData.data.public_metrics?.tweet_count || 0
      },
      accessToken: tokenData.access_token
    });

  } catch (error) {
    console.error('Twitter OAuth error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

