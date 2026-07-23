import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ValArcade = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('valos_arcade_highscore') || '0'));
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 3;

    let playerY = canvas.height / 2 - 35;
    let aiY = canvas.height / 2 - 35;
    const paddleHeight = 70;
    const paddleWidth = 10;

    let keys = {};

    const handleKeyDown = (e) => { keys[e.key] = true; };
    const handleKeyUp = (e) => { keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = () => {
      // Update Player Paddle
      if ((keys['ArrowUp'] || keys['w'] || keys['W']) && playerY > 0) {
        playerY -= 6;
      }
      if ((keys['ArrowDown'] || keys['s'] || keys['S']) && playerY < canvas.height - paddleHeight) {
        playerY += 6;
      }

      // Update AI Paddle
      const aiCenter = aiY + paddleHeight / 2;
      if (aiCenter < ballY - 10) aiY += 3.5;
      else if (aiCenter > ballY + 10) aiY -= 3.5;

      // Update Ball Position
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Wall Bounce
      if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
      }

      // Player Paddle Collision
      if (ballX <= paddleWidth + 10 && ballY >= playerY && ballY <= playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX * 1.05;
        setScore(s => {
          const ns = s + 10;
          if (ns > highScore) {
            setHighScore(ns);
            localStorage.setItem('valos_arcade_highscore', ns.toString());
          }
          return ns;
        });
      }

      // AI Paddle Collision
      if (ballX >= canvas.width - paddleWidth - 10 && ballY >= aiY && ballY <= aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
      }

      // Ball Out of Bounds
      if (ballX <= 0) {
        setGameOver(true);
        confetti({ particleCount: 50, spread: 60 });
        return;
      }
      if (ballX >= canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -4;
      }

      // Clear & Draw Frame
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Middle Net
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Draw Player Paddle (Cyan Glass)
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillRect(10, playerY, paddleWidth, paddleHeight);

      // Draw AI Paddle (Rose Glass)
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.fillRect(canvas.width - 20, aiY, paddleWidth, paddleHeight);

      // Draw Ball (Liquid Glowing Orb)
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(gameLoop);
    };

    if (!gameOver) {
      animationId = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, highScore]);

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 p-4 select-none justify-between items-center text-slate-100 font-mono">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
        <div className="flex items-center gap-2 text-fuchsia-400 font-bold">
          <Gamepad2 size={18} />
          <span>Liquid Glass Pong</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Score: <strong className="text-cyan-300">{score}</strong></span>
          <span className="flex items-center gap-1 text-amber-400">
            <Trophy size={14} /> High: <strong>{highScore}</strong>
          </span>
        </div>
      </div>

      {/* Arcade Canvas Screen */}
      <div className="relative my-auto">
        <canvas ref={canvasRef} width={600} height={340} className="rounded-2xl border border-white/20 shadow-2xl" />

        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-black text-rose-400">GAME OVER</h2>
            <p className="text-xs text-slate-300">Final Score: <span className="text-cyan-300 font-bold">{score}</span></p>
            <button 
              onClick={handleRestart}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw size={15} /> Play Again
            </button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-400">
        Controls: Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-white/20 text-white">W</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-white/20 text-white">S</kbd> or Up/Down Arrow keys to move paddle.
      </div>
    </div>
  );
};
