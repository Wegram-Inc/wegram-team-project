import React from 'react';
import { ArrowLeft, Rocket, Zap, TrendingUp, Users, Shield, Star, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export const LaunchToken: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: Rocket,
      title: 'Easy Launch',
      description: 'Deploy your token in minutes with our simple interface'
    },
    {
      icon: Shield,
      title: 'Secure & Audited',
      description: 'Built-in security features and smart contract auditing'
    },
    {
      icon: TrendingUp,
      title: 'Marketing Tools',
      description: 'Integrated promotion and community building features'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Connect directly with your token holders and fans'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Launch Your Token</h1>
            <p className="text-secondary text-sm">Create your own cryptocurrency</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className={`card mb-6 text-center ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-blue-50 to-purple-50'
        }`}>
          <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6">
            <Coins className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-primary mb-4">Launch Your Token</h2>
          <p className="text-secondary mb-6 leading-relaxed">
            Create, deploy, and manage your own cryptocurrency token on the Solana blockchain with WEGRAM's powerful token launchpad.
          </p>

          {/* Coming Soon Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
              : 'bg-gradient-to-r from-purple-500 to-blue-500'
          }`}>
            <Star className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Coming Soon</span>
            <Zap className="w-5 h-5 text-white" />
          </div>

          <p className="text-purple-400 text-sm">
            Get ready to launch your token with zero coding required
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-600 bg-opacity-20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-primary font-semibold mb-2">{feature.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* What You Can Do */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-primary mb-4">What You Can Do</h3>
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark ? 'bg-black bg-opacity-20' : 'bg-gray-100 bg-opacity-70'
            }`}>
              <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">✓</div>
              <span className="text-primary">Create custom token with your branding</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark ? 'bg-black bg-opacity-20' : 'bg-gray-100 bg-opacity-70'
            }`}>
              <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">✓</div>
              <span className="text-primary">Set tokenomics and distribution rules</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark ? 'bg-black bg-opacity-20' : 'bg-gray-100 bg-opacity-70'
            }`}>
              <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">✓</div>
              <span className="text-primary">Launch on Solana with low fees</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark ? 'bg-black bg-opacity-20' : 'bg-gray-100 bg-opacity-70'
            }`}>
              <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">✓</div>
              <span className="text-primary">Integrate with WEGRAM ecosystem</span>
            </div>
          </div>
        </div>

        {/* Notify Me Button */}
        <div className="card text-center">
          <h3 className="text-primary font-semibold mb-4">Be the First to Know</h3>
          <p className="text-secondary text-sm mb-6">
            Get notified when our token launchpad goes live and be among the first creators to launch their tokens.
          </p>
          <button
            onClick={() => alert('🚀 You\'ll be notified when Token Launchpad launches!')}
            className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-3"
          >
            <Zap className="w-5 h-5" />
            Notify Me When Ready
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-secondary text-sm">
            💡 Have questions? Contact our team for early access opportunities
          </p>
        </div>
      </div>
    </div>
  );
};