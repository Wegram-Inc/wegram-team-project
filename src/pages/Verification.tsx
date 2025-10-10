import React, { useState } from 'react';
import { CheckCircle, Shield, Zap, ArrowRight, Copy, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Verification: React.FC = () => {
  const { isDark } = useTheme();
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const verificationPriceUSD = 2.00; // $2 USD
  const [freeSpots, setFreeSpots] = useState<number>(200);
  const [spotsLeft, setSpotsLeft] = useState<number>(200); // All 200 spots available

  // In real implementation, fetch from database
  React.useEffect(() => {
    // Real implementation would fetch actual count from database
    // setSpotsLeft(actualCountFromDatabase);
  }, []);

  const handleStartVerification = () => {
    if (spotsLeft > 0) {
      // Free verification
      setPaymentStep('processing');
      // In real app, would immediately grant verification badge
      setTimeout(() => {
        setPaymentStep('success');
      }, 2000);
    } else {
      // Paid verification
      setPaymentStep('payment');
    }
  };

  const handleRewardPointsPayment = () => {
    setPaymentStep('processing');
    // In real app, would deduct reward points and grant badge
    setTimeout(() => {
      setPaymentStep('success');
    }, 3000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText('WEGRAM7xK4pJh2mR8qN5vL9cX3tY6wE1oP4qR9mL3v');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
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
        
        {/* Free verification notice with live counter */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg border-2 border-purple-400 shadow-lg">
          <div className="text-white font-bold text-sm mb-1 drop-shadow-lg">🚀 Genesis Launch Special</div>
          <div className="text-white text-xs font-medium drop-shadow-md mb-2">
            First 200 members get verified for FREE!
          </div>
          <div className="flex justify-between items-center">
            <div className="text-white text-xs font-bold">
              {spotsLeft > 0 ? `${spotsLeft} spots left` : 'All free spots claimed'}
            </div>
            <div className="text-white text-xs">
              {spotsLeft > 0 ? '⏰ Limited time' : '💎 Now $2.00'}
            </div>
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
                {spotsLeft > 0 ? 'FREE' : '$2.00 USD'}
              </div>
              <div className="text-secondary text-sm">
                {spotsLeft > 0 ? `${spotsLeft} free spots remaining` : 'One-time payment'}
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

            {spotsLeft > 0 ? (
              <button
                onClick={handleStartVerification}
                className="w-full btn-primary py-3 font-semibold inline-flex items-center justify-center gap-2"
              >
                Get Verified FREE
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleStartVerification}
                className="w-full btn-primary py-3 font-semibold inline-flex items-center justify-center gap-2"
              >
                Pay with Reward Points
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {paymentStep === 'payment' && (
        <div className="card">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold text-primary mb-2">Pay with Reward Points</h3>
            <p className="text-secondary text-sm">
              Use your earned reward points to get verified. You need 200 reward points ($2.00 value).
            </p>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-secondary text-sm mb-2">Cost</label>
              <div className="p-3 bg-overlay-light rounded-lg">
                <div className="text-xl font-bold text-primary">200 Reward Points</div>
                <div className="text-secondary text-sm">($2.00 USD value)</div>
              </div>
            </div>

            <div>
              <label className="block text-secondary text-sm mb-2">Your Balance</label>
              <div className="p-3 bg-overlay-light rounded-lg">
                <div className="text-lg font-semibold text-primary">0 Reward Points</div>
                <div className="text-secondary text-sm">Earn points by posting, liking, and engaging</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRewardPointsPayment}
            disabled={true}
            className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            Insufficient Points - Earn More
          </button>

          <div className="text-center">
            <button
              onClick={() => window.location.href = '/home'}
              className="text-secondary text-sm hover:text-primary transition-colors"
            >
              ← Go back and earn reward points
            </button>
          </div>
        </div>
      )}

      {paymentStep === 'processing' && (
        <div className="card text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center animate-pulse">
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Payment Detected!</h3>
          <p className="text-secondary mb-6">
            We found your payment on the blockchain. Confirming transaction and adding your verification badge...
          </p>
          <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
            <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
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