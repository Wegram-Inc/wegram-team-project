import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, MessageCircle, Heart, Eye, Share2, TrendingUp, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
  totalShares: number;
  totalFollows: number;
  emailUsers: number;
  xUsers: number;
  activeUsersLast7Days: number;
  postsToday: number;
  avgPostsPerUser: number;
  engagementRate: number;
  totalEngagement: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin-stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-primary mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <p className="text-primary">Failed to load stats</p>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    gradient,
    subtitle
  }: {
    title: string;
    value: number | string;
    icon: any;
    gradient: string;
    subtitle?: string;
  }) => (
    <div
      className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-200"
      style={{ background: gradient }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-white text-3xl font-bold">{value.toLocaleString()}</h3>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 px-4 py-4 backdrop-blur-md bg-opacity-95"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-secondary text-sm">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            subtitle={`${stats.emailUsers} email users`}
          />
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={FileText}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            subtitle={`${stats.postsToday} posts today`}
          />
          <StatCard
            title="Total Comments"
            value={stats.totalComments}
            icon={MessageCircle}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
          <StatCard
            title="Total Likes"
            value={stats.totalLikes}
            icon={Heart}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={Eye}
            gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
          />
          <StatCard
            title="Total Shares"
            value={stats.totalShares}
            icon={Share2}
            gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
          />
          <StatCard
            title="Total Follows"
            value={stats.totalFollows}
            icon={TrendingUp}
            gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
          />
        </div>

        {/* Activity & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">Activity Metrics</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-white/80 text-sm">Active Users (7 days)</span>
                <span className="text-white font-bold text-lg">{stats.activeUsersLast7Days}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-white/80 text-sm">Avg Posts Per User</span>
                <span className="text-white font-bold text-lg">{stats.avgPostsPerUser}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-white/80 text-sm">Engagement Rate</span>
                <span className="text-white font-bold text-lg">{stats.engagementRate}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">User Breakdown</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-white/80 text-sm">Email Users</span>
                <span className="text-white font-bold text-lg">{stats.emailUsers}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-white/80 text-sm">X/Twitter Users</span>
                <span className="text-white font-bold text-lg">{stats.xUsers}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-white/80 text-sm">Total Engagement</span>
                <span className="text-white font-bold text-lg">{stats.totalEngagement}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div
          className="rounded-2xl p-8 shadow-lg text-center"
          style={{ background: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)' }}
        >
          <h3 className="text-white text-2xl font-bold mb-2">Platform Health</h3>
          <p className="text-white/80 text-lg">
            {((stats.activeUsersLast7Days / stats.totalUsers) * 100).toFixed(1)}% of users active in the last 7 days
          </p>
          <div className="mt-4 flex items-center justify-center gap-8">
            <div>
              <p className="text-white/70 text-sm">Posts Today</p>
              <p className="text-white text-2xl font-bold">{stats.postsToday}</p>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div>
              <p className="text-white/70 text-sm">Avg Engagement</p>
              <p className="text-white text-2xl font-bold">{stats.engagementRate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
