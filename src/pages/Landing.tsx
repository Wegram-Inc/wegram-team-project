import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleGuestEntry = () => {
    // Navigate directly to main app as guest
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center">

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="relative mb-6">
            {/* WEGRAM Logo with Gradient Arches */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {/* WEGRAM Logo */}
                <img 
                  src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg" 
                  alt="WEGRAM Logo" 
                  className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-purple-400/30"
                />
              </div>
              
              {/* WEGRAM Text */}
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                WEGRAM
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-gray-300 text-lg mb-12 text-center">
          A Next Gen SocialFi Experience
        </div>

        {/* Main Text */}
        <div className="text-center mb-16">
          <div className="text-5xl font-bold text-white mb-2">Connect.</div>
          <div className="text-5xl font-bold text-white mb-2">Engage.</div>
          <div className="text-5xl font-bold text-white">Monetize.</div>
        </div>

        {/* Main CTA Button - X Login */}
        <div className="w-full max-w-sm mb-6">
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg border border-gray-600 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">𝕏</span>
            Continue with X
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center w-full max-w-sm mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600"></span>
          </div>
          <div className="relative bg-black px-4 text-sm text-gray-400">
            OR
          </div>
        </div>

        {/* Email/Password Option */}
        <div className="w-full max-w-sm mb-6">
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-full text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            Sign up with Email
          </button>
        </div>

        {/* Guest Entry */}
        <div className="mb-8">
          <button
            onClick={handleGuestEntry}
            className="text-gray-400 hover:text-white transition-colors text-sm underline"
          >
            Enter as guest
          </button>
        </div>

        {/* Terms */}
        <div className="text-center text-sm text-gray-400 max-w-sm mb-8">
          By entering WEGRAM you agree to our{' '}
          <span className="text-white underline">terms of use</span> and{' '}
          <span className="text-white underline">privacy policy</span>.
        </div>
      </div>
    </div>
  );
};