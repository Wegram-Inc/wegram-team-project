import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Gift, CheckCircle, XCircle, Flag, Share, Mail } from 'lucide-react';
import { MessageModal } from '../components/Layout/MessageModal';
import { PostCard } from '../components/Post/PostCard';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { useNeonPosts } from '../hooks/useNeonPosts';

interface UserProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  bannerColor: string;
  joinDate: string;
  posts: number;
  followers: number;
  following: number;
  mutualConnections: number;
  isFollowing: boolean;
  verified?: boolean;
  connections: {
    platform: string;
    username: string;
    memberSince: string;
    posts: number;
    followers: number;
    verified: boolean;
  }[];
}

// Mock user data - in real app this would come from API
const getUserData = (username: string): UserProfileData => {
  const userData: { [key: string]: UserProfileData } = {
    '@alexchen': {
      username: '@alexchen.eth',
      displayName: 'Alex Chen',
      bio: 'Building the future of Web3 social 🚀 | NFT collector & DeFi enthusiast | Always learning, always creating',
      avatar: 'AC',
      bannerColor: 'from-purple-600 to-blue-600',
      joinDate: 'Jan 15, 2024',
      posts: 847,
      followers: 12500,
      following: 2100,
      mutualConnections: 12,
      isFollowing: false,
      verified: true,
      connections: [
        {
          platform: 'Twitter',
          username: '@alexchen_crypto',
          memberSince: 'May 15, 2022',
          posts: 1460,
          followers: 10200,
          verified: true
        }
      ]
    },
    '@crypto_trader': {
      username: '@crypto_trader',
      displayName: 'CryptoTrader',
      bio: 'Professional crypto trader • DeFi enthusiast • Building wealth in Web3',
      avatar: '👨‍💼',
      bannerColor: 'from-blue-600 to-purple-600',
      joinDate: 'Jan 15, 2024',
      posts: 156,
      followers: 2400,
      following: 890,
      mutualConnections: 12,
      isFollowing: false,
      connections: [
        {
          platform: 'Twitter',
          username: '@cryptotrader_pro',
          memberSince: 'May 15, 2022',
          posts: 1460,
          followers: 102,
          verified: true
        }
      ]
    },
    '@defi_expert': {
      username: '@defi_expert',
      displayName: 'DeFi Expert',
      bio: 'Yield farming specialist • Protocol researcher • Sharing alpha daily',
      avatar: '🧠',
      bannerColor: 'from-green-600 to-blue-600',
      joinDate: 'Dec 3, 2023',
      posts: 89,
      followers: 1800,
      following: 456,
      mutualConnections: 8,
      isFollowing: true,
      connections: [
        {
          platform: 'LinkedIn',
          username: 'defi-researcher',
          memberSince: 'Mar 10, 2021',
          posts: 892,
          followers: 567,
          verified: false
        }
      ]
    },
    '@nft_collector': {
      username: '@nft_collector',
      displayName: 'NFT Collector',
      bio: 'Digital art enthusiast • Collecting rare NFTs • Building the future of art',
      avatar: '🎨',
      bannerColor: 'from-purple-600 to-pink-600',
      joinDate: 'Feb 28, 2024',
      posts: 234,
      followers: 3200,
      following: 1200,
      mutualConnections: 15,
      isFollowing: false,
      connections: [
        {
          platform: 'Instagram',
          username: '@nft_art_collector',
          memberSince: 'Aug 5, 2020',
          posts: 2340,
          followers: 15600,
          verified: true
        }
      ]
    },
    '@web3_dev': {
      username: '@web3_dev',
      displayName: 'Web3 Developer',
      bio: 'Full-stack blockchain developer • Smart contract specialist • Building DeFi protocols on Solana',
      avatar: '👨‍💻',
      bannerColor: 'from-cyan-600 to-blue-600',
      joinDate: 'Mar 10, 2024',
      posts: 127,
      followers: 1850,
      following: 643,
      mutualConnections: 18,
      isFollowing: false,
      connections: []
    },
    '@crypto_whale': {
      username: '@crypto_whale',
      displayName: 'Crypto Whale',
      bio: 'Large-scale investor • Market analyst • Sharing insights on crypto trends and opportunities',
      avatar: '🐋',
      bannerColor: 'from-blue-600 to-indigo-600',
      joinDate: 'Nov 5, 2023',
      posts: 289,
      followers: 8420,
      following: 234,
      mutualConnections: 32,
      isFollowing: true,
      connections: []
    },
    '@nft_artist': {
      username: '@nft_artist',
      displayName: 'NFT Artist',
      bio: 'Digital creator • 1/1 NFT artist • Exploring the intersection of art and blockchain technology',
      avatar: '🎭',
      bannerColor: 'from-pink-600 to-purple-600',
      joinDate: 'Aug 22, 2023',
      posts: 342,
      followers: 4560,
      following: 892,
      mutualConnections: 24,
      isFollowing: false,
      connections: []
    },
    '@defi_guru': {
      username: '@defi_guru',
      displayName: 'DeFi Guru',
      bio: 'Yield farming expert • Protocol researcher • Maximizing returns in decentralized finance',
      avatar: '📊',
      bannerColor: 'from-green-600 to-emerald-600',
      joinDate: 'Sep 15, 2023',
      posts: 198,
      followers: 6340,
      following: 445,
      mutualConnections: 28,
      isFollowing: true,
      connections: []
    },
    '@blockchain_news': {
      username: '@blockchain_news',
      displayName: 'Blockchain News',
      bio: 'Breaking crypto news • Market updates • Keeping the community informed about Web3 developments',
      avatar: '📰',
      bannerColor: 'from-orange-600 to-red-600',
      joinDate: 'Jun 3, 2023',
      posts: 1247,
      followers: 12800,
      following: 156,
      mutualConnections: 45,
      isFollowing: false,
      connections: []
    },
    '@solana_builder': {
      username: '@solana_builder',
      displayName: 'Solana Builder',
      bio: 'Building on Solana • dApp developer • Passionate about fast, scalable blockchain solutions',
      avatar: '⚡',
      bannerColor: 'from-purple-600 to-violet-600',
      joinDate: 'Dec 18, 2023',
      posts: 156,
      followers: 2940,
      following: 567,
      mutualConnections: 21,
      isFollowing: true,
      connections: []
    },
    '@crypto_educator': {
      username: '@crypto_educator',
      displayName: 'Crypto Educator',
      bio: 'Teaching Web3 • Simplifying blockchain concepts • Helping newcomers navigate the crypto space',
      avatar: '🎓',
      bannerColor: 'from-blue-600 to-teal-600',
      joinDate: 'Apr 7, 2024',
      posts: 234,
      followers: 5680,
      following: 789,
      mutualConnections: 35,
      isFollowing: false,
      connections: []
    },
    '@metaverse_explorer': {
      username: '@metaverse_explorer',
      displayName: 'Metaverse Explorer',
      bio: 'Virtual world enthusiast • NFT collector • Exploring digital realms and blockchain gaming',
      avatar: '🌐',
      bannerColor: 'from-indigo-600 to-purple-600',
      joinDate: 'Jan 29, 2024',
      posts: 178,
      followers: 3420,
      following: 923,
      mutualConnections: 19,
      isFollowing: true,
      connections: []
    },
    '@mayarodriguez': {
      username: '@mayarodriguez.eth',
      displayName: 'Maya Rodriguez',
      bio: 'DeFi strategist & yield farming expert 🌾 | Building sustainable wealth in Web3 | Always exploring new protocols',
      avatar: 'MR',
      bannerColor: 'from-amber-500 to-orange-600',
      joinDate: 'Feb 3, 2024',
      posts: 423,
      followers: 8900,
      following: 1567,
      mutualConnections: 8,
      isFollowing: false,
      verified: true,
      connections: [
        {
          platform: 'Twitter',
          username: '@maya_defi',
          memberSince: 'Aug 20, 2022',
          posts: 892,
          followers: 15600,
          verified: true
        }
      ]
    },
    '@jordankim': {
      username: '@jordankim.eth',
      displayName: 'Jordan Kim',
      bio: 'Crypto investor & blockchain researcher 🔬 | Focused on Layer 2 solutions | Sharing alpha daily',
      avatar: 'JK',
      bannerColor: 'from-pink-400 to-purple-500',
      joinDate: 'Dec 18, 2023',
      posts: 156,
      followers: 4200,
      following: 892,
      mutualConnections: 15,
      isFollowing: false,
      verified: false,
      connections: [
        {
          platform: 'Twitter',
          username: '@jordan_crypto',
          memberSince: 'Mar 10, 2023',
          posts: 234,
          followers: 6800,
          verified: false
        }
      ]
    }
  };

  return userData[username] || {
    username: username,
    displayName: username.replace('@', ''),
    bio: 'Web3 enthusiast • Building the future',
    avatar: '👤',
    bannerColor: 'from-gray-600 to-gray-800',
    joinDate: 'Jan 1, 2024',
    posts: 0,
    followers: 0,
    following: 0,
    mutualConnections: 0,
    isFollowing: false,
    verified: false,
    connections: []
  };
};

// Mock feed posts personalized for each user based on their interests and following patterns
const getFeedPosts = (username: string) => {
  // Add specific dummy posts for each user
  const userSpecificPosts: { [key: string]: any[] } = {
    '@alexchen': [
      {
        id: 'alex_post_1',
        userId: 'alexchen',
        username: '@alexchen',
        content: 'Just discovered this amazing new DeFi protocol! The yield farming opportunities are incredible 🚀',
        timestamp: '2h',
        likes: 234,
        replies: 45,
        shares: 12,
        gifts: 8
      },
      {
        id: 'alex_post_2',
        userId: 'alexchen',
        username: '@alexchen',
        content: 'Building the future of Web3 social media. Excited to share what we\'ve been working on! 💎',
        timestamp: '5h',
        likes: 567,
        replies: 89,
        shares: 34,
        gifts: 15
      },
      {
        id: 'alex_post_3',
        userId: 'alexchen',
        username: '@alexchen',
        content: 'NFT market is heating up! Just minted a rare piece from the new collection 🔥',
        timestamp: '1d',
        likes: 123,
        replies: 23,
        shares: 7,
        gifts: 3
      },
      {
        id: 'alex_post_4',
        userId: 'alexchen',
        username: '@alexchen',
        content: 'Solana ecosystem is growing so fast! The developer experience is unmatched ⚡',
        timestamp: '2d',
        likes: 345,
        replies: 67,
        shares: 19,
        gifts: 11
      },
      {
        id: 'alex_post_5',
        userId: 'alexchen',
        username: '@alexchen',
        content: 'Web3 education is key to mass adoption. Sharing knowledge with the community 📚',
        timestamp: '3d',
        likes: 189,
        replies: 34,
        shares: 15,
        gifts: 6
      }
    ],
    '@mayarodriguez': [
      {
        id: 'maya_post_1',
        userId: 'mayarodriguez',
        username: '@mayarodriguez',
        content: 'Yield farming on this new protocol is absolutely insane! 45% APY with minimal risk 🚀',
        timestamp: '1h',
        likes: 156,
        replies: 23,
        shares: 8,
        gifts: 5
      },
      {
        id: 'maya_post_2',
        userId: 'mayarodriguez',
        username: '@mayarodriguez',
        content: 'DeFi education thread: Understanding impermanent loss and how to minimize it 📚',
        timestamp: '4h',
        likes: 89,
        replies: 12,
        shares: 15,
        gifts: 3
      },
      {
        id: 'maya_post_3',
        userId: 'mayarodriguez',
        username: '@mayarodriguez',
        content: 'Just staked my ETH for the next 6 months. Long-term thinking pays off 💎',
        timestamp: '1d',
        likes: 234,
        replies: 45,
        shares: 22,
        gifts: 12
      }
    ],
    '@jordankim': [
      {
        id: 'jordan_post_1',
        userId: 'jordankim',
        username: '@jordankim',
        content: 'Research deep dive: Layer 2 scaling solutions comparison. Polygon vs Arbitrum vs Optimism',
        timestamp: '2h',
        likes: 78,
        replies: 15,
        shares: 6,
        gifts: 2
      },
      {
        id: 'jordan_post_2',
        userId: 'jordankim',
        username: '@jordankim',
        content: 'Just sent 0.5 ETH to a friend. Lightning fast and cheap! This is the future of payments ⚡',
        timestamp: '6h',
        likes: 45,
        replies: 8,
        shares: 3,
        gifts: 1
      },
      {
        id: 'jordan_post_3',
        userId: 'jordankim',
        username: '@jordankim',
        content: 'Market analysis: Why I\'m bullish on Solana ecosystem projects this quarter 📈',
        timestamp: '2d',
        likes: 123,
        replies: 28,
        shares: 11,
        gifts: 7
      }
    ]
  };

  // Return user-specific posts if available, otherwise use the personalized feed
  if (userSpecificPosts[username]) {
    return userSpecificPosts[username];
  }
  // Define realistic following relationships and interests for each user
  const userInterests: { [key: string]: { following: string[], interests: string[], recommendations: string[] } } = {
    '@crypto_trader': {
      following: ['@defi_guru', '@crypto_whale', '@blockchain_news', '@solana_builder'],
      interests: ['trading', 'market_analysis', 'defi', 'solana'],
      recommendations: ['@crypto_educator', '@web3_dev']
    },
    '@defi_expert': {
      following: ['@crypto_whale', '@solana_builder', '@crypto_educator', '@web3_dev'],
      interests: ['defi', 'yield_farming', 'protocols', 'solana'],
      recommendations: ['@blockchain_news', '@crypto_trader']
    },
    '@nft_collector': {
      following: ['@nft_artist', '@metaverse_explorer', '@crypto_whale', '@crypto_educator'],
      interests: ['nft', 'art', 'metaverse', 'collecting'],
      recommendations: ['@blockchain_news', '@defi_guru']
    },
    '@web3_dev': {
      following: ['@solana_builder', '@defi_guru', '@crypto_educator', '@crypto_whale'],
      interests: ['development', 'solana', 'defi', 'smart_contracts'],
      recommendations: ['@blockchain_news', '@nft_artist']
    },
    '@crypto_whale': {
      following: ['@defi_guru', '@blockchain_news', '@crypto_educator', '@solana_builder'],
      interests: ['investment', 'institutional', 'defi', 'market_analysis'],
      recommendations: ['@crypto_trader', '@web3_dev']
    },
    '@nft_artist': {
      following: ['@nft_collector', '@metaverse_explorer', '@crypto_whale', '@crypto_educator'],
      interests: ['art', 'nft', 'metaverse', 'creativity'],
      recommendations: ['@blockchain_news', '@defi_guru']
    },
    '@defi_guru': {
      following: ['@crypto_whale', '@solana_builder', '@crypto_educator', '@web3_dev'],
      interests: ['defi', 'yield_farming', 'protocols', 'education'],
      recommendations: ['@crypto_trader', '@blockchain_news']
    },
    '@blockchain_news': {
      following: ['@crypto_whale', '@defi_guru', '@solana_builder', '@crypto_educator'],
      interests: ['news', 'analysis', 'institutional', 'adoption'],
      recommendations: ['@crypto_trader', '@web3_dev']
    },
    '@solana_builder': {
      following: ['@web3_dev', '@defi_guru', '@crypto_educator', '@crypto_whale'],
      interests: ['solana', 'development', 'defi', 'ecosystem'],
      recommendations: ['@blockchain_news', '@crypto_trader']
    },
    '@crypto_educator': {
      following: ['@defi_guru', '@crypto_whale', '@web3_dev', '@solana_builder'],
      interests: ['education', 'tutorials', 'defi', 'blockchain'],
      recommendations: ['@nft_artist', '@metaverse_explorer']
    },
    '@metaverse_explorer': {
      following: ['@nft_artist', '@nft_collector', '@crypto_whale', '@crypto_educator'],
      interests: ['metaverse', 'nft', 'virtual_worlds', 'art'],
      recommendations: ['@blockchain_news', '@defi_guru']
    }
  };

  // Generate personalized feed based on user's interests and following
  const generatePersonalizedFeed = (username: string) => {
    const userProfile = userInterests[username];
    if (!userProfile) return [];

    const allUsers = [
      '@crypto_trader', '@defi_expert', '@nft_collector', '@web3_dev', '@crypto_whale',
      '@nft_artist', '@defi_guru', '@blockchain_news', '@solana_builder', '@crypto_educator', '@metaverse_explorer'
    ];

    const feed = [];
    let postId = 1;

    // Add posts from users they follow (70% of feed)
    userProfile.following.forEach(followedUser => {
      const posts = generatePostsForUser(followedUser, userProfile.interests, 2);
      feed.push(...posts.map(post => ({ ...post, id: `${username}_feed${postId++}`, isFollowing: true })));
    });

    // Add posts from recommended users (20% of feed)
    userProfile.recommendations.forEach(recUser => {
      const posts = generatePostsForUser(recUser, userProfile.interests, 1);
      feed.push(...posts.map(post => ({ ...post, id: `${username}_feed${postId++}`, isFollowing: false })));
    });

    // Add posts from other users based on interests (10% of feed)
    const otherUsers = allUsers.filter(u => 
      !userProfile.following.includes(u) && 
      !userProfile.recommendations.includes(u) && 
      u !== username
    );
    const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
    const posts = generatePostsForUser(randomUser, userProfile.interests, 1);
    feed.push(...posts.map(post => ({ ...post, id: `${username}_feed${postId++}`, isFollowing: false })));

    return feed.sort(() => Math.random() - 0.5); // Shuffle the feed
  };

  // Generate posts for a specific user based on interests
  const generatePostsForUser = (username: string, interests: string[], count: number) => {
    const postTemplates = {
      '@crypto_trader': [
        '📊 Trading signals: {interest} showing strong momentum! Perfect entry point for swing traders.',
        '📈 Market update: {interest} breaking resistance levels. Time to position for the next move!',
        '💰 Portfolio update: {interest} positions performing well. Risk management is key!'
      ],
      '@defi_guru': [
        '💎 DeFi yield opportunities: New {interest} pools offering 15% APY!',
        '🔧 Yield farming strategies for {interest}: Compound interest is the 8th wonder!',
        '⚡ {interest} protocol upgrade: Lower fees, higher rewards!'
      ],
      '@crypto_whale': [
        '🐋 Large {interest} accumulation detected! Smart money is positioning.',
        '💎 Institutional adoption of {interest} accelerating! The floodgates are opening.',
        '📊 Market analysis: {interest} showing institutional interest patterns.'
      ],
      '@nft_artist': [
        '🎨 New {interest} collection dropping! Each piece tells a story of digital revolution.',
        '🌐 {interest} art in the metaverse! The 3D environment brings it to life.',
        '💎 {interest} NFT sales hitting new highs! Digital art is becoming mainstream.'
      ],
      '@nft_collector': [
        '🎨 Just acquired a rare {interest} piece! The floor price keeps climbing.',
        '🌐 Virtual {interest} gallery opening! Come check out the latest collections.',
        '💎 {interest} market is heating up! Digital real estate is the future.'
      ],
      '@web3_dev': [
        '🚀 Just deployed a {interest} smart contract! The future is decentralized.',
        '⚡ {interest} development is incredible! Built a full dApp in just 2 days.',
        '🔧 New {interest} protocol audit completed! Security is paramount.'
      ],
      '@solana_builder': [
        '⚡ Solana {interest} development is so smooth! The ecosystem is thriving.',
        '🚀 Built a new {interest} protocol on Solana! Low fees make it perfect.',
        '📊 {interest} on Solana: Network upgrade successful! Speeds increased 40%.'
      ],
      '@crypto_educator': [
        '📚 {interest} education thread: Understanding the fundamentals is key!',
        '🎓 {interest} tutorial: Making complex concepts accessible to everyone.',
        '💡 {interest} knowledge is power! Education drives adoption.'
      ],
      '@blockchain_news': [
        '📰 Breaking: Major {interest} development announced! This could be a game-changer.',
        '🔥 {interest} adoption accelerating! Major corporations are entering the space.',
        '📈 {interest} market analysis: The next bull run could be driven by innovation.'
      ],
      '@metaverse_explorer': [
        '🌐 Exploring {interest} in virtual worlds! The metaverse is becoming reality.',
        '🎨 {interest} art looks incredible in 3D space! The immersive experience is next-level.',
        '💎 {interest} real estate is heating up! Virtual land prices are skyrocketing.'
      ]
    };

    const templates = postTemplates[username as keyof typeof postTemplates] || [
      '🚀 Exciting {interest} development! The future is bright.',
      '💎 {interest} showing strong potential! Time to pay attention.',
      '📊 {interest} analysis: The data looks promising!'
    ];

    const posts = [];
    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const interest = interests[Math.floor(Math.random() * interests.length)];
      const content = template.replace('{interest}', interest);
      
      posts.push({
        userId: username.replace('@', ''),
        username: username,
        content: content,
        timestamp: `${Math.floor(Math.random() * 12) + 1}h`,
        likes: Math.floor(Math.random() * 500) + 50,
        replies: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 50) + 5,
        gifts: Math.floor(Math.random() * 30) + 2
      });
    }
    return posts;
  };

  const userFeeds: { [key: string]: any[] } = {
    '@crypto_trader': generatePersonalizedFeed('@crypto_trader'),
    '@defi_expert': generatePersonalizedFeed('@defi_expert'),
    '@nft_collector': generatePersonalizedFeed('@nft_collector'),
    '@web3_dev': generatePersonalizedFeed('@web3_dev'),
    '@crypto_whale': generatePersonalizedFeed('@crypto_whale'),
    '@nft_artist': generatePersonalizedFeed('@nft_artist'),
    '@defi_guru': generatePersonalizedFeed('@defi_guru'),
    '@blockchain_news': generatePersonalizedFeed('@blockchain_news'),
    '@solana_builder': generatePersonalizedFeed('@solana_builder'),
    '@crypto_educator': generatePersonalizedFeed('@crypto_educator'),
    '@metaverse_explorer': generatePersonalizedFeed('@metaverse_explorer')
  };

  return userFeeds[username] || [];
};


export const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile: currentUser } = useNeonAuth();
  const { deletePost } = useNeonPosts();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'nft'>('posts');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real user data from API
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/user-profile?username=${encodeURIComponent(username)}`);
        const result = await response.json();
        
        if (response.ok && result.user) {
          setUser(result.user);
          setUserPosts(result.posts || []);
          
          // Check if current user is following this user
          if (currentUser && result.user.id !== currentUser.id) {
            const followResponse = await fetch(`/api/follow?follower_id=${currentUser.id}&following_id=${result.user.id}`);
            const followResult = await followResponse.json();
            setIsFollowing(followResult.isFollowing || false);
          }
        } else {
          // Fallback to mock data if user not found in database
          const mockUser = getUserData(`@${username}`);
          setUser(mockUser);
          setUserPosts([]);
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockUser = getUserData(`@${username}`);
        setUser(mockUser);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser]);

  // Memoize the feed posts to prevent regeneration on every render
  const feedPosts = useMemo(() => {
    return getFeedPosts(`@${username}`);
  }, [username]);
  
  // Get the original profile from navigation state
  // This tracks the first profile clicked from home
  const originalProfile = location.state?.originalProfile;
  
  // Check if we came from chat page
  const isFromChat = location.state?.fromChat;
  
  // If no originalProfile is set, this means we came directly from home
  const isFirstProfileFromHome = !originalProfile;
  
  // Determine where the back button should go
  const getBackDestination = () => {
    if (isFromChat) {
      // If we came from chat, go back to chat
      return { path: '/messages', state: null };
    } else if (isFirstProfileFromHome) {
      // If this is the first profile clicked from home, go back to home
      return { path: '/home', state: null };
    } else {
      // If we came from another profile, go back to that original profile
      // The original profile should go back to home (not create a fake home profile)
      return { 
        path: `/user/${originalProfile}`, 
        state: null // No state, so it will be treated as first profile from home
      };
    }
  };

  // Check if back button should be enabled
  // Back button should only work if:
  // 1. This is the first profile from home (can go back to home)
  // 2. This is a subsequent profile (can go back to original profile)
  // 3. This is from chat (can go back to chat)
  const canGoBack = isFirstProfileFromHome || originalProfile || isFromChat;
  
  if (!username) {
    navigate('/home');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary">User not found</p>
        </div>
      </div>
    );
  }

  const handleFollow = async () => {
    if (!currentUser) {
      alert('Please log in to follow users');
      return;
    }

    if (!user.id) {
      alert('Cannot follow this user');
      return;
    }

    setIsLoading(true);
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch('/api/follow', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_id: currentUser.id,
          following_id: user.id
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsFollowing(!isFollowing);
        // Update follower count in the user object
        setUser(prev => ({
          ...prev,
          followers_count: isFollowing 
            ? prev.followers_count - 1 
            : prev.followers_count + 1
        }));
      } else {
        alert(result.error || 'Failed to update follow status');
      }
    } catch (error) {
      alert('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = () => {
    // Navigate to direct message with this user
    navigate(`/dm/${username.replace('@', '')}`);
  };


  const handleLike = async (postId: string) => {
    console.log('Liking post:', postId);
    // Add like functionality here
  };

  const handleGift = async (postId: string) => {
    console.log('Gifting post:', postId);
    // Add gift functionality here
  };

  const handleBookmark = async (postId: string) => {
    console.log('Bookmarking post:', postId);
    // Add bookmark functionality here
  };

  const handleReply = async (postId: string) => {
    console.log('Replying to post:', postId);
    // Add reply functionality here
  };

  const handleShare = async (postId: string) => {
    console.log('Sharing post:', postId);
    // Add share functionality here
  };

  const handleDelete = async (postId: string) => {
    if (!currentUser?.id) {
      alert('Please sign in to delete posts');
      return;
    }

    const result = await deletePost(postId, currentUser.id);
    if (result.error) {
      alert(`Failed to delete post: ${result.error}`);
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
    // TODO: Implement not interested functionality
    console.log('Not interested in this profile');
  };

  const handleReport = () => {
    setShowActionMenu(false);
    // TODO: Implement report functionality
    console.log('Report this profile');
  };

  const handleShareProfile = () => {
    setShowActionMenu(false);
    // TODO: Implement share functionality
    console.log('Share this profile');
  };



  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                <div key={post.id} className="relative">
                  <PostCard
                    post={{
                      id: post.id,
                      userId: post.user_id,
                      username: `@${post.username}`,
                      content: post.content,
                      timestamp: new Date(post.created_at).toLocaleDateString(),
                      likes: post.likes,
                      replies: post.replies,
                      shares: post.shares,
                      gifts: 0,
                      avatar_url: post.avatar_url,
                      image_url: post.image_url,
                      verified: post.verified
                    }}
                    onLike={handleLike}
                    onReply={handleReply}
                    onShare={handleShare}
                    onGift={handleGift}
                    onBookmark={handleBookmark}
                    onDelete={handleDelete}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-primary mb-2">No posts yet</h3>
                <p className="text-secondary text-sm">This user hasn't posted anything yet</p>
              </div>
            )}
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
          onClick={() => {
            if (canGoBack) {
              const destination = getBackDestination();
              navigate(destination.path, destination.state ? { state: destination.state } : {});
            }
          }}
          disabled={!canGoBack}
          className={`p-2 rounded-lg transition-colors ${
            canGoBack 
              ? 'hover:bg-overlay-light'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-primary">{user.displayName}</h1>
          <p className="text-sm text-secondary">{user.username}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Empty space - 3 dots are in profile section, not header */}
        </div>
      </div>

      <div className="max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
        {/* Profile Header */}
        <div className="px-4 py-6">
          {/* Avatar and Name */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.username?.charAt(1)?.toUpperCase() || '👤'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold gradient-text">{user.username?.replace('@', '') || 'User'}</h2>
                {user.verified && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-secondary text-sm mb-3">{user.username}</p>
              
              {/* Action Icons - Gift and 3 dots */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/rewards')}
                  className="w-8 h-8 rounded-full bg-overlay-light flex items-center justify-center"
                >
                  <Gift className="w-4 h-4 text-accent" />
                </button>
                <button 
                  onClick={handleProfileMenu}
                  className="w-8 h-8 rounded-full bg-overlay-light flex items-center justify-center"
                >
                  <MoreHorizontal className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>
            
            {/* Message and Follow Buttons - positioned on the right */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleMessage}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Send message"
              >
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleFollow}
                disabled={isLoading}
                className={`btn-primary px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid gap-4 mb-6 ${(user.twitter_username || user.twitter_id) ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <button
              onClick={() => navigate(`/user/${username}/followers`)}
              className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div className="text-lg font-bold text-primary">{(user.followers_count || 0).toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWERS</div>
            </button>
            <button
              onClick={() => navigate(`/user/${username}/following`)}
              className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div className="text-lg font-bold text-primary">{(user.following_count || 0).toLocaleString()}</div>
              <div className="text-secondary text-xs">FOLLOWING</div>
            </button>
            {(user.twitter_username || user.twitter_id) && (
              <button
                onClick={() => window.open(`https://twitter.com/${user.twitter_username}`, '_blank')}
                className="text-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="text-lg font-bold text-primary">{(user.twitter_followers_count || 0).toLocaleString()}</div>
                <div className="text-secondary text-xs flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </div>
              </button>
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
            </div>

            <div className="flex items-center gap-3">
              {/* X (Twitter) */}
              {user.twitter_link ? (
                <a
                  href={user.twitter_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black dark:bg-white hover:shadow-md hover:scale-105 transition-all duration-200">
                    <svg className="w-4 h-4 text-white dark:text-black flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-xs font-medium text-white dark:text-black truncate">X</span>
                    <svg className="w-3 h-3 text-white dark:text-black opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7 7 10 10-5 5-5-5Z"/>
                      <path d="m15 7 5 5-5 5"/>
                    </svg>
                  </div>
                </a>
              ) : (
                <div className="group flex-1 min-w-0">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-500 truncate">X</span>
                  </div>
                </div>
              )}

              {/* Discord */}
              {user.discord_link ? (
                <a
                  href={user.discord_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 hover:shadow-md hover:scale-105 transition-all duration-200">
                    <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.30z"/>
                    </svg>
                    <span className="text-xs font-medium text-white truncate">Discord</span>
                    <svg className="w-3 h-3 text-white opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7 7 10 10-5 5-5-5Z"/>
                      <path d="m15 7 5 5-5 5"/>
                    </svg>
                  </div>
                </a>
              ) : (
                <div className="group flex-1 min-w-0">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.30z"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-500 truncate">Discord</span>
                  </div>
                </div>
              )}

              {/* Telegram */}
              {user.telegram_link ? (
                <a
                  href={user.telegram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200">
                    <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span className="text-xs font-medium text-white truncate">Telegram</span>
                    <svg className="w-3 h-3 text-white opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7 7 10 10-5 5-5-5Z"/>
                      <path d="m15 7 5 5-5 5"/>
                    </svg>
                  </div>
                </a>
              ) : (
                <div className="group flex-1 min-w-0">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-500 truncate">Telegram</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
            {[
              { id: 'posts', label: 'Posts' },
              { id: 'nft', label: 'NFT Holds' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-accent'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 pb-24">
          {renderTabContent()}
        </div>
      </div>
      
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientUsername={username}
        onMessageSent={() => {
          // Message sent successfully from DM
          console.log('DM sent successfully');
        }}
      />
    </div>
  );
};