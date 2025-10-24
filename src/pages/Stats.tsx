import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, Heart } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface StatsData {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
}

export const Stats: React.FC = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();

      if (data.success) {
        setStats({
          totalUsers: data.stats.total_users || 0,
          totalPosts: data.stats.total_posts || 0,
          totalComments: data.stats.total_comments || 0,
          totalLikes: data.stats.total_likes || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Update stats every 5 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-24" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Platform Statistics</h1>
        <p className="text-secondary">Real-time updates every 5 seconds</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading statistics...</p>
        </div>
      ) : (
        /* Stats Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-500 bg-opacity-20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-secondary">Total Users</div>
          </div>

          {/* Total Posts */}
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-500 bg-opacity-20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.totalPosts.toLocaleString()}
            </div>
            <div className="text-sm text-secondary">Total Posts</div>
          </div>

          {/* Total Comments */}
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-green-500 bg-opacity-20 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.totalComments.toLocaleString()}
            </div>
            <div className="text-sm text-secondary">Total Comments</div>
          </div>

          {/* Total Likes */}
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-red-500 bg-opacity-20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.totalLikes.toLocaleString()}
            </div>
            <div className="text-sm text-secondary">Total Likes</div>
          </div>
        </div>
      )}
    </div>
  );
};
