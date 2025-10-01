import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithRealTwitter } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthorize = async () => {
    setIsLoading(true);
    try {
      // Use REAL Twitter OAuth
      await signInWithRealTwitter();
      // The redirect to Twitter will happen automatically
      // User will come back via /twitter/callback
    } catch (error) {
      console.error('Twitter auth error:', error);
      alert('Failed to start Twitter authentication');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
        </div>
        <div className="text-gray-600 text-sm font-medium">wegram.com</div>
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="w-3/4 h-full bg-blue-500"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* X Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 flex items-center justify-center">
            <div className="text-4xl font-bold">𝕏</div>
          </div>
        </div>

        {/* WEGRAM Logo */}
        <div className="mb-8">
          <img 
            src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
            alt="WEGRAM Logo" 
            className="w-24 h-24 rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Main Text */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-black mb-4">
            WEGRAM wants to access your X account.
          </h1>
        </div>

        {/* Authorization Info */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">𝕏</span>
          </div>
          <p className="text-gray-600 text-sm">
            Connect your X account to get started with WEGRAM
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleAuthorize}
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-full text-lg transition-colors"
          >
            {isLoading ? 'Authorizing...' : 'Authorize with Real X Account'}
          </button>
          
          <button
            onClick={handleCancel}
            className="w-full text-red-500 hover:text-red-600 font-semibold py-4 px-6 text-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="w-full text-gray-500 hover:text-gray-600 font-medium py-2 px-6 text-sm transition-colors"
          >
            Continue as guest (demo mode)
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            Note: Real Twitter auth requires setup in Twitter Developer Portal.<br/>
            See TWITTER_SETUP.md for instructions.
          </p>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="flex items-center justify-center py-4">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};