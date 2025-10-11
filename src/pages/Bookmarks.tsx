import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Heart, MessageCircle, Share, Gift, Trash2, Filter } from 'lucide-react';
import { PostCard } from '../components/Post/PostCard';
import { useNeonAuth } from '../hooks/useNeonAuth';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar_url?: string;
  verified?: boolean;
  bookmarked_at?: string;
}

export const Bookmarks: React.FC = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useNeonAuth();

  // Fetch user's bookmarks from the database
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookmarks?userId=${profile.id}`);
        const data = await response.json();

        if (data.success) {
          setBookmarkedPosts(data.bookmarks || []);
        } else {
          setError(data.error || 'Failed to fetch bookmarks');
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [profile?.id]);

  const handleLike = (postId: string) => {
    // Like functionality - can implement later
    console.log('Liking post:', postId);
  };

  const handleRemoveBookmark = async (postId: string) => {
    if (!profile?.id) return;

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          postId: postId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setBookmarkedPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        console.error('Failed to remove bookmark:', data.error);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="text-center py-12">
          <h3 className="text-primary font-semibold mb-2">Error loading bookmarks</h3>
          <p className="text-secondary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show login required state
  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-primary font-semibold mb-2">Sign in required</h3>
          <p className="text-secondary text-sm">Please sign in to view your bookmarks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Bookmarks</h1>
            <p className="text-secondary text-sm">{bookmarkedPosts.length} saved posts</p>
          </div>
        </div>

      </div>

      {/* Bookmarked Posts */}
      {bookmarkedPosts.length > 0 ? (
        <div className="space-y-4">
          {bookmarkedPosts.map((post) => (
            <div key={post.id} className="relative">
              {/* Bookmark timestamp */}
              <div className="flex items-center justify-between mb-2 text-xs text-secondary">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Saved {formatTimestamp(post.bookmarked_at || post.created_at)}</span>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(post.id)}
                  className="p-1 hover:bg-red-600 hover:bg-opacity-20 rounded transition-colors text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <PostCard
                post={{
                  id: post.id,
                  userId: post.user_id,
                  username: post.username || 'Unknown User',
                  content: post.content,
                  timestamp: formatTimestamp(post.created_at),
                  likes: post.likes_count,
                  replies: post.comments_count,
                  shares: post.shares_count,
                  gifts: 0, // Not implemented yet
                  avatar_url: post.avatar_url,
                  image_url: post.image_url,
                  verified: post.verified
                }}
                onLike={handleLike}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-primary font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-secondary text-sm mb-6">
            Save posts you want to read later by tapping the bookmark icon
          </p>
        </div>
      )}
    </div>
  );
};