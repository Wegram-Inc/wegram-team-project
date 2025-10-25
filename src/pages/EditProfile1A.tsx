import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';

export const EditProfile1A: React.FC = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useNeonAuth();

  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editTwitterLink, setEditTwitterLink] = useState('');
  const [editDiscordLink, setEditDiscordLink] = useState('');
  const [editTelegramLink, setEditTelegramLink] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username?.replace('@', '') || '');
      setEditBio(profile.bio || '');
      setEditAvatar(profile.avatar_url || '');
      setEditTwitterLink(profile.twitter_link || '');
      setEditDiscordLink(profile.discord_link || '');
      setEditTelegramLink(profile.telegram_link || '');
    }
  }, [profile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsUpdating(true);
    try {
      // Add https:// to links if missing
      const formatUrl = (url: string) => {
        if (!url) return '';
        url = url.trim();
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      };

      const formattedTwitterLink = formatUrl(editTwitterLink);
      const formattedDiscordLink = formatUrl(editDiscordLink);
      const formattedTelegramLink = formatUrl(editTelegramLink);

      console.log('🔄 Updating profile with:', {
        bio: editBio,
        avatar_url: editAvatar,
        twitter_link: formattedTwitterLink,
        discord_link: formattedDiscordLink,
        telegram_link: formattedTelegramLink
      });

      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: profile.id,
          bio: editBio,
          avatar_url: editAvatar,
          twitter_link: formattedTwitterLink,
          discord_link: formattedDiscordLink,
          telegram_link: formattedTelegramLink
        })
      });

      const result = await response.json();

      console.log('✅ Update result:', result);

      if (result.success) {
        // Refresh profile data to show updated info
        await refreshProfile();
        alert('✅ Profile updated successfully!');
        navigate('/profile');
      } else {
        alert(`❌ Failed to update profile:\n${result.error || 'Unknown error'}\n\nCheck browser console for details.`);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <p className="text-primary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header with Back Button */}
      <div
        className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <button
          onClick={() => navigate('/profile')}
          className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary flex-1">Edit Profile</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="text-center">
            <div className="relative inline-block">
              {editAvatar && (editAvatar.startsWith('http') || editAvatar.startsWith('data:')) ? (
                <img
                  src={editAvatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl mx-auto">
                  {profile.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-secondary text-sm mt-2">Click camera to change photo</p>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-primary font-medium mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="your_username"
                className="w-full p-3 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                maxLength={30}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                @
              </div>
            </div>
            <p className="text-secondary text-xs mt-1">Only letters, numbers, and underscores. {editUsername.length}/30 characters</p>
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-primary font-medium mb-2">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell people about yourself..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary resize-none"
              rows={4}
              maxLength={160}
            />
            <p className="text-secondary text-xs mt-1">{editBio.length}/160 characters</p>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-primary font-semibold">Social Links</h3>
              <div className="h-px bg-gradient-to-r from-purple-500 to-blue-500 flex-1 opacity-30"></div>
            </div>

            {/* Twitter/X Link */}
            <div className="group">
              <label className="block text-primary text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-black dark:bg-white p-0.5 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                X (Twitter)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={editTwitterLink}
                  onChange={(e) => setEditTwitterLink(e.target.value)}
                  placeholder="https://x.com/yourusername"
                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔗
                </div>
              </div>
            </div>

            {/* Discord Link */}
            <div className="group">
              <label className="block text-primary text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-indigo-500 p-0.5 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                </div>
                Discord
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={editDiscordLink}
                  onChange={(e) => setEditDiscordLink(e.target.value)}
                  placeholder="https://discord.gg/yourinvite"
                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔗
                </div>
              </div>
            </div>

            {/* Telegram Link */}
            <div className="group">
              <label className="block text-primary text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 p-0.5 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                Telegram
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={editTelegramLink}
                  onChange={(e) => setEditTelegramLink(e.target.value)}
                  placeholder="https://t.me/yourusername"
                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary placeholder-secondary focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔗
                </div>
              </div>
            </div>

            {/* Helper Text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Pro Tip</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Add your social links to help others connect with you across platforms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-6">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-secondary rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
