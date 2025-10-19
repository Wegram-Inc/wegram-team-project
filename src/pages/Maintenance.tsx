import React from 'react';
import { Settings, Wrench } from 'lucide-react';

export const Maintenance: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
            alt="WEGRAM Logo"
            className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-purple-400/30 animate-pulse"
          />
        </div>

        {/* WEGRAM Text */}
        <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">
          WEGRAM
        </div>

        {/* Icon */}
        <div className="mb-8 flex justify-center gap-4">
          <div className="relative">
            <Settings className="w-16 h-16 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
            <Wrench className="w-8 h-8 text-cyan-400 absolute top-0 right-0" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-5xl font-bold text-white mb-6">
          Down for Maintenance
        </h1>

        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          We're currently performing scheduled maintenance to improve your experience.
        </p>

        <p className="text-lg text-gray-400 mb-12">
          We'll be back online shortly. Thank you for your patience!
        </p>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500">
          Follow us on <span className="text-purple-400 font-semibold">@TheWegramApp</span> for updates
        </div>
      </div>
    </div>
  );
};
