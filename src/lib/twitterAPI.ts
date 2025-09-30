// Real Twitter API integration (requires backend endpoints)
// This file shows how to implement real Twitter OAuth with your credentials

export interface TwitterTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface TwitterUserResponse {
  data: {
    id: string;
    username: string;
    name: string;
    profile_image_url?: string;
    verified?: boolean;
    public_metrics?: {
      followers_count: number;
      following_count: number;
      tweet_count: number;
    };
  };
}

class RealTwitterAPI {
  private readonly apiKey = 'YOUR_TWITTER_API_KEY_HERE';
  private readonly apiSecret = 'YOUR_TWITTER_API_SECRET_HERE';
  private readonly bearerToken = 'YOUR_TWITTER_BEARER_TOKEN_HERE';

  // Exchange authorization code for access token (REQUIRES BACKEND)
  async exchangeCodeForToken(code: string, redirectUri: string, codeVerifier: string): Promise<TwitterTokenResponse> {
    // This should be called from your backend, not frontend
    // Frontend cannot securely handle API secret
    
    const response = await fetch('/api/twitter/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get user information from Twitter API (REQUIRES BACKEND)
  async getUserInfo(accessToken: string): Promise<TwitterUserResponse> {
    const response = await fetch('/api/twitter/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`User info request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Post a tweet (REQUIRES BACKEND)
  async postTweet(accessToken: string, text: string): Promise<any> {
    const response = await fetch('/api/twitter/tweet', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      throw new Error(`Tweet posting failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get user timeline (REQUIRES BACKEND)
  async getUserTimeline(accessToken: string, userId: string): Promise<any> {
    const response = await fetch(`/api/twitter/timeline/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Timeline request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Validate API credentials
  validateCredentials(): boolean {
    return !!(this.apiKey && this.apiSecret && this.bearerToken);
  }

  // Get API status
  getAPIStatus(): { connected: boolean; message: string } {
    const isValid = this.validateCredentials();
    return {
      connected: isValid,
      message: isValid 
        ? 'Twitter API credentials are configured' 
        : 'Twitter API credentials are missing or invalid'
    };
  }
}

export const realTwitterAPI = new RealTwitterAPI();

// Backend endpoint examples (Node.js/Express)
export const backendExamples = {
  // Example: /api/twitter/token endpoint
  tokenEndpoint: `
app.post('/api/twitter/token', async (req, res) => {
  const { code, redirect_uri, code_verifier } = req.body;
  
  try {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': \`Basic \${Buffer.from('\${API_KEY}:\${API_SECRET}').toString('base64')}\`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri,
        code_verifier
      })
    });
    
    const tokenData = await response.json();
    res.json(tokenData);
  } catch (error) {
    res.status(500).json({ error: 'Token exchange failed' });
  }
});`,

  // Example: /api/twitter/user endpoint
  userEndpoint: `
app.get('/api/twitter/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.replace('Bearer ', '');
  
  try {
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,verified,public_metrics', {
      headers: {
        'Authorization': \`Bearer \${accessToken}\`,
        'Content-Type': 'application/json',
      }
    });
    
    const userData = await response.json();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'User info request failed' });
  }
});`
};
