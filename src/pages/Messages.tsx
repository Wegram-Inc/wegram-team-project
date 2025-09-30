import React, { useState } from 'react';
import { Search, Settings, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Chat {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
  groupMembers?: number;
}

export const Messages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Alex Chen',
      username: '@alexchen',
      avatar: 'A',
      avatarColor: 'bg-gradient-to-br from-red-400 to-pink-500',
      lastMessage: 'Hey! Check out this new NFT dr...',
      timestamp: '2m',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Maya Rodriguez',
      username: '@mayarodriguez',
      avatar: 'M',
      avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
      lastMessage: 'The DeFi yield is looking amazing',
      timestamp: '15m',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Crypto Trader',
      username: '@crypto_trader',
      avatar: 'CT',
      avatarColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
      lastMessage: 'Market analysis: Bullish signals across all major pairs 📈',
      timestamp: '1h',
      unreadCount: 5,
      isOnline: false
    },
    {
      id: '4',
      name: 'NFT Collector',
      username: '@nft_collector',
      avatar: 'NC',
      avatarColor: 'bg-gradient-to-br from-orange-500 to-red-500',
      lastMessage: 'Just discovered an amazing rare piece! The floor is rising 🚀',
      timestamp: '3h',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '5',
      name: 'Jordan Kim',
      username: '@jordankim',
      avatar: 'J',
      avatarColor: 'bg-gradient-to-br from-pink-400 to-purple-500',
      lastMessage: 'Sent you 0.5 ETH',
      timestamp: '1d',
      unreadCount: 1,
      isOnline: false
    }
  ];

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (username: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Remove @ symbol for URL routing
    const cleanUsername = username.replace('@', '');
    navigate(`/user/${cleanUsername}`, { 
      state: { originalProfile: username, fromChat: true } 
    });
  };

  const handleChatClick = (chat: Chat) => {
    if (chat.isGroup) {
      // For groups, navigate to a group chat view
      navigate(`/chat/group/${chat.id}`);
    } else {
      // For individual chats, navigate to the chat detail
      navigate(`/chat/${chat.username}`);
    }
  };

  const handleCreateNew = () => {
    navigate('/create-group');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="max-w-md mx-auto pt-20 pb-24" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-overlay-light rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-secondary" />
            </button>
            <h1 className="text-2xl font-bold gradient-text">NeoChat</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCreateNew}
              className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-secondary" />
            </button>
            <button 
              onClick={handleSettings}
              className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 pr-4"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="px-4 space-y-3">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat)}
            className="card p-4 border-accent hover:bg-overlay-light transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div 
                className="relative flex-shrink-0 cursor-pointer"
                onClick={(e) => !chat.isGroup && handleUserClick(chat.username, e)}
              >
                <div className={`w-12 h-12 rounded-full ${chat.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                  {chat.avatar}
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2" style={{ borderColor: 'var(--bg)' }}></div>
                )}
              </div>

              {/* Chat Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 
                    className={`font-semibold text-primary truncate ${!chat.isGroup ? 'cursor-pointer hover:text-accent' : ''}`}
                    onClick={(e) => !chat.isGroup && handleUserClick(chat.username, e)}
                  >
                    {chat.name}
                  </h3>
                  <span className="text-xs text-secondary flex-shrink-0 ml-2">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p 
                    className={`text-sm text-secondary truncate flex-1 ${!chat.isGroup ? 'cursor-pointer hover:text-accent' : ''}`}
                    onClick={(e) => !chat.isGroup && handleUserClick(chat.username, e)}
                  >
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2" style={{ backgroundColor: 'var(--accent)' }}>
                      <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                    </div>
                  )}
                </div>
                {chat.isGroup && chat.groupMembers && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-secondary">{chat.groupMembers.toLocaleString()} members</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredChats.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-overlay-light flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-primary font-semibold mb-2">No chats found</h3>
          <p className="text-secondary text-sm">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};