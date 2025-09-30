import React, { useState } from 'react';
import { X as CloseIcon, Search, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (method: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const { signInWithGoogle, signInWithTwitter } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
      navigate('/home');
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterAuth = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithTwitter();
      if (result.success) {
        onClose();
        navigate('/home');
      } else {
        alert(result.error || 'Twitter authentication failed');
      }
    } catch (error) {
      console.error('Twitter auth error:', error);
      alert('Twitter authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRealTwitterAuth = async () => {
    setIsLoading(true);
    try {
      // Redirect to client's backend for OAuth 2.0 authentication
      window.location.href = 'https://wegram.onrender.com/api/auth/twitter';
    } catch (error) {
      console.error('Real Twitter auth error:', error);
      alert('Failed to start Twitter authentication');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = () => {
    // For now, just close modal - email auth form can be added later
    onClose();
    navigate('/home');
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

        <h3 className="text-lg font-semibold text-primary mb-6">Social signup</h3>

        <div className="space-y-3">
          <button
            onClick={handleGoogleAuth}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4"
          >
            <Search className="w-5 h-5" />
            Continue with Google
          </button>
          <button
            onClick={handleTwitterAuth}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 flex items-center justify-center font-bold text-lg">𝕏</div>
            {isLoading ? 'Connecting...' : 'Continue with X (Demo)'}
          </button>
          <button
            onClick={handleRealTwitterAuth}
            disabled={isLoading}
            className="btn-secondary w-full flex items-center justify-center gap-3 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 flex items-center justify-center font-bold text-lg">𝕏</div>
            {isLoading ? 'Redirecting...' : 'Continue with Real X Account'}
          </button>
          <button
            onClick={handleEmailAuth}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4"
          >
            <Mail className="w-5 h-5" />
            Continue with Email
          </button>
          <button
            onClick={() => onAuth('phone')}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4"
          >
            <Phone className="w-5 h-5" />
            Continue with Phone
          </button>
          
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
            <span className="text-secondary text-sm">or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
          </div>
          
          <button
            onClick={() => onAuth('guest')}
            className="btn-secondary w-full py-4"
          >
            Continue without account
          </button>
        </div>

        <p className="text-xs text-secondary text-center mt-6">
          By continuing you agree to our Terms & Privacy
        </p>
      </div>
    </div>
  );
};