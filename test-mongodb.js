// MongoDB Connection Test Script
// Run this to test your MongoDB connection

import { MongoClient } from 'mongodb';

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB connection...');
  
  const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb://localhost:27017';
  const MONGODB_DB_NAME = process.env.VITE_MONGODB_DB_NAME || 'wegram';
  
  console.log('📋 Using URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  try {
    // Test connection
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operations
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test creating a sample user
    const usersCollection = db.collection('profiles');
    const sampleUser = {
      id: 'test_user_' + Date.now(),
      username: 'test_user',
      email: 'test@wegram.com',
      bio: 'Test user for connection verification',
      verified: false,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await usersCollection.insertOne(sampleUser);
    console.log('✅ Test user created:', result.insertedId);
    
    // Clean up test user
    await usersCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test user cleaned up');
    
    await client.close();
    console.log('🎉 MongoDB is ready for WEGRAM!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('📋 Make sure to:');
    console.log('   1. Add your MongoDB URI to .env file');
    console.log('   2. Check your MongoDB Atlas cluster is running');
    console.log('   3. Verify your IP is whitelisted (if using Atlas)');
    console.log('   4. Update VITE_MONGODB_URI in your .env file');
  }
}

// Run the test
testMongoDBConnection();