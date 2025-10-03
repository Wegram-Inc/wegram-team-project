import React, { useState, useMemo } from 'react';
import { ArrowLeft, MoreHorizontal, CheckCircle, XCircle, Flag, Share, Twitter, Instagram, Linkedin, MessageCircle, ExternalLink, Camera, X, Edit3, Trash2, Plus } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'posts' | 'nft' | 'stats'>('posts');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<{platform: string, url: string} | null>(null);
  const { profile, updateProfile } = useNeonAuth();
  const { posts: allPosts } = useNeonPosts();

  // Use real Twitter data if available, otherwise fallback to mock
  const user = profile ? {
    id: profile.id,
    username: profile.username.startsWith('@') ? profile.username : `@${profile.username}`,
    displayName: profile.username.replace('@', ''),
    avatar: profile.avatar_url,
    avatarInitial: profile.username.charAt(0).toUpperCase(),
    verified: profile.verified,
    bio: profile.bio || 'Twitter user on WEGRAM',
    // WEGRAM followers/following (from our database - starts at 0)
    wegramFollowers: 0, // TODO: Get from database
    wegramFollowing: 0, // TODO: Get from database
    // Twitter followers (from Twitter API)
    twitterFollowers: profile.followers_count || 0,
    twitterUsername: profile.twitter_username || profile.username.replace('@', ''),
    posts: profile.posts_count || 0,
    isFollowing: false,
    connections: [
      ...(profile.twitter_url ? [{ platform: 'X', url: profile.twitter_url }] : []),
      ...(profile.discord_url ? [{ platform: 'Discord', url: profile.discord_url }] : []),
      ...(profile.telegram_url ? [{ platform: 'Telegram', url: profile.telegram_url }] : [])
    ],
    mutualConnections: 0
  } : {
    ...mockLoggedInUser,
    wegramFollowers: 0,
    wegramFollowing: 0,
    twitterFollowers: mockLoggedInUser.followers,
    twitterUsername: 'demo_user'
  };

  // Filter posts to show only current user's posts
  const posts = useMemo(() => {
    if (!profile?.id) return mockUserPosts;
    return allPosts.filter(post => post.user_id === profile.id);
  }, [allPosts, profile?.id]);

  // Social Link Management Functions
  const openSocialModal = (platform: string, existingUrl?: string) => {
    setEditingSocial({ platform, url: existingUrl || '' });
    setSocialModalOpen(true);
  };

  const saveSocialLink = async (url: string) => {
    if (!profile || !editingSocial) return;
    
    setIsUpdating(true);
    try {
      const updateData: any = {
        bio: profile?.bio,
        avatar_url: profile?.avatar_url
      };
      
      // Update the specific social platform URL
      if (editingSocial.platform === 'X') {
        updateData.twitter_url = url;
      } else if (editingSocial.platform === 'Discord') {
        updateData.discord_url = url;
      } else if (editingSocial.platform === 'Telegram') {
        updateData.telegram_url = url;
      }

      const result = await updateProfile(updateData);
      if (result.success) {
        setSocialModalOpen(false);
        setEditingSocial(null);
      }
    } catch (error) {
      console.error('Error saving social link:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteSocialLink = async (platform: string) => {
    if (!profile) return;
    
    setIsUpdating(true);
    try {
      const updateData: any = {
        bio: profile?.bio,
        avatar_url: profile?.avatar_url
      };
      
      // Clear the specific social platform URL
      if (platform === 'X') {
        updateData.twitter_url = '';
      } else if (platform === 'Discord') {
        updateData.discord_url = '';
      } else if (platform === 'Telegram') {
        updateData.telegram_url = '';
      }

      await updateProfile(updateData);
    } catch (error) {
      console.error('Error deleting social link:', error);
    } finally {
      setIsUpdating(false);
    }
  };
    e.preventDefault();
    e.stopPropagation();
    // Initialize edit form with current data
    setEditBio(user.bio || '');
    setEditAvatar(user.avatar || '');
    setShowEditModal(true);
  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Initialize edit form with current data
    setEditBio(user.bio || '');
    setEditAvatar(user.avatar || '');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setIsUpdating(true);
    try {
      console.log('🔄 Updating profile with:', { bio: editBio, avatar_url: editAvatar });
      
      // Update profile using the auth hook
      const result = await updateProfile({
        bio: editBio,
        avatar_url: editAvatar
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onGift={handleGift}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        );
      
      case 'nft':
        return (
          <div className="space-y-4">
            {mockNFTs.map(nft => (
              <div key={nft.id} className="card p-4">
                <div className="flex gap-4">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-primary font-semibold">{nft.name}</h3>
                    <p className="text-secondary text-sm">{nft.collection}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <span className="text-xs text-secondary">Floor</span>
                        <p className="text-primary font-medium">{nft.floorPrice}</p>
                      </div>
                      <div>
                        <span className="text-xs text-secondary">Value</span>
                        <p className="text-primary font-medium">{nft.value}</p>
                      </div>
                      <div>
                        <span className="text-xs text-secondary">Rarity</span>
                        <p className="text-accent font-medium">{nft.rarity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="text-primary font-semibold mb-4">Engagement Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2.4K</div>
                  <div className="text-secondary text-sm">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">156</div>
                  <div className="text-secondary text-sm">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">89</div>
                  <div className="text-secondary text-sm">Shares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">45</div>
                  <div className="text-secondary text-sm">Gifts</div>
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="text-primary font-semibold mb-4">Content Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Best Performing Post</span>
                  <span className="text-primary font-medium">234 likes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Average Engagement</span>
                  <span className="text-primary font-medium">12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Posts This Month</span>
                  <span className="text-primary font-medium">8</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowEditModal(false)}
          />

          {/* Modal */}
          <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-4"
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
            {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {user.avatarInitial || user.avatar}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold gradient-text">{user.displayName}</h2>
                {user.verified && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
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
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* WEGRAM Followers */}
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{user.wegramFollowers.toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWERS</div>
            </div>
            
            {/* WEGRAM Following */}
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{user.wegramFollowing.toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWING</div>
            </div>
            
            {/* Twitter Followers - Clickable */}
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
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-primary text-sm leading-relaxed">{user.bio}</p>
          </div>

          {/* Social Links */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-primary text-sm font-semibold">🔗 Social Links</span>
                <span className="text-secondary text-xs">({[profile?.twitter_url, profile?.discord_url, profile?.telegram_url].filter(Boolean).length}/3)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {/* X (Twitter) */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary">X (Twitter)</div>
                    <div className="text-xs text-secondary">
                      {profile?.twitter_url ? 
                        (profile.twitter_url.length > 30 ? `${profile.twitter_url.substring(0, 30)}...` : profile.twitter_url) 
                        : 'Not added yet'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {profile?.twitter_url ? (
                    <>
                      <button
                        onClick={() => window.open(profile.twitter_url, '_blank')}
                        className="p-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openSocialModal('X', profile.twitter_url)}
                        className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        title="Edit link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSocialLink('X')}
                        className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openSocialModal('X')}
                      className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      title="Add X link"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Discord */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary">Discord</div>
                    <div className="text-xs text-secondary">
                      {profile?.discord_url ? 
                        (profile.discord_url.length > 30 ? `${profile.discord_url.substring(0, 30)}...` : profile.discord_url) 
                        : 'Not added yet'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {profile?.discord_url ? (
                    <>
                      <button
                        onClick={() => window.open(profile.discord_url, '_blank')}
                        className="p-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openSocialModal('Discord', profile.discord_url)}
                        className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        title="Edit link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSocialLink('Discord')}
                        className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openSocialModal('Discord')}
                      className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      title="Add Discord link"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Telegram */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-secondary">Telegram</div>
                    <div className="text-xs text-secondary">
                      {profile?.telegram_url ? 
                        (profile.telegram_url.length > 30 ? `${profile.telegram_url.substring(0, 30)}...` : profile.telegram_url) 
                        : 'Not added yet'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {profile?.telegram_url ? (
                    <>
                      <button
                        onClick={() => window.open(profile.telegram_url, '_blank')}
                        className="p-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openSocialModal('Telegram', profile.telegram_url)}
                        className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        title="Edit link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSocialLink('Telegram')}
                        className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openSocialModal('Telegram')}
                      className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      title="Add Telegram link"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
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
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'stats' ? 'text-accent border-b-2 border-accent' : 'text-secondary hover:text-primary'
              }`}
            >
              Stats
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
      />

      {/* Social Link Edit Modal */}
      {socialModalOpen && editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSocialModalOpen(false)}
          />
          
          {/* Modal */}
          <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-4"
            style={{ backgroundColor: 'var(--card)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-primary">
                {editingSocial.url ? 'Edit' : 'Add'} {editingSocial.platform} Link
              </h2>
              <button
                onClick={() => setSocialModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-primary font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={editingSocial.url}
                  onChange={(e) => setEditingSocial({...editingSocial, url: e.target.value})}
                  placeholder={
                    editingSocial.platform === 'X' ? 'https://x.com/username' :
                    editingSocial.platform === 'Discord' ? 'https://discord.gg/server' :
                    'https://t.me/username'
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSocialModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-secondary rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveSocialLink(editingSocial.url)}
                  disabled={isUpdating || !editingSocial.url.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};