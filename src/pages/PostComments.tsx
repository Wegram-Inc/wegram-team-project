import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, User, Heart, MoreHorizontal, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNeonAuth } from '../hooks/useNeonAuth';
import { CommentComposer } from '../components/Comments/CommentComposer';
import { VerificationBadge } from '../components/VerificationBadge';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  verified?: boolean;
}

interface PostData {
  id: string;
  content: string;
  username: string;
  avatar_url?: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  verified?: boolean;
}

export const PostComments: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { profile } = useNeonAuth();

  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommentComposer, setShowCommentComposer] = useState(false);
  const [isLikingPost, setIsLikingPost] = useState(false);
  const [likingComments, setLikingComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const fetchPostAndComments = async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch post data
      const postResponse = await fetch(`/api/posts?id=${postId}`);
      const postData = await postResponse.json();

      if (postData.success) {
        setPost(postData.post);
      } else {
        setError('Post not found');
        return;
      }

      // Fetch comments
      const commentsResponse = await fetch(`/api/comments?postId=${postId}`);
      const commentsData = await commentsResponse.json();

      if (commentsData.success) {
        setComments(commentsData.comments || []);
      }
    } catch (err) {
      console.error('Error fetching post and comments:', err);
      setError('Failed to load post and comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    // Refresh comments and update post comment count
    fetchPostAndComments();
  };

  const handleLikePost = async () => {
    if (!profile?.id || !post || isLikingPost) return;

    setIsLikingPost(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post.id,
          action: 'like',
          user_id: profile.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        // The API should return the updated post with correct like count
        if (result.post) {
          setPost(prev => prev ? { ...prev, likes_count: result.post.likes_count } : null);
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLikingPost(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!profile?.id || likingComments.has(commentId)) return;

    setLikingComments(prev => new Set([...prev, commentId]));
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          action: 'like',
          user_id: profile.id
        })
      });

      if (response.ok) {
        // Update local comment state
        setComments(prev => prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes_count: comment.likes_count + 1 }
            : comment
        ));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setLikingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleUserClick = (username: string) => {
    const cleanUsername = username.replace('@', '');
    navigate(`/user/${cleanUsername}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="text-center py-12">
          <h3 className="text-primary font-semibold mb-2">Error</h3>
          <p className="text-secondary text-sm">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 btn-primary px-6 py-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-16 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sticky top-16 bg-opacity-95 backdrop-blur-sm py-3 -mx-4 px-4" style={{ backgroundColor: 'var(--bg)' }}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-primary">Comments</h1>
          <p className="text-secondary text-sm">{comments.length} comments</p>
        </div>
      </div>

      {/* Original Post */}
      <div className="card mb-6">
        <div className="flex items-start gap-3 mb-3">
          <button
            onClick={() => handleUserClick(post.username)}
            className="w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-transform"
          >
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-bg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </button>
          <div className="flex-1">
            <button
              onClick={() => handleUserClick(post.username)}
              className="text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-primary font-semibold">{post.username}</h3>
                {post.verified && (
                  <VerificationBadge
                    type={['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(post.username) ? 'platinum' : 'gold'}
                    size="md"
                  />
                )}
              </div>
              <p className="text-secondary text-sm">{formatTimestamp(post.created_at)}</p>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-primary leading-relaxed">{post.content}</p>
          {post.image_url && (
            <div className="mt-3">
              <img
                src={post.image_url}
                alt="Post image"
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-6">
            <button
              onClick={handleLikePost}
              disabled={isLikingPost || !profile}
              className="flex items-center gap-2 text-secondary hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes_count}</span>
            </button>
            <div className="flex items-center gap-2 text-secondary">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments_count}</span>
            </div>
          </div>
          <button
            onClick={() => setShowCommentComposer(true)}
            className="btn-primary px-4 py-2 text-sm"
          >
            Add Comment
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="card">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleUserClick(comment.username)}
                  className="w-8 h-8 rounded-full overflow-hidden hover:scale-105 transition-transform flex-shrink-0"
                >
                  {comment.avatar_url ? (
                    <img
                      src={comment.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full gradient-bg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUserClick(comment.username)}
                        className="text-primary font-medium text-sm hover:opacity-80 transition-opacity"
                      >
                        {comment.username}
                      </button>
                      {comment.verified && (
                        <VerificationBadge
                          type={['puff012', '@puff012', '@TheWegramApp', '@_fudder'].includes(comment.username) ? 'platinum' : 'gold'}
                          size="sm"
                        />
                      )}
                    </div>
                    <span className="text-secondary text-xs">{formatTimestamp(comment.created_at)}</span>
                  </div>
                  <p className="text-primary text-sm leading-relaxed">{comment.content}</p>
                  {comment.image_url && (
                    <div className="mt-2">
                      <img
                        src={comment.image_url}
                        alt="Comment image"
                        className="w-full rounded-lg object-cover max-h-48"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={likingComments.has(comment.id) || !profile}
                      className="flex items-center gap-1 text-secondary hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Heart className="w-3 h-3" />
                      <span className="text-xs">{comment.likes_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-primary font-medium mb-2">No comments yet</h3>
            <p className="text-secondary text-sm mb-6">Be the first to comment on this post!</p>
            <button
              onClick={() => setShowCommentComposer(true)}
              className="btn-primary px-6 py-2"
            >
              Add Comment
            </button>
          </div>
        )}
      </div>

      {/* Comment Composer Modal */}
      <CommentComposer
        isOpen={showCommentComposer}
        onClose={() => setShowCommentComposer(false)}
        postId={postId!}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
};