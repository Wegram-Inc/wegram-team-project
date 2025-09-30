import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Heart, Share, Copy, Check, CheckCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface TopPost {
  id: string;
  content: string;
  likes: number;
  shares: number;
  views: number;
}

interface Referral {
  id: string;
  username: string;
  joinDate: string;
  status: 'active' | 'pending';
}

export const Analytics: React.FC = () => {
  const { isDark } = useTheme();
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);
  
  // Removed unused stats array

  const topLikedPosts: TopPost[] = [
    {
      id: '1',
      content: 'Up 40% since I joined WEGRAM 🚀 — real web3 experience!',
      likes: 156,
      shares: 23,
      views: 2400
    },
    {
      id: '2',
      content: 'The future of social media is here. Earning while posting has never been this easy! #Web3 #SocialFi',
      likes: 89,
      shares: 18,
      views: 1800
    },
    {
      id: '3',
      content: 'Just completed my daily check-in and earned +2 WGM! These micro-rewards really add up over time.',
      likes: 67,
      shares: 12,
      views: 1200
    }
  ];

  const topPerformingPosts: TopPost[] = [
    {
      id: '1',
      content: 'The future of social media is here. Earning while posting has never been this easy! #Web3 #SocialFi',
      likes: 89,
      shares: 18,
      views: 2800
    },
    {
      id: '2',
      content: 'Up 40% since I joined WEGRAM 🚀 — real web3 experience!',
      likes: 156,
      shares: 23,
      views: 2400
    },
    {
      id: '3',
      content: 'Just discovered this amazing DeFi protocol. The yields are incredible! 💰',
      likes: 45,
      shares: 8,
      views: 1900
    }
  ];

  const referrals: Referral[] = [
    { id: '1', username: '@crypto_newbie', joinDate: '2 days ago', status: 'active' },
    { id: '2', username: '@defi_explorer', joinDate: '1 week ago', status: 'active' },
    { id: '3', username: '@nft_lover', joinDate: '2 weeks ago', status: 'active' },
    { id: '4', username: '@web3_builder', joinDate: '3 weeks ago', status: 'pending' }
  ];

  const referralLink = 'https://wegram.com/invite/demo_user_123';

  const handleCopyReferralLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setReferralLinkCopied(true);
    setTimeout(() => setReferralLinkCopied(false), 2000);
  };

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
          {topLikedPosts.map((post, index) => (
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
                  <Share className="w-3 h-3" />
                  {post.shares}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-primary font-medium text-sm">Top Performing Posts</h3>
        </div>
        <div className="space-y-3">
          {topPerformingPosts.map((post, index) => (
            <div key={post.id} className="p-2 bg-overlay-light rounded-lg">
              <div className="mb-2">
                <span className="text-green-400 font-bold text-xs">#{index + 1}</span>
              </div>
              <p className="text-primary text-xs leading-relaxed mb-2">{post.content}</p>
              <div className="flex items-center gap-3 text-xs text-secondary">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Share className="w-3 h-3" />
                  {post.shares}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referrals Section */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-primary font-medium text-sm">Referrals</h3>
          <div className="ml-auto bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {referrals.filter(r => r.status === 'active').length}
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
            <div className="text-2xl font-bold text-green-400">
              {referrals.filter(r => r.status === 'active').length}
            </div>
            <div className="text-secondary text-sm">Active Referrals</div>
          </div>
          <div className="text-center p-3 bg-overlay-light rounded-lg">
            <div className="text-2xl font-bold text-orange-400">
              {referrals.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-secondary text-sm">Pending</div>
          </div>
        </div>

        {/* Referral List */}
        <div>
          <h4 className="text-primary font-medium mb-3">Recent Referrals</h4>
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-primary font-medium">{referral.username}</div>
                  <div className="text-secondary text-sm">Joined {referral.joinDate}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  referral.status === 'active' 
                    ? 'bg-green-600 bg-opacity-20 text-green-400' 
                    : 'bg-orange-600 bg-opacity-20 text-orange-400'
                }`}>
                  {referral.status}
                </div>
              </div>
            ))}
          </div>
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
            {Array.from({length: 30}, (_, i) => {
              const postHeight = Math.random() * 80 + 20;
              const replyHeight = Math.random() * 60 + 10;
              return (
                <div key={i} className="flex flex-col items-center gap-1" style={{width: '8px'}}>
                  <div 
                    className="bg-cyan-400 rounded-sm w-full" 
                    style={{height: `${postHeight}px`}}
                  ></div>
                  <div 
                    className="bg-green-400 rounded-sm w-full" 
                    style={{height: `${replyHeight}px`}}
                  ></div>
                </div>
              );
            })}
          </div>
          
          {/* Chart Labels */}
          <div className="flex justify-between text-xs text-secondary mt-2">
            <span>Jun 20</span>
            <span>Jul 1</span>
            <span>Jul 12</span>
            <span>Jul 23</span>
            <span>Aug 4</span>
            <span>Aug 16</span>
            <span>Aug 29</span>
            <span>Sep 11</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Row 1 */}
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-xs sm:text-sm text-secondary leading-tight">Verified followers</span>
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">43.9K</div>
            <div className="text-xs text-secondary">/ 231.3K</div>
          </div>
          
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Impressions</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">173.1M</div>
            <div className="text-xs text-green-400 font-medium">↑ 124%</div>
          </div>
          
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Engagement rate</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">2.5%</div>
            <div className="text-xs text-red-400 font-medium">↓ -43%</div>
          </div>

          {/* Row 2 */}
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Engagements</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">4.4M</div>
            <div className="text-xs text-green-400 font-medium">↑ 26%</div>
          </div>
          
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Profile visits</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">396.6K</div>
            <div className="text-xs text-green-400 font-medium">↑ 45%</div>
          </div>
          
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Replies</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">882.2K</div>
            <div className="text-xs text-green-400 font-medium">↑ 51%</div>
          </div>

          {/* Row 3 */}
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Likes</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">1.4M</div>
            <div className="text-xs text-green-400 font-medium">↑ 20%</div>
          </div>
          
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Reposts</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">96.3K</div>
            <div className="text-xs text-red-400 font-medium">↓ -3.2%</div>
          </div>
          
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Bookmarks</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">45.4K</div>
            <div className="text-xs text-green-400 font-medium">↑ 50%</div>
          </div>

          {/* Row 4 - Shares spans single column */}
          <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className="text-xs sm:text-sm text-secondary mb-2 leading-tight">Shares</div>
            <div className="text-lg sm:text-xl font-bold text-primary mb-1">14K</div>
            <div className="text-xs text-green-400 font-medium">↑ 45%</div>
          </div>
        </div>
      </div>
    </div>
  );
};