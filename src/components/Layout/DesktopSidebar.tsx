import React, { useState } from 'react';
import { Home, TrendingUp, Compass, Gamepad2, MessageCircle, Gift, Bot, Video, Bell, RotateCcw, Bookmark, Coins, Play, ShoppingCart, CheckCircle, LogOut, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { TwoFactorModal } from '../Auth/TwoFactorModal';
import { useAuth } from '../../hooks/useAuth';

export const DesktopSidebar: React.FC = () => {
  const { isDark } = useTheme();
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'launch-token', label: 'Launch Your Token', icon: Coins, path: '/launch-token' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, path: '/home?tab=trending' },
    { id: 'verification', label: 'Get Verified', icon: CheckCircle, path: '/verification' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { id: 'explore', label: 'Explore', icon: Compass, path: '/home?tab=trenches' },
    { id: 'staking', label: 'Staking', icon: Coins, path: '/staking' },
    { id: 'games', label: 'Games', icon: Gamepad2, path: '/games' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, path: '/messages' },
    { id: 'rewards', label: 'Rewards', icon: Gift, path: '/rewards' },
    { id: 'video', label: 'Video', icon: Play, path: '/video' },
    { id: 'ai', label: 'Wegram AI', icon: Bot, path: '/ai' },
    { id: 'livestream', label: 'Livestream', icon: Video, path: '/livestream' },
    { id: 'buy-wegram', label: 'Buy Wegram', icon: ShoppingCart, path: '/buy-wegram' }
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/logout');
    }
  };

  const handleTwoFactorClick = () => {
    setIsTwoFactorModalOpen(true);
  };

  return (
    <>
      <div className="w-full h-full overflow-y-auto flex flex-col border-r-4" style={{ backgroundColor: 'var(--card)', borderColor: isDark ? '#6b7280' : '#9ca3af' }}>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 p-2">
              <img
                src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
                alt="WEGRAM Logo"
                className="w-10 h-10 rounded-xl object-cover shadow-2xl border border-purple-400/30 flex-shrink-0"
              />
              <span className="text-xl font-bold text-primary">WEGRAM</span>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="View Profile"
            >
              <User className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors duration-200"
                    style={{
                      filter: 'drop-shadow(0 0 2px currentColor)',
                      background: 'linear-gradient(135deg, #00D4FF, #9945FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center gap-4 py-4 transition-all duration-200 text-left group ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  } rounded-lg mb-2`}
                >
                  <Icon className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors duration-200"
                        style={{
                          filter: 'drop-shadow(0 0 2px currentColor)',
                          background: 'linear-gradient(135deg, #00D4FF, #9945FF)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }} />
                  <span className="font-medium bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:from-purple-500 group-hover:to-pink-400 transition-all duration-200 bg-clip-text text-transparent">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Security Actions */}
          <div className="mt-auto border-t pt-4 space-y-2" style={{ borderColor: isDark ? '#4b5563' : '#d1d5db' }}>
            <button
              onClick={handleTwoFactorClick}
              className={`w-full flex items-center gap-4 py-4 transition-all duration-200 text-left group ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } rounded-lg`}
            >
              <Shield className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors duration-200"
                    style={{
                      filter: 'drop-shadow(0 0 2px currentColor)',
                      background: 'linear-gradient(135deg, #00D4FF, #9945FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }} />
              <span className="font-medium bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:from-purple-500 group-hover:to-pink-400 transition-all duration-200 bg-clip-text text-transparent">
                2FA Settings
              </span>
            </button>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 py-4 transition-all duration-200 text-left group ${
                isDark ? 'hover:bg-red-700' : 'hover:bg-red-100'
              } rounded-lg`}
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
              <span className="font-medium text-red-400 group-hover:text-red-300 transition-all duration-200">
                Log Out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Factor Modal */}
      <TwoFactorModal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
      />
    </>
  );
};