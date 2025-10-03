import React, { useEffect, useState } from 'react';
import { PostCard } from '../components/Post/PostCard';
import { useNeonPosts } from '../hooks/useNeonPosts';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { mockPosts } from '../data/mockData';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const { isDark } = useTheme();
  const { posts, loading, createPost, likePost, giftPost } = useNeonPosts();
  const { profile } = useNeonAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'trenches' | 'trending'>('following');
  
  // Use real posts from database, fallback to mock if none exist
  const displayPosts = posts.length > 0 ? posts : mockPosts.map(post => ({
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

  const handlePost = async (content: string) => {
    if (!profile) {
      console.error('❌ No profile found for post creation');
      return;
    }
    
    console.log('🚀 Creating post with:', {
      content: content.substring(0, 50) + '...',
      userId: profile.id,
      username: profile.username
    });
    
    const result = await createPost(content, profile.id, profile.username);
    
    if (result.error) {
      console.error('❌ Post creation failed:', result.error);
      alert(`Failed to create post: ${result.error}`);
    } else {
      console.log('✅ Post created successfully:', result.data);
    }
  };

  // Listen for quick composer posts from BottomNav modal
  useEffect(() => {
    const handler = (e: any) => {
      const content = e.detail?.content as string;
      if (content) handlePost(content);
    };
    window.addEventListener('wegram:new-post', handler as any);
    return () => window.removeEventListener('wegram:new-post', handler as any);
  }, [profile]);

  const handleLike = async (postId: string) => {
    await likePost(postId);
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

  const handleBookmark = async (postId: string) => {
    // Bookmark functionality - in real app this would save to user's bookmarks
    console.log('Bookmarking post:', postId);
    alert('Post bookmarked! 📖');
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24 text-center">
        <div className="animate-pulse">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Crypto Performance Notification */}
      <div 
        onClick={() => navigate('/livestream')}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/livestream')}
        role="button"
        tabIndex={0}
        aria-label="View livestream"
        className="relative mb-4 mx-2 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] group focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <div className="rounded-full p-0.5 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}>
          <div className="rounded-full px-4 py-3" style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}>
            <div className="flex items-center space-x-3">
            {/* Profile Pictures */}
            <div className="flex -space-x-1.5">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face" 
                alt="Trader profile"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b73b1eb0?w=400&h=400&fit=crop&crop=face" 
                alt="Trader profile"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
                alt="Trader profile"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            </div>
            
            {/* Crypto Performance Text */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-sm">SOL PUMPING</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-300 font-bold text-sm">+24.7%</span>
                </div>
              </div>
            </div>
            
            {/* Activity Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">+417</span>
            </div>
          </div>
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-black rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
      </div>

      {/* Feed Navigation */}
      <div className={`flex gap-1 mb-6 rounded-lg p-1 ${
        isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-200 bg-opacity-70'
      }`}>
        {(['following', 'trenches', 'trending'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      
      <div>
        {displayPosts.map(post => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              userId: post.user_id,
              username: `@${post.username}`,
              content: post.content,
              timestamp: post.created_at ? new Date(post.created_at).toLocaleDateString() : (post as any).timestamp || '2h',
              likes: post.likes,
              replies: post.replies,
              shares: post.shares,
              gifts: post.gifts
            }}
            onLike={handleLike}
            onGift={handleGift}
            onBookmark={handleBookmark}
          />
        ))}
      </div>
    </div>
  );
};