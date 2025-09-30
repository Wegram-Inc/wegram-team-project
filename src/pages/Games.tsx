import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Coins, Users, Play, Star, Clock, TrendingUp, Zap, Target, Sword, Crown } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  title: string;
  description: string;
  category: 'strategy' | 'rpg' | 'puzzle' | 'arcade' | 'card' | 'racing';
  players: number;
  earnings: string;
  rating: number;
  thumbnail: string;
  isPlaying: boolean;
  rewards: {
    daily: string;
    weekly: string;
    tournament: string;
  };
  blockchain: 'solana' | 'ethereum' | 'polygon';
  status: 'live' | 'beta' | 'coming-soon';
}

interface Tournament {
  id: string;
  game: string;
  title: string;
  prize: string;
  participants: number;
  maxParticipants: number;
  timeLeft: string;
  entry: string;
  status: 'active' | 'upcoming' | 'ended';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  icon: string;
}

export const Games: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'games' | 'tournaments' | 'achievements' | 'leaderboard'>('games');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [userStats, setUserStats] = useState({
    totalEarnings: 156.78,
    gamesPlayed: 23,
    rank: 847,
    winRate: 68
  });

  // Mock games data
  const games: Game[] = [
    {
      id: '7',
      title: 'WeRunner',
      description: 'Epic anime-style battle runner with stunning visuals',
      category: 'arcade',
      players: 25000,
      earnings: '5-50 SOL/day',
      rating: 4.9,
      thumbnail: '⚡',
      isPlaying: false,
      rewards: {
        daily: '2 SOL',
        weekly: '20 SOL',
        tournament: '500 SOL'
      },
      blockchain: 'solana',
      status: 'live'
    },
    {
      id: '1',
      title: 'Solana Battles',
      description: 'Strategic card battles on Solana blockchain',
      category: 'card',
      players: 12400,
      earnings: '2-15 SOL/day',
      rating: 4.8,
      thumbnail: '⚔️',
      isPlaying: false,
      rewards: {
        daily: '0.5 SOL',
        weekly: '5 SOL',
        tournament: '100 SOL'
      },
      blockchain: 'solana',
      status: 'coming-soon'
    },
    {
      id: '2',
      title: 'DeFi Farmer',
      description: 'Build and manage your DeFi farm empire',
      category: 'strategy',
      players: 8900,
      earnings: '1-8 SOL/day',
      rating: 4.6,
      thumbnail: '🌾',
      isPlaying: false,
      rewards: {
        daily: '0.3 SOL',
        weekly: '3 SOL',
        tournament: '50 SOL'
      },
      blockchain: 'solana',
      status: 'coming-soon'
    },
    {
      id: '3',
      title: 'NFT Racing',
      description: 'Race your NFT cars and earn rewards',
      category: 'racing',
      players: 15600,
      earnings: '3-20 SOL/day',
      rating: 4.9,
      thumbnail: '🏎️',
      isPlaying: false,
      rewards: {
        daily: '0.8 SOL',
        weekly: '8 SOL',
        tournament: '200 SOL'
      },
      blockchain: 'solana',
      status: 'coming-soon'
    },
    {
      id: '4',
      title: 'Crypto Puzzle',
      description: 'Solve puzzles and mine crypto rewards',
      category: 'puzzle',
      players: 6700,
      earnings: '0.5-3 SOL/day',
      rating: 4.4,
      thumbnail: '🧩',
      isPlaying: false,
      rewards: {
        daily: '0.2 SOL',
        weekly: '2 SOL',
        tournament: '25 SOL'
      },
      blockchain: 'solana',
      status: 'coming-soon'
    },
    {
      id: '5',
      title: 'Web3 Warriors',
      description: 'Epic RPG battles in the metaverse',
      category: 'rpg',
      players: 11200,
      earnings: '4-25 SOL/day',
      rating: 4.7,
      thumbnail: '⚡',
      isPlaying: false,
      rewards: {
        daily: '1 SOL',
        weekly: '10 SOL',
        tournament: '300 SOL'
      },
      blockchain: 'solana',
      status: 'coming-soon'
    },
    {
      id: '6',
      title: 'Solana Slots',
      description: 'Classic slots with crypto rewards',
      category: 'arcade',
      players: 4300,
      earnings: '0.1-5 SOL/day',
      rating: 4.2,
      thumbnail: '🎰',
      isPlaying: false,
      rewards: {
        daily: '0.1 SOL',
        weekly: '1 SOL',
        tournament: '15 SOL'
      },
      blockchain: 'solana',
      status: 'coming-soon'
    }
  ];

  // Mock tournaments data
  const tournaments: Tournament[] = [
    {
      id: '1',
      game: 'Solana Battles',
      title: 'Weekly Championship',
      prize: '500 SOL',
      participants: 1247,
      maxParticipants: 2000,
      timeLeft: '2d 14h',
      entry: '5 SOL',
      status: 'active'
    },
    {
      id: '2',
      game: 'NFT Racing',
      title: 'Speed Demons Cup',
      prize: '1000 SOL',
      participants: 892,
      maxParticipants: 1500,
      timeLeft: '5d 8h',
      entry: '10 SOL',
      status: 'active'
    },
    {
      id: '3',
      game: 'DeFi Farmer',
      title: 'Harvest Festival',
      prize: '300 SOL',
      participants: 634,
      maxParticipants: 1000,
      timeLeft: '1d 3h',
      entry: '3 SOL',
      status: 'active'
    },
    {
      id: '4',
      game: 'Web3 Warriors',
      title: 'Beta Launch Tournament',
      prize: '2000 SOL',
      participants: 0,
      maxParticipants: 5000,
      timeLeft: '14d 12h',
      entry: '20 SOL',
      status: 'upcoming'
    }
  ];

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Victory',
      description: 'Win your first game',
      reward: '1 SOL',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      icon: '🏆'
    },
    {
      id: '2',
      title: 'Winning Streak',
      description: 'Win 10 games in a row',
      reward: '5 SOL',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      icon: '🔥'
    },
    {
      id: '3',
      title: 'High Roller',
      description: 'Earn 100 SOL from gaming',
      reward: '10 SOL',
      progress: 156,
      maxProgress: 100,
      unlocked: true,
      icon: '💎'
    },
    {
      id: '4',
      title: 'Tournament Champion',
      description: 'Win a tournament',
      reward: '25 SOL',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      icon: '👑'
    },
    {
      id: '5',
      title: 'Game Master',
      description: 'Play 50 different games',
      reward: '15 SOL',
      progress: 23,
      maxProgress: 50,
      unlocked: false,
      icon: '🎮'
    },
    {
      id: '6',
      title: 'Daily Grinder',
      description: 'Play games for 30 consecutive days',
      reward: '20 SOL',
      progress: 18,
      maxProgress: 30,
      unlocked: false,
      icon: '📅'
    }
  ];

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, username: '@gaming_legend', earnings: '2,456 SOL', games: 156, winRate: 89 },
    { rank: 2, username: '@solana_gamer', earnings: '1,892 SOL', games: 134, winRate: 85 },
    { rank: 3, username: '@defi_player', earnings: '1,567 SOL', games: 98, winRate: 82 },
    { rank: 4, username: '@nft_racer', earnings: '1,234 SOL', games: 87, winRate: 78 },
    { rank: 5, username: '@crypto_warrior', earnings: '1,089 SOL', games: 76, winRate: 75 },
    { rank: 847, username: '@demo_user', earnings: '157 SOL', games: 23, winRate: 68 }
  ];

  const categories = ['all', 'strategy', 'rpg', 'puzzle', 'arcade', 'card', 'racing'];

  const handlePlayGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      // Navigate to WeRunner if it's the WeRunner game
      if (game.title === 'WeRunner') {
        navigate('/werunner');
      } else {
        setSelectedGame(game);
      }
    }
  };

  const handleJoinTournament = (tournamentId: string) => {
    // Wallet integration coming soon
    console.log('Joining tournament:', tournamentId);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      strategy: 'text-blue-400',
      rpg: 'text-purple-400',
      puzzle: 'text-green-400',
      arcade: 'text-orange-400',
      card: 'text-red-400',
      racing: 'text-cyan-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const getCategoryBg = (category: string) => {
    const colors: { [key: string]: string } = {
      strategy: 'bg-blue-400 bg-opacity-10',
      rpg: 'bg-purple-400 bg-opacity-10',
      puzzle: 'bg-green-400 bg-opacity-10',
      arcade: 'bg-orange-400 bg-opacity-10',
      card: 'bg-red-400 bg-opacity-10',
      racing: 'bg-cyan-400 bg-opacity-10'
    };
    return colors[category] || 'bg-gray-400 bg-opacity-10';
  };

  const getStatusColor = (status: Game['status']) => {
    const colors = {
      live: 'text-green-400',
      beta: 'text-orange-400',
      'coming-soon': 'text-purple-400'
    };
    return colors[status];
  };

  const getStatusBg = (status: Game['status']) => {
    const colors = {
      live: 'bg-green-400 bg-opacity-10',
      beta: 'bg-orange-400 bg-opacity-10',
      'coming-soon': 'bg-purple-400 bg-opacity-10'
    };
    return colors[status];
  };

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Web3 Games</h1>
          <p className="text-secondary text-sm">Play, earn, and compete</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="card mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{userStats.totalEarnings}</div>
            <div className="text-secondary text-xs">SOL Earned</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{userStats.gamesPlayed}</div>
            <div className="text-secondary text-xs">Games</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">#{userStats.rank}</div>
            <div className="text-secondary text-xs">Rank</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{userStats.winRate}%</div>
            <div className="text-secondary text-xs">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-1 mb-4 rounded-lg p-1 overflow-x-auto ${
        isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-200 bg-opacity-70'
      }`}>
        {(['games', 'tournaments', 'achievements', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Category Filter (only for games tab) */}
      {activeTab === 'games' && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 min-w-fit ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'games' && (
          <>
            {filteredGames.map((game, index) => (
              <div key={game.id} className={`${game.title === 'WeRunner' ? 'featured-game' : 'card'}`}>
                {game.title === 'WeRunner' && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    FEATURED
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${game.title === 'WeRunner' ? 'w-18 h-18' : 'w-16 h-16'} rounded-lg flex items-center justify-center text-3xl ${
                    game.title === 'WeRunner' 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-md' 
                      : isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}>
                    {game.thumbnail}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`${game.title === 'WeRunner' ? 'text-xl font-bold text-purple-400' : 'text-primary font-semibold'}`}>
                        {game.title}
                      </h3>
                      {game.isPlaying && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className={`${game.title === 'WeRunner' ? 'text-base' : 'text-sm'} text-secondary mb-2`}>{game.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getCategoryBg(game.category)} ${getCategoryColor(game.category)}`}>
                        {game.category.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${getStatusBg(game.status)} ${getStatusColor(game.status)}`}>
                        {game.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-secondary">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{game.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-secondary">Players</div>
                    <div className="text-primary font-medium">{game.players.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-secondary">Earnings</div>
                    <div className="text-primary font-medium">{game.earnings}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                  <div className="text-center p-2 bg-black bg-opacity-20 rounded">
                    <div className="text-secondary">Daily</div>
                    <div className="text-primary font-medium">{game.rewards.daily}</div>
                  </div>
                  <div className="text-center p-2 bg-black bg-opacity-20 rounded">
                    <div className="text-secondary">Weekly</div>
                    <div className="text-primary font-medium">{game.rewards.weekly}</div>
                  </div>
                  <div className="text-center p-2 bg-black bg-opacity-20 rounded">
                    <div className="text-secondary">Tournament</div>
                    <div className="text-primary font-medium">{game.rewards.tournament}</div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlayGame(game.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    game.status === 'coming-soon'
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : game.title === 'WeRunner'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md'
                      : game.isPlaying
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'btn-primary'
                  }`}
                  disabled={game.status === 'coming-soon'}
                >
                  <Play className="w-4 h-4" />
                  {game.status === 'coming-soon' ? 'Coming Soon' : game.isPlaying ? 'Continue Playing' : 'Play Now'}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'tournaments' && (
          <>
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-primary font-semibold">{tournament.title}</h3>
                    <p className="text-secondary text-sm">{tournament.game}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tournament.status === 'active' 
                      ? 'bg-green-400 bg-opacity-10 text-green-400'
                      : tournament.status === 'upcoming'
                      ? 'bg-purple-400 bg-opacity-10 text-purple-400'
                      : 'bg-gray-400 bg-opacity-10 text-gray-400'
                  }`}>
                    {tournament.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-secondary text-sm">Prize Pool</span>
                    </div>
                    <div className="text-primary font-bold text-lg">{tournament.prize}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-secondary text-sm">Time Left</span>
                    </div>
                    <div className="text-primary font-bold text-lg">{tournament.timeLeft}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-secondary">
                      {tournament.participants}/{tournament.maxParticipants} players
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-orange-400" />
                    <span className="text-secondary">Entry: {tournament.entry}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <button
                  onClick={() => handleJoinTournament(tournament.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    tournament.status === 'ended'
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                  disabled={tournament.status === 'ended'}
                >
                  {tournament.status === 'ended' ? 'Tournament Ended' : 'Join Tournament'}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'achievements' && (
          <>
            {achievements.map((achievement) => (
              <div key={achievement.id} className="card">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    achievement.unlocked ? 'bg-yellow-400 bg-opacity-20' : 'bg-gray-700'
                  }`}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${achievement.unlocked ? 'text-yellow-400' : 'text-primary'}`}>
                        {achievement.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Coins className="w-4 h-4 text-orange-400" />
                        <span className="text-primary">{achievement.reward}</span>
                      </div>
                    </div>
                    <p className="text-secondary text-sm mb-3">{achievement.description}</p>
                    
                    {!achievement.unlocked && (
                      <>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-secondary">Progress</span>
                          <span className="text-primary">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                    
                    {achievement.unlocked && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Trophy className="w-4 h-4" />
                        <span>Unlocked!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'leaderboard' && (
          <>
            {leaderboard.map((player) => (
              <div key={player.rank} className={`card ${player.username === '@demo_user' ? 'border-purple-500' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    player.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      : player.username === '@demo_user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {player.rank <= 3 ? (
                      player.rank === 1 ? '👑' : player.rank === 2 ? '🥈' : '🥉'
                    ) : (
                      `#${player.rank}`
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold ${player.username === '@demo_user' ? 'text-purple-400' : 'text-primary'}`}>
                        {player.username}
                      </h3>
                      <div className="text-primary font-bold">{player.earnings}</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-secondary">
                      <span>{player.games} games</span>
                      <span>{player.winRate}% win rate</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-8 card">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-secondary">
            <Zap className="w-4 h-4" />
            <span>24/7 gaming rewards</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Users className="w-4 h-4" />
            <span>45.2K active players</span>
          </div>
        </div>
      </div>

      {/* Game Launch Modal */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-75" onClick={() => setSelectedGame(null)} />
          
          {/* Modal */}
          <div className="relative card max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-xl bg-gray-700 flex items-center justify-center text-4xl mx-auto mb-4">
                {selectedGame.thumbnail}
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">{selectedGame.title}</h2>
              <p className="text-secondary text-sm mb-4">{selectedGame.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="text-center p-3 bg-black bg-opacity-30 rounded-lg">
                  <div className="text-primary font-bold">{selectedGame.players.toLocaleString()}</div>
                  <div className="text-secondary">Players</div>
                </div>
                <div className="text-center p-3 bg-black bg-opacity-30 rounded-lg">
                  <div className="text-primary font-bold">{selectedGame.earnings}</div>
                  <div className="text-secondary">Earnings</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (selectedGame.title === 'WeRunner') {
                    // Open WeRunner game in new tab
                    window.open('/werunner', '_blank');
                  } else {
                    // Game integration coming soon
                    console.log('Launching game:', selectedGame.title);
                  }
                  setSelectedGame(null);
                }}
                className="btn-primary w-full py-4 text-lg font-semibold"
                disabled={selectedGame.status === 'coming-soon'}
              >
                {selectedGame.status === 'coming-soon' ? 'Coming Soon' : '🚀 Launch Game'}
              </button>
              
              <button
                onClick={() => setSelectedGame(null)}
                className="btn-secondary w-full py-3"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 p-3 bg-purple-600 bg-opacity-10 rounded-lg">
              <p className="text-purple-400 text-xs text-center">
                🎮 Coming Soon: Wallet connection and Web3 game integration
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};