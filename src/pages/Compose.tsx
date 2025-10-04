import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostComposer } from '../components/Post/PostComposer';
import { useNeonAuth } from '../hooks/useNeonAuth';

export const Compose: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useNeonAuth();

  const handlePost = async (content: string, files?: File[]) => {
    if (!profile?.id) {
      alert('Please sign in to post');
      return;
    }

    try {
      // Create FormData to handle both text and files
      const formData = new FormData();
      formData.append('content', content);
      formData.append('user_id', profile.id);
      formData.append('username', profile.username);

      // Add files if they exist
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
        formData.append('file_count', files.length.toString());
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData // Don't set Content-Type, let browser set it for FormData
      });

      const data = await response.json();

      if (data.success) {
        console.log('Post created:', data);
        navigate('/home');
      } else {
        console.error('Post creation failed:', data.error);
        alert('Failed to create post: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      <PostComposer 
        onPost={handlePost}
        onCancel={handleCancel}
      />
    </div>
  );
};