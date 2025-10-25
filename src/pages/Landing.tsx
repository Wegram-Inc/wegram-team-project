import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Share, Smartphone } from 'lucide-react';
import { useNeonAuth } from '../hooks/useNeonAuth';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenancePassword, setMaintenancePassword] = useState('');
  const { profile, loading } = useNeonAuth();

  useEffect(() => {
    // Capture referral code from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode) {
      // Store referral code in localStorage for later use during signup
      localStorage.setItem('referralCode', refCode);
      console.log('Referral code captured:', refCode);
    }

    // Redirect logged-in users to home feed
    if (!loading && profile) {
      navigate('/home');
      return;
    }

    // Show install prompt immediately on mobile devices
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      setShowInstallPrompt(true);
    }
  }, [profile, loading, navigate]);

  const handleGuestEntry = () => {
    // Navigate directly to main app as guest
    navigate('/home');
  };

  const handleMaintenanceToggle = async () => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: maintenancePassword })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.maintenance_mode ? 'Site locked for maintenance' : 'Site unlocked');
        setShowMaintenanceModal(false);
        setMaintenancePassword('');
        if (data.maintenance_mode) {
          window.location.reload();
        }
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      alert('Failed to toggle maintenance mode');
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold">WEGRAM</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center">

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="relative mb-6">
            {/* WEGRAM Logo with Gradient Arches */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {/* WEGRAM Logo */}
                <img 
                  src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg" 
                  alt="WEGRAM Logo" 
                  className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-purple-400/30"
                />
              </div>
              
              {/* WEGRAM Text */}
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                WEGRAM
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-gray-300 text-lg mb-12 text-center">
          A Next Gen SocialFi Experience
        </div>

        {/* Main Text */}
        <div className="text-center mb-16">
          <div className="text-5xl font-bold text-white mb-2">
            Connect<span onClick={() => setShowMaintenanceModal(true)} className="cursor-default">.</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">Engage.</div>
          <div className="text-5xl font-bold text-white">Monetize.</div>
        </div>
        {/* Main CTA Button - X Login */}
        <div className="w-full max-w-sm mb-6">
          <button
            onClick={() => navigate('/x-auth')}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg border border-gray-600 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">𝕏</span>
            Continue with X
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center w-full max-w-sm mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600"></span>
          </div>
          <div className="relative bg-black px-4 text-sm text-gray-400">
            OR
          </div>
        </div>

        {/* Email/Password Option */}
        <div className="w-full max-w-sm mb-6">
          <button
            onClick={() => navigate('/email-auth')}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-full text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            Continue with Email
          </button>
        </div>


        {/* Terms */}
        <div className="text-center text-sm text-gray-400 max-w-sm mb-8">
          By entering WEGRAM you agree to our{' '}
          <span className="text-white underline">terms of use</span> and{' '}
          <span className="text-white underline">privacy policy</span>.
        </div>
      </div>

      {/* Install App Popup */}
      {showInstallPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-purple-500/30">
            {/* Close Button */}
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Green Arc */}
            <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"></div>
            </div>

            <div className="p-6 pt-8">
              {/* Header */}
              <div className="text-center mb-6">
                <Smartphone className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Install the app for easier access!
                </h3>
              </div>

              {/* Instructions */}
              <div className="space-y-4 mb-6 text-gray-300 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-white font-semibold">1.</span>
                  <div className="flex items-center gap-2">
                    <span>Tap on the</span>
                    <Share className="w-4 h-4 text-blue-400" />
                    <span>button in the browser menu</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-white font-semibold">2.</span>
                  <span>Scroll down and select add to homescreen</span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-white font-semibold">3.</span>
                  <div className="flex items-center gap-2">
                    <span>Look for the</span>
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs text-white font-bold">W</div>
                    <span>icon on your homescreen</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="w-full py-3 px-6 rounded-full font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' }}
              >
                I already installed the app
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Mode Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Maintenance Mode</h2>
            <input
              type="password"
              value={maintenancePassword}
              onChange={(e) => setMaintenancePassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMaintenanceToggle()}
              placeholder="Enter password"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-600 mb-6 focus:outline-none focus:border-purple-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMaintenanceModal(false);
                  setMaintenancePassword('');
                }}
                className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMaintenanceToggle}
                className="flex-1 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
              >
                Toggle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};