import React, { useState, useEffect } from 'react';
import { Search, Settings, Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';

interface Chat {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatar_url?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  verified: boolean;
  isOnline: boolean;
  lastSenderId?: string;
}

interface SearchUser {
  id: string;
  username: string;
  displayName: string;
  avatar_url?: string;
  bio?: string;
  verified: boolean;
  followers_count: number;
}

export const Messages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { profile } = useNeonAuth();
  const navigate = useNavigate();

  // Load conversations on component mount
  useEffect(() => {
    if (profile?.id) {
      loadConversations();
    }
  }, [profile?.id]);

  // Search users when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchSystemUsers();
      setShowSearchResults(true);
    } else {
      setSearchUsers([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const loadConversations = async () => {
    if (!profile?.id) return;

    try {
      const response = await fetch(`/api/conversations?user_id=${profile.id}`);
      const data = await response.json();

      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const searchSystemUsers = async () => {
    if (!searchQuery.trim() || !profile?.id) return;

    setIsSearchingUsers(true);
    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(searchQuery)}&exclude_user=${profile.id}`);
      const data = await response.json();

      if (data.success) {
        setSearchUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const filteredConversations = conversations.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (username: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const cleanUsername = username.replace('@', '');
    navigate(`/user/${cleanUsername}`, {
      state: { originalProfile: username, fromChat: true }
    });
  };

  const handleChatClick = (chat: Chat) => {
    const cleanUsername = chat.username.replace('@', '');
    navigate(`/chat/${cleanUsername}`, {
      state: {
        userId: chat.id,
        username: chat.username,
        name: chat.name
      }
    });
  };

  const handleStartChat = (user: SearchUser) => {
    const cleanUsername = user.username.replace('@', '');
    navigate(`/chat/${cleanUsername}`, {
      state: {
        userId: user.id,
        username: user.username,
        name: user.displayName,
        isNewChat: true
      }
    });
    setSearchQuery('');
    setShowSearchResults(false);
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
            placeholder="Search users or messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 pr-4"
            style={{ fontSize: '16px' }}
          />
          {isSearchingUsers && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent w-4 h-4 animate-spin" />
          )}
        </div>
      </div>

      {/* Search Results */}
      {showSearchResults && (
        <div className="px-4 mb-6">
          <h2 className="text-sm font-semibold text-secondary mb-3 px-1">People</h2>
          <div className="space-y-2">
            {searchUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleStartChat(user)}
                className="card p-3 hover:bg-overlay-light transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {user.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-primary truncate">{user.displayName}</h3>
                      <span className="text-sm text-secondary">{user.username}</span>
                    </div>
                    {user.bio && (
                      <p className="text-sm text-secondary truncate">{user.bio}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-secondary">{user.followers_count.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {searchUsers.length === 0 && !isSearchingUsers && (
            <div className="text-center py-6">
              <p className="text-secondary text-sm">No users found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Chat List */}
      {!showSearchResults && (
        <div className="px-4 space-y-3">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {filteredConversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className="card p-4 border-accent hover:bg-overlay-light transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="relative flex-shrink-0 cursor-pointer"
                      onClick={(e) => handleUserClick(chat.username, e)}
                    >
                      {chat.avatar_url ? (
                        <img
                          src={chat.avatar_url}
                          alt={chat.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{chat.avatar}</span>
                        </div>
                      )}
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2" style={{ borderColor: 'var(--bg)' }}></div>
                      )}
                      {chat.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className="font-semibold text-primary truncate cursor-pointer hover:text-accent"
                          onClick={(e) => handleUserClick(chat.username, e)}
                        >
                          {chat.name}
                        </h3>
                        <span className="text-xs text-secondary flex-shrink-0 ml-2">{chat.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-secondary truncate flex-1">
                          {chat.lastSenderId === profile?.id && "You: "}{chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2" style={{ backgroundColor: 'var(--accent)' }}>
                            <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Conversations search results when searching in existing chats */}
      {!showSearchResults && searchQuery && filteredConversations.length === 0 && !isLoadingConversations && (
        <div className="px-4">
          <div className="text-center py-6">
            <p className="text-secondary text-sm">No conversations found matching "{searchQuery}"</p>
          </div>
        </div>
      )}

      {/* Empty State - No conversations */}
      {!showSearchResults && !isLoadingConversations && conversations.length === 0 && !searchQuery && (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-overlay-light flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-primary font-semibold mb-2">No conversations yet</h3>
          <p className="text-secondary text-sm mb-4">Search for users above to start your first conversation</p>
        </div>
      )}
    </div>
  );
};