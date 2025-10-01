# WEGRAM MongoDB Setup Guide

This guide will help you set up MongoDB for your WEGRAM project. MongoDB is perfect for social media applications with its flexible document-based structure and excellent scalability.

## 🚀 Quick Start Options

### Option 1: MongoDB Atlas (Cloud - Recommended)

**Best for production and easy setup**

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Sandbox is free)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

3. **Configure Environment**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wegram?retryWrites=true&w=majority
   VITE_MONGODB_DB_NAME=wegram
   ```

### Option 2: Local MongoDB Installation

**Best for development**

1. **Install MongoDB**
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb/brew/mongodb-community
   
   # Or manually start
   mongod --config /usr/local/etc/mongod.conf
   ```

2. **Configure Environment**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_MONGODB_URI=mongodb://localhost:27017
   VITE_MONGODB_DB_NAME=wegram
   ```

## 📊 Database Schema Overview

Your MongoDB database will include these collections:

### Core Collections
- **`profiles`** - User profiles with username, bio, avatar, follower counts
- **`posts`** - User posts with engagement metrics
- **`likes`** - Post likes tracking
- **`comments`** - Post comments
- **`follows`** - User following relationships

### Web3 Collections
- **`user_wallets`** - Solana wallets for each user
- **`wallet_balances`** - Token balances (WGM, SOL, USDC, etc.)
- **`wallet_transactions`** - Transaction history
- **`rewards`** - User rewards and achievements
- **`reward_claims`** - Reward claim history

## 🔧 Database Setup

### 1. Initialize Database Connection

The MongoDB service will automatically create collections when you first insert data. No manual schema setup required!

### 2. Test Connection

Start your development server:
```bash
npm run dev
```

Check the browser console for:
- ✅ "MongoDB connected successfully!" - Database is working
- 📋 "MongoDB not connected" - Check your connection string

### 3. Create Sample Data (Optional)

You can create sample users and posts programmatically:

```javascript
// Example: Create a user
const user = await mongoDBService.createUser({
  id: 'user_123',
  username: 'demo_user',
  email: 'demo@wegram.com',
  bio: 'Demo user for testing',
  verified: false,
  followers_count: 0,
  following_count: 0,
  posts_count: 0
});

// Example: Create a post
const post = await mongoDBService.createPost({
  id: 'post_123',
  user_id: 'user_123',
  content: 'Welcome to WEGRAM! 🚀',
  likes_count: 0,
  comments_count: 0,
  shares_count: 0,
  gifts_count: 0
});
```

## 🛠️ Advanced Configuration

### MongoDB Atlas Security

1. **Network Access**
   - Go to "Network Access" in Atlas
   - Add your IP address or use `0.0.0.0/0` for development
   - **⚠️ Never use `0.0.0.0/0` in production!**

2. **Database Access**
   - Go to "Database Access"
   - Create a database user with read/write permissions
   - Use strong passwords

3. **Connection Security**
   - Always use SSL/TLS connections
   - Rotate passwords regularly
   - Use environment variables for credentials

### Performance Optimization

1. **Indexes**
   The service automatically creates indexes for common queries:
   - User lookups by ID and username
   - Post queries by user and date
   - Like and follow relationships

2. **Connection Pooling**
   MongoDB driver handles connection pooling automatically

3. **Query Optimization**
   - Use projection to limit returned fields
   - Implement pagination for large datasets
   - Use aggregation pipelines for complex queries

## 🔒 Security Best Practices

### Production Deployment

1. **Environment Variables**
   ```bash
   # Never commit .env files
   echo ".env" >> .gitignore
   ```

2. **Connection Security**
   - Use MongoDB Atlas for production
   - Enable IP whitelisting
   - Use strong authentication

3. **Data Validation**
   - Implement input validation
   - Use TypeScript interfaces
   - Sanitize user inputs

### Wallet Security

1. **Private Key Encryption**
   ```javascript
   // Example: Encrypt private keys before storing
   import crypto from 'crypto';
   
   const encrypt = (text, secretKey) => {
     const cipher = crypto.createCipher('aes-256-cbc', secretKey);
     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     return encrypted;
   };
   ```

2. **Secure Storage**
   - Never store plain text private keys
   - Use environment variables for encryption keys
   - Implement proper key rotation

## 🐛 Troubleshooting

### Common Issues

1. **"MongoDB not connected"**
   - Check your connection string format
   - Verify MongoDB is running (local) or accessible (Atlas)
   - Check network connectivity and firewall settings

2. **"Authentication failed"**
   - Verify username and password
   - Check database user permissions
   - Ensure IP address is whitelisted (Atlas)

3. **"Connection timeout"**
   - Check network connectivity
   - Verify MongoDB service is running
   - Check Atlas cluster status

4. **"Database not found"**
   - MongoDB creates databases automatically
   - Check database name in connection string
   - Verify user has access to the database

### Debugging Tips

1. **Enable Debug Logging**
   ```javascript
   // Add to your MongoDB connection
   const client = new MongoClient(uri, {
     loggerLevel: 'debug'
   });
   ```

2. **Check Connection Status**
   ```javascript
   import { getConnectionStatus } from './lib/mongodb';
   console.log(getConnectionStatus());
   ```

3. **Test Queries**
   ```javascript
   // Test basic operations
   const db = await getDatabase();
   const collections = await db.listCollections().toArray();
   console.log('Available collections:', collections);
   ```

## 📈 Monitoring and Maintenance

### MongoDB Atlas Monitoring

1. **Metrics Dashboard**
   - Monitor connection count
   - Track query performance
   - Watch for slow operations

2. **Alerts**
   - Set up alerts for high CPU usage
   - Monitor connection limits
   - Track storage usage

### Local MongoDB Monitoring

1. **MongoDB Compass**
   - Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
   - Visual database browser
   - Query performance analysis

2. **Command Line Tools**
   ```bash
   # Check MongoDB status
   brew services list | grep mongodb
   
   # View logs
   tail -f /usr/local/var/log/mongodb/mongo.log
   ```

## 🚀 Next Steps

Once MongoDB is set up:

1. **Test All Features**
   - Create users and posts
   - Test likes, comments, follows
   - Verify wallet operations

2. **Implement Real-time Features**
   - Use MongoDB Change Streams for live updates
   - Implement WebSocket connections
   - Add real-time notifications

3. **Add Advanced Features**
   - Full-text search with MongoDB Atlas Search
   - Geospatial queries for location features
   - Aggregation pipelines for analytics

4. **Deploy to Production**
   - Use MongoDB Atlas for production
   - Implement proper monitoring
   - Set up automated backups

## 🎉 You're Ready!

Your WEGRAM project now has:
- ✅ MongoDB database integration
- ✅ Complete data models and services
- ✅ Flexible document-based schema
- ✅ Scalable cloud-ready setup
- ✅ Production security best practices

Start building your Web3 social media platform with MongoDB! 🚀

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [MongoDB University](https://university.mongodb.com/)
