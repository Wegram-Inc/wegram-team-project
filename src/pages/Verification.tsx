import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Users } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { VerificationBadge } from '../components/VerificationBadge';

export const Verification: React.FC = () => {
  const { isDark } = useTheme();
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await fetch('/api/member-count');
        const data = await response.json();
        if (data.success) {
          setMemberCount(data.member_count);
        }
      } catch (error) {
        console.error('Error fetching member count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberCount();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        {/* Member Counter */}
        <div className="mb-6 inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
          <Users className="w-4 h-4" />
          <span className="text-sm font-bold">
            {loading ? 'Loading...' : `${memberCount.toLocaleString()} Members`}
          </span>
        </div>

        {/* Large Custom Verification Badge */}
        <div className="w-40 h-40 mx-auto mb-6 relative animate-pulse">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="largeGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="25%" style={{ stopColor: '#FFED4B', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                <stop offset="75%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FF6B00', stopOpacity: 1 }} />
              </linearGradient>
              <radialGradient id="innerGlow">
                <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.4 }} />
                <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Outer ring */}
            <circle
              cx="60"
              cy="60"
              r="58"
              fill="url(#largeGoldGradient)"
              stroke="white"
              strokeWidth="4"
              filter="url(#glow)"
            />

            {/* Inner gradient circle for depth */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="url(#largeGoldGradient)"
              opacity="0.9"
            />

            {/* Inner glow effect */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="url(#innerGlow)"
            />

            {/* Large checkmark */}
            <path
              d="M35 60l15 15 30-30"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#glow)"
            />

            {/* Subtle inner checkmark for depth */}
            <path
              d="M35 60l15 15 30-30"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">Get Verified</h1>
        <p className="text-secondary">
          Get your verification badge on WEGRAM for just $2 worth of $WEGRAM tokens.
        </p>
        
        {/* Free verification notice */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg border-2 border-purple-400 shadow-lg">
          <div className="text-white font-bold text-sm mb-1 drop-shadow-lg">🚀 Genesis Launch Special</div>
          <div className="text-white text-xs font-medium drop-shadow-md">
            First 200 WEGRAM signups get verified for FREE!
          </div>
        </div>
      </div>

      {/* Verification Info */}
      <div className="card">
        <div className="text-center mb-6">
          {/* Badge Preview */}
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xl"
            >
              <defs>
                <linearGradient id="cardGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                  <stop offset="33%" style={{ stopColor: '#FFED4B', stopOpacity: 1 }} />
                  <stop offset="66%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Main circle */}
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="url(#cardGoldGradient)"
                stroke="white"
                strokeWidth="3"
              />

              {/* Checkmark */}
              <path
                d="M30 50l12 12 24-24"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Verification Badge</h3>
          <div className="text-secondary text-sm">
            First 200 signups: FREE | After: 200 Reward Points
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-secondary text-sm">Verification badge on your profile</span>
          </div>
        </div>

        <button
          disabled={true}
          className="w-full btn-primary py-3 font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pay with Reward Points (200 points)
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};