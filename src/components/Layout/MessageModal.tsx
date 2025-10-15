import React, { useState, useEffect } from 'react';
import { X, Send, Search, Users, Loader2 } from 'lucide-react';
import { useNeonAuth } from '../../hooks/useNeonAuth';
import goldVerificationIcon from '../../assets/gold-verification.png';
import platinumVerificationIcon from '../../assets/platinum-verification.png';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUsername?: string;
  onMessageSent?: () => void;
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

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  recipientUsername,
  onMessageSent
}) => {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { profile } = useNeonAuth();

  // Search users when query changes
  useEffect(() => {
    if (searchQuery.trim() && profile?.id) {
      searchSystemUsers();
    } else {
      setSearchUsers([]);
    }
  }, [searchQuery, profile?.id]);

  // Handle recipient username if provided
  useEffect(() => {
    if (recipientUsername && isOpen) {
      // Search for the specific user
      fetchUserByUsername(recipientUsername);
    }
  }, [recipientUsername, isOpen]);

  const searchSystemUsers = async () => {
    if (!searchQuery.trim() || !profile?.id) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(searchQuery)}&exclude_user=${profile.id}`);
      const data = await response.json();

      if (data.success) {
        setSearchUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchUserByUsername = async (username: string) => {
    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(username.replace('@', ''))}`);
      const data = await response.json();

      if (data.success && data.users.length > 0) {
        setSelectedUser(data.users[0]);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser || !profile?.id || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: profile.id,
          receiver_id: selectedUser.id,
          content: message.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('');
        onClose();
        // Trigger refresh of conversations list
        onMessageSent?.();
        // Success feedback
        alert(`Message sent to ${selectedUser.displayName}!`);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleUserSelect = (user: SearchUser) => {
    setSelectedUser(user);
    setSearchQuery('');
    setSearchUsers([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative card max-w-sm w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-primary">
            {selectedUser ? `Message ${selectedUser.displayName}` : 'New Message'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Search */}
        {!selectedUser && (
          <div className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users to message..."
                className="input pl-10 pr-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent w-4 h-4 animate-spin" />
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {searchUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className="relative flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {user.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5">
                        {['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(user.username) ? (
                          <img
                            src={platinumVerificationIcon}
                            alt="Platinum Verified"
                            className="w-4 h-4 shadow-lg"
                          />
                        ) : (
                          <img
                            src={goldVerificationIcon}
                            alt="Verified"
                            className="w-4 h-4 shadow-lg"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-primary font-medium">{user.displayName}</div>
                    <div className="text-secondary text-sm">{user.username}</div>
                    {user.bio && (
                      <div className="text-secondary text-xs truncate">{user.bio}</div>
                    )}
                  </div>
                  <div className="text-xs text-secondary">
                    {user.followers_count.toLocaleString()} followers
                  </div>
                </button>
              ))}

              {searchQuery && searchUsers.length === 0 && !isSearching && (
                <div className="text-center py-8 text-secondary">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No users found matching "{searchQuery}"</p>
                </div>
              )}

              {!searchQuery && (
                <div className="text-center py-8 text-secondary">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start typing to search for users</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected User & Avatar Display */}
        {selectedUser && (
          <div className="mb-4">
            {/* Avatar Row showing both users */}
            <div className="flex items-center justify-center gap-4 mb-4 p-4 bg-gray-800 bg-opacity-30 rounded-lg">
              {/* Your Avatar */}
              <div className="text-center">
                <div className="relative">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="You"
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto">
                      <span className="text-white font-semibold">
                        {(profile?.username?.replace('@', '').charAt(0) || profile?.email?.charAt(0) || 'Y').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-secondary mt-1">You</p>
              </div>

              {/* Arrow */}
              <div className="text-accent">
                <Send className="w-5 h-5" />
              </div>

              {/* Recipient Avatar */}
              <div className="text-center">
                <div className="relative">
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url}
                      alt={selectedUser.username}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto">
                      <span className="text-white font-semibold">
                        {selectedUser.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {selectedUser.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5">
                      {['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(selectedUser.username) ? (
                        <img
                          src={platinumVerificationIcon}
                          alt="Platinum Verified"
                          className="w-4 h-4 shadow-lg"
                        />
                      ) : (
                        <img
                          src={goldVerificationIcon}
                          alt="Verified"
                          className="w-4 h-4 shadow-lg"
                        />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-secondary mt-1">{selectedUser.displayName}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
              <div className="flex-1">
                <div className="text-primary font-medium">{selectedUser.displayName}</div>
                <div className="text-secondary text-sm">{selectedUser.username}</div>
                {selectedUser.bio && (
                  <div className="text-secondary text-xs mt-1">{selectedUser.bio}</div>
                )}
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-3 mt-auto">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={selectedUser ? `Message ${selectedUser.displayName}...` : 'Select a user first...'}
            className="input flex-1 resize-none h-20"
            disabled={!selectedUser}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary px-4 self-end"
            disabled={!message.trim() || !selectedUser || isSending}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-xs text-secondary text-center mt-3">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};