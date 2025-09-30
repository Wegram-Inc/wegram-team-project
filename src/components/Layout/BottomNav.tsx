import React, { useState } from 'react';
import { BarChart3, Plus, Wallet, HelpCircle, Play, Type, Image, Video, X, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockUser } from '../../data/mockData';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'video', label: 'Video', icon: Play, path: '/video' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'add', label: 'Add', icon: Plus, path: '/compose' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet' },
    { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-around py-2 border-t" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
            if (tab.id === 'add') {
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setTextContent('');
                    setSelectedFiles([]);
                    setShowCreateModal(true);
                  }}
                  className="fab"
                  style={{ position: 'relative', bottom: 'auto', right: 'auto', margin: '0 8px' }}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-1 py-2 px-3 transition-all duration-200 focus:outline-none"
              >
                <Icon 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-purple-400' : 'text-gray-400'
                  }`}
                />
                <span 
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive ? 'text-purple-400' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Modal (centered quick composer) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCreateModal(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-sm rounded-2xl p-5 shadow-xl"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            {/* Close */}
            <div className="flex items-center justify-end mb-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:opacity-80"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Composer UI (Twitter-like) */}
            <h3 className="text-center text-primary font-semibold mb-3">New post</h3>
            <div className="flex items-start gap-3 mb-4">
              <button
                onClick={() => {
                  // Close modal first, then navigate to avoid popup issues
                  setShowCreateModal(false);
                  setTimeout(() => {
                    navigate(`/user/${mockUser.username.replace('@', '')}`);
                  }, 100);
                }}
                className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                aria-label="Open profile"
              >
                <User className="w-5 h-5 text-white" />
              </button>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="What's happening?"
                className="flex-1 h-28 bg-transparent text-primary outline-none resize-none"
                style={{ color: 'var(--text)', fontSize: '16px' }}
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="mb-3 text-sm text-secondary">{selectedFiles.length} file(s) selected</div>
            )}

            <div className="h-px mb-3" style={{ backgroundColor: 'var(--border)' }} />

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => imageInputRef.current?.click()} 
                  className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity" 
                  aria-label="Add photo"
                >
                  <Image className="w-6 h-6" style={{ color: 'var(--gradA)' }} />
                </button>
                <button 
                  onClick={() => videoInputRef.current?.click()} 
                  className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity" 
                  aria-label="Add video"
                >
                  <Video className="w-6 h-6" style={{ color: 'var(--gradA)' }} />
                </button>
              </div>
              <button
                onClick={() => {
                  // Add more content or expand options - don't close modal
                  setTextContent(prev => prev + ' ');
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'var(--accent)' }}
                aria-label="Add more"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            <button
              onClick={() => {
                const content = textContent.trim() || (selectedFiles.length > 0 ? 'Shared media' : '');
                if (!content) return; 
                window.dispatchEvent(new CustomEvent('wegram:new-post', { detail: { content } }));
                setShowCreateModal(false);
                setTextContent('');
                setSelectedFiles([]);
              }}
              className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}
              disabled={!textContent.trim() && selectedFiles.length === 0}
            >
              Post Now
            </button>

            {/* Hidden inputs for media selection */}
            <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setSelectedFiles(files);
            }} />
            <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setSelectedFiles(files);
            }} />
          </div>
        </div>
      )}
    </div>
  );
};