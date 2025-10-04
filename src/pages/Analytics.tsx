import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Heart, Share, Copy, Check, CheckCircle, MessageCircle, Bookmark, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNeonAuth } from '../hooks/useNeonAuth';

interface TopPost {
  id: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
}

interface PostActivity {
  date: string;
  posts: number;
  likes: number;
  comments: number;
}

interface AnalyticsData {
  overview: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalEngagements: number;
    engagementRate: number;
    bookmarks: number;
    followers: number;
    following: number;
    messagesSent: number;
    messagesReceived: number;
    totalMessages: number;
    memberSince: string;
  };
  topLikedPosts: TopPost[];
  postsActivity: PostActivity[];
}

export const Analytics: React.FC = () => {
  const { isDark } = useTheme();
  const { profile } = useNeonAuth();
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/analytics?user_id=${profile.id}`);
        const data = await response.json();

        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [profile?.id]);

  const referralLink = `https://wegram.com/invite/${profile?.username?.replace('@', '') || 'user'}`;

  const handleCopyReferralLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setReferralLinkCopied(true);
    setTimeout(() => setReferralLinkCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="text-center py-12">
          <h3 className="text-primary font-semibold mb-2">Sign in required</h3>
          <p className="text-secondary text-sm">Please sign in to view your analytics</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="text-center py-12">
          <h3 className="text-primary font-semibold mb-2">No analytics data</h3>
          <p className="text-secondary text-sm">Start posting to see your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      <h1 className="text-xl font-bold text-primary mb-6">Analytics</h1>

      {/* Top Liked Posts */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-5 h-5 text-red-400" />
          <h3 className="text-primary font-medium text-sm">Top Liked Posts</h3>
        </div>
        <div className="space-y-3">
          {analytics.topLikedPosts.length > 0 ? (
            analytics.topLikedPosts.map((post, index) => (
              <div key={post.id} className="p-2 bg-overlay-light rounded-lg">
                <div className="mb-2">
                  <span className="text-purple-400 font-bold text-xs">#{index + 1}</span>
                </div>
                <p className="text-primary text-xs leading-relaxed mb-2">{post.content}</p>
                <div className="flex items-center gap-3 text-xs text-secondary">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share className="w-3 h-3" />
                    {post.shares}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-secondary text-sm">No posts yet. Start posting to see your top content!</p>
            </div>
          )}
        </div>
      </div>


      {/* Referrals Section */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-primary font-medium text-sm">Referrals</h3>
          <div className="ml-auto bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            0
          </div>
        </div>

        {/* Referral Link */}
        <div className="mb-6">
          <label className="block text-secondary text-sm mb-2">Your referral link:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="input flex-1 text-sm bg-overlay-medium"
            />
            <button
              onClick={handleCopyReferralLink}
              className={`px-4 py-2 rounded-lg transition-colors text-white ${
                referralLinkCopied
                  ? 'bg-green-600'
                  : isDark
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {referralLinkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-overlay-light rounded-lg">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-secondary text-sm">Active Referrals</div>
          </div>
          <div className="text-center p-3 bg-overlay-light rounded-lg">
            <div className="text-2xl font-bold text-orange-400">0</div>
            <div className="text-secondary text-sm">Pending</div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-6">
          <p className="text-secondary text-sm">Referral system coming soon! Share your link to get ready.</p>
        </div>
      </div>

      {/* Analytics Overview - Twitter/X Style */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-primary font-medium">Analytics Overview</h3>
        </div>

        {/* Chart Area */}
        <div className={`mb-6 p-4 rounded-lg relative ${isDark ? 'bg-gray-900 bg-opacity-50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-sm"></div>
              <span className="text-sm text-primary">Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <span className="text-sm text-primary">Replies</span>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-32 gap-1">
            {analytics.postsActivity.length > 0 ? (
              analytics.postsActivity.slice(0, 30).reverse().map((activity, i) => {
                const maxPosts = Math.max(...analytics.postsActivity.map(a => a.posts), 1);
                const maxLikes = Math.max(...analytics.postsActivity.map(a => a.likes), 1);
                const postHeight = Math.max((activity.posts / maxPosts) * 80, 4);
                const likeHeight = Math.max((activity.likes / maxLikes) * 60, 2);
                return (
                  <div key={i} className="flex flex-col items-center gap-1" style={{width: '8px'}}>
                    <div
                      className="bg-cyan-400 rounded-sm w-full"
                      style={{height: `${postHeight}px`}}
                      title={`${activity.posts} posts on ${activity.date}`}
                    ></div>
                    <div
                      className="bg-green-400 rounded-sm w-full"
                      style={{height: `${likeHeight}px`}}
                      title={`${activity.likes} likes on ${activity.date}`}
                    ></div>
                  </div>
                );
              })
            ) : (
              Array.from({length: 30}, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-1" style={{width: '8px'}}>
                  <div className="bg-gray-400 rounded-sm w-full" style={{height: '4px'}}></div>
                  <div className="bg-gray-400 rounded-sm w-full" style={{height: '2px'}}></div>
                </div>
              ))
            )}
          </div>
          
          {/* Chart Labels */}
          <div className="flex justify-between text-xs text-secondary mt-2">
            <span>30 days ago</span>
            <span>20 days ago</span>
            <span>10 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Row 1 */}
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-xs sm:text-sm text-secondary leading-tight">Total Posts</span>
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.totalPosts}</div>
            <div className="text-xs text-secondary">Posts created</div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Total Likes</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.totalLikes.toLocaleString()}</div>
            <div className="text-xs text-green-400 font-medium">Likes received</div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Engagement Rate</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.engagementRate}%</div>
            <div className="text-xs text-purple-400 font-medium">Per post average</div>
          </div>

          {/* Row 2 */}
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-xs sm:text-sm text-secondary leading-tight">Comments</span>
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.totalComments.toLocaleString()}</div>
            <div className="text-xs text-green-400 font-medium">Comments received</div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-xs sm:text-sm text-secondary leading-tight">Bookmarks</span>
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.bookmarks}</div>
            <div className="text-xs text-yellow-400 font-medium">Posts saved</div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-xs sm:text-sm text-secondary leading-tight">Followers</span>
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.followers.toLocaleString()}</div>
            <div className="text-xs text-cyan-400 font-medium">Following you</div>
          </div>

          {/* Row 3 */}
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Following</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.following.toLocaleString()}</div>
            <div className="text-xs text-blue-400 font-medium">You follow</div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Shares</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.totalShares.toLocaleString()}</div>
            <div className="text-xs text-orange-400 font-medium">Posts shared</div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-xs sm:text-sm text-secondary leading-tight">Messages</span>
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">{analytics.overview.totalMessages}</div>
            <div className="text-xs text-purple-400 font-medium">Total conversations</div>
          </div>
        </div>
      </div>
    </div>
  );
};