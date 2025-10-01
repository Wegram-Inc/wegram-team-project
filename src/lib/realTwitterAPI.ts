// Real Twitter OAuth API Integration
const TWITTER_API_KEY = import.meta.env.VITE_TWITTER_API_KEY || 'Q3FhWHhNdWtHR19YTGJtNUhSRWY6MTpjaQ';
const TWITTER_API_SECRET = import.meta.env.VITE_TWITTER_API_SECRET || 'yVLRkNMGNMr0alpbKCSPdKDlwMmZeySkR9wnMIojSc6wPjcztI';

export const realTwitterAPI = {
  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, redirectUri: string, codeVerifier: string) {
    try {
      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${TWITTER_API_KEY}:${TWITTER_API_SECRET}`)
        },
        body: new URLSearchParams({
          code: code,
          grant_type: 'authorization_code',
          client_id: TWITTER_API_KEY,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier
        })
      });

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },

  // Get user information from Twitter API
  async getUserInfo(accessToken: string) {
    try {
      const response = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,verified,public_metrics', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  },

  // Check API status
  getAPIStatus() {
    const hasCredentials = !!TWITTER_API_KEY && !!TWITTER_API_SECRET;
    return {
      connected: hasCredentials,
      message: hasCredentials ? 'Twitter API ready' : 'Twitter API credentials not configured'
    };
  }
};
