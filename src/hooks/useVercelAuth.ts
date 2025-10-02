// Simple X Authentication with Vercel Postgres
import { useState, useEffect } from 'react';
import { vercelPostgres, Profile } from '../lib/vercelPostgres';
import { twitterAuth } from '../lib/twitterAuth';

export const useVercelAuth = () => {
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

  // 🚀 Sign in with X (Twitter) - Much simpler than before!
  const signInWithX = async () => {
    try {
      // Use your existing Twitter auth
      const result = await twitterAuth.simulateTwitterAuth();
      
      if (result.success && result.user) {
        // Check if user exists in database
        let user = await vercelPostgres.getUserByTwitterId(result.user.id);
        
        if (!user) {
          // Create new user from Twitter data
          user = await vercelPostgres.createUserFromTwitter(result.user);
          console.log('✅ New user created in Vercel Postgres');
        } else {
          console.log('✅ Existing user found in Vercel Postgres');
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
        // Check if user exists in database
        let user = await vercelPostgres.getUserByTwitterId(result.user.id);
        
        if (!user) {
          // Create new user from Twitter data
          user = await vercelPostgres.createUserFromTwitter(result.user);
          console.log('✅ New user created from real X auth');
        } else {
          console.log('✅ Existing user authenticated with real X');
        }
        
        // Store in localStorage
        localStorage.setItem('wegram_user', JSON.stringify(user));
        setProfile(user);
        
        return { success: true, user };
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
  const updateProfile = (updatedProfile: Profile) => {
    localStorage.setItem('wegram_user', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  return {
    profile,
    loading,
    signInWithX,
    signInWithRealX,
    handleXCallback,
    signOut,
    updateProfile,
    // Helper properties
    isAuthenticated: !!profile,
    userId: profile?.id || null,
    username: profile?.username || null,
  };
};




