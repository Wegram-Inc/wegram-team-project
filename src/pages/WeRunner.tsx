import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WeRunner: React.FC = () => {
  const navigate = useNavigate();

  // Prevent browser gestures that interfere with Unity WebGL
  useEffect(() => {
    const preventGestures = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventGestureStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("touchstart", preventGestures, { passive: false });
    document.addEventListener("gesturestart", preventGestureStart);

    return () => {
      document.removeEventListener("touchstart", preventGestures);
      document.removeEventListener("gesturestart", preventGestureStart);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            WeRunner
          </h1>
        </div>
      </div>

      {/* Unity WebGL Game */}
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-2xl font-bold text-purple-400 mb-4">WeRunner</h2>
          <p className="text-gray-400 mb-6">
            Epic anime-style battle runner with stunning visuals
          </p>
          <button
            onClick={() => window.open('https://centricj20.github.io/We-Runner/', '_blank')}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-lg transition-colors shadow-lg"
          >
            🚀 Play WeRunner
          </button>
        </div>
      </div>
    </div>
  );
};
