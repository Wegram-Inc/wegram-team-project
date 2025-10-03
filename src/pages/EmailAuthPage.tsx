import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';

export const EmailAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail } = useNeonAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (mode === 'signup') {
        if (!username || username.length < 3) {
          setError('Username must be at least 3 characters');
          setIsLoading(false);
          return;
        }
        result = await signUpWithEmail(email, password, username);
      } else {
        result = await signInWithEmail(email, password);
      }

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
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
          {mode === 'login' ? 'Welcome back' : 'Join WEGRAM'}
        </h1>
        <p className="text-center text-gray-300 mb-8">
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Choose a username"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
              placeholder="••••••••"
              required
              minLength={8}
            />
            {mode === 'signup' && (
              <p className="text-xs text-gray-400 mt-1">
                At least 8 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Alternative Option */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => navigate('/x-auth')}
            className="text-sm text-gray-400 hover:text-white transition-colors underline"
          >
            Continue with X instead
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
