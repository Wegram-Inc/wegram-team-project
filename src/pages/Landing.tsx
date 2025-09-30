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

        {/* CTA Button */}
        <div className="w-full max-w-sm mb-8">
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Enter WEGRAM With 𝕏
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