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
import { Stats } from './pages/Stats';
import { LaunchToken } from './pages/LaunchToken';
import { Video } from './pages/Video';
import { ChatDetail } from './pages/ChatDetail';
import { Settings } from './pages/Settings';
import { CreateNew } from './pages/CreateNew';
import { CreateGroup } from './pages/CreateGroup';
import { WeRunner } from './pages/WeRunner';
import { Maintenance } from './pages/Maintenance';
import { WegramMiner } from './pages/WegramMiner';
import { AuthCallback } from './pages/AuthCallback';
import { TwitterCallback } from './pages/TwitterCallback';
import { DirectMessage } from './pages/DirectMessage';
import { PostComments } from './pages/PostComments';
import { NotificationSettings } from './pages/NotificationSettings';
import { Following } from './pages/Following';
import { Followers } from './pages/Followers';
import { BlockedUsers } from './pages/BlockedUsers';
import { Logout } from './pages/Logout';
import { DesktopSidebar } from './components/Layout/DesktopSidebar';
import { DesktopRightSidebar } from './components/Layout/DesktopRightSidebar';
import { DesktopFloatingComposer } from './components/Layout/DesktopFloatingComposer';
// import { ProductKeyFooter } from './components/Layout/ProductKeyFooter'; // Commented out - see PRODUCT_KEY_BACKUP.md

// Shared Routes Component to avoid duplication
const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/x-auth" element={<XAuthPage />} />
    <Route path="/email-auth" element={<EmailAuthPage />} />
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
    <Route path="/games/wegram-miner" element={<WegramMiner />} />
    <Route path="/messages" element={<Messages />} />

    {/* User Profile */}
    <Route path="/user/:username" element={<UserProfile />} />
    <Route path="/user/:username/following" element={<Following />} />
    <Route path="/user/:username/followers" element={<Followers />} />
    <Route path="/user/:username/blocked" element={<BlockedUsers />} />

    {/* Post Comments */}
    <Route path="/post/:postId/comments" element={<PostComments />} />

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
    <Route path="/notification-settings" element={<NotificationSettings />} />
    <Route path="/stats" element={<Stats />} />
    <Route path="/launch-token" element={<LaunchToken />} />
  </Routes>
);

function AppContent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<string | undefined>(undefined);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceChecked, setMaintenanceChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, loading } = useNeonAuth();

  // Check maintenance mode on app load
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/maintenance');
        const data = await response.json();
        setMaintenanceMode(data.maintenance_mode || false);
      } catch (error) {
        console.error('Failed to check maintenance mode:', error);
      } finally {
        setMaintenanceChecked(true);
      }
    };
    checkMaintenance();
  }, []);

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
    location.pathname === '/email-auth';

  // Hide desktop sidebars only on landing/auth pages, not when loading or logged in
  const hideDesktopSidebars = hideNavigation;

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

  // Show maintenance page if in maintenance mode (except on landing page)
  if (maintenanceChecked && maintenanceMode && location.pathname !== '/') {
    return <Maintenance />;
  }

  // Show loading while checking maintenance
  if (!maintenanceChecked) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold">WEGRAM</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Desktop Sidebars - Only show on lg+ screens when logged in */}
      {!hideDesktopSidebars && (
        <>
          {/* Left Sidebar */}
          <div className="hidden lg:block fixed left-0 top-0 w-64 h-screen z-30">
            <div className="h-full overflow-hidden">
              <DesktopSidebar />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block fixed right-0 top-0 w-80 h-screen z-30">
            <div className="h-full">
              <DesktopRightSidebar />
            </div>
          </div>
        </>
      )}

      {/* Main Content - Responsive margins for desktop sidebars */}
      <main className="min-h-screen">
        <div
          className={`${
            !hideDesktopSidebars
              ? 'lg:ml-64 lg:mr-80'
              : ''
          }`}
        >
          {/* TopBar - Part of document flow, not fixed */}
          {!hideTopNav && (
            <TopBar
              onMenuClick={() => setIsDrawerOpen(true)}
              onGiftClick={handleGiftClick}
              onMessageClick={handleMessageClick}
              onNotificationClick={handleNotificationClick}
            />
          )}

          <AppRoutes />
        </div>
      </main>

      {/* Bottom Navigation - Only show on mobile */}
      <div className="lg:hidden">
        {!hideBottomNav && <BottomNav />}
      </div>

      {/* Desktop Floating Composer - Only shows on desktop and home page */}
      <div className="hidden lg:block">
        {location.pathname === '/home' && <DesktopFloatingComposer />}
      </div>

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
        onMessageSent={() => {
          // Message sent successfully
          console.log('Message sent successfully from App');
        }}
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