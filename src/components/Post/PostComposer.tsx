import React, { useState } from 'react';
import { Image, Video, X, Upload, Loader } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { uploadImage } from '../../lib/imagekitService';

interface PostComposerProps {
  onPost: (content: string, imageUrl?: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onPost,
  onCancel,
  placeholder = "What's happening? (text only)"
}) => {
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handlePost = () => {
    if ((content.trim() || uploadedImageUrl) && !isUploading) {
      onPost(content, uploadedImageUrl || undefined);
      setContent('');
      setSelectedFiles([]);
      setUploadedImageUrl('');
      setUploadError('');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setUploadError('Only image and video files are allowed');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setUploadError('File size must be less than 50MB');
        return;
      }

      setSelectedFiles([file]);
      setUploadError('');
      setIsUploading(true);

      try {
        const response = await uploadImage(file);
        setUploadedImageUrl(response.url);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError('Failed to upload file. Please try again.');
        setSelectedFiles([]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrl('');
    setUploadError('');
  };

  const handleReset = () => {
    setContent('');
    setSelectedFiles([]);
    setUploadedImageUrl('');
    setUploadError('');
  };
  return (
    <div className="card mb-6">
      <h3 className="text-primary font-semibold mb-4">Create Post</h3>
      
      {/* Post Type Options */}
      <div className="flex gap-2 mb-4">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <span className="text-2xl">📝</span>
          <span className="text-primary text-sm font-medium">Text</span>
        </div>
        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isDark 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}>
          <span className="text-2xl">📷</span>
          <span className="text-primary text-sm font-medium">Photo</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isDark 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}>
          <span className="text-2xl">🎥</span>
          <span className="text-primary text-sm font-medium">Video</span>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className={`w-full h-24 bg-transparent text-primary resize-none outline-none mb-4 ${
          isDark ? 'placeholder-gray-400' : 'placeholder-gray-500'
        }`}
        style={{ fontFamily: 'var(--font-base)' }}
      />
      
      {/* Upload Error Message */}
      {uploadError && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm">{uploadError}</p>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-blue-400 text-sm">Uploading image...</span>
          </div>
        </div>
      )}

      {/* Media Upload Section */}
      {selectedFiles.length > 0 && !isUploading && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className={`relative rounded-lg p-3 ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  {file.type.startsWith('image/') ? (
                    <Image className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Video className="w-4 h-4 text-purple-400" />
                  )}
                  <span className="text-primary text-sm truncate flex-1">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className={`p-1 rounded transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                    }`}
                  >
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                </div>
                <div className="text-xs text-secondary mt-1">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                  {uploadedImageUrl && (
                    <span className="ml-2 text-green-400">✓ Uploaded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {uploadedImageUrl && !isUploading && (
        <div className="mb-4">
          <div className={`relative rounded-lg overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <img
              src={uploadedImageUrl}
              alt="Upload preview"
              className="w-full max-h-96 object-cover"
            />
            <button
              onClick={() => {
                setUploadedImageUrl('');
                setSelectedFiles([]);
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}


      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePost}
          className="btn-primary flex-1"
          disabled={(!content.trim() && !uploadedImageUrl) || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Post'}
        </button>
        <button
          onClick={() => {
            handleReset();
            onCancel();
          }}
          className="btn-secondary px-6"
          disabled={isUploading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};