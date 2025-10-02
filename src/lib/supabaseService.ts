// Super Simple Database Service with Supabase PostgreSQL
import { supabase } from './supabase';
import type { Database } from './supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];

export class SupabaseService {
  
  // 🚀 GET USER FEED - Single, fast query!
  async getFeedPosts(userId: string, limit = 20): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url,
          verified
        )
      `)
      .in('user_id', 
        // Get posts from users that current user follows
        supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', userId)
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // 🚀 CREATE POST - Simple insert
  async createPost(postData: PostInsert): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 🚀 LIKE POST - Simple upsert
  async likePost(userId: string, postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, post_id: postId });

    if (error) {
      console.error('Like error:', error);
      return false;
    }

    // Increment likes count
    await supabase.rpc('increment_likes', { post_id: postId });
    return true;
  }

  // 🚀 UNLIKE POST - Simple delete
  async unlikePost(userId: string, postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) {
      console.error('Unlike error:', error);
      return false;
    }

    // Decrement likes count
    await supabase.rpc('decrement_likes', { post_id: postId });
    return true;
  }

  // 🚀 FOLLOW USER - Simple insert
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) {
      console.error('Follow error:', error);
      return false;
    }

    return true;
  }

  // 🚀 GET USER PROFILE - Simple select
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile error:', error);
      return null;
    }

    return data;
  }

  // 🚀 REAL-TIME SUBSCRIPTIONS - Built into Supabase!
  subscribeToNewPosts(callback: (post: Post) => void) {
    return supabase
      .channel('posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => callback(payload.new as Post)
      )
      .subscribe();
  }

  subscribeToLikes(postId: string, callback: (likes: number) => void) {
    return supabase
      .channel(`post_${postId}_likes`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'likes', filter: `post_id=eq.${postId}` },
        async () => {
          // Get updated likes count
          const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);
          
          callback(count || 0);
        }
      )
      .subscribe();
  }
}

export const supabaseService = new SupabaseService();




