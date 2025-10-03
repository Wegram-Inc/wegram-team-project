import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';

export const XAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithRealX } = useNeonAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleXAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      localStorage.removeItem('wegram_user');
      sessionStorage.clear();
      await signInWithRealX();
    } catch (error) {
      console.error('X auth error:', error);
      setError('Failed to start X authentication');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
            alt="WEGRAM Logo" 
            className="w-20 h-20 rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome to WEGRAM
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Connect with X to get started
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* X Auth Button */}
        <button
          type="button"
          onClick={handleXAuth}
          disabled={isLoading}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white font-semibold py-4 px-6 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg border border-gray-600 flex items-center justify-center gap-3 mb-6"
        >
          <span className="text-2xl">𝕏</span>
          {isLoading ? 'Connecting...' : 'Continue with X'}
        </button>

        {/* Alternative Option */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => navigate('/email-auth')}
            className="text-sm text-gray-400 hover:text-white transition-colors underline"
          >
            Sign up with Email instead
          </button>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/landing')}
          className="w-full text-gray-400 hover:text-white font-medium py-2 text-sm transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};
