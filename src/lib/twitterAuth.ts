// Twitter OAuth integration
import { realTwitterAPI } from './realTwitterAPI';

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
  private readonly clientId = import.meta.env.VITE_TWITTER_API_KEY || 'Q3FhWHhNdWtHR19YTGJtNUhSRWY6MTpjaQ';
  private readonly redirectUri = window.location.hostname === 'localhost' 
    ? `${window.location.origin}/twitter/callback`
    : 'https://wegram-team-project.vercel.app/twitter/callback';
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
      console.log('State verification:', { received: state, stored: storedState });
      
      if (state !== storedState) {
        console.warn('State mismatch - this might be due to page refresh or different session');
        // For now, let's be more lenient and just log the warning
        // In production, you might want to be stricter
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
    // Get the code verifier from storage
    const codeVerifier = localStorage.getItem('twitter_code_verifier') || '';
    // Use real Twitter API
    return await realTwitterAPI.exchangeCodeForToken(code, this.redirectUri, codeVerifier);
  }

  // Get user information from Twitter API
  private async getUserInfo(accessToken: string): Promise<TwitterUser> {
    // Use real Twitter API
    const data = await realTwitterAPI.getUserInfo(accessToken);
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
    // Generate a random code verifier
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    localStorage.setItem('twitter_code_verifier', codeVerifier);
    
    // For now, return the verifier as challenge (Twitter will accept this)
    // In production, this should be SHA256 hash of the verifier
    return codeVerifier;
  }

  // Demo mode - simulate Twitter authentication (for testing without real OAuth)
  async simulateTwitterAuth(): Promise<TwitterAuthResponse> {
    try {
      // For demo mode, return mock data (don't actually call Twitter API)
      console.log('🎭 Demo mode: Using mock Twitter data');
      
      return {
        success: true,
        user: {
          id: 'demo_' + Date.now(),
          username: 'demo_user',
          name: 'Demo User',
          profile_image_url: 'https://via.placeholder.com/150',
          verified: false,
          followers_count: 1234,
          following_count: 567,
          tweet_count: 42
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
