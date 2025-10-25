import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Copy, Share, Info, Zap, Target } from 'lucide-react';
import { useNeonAuth } from '../hooks/useNeonAuth';

interface ReferralStats {
  totalReferrals: number;
}

interface ReferralHistoryItem {
  id: string;
  referred_username: string;
  referred_avatar: string | null;
  created_at: string;
}

export const Rewards: React.FC = () => {
  const { profile } = useNeonAuth();
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralHistory, setReferralHistory] = useState<ReferralHistoryItem[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0
  });

  const REQUIRED_REFERRALS = 50;

  // Fetch referral data
  useEffect(() => {
    const fetchReferralData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/referrals?user_id=${profile.id}`);
        const data = await response.json();

        if (data.success) {
          setReferralStats({
            totalReferrals: data.stats.totalReferrals || 0
          });
          setReferralHistory(data.referralHistory || []);
        }
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [profile?.id]);

  // Generate unique referral link for user
  const generateReferralLink = () => {
    if (!profile?.username) return 'https://wegram.social/?ref=demo';
    const cleanUsername = profile.username.replace('@', '');
    return `https://wegram.social/?ref=${cleanUsername}`;
  };

  const referralLink = generateReferralLink();

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const progress = Math.min((referralStats.totalReferrals / REQUIRED_REFERRALS) * 100, 100);
  const isEligible = referralStats.totalReferrals >= REQUIRED_REFERRALS;

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Referral Program</h1>
          <p className="text-secondary text-sm">Invite friends to join Wegram</p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Share className="w-5 h-5 text-purple-400" />
          <h3 className="text-primary font-semibold">Your Referral Link</h3>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="input flex-1 text-sm bg-overlay-medium"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg transition-colors ${
                linkCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="text-primary font-semibold">Your Progress</h3>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-primary mb-2">
            {referralStats.totalReferrals}
          </div>
          <div className="text-secondary text-sm">
            out of {REQUIRED_REFERRALS} referrals needed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-3 bg-overlay-light rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-secondary mt-2">
            <span>{progress.toFixed(0)}% Complete</span>
            <span>{REQUIRED_REFERRALS - referralStats.totalReferrals} remaining</span>
          </div>
        </div>

        {/* Status */}
        {isEligible ? (
          <div className="bg-green-600 bg-opacity-10 border-2 border-green-500 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-green-400 font-bold text-lg">Eligible for Rewards!</div>
            <div className="text-secondary text-sm mt-1">
              You've reached {REQUIRED_REFERRALS} referrals
            </div>
          </div>
        ) : (
          <div className="bg-purple-600 bg-opacity-10 border-2 border-purple-500 rounded-lg p-4 text-center">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-purple-400 font-bold text-lg">Keep Going!</div>
            <div className="text-secondary text-sm mt-1">
              Invite {REQUIRED_REFERRALS - referralStats.totalReferrals} more friends to unlock rewards
            </div>
          </div>
        )}
      </div>

      {/* Referral History */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-primary font-semibold">Your Referrals</h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading...</p>
          </div>
        ) : referralHistory.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h4 className="text-primary font-medium mb-2">No referrals yet</h4>
            <p className="text-secondary text-sm">
              When friends join using your referral link, they will appear here with their join date.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referralHistory.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-3 bg-overlay-light rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {referral.referred_avatar ? (
                      <img src={referral.referred_avatar} alt={referral.referred_username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {referral.referred_username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-primary font-medium">{referral.referred_username}</div>
                    <div className="text-secondary text-xs">
                      Joined {new Date(referral.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-400" />
          <h3 className="text-primary font-semibold">How It Works</h3>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="text-primary font-medium mb-2">🎯 Referral Program</h4>
            <div className="space-y-2 text-secondary">
              <div><strong>1. Share Your Link</strong><br />Share your unique referral link with friends</div>
              <div><strong>2. Friends Join</strong><br />When someone creates an account using your link, they become your referral</div>
              <div><strong>3. Reach 50 Referrals</strong><br />Once you reach {REQUIRED_REFERRALS} referrals, you become eligible for rewards</div>
            </div>
          </div>

          <div>
            <h4 className="text-primary font-medium mb-2">📋 Terms</h4>
            <div className="space-y-1 text-secondary">
              <div>• Referrals must be genuine new users</div>
              <div>• Minimum {REQUIRED_REFERRALS} referrals required for reward eligibility</div>
              <div>• Self-referrals or fake accounts are not eligible</div>
              <div>• Wegram reserves the right to review suspicious activity</div>
            </div>
          </div>

          <div className="bg-purple-600 bg-opacity-10 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <span className="font-medium">🚀 Start Referring</span>
            </div>
            <div className="text-secondary text-xs mt-1">
              Copy your referral link above and start sharing with friends!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
