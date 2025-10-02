// Simplified X (Twitter) Authentication with Supabase
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.log('Auth event:', event);
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
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        await createProfile(userId);
      } else if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      } else {
        setProfile(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      // Get user metadata from Supabase auth (includes Twitter data)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      // Extract Twitter data from user metadata
      const twitterData = user.user_metadata;
      const username = twitterData.user_name || twitterData.preferred_username || `user_${userId.slice(0, 8)}`;
      
      const profileData = {
        id: userId,
        username: `@${username}`,
        email: user.email || null,
        avatar_url: twitterData.avatar_url || twitterData.picture || null,
        bio: twitterData.description || `Twitter user ${twitterData.full_name || twitterData.name || username}`,
        verified: twitterData.verified || false,
        followers_count: twitterData.followers_count || 0,
        following_count: twitterData.following_count || 0,
        posts_count: 0,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in createProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 SUPER SIMPLE X LOGIN - Just 5 lines!
  const signInWithX = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'tweet.read users.read'
      }
    });
    
    if (error) {
      console.error('X login error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    signInWithX,
    signOut,
  };
};




