import { useState, useEffect, useCallback } from 'react';
import { useNeonAuth } from './useNeonAuth';

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  // Post data
  post: {
    id: string;
    user_id: string;
    content: string;
    image_url?: string;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    gifts_count: number;
    created_at: string;
    updated_at: string;
    username: string;
    avatar_url: string | null;
  };
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useNeonAuth();

  const fetchBookmarks = useCallback(async () => {
    if (!profile?.id) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bookmarks?user_id=${profile.id}`);
      const result = await response.json();

      if (response.ok && result.bookmarks) {
        setBookmarks(result.bookmarks);
      } else {
        console.error('Failed to fetch bookmarks:', result.error);
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  const addBookmark = useCallback(async (postId: string) => {
    if (!profile?.id) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: profile.id })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh bookmarks
        await fetchBookmarks();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to bookmark' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to bookmark' };
    }
  }, [profile?.id, fetchBookmarks]);

  const removeBookmark = useCallback(async (postId: string) => {
    if (!profile?.id) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: profile.id })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove from local state
        setBookmarks(prev => prev.filter(b => b.post_id !== postId));
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to remove bookmark' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to remove bookmark' };
    }
  }, [profile?.id]);

  const clearAllBookmarks = useCallback(async () => {
    if (!profile?.id) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: profile.id, clear_all: true })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setBookmarks([]);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to clear bookmarks' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to clear bookmarks' };
    }
  }, [profile?.id]);

  // Fetch bookmarks when profile changes
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    clearAllBookmarks
  };
};
