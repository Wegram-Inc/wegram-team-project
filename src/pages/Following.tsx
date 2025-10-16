import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Loader2, UserMinus, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { VerificationBadge } from '../components/VerificationBadge';

interface FollowingUser {
  id: string;
  username: string;
  avatar_url?: string;
  verified?: boolean;
  bio?: string;
  followers_count: number;
  followed_at: string;
}

export const Following: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { profile } = useNeonAuth();

  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unfollowingIds, setUnfollowingIds] = useState<Set<string>>(new Set());
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (profile?.username && username) {
      const cleanUsername = username.replace('@', '');
      const profileUsername = profile.username.replace('@', '');
      setIsOwnProfile(cleanUsername === profileUsername);

      if (cleanUsername === profileUsername) {
        // Viewing own following list
        setTargetUserId(profile.id);
        fetchFollowing(profile.id);
      } else {
        // Viewing someone else's following list - need to get their user ID first
        fetchUserIdByUsername(cleanUsername);
      }
    }
  }, [profile, username]);

  const fetchUserIdByUsername = async (cleanUsername: string) => {
    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(cleanUsername)}`);
      const data = await response.json();

      if (data.success && data.users.length > 0) {
        const user = data.users[0];
        setTargetUserId(user.id);
        fetchFollowing(user.id);
      } else {
        console.error('User not found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false);
    }
  };

  const fetchFollowing = async (userId: string) => {
    try {
      const response = await fetch(`/api/follow?user_id=${userId}&type=following`);
      const data = await response.json();

      if (data.success) {
        setFollowing(data.following || []);
      }
    } catch (error) {
      console.error('Error fetching following list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userToUnfollow: FollowingUser) => {
    if (!profile?.id || !isOwnProfile) return;

    setUnfollowingIds(prev => new Set(prev).add(userToUnfollow.id));

    try {
      const response = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_id: profile.id,
          following_id: userToUnfollow.id
        })
      });

      const data = await response.json();

      if (data.success) {
        // Remove from following list
        setFollowing(prev => prev.filter(user => user.id !== userToUnfollow.id));
      } else {
        alert('Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Failed to unfollow user');
    } finally {
      setUnfollowingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userToUnfollow.id);
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
            <h1 className="font-bold text-lg text-primary">Following</h1>
            <p className="text-sm text-secondary">@{username}</p>
          </div>
        </div>
      </div>

      {/* Following List */}
      <div className="p-4">
        {following.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-semibold text-primary mb-1">No following yet</h3>
            <p className="text-secondary text-sm">
              {isOwnProfile ? "You haven't followed anyone yet." : "This user hasn't followed anyone yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {following.map((user) => (
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
                            <VerificationBadge
                              type={['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(user.username) ? 'platinum' : 'gold'}
                              size="md"
                            />
                          )}
                        </button>

                        {user.bio && (
                          <p className="text-sm text-secondary mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-secondary">
                          <span>{user.followers_count.toLocaleString()} followers</span>
                          <span>Followed {formatFollowDate(user.followed_at)}</span>
                        </div>
                      </div>

                      {/* Unfollow Button - Only show for own profile */}
                      {isOwnProfile && (
                        <button
                          onClick={() => handleUnfollow(user)}
                          disabled={unfollowingIds.has(user.id)}
                          className="ml-3 px-4 py-1.5 rounded-full border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                        >
                          {unfollowingIds.has(user.id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <UserMinus className="w-3 h-3" />
                          )}
                          {unfollowingIds.has(user.id) ? 'Unfollowing...' : 'Unfollow'}
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