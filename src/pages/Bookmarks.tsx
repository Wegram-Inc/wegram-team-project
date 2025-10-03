import React, { useState } from 'react';
import { Bookmark, Clock, Heart, MessageCircle, Share, Gift, Trash2, Filter } from 'lucide-react';
import { PostCard } from '../components/Post/PostCard';
import { mockPosts } from '../data/mockData';

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
  
  // Mock bookmarked posts - in real app this would come from user's bookmarks
  const bookmarkedPosts: BookmarkedPost[] = [
    {
      id: '1',
      postId: '1',
      userId: '1',
      username: '@crypto_trader',
      content: 'Up 40% since I joined WEGRAM 🚀 — real web3 experience!',
      timestamp: '2h',
      likes: 24,
      replies: 8,
      shares: 5,
      gifts: 2,
      bookmarkedAt: '1 day ago',
      category: 'crypto'
    },
    {
      id: '2',
      postId: '2',
      userId: '2',
      username: '@defi_expert',
      content: 'The future of social media is here. Earning while posting has never been this easy! #Web3 #SocialFi',
      timestamp: '4h',
      likes: 156,
      replies: 32,
      shares: 18,
      gifts: 7,
      bookmarkedAt: '2 days ago',
      category: 'defi'
    },
    {
      id: '3',
      postId: '3',
      userId: '3',
      username: '@nft_collector',
      content: 'Just completed my daily check-in and earned +2 WGM! These micro-rewards really add up over time.',
      timestamp: '6h',
      likes: 67,
      replies: 12,
      shares: 9,
      gifts: 3,
      bookmarkedAt: '3 days ago',
      category: 'nft'
    }
  ];

  const filters = ['all', 'crypto', 'defi', 'nft', 'general'] as const;

  const filteredBookmarks = activeFilter === 'all' 
    ? bookmarkedPosts 
    : bookmarkedPosts.filter(post => post.category === activeFilter);

  const handleLike = (postId: string) => {
    // Like functionality
    console.log('Liking post:', postId);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    // Remove bookmark functionality
    console.log('Removing bookmark:', bookmarkId);
    alert('Bookmark removed!');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
      alert('All bookmarks cleared!');
    }
  };

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
        
        {bookmarkedPosts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {bookmarkedPosts.length > 0 && (
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
                  <span>Saved {bookmark.bookmarkedAt}</span>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="p-1 hover:bg-red-600 hover:bg-opacity-20 rounded transition-colors text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              <PostCard
                post={{
                  id: bookmark.postId,
                  userId: bookmark.userId,
                  username: bookmark.username,
                  content: bookmark.content,
                  timestamp: bookmark.timestamp,
                  likes: bookmark.likes,
                  replies: bookmark.replies,
                  shares: bookmark.shares,
                  gifts: bookmark.gifts
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
      {bookmarkedPosts.length > 0 && (
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