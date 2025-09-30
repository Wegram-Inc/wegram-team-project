import React from 'react';
import { Search, MessageCircle, Gift, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface TopBarProps {
  onMenuClick: () => void;
  onGiftClick: () => void;
  onMessageClick: () => void;
  onNotificationClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onGiftClick, onMessageClick, onNotificationClick }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
          }`}
          aria-label="Menu"
        >
          <div className="w-5 h-5 flex flex-col justify-center gap-1">
            <div className={`w-full h-0.5 ${isDark ? 'bg-white' : 'bg-gray-800'}`}></div>
            <div className={`w-full h-0.5 ${isDark ? 'bg-white' : 'bg-gray-800'}`}></div>
            <div className={`w-full h-0.5 ${isDark ? 'bg-white' : 'bg-gray-800'}`}></div>
          </div>
        </button>

        {/* Search Field */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search @handle or posts…"
            className="input pl-10 pr-4"
          />
        </div>



        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
          </button>
          <button 
            onClick={onNotificationClick}
            className={`p-2 rounded-lg transition-colors relative ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </button>
          <button 
            onClick={onMessageClick}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Gift Button */}
        <button onClick={onGiftClick} className={`p-2 rounded-lg transition-colors ${
          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
        }`}>
          <Gift className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};