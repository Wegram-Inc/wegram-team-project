import React, { useState } from 'react';
import { Gift, Users, Trophy, Star, CheckCircle, Copy, Coins, TrendingUp, Award, ExternalLink, Share, Twitter, MessageCircle, Send, Info, Crown, Medal, Zap } from 'lucide-react';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { useTheme } from '../hooks/useTheme';

interface ReferralTier {
  name: string;
  minReferrals: number;
  maxReferrals: number | null;
  reward: number;
  icon: string;
  color: string;
}

interface ReferralStats {
  totalReferrals: number;
  totalEarned: number;
  thisMonthEarned: number;
  currentTier: string;
}

export const Rewards: React.FC = () => {
  const { isDark } = useTheme();
  const { profile } = useNeonAuth();
  const [linkCopied, setLinkCopied] = useState(false);

  // Referral tiers configuration
  const referralTiers: ReferralTier[] = [
    {
      name: 'Bronze',
      minReferrals: 0,
      maxReferrals: 4,
      reward: 5,
      icon: 'medal',
      color: 'text-orange-400'
    },
    {
      name: 'Silver',
      minReferrals: 5,
      maxReferrals: 19,
      reward: 7,
      icon: 'award',
      color: 'text-gray-300'
    },
    {
      name: 'Gold',
      minReferrals: 20,
      maxReferrals: null,
      reward: 10,
      icon: 'crown',
      color: 'text-yellow-400'
    }
  ];

  // Real user referral stats (currently 0 - ready for smart contract integration)
  const referralStats: ReferralStats = {
    totalReferrals: 0,
    totalEarned: 0,
    thisMonthEarned: 0,
    currentTier: 'Bronze'
  };

  // Generate unique referral link for user
  const generateReferralLink = () => {
    if (!profile?.username) return 'https://wegram.com/invite/demo';
    const cleanUsername = profile.username.replace('@', '');
    return `https://wegram.com/invite/${cleanUsername}`;
  };

  const referralLink = generateReferralLink();

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };


  // Function to render tier icon
  const renderTierIcon = (iconString: string, className: string = 'w-6 h-6') => {
    const iconProps = { className };

    switch (iconString) {
      case 'medal':
        return <Medal {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      case 'crown':
        return <Crown {...iconProps} />;
      default:
        return <Trophy {...iconProps} />;
    }
  };

  const getCurrentTier = () => {
    return referralTiers.find(tier =>
      referralStats.totalReferrals >= tier.minReferrals &&
      (tier.maxReferrals === null || referralStats.totalReferrals <= tier.maxReferrals)
    ) || referralTiers[0];
  };

  const currentTier = getCurrentTier();

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Referral Rewards</h1>
          <p className="text-secondary text-sm">Invite friends and earn WEGRAM</p>
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

      {/* Stats Dashboard */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-primary font-semibold">Your Stats</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-overlay-light rounded-lg">
            <div className="text-2xl font-bold text-primary">{referralStats.totalReferrals}</div>
            <div className="text-secondary text-sm">Total Referrals</div>
          </div>
          <div className="text-center p-4 bg-overlay-light rounded-lg">
            <div className="text-2xl font-bold text-green-400">{referralStats.totalEarned}</div>
            <div className="text-secondary text-sm">Total WEGRAM</div>
          </div>
          <div className="text-center p-4 bg-overlay-light rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{referralStats.thisMonthEarned}</div>
            <div className="text-secondary text-sm">This Month</div>
          </div>
        </div>

        {/* Current Tier */}
        <div className="bg-overlay-light rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={currentTier.color}>
                {renderTierIcon(currentTier.icon, 'w-5 h-5')}
              </div>
              <span className="text-primary font-medium">Current Tier: {currentTier.name}</span>
            </div>
            <div className="text-sm text-green-400 font-bold">
              {currentTier.reward} WEGRAM per referral
            </div>
          </div>
          <div className="text-secondary text-sm">
            {currentTier.name === 'Bronze'
              ? `${referralStats.totalReferrals}/5 referrals to Silver tier`
              : currentTier.name === 'Silver'
              ? `${referralStats.totalReferrals}/20 referrals to Gold tier`
              : 'Maximum tier reached!'
            }
          </div>
        </div>
      </div>

      {/* Tier System */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-primary font-semibold">Reward Tiers</h3>
        </div>

        <div className="space-y-3">
          {referralTiers.map((tier) => (
            <div key={tier.name} className={`p-3 rounded-lg border-2 transition-colors ${
              tier.name === currentTier.name
                ? 'border-purple-500 bg-purple-600 bg-opacity-10'
                : 'border-gray-600 bg-overlay-light'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={tier.color}>
                    {renderTierIcon(tier.icon, 'w-6 h-6')}
                  </div>
                  <div>
                    <div className="text-primary font-medium">{tier.name}</div>
                    <div className="text-secondary text-sm">
                      {tier.maxReferrals ? `${tier.minReferrals}-${tier.maxReferrals}` : `${tier.minReferrals}+`} referrals
                    </div>
                  </div>
                </div>
                <div className="text-green-400 font-bold">
                  {tier.reward} WEGRAM
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral History */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Coins className="w-5 h-5 text-blue-400" />
          <h3 className="text-primary font-semibold">Referral History</h3>
        </div>

        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h4 className="text-primary font-medium mb-2">No referrals yet</h4>
          <p className="text-secondary text-sm">
            When friends join using your referral link, they will appear here with their join date and your earned WEGRAM.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-400" />
          <h3 className="text-primary font-semibold">How It Works</h3>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="text-primary font-medium mb-2">🎯 How Referral Rewards Work</h4>
            <div className="space-y-2 text-secondary">
              <div><strong>1. Share Your Link</strong><br />Share your unique referral link with friends and earn WEGRAM when they join</div>
              <div><strong>2. Friend Signs Up</strong><br />When someone creates an account using your link, they become your referral</div>
              <div><strong>3. Earn WEGRAM</strong><br />You earn WEGRAM tokens for each successful referral based on your tier level</div>
            </div>
          </div>

          <div>
            <h4 className="text-primary font-medium mb-2">💰 Reward Tiers</h4>
            <div className="space-y-1 text-secondary">
              <div><strong>Bronze (0-4 referrals):</strong> 5 WEGRAM per referral</div>
              <div><strong>Silver (5-19 referrals):</strong> 7 WEGRAM per referral</div>
              <div><strong>Gold (20+ referrals):</strong> 10 WEGRAM per referral</div>
            </div>
          </div>

          <div>
            <h4 className="text-primary font-medium mb-2">📋 Terms</h4>
            <div className="space-y-1 text-secondary">
              <div>• Referrals must be genuine new users</div>
              <div>• WEGRAM rewards are credited within 24 hours</div>
              <div>• Self-referrals or fake accounts are not eligible</div>
              <div>• Wegram reserves the right to review suspicious activity</div>
            </div>
          </div>

          <div className="bg-purple-600 bg-opacity-10 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <span className="font-medium">🚀 Start Earning</span>
            </div>
            <div className="text-secondary text-xs mt-1">
              Copy your referral link above and start sharing with friends to earn WEGRAM!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};