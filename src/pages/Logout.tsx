import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to landing page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-primary mb-4">
            You're logged out
          </h1>

          {/* Message */}
          <p className="text-secondary mb-8">
            Thanks for using WEGRAM! You've been successfully logged out of your account.
          </p>

          {/* Auto-redirect message */}
          <p className="text-secondary text-sm mb-6">
            Redirecting you to the homepage in 3 seconds...
          </p>

          {/* Manual redirect button */}
          <button
            onClick={handleBackToLogin}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};