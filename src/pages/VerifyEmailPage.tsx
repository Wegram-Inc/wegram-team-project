import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setStatus('success');
          setMessage(result.message);
          setAlreadyVerified(result.alreadyVerified || false);
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/home');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
            alt="WEGRAM Logo" 
            className="w-20 h-20 rounded-lg object-cover shadow-lg"
          />
        </div>

        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verifying Your Email...
            </h1>
            <p className="text-gray-300">
              Please wait while we verify your email address.
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
            <h1 className="text-2xl font-bold text-white mb-2">
              {alreadyVerified ? 'Already Verified!' : 'Email Verified!'}
            </h1>
            <p className="text-gray-300 mb-6">
              {message}
            </p>
            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Welcome to WEGRAM!</h2>
              <p className="text-sm text-white/90">
                Your account is now fully activated. You can start creating content, connecting with others, and exploring Web3 features.
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Redirecting to WEGRAM in 3 seconds...
            </p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
            >
              Go to WEGRAM Now
            </button>
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
            <h1 className="text-2xl font-bold text-red-500 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-300 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/email-auth')}
                className="w-full px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white rounded-lg font-medium transition-all"
              >
                Try Signing Up Again
              </button>
              <button
                onClick={() => navigate('/landing')}
                className="w-full px-6 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg font-medium transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
