// Super Simple Auth Callback - Supabase handles everything!
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export const SimpleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Supabase automatically handles the OAuth callback!
    // We just need to wait for the auth state to update
    
    if (!loading) {
      if (user) {
        setStatus('success');
        // Navigate to home after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        setStatus('error');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img 
            src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
            alt="WEGRAM Logo" 
            className="w-12 h-12 rounded-xl object-cover shadow-2xl border border-purple-400/30"
          />
          <div>
            <h1 className="text-2xl font-bold text-primary">WEGRAM</h1>
            <p className="text-secondary">Web3 SocialFi</p>
          </div>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <h2 className="text-xl font-semibold text-primary">Completing X login...</h2>
            <p className="text-secondary">Setting up your WEGRAM profile</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary">Welcome to WEGRAM! 🎉</h2>
            <p className="text-secondary">Your X account has been connected successfully</p>
            <p className="text-sm text-secondary">Redirecting to your feed...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary">Authentication Failed</h2>
            <p className="text-secondary">There was an issue connecting your X account</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary w-full py-3"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};




