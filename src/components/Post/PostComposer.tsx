import React, { useState } from 'react';
import { Image, Video, X, Upload } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

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

  const handlePost = () => {
    if (content.trim() || uploadedImageUrl) {
      onPost(content, uploadedImageUrl || undefined);
      setContent('');
      setSelectedFiles([]);
      setUploadedImageUrl('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }

      // Convert to base64 exactly like profile images
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImageUrl(e.target.result as string);
          setSelectedFiles([file]); // Keep for display purposes
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrl(''); // Clear the uploaded image URL
  };

  const handleReset = () => {
    setContent('');
    setSelectedFiles([]);
    setUploadedImageUrl('');
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
      {selectedFiles.length > 0 && (
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePost}
          className="btn-primary flex-1"
          disabled={!content.trim() && !uploadedImageUrl}
        >
          Post
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