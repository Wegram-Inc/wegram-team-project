import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Video, CheckCircle, MoreHorizontal } from 'lucide-react';
import { useNeonAuth } from '../hooks/useNeonAuth';

interface UserProfileData {
  username: string;
  displayName: string;
  bio: string;
  joinDate: string;
  followers: number;
  avatar: string;
  verified: boolean;
}

// Mock user data for the chat recipient
const mockUsers: { [key: string]: UserProfileData } = {
  'vis': {
    username: 'vis',
    displayName: 'VIS',
    bio: 'Visionary | Former Operations Analyst | Human Terrain-Mapping and Behavior Pattern Recognition Specialist',
    joinDate: 'June 2021',
    followers: 3100,
    avatar: 'V',
    verified: true,
  },
  'alexchen': {
    username: 'alexchen',
    displayName: 'Alex Chen',
    bio: 'Web3 enthusiast and NFT collector.',
    joinDate: 'Jan 2023',
    followers: 1200,
    avatar: 'A',
    verified: false,
  },
  'cryptorap': {
    username: 'cryptorap',
    displayName: 'Crypto Rap',
    bio: 'Rapping about crypto and Web3. Making blockchain music that hits different! 🎵',
    joinDate: 'March 2022',
    followers: 8900,
    avatar: 'CR',
    verified: true,
  },
};

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_username: string;
  sender_avatar: string;
  receiver_username: string;
  receiver_avatar: string;
}

export const DirectMessage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { profile: currentUser } = useNeonAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user data and messages
  useEffect(() => {
    const fetchData = async () => {
      if (!username || !currentUser) return;
      
      setLoading(true);
      try {
        // Fetch other user's profile
        const userResponse = await fetch(`/api/user-profile?username=${encodeURIComponent(username)}`);
        const userResult = await userResponse.json();
        
        if (userResponse.ok && userResult.user) {
          setOtherUser(userResult.user);
          
          // Fetch messages between current user and other user
          const messagesResponse = await fetch(`/api/messages?user1_id=${currentUser.id}&user2_id=${userResult.user.id}`);
          const messagesResult = await messagesResponse.json();
          
          if (messagesResponse.ok && messagesResult.messages) {
            setMessages(messagesResult.messages);
          }
        } else {
          // Fallback to mock data
          const mockUser = mockUsers[username] || {
            username: `@${username}`,
            displayName: username?.toUpperCase() || 'USER',
            bio: 'Web3 enthusiast',
            joinDate: '2024',
            followers: 0,
            avatar: username?.charAt(0)?.toUpperCase() || 'U',
            verified: false,
          };
          setOtherUser(mockUser);
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockUser = mockUsers[username] || {
          username: `@${username}`,
          displayName: username?.toUpperCase() || 'USER',
          bio: 'Web3 enthusiast',
          joinDate: '2024',
          followers: 0,
          avatar: username?.charAt(0)?.toUpperCase() || 'U',
          verified: false,
        };
        setOtherUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock user data - use the mockUsers data or fallback
  const user = otherUser || mockUsers[username || 'cryptorap'] || {
    username: `@${username}`,
    displayName: username?.toUpperCase() || 'USER',
    bio: 'Web3 enthusiast and content creator.',
    joinDate: 'June 2021',
    followers: 3100,
    avatar: username?.charAt(0)?.toUpperCase() || 'U',
    verified: false,
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !otherUser || sending) return;
    
    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: otherUser.id,
          content: message.trim()
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Add the new message to the messages list
        const newMessage: Message = {
          id: result.message.id,
          sender_id: currentUser.id,
          receiver_id: otherUser.id,
          content: message.trim(),
          created_at: result.message.created_at,
          sender_username: currentUser.username,
          sender_avatar: currentUser.avatar_url || '',
          receiver_username: otherUser.username,
          receiver_avatar: otherUser.avatar_url || ''
        };
        
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
      } else {
        alert(result.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--bg)' }}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div className="flex-1"></div> {/* Empty space to balance the back button */}
      </div>

      <div className="max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
        {/* User Profile Info */}
        <div className="px-4 py-6">
          {/* Centered Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                  {user.username?.charAt(1)?.toUpperCase() || user.avatar || 'U'}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold gradient-text">{user.username?.replace('@', '') || user.displayName}</h2>
              {user.verified && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-primary text-sm leading-relaxed text-center mb-2">{user.bio || 'Web3 enthusiast'}</p>
            <p className="text-xs text-secondary">Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : user.joinDate} • {(user.followers_count || user.followers || 0).toLocaleString()} Followers</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="px-4 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-secondary text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isFromCurrentUser = msg.sender_id === currentUser?.id;
                  const messageTime = new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  
                  return (
                    <div key={msg.id} className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-xl ${
                        isFromCurrentUser 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`text-xs mt-1 ${
                          isFromCurrentUser ? 'text-blue-100 opacity-70' : 'text-secondary opacity-70'
                        }`}>
                          {messageTime}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input - Card Container */}
        <div className="p-4">
          <div className="card p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="input flex-1 resize-none min-h-[40px] max-h-[120px] py-2"
                rows={1}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};