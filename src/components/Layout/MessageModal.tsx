import React, { useState } from 'react';
import { X, Send, Search, Users } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUsername?: string;
}

interface Contact {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose, 
  recipientUsername 
}) => {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Mock contacts
  const contacts: Contact[] = [
    {
      id: '1',
      username: '@crypto_trader',
      displayName: 'CryptoTrader',
      avatar: '👨‍💼',
      isOnline: true
    },
    {
      id: '2',
      username: '@defi_expert',
      displayName: 'DeFi Expert',
      avatar: '🧠',
      isOnline: false,
      lastSeen: '2h ago'
    },
    {
      id: '3',
      username: '@nft_collector',
      displayName: 'NFT Collector',
      avatar: '🎨',
      isOnline: true
    }
  ];

  // If recipientUsername is provided, auto-select that contact
  React.useEffect(() => {
    if (recipientUsername && isOpen) {
      const contact = contacts.find(c => c.username === recipientUsername);
      if (contact) {
        setSelectedContact(contact);
      } else {
        // Create a temporary contact for the recipient
        setSelectedContact({
          id: 'temp',
          username: recipientUsername,
          displayName: recipientUsername.replace('@', ''),
          avatar: '👤',
          isOnline: false
        });
      }
    }
  }, [recipientUsername, isOpen]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;
    
    // In real app, this would send the message via API
    console.log('Sending message to:', selectedContact.username, 'Message:', message);
    alert(`Message sent to ${selectedContact.username}: "${message}"`);
    setMessage('');
    onClose();
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {selectedContact ? `Message ${selectedContact.displayName}` : 'New Message'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact Selection */}
        {!selectedContact && (
          <div className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="input pl-10 pr-4"
              />
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg">
                      {contact.avatar}
                    </div>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-primary font-medium">{contact.displayName}</div>
                    <div className="text-secondary text-sm">
                      {contact.isOnline ? 'Online' : contact.lastSeen || 'Offline'}
                    </div>
                  </div>
                </button>
              ))}
              
              {filteredContacts.length === 0 && (
                <div className="text-center py-8 text-secondary">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No contacts found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Contact Info */}
        {selectedContact && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg">
                {selectedContact.avatar}
              </div>
              {selectedContact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-primary font-medium">{selectedContact.displayName}</div>
              <div className="text-secondary text-sm">
                {selectedContact.isOnline ? 'Online' : selectedContact.lastSeen || 'Offline'}
              </div>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-3 mt-auto">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={selectedContact ? `Message ${selectedContact.displayName}...` : 'Select a contact first...'}
            className="input flex-1 resize-none h-20"
            disabled={!selectedContact}
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
            disabled={!message.trim() || !selectedContact}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-secondary text-center mt-3">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};