import React, { useState } from 'react';
import { Gift, Calendar, Users, Trophy, Zap, Star, Clock, CheckCircle, Copy, Coins, Target, Heart, MessageCircle, PenTool, ThumbsUp, Lock, Flame } from 'lucide-react';
import { mockRewards, Reward } from '../data/mockData';
import { useTheme } from '../hooks/useTheme';

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  icon: string;
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
  icon: string;
}

export const Rewards: React.FC = () => {
  const { isDark } = useTheme();
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [activeTab, setActiveTab] = useState<'daily' | 'achievements' | 'referrals'>('daily');
  const [linkCopied, setLinkCopied] = useState(false);

  // Mock achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Create your first post',
      reward: '5 WGM',
      progress: 1,
      maxProgress: 1,
      completed: true,
      icon: 'target'
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Get 10 likes on your posts',
      reward: '15 WGM',
      progress: 7,
      maxProgress: 10,
      completed: false,
      icon: 'heart'
    },
    {
      id: '3',
      title: 'Engagement Master',
      description: 'Comment on 25 posts',
      reward: '25 WGM',
      progress: 12,
      maxProgress: 25,
      completed: false,
      icon: 'message'
    },
    {
      id: '4',
      title: 'Generous Giver',
      description: 'Send 50 WGM in gifts',
      reward: '100 WGM',
      progress: 23,
      maxProgress: 50,
      completed: false,
      icon: 'gift'
    },
    {
      id: '5',
      title: 'Streak Master',
      description: 'Login for 30 consecutive days',
      reward: '200 WGM',
      progress: 18,
      maxProgress: 30,
      completed: false,
      icon: 'flame'
    }
  ];

  // Mock daily tasks
  const dailyTasks: DailyTask[] = [
    {
      id: '1',
      title: 'Daily Check-in',
      description: 'Open the app and claim your daily bonus',
      reward: '2 WGM',
      completed: false,
      icon: 'calendar'
    },
    {
      id: '2',
      title: 'Create a Post',
      description: 'Share something with the community',
      reward: '5 WGM',
      completed: true,
      icon: 'pen'
    },
    {
      id: '3',
      title: 'Like 5 Posts',
      description: 'Show some love to other creators',
      reward: '3 WGM',
      completed: false,
      icon: 'thumbsup'
    },
    {
      id: '4',
      title: 'Send a Gift',
      description: 'Support a creator with a gift',
      reward: '10 WGM',
      completed: false,
      icon: 'gift'
    }
  ];

  const handleClaim = (rewardId: string) => {
    setRewards(rewards.map(reward => 
      reward.id === rewardId 
        ? { ...reward, claimed: true }
        : reward
    ));
  };

  const handleTaskComplete = (taskId: string) => {
    // In real app, this would update the backend
    console.log('Completing task:', taskId);
    alert('Task completed! Reward claimed.');
  };

  const handleGetLink = () => {
    const referralLink = 'https://wegram.com/invite/demo123';
    navigator.clipboard?.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const totalEarned = 156.5; // Mock total earnings
  const todayEarned = 12.5; // Mock today's earnings
  const streakDays = 7; // Mock streak

  // Function to render icon based on icon string
  const renderIcon = (iconString: string, size: string = 'w-6 h-6') => {
    const iconProps = { className: size };
    
    switch (iconString) {
      case 'target':
        return <Target {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'message':
        return <MessageCircle {...iconProps} />;
      case 'gift':
        return <Gift {...iconProps} />;
      case 'flame':
        return <Flame {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'pen':
        return <PenTool {...iconProps} />;
      case 'thumbsup':
        return <ThumbsUp {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Rewards</h1>
          <p className="text-secondary text-sm">Earn WGM by staying active</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="card mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{totalEarned}</div>
            <div className="text-secondary text-sm">Total Earned</div>
            <div className="text-xs text-green-400">WGM</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{todayEarned}</div>
            <div className="text-secondary text-sm">Today</div>
            <div className="text-xs text-blue-400">WGM</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{streakDays}</div>
            <div className="text-secondary text-sm">Day Streak</div>
            <div className="text-xs text-orange-400 flex items-center justify-center">
              <Flame className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-1 mb-6 rounded-lg p-1 ${
        isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-200 bg-opacity-70'
      }`}>
        {(['daily', 'achievements', 'referrals'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
            }`}
          >
            {tab === 'daily' && <Calendar className="w-4 h-4 inline mr-2" />}
            {tab === 'achievements' && <Trophy className="w-4 h-4 inline mr-2" />}
            {tab === 'referrals' && <Users className="w-4 h-4 inline mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'daily' && (
          <>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-primary font-semibold">Daily Tasks</h3>
                <div className="ml-auto text-sm text-secondary">
                  {dailyTasks.filter(t => t.completed).length}/{dailyTasks.length} completed
                </div>
              </div>
              
              <div className="space-y-3">
                {dailyTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-overlay-light rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400">{renderIcon(task.icon, 'w-6 h-6')}</div>
                      <div>
                        <h4 className="text-primary font-medium">{task.title}</h4>
                        <p className="text-secondary text-sm">{task.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-sm">{task.reward}</div>
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto mt-1" />
                      ) : (
                        <button
                          onClick={() => handleTaskComplete(task.id)}
                          className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legacy Daily Rewards */}
            {rewards.filter(r => r.type === 'daily').map(reward => (
              <div key={reward.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-primary font-semibold mb-1">{reward.title}</h3>
                    <p className="text-green-400 font-bold">{reward.amount}</p>
                  </div>
                  <button
                    onClick={() => handleClaim(reward.id)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      reward.claimed 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'btn-primary'
                    }`}
                    disabled={reward.claimed}
                  >
                    {reward.claimed ? 'Claimed' : 'Claim'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'achievements' && (
          <>
            {achievements.map((achievement) => (
              <div key={achievement.id} className="card">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    achievement.completed 
                      ? 'bg-yellow-400 bg-opacity-20' 
                      : isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}>
                    {achievement.completed ? (
                      <div className="text-purple-400">{renderIcon(achievement.icon, 'w-6 h-6')}</div>
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${achievement.completed ? 'text-yellow-400' : 'text-primary'}`}>
                        {achievement.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Coins className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-bold">{achievement.reward}</span>
                      </div>
                    </div>
                    <p className="text-secondary text-sm mb-3">{achievement.description}</p>
                    
                    {!achievement.completed && (
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
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                    
                    {achievement.completed && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Trophy className="w-4 h-4" />
                        <span>Completed!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'referrals' && (
          <>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-primary font-semibold">Invite Friends</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-secondary text-sm mb-4">
                  Earn 10 WGM for each friend who joins using your link!
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://wegram.com/invite/demo123"
                    readOnly
                    className="input flex-1 text-sm bg-overlay-medium"
                  />
                  <button
                    onClick={handleGetLink}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      linkCopied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-overlay-light rounded-lg">
                  <div className="text-2xl font-bold text-green-400">3</div>
                  <div className="text-secondary text-sm">Friends Joined</div>
                  <div className="text-xs text-green-400">+30 WGM earned</div>
                </div>
                <div className="text-center p-4 bg-overlay-light rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">1</div>
                  <div className="text-secondary text-sm">Pending</div>
                  <div className="text-xs text-purple-400">+10 WGM potential</div>
                </div>
              </div>
            </div>

            {/* Legacy Invite Rewards */}
            {rewards.filter(r => r.type === 'invite').map(reward => (
              <div key={reward.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-primary font-semibold mb-1">{reward.title}</h3>
                    <p className="text-green-400 font-bold">{reward.amount}</p>
                  </div>
                  <button
                    onClick={handleGetLink}
                    className="btn-primary px-6 py-2"
                  >
                    Get Link
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Bottom Info */}
      <div className="mt-8 card">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-secondary">
            <Clock className="w-4 h-4" />
            <span>Rewards reset daily at midnight</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Star className="w-4 h-4" />
            <span>More rewards coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};