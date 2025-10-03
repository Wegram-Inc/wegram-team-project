import React, { useState } from 'react';
import { Bookmark, Clock, Heart, MessageCircle, Share, Gift, Trash2, Filter } from 'lucide-react';
import { PostCard } from '../components/Post/PostCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { useNeonAuth } from '../hooks/useNeonAuth';

interface BookmarkedPost {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  shares: number;
  gifts: number;
  bookmarkedAt: string;
  category?: 'crypto' | 'defi' | 'nft' | 'general';
}

export const Bookmarks: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'crypto' | 'defi' | 'nft' | 'general'>('all');
  const { bookmarks, loading, removeBookmark, clearAllBookmarks } = useBookmarks();
  const { profile } = useNeonAuth();

  const filters = ['all', 'crypto', 'defi', 'nft', 'general'] as const;

  // For now, we'll show all bookmarks since we don't have categories in the database yet
  const filteredBookmarks = bookmarks;

  const handleLike = (postId: string) => {
    // Like functionality
    console.log('Liking post:', postId);
  };

  const handleRemoveBookmark = async (postId: string) => {
    const result = await removeBookmark(postId);
    if (result.success) {
      alert('Bookmark removed!');
    } else {
      alert('Failed to remove bookmark: ' + result.error);
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
      const result = await clearAllBookmarks();
      if (result.success) {
        alert('All bookmarks cleared!');
      } else {
        alert('Failed to clear bookmarks: ' + result.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24 text-center">
        <div className="animate-pulse">Loading bookmarks...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24 text-center">
        <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-primary font-semibold mb-2">Please log in</h3>
        <p className="text-secondary text-sm">You need to be logged in to view your bookmarks.</p>
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
            <p className="text-secondary text-sm">{bookmarks.length} saved posts</p>
          </div>
        </div>
        
        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {bookmarks.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Bookmarked Posts */}
      {filteredBookmarks.length > 0 ? (
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="relative">
              {/* Bookmark timestamp */}
              <div className="flex items-center justify-between mb-2 text-xs text-secondary">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Saved {new Date(bookmark.created_at).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.post_id)}
                  className="p-1 hover:bg-red-600 hover:bg-opacity-20 rounded transition-colors text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              <PostCard
                post={{
                  id: bookmark.post.id,
                  userId: bookmark.post.user_id,
                  username: `@${bookmark.post.username}`,
                  content: bookmark.post.content,
                  timestamp: new Date(bookmark.post.created_at).toLocaleDateString(),
                  likes: bookmark.post.likes_count,
                  replies: bookmark.post.comments_count,
                  shares: bookmark.post.shares_count,
                  gifts: bookmark.post.gifts_count,
                  avatar_url: bookmark.post.avatar_url
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
            {activeFilter === 'all' 
              ? 'Save posts you want to read later by tapping the bookmark icon'
              : `No ${activeFilter} bookmarks found`
            }
          </p>
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="btn-primary px-6 py-2"
            >
              View All Bookmarks
            </button>
          )}
        </div>
      )}

      {/* Stats Footer */}
      {bookmarks.length > 0 && (
        <div className="mt-8 card">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-secondary">
              <Filter className="w-4 h-4" />
              <span>Filter by category</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Bookmark className="w-4 h-4" />
              <span>{filteredBookmarks.length} posts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};