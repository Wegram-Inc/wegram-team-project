import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Loader2, UserPlus, UserMinus, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';
import goldVerificationIcon from '../assets/gold-verification.png';
import platinumVerificationIcon from '../assets/platinum-verification.png';

interface FollowerUser {
  id: string;
  username: string;
  avatar_url?: string;
  verified?: boolean;
  bio?: string;
  followers_count: number;
  followed_at: string;
}

export const Followers: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { profile } = useNeonAuth();

  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingBack, setFollowingBack] = useState<{ [key: string]: boolean }>({});
  const [actioningIds, setActioningIds] = useState<Set<string>>(new Set());
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [isOwnFollowersList, setIsOwnFollowersList] = useState(false);

  useEffect(() => {
    if (profile?.username && username) {
      const cleanUsername = username.replace('@', '');
      const profileUsername = profile.username.replace('@', '');

      if (cleanUsername === profileUsername) {
        // Viewing own followers list
        setIsOwnFollowersList(true);
        setTargetUserId(profile.id);
        fetchFollowers(profile.id);
      } else {
        // Viewing someone else's followers list
        setIsOwnFollowersList(false);
        fetchUserIdByUsername(cleanUsername);
      }
    }
  }, [profile, username]);

  // Auto-refresh followers list when page becomes visible (for real-time updates)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && targetUserId) {
        fetchFollowers(targetUserId);
      }
    };

    const handleFocus = () => {
      if (targetUserId) {
        fetchFollowers(targetUserId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Set up periodic refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      if (targetUserId && !document.hidden) {
        fetchFollowers(targetUserId);
      }
    }, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [targetUserId]);

  const fetchUserIdByUsername = async (cleanUsername: string) => {
    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(cleanUsername)}`);
      const data = await response.json();

      if (data.success && data.users.length > 0) {
        const user = data.users[0];
        setTargetUserId(user.id);
        fetchFollowers(user.id);
      } else {
        console.error('User not found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false);
    }
  };

  const fetchFollowers = async (userId: string) => {
    try {
      const response = await fetch(`/api/follow?user_id=${userId}&type=followers`);
      const data = await response.json();

      if (data.success) {
        setFollowers(data.followers || []);

        // Check if current user is following back each follower
        if (profile?.id && data.followers) {
          const followingStatus: { [key: string]: boolean } = {};

          for (const follower of data.followers) {
            try {
              // Check if current user (profile.id) is following this follower
              const followResponse = await fetch(`/api/follow?follower_id=${profile.id}&following_id=${follower.id}`);
              const followData = await followResponse.json();
              followingStatus[follower.id] = followData.isFollowing || false;
            } catch (error) {
              followingStatus[follower.id] = false;
            }
          }

          setFollowingBack(followingStatus);
        }
      }
    } catch (error) {
      console.error('Error fetching followers list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (user: FollowerUser) => {
    if (!profile?.id) return;

    setActioningIds(prev => new Set(prev).add(user.id));

    try {
      const isCurrentlyFollowing = followingBack[user.id];
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';

      const response = await fetch('/api/follow', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_id: profile.id,
          following_id: user.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setFollowingBack(prev => ({
          ...prev,
          [user.id]: !isCurrentlyFollowing
        }));
      } else {
        alert(`Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to update follow status');
    } finally {
      setActioningIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(user.id);
        return newSet;
      });
    }
  };

  const handleUserClick = (clickedUsername: string) => {
    const cleanUsername = clickedUsername.replace('@', '');
    navigate(`/user/${cleanUsername}`);
  };

  const formatFollowDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-primary">Followers</h1>
            <p className="text-sm text-secondary">@{username}</p>
          </div>
        </div>
      </div>

      {/* Followers List */}
      <div className="p-4">
        {followers.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-semibold text-primary mb-1">No followers yet</h3>
            <p className="text-secondary text-sm">This user doesn't have any followers yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {followers.map((user) => (
              <div key={user.id} className="card">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <button
                    onClick={() => handleUserClick(user.username)}
                    className="w-12 h-12 rounded-full overflow-hidden hover:scale-105 transition-transform flex-shrink-0"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.username.charAt(1)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => handleUserClick(user.username)}
                          className="flex items-center gap-1 hover:underline"
                        >
                          <span className="font-semibold text-primary truncate">
                            {user.username}
                          </span>
                          {user.verified && (
                            ['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(user.username) ? (
                              <img
                                src={platinumVerificationIcon}
                                alt="Platinum Verified"
                                className="w-4 h-4 shadow-lg flex-shrink-0"
                              />
                            ) : (
                              <img
                                src={goldVerificationIcon}
                                alt="Verified"
                                className="w-4 h-4 shadow-lg flex-shrink-0"
                              />
                            )
                          )}
                        </button>

                        {user.bio && (
                          <p className="text-sm text-secondary mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-secondary">
                          <span>{user.followers_count.toLocaleString()} followers</span>
                          <span>Followed you {formatFollowDate(user.followed_at)}</span>
                        </div>
                      </div>

                      {/* Follow/Unfollow Button - Only show if not own profile */}
                      {profile?.id && user.id !== profile.id && (
                        <button
                          onClick={() => handleFollowToggle(user)}
                          disabled={actioningIds.has(user.id)}
                          className={`ml-3 px-4 py-1.5 rounded-full border transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-1 ${
                            followingBack[user.id]
                              ? 'border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20'
                              : 'border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20'
                          }`}
                        >
                          {actioningIds.has(user.id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : followingBack[user.id] ? (
                            <UserMinus className="w-3 h-3" />
                          ) : (
                            <UserPlus className="w-3 h-3" />
                          )}
                          {actioningIds.has(user.id)
                            ? (followingBack[user.id] ? 'Unfollowing...' : 'Following...')
                            : (followingBack[user.id] ? 'Unfollow' : (isOwnFollowersList ? 'Follow Back' : 'Follow'))
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};