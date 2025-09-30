import React, { useState, useRef, useEffect } from 'react';
import { Video, Users, MessageCircle, Heart, Share, Settings, Mic, MicOff, VideoOff, X, Send, Eye, Gift } from 'lucide-react';

interface StreamComment {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isSuperchat?: boolean;
  amount?: string;
}

interface StreamStats {
  viewers: number;
  likes: number;
  comments: number;
  shares: number;
  earnings: number;
}

export const Livestream: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamCategory, setStreamCategory] = useState('crypto');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cameraAccessDenied, setCameraAccessDenied] = useState(false);
  const [comments, setComments] = useState<StreamComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [stats, setStats] = useState<StreamStats>({
    viewers: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    earnings: 0
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock comments for demo
  const mockComments: StreamComment[] = [
    { id: '1', username: '@crypto_fan', message: 'Great stream! 🚀', timestamp: 'now' },
    { id: '2', username: '@solana_dev', message: 'Thanks for the alpha!', timestamp: '1m' },
    { id: '3', username: '@defi_trader', message: 'What do you think about the new protocol?', timestamp: '2m', isSuperchat: true, amount: '5 SOL' },
    { id: '4', username: '@nft_collector', message: 'Love your content! Keep it up 💎', timestamp: '3m' }
  ];

  useEffect(() => {
    if (isStreaming) {
      setComments(mockComments);
      // Simulate live stats updates
      const interval = setInterval(() => {
        setStats(prev => ({
          viewers: prev.viewers + Math.floor(Math.random() * 3) - 1,
          likes: prev.likes + Math.floor(Math.random() * 2),
          comments: prev.comments + (Math.random() > 0.7 ? 1 : 0),
          shares: prev.shares + (Math.random() > 0.9 ? 1 : 0),
          earnings: prev.earnings + (Math.random() > 0.8 ? 0.1 : 0)
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const startCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraAccessDenied(false);
        
        // Wait for video to load and then play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
      }
      
      setIsSetupMode(true);
    } catch (error) {
      console.warn('Camera access denied:', error);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setCameraAccessDenied(true);
      }
      
      // Fallback - show setup without actual camera
      setIsSetupMode(true);
    }
  };

  const startStreaming = () => {
    if (!streamTitle.trim()) {
      alert('Please enter a stream title');
      return;
    }
    
    setIsStreaming(true);
    setIsSetupMode(false);
    setCameraAccessDenied(false);
    setStats({
      viewers: Math.floor(Math.random() * 50) + 10,
      likes: 0,
      comments: 0,
      shares: 0,
      earnings: 0
    });
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    setIsSetupMode(false);
    setCameraAccessDenied(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleBackToStart = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsSetupMode(false);
    setCameraAccessDenied(false);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
      }
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
  };

  const sendComment = () => {
    if (!newComment.trim()) return;
    
    const comment: StreamComment = {
      id: Date.now().toString(),
      username: '@demo_user',
      message: newComment,
      timestamp: 'now'
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    setStats(prev => ({ ...prev, comments: prev.comments + 1 }));
  };

  const sendSuperchat = () => {
    // Superchat feature coming soon
    alert('Superchat feature coming soon! 💰');
  };

  if (!isStreaming && !isSetupMode) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="card text-center">
          <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-primary mb-2">Go Live</h1>
          <p className="text-secondary mb-8">Share your thoughts with the Wegram community</p>

          <div className="space-y-4">
            <button
              onClick={startCameraAccess}
              className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-3"
            >
              <Video className="w-5 h-5" />
              Start Streaming
            </button>
            
            <button
              onClick={() => alert('Schedule feature coming soon!')}
              className="btn-secondary w-full py-4 flex items-center justify-center gap-3"
            >
              <Settings className="w-5 h-5" />
              Schedule Stream
            </button>
          </div>

          <div className="mt-8 p-4 bg-purple-600 bg-opacity-10 rounded-lg">
            <h3 className="text-purple-400 font-semibold mb-2">Earn While Streaming</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-primary font-bold">Tips & Donations</div>
                <div className="text-secondary">SOL, USDC, WGM</div>
              </div>
              <div>
                <div className="text-primary font-bold">Viewer Rewards</div>
                <div className="text-secondary">Per viewer bonus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSetupMode) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">Stream Setup</h2>
            <button
              onClick={handleBackToStart}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Camera Preview */}
          {cameraAccessDenied && (
            <div className="mb-4 p-4 bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2">Camera Access Denied</h4>
              <p className="text-yellow-200 text-sm mb-2">
                To use your camera for streaming, please allow camera and microphone access in your browser.
              </p>
              <p className="text-yellow-200 text-sm">
                Look for the camera icon in your browser's address bar and click "Allow".
              </p>
            </div>
          )}

          <div className="relative mb-6">
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Camera Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <button
                onClick={toggleCamera}
                disabled={cameraAccessDenied}
                className={`p-3 rounded-full transition-colors ${
                  isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleMic}
                disabled={cameraAccessDenied}
                className={`p-3 rounded-full transition-colors ${
                  isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Stream Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-secondary text-sm mb-2">Stream Title</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="What's your stream about?"
                className="input"
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-secondary text-sm mb-2">Category</label>
              <select
                value={streamCategory}
                onChange={(e) => setStreamCategory(e.target.value)}
                className="input"
              >
                <option value="crypto">Crypto & Trading</option>
                <option value="defi">DeFi Discussion</option>
                <option value="nft">NFT Showcase</option>
                <option value="gaming">Web3 Gaming</option>
                <option value="education">Crypto Education</option>
                <option value="general">General Chat</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startStreaming}
              className="btn-primary w-full py-4 text-lg font-semibold"
              disabled={!streamTitle.trim() || cameraAccessDenied}
            >
              🔴 Go Live
            </button>
            <button
              onClick={handleBackToStart}
              className="btn-secondary w-full py-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live Streaming Interface
  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Stream Header */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-semibold">LIVE</span>
          </div>
          <button
            onClick={stopStreaming}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            End Stream
          </button>
        </div>
        
        <h2 className="text-primary font-semibold mb-2">{streamTitle}</h2>
        
        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Eye className="w-4 h-4" />
            </div>
            <div className="text-primary font-bold">{stats.viewers}</div>
            <div className="text-secondary text-xs">Viewers</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-primary font-bold">{stats.likes}</div>
            <div className="text-secondary text-xs">Likes</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-primary font-bold">{stats.comments}</div>
            <div className="text-secondary text-xs">Comments</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <Gift className="w-4 h-4" />
            </div>
            <div className="text-primary font-bold">{stats.earnings.toFixed(1)}</div>
            <div className="text-secondary text-xs">SOL</div>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative mb-4">
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {isCameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <VideoOff className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500">Camera Off</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Stream Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${
              isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition-colors ${
              isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Live Chat */}
      <div className="card">
        <h3 className="text-primary font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Live Chat
        </h3>
        
        {/* Comments */}
        <div className="bg-black bg-opacity-30 rounded-lg p-3 mb-4 h-48 overflow-y-auto">
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="text-sm">
                {comment.isSuperchat && (
                  <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded p-2 mb-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{comment.amount}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-medium">{comment.username}</span>
                  <span className="text-secondary text-xs">{comment.timestamp}</span>
                </div>
                <p className="text-primary">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comment Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Say something..."
            className="input flex-1 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && sendComment()}
          />
          <button
            onClick={sendComment}
            className="btn-primary px-4"
            disabled={!newComment.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={sendSuperchat}
          className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" />
          Send Superchat
        </button>
      </div>
    </div>
  );
};