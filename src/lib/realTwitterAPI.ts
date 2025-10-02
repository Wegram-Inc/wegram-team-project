// Real Twitter OAuth API Integration via Backend
const TWITTER_API_KEY = import.meta.env.VITE_TWITTER_API_KEY || 'Q3FhWHhNdWtHR19YTGJtNUhSRWY6MTpjaQ';

export const realTwitterAPI = {
  // Exchange authorization code for access token via backend
  async exchangeCodeForToken(code: string, redirectUri: string, codeVerifier: string) {
    try {
      // Call our Vercel serverless function instead of Twitter API directly
      const response = await fetch('/api/twitter-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          codeVerifier,
          redirectUri
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend token exchange failed:', errorData);
        throw new Error(errorData.error || `Token exchange failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Token exchange failed');
      }

      // Return in expected format
      return {
        access_token: data.accessToken,
        user: data.user
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },

  // Get user information (already fetched by backend, but keeping for compatibility)
  async getUserInfo(accessToken: string) {
    // This is now handled by the backend, but we keep this for compatibility
    return null;
  },

  // Check API status
  getAPIStatus() {
    const hasCredentials = !!TWITTER_API_KEY;
    return {
      connected: hasCredentials,
      message: hasCredentials ? 'Twitter API ready' : 'Twitter API credentials not configured'
    };
  }
};
