// MongoDB React Hook for WEGRAM
import { useState, useEffect, useCallback } from 'react';
import { mongoDBService } from '../lib/mongodbService';
import { User, Post, Like, Comment, Follow, Reward, WalletBalance } from '../lib/mongodbModels';

// Custom hook for MongoDB operations
export function useMongoDB() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to connect to database
        await mongoDBService.getDatabase();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError('MongoDB connection failed');
        console.log('📋 Demo mode - Add your MongoDB URI to .env to enable database features');
      }
    };

    checkConnection();
  }, []);

  // User operations
  const createUser = useCallback(async (userData: Omit<User, '_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const user = await mongoDBService.createUser(userData);
      return user;
    } catch (err) {
      setError('Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const user = await mongoDBService.getUserById(id);
      return user;
    } catch (err) {
      setError('Failed to get user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserByUsername = useCallback(async (username: string) => {
    setLoading(true);
    try {
      const user = await mongoDBService.getUserByUsername(username);
      return user;
    } catch (err) {
      setError('Failed to get user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Post operations
  const createPost = useCallback(async (postData: Omit<Post, '_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const post = await mongoDBService.createPost(postData);
      return post;
    } catch (err) {
      setError('Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPostsByUserId = useCallback(async (userId: string, limit?: number) => {
    setLoading(true);
    try {
      const posts = await mongoDBService.getPostsByUserId(userId, limit);
      return posts;
    } catch (err) {
      setError('Failed to get posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeedPosts = useCallback(async (userId: string, limit?: number) => {
    setLoading(true);
    try {
      const posts = await mongoDBService.getFeedPosts(userId, limit);
      return posts;
    } catch (err) {
      setError('Failed to get feed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Like operations
  const likePost = useCallback(async (userId: string, postId: string) => {
    setLoading(true);
    try {
      const success = await mongoDBService.likePost(userId, postId);
      return success;
    } catch (err) {
      setError('Failed to like post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (userId: string, postId: string) => {
    setLoading(true);
    try {
      const success = await mongoDBService.unlikePost(userId, postId);
      return success;
    } catch (err) {
      setError('Failed to unlike post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isPostLiked = useCallback(async (userId: string, postId: string) => {
    try {
      const liked = await mongoDBService.isPostLiked(userId, postId);
      return liked;
    } catch (err) {
      setError('Failed to check like status');
      return false;
    }
  }, []);

  // Comment operations
  const createComment = useCallback(async (commentData: Omit<Comment, '_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const comment = await mongoDBService.createComment(commentData);
      return comment;
    } catch (err) {
      setError('Failed to create comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCommentsByPostId = useCallback(async (postId: string) => {
    setLoading(true);
    try {
      const comments = await mongoDBService.getCommentsByPostId(postId);
      return comments;
    } catch (err) {
      setError('Failed to get comments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Follow operations
  const followUser = useCallback(async (followerId: string, followingId: string) => {
    setLoading(true);
    try {
      const success = await mongoDBService.followUser(followerId, followingId);
      return success;
    } catch (err) {
      setError('Failed to follow user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (followerId: string, followingId: string) => {
    setLoading(true);
    try {
      const success = await mongoDBService.unfollowUser(followerId, followingId);
      return success;
    } catch (err) {
      setError('Failed to unfollow user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isFollowing = useCallback(async (followerId: string, followingId: string) => {
    try {
      const following = await mongoDBService.isFollowing(followerId, followingId);
      return following;
    } catch (err) {
      setError('Failed to check follow status');
      return false;
    }
  }, []);

  // Wallet operations
  const createWallet = useCallback(async (walletData: Omit<UserWallet, '_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const wallet = await mongoDBService.createWallet(walletData);
      return wallet;
    } catch (err) {
      setError('Failed to create wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWalletBalances = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const balances = await mongoDBService.getWalletBalances(userId);
      return balances;
    } catch (err) {
      setError('Failed to get wallet balances');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWalletBalance = useCallback(async (userId: string, tokenSymbol: string, balance: number, usdValue: number) => {
    setLoading(true);
    try {
      const success = await mongoDBService.updateWalletBalance(userId, tokenSymbol, balance, usdValue);
      return success;
    } catch (err) {
      setError('Failed to update wallet balance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reward operations
  const createReward = useCallback(async (rewardData: Omit<Reward, '_id' | 'created_at'>) => {
    setLoading(true);
    try {
      const reward = await mongoDBService.createReward(rewardData);
      return reward;
    } catch (err) {
      setError('Failed to create reward');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRewardsByUserId = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const rewards = await mongoDBService.getRewardsByUserId(userId);
      return rewards;
    } catch (err) {
      setError('Failed to get rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = useCallback(async (userId: string, rewardId: string) => {
    setLoading(true);
    try {
      const success = await mongoDBService.claimReward(userId, rewardId);
      return success;
    } catch (err) {
      setError('Failed to claim reward');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Connection status
    isConnected,
    loading,
    error,
    
    // User operations
    createUser,
    getUserById,
    getUserByUsername,
    
    // Post operations
    createPost,
    getPostsByUserId,
    getFeedPosts,
    
    // Like operations
    likePost,
    unlikePost,
    isPostLiked,
    
    // Comment operations
    createComment,
    getCommentsByPostId,
    
    // Follow operations
    followUser,
    unfollowUser,
    isFollowing,
    
    // Wallet operations
    createWallet,
    getWalletBalances,
    updateWalletBalance,
    
    // Reward operations
    createReward,
    getRewardsByUserId,
    claimReward,
  };
}

// Hook for posts with MongoDB integration
export function useMongoPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { getFeedPosts, createPost, likePost, unlikePost, isPostLiked } = useMongoDB();

  const loadPosts = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const feedPosts = await getFeedPosts(userId);
      setPosts(feedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [getFeedPosts]);

  const addPost = useCallback(async (postData: Omit<Post, '_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPost = await createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }, [createPost]);

  const toggleLike = useCallback(async (userId: string, postId: string) => {
    try {
      const isLiked = await isPostLiked(userId, postId);
      if (isLiked) {
        await unlikePost(userId, postId);
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes_count: Math.max(0, post.likes_count - 1) }
            : post
        ));
      } else {
        await likePost(userId, postId);
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes_count: post.likes_count + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }, [likePost, unlikePost, isPostLiked]);

  return {
    posts,
    loading,
    loadPosts,
    addPost,
    toggleLike,
  };
}

// Hook for user profile with MongoDB integration
export function useMongoProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { getUserById, createUser, followUser, unfollowUser, isFollowing } = useMongoDB();

  const loadProfile = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const userProfile = await getUserById(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }, [getUserById]);

  const createProfile = useCallback(async (userData: Omit<User, '_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProfile = await createUser(userData);
      setProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Failed to create profile:', error);
      throw error;
    }
  }, [createUser]);

  const toggleFollow = useCallback(async (followerId: string, followingId: string) => {
    try {
      const isCurrentlyFollowing = await isFollowing(followerId, followingId);
      if (isCurrentlyFollowing) {
        await unfollowUser(followerId, followingId);
        setProfile(prev => prev ? { ...prev, followers_count: Math.max(0, prev.followers_count - 1) } : null);
      } else {
        await followUser(followerId, followingId);
        setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  }, [followUser, unfollowUser, isFollowing]);

  return {
    profile,
    loading,
    loadProfile,
    createProfile,
    toggleFollow,
  };
}
