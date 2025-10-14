import React, { useState, useEffect } from 'react';
import { TrendingUp, Gamepad2, Video, ExternalLink, Hash, Flame, Play } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { mockPosts, Post } from '../../data/mockData';

interface TrendingPost extends Post {
  trendingScore: number;
  growthRate: number;
}

export const DesktopRightSidebar: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);

  // Real trending topics from your trending page
  const trendingTopics = [
    { tag: '#SolanaBreakpoint', posts: '1.2K', growth: '+156%' },
    { tag: '#DeFiYield', posts: '892', growth: '+89%' },
    { tag: '#Web3Social', posts: '634', growth: '+67%' },
    { tag: '#WegramToken', posts: '445', growth: '+45%' },
    { tag: '#CryptoNews', posts: '789', growth: '+34%' }
  ];

  // Calculate trending score (same logic as Trending page)
  const calculateTrendingScore = (post: Post): number => {
    const engagementScore = (post.likes * 3) + (post.replies * 2) + (post.shares * 4);
    const timeDecay = getTimeDecay(post.timestamp);
    const baseScore = engagementScore * timeDecay;

    const trendingKeywords = ['solana', 'web3', 'defi', 'nft', 'crypto', 'wegram'];
    const keywordBonus = trendingKeywords.some(keyword =>
      post.content.toLowerCase().includes(keyword)
    ) ? 1.5 : 1;

    return baseScore * keywordBonus;
  };

  const getTimeDecay = (timestamp: string): number => {
    const timeMap: { [key: string]: number } = {
      'now': 2.0, '1h': 1.8, '2h': 1.6, '3h': 1.4, '4h': 1.2,
      '6h': 1.0, '12h': 0.8, '1d': 0.6, '2d': 0.4, '3d': 0.2
    };
    return timeMap[timestamp] || 0.1;
  };

  const generateGrowthRate = (): number => {
    return Math.floor(Math.random() * 200) + 10;
  };

  useEffect(() => {
    // Get top trending posts (same logic as Trending page)
    const postsWithScores: TrendingPost[] = mockPosts.map(post => ({
      ...post,
      trendingScore: calculateTrendingScore(post),
      growthRate: generateGrowthRate()
    }));

    const sorted = postsWithScores.sort((a, b) => b.trendingScore - a.trendingScore);
    setTrendingPosts(sorted.slice(0, 3)); // Show top 3
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-6" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Trending Section - Real content from trending page */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-primary">Trending</h3>
        </div>

        {/* Top Trending Posts */}
        <div className="space-y-3 mb-4">
          {trendingPosts.map((post, index) => (
            <div
              key={post.id}
              className="p-3 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
              style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
              onClick={() => navigate('/trending')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">#{index + 1} TRENDING</span>
                <span className="text-xs text-green-400">+{post.growthRate}%</span>
              </div>
              <p className="text-sm text-primary font-medium line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-secondary">
                <span>{post.likes} likes</span>
                <span>{post.replies} replies</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trending Topics */}
        <div className="space-y-2 mb-4">
          {trendingTopics.slice(0, 3).map((topic, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
              style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
              onClick={() => navigate('/trending')}
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="font-medium text-primary text-sm">{topic.tag}</p>
                  <p className="text-xs text-secondary">{topic.posts} posts</p>
                </div>
              </div>
              <span className="text-xs text-green-400 font-medium">{topic.growth}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/trending')}
          className="w-full py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          View all trending
        </button>
      </div>

      {/* WeRunner Game Section - Real content */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 className="w-5 h-5 text-green-400" />
          <h3 className="font-bold text-primary">Game</h3>
        </div>

        <div
          className="p-4 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
          style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
          onClick={() => navigate('/werunner')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">⚡</div>
            <div>
              <p className="font-bold text-primary">WeRunner</p>
              <p className="text-xs text-secondary">Epic anime-style battle runner</p>
            </div>
          </div>

          <p className="text-sm text-secondary mb-3">
            Stunning visuals and epic battles await in this anime-style runner game.
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open('https://centricj20.github.io/We-Runner/', '_blank');
            }}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Play Now
          </button>
        </div>
      </div>

      {/* Livestream Section - Real content */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-primary">Go Live</h3>
        </div>

        <div
          className="p-4 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
          style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
          onClick={() => navigate('/livestream')}
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium text-primary mb-2">Start Streaming</p>
            <p className="text-sm text-secondary mb-4">
              Share your thoughts with the Wegram community
            </p>

            <div className="bg-purple-600 bg-opacity-10 rounded-lg p-3 mb-4">
              <p className="text-purple-400 font-medium text-sm mb-1">Earn While Streaming</p>
              <p className="text-xs text-secondary">Tips in SOL, USDC, WGM + viewer bonuses</p>
            </div>

            <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
              🔴 Go Live
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};