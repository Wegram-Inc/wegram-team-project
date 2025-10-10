import React, { useState } from 'react';
import { CheckCircle, Shield, Zap, ArrowRight, Copy, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Verification: React.FC = () => {
  const { isDark } = useTheme();
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const verificationPriceUSD = 2.00; // $2 USD
  const [freeSpots, setFreeSpots] = useState<number>(200);
  const [spotsLeft, setSpotsLeft] = useState<number>(147); // Example: 147 spots remaining

  // Mock countdown for free spots - in real implementation, fetch from database
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (spotsLeft > 0) {
        // Simulate spots being taken (random decrease)
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
          setSpotsLeft(prev => Math.max(0, prev - 1));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [spotsLeft]);

  const handleStartVerification = () => {
    setPaymentStep('payment');
    // Automatically start monitoring for payment
    startPaymentMonitoring();
  };

  const startPaymentMonitoring = () => {
    setPaymentStep('processing');
    
    // In a real app, this would monitor the blockchain for incoming transactions
    // For demo purposes, simulating automatic detection after 5 seconds
    setTimeout(() => {
      setPaymentStep('success');
    }, 5000);
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
              <h3 className="text-xl font-bold text-primary mb-2">Platinum Verification Badge</h3>
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
                <span className="text-secondary text-sm">Platinum verification badge</span>
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

      {paymentStep === 'payment' && (
        <div className="card">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold text-primary mb-2">Send Payment</h3>
            <p className="text-secondary text-sm">
              Send exactly $2.00 USD worth of $WEGRAM to the address below. We'll automatically detect your payment and complete verification.
            </p>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-secondary text-sm mb-2">Amount to Send</label>
              <div className="p-3 bg-overlay-light rounded-lg">
                <div className="text-xl font-bold text-primary">$2.00 USD worth of $WEGRAM</div>
              </div>
            </div>

            <div>
              <label className="block text-secondary text-sm mb-2">Payment Address</label>
              <div className="p-3 bg-overlay-light rounded-lg flex items-center justify-between">
                <code className="text-primary text-sm">WEGRAM7xK4pJh2mR8qN5vL9cX3tY6wE1oP4qR9mL3v</code>
                <button
                  onClick={handleCopyAddress}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                  }`}
                >
                  {copiedAddress ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-400 mb-1">Important</div>
                <div className="text-secondary text-sm">
                  Only send $WEGRAM tokens to this address. Sending other tokens will result in permanent loss.
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="animate-pulse text-secondary text-sm mb-2">
              Monitoring blockchain for your payment...
            </div>
            <div className="text-xs text-secondary opacity-75">
              This usually takes 1-2 minutes
            </div>
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