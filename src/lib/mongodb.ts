import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

// MongoDB connection configuration optimized for Vercel
const uri = import.meta.env.VITE_MONGODB_URI;
const dbName = import.meta.env.VITE_MONGODB_DB_NAME || 'wegram';

const options: MongoClientOptions = {
  appName: "wegram.vercel.integration",
};

let client: MongoClient | null = null;
let db: Db | null = null;

if (uri) {
  try {
    if (import.meta.env.DEV) {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      const globalWithMongo = globalThis as typeof globalThis & {
        _mongoClient?: MongoClient;
      };

      if (!globalWithMongo._mongoClient) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClient = client;
      }
      client = globalWithMongo._mongoClient;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(uri, options);
      
      // Attach the client to ensure proper cleanup on function suspension
      attachDatabasePool(client);
    }
  } catch (error) {
    console.error('Failed to initialize MongoDB client:', error);
    // Don't throw error, just log it and continue without MongoDB
  }
}

// Connect to MongoDB
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  if (!client) {
    console.log('📋 MongoDB URI not configured, using demo mode');
    throw new Error('MongoDB URI not configured');
  }

  try {
    await client.connect();
    db = client.db(dbName);
    
    console.log('✅ MongoDB connected successfully!');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.log('📋 Falling back to demo mode');
    throw error;
  }
}

// Get database instance
export async function getDatabase(): Promise<Db> {
  if (!db) {
    return await connectToDatabase();
  }
  return db;
}

// Close connection
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null as any;
    db = null;
    console.log('📋 MongoDB connection closed');
  }
}

// Database collections
export const Collections = {
  PROFILES: 'profiles',
  POSTS: 'posts',
  LIKES: 'likes',
  COMMENTS: 'comments',
  FOLLOWS: 'follows',
  REWARDS: 'rewards',
  USER_WALLETS: 'user_wallets',
  WALLET_BALANCES: 'wallet_balances',
  WALLET_TRANSACTIONS: 'wallet_transactions',
  REWARD_CLAIMS: 'reward_claims',
} as const;

// Connection status
export function getConnectionStatus(): { connected: boolean; message: string } {
  return {
    connected: !!db,
    message: db 
      ? 'MongoDB connected successfully!' 
      : 'MongoDB not connected - Add your MongoDB URI to .env to enable database features'
  };
}

// Export client for advanced usage
export { client };