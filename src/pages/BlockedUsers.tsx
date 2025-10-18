import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserX, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { VerificationBadge } from '../components/VerificationBadge';

interface BlockedUser {
  id: string;
  username: string;
  avatar_url?: string;
  verified?: boolean;
  bio?: string;
  blocked_at: string;
}

export const BlockedUsers: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { profile } = useNeonAuth();

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningIds, setActioningIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (profile?.id) {
      fetchBlockedUsers();
    }
  }, [profile]);

  const fetchBlockedUsers = async () => {
    if (!profile?.id) return;

    try {
      const response = await fetch(`/api/block-user?user_id=${profile.id}`);
      const data = await response.json();

      if (data.success) {
        setBlockedUsers(data.blocked_users || []);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId: string) => {
    if (!profile?.id) return;

    setActioningIds(prev => new Set(prev).add(userId));

    try {
      const response = await fetch('/api/block-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocker_id: profile.id,
          blocked_id: userId
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove from list immediately
        setBlockedUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        alert(result.error || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Failed to unblock user. Please try again.');
    } finally {
      setActioningIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleUserClick = (user: BlockedUser) => {
    navigate(`/user/${user.username.replace('@', '')}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-md mx-auto">
          <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--bg)' }}>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-overlay-light transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-lg font-bold text-primary">Blocked Users</h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--bg)' }}>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-overlay-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-primary">Blocked Users</h1>
            <p className="text-xs text-secondary">{blockedUsers.length} blocked</p>
          </div>
        </div>

        {/* Blocked Users List */}
        <div className="px-4 py-4">
          {blockedUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
              <p className="text-secondary">No blocked users</p>
              <p className="text-secondary text-sm mt-1">Users you block will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-overlay-light transition-colors"
                >
                  {/* Avatar */}
                  <button
                    onClick={() => handleUserClick(user)}
                    className="flex-shrink-0"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {user.username?.charAt(1)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* User Info */}
                  <button
                    onClick={() => handleUserClick(user)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-bold text-primary truncate">
                        {user.username?.replace('@', '') || 'Unknown'}
                      </span>
                      {user.verified && <VerificationBadge type="gold" size="sm" />}
                    </div>
                    <p className="text-xs text-secondary truncate">{user.username}</p>
                    {user.bio && (
                      <p className="text-xs text-secondary mt-1 line-clamp-1">{user.bio}</p>
                    )}
                  </button>

                  {/* Unblock Button */}
                  <button
                    onClick={() => handleUnblock(user.id)}
                    disabled={actioningIds.has(user.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {actioningIds.has(user.id) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Unblocking</span>
                      </>
                    ) : (
                      'Unblock'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
