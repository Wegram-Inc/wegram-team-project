import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus, Settings, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { useTheme } from '../hooks/useTheme';
import goldVerificationIcon from '../assets/gold-verification.png';
import platinumVerificationIcon from '../assets/platinum-verification.png';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
  post_id?: string;
  from_username?: string;
  from_avatar_url?: string;
  post_content?: string;
  verified?: boolean;
}

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useNeonAuth();
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profile?.id) return;

      try {
        const response = await fetch(`/api/notifications?user_id=${profile.id}`);
        const data = await response.json();

        if (response.ok) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [profile?.id]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_ids: [notificationId] })
      });

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!profile?.id) return;

    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all_read: true, user_id: profile.id })
      });

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Get notification icon and color based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow': return { icon: UserPlus, color: 'text-purple-400', bg: 'bg-purple-600' };
      case 'like': return { icon: Heart, color: 'text-red-400', bg: 'bg-red-600' };
      case 'comment': return { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-600' };
      case 'message': return { icon: MessageCircle, color: 'text-cyan-400', bg: 'bg-cyan-600' };
      default: return { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-600' };
    }
  };

  // Format time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Notifications</h1>
            <p className="text-secondary text-sm">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
        </div>

        {/* Settings and Actions */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => navigate('/notification-settings')}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Settings className="w-5 h-5 text-secondary" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">No notifications yet</h3>
          <p className="text-secondary">
            When people interact with your posts, you'll see notifications here.
          </p>
        </div>
      ) : (
        /* Notifications List */
        <div className="space-y-3">
          {notifications.map((notification) => {
            const { icon: Icon, color, bg } = getNotificationIcon(notification.type);

            return (
              <div
                key={notification.id}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`card transition-all cursor-pointer ${
                  !notification.read
                    ? 'bg-purple-600 bg-opacity-5 border-purple-500 border-opacity-30'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Profile Avatar */}
                  <div className="flex-shrink-0">
                    {notification.from_avatar_url ? (
                      <img
                        src={notification.from_avatar_url}
                        alt={notification.from_username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {notification.from_username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Notification Message */}
                    <p className="text-primary text-sm flex items-center gap-1 flex-wrap">
                      <span className="font-semibold">
                        {notification.from_username?.startsWith('@') ? notification.from_username : `@${notification.from_username}`}
                      </span>
                      {notification.verified && (
                        ['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(notification.from_username || '') ? (
                          <img
                            src={platinumVerificationIcon}
                            alt="Platinum Verified"
                            className="w-3 h-3 shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <img
                            src={goldVerificationIcon}
                            alt="Verified"
                            className="w-3 h-3 shadow-sm flex-shrink-0"
                          />
                        )
                      )}
                      <span>{notification.message}</span>
                    </p>

                    {/* Post Content Preview */}
                    {notification.post_content && (
                      <p className="text-secondary text-xs mt-1 truncate">
                        "{notification.post_content}"
                      </p>
                    )}

                    {/* Time */}
                    <p className="text-secondary text-xs mt-1">
                      {getTimeAgo(notification.created_at)}
                    </p>
                  </div>

                  {/* Notification Type Icon */}
                  <div className={`w-8 h-8 rounded-full ${bg} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};