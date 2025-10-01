// Simple Authentication with localStorage (no MongoDB complexity)
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { mockUser } from '../data/mockData';
import { twitterAuth, TwitterUser } from '../lib/twitterAuth';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMongoConnected, setIsMongoConnected] = useState(false); // Keep for UI

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored user data
        const storedUser = localStorage.getItem('wegram_user');
        const storedTwitterUser = localStorage.getItem('wegram_twitter_user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Found stored user:', userData);
          setProfile(userData);
          setUser(null);
          setLoading(false);
          return;
        }

        if (storedTwitterUser) {
          const twitterData = JSON.parse(storedTwitterUser);
          console.log('Found stored Twitter user:', twitterData);
          setTwitterUser(twitterData);
          setLoading(false);
          return;
        }

        // If no Supabase, just show demo mode
        if (!supabase) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
              setLoading(false);
            }
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code === 'PGRST116') {
          await createProfile(userId);
        } else if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const username = `user_${userId.slice(0, 8)}`;
      
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username,
            email: user?.email || null,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating profile:', error);
        } else {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.log('Demo mode: Google sign-in simulated');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('Error signing in with Google:', error);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      console.log('Demo mode: Email sign-in simulated');
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error('Error signing in with email:', error);
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      console.log('Demo mode: Email sign-up simulated');
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.error('Error signing up with email:', error);
    return { error };
  };

  const signInWithTwitter = async () => {
    try {
      // Simulate Twitter auth
      const result = await twitterAuth.simulateTwitterAuth();
      
      if (result.success && result.user) {
        setTwitterUser(result.user);
        
        // Create profile with Twitter data
        const twitterProfile: Profile = {
          id: result.user.id,
          username: `@${result.user.username}`,
          email: null,
          avatar_url: result.user.profile_image_url || null,
          bio: `Twitter user ${result.user.name}`,
          verified: result.user.verified || false,
          followers_count: result.user.followers_count || 0,
          following_count: result.user.following_count || 0,
          posts_count: result.user.tweet_count || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Save to MongoDB (your Vercel database)
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(twitterProfile)
          });
          
          if (response.ok) {
            console.log('✅ User saved to MongoDB');
          }
        } catch (dbError) {
          console.log('Using localStorage fallback:', dbError);
        }
        
        // Store in localStorage as backup
        localStorage.setItem('wegram_user', JSON.stringify(twitterProfile));
        localStorage.setItem('wegram_twitter_user', JSON.stringify(result.user));
        
        setProfile(twitterProfile);
        setUser(null);
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || 'Twitter authentication failed');
      }
    } catch (error) {
      console.error('Twitter sign-in error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
    }
  };

  const signInWithRealTwitter = async () => {
    try {
      await twitterAuth.startRealOAuth();
    } catch (error) {
      console.error('Real Twitter auth error:', error);
      return { success: false, error: 'Failed to start Twitter authentication' };
    }
  };

  const handleTwitterCallback = async (code: string, state: string) => {
    try {
      const result = await twitterAuth.handleCallback(code, state);
      
      if (result.success && result.user) {
        setTwitterUser(result.user);
        
        const twitterProfile: Profile = {
          id: result.user.id,
          username: `@${result.user.username}`,
          email: null,
          avatar_url: result.user.profile_image_url || null,
          bio: `Twitter user ${result.user.name}`,
          verified: result.user.verified || false,
          followers_count: result.user.followers_count || 0,
          following_count: result.user.following_count || 0,
          posts_count: result.user.tweet_count || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem('wegram_user', JSON.stringify(twitterProfile));
        localStorage.setItem('wegram_twitter_user', JSON.stringify(result.user));
        
        setProfile(twitterProfile);
        setUser(null);
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || 'Twitter authentication failed');
      }
    } catch (error) {
      console.error('Twitter callback error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('wegram_user');
    localStorage.removeItem('wegram_twitter_user');
    
    if (!supabase) {
      console.log('Demo mode: Sign-out simulated');
      setTwitterUser(null);
      setProfile(null);
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    setTwitterUser(null);
  };

  return {
    user,
    profile,
    twitterUser,
    loading,
    isMongoConnected: false, // Always false for now
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInWithTwitter,
    signInWithRealTwitter,
    handleTwitterCallback,
    signOut,
  };
};