// API endpoint to save users to MongoDB
import { connectToDatabase, Collections } from '../lib/mongodb.ts';

export async function POST(request: Request) {
  try {
    const user = await request.json();
    const db = await connectToDatabase();
    
    // Save or update user in MongoDB
    await db.collection(Collections.PROFILES).updateOne(
      { id: user.id },
      { $set: user },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving user:', error);
    return new Response(JSON.stringify({ error: 'Failed to save user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
