import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Phone, Video, CheckCircle } from 'lucide-react';

interface UserProfileData {
  username: string;
  displayName: string;
  bio: string;
  joinDate: string;
  followers: number;
  avatar: string;
  verified: boolean;
}

// Mock user data for the chat recipient
const mockUsers: { [key: string]: UserProfileData } = {
  'vis': {
    username: 'vis',
    displayName: 'VIS',
    bio: 'Visionary | Former Operations Analyst | Human Terrain-Mapping and Behavior Pattern Recognition Specialist',
    joinDate: 'June 2021',
    followers: 3100,
    avatar: 'V',
    verified: true,
  },
  'alexchen': {
    username: 'alexchen',
    displayName: 'Alex Chen',
    bio: 'Web3 enthusiast and NFT collector.',
    joinDate: 'Jan 2023',
    followers: 1200,
    avatar: 'A',
    verified: false,
  },
  'cryptorap': {
    username: 'cryptorap',
    displayName: 'Crypto Rap',
    bio: 'Rapping about crypto and Web3. Making blockchain music that hits different! 🎵',
    joinDate: 'March 2022',
    followers: 8900,
    avatar: 'CR',
    verified: true,
  },
};

export const DirectMessage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // Mock user data - use the mockUsers data or fallback
  const user = mockUsers[username || 'cryptorap'] || {
    username: `@${username}`,
    displayName: username?.toUpperCase() || 'USER',
    bio: 'Web3 enthusiast and content creator.',
    joinDate: 'June 2021',
    followers: 3100,
    avatar: username?.charAt(0)?.toUpperCase() || 'U',
    verified: false,
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Handle message sending here
    setMessage('');
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--bg)' }}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div className="flex-1"></div> {/* Empty space to balance the back button */}
      </div>

      <div className="max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
        {/* User Profile Info */}
        <div className="px-4 py-6">
          {/* Centered Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
              {user.avatar}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold gradient-text">{user.displayName}</h2>
              {user.verified && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-primary text-sm leading-relaxed text-center mb-2">Visionary | Former Operations Analyst | Human<br />Terrain-Mapping and Behavior Pattern<br />Recognition Specialist</p>
            <p className="text-xs text-secondary">Joined {user.joinDate} • {user.followers.toLocaleString()} Followers</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="px-4 py-4">
          <div className="space-y-2">
            {/* Message from other user */}
            <div className="flex justify-start">
              <div className="max-w-xs px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700">
                <p className="text-xs">Hey! How are you doing today?</p>
                <div className="text-xs mt-0.5 text-secondary opacity-70">08:15</div>
              </div>
            </div>
            
            {/* Your message */}
            <div className="flex justify-end">
              <div className="max-w-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <p className="text-xs">I'm doing great, thanks for asking!</p>
                <div className="text-xs mt-0.5 text-blue-100 opacity-70">08:20</div>
              </div>
            </div>
            
            {/* Message from other user */}
            <div className="flex justify-start">
              <div className="max-w-xs px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700">
                <p className="text-xs">That's awesome! What are you working on?</p>
                <div className="text-xs mt-0.5 text-secondary opacity-70">08:22</div>
              </div>
            </div>
            
            {/* Your message */}
            <div className="flex justify-end">
              <div className="max-w-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <p className="text-xs">Just some new features for the app. How about you?</p>
                <div className="text-xs mt-0.5 text-blue-100 opacity-70">08:25</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input - Card Container */}
        <div className="p-4">
          <div className="card p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <button
                type="button"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Start a message"
                className="input flex-1"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};