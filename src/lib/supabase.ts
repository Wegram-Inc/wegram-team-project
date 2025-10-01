import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Connection status
if (supabase) {
  console.log('✅ Supabase connected successfully!');
} else {
  console.log('📋 Demo mode - Add your Supabase credentials to .env to enable database features');
}

// Database Types - Complete Schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          username: string;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          verified?: boolean;
          followers_count?: number;
          following_count?: number;
          posts_count?: number;
        };
        Update: {
          username?: string;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          verified?: boolean;
          followers_count?: number;
          following_count?: number;
          posts_count?: number;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          likes_count: number;
          comments_count: number;
          shares_count: number;
          gifts_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
          image_url?: string | null;
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          gifts_count?: number;
        };
        Update: {
          content?: string;
          image_url?: string | null;
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          gifts_count?: number;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
        };
        Update: {};
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          content: string;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          content: string;
          likes_count?: number;
        };
        Update: {
          content?: string;
          likes_count?: number;
          updated_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: {};
      };
      rewards: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          amount: string;
          type: 'daily' | 'invite' | 'task' | 'post' | 'like' | 'comment' | 'share';
          claimed: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          amount: string;
          type: 'daily' | 'invite' | 'task' | 'post' | 'like' | 'comment' | 'share';
          claimed?: boolean;
        };
        Update: {
          claimed?: boolean;
        };
      };
      user_wallets: {
        Row: {
          id: string;
          user_id: string;
          public_key: string;
          private_key_encrypted: string;
          mnemonic_encrypted: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          public_key: string;
          private_key_encrypted: string;
          mnemonic_encrypted?: string | null;
        };
        Update: {
          public_key?: string;
          private_key_encrypted?: string;
          mnemonic_encrypted?: string | null;
          updated_at?: string;
        };
      };
      wallet_balances: {
        Row: {
          id: string;
          user_id: string;
          token_symbol: string;
          token_name: string;
          balance: number;
          usd_value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          token_symbol: string;
          token_name: string;
          balance?: number;
          usd_value?: number;
        };
        Update: {
          balance?: number;
          usd_value?: number;
          updated_at?: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          transaction_hash: string;
          from_address: string | null;
          to_address: string | null;
          amount: number;
          token_symbol: string;
          transaction_type: 'send' | 'receive' | 'reward' | 'purchase';
          status: 'pending' | 'confirmed' | 'failed';
          created_at: string;
        };
        Insert: {
          user_id: string;
          transaction_hash: string;
          from_address?: string | null;
          to_address?: string | null;
          amount: number;
          token_symbol: string;
          transaction_type: 'send' | 'receive' | 'reward' | 'purchase';
          status: 'pending' | 'confirmed' | 'failed';
        };
        Update: {
          status?: 'pending' | 'confirmed' | 'failed';
        };
      };
      reward_claims: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          amount: number;
          token_symbol: string;
          transaction_hash: string | null;
          claimed_at: string;
        };
        Insert: {
          user_id: string;
          reward_id: string;
          amount: number;
          token_symbol: string;
          transaction_hash?: string | null;
        };
        Update: {
          transaction_hash?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}