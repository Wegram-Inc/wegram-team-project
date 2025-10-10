// X Authentication with Neon Postgres
import { useState, useEffect } from 'react';
import { neonSimple, Profile } from '../lib/neonSimple';
import { twitterAuth } from '../lib/twitterAuth';

export const useNeonAuth = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('wegram_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setProfile(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('wegram_user');
      }
    }
    setLoading(false);
  }, []);

  // 🚀 Sign in with X (Demo mode)
  const signInWithX = async () => {
    try {
      const result = await twitterAuth.simulateTwitterAuth();
      
      if (result.success && result.user) {
        // Check if user exists in Neon database
        let user = await neonSimple.getUserByTwitterId(result.user.id);
        
        if (!user) {
          // Create new user from Twitter data
          user = await neonSimple.createUserFromTwitter(result.user);
          console.log('✅ New user created in Neon Postgres');
        } else {
          console.log('✅ Existing user found in Neon Postgres');
        }
        
        // Store in localStorage for persistence
        localStorage.setItem('wegram_user', JSON.stringify(user));
        setProfile(user);
        
        return { success: true, user };
      } else {
        throw new Error(result.error || 'X authentication failed');
      }
    } catch (error) {
      console.error('X sign-in error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  };

  // 🚀 Sign in with real X (Twitter) OAuth
  const signInWithRealX = async () => {
    try {
      // Start real Twitter OAuth flow
      await twitterAuth.startRealOAuth();
      return { success: true };
    } catch (error) {
      console.error('Real X auth error:', error);
      return { success: false, error: 'Failed to start X authentication' };
    }
  };

  // 🚀 Handle X OAuth callback
  const handleXCallback = async (code: string, state: string) => {
    try {
      const result = await twitterAuth.handleCallback(code, state);

      if (result.success && result.user) {
        console.log('🔍 Twitter user data received:', result.user);

        // Save user via API endpoint
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            twitter_id: result.user.id,
            twitter_username: result.user.username,
            username: `@${result.user.username}`,
            avatar_url: result.user.profile_image_url,
            bio: result.user.description || `Twitter user ${result.user.name}`,
            verified: result.user.verified || false,
            followers_count: result.user.followers_count || 0,
            following_count: result.user.following_count || 0,
            posts_count: result.user.tweet_count || 0
          })
        });

        const apiResult = await response.json();

        if (response.ok && apiResult.success) {
          const user = apiResult.user;
          console.log('✅ User saved to database:', user);

          // Store in localStorage
          localStorage.setItem('wegram_user', JSON.stringify(user));
          setProfile(user);

          return { success: true, user };
        } else {
          throw new Error(apiResult.error || 'Failed to save user');
        }
      } else {
        throw new Error(result.error || 'X authentication failed');
      }
    } catch (error) {
      console.error('X callback error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  };

  // 🚀 Sign out
  const signOut = () => {
    localStorage.removeItem('wegram_user');
    setProfile(null);
  };

  // 🚀 Update profile
  const updateProfile = async (updates: {
    bio?: string;
    avatar_url?: string;
    twitter_link?: string;
    discord_link?: string;
    telegram_link?: string;
  }) => {
    if (!profile) return { success: false, error: 'No user logged in' };

    try {
      console.log('📤 Sending update request:', { userId: profile.id, updates });

      // Call the API endpoint instead of direct database access
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: profile.id,
          bio: updates.bio,
          avatar_url: updates.avatar_url,
          twitter_link: updates.twitter_link,
          discord_link: updates.discord_link,
          telegram_link: updates.telegram_link
        })
      });

      const result = await response.json();
      console.log('📥 API response:', { status: response.status, result });

      if (response.ok && result.success) {
        // Update local state with the complete profile from database
        setProfile(result.profile);
        localStorage.setItem('wegram_user', JSON.stringify(result.profile));
        
        return { success: true, profile: result.profile };
      } else {
        console.error('❌ Update failed:', result);
        return { 
          success: false, 
          error: result.error || result.details || 'Failed to update profile' 
        };
      }
    } catch (error) {
      console.error('❌ Update exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  };

  // 🚀 Sign up with email/password
  const signUpWithEmail = async (email: string, password: string, username: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('wegram_user', JSON.stringify(result.user));
        setProfile(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Signup failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    }
  };

  // 🚀 Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('wegram_user', JSON.stringify(result.user));
        setProfile(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  return {
    profile,
    loading,
    signInWithX,
    signInWithRealX,
    signInWithEmail,
    signUpWithEmail,
    handleXCallback,
    signOut,
    updateProfile,
    // Helper properties
    isAuthenticated: !!profile,
    userId: profile?.id || null,
    username: profile?.username || null,
    // Legacy compatibility
    signInWithTwitter: signInWithX, // For existing components
    signInWithRealTwitter: signInWithRealX, // For existing components
  };
};
