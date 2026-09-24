import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const RetroSnake: React.FC = () => {
  const gridSize = 18;
  const [snake, setSnake] = useState<Point[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [food, setFood] = useState<Point>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(120);

  const spawnFood = (currSnake: Point[]) => {
    let p: Point;
    while (true) {
      p = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      if (!currSnake.some((s) => s.x === p.x && s.y === p.y)) break;
    }
    return p;
  };

  const resetGame = () => {
    const initialSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake));
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        if (direction === 'UP') newHead.y = (newHead.y - 1 + gridSize) % gridSize;
        if (direction === 'DOWN') newHead.y = (newHead.y + 1) % gridSize;
        if (direction === 'LEFT') newHead.x = (newHead.x - 1 + gridSize) % gridSize;
        if (direction === 'RIGHT') newHead.x = (newHead.x + 1) % gridSize;

        // Check self collision
        if (prevSnake.slice(1).some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 160);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, highScore]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 bg-[#0a0f1d] text-white select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold">Retro Snake Cloud</h2>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400">HI: {highScore}</span>
          <span className="text-emerald-400 font-bold text-sm">SCORE: {score}</span>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative w-64 h-64 bg-[#050811] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Snake & Food Grid */}
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const x = idx % gridSize;
            const y = Math.floor(idx / gridSize);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`m-[0.5px] rounded-[2px] ${
                  isHead
                    ? 'bg-emerald-400 shadow-sm'
                    : isBody
                    ? 'bg-sky-400'
                    : isFood
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 space-y-3">
            <h3 className="text-lg font-extrabold text-red-500 tracking-wider">GAME OVER</h3>
            <p className="text-xs text-slate-300">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Controls */}
      <div className="flex flex-col items-center space-y-1">
        <button
          onClick={() => direction !== 'DOWN' && setDirection('UP')}
          className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center shadow-md text-slate-200"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex space-x-8">
          <button
            onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
            className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center shadow-md text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
            className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center shadow-md text-slate-200"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => direction !== 'UP' && setDirection('DOWN')}
          className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center shadow-md text-slate-200"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
