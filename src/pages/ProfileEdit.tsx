import React, { useState } from 'react';
import { Settings, MoreHorizontal, Grid3X3, Play, Camera, MessageCircle, UserPlus } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { MessageModal } from '../components/Layout/MessageModal';
import { PostCard } from '../components/Post/PostCard';

export const ProfileEdit: React.FC = () => {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'tagged'>('posts');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Mock user posts for demo_user profile
  const userPosts = [
    {
      id: 'demo1',
      userId: profile?.id || 'demo-user',
      username: profile?.username || '@demo_user',
      content: 'Just hit my first 1000 followers on WEGRAM! 🚀 Thanks everyone for the support. The Web3 social revolution is here!',
      timestamp: '2h',
      likes: 89,
      replies: 23,
      shares: 12,
      gifts: 5
    },
    {
      id: 'demo2',
      userId: profile?.id || 'demo-user', 
      username: profile?.username || '@demo_user',
      content: 'Building in Web3 is incredible. Every day brings new possibilities. WEGRAM is changing how we think about social media 💎',
      timestamp: '1d',
      likes: 156,
      replies: 45,
      shares: 28,
      gifts: 12
    },
    {
      id: 'demo3',
      userId: profile?.id || 'demo-user',
      username: profile?.username || '@demo_user', 
      content: 'GM Web3 fam! ☀️ Another day, another opportunity to earn while we socialize. Love this community!',
      timestamp: '2d',
      likes: 67,
      replies: 18,
      shares: 9,
      gifts: 3
    },
    {
      id: 'demo4',
      userId: profile?.id || 'demo-user',
      username: profile?.username || '@demo_user',
      content: 'The future of social media is decentralized. No more big tech controlling our data. We own our content, we earn from our engagement! 🔥',
      timestamp: '3d',
      likes: 234,
      replies: 67,
      shares: 45,
      gifts: 18
    }
  ];

  const handleEditProfile = () => {
    alert('Edit profile feature coming soon!');
  };

  const handleShareProfile = () => {
    const profileUrl = `https://wegram.com/user/${profile?.username || 'demo_user'}`;
    if (navigator.share) {
      navigator.share({
        title: `${profile?.username || 'demo_user'} on WEGRAM`,
        url: profileUrl
      }).catch(() => {
        navigator.clipboard?.writeText(profileUrl);
        alert('Profile link copied to clipboard!');
      });
    } else {
      navigator.clipboard?.writeText(profileUrl);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleAddBio = () => {
    alert('Add bio feature coming soon!');
  };

  const handleFindPeople = () => {
    alert('Find people feature coming soon!');
  };

  const handleLike = (postId: string) => {
    console.log('Liking post:', postId);
  };

  const handleGift = (postId: string) => {
    console.log('Gifting post:', postId);
    alert('🎁 Gift sent!');
  };

  const handleBookmark = (postId: string) => {
    console.log('Bookmarking post:', postId);
    alert('📖 Post bookmarked!');
  };

  const displayUsername = profile?.username || 'demo_user';
  const usernameWithoutAt = displayUsername.startsWith('@') ? displayUsername.slice(1) : displayUsername;

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-primary">{usernameWithoutAt}</h1>
          <button className={`p-1 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className={`p-1 rounded-full transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}>
            <Settings className="w-4 h-4" />
          </button>
          <button className={`p-1 rounded-full transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}>
            <UserPlus className="w-4 h-4" />
          </button>
          <button className={`p-1 rounded-full transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}>
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mb-6">
        {/* Avatar and Username */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            {/* Blue circular avatar with "D" like in the design */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              D
            </div>
            {/* Small edit icon */}
            <button className={`absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            }`}>
              <span className="text-xs">✏️</span>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-primary mb-1">@{usernameWithoutAt}</h2>
            <div className="flex items-center gap-2 text-secondary text-sm mb-3">
              <span className="text-yellow-400">✨</span>
              <span className="text-primary">Verified</span>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-primary font-bold">6</span>
                <span className="text-secondary ml-1">Posts</span>
              </div>
              <div>
                <span className="text-primary font-bold">1.2K</span>
                <span className="text-secondary ml-1">Followers</span>
              </div>
              <div>
                <span className="text-primary font-bold">834</span>
                <span className="text-secondary ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={handleEditProfile}
            className={`py-3 text-sm font-medium rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Edit profile
          </button>
          <button
            onClick={handleShareProfile}
            className={`py-3 text-sm font-medium rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Share profile
          </button>
          <button 
            onClick={() => setIsMessageModalOpen(true)}
            className={`py-3 text-sm font-medium rounded-lg flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 text-sm">
          <button
            onClick={handleAddBio}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            + Add bio
          </button>
          <span className="text-secondary">•</span>
          <button
            onClick={handleFindPeople}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            + Find people
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex border-b mb-4 ${
        isDark ? 'border-gray-700' : 'border-gray-300'
      }`}>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-center transition-colors relative ${
            activeTab === 'posts' ? 'text-primary' : 'text-secondary'
          }`}
        >
          <Grid3X3 className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm font-medium">Posts</span>
          {activeTab === 'posts' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-3 text-center transition-colors relative ${
            activeTab === 'media' ? 'text-primary' : 'text-secondary'
          }`}
        >
          <Play className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm font-medium">Media</span>
          {activeTab === 'media' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex-1 py-3 text-center transition-colors relative ${
            activeTab === 'tagged' ? 'text-primary' : 'text-secondary'
          }`}
        >
          <Camera className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm font-medium">Tagged</span>
          {activeTab === 'tagged' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
          )}
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onGift={handleGift}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Grid3X3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-primary font-semibold mb-2">No posts yet</h3>
              <p className="text-secondary text-sm mb-4">Share your first post to get started</p>
              <button 
                onClick={() => alert('Create post feature coming soon!')}
                className="btn-primary px-6 py-2"
              >
                Create Post
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="text-center py-12">
          <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-primary font-semibold mb-2">No media yet</h3>
          <p className="text-secondary text-sm">Your photos and videos will appear here</p>
        </div>
      )}

      {activeTab === 'tagged' && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-primary font-semibold mb-2">No tagged posts</h3>
          <p className="text-secondary text-sm">Posts you're tagged in will appear here</p>
        </div>
      )}
      
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientUsername={profile?.username || 'demo_user'}
      />
    </div>
  );
};