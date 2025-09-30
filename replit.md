# Overview

WEGRAM is a next-generation Web3 social media platform that combines traditional social networking with SocialFi (Social Finance) features. Built on the Solana blockchain, it allows users to earn WGM tokens through social interactions like posting, liking, commenting, and sharing. The platform includes integrated Solana wallets, a TikTok-style video feed, Web3 gaming, live streaming, and an AI assistant for Web3 guidance.

# User Preferences

Preferred communication style: Simple, everyday language.

## Design Philosophy
- **Beautiful, not cookie cutter**: All designs should be aesthetically pleasing and unique, avoiding generic or template-like appearances
- **Production-ready quality**: Every webpage and component should be fully featured and worthy of production deployment  
- **Professional standards**: Focus on creating polished, high-quality interfaces that users would expect from professional applications
- **Attention to detail**: Emphasize proper spacing, typography, visual hierarchy, and modern design principles

# System Architecture

## Frontend Architecture
- **Framework**: React 18.3.1 with TypeScript for type safety and modern development
- **Routing**: React Router DOM for client-side navigation with multiple page components
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: React hooks for local state, custom hooks for shared logic (useAuth, usePosts, useTheme)
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Database**: Supabase as the primary backend service for authentication, real-time data, and PostgreSQL database
- **Authentication**: Supabase Auth with Google OAuth and email/password support
- **Real-time Features**: Supabase real-time subscriptions for live updates on posts, likes, and comments
- **Mock Data**: Comprehensive mock data system for development and testing when Supabase is not configured

## Blockchain Integration
- **Solana Integration**: Custom Solana wallet utilities for wallet generation, key management, and transaction handling
- **Wallet Features**: Auto-generated wallets for users, private key management, and token balance tracking
- **Token Economy**: WGM token rewards system for social interactions and platform engagement

## Data Storage Solutions
- **Primary Database**: Supabase PostgreSQL with tables for profiles, posts, likes, comments, and user interactions
- **Local Storage**: Browser localStorage for wallet data, theme preferences, and user settings
- **Schema Design**: Relational database design with proper foreign keys and RLS (Row Level Security) policies

## Authentication and Authorization
- **Multi-provider Auth**: Supabase Auth supporting Google OAuth and email/password authentication
- **Profile Management**: Automatic profile creation with username, bio, and avatar support
- **Security**: Row Level Security policies in Supabase for data protection and user privacy

## Component Architecture
- **Layout Components**: Modular layout system with TopBar, BottomNav, and SideDrawer for navigation
- **Feature Components**: Specialized components for posts (PostCard, PostComposer), authentication (AuthModal), and messaging
- **Theme System**: Comprehensive theming with CSS custom properties supporting light/dark modes
- **Responsive Design**: Mobile-first design approach optimized for social media usage patterns

# External Dependencies

## Core Technologies
- **@supabase/supabase-js**: Backend as a service for database, authentication, and real-time features
- **@solana/web3.js**: Solana blockchain integration for wallet functionality and transaction handling
- **react-router-dom**: Client-side routing for single-page application navigation

## Blockchain & Crypto
- **@noble/hashes & @noble/secp256k1**: Cryptographic utilities for secure wallet operations
- **bip39**: Mnemonic phrase generation for wallet recovery
- **bs58**: Base58 encoding/decoding for Solana addresses
- **ed25519-hd-key**: Hierarchical deterministic key derivation for wallet security
- **tweetnacl**: Cryptographic library for additional security features

## Development Tools
- **TypeScript**: Static typing for improved code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Modern build tool with hot module replacement and optimized bundling
- **ESLint**: Code linting with TypeScript and React-specific rules

## Browser Polyfills
- **buffer**: Node.js Buffer polyfill for browser compatibility with crypto operations
- **crypto-browserify**: Cryptographic functions polyfill for browser environments
- **stream-browserify**: Node.js stream polyfill for blockchain library compatibility

## UI Components
- **lucide-react**: Modern icon library with consistent styling across the application
- **Custom Components**: Comprehensive set of reusable UI components for social media interactions