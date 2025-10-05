# WEGRAM - Web3 Social Platform

A decentralized social media platform built on Solana that combines traditional social networking with Web3 functionality, cryptocurrency rewards, and blockchain integration.

**Live Site:** [https://www.wegram.social](https://www.wegram.social)

## Tech Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

### Backend & Database
- **Vercel** - Hosting and serverless functions
- **Neon Postgres** - Serverless PostgreSQL database
- **Vercel API Routes** - Backend endpoints

### Blockchain & Crypto
- **Solana Web3.js** - Solana blockchain integration
- **Wallet generation** - Auto-generated Solana wallets
- **Token system** - WEGRAM token integration

### Authentication
- **X (Twitter) OAuth** - Social login integration
- **Email authentication** - Traditional signup option

## Current Features

### Social Features
- User profiles with bio, followers, following
- Post creation with text and images
- Home feed with real-time posts
- Comments system with popup composer
- User discovery and profile viewing
- Direct messaging system
- Bookmarks for saving posts

### Web3 Features
- Auto-generated Solana wallets for all users
- WEGRAM token balance tracking
- Referral rewards system with tier progression
- Cryptocurrency wallet interface

### Additional Features
- Responsive mobile-first design
- Dark/light theme support
- PWA installation prompt
- Analytics dashboard
- Settings and preferences

## Setup

### Prerequisites
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wegram-Inc/wegram-team-project.git
   cd wegram-team-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   ```bash
   # Required for database connection
   POSTGRES_URL=your_neon_database_url

   # Optional for X authentication
   TWITTER_CLIENT_ID=your_twitter_client_id
   TWITTER_CLIENT_SECRET=your_twitter_client_secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Comments/       # Comment system components
│   ├── Layout/         # Navigation and layout
│   └── Post/           # Post-related components
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles and themes
└── data/               # Type definitions and interfaces

api/                    # Vercel serverless functions
├── auth/              # Authentication endpoints
├── posts.ts           # Posts CRUD operations
├── comments.ts        # Comments system
├── user-profile.ts    # User management
└── follow.ts          # Follow/unfollow system
```

## Database Schema

The platform uses Neon Postgres with tables for:
- `profiles` - User accounts and social data
- `posts` - User posts with engagement metrics
- `comments` - Comment system
- `follows` - User relationships
- `likes` - Post interactions

## Development Status

This is an active development project. The core social features and Web3 integration are functional. Authentication works with both X/Twitter OAuth and email signup.

**Note:** X/Twitter signup is temporarily limited due to API rate limits. Email signup is fully functional.

## License

Proprietary software. All rights reserved.