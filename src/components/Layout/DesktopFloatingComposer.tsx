import React, { useState } from 'react';
import { Plus, Type, Image, Video, X, User, Loader2 } from 'lucide-react';
import { useNeonAuth } from '../../hooks/useNeonAuth';
import { useNavigate } from 'react-router-dom';
import { uploadImage, type ImageKitUploadResponse } from '../../lib/imagekitService';

export const DesktopFloatingComposer: React.FC = () => {
  const { profile } = useNeonAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<ImageKitUploadResponse | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Desktop Only Floating Action Button */}
      <button
        onClick={() => navigate('/compose1a')}
        className="hidden lg:flex fixed bottom-8 w-14 h-14 rounded-full items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
        style={{
          right: 'calc(320px + 2rem)',
          background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)'
        }}
        aria-label="Create new post"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Create Modal (identical to BottomNav modal) */}
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
                    const username = profile?.username?.replace('@', '') || 'demo_user';
                    navigate(`/user/${username}`);
                  }, 100);
                }}
                className="w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                aria-label="Open profile"
              >
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
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="What's happening?"
                className="flex-1 h-28 bg-transparent text-primary outline-none resize-none"
                style={{ color: 'var(--text)', fontSize: '16px' }}
              />
            </div>

            {/* Media Upload Section */}
            {(selectedFiles.length > 0 || uploadedImageUrl || isUploading) && (
              <div className="mb-3">
                {isUploading ? (
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-primary text-sm">Uploading image...</span>
                    </div>
                  </div>
                ) : uploadedImageUrl ? (
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="flex items-start gap-3">
                      <img
                        src={uploadedImageUrl}
                        alt="Uploaded preview"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Image className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 text-xs font-medium">Image uploaded</span>
                          <button
                            onClick={() => {
                              setUploadedImageUrl('');
                              setUploadedImage(null);
                              setSelectedFiles([]);
                            }}
                            className="p-0.5 rounded transition-colors hover:opacity-70"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                        {uploadedImage && (
                          <div className="text-xs text-secondary mt-1">
                            {uploadedImage.width} × {uploadedImage.height}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-secondary">{selectedFiles.length} file(s) selected</div>
                )}
              </div>
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
                const content = textContent.trim() || (uploadedImageUrl ? 'Shared media' : '');
                if (!content && !uploadedImageUrl) return;
                window.dispatchEvent(new CustomEvent('wegram:new-post', {
                  detail: {
                    content,
                    imageUrl: uploadedImageUrl || undefined
                  }
                }));
                setShowCreateModal(false);
                setTextContent('');
                setSelectedFiles([]);
                setUploadedImageUrl('');
                setUploadedImage(null);
                setIsUploading(false);
              }}
              className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--gradA) 0%, var(--gradB) 100%)' }}
              disabled={(!textContent.trim() && !uploadedImageUrl) || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Post Now'}
            </button>

            {/* Hidden inputs for media selection */}
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // Check file type and size
              if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed');
                return;
              }

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
                alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setSelectedFiles([]);
              } finally {
                setIsUploading(false);
              }
            }} />
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // For now, treat videos as images (ImageKit supports videos)
              if (!file.type.startsWith('video/')) {
                alert('Only video files are allowed');
                return;
              }

              if (file.size > 50 * 1024 * 1024) {
                alert('File size must be less than 50MB');
                return;
              }

              setSelectedFiles([file]);
              setIsUploading(true);

              try {
                // Upload to ImageKit (supports videos too)
                const uploadResult = await uploadImage(file, undefined, '/wegram-videos');
                setUploadedImage(uploadResult);
                setUploadedImageUrl(uploadResult.url);
                console.log('Video uploaded successfully:', uploadResult);
              } catch (error) {
                console.error('Upload failed:', error);
                alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setSelectedFiles([]);
              } finally {
                setIsUploading(false);
              }
            }} />
          </div>
        </div>
      )}
    </>
  );
};