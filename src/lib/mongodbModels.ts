// MongoDB Data Models and Interfaces for WEGRAM

export interface User {
  _id?: string;
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  _id?: string;
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  gifts_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Like {
  _id?: string;
  id: string;
  user_id: string;
  post_id: string;
  created_at: Date;
}

export interface Comment {
  _id?: string;
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Follow {
  _id?: string;
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
}

export interface Reward {
  _id?: string;
  id: string;
  user_id: string;
  title: string;
  amount: string;
  type: 'daily' | 'invite' | 'task' | 'post' | 'like' | 'comment' | 'share';
  claimed: boolean;
  created_at: Date;
}

export interface UserWallet {
  _id?: string;
  id: string;
  user_id: string;
  public_key: string;
  private_key_encrypted: string;
  mnemonic_encrypted?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WalletBalance {
  _id?: string;
  id: string;
  user_id: string;
  token_symbol: string;
  token_name: string;
  balance: number;
  usd_value: number;
  created_at: Date;
  updated_at: Date;
}

export interface WalletTransaction {
  _id?: string;
  id: string;
  user_id: string;
  transaction_hash: string;
  from_address?: string;
  to_address?: string;
  amount: number;
  token_symbol: string;
  transaction_type: 'send' | 'receive' | 'reward' | 'purchase';
  status: 'pending' | 'confirmed' | 'failed';
  created_at: Date;
}

export interface RewardClaim {
  _id?: string;
  id: string;
  user_id: string;
  reward_id: string;
  amount: number;
  token_symbol: string;
  transaction_hash?: string;
  claimed_at: Date;
}

// MongoDB-specific interfaces for queries
export interface MongoQuery {
  filter?: any;
  sort?: any;
  limit?: number;
  skip?: number;
}

export interface MongoUpdate {
  $set?: any;
  $inc?: any;
  $push?: any;
  $pull?: any;
}

// Database operations interface
export interface DatabaseOperations {
  // User operations
  createUser(user: Omit<User, '_id' | 'created_at' | 'updated_at'>): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  
  // Post operations
  createPost(post: Omit<Post, '_id' | 'created_at' | 'updated_at'>): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  getPostsByUserId(userId: string, limit?: number): Promise<Post[]>;
  getFeedPosts(userId: string, limit?: number): Promise<Post[]>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | null>;
  deletePost(id: string): Promise<boolean>;
  
  // Like operations
  likePost(userId: string, postId: string): Promise<boolean>;
  unlikePost(userId: string, postId: string): Promise<boolean>;
  isPostLiked(userId: string, postId: string): Promise<boolean>;
  getPostLikes(postId: string): Promise<Like[]>;
  
  // Comment operations
  createComment(comment: Omit<Comment, '_id' | 'created_at' | 'updated_at'>): Promise<Comment>;
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null>;
  deleteComment(id: string): Promise<boolean>;
  
  // Follow operations
  followUser(followerId: string, followingId: string): Promise<boolean>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
  
  // Wallet operations
  createWallet(wallet: Omit<UserWallet, '_id' | 'created_at' | 'updated_at'>): Promise<UserWallet>;
  getWalletByUserId(userId: string): Promise<UserWallet | null>;
  updateWalletBalance(userId: string, tokenSymbol: string, balance: number, usdValue: number): Promise<boolean>;
  getWalletBalances(userId: string): Promise<WalletBalance[]>;
  
  // Transaction operations
  createTransaction(transaction: Omit<WalletTransaction, '_id' | 'created_at'>): Promise<WalletTransaction>;
  getTransactionsByUserId(userId: string, limit?: number): Promise<WalletTransaction[]>;
  
  // Reward operations
  createReward(reward: Omit<Reward, '_id' | 'created_at'>): Promise<Reward>;
  getRewardsByUserId(userId: string): Promise<Reward[]>;
  claimReward(userId: string, rewardId: string): Promise<boolean>;
}
