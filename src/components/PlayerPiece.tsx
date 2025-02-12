import React from 'react';
import { User } from 'lucide-react';

interface PlayerPieceProps {
  color: string;
  isActive: boolean;
}

export const PlayerPiece: React.FC<PlayerPieceProps> = ({ color, isActive }) => {
  return (
    <div className={`
      absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      ${isActive ? 'scale-110 drop-shadow-lg' : ''}
      transition-all duration-300
    `}>
      <User 
        size={24}
        className={`${color} animate-bounce`}
        style={{ animationDuration: '2s' }}
      />
    </div>
  );
};