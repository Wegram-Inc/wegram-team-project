import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostComposer } from '../components/Post/PostComposer';
import { useNeonAuth } from '../hooks/useNeonAuth';

export const Compose: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useNeonAuth();

  const handlePost = async (content: string, imageUrl?: string) => {
    if (!profile?.id) {
      alert('Please sign in to post');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          user_id: profile.id,
          username: profile.username,
          image_url: imageUrl
        })
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