// MongoDB Service Implementation for WEGRAM
import { Db, ObjectId } from 'mongodb';
import { getDatabase, Collections } from './mongodb';
import {
  User, Post, Like, Comment, Follow, Reward, UserWallet, WalletBalance,
  WalletTransaction, RewardClaim, DatabaseOperations
} from './mongodbModels';

export class MongoDBService implements DatabaseOperations {
  private db: Db | null = null;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      this.db = await getDatabase();
    } catch (error) {
      console.log('MongoDB not available, using demo mode');
      this.db = null;
    }
  }

  private async ensureDatabase() {
    if (!this.db) {
      try {
        await this.initializeDatabase();
      } catch (error) {
        console.log('MongoDB not available, using demo mode');
        return null;
      }
    }
    if (!this.db) {
      console.log('MongoDB not available, using demo mode');
      return null;
    }
    return this.db;
  }

  // User operations
  async createUser(user: Omit<User, '_id' | 'created_at' | 'updated_at'>): Promise<User> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    if (!db) {
      throw new Error('Database not available');
    }
    const now = new Date();
    const newUser: User = {
      ...user,
      created_at: now,
      updated_at: now,
    };

    const result = await db.collection(Collections.PROFILES).insertOne(newUser);
    return { ...newUser, _id: result.insertedId.toString() };
  }

  async getUserById(id: string): Promise<User | null> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const user = await db.collection(Collections.PROFILES).findOne({ id });
    return user as User | null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const user = await db.collection(Collections.PROFILES).findOne({ username });
    return user as User | null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db.collection(Collections.PROFILES).findOneAndUpdate(
      { id },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return result as User | null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db.collection(Collections.PROFILES).deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Post operations
  async createPost(post: Omit<Post, '_id' | 'created_at' | 'updated_at'>): Promise<Post> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const now = new Date();
    const newPost: Post = {
      ...post,
      created_at: now,
      updated_at: now,
    };

    const result = await db.collection(Collections.POSTS).insertOne(newPost);
    
    // Update user's post count
    await db.collection(Collections.PROFILES).updateOne(
      { id: post.user_id },
      { $inc: { posts_count: 1 } }
    );

    return { ...newPost, _id: result.insertedId.toString() };
  }

  async getPostById(id: string): Promise<Post | null> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const post = await db.collection(Collections.POSTS).findOne({ id });
    return post as Post | null;
  }

  async getPostsByUserId(userId: string, limit: number = 20): Promise<Post[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const posts = await db.collection(Collections.POSTS)
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
    return posts as Post[];
  }

  async getFeedPosts(userId: string, limit: number = 20): Promise<Post[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    
    // Get users that the current user follows
    const following = await db.collection(Collections.FOLLOWS)
      .find({ follower_id: userId })
      .toArray();
    
    const followingIds = following.map(f => f.following_id);
    followingIds.push(userId); // Include user's own posts

    const posts = await db.collection(Collections.POSTS)
      .find({ user_id: { $in: followingIds } })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
    
    return posts as Post[];
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db.collection(Collections.POSTS).findOneAndUpdate(
      { id },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return result as Post | null;
  }

  async deletePost(id: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const post = await this.getPostById(id);
    if (!post) return false;

    const result = await db.collection(Collections.POSTS).deleteOne({ id });
    
    if (result.deletedCount > 0) {
      // Update user's post count
      await db.collection(Collections.PROFILES).updateOne(
        { id: post.user_id },
        { $inc: { posts_count: -1 } }
      );
      return true;
    }
    return false;
  }

  // Like operations
  async likePost(userId: string, postId: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    
    // Check if already liked
    const existingLike = await db.collection(Collections.LIKES).findOne({
      user_id: userId,
      post_id: postId
    });
    
    if (existingLike) return false; // Already liked

    // Create like
    const like: Like = {
      id: new ObjectId().toString(),
      user_id: userId,
      post_id: postId,
      created_at: new Date()
    };

    await db.collection(Collections.LIKES).insertOne(like);
    
    // Update post likes count
    await db.collection(Collections.POSTS).updateOne(
      { id: postId },
      { $inc: { likes_count: 1 } }
    );

    return true;
  }

  async unlikePost(userId: string, postId: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    
    const result = await db.collection(Collections.LIKES).deleteOne({
      user_id: userId,
      post_id: postId
    });
    
    if (result.deletedCount > 0) {
      // Update post likes count
      await db.collection(Collections.POSTS).updateOne(
        { id: postId },
        { $inc: { likes_count: -1 } }
      );
      return true;
    }
    return false;
  }

  async isPostLiked(userId: string, postId: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const like = await db.collection(Collections.LIKES).findOne({
      user_id: userId,
      post_id: postId
    });
    return !!like;
  }

  async getPostLikes(postId: string): Promise<Like[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const likes = await db.collection(Collections.LIKES)
      .find({ post_id: postId })
      .toArray();
    return likes as Like[];
  }

  // Comment operations
  async createComment(comment: Omit<Comment, '_id' | 'created_at' | 'updated_at'>): Promise<Comment> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const now = new Date();
    const newComment: Comment = {
      ...comment,
      created_at: now,
      updated_at: now,
    };

    const result = await db.collection(Collections.COMMENTS).insertOne(newComment);
    
    // Update post comments count
    await db.collection(Collections.POSTS).updateOne(
      { id: comment.post_id },
      { $inc: { comments_count: 1 } }
    );

    return { ...newComment, _id: result.insertedId.toString() };
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const comments = await db.collection(Collections.COMMENTS)
      .find({ post_id: postId })
      .sort({ created_at: -1 })
      .toArray();
    return comments as Comment[];
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db.collection(Collections.COMMENTS).findOneAndUpdate(
      { id },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return result as Comment | null;
  }

  async deleteComment(id: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const comment = await db.collection(Collections.COMMENTS).findOne({ id });
    if (!comment) return false;

    const result = await db.collection(Collections.COMMENTS).deleteOne({ id });
    
    if (result.deletedCount > 0) {
      // Update post comments count
      await db.collection(Collections.POSTS).updateOne(
        { id: comment.post_id },
        { $inc: { comments_count: -1 } }
      );
      return true;
    }
    return false;
  }

  // Follow operations
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    
    if (followerId === followingId) return false; // Can't follow yourself
    
    // Check if already following
    const existingFollow = await db.collection(Collections.FOLLOWS).findOne({
      follower_id: followerId,
      following_id: followingId
    });
    
    if (existingFollow) return false; // Already following

    // Create follow relationship
    const follow: Follow = {
      id: new ObjectId().toString(),
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date()
    };

    await db.collection(Collections.FOLLOWS).insertOne(follow);
    
    // Update follower counts
    await db.collection(Collections.PROFILES).updateOne(
      { id: followingId },
      { $inc: { followers_count: 1 } }
    );
    
    await db.collection(Collections.PROFILES).updateOne(
      { id: followerId },
      { $inc: { following_count: 1 } }
    );

    return true;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    
    const result = await db.collection(Collections.FOLLOWS).deleteOne({
      follower_id: followerId,
      following_id: followingId
    });
    
    if (result.deletedCount > 0) {
      // Update follower counts
      await db.collection(Collections.PROFILES).updateOne(
        { id: followingId },
        { $inc: { followers_count: -1 } }
      );
      
      await db.collection(Collections.PROFILES).updateOne(
        { id: followerId },
        { $inc: { following_count: -1 } }
      );
      return true;
    }
    return false;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const follow = await db.collection(Collections.FOLLOWS).findOne({
      follower_id: followerId,
      following_id: followingId
    });
    return !!follow;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const follows = await db.collection(Collections.FOLLOWS)
      .find({ following_id: userId })
      .toArray();
    
    const followerIds = follows.map(f => f.follower_id);
    const followers = await db.collection(Collections.PROFILES)
      .find({ id: { $in: followerIds } })
      .toArray();
    
    return followers as User[];
  }

  async getFollowing(userId: string): Promise<User[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const follows = await db.collection(Collections.FOLLOWS)
      .find({ follower_id: userId })
      .toArray();
    
    const followingIds = follows.map(f => f.following_id);
    const following = await db.collection(Collections.PROFILES)
      .find({ id: { $in: followingIds } })
      .toArray();
    
    return following as User[];
  }

  // Wallet operations
  async createWallet(wallet: Omit<UserWallet, '_id' | 'created_at' | 'updated_at'>): Promise<UserWallet> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const now = new Date();
    const newWallet: UserWallet = {
      ...wallet,
      created_at: now,
      updated_at: now,
    };

    const result = await db.collection(Collections.USER_WALLETS).insertOne(newWallet);
    return { ...newWallet, _id: result.insertedId.toString() };
  }

  async getWalletByUserId(userId: string): Promise<UserWallet | null> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const wallet = await db.collection(Collections.USER_WALLETS).findOne({ user_id: userId });
    return wallet as UserWallet | null;
  }

  async updateWalletBalance(userId: string, tokenSymbol: string, balance: number, usdValue: number): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db.collection(Collections.WALLET_BALANCES).updateOne(
      { user_id: userId, token_symbol: tokenSymbol },
      { 
        $set: { 
          balance, 
          usd_value: usdValue, 
          updated_at: new Date() 
        } 
      },
      { upsert: true }
    );
    return result.acknowledged;
  }

  async getWalletBalances(userId: string): Promise<WalletBalance[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const balances = await db.collection(Collections.WALLET_BALANCES)
      .find({ user_id: userId })
      .toArray();
    return balances as WalletBalance[];
  }

  // Transaction operations
  async createTransaction(transaction: Omit<WalletTransaction, '_id' | 'created_at'>): Promise<WalletTransaction> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const newTransaction: WalletTransaction = {
      ...transaction,
      created_at: new Date()
    };

    const result = await db.collection(Collections.WALLET_TRANSACTIONS).insertOne(newTransaction);
    return { ...newTransaction, _id: result.insertedId.toString() };
  }

  async getTransactionsByUserId(userId: string, limit: number = 50): Promise<WalletTransaction[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const transactions = await db.collection(Collections.WALLET_TRANSACTIONS)
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
    return transactions as WalletTransaction[];
  }

  // Reward operations
  async createReward(reward: Omit<Reward, '_id' | 'created_at'>): Promise<Reward> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const newReward: Reward = {
      ...reward,
      created_at: new Date()
    };

    const result = await db.collection(Collections.REWARDS).insertOne(newReward);
    return { ...newReward, _id: result.insertedId.toString() };
  }

  async getRewardsByUserId(userId: string): Promise<Reward[]> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const rewards = await db.collection(Collections.REWARDS)
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    return rewards as Reward[];
  }

  async claimReward(userId: string, rewardId: string): Promise<boolean> {
    const db = await this.ensureDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db.collection(Collections.REWARDS).updateOne(
      { id: rewardId, user_id: userId },
      { $set: { claimed: true } }
    );
    return result.modifiedCount > 0;
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBService();
