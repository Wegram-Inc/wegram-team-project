import React, { useEffect } from 'react';

export const WegramMiner: React.FC = () => {
  useEffect(() => {
    // Redirect to the static game page in public folder
    window.location.href = '/games/wegram-miner/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-primary text-lg">Loading Wegram Miner...</p>
      </div>
    </div>
  );
};
