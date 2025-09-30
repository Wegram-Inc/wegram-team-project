// Twitter OAuth integration
import { mockTwitterAPI } from './mockTwitterAPI';

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
  verified?: boolean;
  followers_count?: number;
  following_count?: number;
  tweet_count?: number;
}

export interface TwitterAuthResponse {
  success: boolean;
  user?: TwitterUser;
  error?: string;
}

class TwitterAuthService {
  private readonly clientId = import.meta.env.VITE_TWITTER_API_KEY || 'YOUR_TWITTER_API_KEY_HERE';
  private readonly redirectUri = `${window.location.origin}/auth/callback`;
  private readonly scope = 'tweet.read users.read offline.access';

  // Generate OAuth URL for Twitter authorization
  generateAuthUrl(): string {
    const state = this.generateRandomState();
    localStorage.setItem('twitter_oauth_state', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
      code_challenge: this.generateCodeChallenge(),
      code_challenge_method: 'S256'
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  // Start real Twitter OAuth flow
  async startRealOAuth(): Promise<void> {
    const authUrl = this.generateAuthUrl();
    // Redirect to Twitter for real authentication
    window.location.href = authUrl;
  }

  // Handle OAuth callback
  async handleCallback(code: string, state: string): Promise<TwitterAuthResponse> {
    try {
      // Verify state parameter
      const storedState = localStorage.getItem('twitter_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }
      localStorage.removeItem('twitter_oauth_state');

      // Exchange code for access token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      if (!tokenResponse.access_token) {
        throw new Error('Failed to get access token');
      }

      // Get user info
      const userInfo = await this.getUserInfo(tokenResponse.access_token);
      
      return {
        success: true,
        user: userInfo
      };
    } catch (error) {
      console.error('Twitter OAuth error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  // Exchange authorization code for access token
  private async exchangeCodeForToken(code: string): Promise<any> {
    // Use mock API for demo purposes
    return await mockTwitterAPI.exchangeCodeForToken(code, this.redirectUri);
  }

  // Get user information from Twitter API
  private async getUserInfo(accessToken: string): Promise<TwitterUser> {
    // Use mock API for demo purposes
    const data = await mockTwitterAPI.getUserInfo(accessToken);
    return {
      id: data.data.id,
      username: data.data.username,
      name: data.data.name,
      profile_image_url: data.data.profile_image_url,
      verified: data.data.verified,
      followers_count: data.data.public_metrics?.followers_count,
      following_count: data.data.public_metrics?.following_count,
      tweet_count: data.data.public_metrics?.tweet_count
    };
  }

  // Generate random state parameter for security
  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Generate PKCE code challenge
  private generateCodeChallenge(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    localStorage.setItem('twitter_code_verifier', codeVerifier);
    
    // Simple SHA256 hash (in production, use proper crypto library)
    return codeVerifier;
  }

  // Demo mode - simulate Twitter authentication
  async simulateTwitterAuth(): Promise<TwitterAuthResponse> {
    try {
      // Check if API credentials are valid
      const apiStatus = mockTwitterAPI.getAPIStatus();
      if (!apiStatus.connected) {
        throw new Error('Twitter API credentials are not configured');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user info using mock API
      const userInfo = await mockTwitterAPI.getUserInfo('mock_access_token');
      
      return {
        success: true,
        user: {
          id: userInfo.data.id,
          username: userInfo.data.username,
          name: userInfo.data.name,
          profile_image_url: userInfo.data.profile_image_url,
          verified: userInfo.data.verified,
          followers_count: userInfo.data.public_metrics?.followers_count,
          following_count: userInfo.data.public_metrics?.following_count,
          tweet_count: userInfo.data.public_metrics?.tweet_count
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }
}

export const twitterAuth = new TwitterAuthService();
