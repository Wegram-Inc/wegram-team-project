import React, { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export const WegramAI: React.FC = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your Wegram AI assistant. Ask me anything about Web3, crypto, or how to use Wegram!',
      timestamp: 'now'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: 'now'
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: 'This is a demo response from Wegram AI. Real AI integration coming soon.',
      timestamp: 'now'
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput('');
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold text-primary">Wegram AI</h1>
        </div>

        {/* Chat Area */}
        <div className="bg-overlay-medium rounded-lg p-4 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            className="input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="btn-primary px-4"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};