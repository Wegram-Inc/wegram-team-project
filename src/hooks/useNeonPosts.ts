import { useState, useEffect, useCallback } from 'react';
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
  username: string;
  avatar_url: string | null;
}

export const useNeonPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Remove automatic fetchPosts call - let components control when to fetch
  // useEffect(() => {
  //   fetchPosts('trenches');
  // }, []);

  const fetchPosts = useCallback(async (feedType: 'following' | 'trenches' | 'trending' = 'trenches', userId?: string) => {
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
        // Fallback to mock data if API fails
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
          username: post.username.replace('@', ''),
          avatar_url: null
        }));
        setPosts(mockPostsWithProfiles);
      }
    } catch (error) {
      // Fallback to mock data
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
        username: post.username.replace('@', ''),
        avatar_url: null
      }));
      setPosts(mockPostsWithProfiles);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't depend on any external values

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

  const likePost = async (postId: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, action: 'like' })
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

  return {
    posts,
    loading,
    fetchPosts,
    createPost,
    likePost,
    giftPost,
    sharePost
  };
};
