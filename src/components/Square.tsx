import React from 'react';
import { Sparkles, Skull, Castle } from 'lucide-react';

interface SquareProps {
  color: string;
  special?: 'shortcut' | 'trap';
  isFinish?: boolean;
  children?: React.ReactNode;
}

export const Square: React.FC<SquareProps> = ({ color, special, isFinish, children }) => {
  return (
    <div 
      className={`
        relative w-full pt-[100%] rounded-full 
        ${isFinish ? 'bg-gradient-to-br from-purple-300 to-pink-300' : color}
        transform hover:scale-105 transition-transform duration-200
        shadow-md
      `}
    >
      {special && !isFinish && (
        <div className="absolute inset-0 flex items-center justify-center">
          {special === 'shortcut' ? (
            <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
          ) : (
            <Skull className="w-4 h-4 text-red-200 animate-pulse" />
          )}
        </div>
      )}
      {isFinish && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Castle className="w-6 h-6 text-purple-700 animate-bounce" />
        </div>
      )}
      {children}
    </div>
  );
};