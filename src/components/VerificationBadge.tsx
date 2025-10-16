import React from 'react';

interface VerificationBadgeProps {
  type: 'gold' | 'platinum';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const goldGradient = "url(#goldGradient)";
  const platinumGradient = "url(#platinumGradient)";

  return (
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Gold gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
          </linearGradient>

          {/* Platinum gradient */}
          <linearGradient id="platinumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#E5E7EB', stopOpacity: 1 }} />
            <stop offset="30%" style={{ stopColor: '#D1D5DB', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#9CA3AF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6B7280', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Circle background */}
        <circle
          cx="12"
          cy="12"
          r="11"
          fill={type === 'platinum' ? platinumGradient : goldGradient}
          stroke="white"
          strokeWidth="1"
        />

        {/* Checkmark */}
        <path
          d="M9 12l2 2 4-4"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};