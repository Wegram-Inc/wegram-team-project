// Twitter OAuth Callback Page
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const TwitterCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleTwitterCallback } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setError(`Twitter authentication failed: ${error}`);
          setStatus('error');
          return;
        }

        if (!code || !state) {
          setError('Missing authorization code or state parameter');
          setStatus('error');
          return;
        }

        const result = await handleTwitterCallback(code, state);
        
        if (result.success) {
          setStatus('success');
          // Redirect to home after successful authentication
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        } else {
          setError(result.error || 'Twitter authentication failed');
          setStatus('error');
        }
      } catch (err) {
        console.error('Twitter callback error:', err);
        setError('An unexpected error occurred during authentication');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, handleTwitterCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-surface rounded-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Authenticating with Twitter...
              </h2>
              <p className="text-secondary">
                Please wait while we complete your authentication.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 text-green-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Authentication Successful!
              </h2>
              <p className="text-secondary mb-4">
                You have been successfully authenticated with Twitter.
              </p>
              <p className="text-sm text-secondary">
                Redirecting to WEGRAM...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 text-red-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-red-500 mb-2">
                Authentication Failed
              </h2>
              <p className="text-secondary mb-4">
                {error}
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary px-6 py-2"
              >
                Return to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};