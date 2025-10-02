import React, { useState, useMemo } from 'react';
import { ArrowLeft, MoreHorizontal, CheckCircle, XCircle, Flag, Share, Twitter, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MessageModal } from '../components/Layout/MessageModal';
import { PostCard } from '../components/Post/PostCard';
import { mockPosts } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

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
  const { profile, twitterUser } = useAuth();

  // Use real Twitter data if available, otherwise fallback to mock
  const user = profile ? {
    id: profile.id,
    username: profile.username.startsWith('@') ? profile.username : `@${profile.username}`,
    displayName: profile.username.replace('@', ''),
    avatar: profile.avatar_url,
    avatarInitial: profile.username.charAt(0).toUpperCase(),
    verified: profile.verified,
    bio: profile.bio || 'Twitter user on WEGRAM',
    followers: profile.followers_count || 0,
    following: profile.following_count || 0,
    posts: profile.posts_count || 0,
    isFollowing: false,
    connections: [],
    mutualConnections: 0
  } : mockLoggedInUser;

  // Memoize posts to avoid re-rendering
  const posts = useMemo(() => mockUserPosts, []);

  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Intentionally do nothing
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
            {user.avatar && user.avatar.startsWith('http') ? (
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
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{user.followers.toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWERS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{user.following.toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWING</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{user.posts}</div>
              <div className="text-secondary text-xs">POSTS</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-primary text-sm leading-relaxed">{user.bio}</p>
          </div>

          {/* Connections */}
          {user.connections && user.connections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-primary font-semibold mb-3">Connections</h3>
              <div className="flex flex-wrap gap-3">
                {user.connections.map((connection, index) => (
                  <a
                    key={index}
                    href={connection.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-overlay-light text-secondary text-sm hover:bg-overlay-medium transition-colors"
                  >
                    {connection.platform === 'Twitter' && <Twitter className="w-4 h-4" />}
                    {connection.platform === 'Instagram' && <Instagram className="w-4 h-4" />}
                    {connection.platform === 'LinkedIn' && <Linkedin className="w-4 h-4" />}
                    {connection.platform === 'Discord' && <MessageCircle className="w-4 h-4" />}
                    <span>{connection.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

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
    </div>
  );
};