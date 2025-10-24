// Vercel Serverless Function for Twitter OAuth Token Exchange
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TWITTER_API_KEY = process.env.VITE_TWITTER_API_KEY || 'RHA0V29TbXVmNkxLcnQ1ejljUjE6MTpjaQ';
const TWITTER_API_SECRET = process.env.VITE_TWITTER_API_SECRET || '6N-q3fX_CF5YzoXMDxqdWdeW_dqkLUbA_54QhHyfGzeEV17vmX';

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

    // Get user information including follower count
    const userResponse = await fetch(
      'https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,public_metrics,description,verified',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error('Twitter user fetch failed:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        errorData,
        headers: Object.fromEntries(userResponse.headers.entries())
      });
      
      // Return detailed error to see what's actually happening
      return res.status(userResponse.status).json({ 
        error: 'User fetch failed',
        status: userResponse.status,
        statusText: userResponse.statusText,
        details: errorData,
        hint: 'Check if Twitter API has proper permissions'
      });
    }

    const userData = await userResponse.json();

    // Convert Twitter profile image to higher resolution
    // Twitter returns _normal (48x48) by default, we want _400x400 for better quality
    let highResProfileImage = userData.data.profile_image_url;
    if (highResProfileImage && highResProfileImage.includes('_normal')) {
      highResProfileImage = highResProfileImage.replace('_normal', '_400x400');
    }

    // Return user data including follower metrics
    return res.status(200).json({
      success: true,
      user: {
        id: userData.data.id,
        username: userData.data.username,
        name: userData.data.name,
        profile_image_url: highResProfileImage,
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

