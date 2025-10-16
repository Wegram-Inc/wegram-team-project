import React, { useState, useEffect } from 'react';
import { Search, Compass, Users, Hash, TrendingUp, Filter, MapPin, Calendar, Star, Eye, Heart, MessageCircle } from 'lucide-react';
import { PostCard } from '../components/Post/PostCard';
import { mockPosts, Post } from '../data/mockData';
import { useTheme } from '../hooks/useTheme';
import { VerificationBadge } from '../components/VerificationBadge';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: 'defi' | 'nft' | 'gaming' | 'dao' | 'solana' | 'trading';
  isJoined: boolean;
  avatar: string;
  trending: boolean;
}

interface Creator {
  id: string;
  username: string;
  displayName: string;
  followers: number;
  posts: number;
  category: 'trader' | 'developer' | 'artist' | 'influencer' | 'analyst';
  isFollowing: boolean;
  avatar: string;
  verified: boolean;
}

interface Topic {
  id: string;
  hashtag: string;
  posts: number;
  growth: string;
  category: 'trending' | 'new' | 'popular';
}

export const Explore: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'posts' | 'communities' | 'creators' | 'topics'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [explorePosts, setExplorePosts] = useState<Post[]>([]);

  // Mock communities data
  const communities: Community[] = [
    {
      id: '1',
      name: 'Solana Builders',
      description: 'Building the future on Solana blockchain',
      members: 12400,
      category: 'solana',
      isJoined: false,
      avatar: '🏗️',
      trending: true
    },
    {
      id: '2',
      name: 'DeFi Yield Farmers',
      description: 'Maximizing yields across protocols',
      members: 8900,
      category: 'defi',
      isJoined: true,
      avatar: '🌾',
      trending: true
    },
    {
      id: '3',
      name: 'NFT Collectors Hub',
      description: 'Discover and trade the best NFTs',
      members: 15600,
      category: 'nft',
      isJoined: false,
      avatar: '🎨',
      trending: false
    },
    {
      id: '4',
      name: 'Web3 Gaming',
      description: 'Play-to-earn and blockchain gaming',
      members: 6700,
      category: 'gaming',
      isJoined: false,
      avatar: '🎮',
      trending: true
    },
    {
      id: '5',
      name: 'Crypto Trading Pro',
      description: 'Advanced trading strategies and analysis',
      members: 11200,
      category: 'trading',
      isJoined: true,
      avatar: '📈',
      trending: false
    },
    {
      id: '6',
      name: 'DAO Governance',
      description: 'Decentralized autonomous organizations',
      members: 4300,
      category: 'dao',
      isJoined: false,
      avatar: '🏛️',
      trending: false
    }
  ];

  // Mock creators data
  const creators: Creator[] = [
    {
      id: '1',
      username: '@solana_dev',
      displayName: 'Solana Developer',
      followers: 45600,
      posts: 1200,
      category: 'developer',
      isFollowing: false,
      avatar: '👨‍💻',
      verified: true
    },
    {
      id: '2',
      username: '@defi_queen',
      displayName: 'DeFi Analytics',
      followers: 32100,
      posts: 890,
      category: 'analyst',
      isFollowing: true,
      avatar: '👑',
      verified: true
    },
    {
      id: '3',
      username: '@nft_artist',
      displayName: 'Digital Artist',
      followers: 28900,
      posts: 567,
      category: 'artist',
      isFollowing: false,
      avatar: '🎨',
      verified: false
    },
    {
      id: '4',
      username: '@crypto_trader',
      displayName: 'Pro Trader',
      followers: 67800,
      posts: 2100,
      category: 'trader',
      isFollowing: false,
      avatar: '📊',
      verified: true
    },
    {
      id: '5',
      username: '@web3_influencer',
      displayName: 'Web3 Advocate',
      followers: 89400,
      posts: 1800,
      category: 'influencer',
      isFollowing: true,
      avatar: '🌟',
      verified: true
    }
  ];

  // Mock topics data
  const topics: Topic[] = [
    { id: '1', hashtag: '#SolanaEcosystem', posts: 2400, growth: '+89%', category: 'trending' },
    { id: '2', hashtag: '#DeFiYield', posts: 1800, growth: '+67%', category: 'trending' },
    { id: '3', hashtag: '#NFTDrop', posts: 1200, growth: '+45%', category: 'popular' },
    { id: '4', hashtag: '#Web3Gaming', posts: 890, growth: '+123%', category: 'new' },
    { id: '5', hashtag: '#CryptoNews', posts: 3400, growth: '+23%', category: 'popular' },
    { id: '6', hashtag: '#DAOGovernance', posts: 560, growth: '+234%', category: 'new' }
  ];

  const categories = {
    posts: ['all', 'trending', 'recent', 'popular'],
    communities: ['all', 'solana', 'defi', 'nft', 'gaming', 'trading', 'dao'],
    creators: ['all', 'developer', 'trader', 'artist', 'influencer', 'analyst'],
    topics: ['all', 'trending', 'new', 'popular']
  };

  // Generate diverse explore posts
  useEffect(() => {
    const explorePostsData: Post[] = [
      {
        id: 'explore1',
        userId: 'user1',
        username: '@solana_builder',
        content: 'Just deployed my first Solana program! The developer experience is incredible. Building on-chain has never been this smooth 🚀 #SolanaEcosystem',
        timestamp: '30m',
        likes: 89,
        replies: 23,
        shares: 12
      },
      {
        id: 'explore2',
        userId: 'user2',
        username: '@defi_researcher',
        content: 'New yield farming opportunity discovered! 🌾 This protocol is offering 45% APY with minimal impermanent loss risk. DYOR but looks promising! #DeFiYield',
        timestamp: '1h',
        likes: 156,
        replies: 67,
        shares: 34
      },
      {
        id: 'explore3',
        userId: 'user3',
        username: '@nft_collector',
        content: 'This NFT collection is about to explode! 💎 Floor price still under 1 SOL but the art and utility are next level. Don\'t sleep on this one #NFTDrop',
        timestamp: '2h',
        likes: 234,
        replies: 89,
        shares: 45
      },
      {
        id: 'explore4',
        userId: 'user4',
        username: '@gaming_enthusiast',
        content: 'Web3 gaming is finally here! 🎮 Just earned 50 tokens playing for 2 hours. This is the future of gaming - play AND earn! #Web3Gaming',
        timestamp: '3h',
        likes: 178,
        replies: 56,
        shares: 28
      },
      {
        id: 'explore5',
        userId: 'user5',
        username: '@dao_member',
        content: 'Our DAO just passed a major governance proposal! 🏛️ Community-driven decisions are the way forward. Decentralization in action! #DAOGovernance',
        timestamp: '4h',
        likes: 123,
        replies: 34,
        shares: 19
      }
    ];
    setExplorePosts(explorePostsData);
  }, []);

  const handleLike = (postId: string) => {
    setExplorePosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const handleJoinCommunity = (communityId: string) => {
    // API integration coming soon
    console.log('Joining community:', communityId);
  };

  const handleFollowCreator = (creatorId: string) => {
    // API integration coming soon
    console.log('Following creator:', creatorId);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      solana: 'text-cyan-400',
      defi: 'text-green-400',
      nft: 'text-purple-400',
      gaming: 'text-orange-400',
      trading: 'text-blue-400',
      dao: 'text-yellow-400',
      developer: 'text-cyan-400',
      trader: 'text-blue-400',
      artist: 'text-purple-400',
      influencer: 'text-pink-400',
      analyst: 'text-green-400',
      trending: 'text-orange-400',
      new: 'text-green-400',
      popular: 'text-blue-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const getCategoryBg = (category: string) => {
    const colors: { [key: string]: string } = {
      solana: 'bg-cyan-400 bg-opacity-10',
      defi: 'bg-green-400 bg-opacity-10',
      nft: 'bg-purple-400 bg-opacity-10',
      gaming: 'bg-orange-400 bg-opacity-10',
      trading: 'bg-blue-400 bg-opacity-10',
      dao: 'bg-yellow-400 bg-opacity-10',
      developer: 'bg-cyan-400 bg-opacity-10',
      trader: 'bg-blue-400 bg-opacity-10',
      artist: 'bg-purple-400 bg-opacity-10',
      influencer: 'bg-pink-400 bg-opacity-10',
      analyst: 'bg-green-400 bg-opacity-10',
      trending: 'bg-orange-400 bg-opacity-10',
      new: 'bg-green-400 bg-opacity-10',
      popular: 'bg-blue-400 bg-opacity-10'
    };
    return colors[category] || 'bg-gray-400 bg-opacity-10';
  };

  const filteredData = () => {
    switch (activeTab) {
      case 'communities':
        return selectedCategory === 'all' 
          ? communities 
          : communities.filter(c => c.category === selectedCategory);
      case 'creators':
        return selectedCategory === 'all' 
          ? creators 
          : creators.filter(c => c.category === selectedCategory);
      case 'topics':
        return selectedCategory === 'all' 
          ? topics 
          : topics.filter(t => t.category === selectedCategory);
      default:
        return explorePosts;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Explore</h1>
          <p className="text-secondary text-sm">Discover new content & communities</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, communities, creators..."
          className="input pl-10 pr-4"
        />
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-1 mb-4 rounded-lg p-1 overflow-x-auto ${
        isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-200 bg-opacity-70'
      }`}>
        {(['posts', 'communities', 'creators', 'topics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories[activeTab].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 min-w-fit ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          <>
            {explorePosts.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                onLike={handleLike}
              />
            ))}
          </>
        )}

        {activeTab === 'communities' && (
          <>
            {(filteredData() as Community[]).map((community) => (
              <div key={community.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      {community.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-primary font-semibold">{community.name}</h3>
                        {community.trending && (
                          <TrendingUp className="w-4 h-4 text-orange-400" />
                        )}
                      </div>
                      <p className="text-secondary text-sm mb-1">{community.description}</p>
                      <div className="flex items-center gap-3 text-xs text-secondary">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {community.members.toLocaleString()} members
                        </span>
                        <span className={`px-2 py-1 rounded-full ${getCategoryBg(community.category)} ${getCategoryColor(community.category)}`}>
                          {community.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinCommunity(community.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    community.isJoined
                      ? isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-400 text-gray-600'
                      : 'btn-primary'
                  }`}
                >
                  {community.isJoined ? 'Joined' : 'Join Community'}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'creators' && (
          <>
            {(filteredData() as Creator[]).map((creator) => (
              <div key={creator.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      {creator.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-primary font-semibold">{creator.displayName}</h3>
                        {creator.verified && (
                          <VerificationBadge
                            type={['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(creator.username) ? 'platinum' : 'gold'}
                            size="md"
                          />
                        )}
                      </div>
                      <p className="text-secondary text-sm">{creator.username}</p>
                      <div className="flex items-center gap-3 text-xs text-secondary mt-1">
                        <span>{creator.followers.toLocaleString()} followers</span>
                        <span>{creator.posts} posts</span>
                        <span className={`px-2 py-1 rounded-full ${getCategoryBg(creator.category)} ${getCategoryColor(creator.category)}`}>
                          {creator.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowCreator(creator.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    creator.isFollowing
                      ? isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-400 text-gray-600'
                      : 'btn-primary'
                  }`}
                >
                  {creator.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'topics' && (
          <>
            {(filteredData() as Topic[]).map((topic, index) => (
              <div key={topic.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-primary font-semibold">{topic.hashtag}</h3>
                      <div className="flex items-center gap-3 text-secondary text-sm">
                        <span>{topic.posts.toLocaleString()} posts</span>
                        <span className="text-green-400">{topic.growth}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBg(topic.category)} ${getCategoryColor(topic.category)}`}>
                    {topic.category.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-8 card">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-secondary">
            <Eye className="w-4 h-4" />
            <span>Updated every minute</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Users className="w-4 h-4" />
            <span>15.7K exploring now</span>
          </div>
        </div>
      </div>
    </div>
  );
};