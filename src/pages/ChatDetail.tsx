import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Phone, Video, Search, Send, Loader2 } from 'lucide-react';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { VerificationBadge } from '../components/VerificationBadge';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_username?: string;
  sender_avatar?: string;
  receiver_username?: string;
  receiver_avatar?: string;
}

interface ChatState {
  userId?: string;
  username?: string;
  name?: string;
  isNewChat?: boolean;
  avatar_url?: string;
  verified?: boolean;
}

export const ChatDetail: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useNeonAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [otherUser, setOtherUser] = useState<ChatState | null>(null);

  // Get chat info from navigation state or fetch user info
  useEffect(() => {
    const state = location.state as ChatState;
    if (state) {
      setOtherUser(state);
    } else if (username) {
      // If no state provided, we need to fetch user info
      fetchUserInfo();
    }
  }, [username, location.state]);

  // Load messages when we have both profile and otherUser
  useEffect(() => {
    if (profile?.id && otherUser?.userId) {
      loadMessages();
    }
  }, [profile?.id, otherUser?.userId]);

  const fetchUserInfo = async () => {
    if (!username) return;

    try {
      // Use the user-profile API to get complete user data including avatar and verification
      const response = await fetch(`/api/user-profile?username=${encodeURIComponent(username.replace('@', ''))}`);
      const data = await response.json();

      if (response.ok && data.user) {
        const user = data.user;
        setOtherUser({
          userId: user.id,
          username: user.username,
          name: user.username,
          avatar_url: user.avatar_url,
          verified: user.verified,
          isNewChat: false
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!profile?.id || !otherUser?.userId) return;

    try {
      const response = await fetch(`/api/messages?user1_id=${profile.id}&user2_id=${otherUser.userId}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages || []);
        // Mark messages as read when viewing the conversation
        markMessagesAsRead();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!profile?.id || !otherUser?.userId) return;

    try {
      await fetch('/api/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: profile.id,
          other_user_id: otherUser.userId,
        }),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !profile?.id || !otherUser?.userId || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: profile.id,
          receiver_id: otherUser.userId,
          content: messageText.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add message to local state immediately for better UX
        const newMessage = data.message;
        setMessages(prev => [...prev, newMessage]);
        setMessageText('');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const handleAvatarClick = () => {
    if (!otherUser?.username) return;

    const cleanUsername = otherUser.username.replace('@', '');
    navigate(`/user/${cleanUsername}`, {
      state: {
        fromChat: true,
        returnPath: `/chat/${username}`
      }
    });
  };


  return (
    <div className="max-w-md mx-auto" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>

            {/* User Avatar */}
            <button
              onClick={handleAvatarClick}
              className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            >
              {otherUser?.avatar_url ? (
                <img
                  src={otherUser.avatar_url}
                  alt={otherUser.username || username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full gradient-bg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {(otherUser?.username || username)?.charAt(1)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAvatarClick}
                  className="text-lg font-semibold text-primary hover:text-purple-400 hover:underline transition-all duration-200 cursor-pointer"
                >
                  {otherUser?.name || otherUser?.username || username}
                </button>
                {otherUser?.verified && (
                  <VerificationBadge
                    type={['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(otherUser.username || '') ? 'platinum' : 'gold'}
                    size="md"
                  />
                )}
              </div>
              <p className="text-sm text-secondary">
                {otherUser?.isNewChat ? 'Start a conversation' : 'Online'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-overlay-light rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-secondary" />
              </button>
              <button className="p-2 hover:bg-overlay-light rounded-lg transition-colors">
                <Video className="w-5 h-5 text-secondary" />
              </button>
              <button className="p-2 hover:bg-overlay-light rounded-lg transition-colors">
                <Search className="w-5 h-5 text-secondary" />
              </button>
              <button className="p-2 hover:bg-overlay-light rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 py-4 space-y-4" style={{ paddingBottom: '120px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-overlay-light flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-primary font-semibold mb-2">No messages yet</h3>
            <p className="text-secondary text-sm">Send the first message to start the conversation</p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromCurrentUser = message.sender_id === profile?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isFromCurrentUser
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-overlay-light text-primary'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isFromCurrentUser ? 'text-blue-100' : 'text-secondary'
                  }`}>
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>


      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="flex items-center gap-3" style={{ backgroundColor: 'var(--card)' }}>
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="iMessage"
              className="w-full px-4 py-3 rounded-lg text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontSize: '16px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isSending}
            className="p-3 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
