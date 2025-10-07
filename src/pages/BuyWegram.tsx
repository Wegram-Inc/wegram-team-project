import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, ShoppingCart, TrendingUp, Zap, Shield, Users, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export const BuyWegram: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // WEGRAM token details
  const tokenAddress = "Coming Soon"; // Replace with actual token address
  const currentPrice = 0.00; // USD
  const marketCap = 0; // USD
  const volume24h = 0; // USD
  const priceChange24h = 0; // Percentage
  
  const handleBuyOnRaydium = () => {
    // Direct link to Raydium swap with WEGRAM token
    const raydiumUrl = `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${tokenAddress}`;
    window.open(raydiumUrl, '_blank');
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(tokenAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleViewChart = () => {
    // Link to DEX Screener or similar for price chart
    const chartUrl = `https://dexscreener.com/solana/${tokenAddress}`;
    window.open(chartUrl, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
              alt="WEGRAM Logo" 
              className="w-12 h-12 rounded-xl object-cover shadow-2xl border border-purple-400/30"
            />
            <div className="text-2xl font-bold gradient-text">Buy WEGRAM</div>
          </div>
        </div>

        {/* Token Info Card */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center">
              <img 
                src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
                alt="WEGRAM" 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">WEGRAM</h2>
              <p className="text-secondary">$WGM</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-2xl font-bold text-primary">${currentPrice}</div>
              <div className={`text-sm flex items-center gap-1 ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp className="w-4 h-4" />
                {priceChange24h >= 0 ? '+' : ''}{priceChange24h}%
              </div>
            </div>
          </div>

          {/* Token Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-overlay-light rounded-lg">
              <div className="text-lg font-bold text-primary">${marketCap.toFixed(2)}</div>
              <div className="text-secondary text-sm">Market Cap</div>
            </div>
            <div className="text-center p-3 bg-overlay-light rounded-lg">
              <div className="text-lg font-bold text-primary">${volume24h.toFixed(2)}</div>
              <div className="text-secondary text-sm">24h Volume</div>
            </div>
          </div>

          {/* Token Address */}
          <div className="mb-6">
            <label className="block text-secondary text-sm mb-2">Token Address:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenAddress}
                readOnly
                className="input flex-1 text-sm bg-overlay-medium font-mono"
              />
              <button
                onClick={handleCopyAddress}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  copiedAddress 
                    ? 'bg-green-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Buy Button */}
          <button
            onClick={handleBuyOnRaydium}
            className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 mb-4"
          >
            <ShoppingCart className="w-5 h-5" />
            Buy on Raydium
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleViewChart}
              className="btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              View Chart
            </button>
            <button
              onClick={() => alert('Add to watchlist feature coming soon!')}
              className="btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Watchlist
            </button>
          </div>
        </div>

        {/* Why Buy WEGRAM */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-primary mb-4">Why Buy WEGRAM?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 bg-opacity-20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-primary font-semibold">Earn While Social</h4>
                <p className="text-secondary text-sm">Get rewarded for posting, engaging, and building your community</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-primary font-semibold">Governance Rights</h4>
                <p className="text-secondary text-sm">Vote on platform decisions and shape the future of Web3 social</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-primary font-semibold">Exclusive Features</h4>
                <p className="text-secondary text-sm">Access premium features, early releases, and special events</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Buy Guide */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-primary mb-4">How to Buy</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-overlay-light rounded-lg">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">1</div>
              <span className="text-primary">Connect your Solana wallet to Raydium</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-overlay-light rounded-lg">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">2</div>
              <span className="text-primary">Swap SOL for WEGRAM tokens</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-overlay-light rounded-lg">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">3</div>
              <span className="text-primary">Start earning rewards on WEGRAM!</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="card bg-yellow-600 bg-opacity-10 border-yellow-600">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2">Important Notice</h4>
              <p className={`text-sm ${
                isDark ? 'text-yellow-200' : 'text-yellow-800'
              }`}>
                Cryptocurrency investments carry risk. Only invest what you can afford to lose. 
                WEGRAM tokens are utility tokens for the WEGRAM platform. This is not financial advice.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => window.open('https://raydium.io', '_blank')}
            className="btn-secondary py-3 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Raydium DEX
          </button>
          <button
            onClick={() => window.open('https://solscan.io', '_blank')}
            className="btn-secondary py-3 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View on Solscan
          </button>
        </div>
      </div>
    </div>
  );
};