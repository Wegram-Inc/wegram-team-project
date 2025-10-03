import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Compass, Gamepad2, MessageCircle, Coins, Play, ShoppingCart } from 'lucide-react';

// Styles
import './styles/theme.css';

// Hooks
import { useNeonAuth } from './hooks/useNeonAuth';

// Layout Components
import { TopBar } from './components/Layout/TopBar';
import { BottomNav } from './components/Layout/BottomNav';
import { SideDrawer } from './components/Layout/SideDrawer';
import { AuthModal } from './components/Auth/AuthModal';
import { MessageModal } from './components/Layout/MessageModal';

// Pages
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/AuthPage';
import { XAuthPage } from './pages/XAuthPage';
import { EmailAuthPage } from './pages/EmailAuthPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { Profile } from './pages/Profile';
import { Analytics } from './pages/Analytics';
import { Compose } from './pages/Compose';
import { Wallet } from './pages/Wallet';
import { WalletSettings } from './pages/WalletSettings';
import { Help } from './pages/Help';
import { Rewards } from './pages/Rewards';
import { Livestream } from './pages/Livestream';
import { WegramAI } from './pages/WegramAI';
import { Trending } from './pages/Trending';
import { Verification } from './pages/Verification';
import { Explore } from './pages/Explore';
import { Games } from './pages/Games';
import { UserProfile } from './pages/UserProfile';
import { Messages } from './pages/Messages';
import { Bookmarks } from './pages/Bookmarks';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { Staking } from './pages/Staking';
import { BuyWegram } from './pages/BuyWegram';
import { Notifications } from './pages/Notifications';
import { LaunchToken } from './pages/LaunchToken';
import { Video } from './pages/Video';
import { ChatDetail } from './pages/ChatDetail';
import { Settings } from './pages/Settings';
import { CreateNew } from './pages/CreateNew';
import { CreateGroup } from './pages/CreateGroup';
import { WeRunner } from './pages/WeRunner';
import { AuthCallback } from './pages/AuthCallback';
import { TwitterCallback } from './pages/TwitterCallback';
import { DirectMessage } from './pages/DirectMessage';
// import { ProductKeyFooter } from './components/Layout/ProductKeyFooter'; // Commented out - see PRODUCT_KEY_BACKUP.md

function AppContent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, loading } = useNeonAuth();

  // Show auth modal if not authenticated and not loading
  useEffect(() => {
    // Only show auth modal if Supabase is configured
    // DISABLED - no auto popup
    // if (!loading && !profile) {
    //   setIsAuthOpen(true);
    // }
  }, [profile, loading]);

  const handleAuth = (method: string) => {
    console.log('Auth method:', method);
    setIsAuthOpen(false);
  };

  const handleGiftClick = () => {
    navigate('/rewards');
  };

  const handleMessageClick = () => {
    navigate('/messages');
  };

  const handleMessageUser = (username: string) => {
    setMessageRecipient(username);
    setIsMessageModalOpen(true);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // Don't show TopBar and BottomNav on landing and auth pages
  const hideNavigation = location.pathname === '/' || 
    location.pathname === '/auth' || 
    location.pathname === '/x-auth' || 
    location.pathname === '/email-auth' ||
    location.pathname.startsWith('/verify-email');

  // Hide top navigation (TopBar) on chat-style pages (custom headers)
  const hideTopNav = hideNavigation ||
    location.pathname.startsWith('/chat/') ||
    location.pathname.startsWith('/dm/');

  // Hide bottom navigation on pages where it shouldn't appear
  const hideBottomNav = hideNavigation ||
    location.pathname.startsWith('/chat/') ||
    location.pathname.startsWith('/dm/') ||
    location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/create-');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {!hideTopNav && (
        <TopBar 
          onMenuClick={() => setIsDrawerOpen(true)}
          onGiftClick={handleGiftClick}
          onMessageClick={handleMessageClick}
          onNotificationClick={handleNotificationClick}
        />
      )}
      
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/x-auth" element={<XAuthPage />} />
          <Route path="/email-auth" element={<EmailAuthPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/twitter/callback" element={<TwitterCallback />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/settings" element={<WalletSettings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/livestream" element={<Livestream />} />
          <Route path="/ai" element={<WegramAI />} />
          
          {/* Full functionality pages */}
          <Route path="/trending" element={<Trending />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/games" element={<Games />} />
          <Route path="/messages" element={<Messages />} />
          
          {/* User Profile */}
          <Route path="/user/:username" element={<UserProfile />} />
          
          {/* Chat Routes */}
          <Route path="/chat/:username" element={<ChatDetail />} />
          <Route path="/dm/:username" element={<DirectMessage />} />
          
          {/* Settings and Creation Routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-new" element={<CreateNew />} />
          <Route path="/create-group" element={<CreateGroup />} />
          
          {/* Game Routes */}
          <Route path="/werunner" element={<WeRunner />} />
          
          {/* Pages that need to be built */}
          <Route path="/staking" element={<Staking />} />
          <Route path="/video" element={<Video />} />
          <Route path="/buy-wegram" element={<BuyWegram />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/launch-token" element={<LaunchToken />} />
        </Routes>
      </main>

      {!hideBottomNav && <BottomNav />}
      
      {/* Product Key Footer - Commented out - see PRODUCT_KEY_BACKUP.md */}
      {/* {!hideTopNav && <ProductKeyFooter />} */}
      
      <SideDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuth={handleAuth}
      />
      
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientUsername={messageRecipient}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;