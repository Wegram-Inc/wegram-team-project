import React, { useState } from 'react';
import { X, Image, Video, Send, User, Loader2 } from 'lucide-react';
import { useNeonAuth } from '../../hooks/useNeonAuth';
import { uploadImage } from '../../lib/imagekitService';

interface CommentComposerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onCommentAdded: () => void;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({
  isOpen,
  onClose,
  postId,
  onCommentAdded
}) => {
  const { profile } = useNeonAuth();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Only image and video files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setIsUploading(true);

    try {
      // Upload to ImageKit
      const uploadResult = await uploadImage(file, undefined, '/wegram-comments');
      setUploadedImageUrl(uploadResult.url);
      console.log('Image uploaded successfully:', uploadResult);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setSelectedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !uploadedImageUrl) return;
    if (!profile?.id) {
      alert('Please sign in to comment');
      return;
    }

    if (isUploading) {
      alert('Please wait for image upload to complete');
      return;
    }

    setIsPosting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          post_id: postId,
          user_id: profile.id,
          username: profile.username,
          image_url: uploadedImageUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setContent('');
        setSelectedImage(null);
        setUploadedImageUrl(null);

        // Notify parent to update comment count
        onCommentAdded();

        // Close modal
        onClose();
      } else {
        alert('Failed to post comment: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setSelectedImage(null);
    setUploadedImageUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl p-5 shadow-xl" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Add Comment</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Composer */}
        <div className="flex items-start gap-3 mb-4">
          {/* Profile Avatar */}
          <button className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-bg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </button>

          {/* Text Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent text-primary outline-none resize-none h-20 placeholder-gray-500"
            style={{ color: 'var(--text)', fontSize: '16px' }}
            maxLength={280}
          />
        </div>

        {/* Image Upload/Preview */}
        {isUploading && (
          <div className="mb-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-primary">Uploading image...</span>
            </div>
          </div>
        )}

        {uploadedImageUrl && !isUploading && (
          <div className="mb-4 relative">
            <img
              src={uploadedImageUrl}
              alt="Upload preview"
              className="w-full max-h-40 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setUploadedImageUrl(null);
              }}
              className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        <div className="h-px mb-4" style={{ backgroundColor: 'var(--border)' }} />

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Image className="w-5 h-5 hover:opacity-80 transition-opacity" style={{ color: 'var(--gradA)' }} />
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Video className="w-5 h-5 hover:opacity-80 transition-opacity" style={{ color: 'var(--gradA)' }} />
            </label>
          </div>

          <div className="text-xs text-gray-500">
            {content.length}/280
          </div>
        </div>

        {/* Post Button */}
        <button
          onClick={handlePost}
          disabled={(!content.trim() && !uploadedImageUrl) || isPosting}
          className="w-full mt-4 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}
        >
          {isPosting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Posting...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Post Comment
            </div>
          )}
        </button>
      </div>
    </div>
  );
};