import React from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Gift, Bookmark, Smile, Link, Copy, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Post as MockPost } from '../../data/mockData';

// Unified post interface that works with both mock and database posts
interface UnifiedPost {
  id: string;
  user_id?: string;
  userId?: string;
  username: string;
  content: string;
  created_at?: string;
  timestamp?: string;
  likes: number;
  replies: number;
  shares: number;
  gifts?: number;
  avatar_url?: string | null;
}

interface PostCardProps {
  post: UnifiedPost;
  onLike?: (postId: string) => void;
  onReply?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onGift?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onReply, onShare, onGift, onBookmark }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleAvatarClick = () => {
    console.log('PostCard handleAvatarClick called with:', post.username);
    const cleanUsername = post.username.replace('@', '');
    console.log('Navigating to:', `/user/${cleanUsername}`);
    
    // Navigate from home page, so this becomes the original profile
    navigate(`/user/${cleanUsername}`, { 
      state: { originalProfile: cleanUsername } 
    });
  };

  const handleGift = () => {
    onGift?.(post.id);
  };

  const handleBookmark = () => {
    onBookmark?.(post.id);
  };

  const handlePostReactions = () => {
    setShowMenu(false);
    alert('Post reactions feature coming soon! 😍');
  };

  const handleCopyLink = () => {
    const postUrl = `https://wegram.com/post/${post.id}`;
    navigator.clipboard?.writeText(postUrl);
    setShowMenu(false);
    alert('Post link copied to clipboard! 🔗');
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText(post.content);
    setShowMenu(false);
    alert('Post text copied to clipboard! 📋');
  };

  const handleReportPost = () => {
    setShowMenu(false);
    alert('Post reported. Thank you for keeping WEGRAM safe! 🛡️');
  };

  return (
    <div className="card mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('PostCard Avatar button clicked!');
              handleAvatarClick();
            }} 
            className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
          >
            <span className="text-white text-sm font-semibold">
              {post.username.charAt(1).toUpperCase()}
            </span>
          </button>
          <div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('PostCard Username button clicked!');
                handleAvatarClick();
              }} 
              className="text-primary font-medium hover:text-purple-400 hover:underline transition-all duration-200 cursor-pointer px-1 py-0.5 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              {post.username}
            </button>
            <div className="text-secondary text-sm">
              {post.timestamp || (post.created_at ? new Date(post.created_at).toLocaleDateString() : '')}
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1 rounded transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              
              {/* Menu */}
              <div className={`absolute right-0 top-8 z-20 rounded-lg shadow-lg py-2 min-w-48 ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-300'
              }`}>
                <button
                  onClick={handlePostReactions}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors text-primary ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Smile className="w-4 h-4 text-yellow-400" />
                  <span>Post reactions</span>
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors text-primary ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Link className="w-4 h-4 text-blue-400" />
                  <span>Copy link</span>
                </button>
                
                <button
                  onClick={handleCopyText}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors text-primary ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Copy className="w-4 h-4 text-green-400" />
                  <span>Copy text</span>
                </button>
                
                <div className={`border-t my-1 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}></div>
                
                <button
                  onClick={handleReportPost}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors text-red-400 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  <span>Report post</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-primary mb-4 leading-relaxed">{post.content}</p>

      <div className="flex items-center justify-between text-secondary">
        <button
          onClick={() => onLike?.(post.id)}
          className="flex items-center gap-2 hover:text-red-400 transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm">{post.likes}</span>
        </button>
        <button
          onClick={() => onReply?.(post.id)}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{post.replies}</span>
        </button>
        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center gap-2 hover:text-green-400 transition-colors"
        >
          <Share className="w-4 h-4" />
          <span className="text-sm">{post.shares}</span>
        </button>
        <button
          onClick={handleGift}
          className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
        >
          <Gift className="w-4 h-4" />
          <span className="text-sm">{post.gifts || 0}</span>
        </button>
        <button
          onClick={handleBookmark}
          className="flex items-center gap-2 hover:text-purple-400 transition-colors"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};