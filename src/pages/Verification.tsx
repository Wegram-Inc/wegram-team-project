import React, { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Verification: React.FC = () => {
  const { isDark } = useTheme();
  const [paymentStep, setPaymentStep] = useState<'info' | 'success'>('info');

  const handleStartVerification = () => {
    // In real app, would check if user is in first 200 signups
    // If yes: immediately grant verification badge
    // If no: check if user has 200+ reward points, then grant or show insufficient points
    setPaymentStep('success'); // For demo, just show success
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">Get Verified</h1>
        <p className="text-secondary">
          Get your verification badge on WEGRAM for just $2 worth of $WEGRAM tokens.
        </p>
        
        {/* Free verification notice */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg border-2 border-purple-400 shadow-lg">
          <div className="text-white font-bold text-sm mb-1 drop-shadow-lg">🚀 Genesis Launch Special</div>
          <div className="text-white text-xs font-medium drop-shadow-md">
            First 200 WEGRAM signups get verified for FREE!
          </div>
        </div>
      </div>

      {paymentStep === 'info' && (
        <div className="space-y-6">
          {/* Verification Info */}
          <div className="card">
            <div className="text-center mb-6">
              {/* Platinum Badge Preview */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center shadow-xl border-4 border-gray-300">
                <CheckCircle className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Verification Badge</h3>
              <div className="text-3xl font-bold gradient-text mb-1">
                Verification Badge
              </div>
              <div className="text-secondary text-sm">
                First 200 signups: FREE | After: 200 Reward Points
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-secondary text-sm">Verification badge</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-secondary text-sm">Enhanced profile credibility</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-secondary text-sm">Priority support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-secondary text-sm">Exclusive verified features</span>
              </div>
            </div>

            <button
              onClick={handleStartVerification}
              className="w-full btn-primary py-3 font-semibold inline-flex items-center justify-center gap-2"
            >
              Get Verified
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}


      {paymentStep === 'success' && (
        <div className="card text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Verification Complete!</h3>
          <p className="text-secondary mb-6">
            Congratulations! Your verification badge has been added to your profile.
          </p>
          <button
            onClick={() => window.location.href = '/home'}
            className="w-full btn-primary py-3 font-semibold"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};