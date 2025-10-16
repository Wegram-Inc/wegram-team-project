// BACKUP: "the long blue thing" - SOL PUMPING banner (the actual one you wanted removed)
// This is the blue gradient banner component that was removed from Home.tsx
// Contains: profile pictures, "SOL PUMPING" text, +24.7% percentage, activity indicator

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SOLPumpingBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/livestream')}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/livestream')}
      role="button"
      tabIndex={0}
      aria-label="View livestream"
      className="relative mb-4 mx-2 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] group focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      <div className="rounded-full p-0.5 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}>
        <div className="rounded-full px-4 py-3" style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}>
          <div className="flex items-center space-x-3">
          {/* Profile Pictures */}
          <div className="flex -space-x-1.5">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face"
              alt="Trader profile"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b73b1eb0?w=400&h=400&fit=crop&crop=face"
              alt="Trader profile"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
              alt="Trader profile"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          </div>

          {/* Crypto Performance Text */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-sm">SOL PUMPING</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-300 font-bold text-sm">+24.7%</span>
              </div>
            </div>
          </div>

          {/* Activity Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">+417</span>
          </div>
        </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-black rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
    </div>
  );
};