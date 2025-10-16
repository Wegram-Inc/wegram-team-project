import React, { useState, useEffect } from 'react';
import { TrendingUp, Gamepad2, Video, ExternalLink, Hash, Flame, Play, Heart, MessageCircle, Share, Gift, CheckCircle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../hooks/useNeonPosts';
import { VerificationBadge } from '../VerificationBadge';

export const DesktopRightSidebar: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Fetch trending posts from the same API as the home feed trending tab
    const fetchTrendingPosts = async () => {
      try {
        const response = await fetch('/api/posts?feed_type=trending');
        const result = await response.json();

        if (response.ok && result.posts) {
          setTrendingPosts(result.posts.slice(0, 3)); // Show top 3 trending posts
        } else {
          console.error('Failed to fetch trending posts:', result.error);
          setTrendingPosts([]);
        }
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setTrendingPosts([]);
      }
    };

    fetchTrendingPosts();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-6 border-l-4" style={{ backgroundColor: 'var(--bg)', borderColor: isDark ? '#6b7280' : '#9ca3af' }}>
      {/* Trending Section - Real content from home feed trending tab */}
      <div className="rounded-xl p-4 border-2" style={{ backgroundColor: 'var(--card)', borderColor: isDark ? '#6b7280' : '#9ca3af' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="font-bold text-primary">Trending</h3>
        </div>

        {trendingPosts.length > 0 ? (
          <div className="space-y-3">
            {trendingPosts.map((post, index) => (
              <div
                key={post.id}
                className="p-3 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer border-2"
                style={{
                  backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)',
                  borderColor: isDark ? '#6b7280' : '#9ca3af'
                }}
                onClick={() => navigate(`/post/${post.id}/comments`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400">#{index + 1} TRENDING</span>
                </div>

                <div className="flex items-start gap-2 mb-2">
                  {post.avatar_url && (
                    <img
                      src={post.avatar_url}
                      alt={`@${post.username}`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-primary">{post.username.startsWith('@') ? post.username : `@${post.username}`}</span>
                      {post.verified && (
                        <VerificationBadge
                          type={['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(post.username) ? 'platinum' : 'gold'}
                          size="sm"
                        />
                      )}
                    </div>
                    <p className="text-sm text-primary line-clamp-2 mt-1">{post.content}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-secondary">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share className="w-3 h-3" />
                    {post.shares}
                  </span>
                  {post.gifts > 0 && (
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {post.gifts}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-2xl mb-2">🔥</div>
            <p className="text-sm text-secondary">No trending posts yet</p>
            <p className="text-xs text-secondary mt-1">Posts need more engagement to trend</p>
          </div>
        )}

        <button
          onClick={() => navigate('/home?tab=trending')}
          className="w-full mt-4 py-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
        >
          View all trending
        </button>
      </div>

      {/* WeRunner Game Section - Real content */}
      <div className="rounded-xl p-4 border-2" style={{ backgroundColor: 'var(--card)', borderColor: isDark ? '#6b7280' : '#9ca3af' }}>
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 className="w-5 h-5 text-green-400" />
          <h3 className="font-bold text-primary">Game</h3>
        </div>

        <div
          className="p-4 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer border-2"
          style={{
            backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)',
            borderColor: isDark ? '#6b7280' : '#9ca3af'
          }}
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
      <div className="rounded-xl p-4 border-2" style={{ backgroundColor: 'var(--card)', borderColor: isDark ? '#6b7280' : '#9ca3af' }}>
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-primary">Go Live</h3>
        </div>

        <div
          className="p-4 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer border-2"
          style={{
            backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)',
            borderColor: isDark ? '#6b7280' : '#9ca3af'
          }}
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