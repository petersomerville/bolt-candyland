import React from 'react';
import { Square } from './Square';
import { PlayerPiece } from './PlayerPiece';
import { GameSpace, Player } from '../types';

interface BoardProps {
  spaces: GameSpace[];
  players: Player[];
  currentPlayer: number;
}

export const Board: React.FC<BoardProps> = ({ spaces, players, currentPlayer }) => {
  // Create a winding path layout
  const rows = 6; // Number of rows in the path
  const spacesPerRow = 8; // Spaces in each row
  
  const getPositionStyle = (index: number) => {
    const row = Math.floor(index / spacesPerRow);
    const col = index % spacesPerRow;
    
    // Alternate direction for each row to create winding effect
    const adjustedCol = row % 2 === 0 ? col : (spacesPerRow - 1 - col);
    
    // Calculate position percentages
    const left = `${(adjustedCol / (spacesPerRow - 1)) * 90}%`;
    const top = `${(row / (rows - 1)) * 95}%`;
    
    return { left, top };
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-xl p-4">
      {/* Path connector lines */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      >
        {spaces.map((_, index) => {
          if (index === spaces.length - 1) return null;
          
          const currentPos = getPositionStyle(index);
          const nextPos = getPositionStyle(index + 1);
          
          const x1 = parseFloat(currentPos.left) / 100 * 100;
          const y1 = parseFloat(currentPos.top) / 100 * 100;
          const x2 = parseFloat(nextPos.left) / 100 * 100;
          const y2 = parseFloat(nextPos.top) / 100 * 100;
          
          return (
            <line
              key={`path-${index}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#e9d5ff"
              strokeWidth="8"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      
      {/* Game spaces */}
      {spaces.map((space, index) => {
        const position = getPositionStyle(index);
        const isLastSpace = index === spaces.length - 1;
        
        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: position.left,
              top: position.top,
              width: '10%',
              zIndex: 1
            }}
          >
            <div className="relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-purple-600">
                {index + 1}
              </div>
              <Square 
                color={space.color} 
                special={space.special}
                isFinish={isLastSpace}
              >
                {players.map((player, playerIndex) => 
                  player.position === index && (
                    <PlayerPiece 
                      key={playerIndex}
                      color={player.color}
                      isActive={currentPlayer === playerIndex}
                    />
                  )
                )}
              </Square>
            </div>
          </div>
        );
      })}
      
      {/* Start and Finish labels */}
      <div className="absolute -left-4 bottom-0 text-lg font-bold text-purple-600">Start</div>
      <div className="absolute -right-4 top-0 text-lg font-bold text-purple-600">Castle</div>
    </div>
  );
};