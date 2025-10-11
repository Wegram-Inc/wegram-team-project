import React from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Gift, Bookmark, Smile, Link, Copy, Flag, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useNeonAuth } from '../../hooks/useNeonAuth';
import { Post as MockPost } from '../../data/mockData';
import { CommentComposer } from '../Comments/CommentComposer';

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
  image_url?: string | null;
  verified?: boolean;
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
  const { profile } = useNeonAuth();
  const [showMenu, setShowMenu] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [isGifted, setIsGifted] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(post.likes);
  const [sharesCount, setSharesCount] = React.useState(post.shares);
  const [giftsCount, setGiftsCount] = React.useState(post.gifts || 0);
  const [commentsCount, setCommentsCount] = React.useState(post.replies);
  const [showCommentComposer, setShowCommentComposer] = React.useState(false);

  const handleAvatarClick = () => {
    console.log('PostCard handleAvatarClick called with:', post.username);
    const cleanUsername = post.username.replace('@', '');
    
    // Check if this is the current user's own post
    const isOwnPost = profile && (
      post.user_id === profile.id || 
      cleanUsername === profile.username.replace('@', '')
    );
    
    if (isOwnPost) {
      // Navigate to own profile page
      navigate('/profile');
    } else {
      // Navigate to other user's profile page
      navigate(`/user/${cleanUsername}`, { 
        state: { originalProfile: cleanUsername } 
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleShare = () => {
    setIsShared(true);
    setSharesCount(prev => prev + 1);
    onShare?.(post.id);

    // Reset share state after animation
    setTimeout(() => setIsShared(false), 1000);
  };

  const handleGift = () => {
    setIsGifted(true);
    setGiftsCount(prev => prev + 1);
    onGift?.(post.id);
    
    // Reset gift state after animation
    setTimeout(() => setIsGifted(false), 1000);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
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

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCommentComposer(true);
  };

  const handlePostContentClick = () => {
    // Only navigate to comments if there are comments to see
    if (commentsCount > 0) {
      navigate(`/post/${post.id}/comments`);
    }
  };

  const handleCommentAdded = () => {
    setCommentsCount(prev => prev + 1);
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
            className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
          >
            {post.avatar_url ? (
              <img 
                src={post.avatar_url} 
                alt={post.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-bg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {post.username.charAt(1).toUpperCase()}
                </span>
              </div>
            )}
          </button>
          <div>
            <div className="flex items-center gap-1">
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
              {post.verified && (
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
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

      <div
        onClick={handlePostContentClick}
        className="cursor-pointer"
      >
        <p className="text-primary mb-4 leading-relaxed">{post.content}</p>
      </div>

      {/* Image Display */}
      {post.image_url && (
        <div
          onClick={handlePostContentClick}
          className="mb-4 cursor-pointer"
        >
          <img
            src={post.image_url}
            alt="Post image"
            className="w-full rounded-lg object-cover max-h-96 border border-gray-200 dark:border-gray-700"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-secondary">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-all duration-200 ${
            isLiked 
              ? 'text-red-500 scale-110' 
              : 'hover:text-red-400 hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${
            isLiked ? 'fill-current' : ''
          }`} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>
        
        <button
          onClick={handleCommentClick}
          className="flex items-center gap-2 hover:text-blue-400 hover:scale-105 transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{commentsCount}</span>
        </button>
        
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 transition-all duration-200 ${
            isShared 
              ? 'text-green-500 scale-110' 
              : 'hover:text-green-400 hover:scale-105'
          }`}
        >
          <Share className={`w-4 h-4 transition-all duration-200 ${
            isShared ? 'rotate-12' : ''
          }`} />
          <span className="text-sm font-medium">{sharesCount}</span>
        </button>
        
        <button
          onClick={handleGift}
          className={`flex items-center gap-2 transition-all duration-200 ${
            isGifted 
              ? 'text-yellow-500 scale-110' 
              : 'hover:text-yellow-400 hover:scale-105'
          }`}
        >
          <Gift className={`w-4 h-4 transition-all duration-200 ${
            isGifted ? 'animate-bounce' : ''
          }`} />
          <span className="text-sm font-medium">{giftsCount}</span>
        </button>
        
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-2 transition-all duration-200 ${
            isBookmarked 
              ? 'text-purple-500 scale-110' 
              : 'hover:text-purple-400 hover:scale-105'
          }`}
        >
          <Bookmark className={`w-4 h-4 transition-all duration-200 ${
            isBookmarked ? 'fill-current' : ''
          }`} />
        </button>
      </div>

      {/* Comment Composer Modal */}
      <CommentComposer
        isOpen={showCommentComposer}
        onClose={() => setShowCommentComposer(false)}
        postId={post.id}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
};