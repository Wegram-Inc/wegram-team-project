import React, { useEffect, useState } from 'react';
import { PostCard } from '../components/Post/PostCard';
import { useNeonPosts } from '../hooks/useNeonPosts';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Users, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const { isDark } = useTheme();
  const { posts, loading, createPost, likePost, giftPost, fetchPosts, deletePost } = useNeonPosts();
  const { profile } = useNeonAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'following' | 'trenches' | 'trending'>('trenches');

  // Check URL params to set initial tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'trending') {
      setActiveTab('trending');
      if (profile?.id) {
        fetchPosts('trending', profile.id);
      } else {
        fetchPosts('trending');
      }
    } else if (tabParam === 'trenches') {
      setActiveTab('trenches');
      if (profile?.id) {
        fetchPosts('trenches', profile.id);
      } else {
        fetchPosts('trenches');
      }
    }
  }, [location.search, profile?.id]);
  
  // Use real posts from database only - NO MOCK FALLBACKS
  const displayPosts = posts;

  // Handle tab changes
  const handleTabChange = (tab: 'following' | 'trenches' | 'trending') => {
    setActiveTab(tab);
    if (profile?.id) {
      fetchPosts(tab, profile.id);
    } else {
      fetchPosts(tab);
    }
  };

  // Load initial feed when component mounts or profile changes
  useEffect(() => {
    if (profile?.id) {
      fetchPosts(activeTab, profile.id);
    } else {
      fetchPosts(activeTab);
    }
  }, [profile?.id]); // Remove activeTab from dependencies to prevent infinite loop

  const handlePost = async (content: string, imageUrl?: string) => {
    if (!profile) return;
    await createPost(content, profile.id, profile.username, imageUrl);
  };

  // Listen for quick composer posts from BottomNav modal
  useEffect(() => {
    const handler = (e: any) => {
      const content = e.detail?.content as string;
      const imageUrl = e.detail?.imageUrl as string;
      if (content || imageUrl) handlePost(content, imageUrl);
    };
    window.addEventListener('wegram:new-post', handler as any);
    return () => window.removeEventListener('wegram:new-post', handler as any);
  }, [profile]);

  const handleLike = async (postId: string) => {
    await likePost(postId, profile?.id);
  };

  const handleGift = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const giftOptions = ['🎁 1 WGM', '💎 5 WGM', '🚀 10 WGM', '👑 25 WGM'];
    const selectedGift = prompt(`Send a gift to @${post.username}:\n\n${giftOptions.join('\n')}\n\nEnter gift (1, 5, 10, or 25):`);
    
    if (selectedGift && ['1', '5', '10', '25'].includes(selectedGift)) {
      await giftPost(postId);
      alert(`🎁 Sent ${selectedGift} WGM to @${post.username}!`);
    }
  };

  const handleShare = async (postId: string) => {
    // Share functionality - copy link to clipboard
    const postUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      alert('Post link copied to clipboard! 🔗');
    } catch (error) {
      alert('Failed to copy link');
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!profile?.id) {
      alert('Please sign in to bookmark posts');
      return;
    }

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          postId: postId
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Post bookmarked! 📖');
      } else {
        console.error('Bookmark failed:', data.error);
        alert('Failed to bookmark post');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('Failed to bookmark post');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!profile?.id) {
      alert('Please sign in to delete posts');
      return;
    }

    const result = await deletePost(postId, profile.id);
    if (result.error) {
      alert(`Failed to delete post: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-32 pb-24 text-center lg:pt-20">
        <div className="animate-pulse">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-32 pb-24 lg:max-w-none lg:pt-4 lg:pb-4">
      
      {/* "The long blue thing" removed - saved to BACKUP_the_long_blue_thing.tsx */}

      {/* Feed Navigation */}
      <div className={`flex gap-1 mb-6 rounded-lg p-1 ${
        isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-200 bg-opacity-70'
      }`}>
        {([
          { key: 'following', label: 'Following', icon: Users },
          { key: 'trenches', label: 'Trenches', icon: Zap },
          { key: 'trending', label: 'Trending', icon: TrendingUp }
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-purple-600 text-white'
                : isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      
      <div>
        {displayPosts.length > 0 ? (
          displayPosts.map(post => (
            <PostCard
              key={`${activeTab}-${post.id}`}
              post={{
                id: post.id,
                userId: post.user_id,
                username: post.username.startsWith('@') ? post.username : `@${post.username}`,
                content: post.content,
                timestamp: post.created_at ? new Date(post.created_at).toLocaleDateString() : (post as any).timestamp || '2h',
                likes: post.likes,
                replies: post.replies,
                shares: post.shares,
                gifts: post.gifts,
                avatar_url: post.avatar_url,
                image_url: post.image_url,
                verified: post.verified
              }}
              onLike={handleLike}
              onShare={handleShare}
              onGift={handleGift}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'following' && '👥'}
              {activeTab === 'trenches' && '⚡'}
              {activeTab === 'trending' && '🔥'}
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              {activeTab === 'following' && 'No posts from people you follow'}
              {activeTab === 'trenches' && 'No recent posts'}
              {activeTab === 'trending' && 'No trending posts yet'}
            </h3>
            <p className="text-secondary text-sm mb-4">
              {activeTab === 'following' && 'Follow some users to see their posts here'}
              {activeTab === 'trenches' && 'Be the first to post something new!'}
              {activeTab === 'trending' && 'Posts need more likes to appear in trending'}
            </p>
            {activeTab === 'following' && (
              <button
                onClick={() => navigate('/explore')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Discover Users
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};