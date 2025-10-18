import React from 'react';
import { Play, Gamepad2, ArrowRight } from 'lucide-react';

export const Games: React.FC = () => {
  const handlePlayWeRunner = () => {
    window.open('https://centricj20.github.io/We-Runner/', '_blank', 'noopener,noreferrer');
  };

  const handlePlayWegramMiner = () => {
    window.open('/games/wegram-miner/index.html', '_blank', 'noopener,noreferrer');
  };


  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gamepad2 className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-primary">Gaming</h1>
        </div>
        <p className="text-secondary text-sm">Play amazing games on Wegram</p>
      </div>

      {/* Featured Game - WeRunner */}
      <div className="relative mb-8">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          {/* Background Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #6366F1 100%)'
            }}
          />

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse delay-500" />
          </div>

          {/* Content */}
          <div className="relative p-8 text-white text-center">
            {/* Game Icon */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl mb-6 mx-auto shadow-lg">
              🏃‍♂️
            </div>

            {/* Game Title */}
            <h2 className="text-4xl font-bold mb-4 tracking-tight">WeRunner</h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
              Epic anime-style battle runner with stunning visuals
            </p>

            {/* Play Button */}
            <button
              onClick={handlePlayWeRunner}
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group mx-auto"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Play WeRunner
            </button>
          </div>
        </div>
      </div>

      {/* Featured Game - Wegram Miner */}
      <div className="relative mb-8">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          {/* Background Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 50%, #FB923C 100%)'
            }}
          />

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse delay-500" />
          </div>

          {/* Content */}
          <div className="relative p-8 text-white text-center">
            {/* Game Icon */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl mb-6 mx-auto shadow-lg">
              ⛏️
            </div>

            {/* Game Title */}
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Wegram Miner</h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
              Mine, collect, and build your crypto empire
            </p>

            {/* Play Button */}
            <button
              onClick={handlePlayWegramMiner}
              className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group mx-auto"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Play Wegram Miner
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="card p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Gamepad2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-primary font-bold text-xl mb-3">More Games Coming Soon</h3>
        <p className="text-secondary text-base mb-6 leading-relaxed">
          We're building an amazing collection of games. Stay tuned for more epic adventures!
        </p>
        <div className="flex items-center justify-center gap-2 text-purple-400 text-base font-medium">
          <span>Stay tuned</span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};