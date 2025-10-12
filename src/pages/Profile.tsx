import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, CheckCircle, XCircle, Flag, Share, Twitter, Instagram, Linkedin, MessageCircle, ExternalLink, Camera, X, BarChart3, Heart, Users, Bookmark, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MessageModal } from '../components/Layout/MessageModal';
import { PostCard } from '../components/Post/PostCard';
import { mockPosts } from '../data/mockData';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { useNeonPosts } from '../hooks/useNeonPosts';

// Mock user data for the logged-in user
const mockLoggedInUser = {
  id: '1',
  username: '@demo_user',
  displayName: 'Demo User',
  avatar: null,
  avatarInitial: 'D',
  verified: true,
  bio: 'Web3 enthusiast building the future of social media. Love creating content about blockchain, DeFi, and the decentralized web. Always learning, always building! 🚀',
  followers: 1234,
  following: 567,
  posts: 42,
  isFollowing: false, // This is our own profile, so we're not following ourselves
  connections: [
    { platform: 'Twitter', url: 'https://twitter.com/demouser' },
    { platform: 'Instagram', url: 'https://instagram.com/demouser' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/demouser' },
    { platform: 'Discord', url: 'https://discord.gg/demouser' }
  ],
  mutualConnections: 12
};

// Mock NFT data
const mockNFTs = [
  {
    id: '1',
    name: 'Crypto Punk #1234',
    collection: 'CryptoPunks',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe4cb4?w=400&h=400&fit=crop',
    floorPrice: '45.2 ETH',
    value: '$89,450',
    rarity: 'Legendary'
  },
  {
    id: '2',
    name: 'Bored Ape #5678',
    collection: 'Bored Ape Yacht Club',
    image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=400&fit=crop',
    floorPrice: '12.8 ETH',
    value: '$25,600',
    rarity: 'Epic'
  },
  {
    id: '3',
    name: 'Cool Cat #9999',
    collection: 'Cool Cats',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe4cb4?w=400&h=400&fit=crop',
    floorPrice: '2.1 ETH',
    value: '$4,200',
    rarity: 'Rare'
  }
];

// Mock posts data
const mockUserPosts = [
  {
    id: '1',
    userId: mockLoggedInUser.id,
    username: mockLoggedInUser.username,
    content: 'Just hit my first 1000 followers on WEGRAM! 🚀 Thanks everyone for the support. The Web3 social revolution is here!',
    timestamp: '2h',
    likes: 89,
    replies: 23,
    shares: 12,
    gifts: 5
  },
  {
    id: '2',
    userId: mockLoggedInUser.id,
    username: mockLoggedInUser.username,
    content: 'Building in Web3 is incredible. Every day brings new possibilities. WEGRAM is changing how we think about social media 💎',
    timestamp: '1d',
    likes: 156,
    replies: 45,
    shares: 28,
    gifts: 12
  },
  {
    id: '3',
    userId: mockLoggedInUser.id,
    username: mockLoggedInUser.username,
    content: 'GM Web3 fam! ☀️ Another day, another opportunity to earn while we socialize. Love this community!',
    timestamp: '2d',
    likes: 67,
    replies: 18,
    shares: 9,
    gifts: 3
  }
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'nft'>('posts');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editTwitterLink, setEditTwitterLink] = useState('');
  const [editDiscordLink, setEditDiscordLink] = useState('');
  const [editTelegramLink, setEditTelegramLink] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { profile, updateProfile } = useNeonAuth();
  const { posts: userPosts, loading: postsLoading, fetchUserPosts, deletePost } = useNeonPosts();

  // Use real user data only - NO MOCK FALLBACKS
  const user = profile ? {
    id: profile.id,
    username: profile.username.startsWith('@') ? profile.username : `@${profile.username}`,
    displayName: profile.username.replace('@', ''),
    avatar: profile.avatar_url,
    avatarInitial: profile.username.charAt(0).toUpperCase(),
    verified: profile.verified,
    bio: profile.bio || 'Twitter user on WEGRAM',
    // Social media links (with fallbacks for when columns don't exist yet)
    twitterLink: profile.twitter_link || null,
    discordLink: profile.discord_link || null,
    telegramLink: profile.telegram_link || null,
    // WEGRAM followers/following (from our database)
    wegramFollowers: profile.followers_count || 0,
    wegramFollowing: profile.following_count || 0,
    // Twitter followers (from Twitter API)
    twitterFollowers: profile.followers_count || 0,
    twitterUsername: profile.twitter_username || profile.username.replace('@', ''),
    posts: profile.posts_count || 0,
    isFollowing: false,
    connections: [],
    mutualConnections: 0
  } : null;

  // Load user posts when profile is available
  React.useEffect(() => {
    if (profile?.id) {
      fetchUserPosts(profile.id);
    }
  }, [profile?.id]);

  // Use real posts only - NO FALLBACKS TO MOCK DATA
  const posts = useMemo(() => {
    if (!profile?.id) return [];

    // Convert real posts to the format expected by PostCard
    const formattedPosts = userPosts.map(post => ({
      id: post.id,
      userId: post.user_id,
      username: `@${post.username}`,
      content: post.content,
      image_url: post.image_url,
      timestamp: new Date(post.created_at).toLocaleDateString(),
      likes: post.likes,
      replies: post.replies,
      shares: post.shares,
      gifts: post.gifts || 0,
      avatar_url: post.avatar_url,
      verified: post.verified
    }));

    return formattedPosts;
  }, [userPosts, profile?.id]);

  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Initialize edit form with current data
    setEditBio(user.bio || '');
    setEditAvatar(user.avatar || '');
    setEditTwitterLink(user.twitterLink || '');
    setEditDiscordLink(user.discordLink || '');
    setEditTelegramLink(user.telegramLink || '');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setIsUpdating(true);
    try {
      console.log('🔄 Updating profile with:', {
        bio: editBio,
        avatar_url: editAvatar,
        twitter_link: editTwitterLink,
        discord_link: editDiscordLink,
        telegram_link: editTelegramLink
      });

      // Update profile using the auth hook with social media links
      const result = await updateProfile({
        bio: editBio,
        avatar_url: editAvatar,
        twitter_link: editTwitterLink,
        discord_link: editDiscordLink,
        telegram_link: editTelegramLink
      });

      console.log('✅ Update result:', result);

      if (result.success) {
        setShowEditModal(false);
        // Profile state is automatically updated by the hook
        alert('✅ Profile updated successfully!');
      } else {
        alert(`❌ Failed to update profile:\n${result.error || 'Unknown error'}\n\nCheck browser console for details.`);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll use a simple file reader to convert to base64
      // In production, you'd upload to a service like Cloudinary or AWS S3
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileMenu = () => {
    setShowActionMenu(!showActionMenu);
  };

  const handleActionMenuClose = () => {
    setShowActionMenu(false);
  };

  const handleNotInterested = () => {
    setShowActionMenu(false);
    console.log('Not interested in this profile');
  };

  const handleReport = () => {
    setShowActionMenu(false);
    console.log('Report this profile');
  };

  const handleShareProfile = () => {
    setShowActionMenu(false);
    const profileUrl = `https://wegram.com/user/${user.username}`;
    if (navigator.share) {
      navigator.share({
        title: `${user.displayName} on WEGRAM`,
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        if (postsLoading) {
          return (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-secondary text-sm mt-2">Loading posts...</p>
            </div>
          );
        }

        if (posts.length === 0 && !postsLoading) {
          return (
            <div className="text-center py-8">
              <p className="text-secondary text-sm">No posts yet</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onGift={handleGift}
                onBookmark={handleBookmark}
                onDelete={handleDelete}
              />
            ))}
          </div>
        );
      
      case 'nft':
        return (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <div className="text-3xl">🎨</div>
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Coming Soon</h3>
            <p className="text-secondary text-sm max-w-xs mx-auto leading-relaxed">
              NFT collection display is being developed. Soon you'll be able to showcase your digital art and collectibles here!
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Show loading or redirect if no user
  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="text-primary text-lg mb-2">Loading profile...</div>
          <div className="text-secondary text-sm">Please sign in to view your profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Action Menu Popup */}
      {showActionMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleActionMenuClose}
          />

          {/* Menu */}
          <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden min-w-[280px] max-w-[320px] mx-4"
            style={{ backgroundColor: 'var(--card)' }}
          >
            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleNotInterested}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-900 dark:text-white font-medium">Not Interested</span>
              </button>

              <button
                onClick={handleReport}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                <Flag className="w-5 h-5 text-orange-500" />
                <span className="text-gray-900 dark:text-white font-medium">Report</span>
              </button>

              <button
                onClick={handleShareProfile}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                <Share className="w-5 h-5 text-blue-500" />
                <span className="text-gray-900 dark:text-white font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowEditModal(false)}
          />

          {/* Modal */}
          <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 my-8 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--card)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-primary">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  {editAvatar && editAvatar.startsWith('http') || editAvatar.startsWith('data:') ? (
                    <img 
                      src={editAvatar} 
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl mx-auto">
                      {user.avatarInitial || user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-secondary text-sm mt-2">Click camera to change photo</p>
              </div>

              {/* Bio Input */}
              <div>
                <label className="block text-primary font-medium mb-2">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell people about yourself..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary resize-none"
                  rows={4}
                  maxLength={160}
                />
                <p className="text-secondary text-xs mt-1">{editBio.length}/160 characters</p>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-primary font-semibold">Social Links</h3>
                  <div className="h-px bg-gradient-to-r from-purple-500 to-blue-500 flex-1 opacity-30"></div>
                </div>

                {/* Twitter/X Link */}
                <div className="group">
                  <label className="block text-primary text-sm font-medium mb-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-black dark:bg-white p-0.5 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    X (Twitter)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={editTwitterLink}
                      onChange={(e) => setEditTwitterLink(e.target.value)}
                      placeholder="https://x.com/yourusername"
                      className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔗
                    </div>
                  </div>
                </div>

                {/* Discord Link */}
                <div className="group">
                  <label className="block text-primary text-sm font-medium mb-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-indigo-500 p-0.5 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                      </svg>
                    </div>
                    Discord
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={editDiscordLink}
                      onChange={(e) => setEditDiscordLink(e.target.value)}
                      placeholder="https://discord.gg/yourinvite"
                      className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔗
                    </div>
                  </div>
                </div>

                {/* Telegram Link */}
                <div className="group">
                  <label className="block text-primary text-sm font-medium mb-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500 p-0.5 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    Telegram
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={editTelegramLink}
                      onChange={(e) => setEditTelegramLink(e.target.value)}
                      placeholder="https://t.me/yourusername"
                      className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔗
                    </div>
                  </div>
                </div>

                {/* Helper Text */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Pro Tip</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Add your social links to help others connect with you across platforms</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-secondary rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--bg)' }}>
        <button
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary flex-1">{user.displayName}</h1>
      </div>

      <div className="max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
        {/* Profile Header */}
        <div className="px-4 py-6">
          {/* Avatar and Name */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.avatarInitial || user.avatar}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold gradient-text">{user.displayName}</h2>
                {user.verified && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-secondary text-sm mb-3">{user.username}</p>
              
              {/* Action Icons - 3 dots only (no gift for own profile) */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleProfileMenu}
                  className="w-8 h-8 rounded-full bg-overlay-light flex items-center justify-center"
                >
                  <MoreHorizontal className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>
            
            {/* Edit Profile Button - positioned on the right */}
            <button
              onClick={handleEditProfile}
              className="btn-primary px-6 py-2 rounded-full font-medium transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className={`grid gap-4 mb-6 ${profile.twitter_username ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {/* WEGRAM Followers */}
            <button
              onClick={() => navigate(`/user/${profile.username.replace('@', '')}/followers`)}
              className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div className="text-lg font-bold text-primary">{user.wegramFollowers.toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWERS</div>
            </button>

            {/* WEGRAM Following */}
            <button
              onClick={() => navigate(`/user/${profile.username.replace('@', '')}/following`)}
              className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div className="text-lg font-bold text-primary">{user.wegramFollowing.toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWING</div>
            </button>

            {/* Twitter Followers - Only show if user actually signed up with Twitter */}
            {profile.twitter_username && (
              <div className="text-center">
                <button
                  onClick={() => window.open(`https://twitter.com/${user.twitterUsername}`, '_blank')}
                  className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-primary">{user.twitterFollowers.toLocaleString()}</div>
                    {/* Real X Logo */}
                    <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className="text-secondary text-xs flex items-center gap-1">
                    X
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-primary text-sm leading-relaxed">{user.bio}</p>
          </div>

          {/* Social Links - Compact & Cool */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-secondary">Connect</h3>
              <button
                onClick={handleEditProfile}
                className="text-xs text-accent hover:text-purple-600 transition-colors font-medium"
              >
                Edit
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* X (Twitter) */}
              {user.twitterLink ? (
                <a
                  href={user.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black dark:bg-white hover:shadow-md hover:scale-105 transition-all duration-200">
                    <svg className="w-4 h-4 text-white dark:text-black flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-xs font-medium text-white dark:text-black truncate">X</span>
                    <ExternalLink className="w-3 h-3 text-white dark:text-black opacity-70" />
                  </div>
                </a>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-500 truncate">X</span>
                  </div>
                </button>
              )}

              {/* Discord */}
              {user.discordLink ? (
                <a
                  href={user.discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 hover:shadow-md hover:scale-105 transition-all duration-200">
                    <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    <span className="text-xs font-medium text-white truncate">Discord</span>
                    <ExternalLink className="w-3 h-3 text-white opacity-70" />
                  </div>
                </a>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.30z"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-500 truncate">Discord</span>
                  </div>
                </button>
              )}

              {/* Telegram */}
              {user.telegramLink ? (
                <a
                  href={user.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200">
                    <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span className="text-xs font-medium text-white truncate">Telegram</span>
                    <ExternalLink className="w-3 h-3 text-white opacity-70" />
                  </div>
                </a>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-500 truncate">Telegram</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Mutual Connections */}
          {user.mutualConnections > 0 && (
            <div className="mb-6">
              <h3 className="text-primary font-semibold mb-3">Mutual Connections</h3>
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(user.mutualConnections, 5) }).map((_, index) => (
                  <img
                    key={index}
                    src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`}
                    alt="Mutual connection"
                    className="w-8 h-8 rounded-full border-2 border-overlay-light"
                  />
                ))}
                {user.mutualConnections > 5 && (
                  <div className="w-8 h-8 rounded-full bg-overlay-light flex items-center justify-center border-2 border-overlay-light text-xs text-secondary">
                    +{user.mutualConnections - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="sticky top-[60px] z-40 bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'posts' ? 'text-accent border-b-2 border-accent' : 'text-secondary hover:text-primary'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('nft')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'nft' ? 'text-accent border-b-2 border-accent' : 'text-secondary hover:text-primary'
              }`}
            >
              NFT Holds
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onMessageSent={() => {
          // Message sent successfully
          console.log('Message sent successfully');
        }}
      />
    </div>
  );
};