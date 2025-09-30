// Mock Twitter API service for demo purposes
// In production, this would be replaced with actual backend endpoints

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

class MockTwitterAPI {
  private readonly apiKey = import.meta.env.VITE_TWITTER_API_KEY || 'YOUR_TWITTER_API_KEY_HERE';
  private readonly apiSecret = import.meta.env.VITE_TWITTER_API_SECRET || 'YOUR_TWITTER_API_SECRET_HERE';
  private readonly bearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN || 'YOUR_TWITTER_BEARER_TOKEN_HERE';

  // Mock token exchange endpoint
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<TwitterTokenResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful token response
    return {
      access_token: 'mock_access_token_' + Date.now(),
      token_type: 'bearer',
      expires_in: 7200,
      refresh_token: 'mock_refresh_token_' + Date.now(),
      scope: 'tweet.read users.read offline.access'
    };
  }

  // Mock user info endpoint
  async getUserInfo(accessToken: string): Promise<TwitterUserResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user data based on the provided credentials
    return {
      data: {
        id: '1966499553881862144',
        username: 'demo_user',
        name: 'Demo User',
        profile_image_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
        verified: true,
        public_metrics: {
          followers_count: 1234,
          following_count: 567,
          tweet_count: 89
        }
      }
    };
  }

  // Mock tweet posting endpoint
  async postTweet(accessToken: string, text: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      data: {
        id: 'tweet_' + Date.now(),
        text: text,
        created_at: new Date().toISOString(),
        author_id: '1966499553881862144'
      }
    };
  }

  // Mock timeline endpoint
  async getUserTimeline(accessToken: string, userId: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      data: [
        {
          id: 'tweet_1',
          text: 'Just connected my Twitter account to WEGRAM! 🚀',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          author_id: userId
        },
        {
          id: 'tweet_2',
          text: 'Excited to be part of the Web3 social revolution! 💎',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          author_id: userId
        }
      ]
    };
  }

  // Validate credentials (for demo purposes)
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

export const mockTwitterAPI = new MockTwitterAPI();
