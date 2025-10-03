import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
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
  };

  const createPost = async (content: string, userId: string, username?: string) => {
    try {
      console.log('📤 Sending post to API:', { content: content.substring(0, 50) + '...', user_id: userId });
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, user_id: userId })
      });

      console.log('📥 API response status:', response.status);
      const result = await response.json();
      console.log('📥 API response data:', result);

      if (response.ok && result.post) {
        setPosts([result.post, ...posts]);
        return { data: result.post };
      } else {
        return { error: result.error };
      }
    } catch (error) {
      console.error('❌ Post creation error:', error);
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
    createPost,
    likePost,
    giftPost,
    sharePost,
    refetch: fetchPosts,
  };
};
