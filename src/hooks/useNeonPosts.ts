import { useState, useEffect } from 'react';

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
  username: string;
  avatar_url: string | null;
  verified?: boolean;
}

export const useNeonPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Remove automatic fetchPosts call - let components control when to fetch
  // useEffect(() => {
  //   fetchPosts('trenches');
  // }, []);

  const fetchPosts = async (feedType: 'following' | 'trenches' | 'trending' = 'trenches', userId?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('feed_type', feedType);
      if (userId) {
        params.append('user_id', userId);
      }
      
      const url = `/api/posts?${params.toString()}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.posts) {
        setPosts(result.posts);
      } else {
        console.error('Failed to fetch posts:', result.error || 'Unknown error');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, userId: string, username?: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, user_id: userId })
      });

      const result = await response.json();

      if (response.ok && result.post) {
        setPosts([result.post, ...posts]);
        return { data: result.post };
      } else {
        return { error: result.error };
      }
    } catch (error) {
      return { error: 'Failed to create post' };
    }
  };

  const likePost = async (postId: string, userId?: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, action: 'like', user_id: userId })
      });

      const result = await response.json();

      if (response.ok && result.post) {
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: result.post.likes }
            : p
        ));
      } else {
        console.error('Error liking post:', result.error);
      }
    } catch (error) {
      console.error('Error in likePost:', error);
    }
  };

  const giftPost = async (postId: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, action: 'gift' })
      });

      const result = await response.json();

      if (response.ok && result.post) {
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, gifts: result.post.gifts }
            : p
        ));
      } else {
        console.error('Error gifting post:', result.error);
      }
    } catch (error) {
      console.error('Error in giftPost:', error);
    }
  };

  const sharePost = async (postId: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, action: 'share' })
      });

      const result = await response.json();

      if (response.ok && result.post) {
        setPosts(posts.map(p =>
          p.id === postId
            ? { ...p, shares: result.post.shares }
            : p
        ));
      } else {
        console.error('Error sharing post:', result.error);
      }
    } catch (error) {
      console.error('Error in sharePost:', error);
    }
  };

  const fetchUserPosts = async (userId: string) => {
    console.log('🚀 fetchUserPosts called with userId:', userId);
    setLoading(true);
    try {
      const url = `/api/posts?user_posts=${userId}`;
      console.log('📡 Making request to:', url);

      const response = await fetch(url);
      const result = await response.json();

      console.log('📥 API Response:', {
        status: response.status,
        ok: response.ok,
        result
      });

      if (response.ok && result.posts) {
        console.log('✅ Setting posts:', result.posts);
        setPosts(result.posts);
      } else {
        console.error('❌ Failed to fetch user posts:', result.error);
        setPosts([]);
      }
    } catch (error) {
      console.error('💥 Error fetching user posts:', error);
      setPosts([]);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    fetchPosts,
    fetchUserPosts,
    createPost,
    likePost,
    giftPost,
    sharePost
  };
};
