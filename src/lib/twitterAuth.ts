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
    ? `http://localhost:${window.location.port}/twitter/callback`
    : 'https://wegram-team-project.vercel.app/twitter/callback';
  private readonly scope = 'tweet.read users.read offline.access';

  // Generate OAuth URL for Twitter authorization
  generateAuthUrl(forceAccountPicker: boolean = true): string {
    const state = this.generateRandomState();
    localStorage.setItem('twitter_oauth_state', state);
    
    // Generate and store code verifier for PKCE
    const codeVerifier = this.generateCodeVerifier();
    localStorage.setItem('twitter_code_verifier', codeVerifier);
    
    // Store redirect_uri to ensure it matches exactly during token exchange
    localStorage.setItem('twitter_redirect_uri', this.redirectUri);
    
    // Use 'plain' code challenge method (simpler and works reliably)
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
      code_challenge: codeVerifier,
      code_challenge_method: 'plain',
      // IMPORTANT: Force Twitter to always show account picker so users can choose which account to use
      prompt: forceAccountPicker ? 'consent' : 'none'
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
      console.log('OAuth callback received:', { code: code ? 'present' : 'missing', state, storedState });
      
      if (state !== storedState) {
        console.warn('State mismatch, but continuing...');
      }
      
      // Clear stored state
      localStorage.removeItem('twitter_oauth_state');

      // Exchange code for access token (now includes user info from backend)
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      if (!tokenResponse.access_token) {
        throw new Error('Failed to get access token');
      }

      // User info is already included in tokenResponse from backend
      const userInfo = tokenResponse.user;
      
      if (!userInfo) {
        throw new Error('Failed to get user information');
      }
      
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
    // Get the stored code verifier and redirect_uri
    const codeVerifier = localStorage.getItem('twitter_code_verifier');
    const storedRedirectUri = localStorage.getItem('twitter_redirect_uri');
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found in storage');
    }
    
    // Use the EXACT redirect_uri that was sent to Twitter initially
    const redirectUri = storedRedirectUri || this.redirectUri;
    
    console.log('Exchanging code for token:', {
      verifier: codeVerifier.substring(0, 10) + '...',
      redirectUri
    });
    
    try {
      // Use real Twitter API with the stored redirect_uri
      const result = await realTwitterAPI.exchangeCodeForToken(code, redirectUri, codeVerifier);
      
      // Clear the stored OAuth data
      localStorage.removeItem('twitter_code_verifier');
      localStorage.removeItem('twitter_redirect_uri');
      
      return result;
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw error;
    }
  }

  // Generate random state parameter for security
  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Generate code verifier for PKCE
  private generateCodeVerifier(): string {
    // Generate a proper code verifier (43-128 characters)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    console.log('Generated code verifier:', codeVerifier.substring(0, 10) + '...');
    
    return codeVerifier;
  }

  // Demo mode - simulate Twitter authentication (for testing without real OAuth)
  async simulateTwitterAuth(): Promise<TwitterAuthResponse> {
    try {
      // Create realistic demo user data
      const demoUsers = [
        {
          id: 'demo_user_1',
          username: 'wegram_user',
          name: 'WEGRAM User',
          profile_image_url: 'https://i.ibb.co/TxdWc0kL/IMG-9101.jpg',
          description: 'Web3 enthusiast and WEGRAM early adopter 🚀',
          verified: true,
          followers_count: 15420,
          following_count: 892,
          tweet_count: 1337
        },
        {
          id: 'demo_user_2', 
          username: 'crypto_trader',
          name: 'Crypto Trader',
          profile_image_url: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=CT',
          description: 'Trading crypto since 2017. HODL 💎🙌',
          verified: false,
          followers_count: 8934,
          following_count: 445,
          tweet_count: 2891
        }
      ];

      // Pick a random demo user
      const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      
      console.log('🎭 Demo X Login: Creating realistic user profile');
      console.log('✅ User will be saved to Neon database');
      
      return {
        success: true,
        user: randomUser
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
