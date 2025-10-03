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
        // Check localStorage for local posts first, then fallback to mock
        const localPosts = localStorage.getItem('wegram_local_posts');
        if (localPosts) {
          setPosts(JSON.parse(localPosts));
        } else {
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
        }
      }
    } catch (error) {
      // Check localStorage for local posts first, then fallback to mock
      const localPosts = localStorage.getItem('wegram_local_posts');
      if (localPosts) {
        setPosts(JSON.parse(localPosts));
      } else {
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
      }
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
        // API failed, create local post
        const newPost: Post = {
          id: Date.now().toString(),
          user_id: userId,
          content,
          likes: 0,
          replies: 0,
          shares: 0,
          gifts: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          username: username || 'demo_user',
          avatar_url: null
        };
        
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem('wegram_local_posts', JSON.stringify(updatedPosts));
        
        return { data: newPost };
      }
    } catch (error) {
      // API failed, create local post
      const newPost: Post = {
        id: Date.now().toString(),
        user_id: userId,
        content,
        likes: 0,
        replies: 0,
        shares: 0,
        gifts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: username || 'demo_user',
        avatar_url: null
      };
      
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('wegram_local_posts', JSON.stringify(updatedPosts));
      
      return { data: newPost };
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
