import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share, Bookmark, User, Play, Volume2, VolumeX, Plus, Upload, X, Camera, Video as VideoIcon, RotateCcw, CheckCircle, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoPost {
  id: string;
  username: string;
  displayName: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  thumbnail: string;
  gradient: string;
}

export const Video: React.FC = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Camera states
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const [videos] = useState<VideoPost[]>([
    {
      id: '1',
      username: '@crypto_trader',
      displayName: 'Crypto Trader',
      description: 'Just made 500% gains on this new Solana gem! 💎 Who else is buying the dip? #SolanaGems #CryptoGains',
      likes: 12400,
      comments: 892,
      shares: 234,
      isLiked: false,
      isBookmarked: false,
      thumbnail: '🚀',
      gradient: 'from-purple-600 via-blue-600 to-cyan-600'
    },
    {
      id: '2',
      username: '@defi_queen',
      displayName: 'DeFi Queen',
      description: 'How I earn $1000/day yield farming on Solana 🌾 Step by step tutorial! Link in bio #DeFi #YieldFarming',
      likes: 8900,
      comments: 567,
      shares: 189,
      isLiked: true,
      isBookmarked: false,
      thumbnail: '🌾',
      gradient: 'from-pink-600 via-purple-600 to-blue-600'
    },
    {
      id: '3',
      username: '@nft_artist',
      displayName: 'NFT Artist',
      description: 'Creating my latest NFT collection live! 🎨 What do you think of this piece? Drop your thoughts below!',
      likes: 15600,
      comments: 1234,
      shares: 456,
      isLiked: false,
      isBookmarked: true,
      thumbnail: '🎨',
      gradient: 'from-green-600 via-teal-600 to-blue-600'
    },
    {
      id: '4',
      username: '@solana_dev',
      displayName: 'Solana Dev',
      description: 'Building the next big dApp on Solana! 👨‍💻 This is going to change everything. Beta coming soon! #Solana #Web3',
      likes: 6700,
      comments: 345,
      shares: 123,
      isLiked: false,
      isBookmarked: false,
      thumbnail: '👨‍💻',
      gradient: 'from-orange-600 via-red-600 to-pink-600'
    },
    {
      id: '5',
      username: '@web3_influencer',
      displayName: 'Web3 Influencer',
      description: 'Why WEGRAM is the future of social media! 🔥 Earning while posting is revolutionary. Join the movement!',
      likes: 23400,
      comments: 1890,
      shares: 678,
      isLiked: true,
      isBookmarked: true,
      thumbnail: '🔥',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600'
    }
  ]);

  const [likedVideos, setLikedVideos] = useState<Set<string>>(
    new Set(videos.filter(v => v.isLiked).map(v => v.id))
  );
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Set<string>>(
    new Set(videos.filter(v => v.isBookmarked).map(v => v.id))
  );

  const handleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleBookmark = (videoId: string) => {
    setBookmarkedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleComment = (videoId: string) => {
    alert('Comments feature coming soon! 💬');
  };

  const handleShare = (videoId: string) => {
    alert('Video shared! 📤');
  };

  const handleUploadVideo = () => {
    setShowUploadModal(true);
  };

  const handleRecordVideo = () => {
    setShowCameraModal(true);
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(startCamera, 100);
  };

  const startRecording = () => {
    if (!cameraStream) return;

    recordedChunks.current = [];
    const mediaRecorder = new MediaRecorder(cameraStream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);
      stopCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retryRecording = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    startCamera();
  };

  const closeCameraModal = () => {
    stopCamera();
    setShowCameraModal(false);
    setRecordedVideo(null);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        setUploadFile(file);
      } else {
        alert('Please select a video file');
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      alert('Please select a video and enter a title');
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      alert('📱 Video selected successfully! Upload feature coming soon with database integration.');
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setIsUploading(false);
    }, 1000);
  };

  const handleCloseUpload = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadTitle('');
    setUploadDescription('');
  };

  const handleFollow = (username: string) => {
    alert(`Now following ${username}! ✨`);
  };

  const handleUserClick = (username: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/user/${username}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-primary">Videos</h1>
            <div className="flex gap-2">
              <button
                onClick={handleRecordVideo}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center hover:scale-105 transition-transform"
                title="Record video"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleUploadVideo}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform"
                title="Upload from gallery"
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          <p className="text-secondary text-sm">Record or upload Web3 videos</p>
        </div>

        {/* Video Feed */}
        <div className="space-y-6">
          {videos.map((video) => (
            <div key={video.id} className="px-4">
              {/* Video Container */}
              <div className="relative">
                {/* Video Frame */}
                <div className={`aspect-[9/16] rounded-2xl bg-gradient-to-br ${video.gradient} relative overflow-hidden border-2 border-gray-700`}>
                  {/* Video Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-30 animate-pulse">
                      {video.thumbnail}
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-1/4 left-1/4 text-3xl opacity-20 animate-bounce">
                    💎
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 text-2xl opacity-20 animate-pulse">
                    🚀
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-all transform hover:scale-110">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-70 transition-all">
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>0:23</span>
                      <div className="flex-1 h-1 bg-white bg-opacity-30 rounded-full">
                        <div className="w-1/3 h-full bg-white rounded-full"></div>
                      </div>
                      <span>1:45</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Right Side */}
                <div className="absolute right-2 bottom-20 flex flex-col gap-4">
                  {/* Like */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleLike(video.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                        likedVideos.has(video.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${likedVideos.has(video.id) ? 'fill-current' : ''}`} />
                    </button>
                    <span className="text-white text-xs mt-1 font-medium">
                      {video.likes > 1000 ? `${(video.likes / 1000).toFixed(1)}K` : video.likes}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleComment(video.id)}
                      className="w-12 h-12 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 flex items-center justify-center transition-all transform hover:scale-110"
                    >
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <span className="text-white text-xs mt-1 font-medium">
                      {video.comments > 1000 ? `${(video.comments / 1000).toFixed(1)}K` : video.comments}
                    </span>
                  </div>

                  {/* Share */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleShare(video.id)}
                      className="w-12 h-12 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 flex items-center justify-center transition-all transform hover:scale-110"
                    >
                      <Share className="w-6 h-6" />
                    </button>
                    <span className="text-white text-xs mt-1 font-medium">
                      {video.shares > 1000 ? `${(video.shares / 1000).toFixed(1)}K` : video.shares}
                    </span>
                  </div>

                  {/* Bookmark */}
                  <button
                    onClick={() => handleBookmark(video.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                      bookmarkedVideos.has(video.id)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                    }`}
                  >
                    <Bookmark className={`w-6 h-6 ${bookmarkedVideos.has(video.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Video Info - Below Video */}
              <div className="mt-4">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={(e) => handleUserClick(video.username, e)}
                    className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex-1">
                    <button
                      onClick={(e) => handleUserClick(video.username, e)}
                      className="text-left hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <h3 className="text-primary font-semibold">{video.displayName}</h3>
                      <p className="text-secondary text-sm">{video.username}</p>
                    </button>
                  </div>
                  <button
                    onClick={() => handleFollow(video.username)}
                    className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-colors"
                  >
                    Follow
                  </button>
                </div>

                {/* Description */}
                <p className="text-primary text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="px-4 mt-8">
          <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-primary rounded-lg transition-colors">
            Load More Videos
          </button>
        </div>
      </div>

      {/* Camera Recording Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Camera View */}
          <div className="relative w-full h-full flex items-center justify-center">
            {recordedVideo ? (
              /* Playback recorded video */
              <video
                src={recordedVideo}
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
              />
            ) : (
              /* Live camera feed */
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            )}

            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={closeCameraModal}
                className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {!recordedVideo && (
                <>
                  <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-mono">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <button
                    onClick={toggleCamera}
                    className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
              {recordedVideo ? (
                /* Post-recording controls */
                <div className="flex items-center gap-4">
                  <button
                    onClick={retryRecording}
                    className="w-16 h-16 rounded-full bg-gray-600 bg-opacity-80 flex items-center justify-center text-white"
                  >
                    <RotateCcw className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => {
                      alert('🎬 Video recorded successfully! Upload feature coming soon with database integration.');
                      closeCameraModal();
                    }}
                    className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white"
                  >
                    <CheckCircle className="w-8 h-8" />
                  </button>
                </div>
              ) : (
                /* Recording controls */
                <div className="flex items-center gap-8">
                  <button
                    onClick={handleUploadVideo}
                    className="w-12 h-12 rounded-full bg-gray-600 bg-opacity-80 flex items-center justify-center text-white"
                  >
                    <Upload className="w-6 h-6" />
                  </button>

                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-red-600 scale-110'
                        : 'bg-white border-4 border-gray-300'
                    }`}
                  >
                    {isRecording ? (
                      <StopCircle className="w-10 h-10 text-white" />
                    ) : (
                      <div className="w-16 h-16 bg-red-600 rounded-full"></div>
                    )}
                  </button>

                  <div className="w-12 h-12 rounded-full bg-gray-600 bg-opacity-80 flex items-center justify-center">
                    <VideoIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-red-600 bg-opacity-20 rounded-full p-8 animate-pulse">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-75" onClick={handleCloseUpload} />
          
          {/* Modal */}
          <div className="relative card max-w-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">Upload Video</h2>
              <button
                onClick={handleCloseUpload}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-secondary text-sm mb-2">Select Video</label>
              {!uploadFile ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">Click to upload video</p>
                    <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-primary font-medium">{uploadFile.name}</div>
                      <div className="text-secondary text-sm">
                        {(uploadFile.size / (1024 * 1024)).toFixed(1)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadFile(null)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-secondary text-sm mb-2">Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Enter video title..."
                className="input"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-secondary text-sm mb-2">Description</label>
              <textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Describe your video..."
                className="input resize-none h-20"
                maxLength={500}
              />
            </div>

            {/* Upload Button */}
            <div className="space-y-3">
              <button
                onClick={handleUploadSubmit}
                className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-3"
                disabled={!uploadFile || !uploadTitle.trim() || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Video
                  </>
                )}
              </button>
              
              <button
                onClick={handleCloseUpload}
                className="btn-secondary w-full py-3"
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-purple-600 bg-opacity-10 rounded-lg">
              <p className="text-purple-400 text-xs text-center">
                📹 Upload functionality ready! Database integration coming soon
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};