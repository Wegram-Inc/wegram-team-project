import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mockPosts } from '../data/mockData';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  replies: number;
  shares: number;
  gifts: number;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no Supabase, use mock data
    if (!supabase) {
      const mockPostsWithProfiles = mockPosts.map(post => ({
        id: post.id,
        user_id: post.userId,
        content: post.content,
        likes: post.likes,
        replies: post.replies,
        shares: post.shares,
        gifts: post.gifts || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          username: post.username.replace('@', ''),
          avatar_url: null
        }
      }));
      setPosts(mockPostsWithProfiles);
      setLoading(false);
      return;
    }

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error in fetchPosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, userId: string) => {
    if (!supabase) {
      // Mock post creation
      const newPost = {
        id: Date.now().toString(),
        user_id: userId,
        content,
        likes: 0,
        replies: 0,
        shares: 0,
        gifts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          username: 'demo_user',
          avatar_url: null
        }
      };
      setPosts([newPost, ...posts]);
      return { data: newPost };
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content,
          user_id: userId,
        })
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return { error };
      } else {
        setPosts([data, ...posts]);
        return { data };
      }
    } catch (error) {
      console.error('Error in createPost:', error);
      return { error };
    }
  };

  const likePost = async (postId: string) => {
    if (!supabase) {
      // Mock like functionality
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: p.likes + 1 }
          : p
      ));
      return;
    }

    try {
      // Get current post
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('posts')
        .update({ likes: post.likes + 1 })
        .eq('id', postId);

      if (error) {
        console.error('Error liking post:', error);
      } else {
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: p.likes + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Error in likePost:', error);
    }
  };

  const giftPost = async (postId: string) => {
    if (!supabase) {
      // Mock gift functionality
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, gifts: p.gifts + 1 }
          : p
      ));
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('posts')
        .update({ gifts: post.gifts + 1 })
        .eq('id', postId);

      if (error) {
        console.error('Error gifting post:', error);
      } else {
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, gifts: p.gifts + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Error in giftPost:', error);
    }
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    giftPost,
    refetch: fetchPosts,
  };
};