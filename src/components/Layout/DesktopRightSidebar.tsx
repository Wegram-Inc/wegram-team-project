import React from 'react';
import { TrendingUp, Gamepad2, Video, ExternalLink } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

export const DesktopRightSidebar: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Mock trending data
  const trendingTopics = [
    { tag: '#WegramToken', posts: '12.5K' },
    { tag: '#DeFi', posts: '8.2K' },
    { tag: '#SolanaEcosystem', posts: '6.8K' },
    { tag: '#CryptoNews', posts: '5.1K' },
    { tag: '#WegramAI', posts: '3.9K' }
  ];

  // Mock game data
  const gameHighlights = [
    { name: 'WeRunner', players: '2.1K', status: 'Live' },
    { name: 'Crypto Quest', players: '1.8K', status: 'Beta' },
    { name: 'Token Tower', players: '1.2K', status: 'Coming Soon' }
  ];

  // Mock livestream data
  const liveStreams = [
    { title: 'DeFi Deep Dive', viewers: '845', streamer: '@cryptoexpert' },
    { title: 'Solana Updates', viewers: '623', streamer: '@solanadev' },
    { title: 'Trading Tips', viewers: '412', streamer: '@traderpro' }
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-6" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Trending Section */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-primary">Trending</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
              style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
              onClick={() => navigate('/trending')}
            >
              <div>
                <p className="font-medium text-primary">{topic.tag}</p>
                <p className="text-xs text-secondary">{topic.posts} posts</p>
              </div>
              <ExternalLink className="w-4 h-4 text-secondary" />
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/trending')}
          className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Show more trending
        </button>
      </div>

      {/* Games Section */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 className="w-5 h-5 text-green-400" />
          <h3 className="font-bold text-primary">Games</h3>
        </div>
        <div className="space-y-3">
          {gameHighlights.map((game, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
              style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
              onClick={() => navigate('/games')}
            >
              <div>
                <p className="font-medium text-primary">{game.name}</p>
                <p className="text-xs text-secondary">{game.players} players</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                game.status === 'Live' ? 'bg-green-500 text-white' :
                game.status === 'Beta' ? 'bg-yellow-500 text-black' :
                'bg-gray-500 text-white'
              }`}>
                {game.status}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/games')}
          className="w-full mt-4 py-2 text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          View all games
        </button>
      </div>

      {/* Livestream Section */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-primary">Live Streams</h3>
        </div>
        <div className="space-y-3">
          {liveStreams.map((stream, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
              style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
              onClick={() => navigate('/livestream')}
            >
              <div>
                <p className="font-medium text-primary text-sm">{stream.title}</p>
                <p className="text-xs text-secondary">{stream.streamer}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-secondary">{stream.viewers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/livestream')}
          className="w-full mt-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          View all streams
        </button>
      </div>
    </div>
  );
};