import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Clock, Hash, Users, Eye, Heart, MessageCircle, Share } from 'lucide-react';
import { PostCard } from '../components/Post/PostCard';
import { mockPosts, Post } from '../data/mockData';
import { useTheme } from '../hooks/useTheme';

interface TrendingTopic {
  id: string;
  hashtag: string;
  posts: number;
  growth: string;
  category: 'crypto' | 'defi' | 'nft' | 'web3' | 'solana';
}

interface TrendingPost extends Post {
  trendingScore: number;
  growthRate: number;
}

export const Trending: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'posts' | 'topics'>('posts');
  const [timeFilter, setTimeFilter] = useState<'1h' | '24h' | '7d'>('24h');
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);

  // Mock trending topics
  const trendingTopics: TrendingTopic[] = [
    { id: '1', hashtag: '#SolanaBreakpoint', posts: 1247, growth: '+156%', category: 'solana' },
    { id: '2', hashtag: '#DeFiYield', posts: 892, growth: '+89%', category: 'defi' },
    { id: '3', hashtag: '#Web3Social', posts: 634, growth: '+67%', category: 'web3' },
    { id: '4', hashtag: '#NFTDrop', posts: 445, growth: '+45%', category: 'nft' },
    { id: '5', hashtag: '#CryptoNews', posts: 789, growth: '+34%', category: 'crypto' },
    { id: '6', hashtag: '#SolanaEcosystem', posts: 356, growth: '+28%', category: 'solana' }
  ];

  // Calculate trending score based on engagement, recency, and growth
  const calculateTrendingScore = (post: Post): number => {
    const engagementScore = (post.likes * 3) + (post.replies * 2) + (post.shares * 4);
    const timeDecay = getTimeDecay(post.timestamp);
    const baseScore = engagementScore * timeDecay;
    
    // Add bonus for certain keywords
    const trendingKeywords = ['solana', 'web3', 'defi', 'nft', 'crypto', 'wegram'];
    const keywordBonus = trendingKeywords.some(keyword => 
      post.content.toLowerCase().includes(keyword)
    ) ? 1.5 : 1;
    
    return baseScore * keywordBonus;
  };

  const getTimeDecay = (timestamp: string): number => {
    // Simulate time decay - newer posts get higher scores
    const timeMap: { [key: string]: number } = {
      'now': 2.0,
      '1h': 1.8,
      '2h': 1.6,
      '3h': 1.4,
      '4h': 1.2,
      '6h': 1.0,
      '12h': 0.8,
      '1d': 0.6,
      '2d': 0.4,
      '3d': 0.2
    };
    return timeMap[timestamp] || 0.1;
  };

  const generateGrowthRate = (): number => {
    return Math.floor(Math.random() * 200) + 10; // 10-210% growth
  };

  useEffect(() => {
    // Calculate trending scores and sort posts
    const postsWithScores: TrendingPost[] = mockPosts.map(post => ({
      ...post,
      trendingScore: calculateTrendingScore(post),
      growthRate: generateGrowthRate()
    }));

    // Sort by trending score
    const sorted = postsWithScores.sort((a, b) => b.trendingScore - a.trendingScore);
    setTrendingPosts(sorted);
  }, [timeFilter]);

  const handleLike = (postId: string) => {
    setTrendingPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const getCategoryColor = (category: TrendingTopic['category']) => {
    const colors = {
      solana: 'text-cyan-400',
      defi: 'text-green-400',
      nft: 'text-purple-400',
      web3: 'text-blue-400',
      crypto: 'text-orange-400'
    };
    return colors[category];
  };

  const getCategoryBg = (category: TrendingTopic['category']) => {
    const colors = {
      solana: 'bg-cyan-400 bg-opacity-10',
      defi: 'bg-green-400 bg-opacity-10',
      nft: 'bg-purple-400 bg-opacity-10',
      web3: 'bg-blue-400 bg-opacity-10',
      crypto: 'bg-orange-400 bg-opacity-10'
    };
    return colors[category];
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Trending</h1>
          <p className="text-secondary text-sm">What's hot in Web3</p>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(['1h', '24h', '7d'] as const).map((time) => (
          <button
            key={time}
            onClick={() => setTimeFilter(time)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              timeFilter === time
                ? 'bg-purple-600 text-white'
                : isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-1 mb-6 rounded-lg p-1 ${
        isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-200 bg-opacity-70'
      }`}>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'posts'
              ? 'bg-purple-600 text-white'
              : isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
          }`}
        >
          <Flame className="w-4 h-4 inline mr-2" />
          Hot Posts
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'topics'
              ? 'bg-purple-600 text-white'
              : isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
          }`}
        >
          <Hash className="w-4 h-4 inline mr-2" />
          Topics
        </button>
      </div>

      {/* Content */}
      {activeTab === 'posts' ? (
        <div className="space-y-4">
          {trendingPosts.map((post, index) => (
            <div key={post.id} className="relative">
              {/* Trending Badge */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  #{index + 1}
                </div>
              </div>
              
              {/* Growth Indicator */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{post.growthRate}%
                </div>
              </div>

              <PostCard 
                post={post}
                onLike={handleLike}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={topic.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 font-bold text-sm">#{index + 1}</span>
                    <Hash className={`w-4 h-4 ${getCategoryColor(topic.category)}`} />
                  </div>
                  <div>
                    <h3 className="text-primary font-semibold">{topic.hashtag}</h3>
                    <div className="flex items-center gap-4 text-secondary text-sm">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {topic.posts.toLocaleString()} posts
                      </span>
                      <span className={`flex items-center gap-1 ${getCategoryColor(topic.category)}`}>
                        <TrendingUp className="w-3 h-3" />
                        {topic.growth}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBg(topic.category)} ${getCategoryColor(topic.category)}`}>
                  {topic.category.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-8 card">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-secondary">
            <Clock className="w-4 h-4" />
            <span>Updated every 5 minutes</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Users className="w-4 h-4" />
            <span>12.4K active users</span>
          </div>
        </div>
      </div>
    </div>
  );
};