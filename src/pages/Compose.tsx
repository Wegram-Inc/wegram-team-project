import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostComposer } from '../components/Post/PostComposer';

export const Compose: React.FC = () => {
  const navigate = useNavigate();

  const handlePost = (content: string) => {
    // Database integration coming soon
    console.log('New post:', content);
    navigate('/home');
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