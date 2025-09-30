import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { twitterAuth } from '../lib/twitterAuth';
import { useAuth } from '../hooks/useAuth';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithTwitter } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Twitter OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        // Handle the OAuth callback
        const result = await twitterAuth.handleCallback(code, state);
        
        if (result.success && result.user) {
          // Create profile from Twitter user data
          const twitterProfile = {
            id: result.user.id,
            username: `@${result.user.username}`,
            email: null,
            avatar_url: result.user.profile_image_url || null,
            bio: `Twitter user ${result.user.name}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // Set the user as authenticated
          setStatus('success');
          
          // Navigate to home page after a short delay
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        } else {
          throw new Error(result.error || 'Authentication failed');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
        
        // Navigate back to auth page after error
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm mb-8">
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
        </div>
        <div className="text-gray-600 text-sm font-medium">wegram.com</div>
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>

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

      {/* Status Content */}
      {status === 'loading' && (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-black mb-2">
            Connecting to X...
          </h1>
          <p className="text-gray-600">
            Please wait while we authenticate your account.
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-white text-2xl">✓</div>
          </div>
          <h1 className="text-xl font-bold text-black mb-2">
            Successfully Connected!
          </h1>
          <p className="text-gray-600">
            Your X account has been linked to WEGRAM.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-white text-2xl">✗</div>
          </div>
          <h1 className="text-xl font-bold text-black mb-2">
            Connection Failed
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'There was an error connecting your X account.'}
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="flex items-center justify-center py-4 mt-8">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};
