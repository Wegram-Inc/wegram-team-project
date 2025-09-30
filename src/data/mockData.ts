// Mock data for the prototype - easily replaceable with database calls

export interface User {
  id: string;
  username: string;
  email?: string;
  isAuthenticated: boolean;
  balance: number;
  assets: Asset[];
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  shares: number;
  gifts?: number;
}

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  logo?: string;
}

export interface Reward {
  id: string;
  title: string;
  amount: string;
  type: 'daily' | 'invite' | 'task';
  claimed: boolean;
}

// Mock user data
export const mockUser: User = {
  id: '1',
  username: '@demo_user',
  email: 'demo@wegram.com',
  isAuthenticated: false,
  balance: 1234.56,
  assets: [
    { symbol: 'WGM', name: 'Wegram', balance: 820.14 },
    { symbol: 'USDT', name: 'Tether', balance: 240.2 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.0123 },
    { symbol: 'ETH', name: 'Ethereum', balance: 1.45 }
  ]
};

// Mock posts data
export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    username: '@crypto_trader',
    content: 'Up 40% since I joined WEGRAM 🚀 — real web3 experience!',
    timestamp: '2h',
    likes: 24,
    replies: 8,
    shares: 5,
    gifts: 2
  },
  {
    id: '2',
    userId: '2',
    username: '@defi_expert',
    content: 'The future of social media is here. Earning while posting has never been this easy! #Web3 #SocialFi',
    timestamp: '4h',
    likes: 156,
    replies: 32,
    shares: 18,
    gifts: 7
  },
  {
    id: '3',
    userId: '3',
    username: '@nft_collector',
    content: 'Just completed my daily check-in and earned +2 WGM! These micro-rewards really add up over time.',
    timestamp: '6h',
    likes: 67,
    replies: 12,
    shares: 9,
    gifts: 3
  },
  {
    id: '4',
    userId: '4',
    username: '@web3_dev',
    content: '🚀 Just deployed my first smart contract on Solana! The future is decentralized. Building the next generation of DeFi protocols.',
    timestamp: '8h',
    likes: 247,
    replies: 89,
    shares: 34,
    gifts: 12
  },
  {
    id: '5',
    userId: '5',
    username: '@crypto_whale',
    content: 'Market update: SOL looking bullish! 📈 The Web3 ecosystem is growing stronger every day. Time to accumulate more tokens!',
    timestamp: '12h',
    likes: 892,
    replies: 156,
    shares: 78,
    gifts: 45
  },
  {
    id: '6',
    userId: '6',
    username: '@nft_artist',
    content: '🎨 New NFT collection dropping tomorrow! Each piece tells a story of the digital revolution. Web3 is empowering creators like never before.',
    timestamp: '1d',
    likes: 524,
    replies: 203,
    shares: 91,
    gifts: 28
  },
  {
    id: '7',
    userId: '7',
    username: '@defi_guru',
    content: 'Yield farming strategies for 2025: 💰 1. Diversify protocols 2. Monitor impermanent loss 3. Compound rewards 4. Stay updated on new pools',
    timestamp: '1d',
    likes: 1247,
    replies: 234,
    shares: 156,
    gifts: 67
  },
  {
    id: '8',
    userId: '8',
    username: '@blockchain_news',
    content: '🔥 BREAKING: Major DeFi protocol announces integration with Solana. This could be a game-changer for cross-chain liquidity!',
    timestamp: '2d',
    likes: 2156,
    replies: 445,
    shares: 289,
    gifts: 134
  },
  {
    id: '9',
    userId: '9',
    username: '@solana_builder',
    content: 'Building on Solana is incredible! ⚡ The speed and low fees make it perfect for consumer applications. The ecosystem is thriving!',
    timestamp: '2d',
    likes: 678,
    replies: 123,
    shares: 56,
    gifts: 23
  },
  {
    id: '10',
    userId: '10',
    username: '@crypto_educator',
    content: '📚 Web3 Education Thread: Understanding smart contracts, DeFi protocols, and the future of decentralized finance. Knowledge is power!',
    timestamp: '3d',
    likes: 934,
    replies: 178,
    shares: 267,
    gifts: 45
  },
  {
    id: '11',
    userId: '11',
    username: '@metaverse_explorer',
    content: '🌐 Exploring virtual worlds built on blockchain! The metaverse is becoming reality. Own your digital assets, control your destiny.',
    timestamp: '3d',
    likes: 445,
    replies: 67,
    shares: 23,
    gifts: 15
  }
];

// Mock rewards data
export const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Daily check-in',
    amount: '+2 WGM',
    type: 'daily',
    claimed: false
  },
  {
    id: '2',
    title: 'Invite a friend',
    amount: '+10 WGM',
    type: 'invite',
    claimed: false
  }
];

// Mock FAQ data
export const mockFAQ = [
  {
    question: 'How do I earn WGM tokens?',
    answer: 'Complete daily tasks, create posts, and engage with the community.'
  },
  {
    question: 'How does the wallet work?',
    answer: 'Your wallet securely stores WGM and other crypto assets.'
  },
  {
    question: 'How do I report a bug?',
    answer: 'Use the contact form →'
  },
  {
    question: 'What is WGM?',
    answer: 'WGM is the native token of WEGRAM used for rewards and transactions.'
  }
];