import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Users } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

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
        <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
          {/* Member Counter */}
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white min-w-[2.5rem] text-center">
            {loading ? '...' : memberCount.toLocaleString()}
          </div>
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center shadow-xl border-4 border-gray-300">
            <CheckCircle className="w-10 h-10 text-gray-600" />
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