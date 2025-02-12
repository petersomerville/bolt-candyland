import React, { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { Car as Cards, RefreshCw } from 'lucide-react';
import type { GameSpace, Player } from './types';

const COLORS = [
  { name: 'Red', bg: 'bg-red-400', text: 'text-red-600' },
  { name: 'Yellow', bg: 'bg-yellow-400', text: 'text-yellow-600' },
  { name: 'Green', bg: 'bg-green-400', text: 'text-green-600' },
  { name: 'Blue', bg: 'bg-blue-400', text: 'text-blue-600' },
  { name: 'Purple', bg: 'bg-purple-400', text: 'text-purple-600' },
  { name: 'Orange', bg: 'bg-orange-400', text: 'text-orange-600' },
];

// Create board spaces with sequential colors
const BOARD_SPACES: GameSpace[] = Array(48).fill(null).map((_, i) => {
  // Use a repeating pattern of colors
  const colorIndex = i % COLORS.length;
  return {
    color: COLORS[colorIndex].bg,
    special: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'shortcut' : 'trap') : undefined,
  };
});

const PLAYER_COLORS = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600'];

function App() {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [currentCard, setCurrentCard] = useState<typeof COLORS[0] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const initializeGame = () => {
    const newPlayers = Array(playerCount).fill(null).map((_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      color: PLAYER_COLORS[i],
      position: 0,
    }));
    setPlayers(newPlayers);
    setCurrentPlayer(0);
    setCurrentCard(null);
    setDrawing(false);
    setShowConfetti(false);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted) return;
    initializeGame();
  }, [gameStarted, playerCount]);

  const handleDrawCard = () => {
    if (drawing) return;
    
    setDrawing(true);
    setCurrentCard(null);
    
    setTimeout(() => {
      const drawnColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      setCurrentCard(drawnColor);
      
      setPlayers(prev => {
        const newPlayers = [...prev];
        const player = newPlayers[currentPlayer];
        const currentPos = player.position;
        
        // Find the next space matching the drawn color
        let newPosition = currentPos;
        let foundNextColor = false;
        
        // Look for the next matching color space
        for (let i = currentPos + 1; i < BOARD_SPACES.length; i++) {
          if (BOARD_SPACES[i].color === drawnColor.bg) {
            newPosition = i;
            foundNextColor = true;
            break;
          }
        }
        
        // If no matching color is found ahead, player stays in place
        if (!foundNextColor) {
          newPosition = currentPos;
        }
        
        // Only apply special effects if the player actually moved
        if (newPosition !== currentPos) {
          // Handle special spaces
          const space = BOARD_SPACES[newPosition];
          if (space.special === 'shortcut') {
            // Find the next space of the same color after the shortcut
            for (let i = newPosition + 1; i < BOARD_SPACES.length; i++) {
              if (BOARD_SPACES[i].color === drawnColor.bg) {
                newPosition = i;
                break;
              }
            }
          } else if (space.special === 'trap') {
            // Move back to the previous space of the same color
            for (let i = newPosition - 1; i >= 0; i--) {
              if (BOARD_SPACES[i].color === drawnColor.bg) {
                newPosition = i;
                break;
              }
            }
          }
        }
        
        player.position = newPosition;

        // Check if player reached the castle
        if (newPosition === BOARD_SPACES.length - 1) {
          setShowConfetti(true);
        }

        return newPlayers;
      });

      setTimeout(() => {
        setCurrentPlayer((prev) => (prev + 1) % playerCount);
        setDrawing(false);
        setCurrentCard(null);
      }, 1500);
    }, 1000);
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setTimeout(() => {
      initializeGame();
    }, 100);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <h1 className="text-4xl font-bold mb-8 text-purple-600">Candyland</h1>
          <div className="mb-6">
            <label className="block text-lg mb-2">Number of Players:</label>
            <select 
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-400 outline-none"
            >
              {[2, 3, 4].map(num => (
                <option key={num} value={num}>{num} Players</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-purple-500 text-white px-8 py-3 rounded-lg text-lg font-semibold
                     hover:bg-purple-600 transition-colors duration-200"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const winner = players.find(p => p.position === BOARD_SPACES.length - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-purple-600">Candyland</h1>
          <div className="flex gap-4 items-center">
            {players.map((player, i) => (
              <div 
                key={player.id}
                className={`px-4 py-2 rounded-lg ${
                  currentPlayer === i ? 'bg-white shadow-lg' : 'bg-gray-50'
                }`}
              >
                <span className={`font-semibold ${player.color}`}>
                  {player.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Board 
          spaces={BOARD_SPACES}
          players={players}
          currentPlayer={currentPlayer}
        />

        <div className="mt-8 flex flex-col items-center gap-4">
          {currentCard && (
            <div className={`
              px-6 py-4 rounded-lg ${currentCard.bg} shadow-lg
              transform scale-110 transition-transform duration-300
            `}>
              <span className={`text-xl font-bold ${currentCard.text}`}>
                {currentCard.name}
              </span>
            </div>
          )}
          
          {winner ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-3xl font-bold text-purple-600 animate-bounce">
                🎉 {winner.name} reached the castle and wins! 🎉
              </div>
              <button
                onClick={handlePlayAgain}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold
                         bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          ) : (
            <button
              onClick={handleDrawCard}
              disabled={drawing}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold
                ${drawing 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'}
                text-white transition-colors duration-200
              `}
            >
              <Cards className={drawing ? 'animate-spin' : ''} />
              Draw Card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;