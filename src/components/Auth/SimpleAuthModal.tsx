// Super Simple X Login Modal with Supabase
import React, { useState } from 'react';
import { X as CloseIcon } from 'lucide-react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';

interface SimpleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleAuthModal: React.FC<SimpleAuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithX } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 🎯 ONE BUTTON, ONE FUNCTION - That's it!
  const handleXLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithX();
      if (result.success) {
        onClose();
        // User will be redirected to X, then back to /auth/callback
        // The useSupabaseAuth hook will automatically handle the rest!
      } else {
        alert(result.error || 'X login failed');
      }
    } catch (error) {
      console.error('X login error:', error);
      alert('X login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative card max-w-sm w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
              alt="WEGRAM Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-2xl border border-purple-400/30"
            />
            <div>
              <h2 className="text-xl font-bold text-primary">WEGRAM</h2>
              <p className="text-secondary text-sm">Web3 SocialFi app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-primary mb-6">Sign in with X</h3>

        {/* 🚀 SINGLE BUTTON - No complexity! */}
        <button
          onClick={handleXLogin}
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-3 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-6 h-6 flex items-center justify-center font-bold text-xl">𝕏</div>
          {isLoading ? 'Connecting to X...' : 'Continue with X'}
        </button>

        <p className="text-xs text-secondary text-center mt-6">
          By continuing you agree to our Terms & Privacy
        </p>
      </div>
    </div>
  );
};




