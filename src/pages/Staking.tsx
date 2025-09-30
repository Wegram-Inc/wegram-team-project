import React from 'react';
import { ArrowLeft, Clock, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Staking: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--bg)' }}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary flex-1">Staking</h1>
      </div>

      <div className="max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
        {/* Coming Soon Content */}
        <div className="px-4 py-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white mb-6">
              <Coins className="w-12 h-12" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold gradient-text mb-4">Staking Coming Soon</h2>
            
            {/* Description */}
            <p className="text-primary text-sm leading-relaxed mb-6">
              We're working hard to bring you the best staking experience. 
              Stake your WEGRAM tokens and earn rewards with flexible staking options.
            </p>
            
            {/* Features Preview */}
            <div className="w-full space-y-4 mb-8">
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div className="text-left">
                    <h4 className="text-primary font-semibold">Flexible Staking</h4>
                  </div>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div className="text-left">
                    <h4 className="text-primary font-semibold">Earn Rewards</h4>
                  </div>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div className="text-left">
                    <h4 className="text-primary font-semibold">Low Fees</h4>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coming Soon Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};