import React, { useState } from 'react';
import { Image, Video, X, Upload, Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { uploadImage, type ImageKitUploadResponse } from '../../lib/imagekitService';

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
  const [uploadedImage, setUploadedImage] = useState<ImageKitUploadResponse | null>(null);

  const handlePost = () => {
    if (content.trim() || uploadedImageUrl) {
      onPost(content, uploadedImageUrl || undefined);
      setContent('');
      setSelectedFiles([]);
      setUploadedImageUrl('');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Only image and video files are allowed');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFiles([file]);
    setIsUploading(true);

    try {
      // Upload to ImageKit
      const uploadResult = await uploadImage(file, undefined, '/wegram-posts');

      setUploadedImage(uploadResult);
      setUploadedImageUrl(uploadResult.url);

      console.log('Image uploaded successfully:', uploadResult);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setSelectedFiles([]);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrl('');
    setUploadedImage(null);
  };

  const handleReset = () => {
    setContent('');
    setSelectedFiles([]);
    setUploadedImageUrl('');
    setUploadedImage(null);
    setIsUploading(false);
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
      
      {/* Media Upload Section */}
      {(selectedFiles.length > 0 || uploadedImageUrl) && (
        <div className="mb-4">
          {isUploading ? (
            <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-primary">Uploading image...</span>
              </div>
            </div>
          ) : uploadedImageUrl ? (
            <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div className="flex items-start gap-3">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Image uploaded successfully</span>
                    <button
                      onClick={() => removeFile(0)}
                      className={`p-1 rounded transition-colors ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                      }`}
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                  {uploadedImage && (
                    <div className="text-xs text-secondary mt-1">
                      {uploadedImage.width} × {uploadedImage.height} • {(uploadedImage.size / (1024 * 1024)).toFixed(1)} MB
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            selectedFiles.map((file, index) => (
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
                </div>
              </div>
            ))
          )}
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
        >
          Cancel
        </button>
      </div>
    </div>
  );
};