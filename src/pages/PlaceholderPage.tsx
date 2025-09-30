import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BuyWegram } from './BuyWegram';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description, 
  icon: Icon 
}) => {
  const navigate = useNavigate();

  // If this is the Buy WEGRAM page, render the actual component
  if (title === 'Buy WEGRAM') {
    return <BuyWegram />;
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      <div className="card text-center">
        <button 
          onClick={() => navigate('/home')}
          className="mb-6 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <Icon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
        <p className="text-secondary mb-6">{description}</p>
        
        <div className="text-sm text-secondary bg-black bg-opacity-30 rounded-lg p-4">
          This feature needs to be built! The page structure is ready, but we need to create 
          the actual {title.toLowerCase()} functionality and user interface.
        </div>
      </div>
    </div>
  );
};