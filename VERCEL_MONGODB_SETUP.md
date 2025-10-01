# WEGRAM MongoDB + Vercel Setup Guide

## 🚀 Quick Setup for Vercel Deployment

### 1. Get Your MongoDB Connection String

Since you've integrated MongoDB with Vercel, you should have access to your MongoDB Atlas cluster. Here's how to get your connection string:

1. **Go to MongoDB Atlas Dashboard**
   - Visit [cloud.mongodb.com](https://cloud.mongodb.com)
   - Sign in to your account

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 2. Configure Environment Variables

#### For Local Development:
```bash
# Edit your .env file
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wegram?retryWrites=true&w=majority
VITE_MONGODB_DB_NAME=wegram
```

#### For Vercel Production:
1. Go to your Vercel dashboard
2. Select your WEGRAM project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:
   - `VITE_MONGODB_URI` = your MongoDB connection string
   - `VITE_MONGODB_DB_NAME` = wegram

### 3. Test Your Connection

Run the test script to verify everything works:

```bash
node test-mongodb.js
```

You should see:
```
✅ MongoDB connected successfully!
📊 Available collections: []
✅ Test user created: [ObjectId]
🧹 Test user cleaned up
🎉 MongoDB is ready for WEGRAM!
```

### 4. Update Your App to Use MongoDB

The app is already configured to automatically detect MongoDB. Once you add the connection string, it will:

- ✅ Switch from mock data to real MongoDB
- ✅ Create collections automatically
- ✅ Enable all database features

### 5. Deploy to Vercel

```bash
# Commit your changes
git add .
git commit -m "Add MongoDB integration"

# Deploy to Vercel
vercel --prod
```

## 🔧 MongoDB Atlas Configuration

### Network Access
1. Go to "Network Access" in Atlas
2. Add your IP address or use `0.0.0.0/0` for development
3. **⚠️ For production, whitelist only Vercel's IP ranges**

### Database Access
1. Go to "Database Access"
2. Create a database user with read/write permissions
3. Use strong passwords

### Security Best Practices
- Enable SSL/TLS connections
- Use environment variables for credentials
- Rotate passwords regularly
- Monitor connection logs

## 📊 Database Schema

Your MongoDB will automatically create these collections:

### Core Collections
- `profiles` - User profiles
- `posts` - User posts
- `likes` - Post likes
- `comments` - Post comments
- `follows` - User relationships

### Web3 Collections
- `user_wallets` - Solana wallets
- `wallet_balances` - Token balances
- `wallet_transactions` - Transaction history
- `rewards` - User rewards
- `reward_claims` - Reward claims

## 🐛 Troubleshooting

### Common Issues

1. **"MongoDB not connected"**
   - Check your connection string format
   - Verify MongoDB Atlas cluster is running
   - Check network access settings

2. **"Authentication failed"**
   - Verify username and password
   - Check database user permissions
   - Ensure IP is whitelisted

3. **"Connection timeout"**
   - Check network connectivity
   - Verify cluster is not paused
   - Check Atlas cluster status

### Debug Steps

1. **Test Connection Locally**
   ```bash
   node test-mongodb.js
   ```

2. **Check Environment Variables**
   ```bash
   echo $VITE_MONGODB_URI
   ```

3. **Check Vercel Logs**
   - Go to Vercel dashboard
   - Check function logs for errors

## 🚀 Next Steps

Once MongoDB is connected:

1. **Test All Features**
   - Create users and posts
   - Test likes, comments, follows
   - Verify wallet operations

2. **Monitor Performance**
   - Check MongoDB Atlas metrics
   - Monitor Vercel function performance
   - Set up alerts

3. **Scale as Needed**
   - Upgrade MongoDB Atlas tier
   - Optimize queries
   - Add caching

## 🎉 You're Ready!

Your WEGRAM app now has:
- ✅ MongoDB database integration
- ✅ Vercel deployment ready
- ✅ Production security
- ✅ Scalable architecture

Start building your Web3 social media platform! 🚀
