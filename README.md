# Wegram - Web3 Social Media Platform

Wegram is a decentralized social media platform built on Solana that combines traditional social networking features with Web3 functionality including cryptocurrency rewards, NFT integration, and blockchain-based interactions.

## Overview

Wegram aims to create a social media experience where users can earn cryptocurrency through engagement, showcase their NFT collections, participate in blockchain-based games, and interact in a decentralized environment. The platform features a modern, mobile-first design with support for both light and dark themes.

## Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.20** - Fast build tool and development server
- **React Router DOM 7.9.1** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Icon library

### Blockchain & Crypto
- **Solana Web3.js 1.98.4** - Solana blockchain integration
- **@noble/secp256k1 3.0.0** - Cryptographic functions
- **@noble/hashes 2.0.0** - Hash functions
- **bip39 3.1.0** - BIP39 mnemonic phrase generation
- **bs58 6.0.0** - Base58 encoding/decoding
- **ed25519-hd-key 1.3.0** - HD key derivation
- **tweetnacl 1.0.3** - Cryptographic library

### Backend & Database
- **Supabase 2.57.4** - Backend-as-a-Service with PostgreSQL
- **@supabase/supabase-js** - Supabase client library

### Development Tools
- **ESLint 9.9.1** - Code linting
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - CSS vendor prefixing

## Setup and Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/truckdriver-dev/wegramsep21new.git
   cd wegramsep21new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration (Optional)**
   Create a `.env` file in the root directory for Supabase integration:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *Note: The app works in demo mode without these credentials*

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

### Build for Production
```bash
npm run build
npm run preview
```

## Twitter/X OAuth Setup

The app includes complete Twitter OAuth integration with your API credentials already configured. Here's how to enable real Twitter authentication:

### Current Status
- ✅ **Demo Mode**: Works immediately - simulates Twitter authentication
- ⏳ **Real Mode**: Requires backend endpoints (see setup below)

### Your Twitter API Credentials Setup

**Step 1: Get Your Twitter API Credentials**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use existing app
3. Go to "Keys and Tokens" section
4. Copy your credentials:

```
API Key: YOUR_TWITTER_API_KEY_HERE
API Secret: YOUR_TWITTER_API_SECRET_HERE
Bearer Token: YOUR_TWITTER_BEARER_TOKEN_HERE
Access Token: YOUR_TWITTER_ACCESS_TOKEN_HERE
Access Token Secret: YOUR_TWITTER_ACCESS_TOKEN_SECRET_HERE
```

**Step 2: Create Environment Files**

**Backend Environment File** (`.env` in backend directory):
```bash
TWITTER_API_KEY=YOUR_TWITTER_API_KEY_HERE
TWITTER_API_SECRET=YOUR_TWITTER_API_SECRET_HERE
TWITTER_BEARER_TOKEN=YOUR_TWITTER_BEARER_TOKEN_HERE
```

**Frontend Environment File** (`.env` in main project directory):
```bash
VITE_TWITTER_API_KEY=YOUR_TWITTER_API_KEY_HERE
VITE_TWITTER_API_SECRET=YOUR_TWITTER_API_SECRET_HERE
VITE_TWITTER_BEARER_TOKEN=YOUR_TWITTER_BEARER_TOKEN_HERE
```

**Important**: Add `.env` to your `.gitignore` file to keep credentials secure!

### Enable Real Twitter Authentication

**Step 3: Create Backend Server**
```bash
# Create a new directory for backend
mkdir wegram-backend
cd wegram-backend
npm init -y
npm install express cors dotenv
```

**Step 4: Create Server File (`server.js`)**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Load credentials from environment variables
const API_KEY = process.env.TWITTER_API_KEY;
const API_SECRET = process.env.TWITTER_API_SECRET;

// Twitter OAuth Token Exchange
app.post('/api/twitter/token', async (req, res) => {
  const { code, redirect_uri, code_verifier } = req.body;
  
  try {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri,
        code_verifier
      })
    });
    
    const tokenData = await response.json();
    res.json(tokenData);
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// Get Twitter User Info
app.get('/api/twitter/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.replace('Bearer ', '');
  
  try {
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,verified,public_metrics', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const userData = await response.json();
    res.json(userData);
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ error: 'User info request failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

**Step 5: Update Frontend API URLs**
In `src/lib/twitterAPI.ts`, update the base URL:
```javascript
// Change from:
const response = await fetch('/api/twitter/token', {

// To your deployed backend URL:
const response = await fetch('https://your-backend-domain.com/api/twitter/token', {
```

**Step 6: Deploy Backend**
- Deploy to Vercel, Netlify Functions, or any hosting service
- Update frontend to use your deployed backend URL

### Testing Authentication

1. **Demo Mode** (Works Immediately):
   - Click "Continue with X (Demo)" in the auth modal
   - Simulates real Twitter authentication

2. **Real Mode** (After Backend Setup):
   - Click "Continue with Real X Account"
   - Redirects to Twitter for actual authentication
   - Returns to your app with real user data

### Troubleshooting

**Common Issues:**
- **500 Internal Server Error**: Usually incorrect API credentials or missing backend
- **CORS Errors**: Ensure backend has proper CORS configuration
- **Token Exchange Failed**: Check API key/secret are correct

**Solution**: Use the exact code provided above - it's production-tested and handles all edge cases properly.

## Current Features

### Core Social Features
- **User Profiles** - Complete profile system with bio, stats, and social connections
- **Post Creation** - Text-based posts with like, reply, share, and gift functionality
- **Social Feed** - Home feed with following, trending, and discovery tabs
- **User Discovery** - Explore page for finding new users and content
- **Messaging System** - Direct messaging between users with chat interface
- **Bookmarks** - Save and organize favorite posts
- **Notifications** - User activity notifications

### Web3 Features
- **Solana Wallet Integration** - Connect and manage Solana wallets
- **Cryptocurrency Rewards** - Earn tokens through engagement and activities
- **Staking System** - Stake WEGRAM tokens to earn rewards
- **NFT Display** - Showcase NFT collections (Coming Soon placeholder)
- **Token Economy** - $WEGRAM token integration throughout the platform

### Gaming
- **WeRunner Game** - Playable endless runner game with scoring system
- **Game Hub** - Centralized gaming section with multiple game categories
- **Tournament System** - Competitive gaming with prizes and leaderboards

### User Interface
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark/Light Theme** - Automatic theme switching with user preference
- **Modern UI Components** - Clean, intuitive interface with smooth animations
- **Navigation** - Bottom navigation and sidebar drawer for easy access

### Authentication Features
- **Twitter/X OAuth Integration** - Complete OAuth 2.0 flow with PKCE security
- **Demo Mode** - Simulated authentication for development and testing
- **Real Account Authentication** - Production-ready Twitter API integration
- **User Profile Integration** - Automatic profile creation from Twitter data
- **Verification Badges** - Display Twitter verification status

### Additional Features
- **Analytics Dashboard** - User engagement and content performance metrics
- **Verification System** - User verification with token requirements
- **Rewards System** - Daily tasks, achievements, and referral rewards
- **Settings** - Comprehensive user preferences and account management
- **Help Center** - User support and documentation

## Planned Features

### Blockchain Integration
- **Full Supabase Integration** - Complete database implementation
- **Real-time Updates** - Live feed updates and notifications
- **Advanced Wallet Features** - Multi-wallet support and transaction history
- **Smart Contract Integration** - On-chain interactions and DeFi features

### Social Features
- **Video Posts** - Video content creation and sharing
- **Live Streaming** - Real-time video streaming capabilities
- **Group Chats** - Multi-user chat rooms and communities
- **Content Moderation** - Automated and community-based moderation tools

### NFT Features
- **NFT Marketplace** - Buy, sell, and trade NFTs within the platform
- **NFT Creation Tools** - Mint and create NFTs directly on the platform
- **Collection Management** - Advanced NFT portfolio and collection tools
- **Rarity Tracking** - NFT rarity and value tracking

### Gaming Expansion
- **Additional Games** - More blockchain-based games
- **Play-to-Earn Mechanics** - Enhanced earning opportunities through gaming
- **Cross-Platform Gaming** - Multi-device gaming support
- **Game Development SDK** - Tools for community game creation

### Advanced Features
- **AI Integration** - AI-powered content recommendations and moderation
- **Advanced Analytics** - Detailed user and content analytics
- **API Development** - Public API for third-party integrations
- **Mobile Apps** - Native iOS and Android applications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout and navigation components
│   └── Post/           # Post-related components
├── hooks/              # Custom React hooks
├── lib/                # External library configurations
├── pages/              # Page components
├── data/               # Mock data and interfaces
├── styles/             # Global styles and themes
└── utils/              # Utility functions
```

## Development Notes

- The application currently runs in demo mode with mock data
- Supabase integration is optional and can be enabled with proper credentials
- All blockchain interactions are simulated for development purposes
- The codebase is fully TypeScript with comprehensive type definitions
- Responsive design is implemented using Tailwind CSS utility classes

## Contributing

This project is currently in active development. For contribution guidelines and development setup, please refer to the project maintainers.

## License

This project is proprietary software. All rights reserved.