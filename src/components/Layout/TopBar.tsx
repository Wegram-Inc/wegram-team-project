import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageCircle, Gift, Bell, Moon, Sun, X, User } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../../hooks/useNeonAuth';
import { VerificationBadge } from '../VerificationBadge';

interface TopBarProps {
  onMenuClick: () => void;
  onGiftClick: () => void;
  onMessageClick: () => void;
  onNotificationClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onGiftClick, onMessageClick, onNotificationClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useNeonAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch unread notifications count
  const fetchUnreadCount = async () => {
    if (!profile?.id) return;

    try {
      const response = await fetch(`/api/notifications?user_id=${profile.id}`);
      const data = await response.json();

      if (response.ok && data.notifications) {
        const unread = data.notifications.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
    }
  };

  // Fetch unread count when profile loads
  useEffect(() => {
    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [profile?.id]);

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=users`);
      const result = await response.json();
      
      if (response.ok && result.users) {
        setSearchResults(result.users);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = (username: string) => {
    const cleanUsername = username.replace('@', '');
    navigate(`/user/${cleanUsername}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="lg:static lg:bg-opacity-100 lg:backdrop-blur-none fixed top-0 left-0 right-0 z-50 bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="lg:max-w-none lg:mx-0 lg:px-6 lg:py-4 max-w-md mx-auto px-4 py-3 flex items-center gap-3">
        {/* Menu Button - Hidden on desktop since sidebar is always visible */}
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
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
        <div className="flex-1 relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search @handle or posts…"
            className="input pl-10 pr-4"
          />
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-secondary mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user.username)}
                      className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-left transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user.username?.charAt(1)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-primary truncate">
                            {user.username?.replace('@', '')}
                          </p>
                          {user.verified && (
                            <VerificationBadge
                              type={['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(user.username) ? 'platinum' : 'gold'}
                              size="md"
                            />
                          )}
                        </div>
                        <p className="text-sm text-secondary truncate">
                          {user.bio || 'Web3 enthusiast'}
                        </p>
                        <p className="text-xs text-secondary">
                          {(user.followers_count || 0).toLocaleString()} followers
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-4 text-center">
                  <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary">No users found</p>
                  <p className="text-xs text-secondary">Try a different search term</p>
                </div>
              ) : null}
            </div>
          )}
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
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
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