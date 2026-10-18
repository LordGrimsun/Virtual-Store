import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';

export default function PingPongGameWidget({ isOpen, onClose }) {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [winner, setWinner] = useState(null);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const stateRef = useRef(null);

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const now = audioCtx.currentTime;

      if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'score') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {}
  };

  const resetGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setWinner(null);
    if (stateRef.current) {
      stateRef.current.ball = { x: 300, y: 180, vx: 5, vy: 2, radius: 8 };
    }
  };

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 620);
    const height = (canvas.height = 360);

    const paddleW = 12;
    const paddleH = 75;

    stateRef.current = {
      playerPaddle: { x: 20, y: height / 2 - paddleH / 2, width: paddleW, height: paddleH },
      aiPaddle: { x: width - 20 - paddleW, y: height / 2 - paddleH / 2, width: paddleW, height: paddleH, speed: 4.2 },
      ball: { x: width / 2, y: height / 2, vx: 5.5, vy: (Math.random() - 0.5) * 4, radius: 8 },
      mouseY: height / 2
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const my = e.clientY - rect.top;
      if (stateRef.current) {
        stateRef.current.mouseY = my;
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);

    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      ctx.clearRect(0, 0, width, height);

      // Draw Table Top (Tournament Blue)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, width, height);

      // White Border Lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      // Center Net Line
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!winner) {
        // Update Player Paddle (follows mouse smoothly)
        s.playerPaddle.y = Math.max(8, Math.min(height - s.playerPaddle.height - 8, s.mouseY - s.playerPaddle.height / 2));

        // Update AI Paddle (smart tracking with minor delay)
        const targetAiY = s.ball.y - s.aiPaddle.height / 2;
        if (s.aiPaddle.y < targetAiY - 5) {
          s.aiPaddle.y += s.aiPaddle.speed;
        } else if (s.aiPaddle.y > targetAiY + 5) {
          s.aiPaddle.y -= s.aiPaddle.speed;
        }
        s.aiPaddle.y = Math.max(8, Math.min(height - s.aiPaddle.height - 8, s.aiPaddle.y));

        // Move Ball
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;

        // Top & Bottom Wall Bounces
        if (s.ball.y - s.ball.radius <= 6) {
          s.ball.y = 6 + s.ball.radius;
          s.ball.vy *= -1;
          playSound('hit');
        } else if (s.ball.y + s.ball.radius >= height - 6) {
          s.ball.y = height - 6 - s.ball.radius;
          s.ball.vy *= -1;
          playSound('hit');
        }

        // Paddle Collisions (Left / Player)
        if (
          s.ball.x - s.ball.radius <= s.playerPaddle.x + s.playerPaddle.width &&
          s.ball.x + s.ball.radius >= s.playerPaddle.x &&
          s.ball.y >= s.playerPaddle.y &&
          s.ball.y <= s.playerPaddle.y + s.playerPaddle.height &&
          s.ball.vx < 0
        ) {
          s.ball.vx = Math.abs(s.ball.vx) * 1.05; // accelerate rally
          const hitPos = (s.ball.y - (s.playerPaddle.y + s.playerPaddle.height / 2)) / (s.playerPaddle.height / 2);
          s.ball.vy = hitPos * 6.5;
          playSound('hit');
        }

        // Paddle Collisions (Right / AI)
        if (
          s.ball.x + s.ball.radius >= s.aiPaddle.x &&
          s.ball.x - s.ball.radius <= s.aiPaddle.x + s.aiPaddle.width &&
          s.ball.y >= s.aiPaddle.y &&
          s.ball.y <= s.aiPaddle.y + s.aiPaddle.height &&
          s.ball.vx > 0
        ) {
          s.ball.vx = -Math.abs(s.ball.vx) * 1.05;
          const hitPos = (s.ball.y - (s.aiPaddle.y + s.aiPaddle.height / 2)) / (s.aiPaddle.height / 2);
          s.ball.vy = hitPos * 6.5;
          playSound('hit');
        }

        // Left Boundary (AI Scores)
        if (s.ball.x < 0) {
          playSound('score');
          setAiScore((prev) => {
            const next = prev + 1;
            if (next >= 11) setWinner('AI Opponent');
            return next;
          });
          s.ball = { x: width / 2, y: height / 2, vx: 5.5, vy: (Math.random() - 0.5) * 4, radius: 8 };
        }

        // Right Boundary (Player Scores)
        if (s.ball.x > width) {
          playSound('score');
          setPlayerScore((prev) => {
            const next = prev + 1;
            if (next >= 11) setWinner('Player (You)');
            return next;
          });
          s.ball = { x: width / 2, y: height / 2, vx: -5.5, vy: (Math.random() - 0.5) * 4, radius: 8 };
        }
      }

      // Draw Player Paddle (Red)
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(s.playerPaddle.x, s.playerPaddle.y, s.playerPaddle.width, s.playerPaddle.height, 6);
      ctx.fill();

      // Draw AI Paddle (Black/Dark Grey)
      ctx.fillStyle = '#1e293b';
      ctx.shadowColor = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(s.aiPaddle.x, s.aiPaddle.y, s.aiPaddle.width, s.aiPaddle.height, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Ping Pong Ball (High-vis White with shadow)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, s.ball.radius, 0, Math.PI * 2);
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, winner]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div className="relative w-full max-w-2xl bg-slate-950 border-4 border-blue-600/70 rounded-2xl shadow-2xl shadow-blue-950/60 overflow-hidden flex flex-col font-sans text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b-2 border-blue-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wider text-blue-200 flex items-center gap-2">
                TOURNAMENT PING PONG <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              </h2>
              <p className="text-xs text-blue-400/80">COMPETITION TABLE TENNIS • MATCH TO 11</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetGame}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/30 hover:bg-slate-800 text-xs text-blue-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RESTART
            </button>
            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-2 rounded-lg bg-slate-900 border border-blue-500/30 hover:bg-slate-800 text-blue-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-blue-500/30 hover:bg-rose-900/50 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="px-8 py-3 bg-slate-900 border-b border-blue-500/20 flex items-center justify-between text-sm font-bold">
          <div className="flex items-center gap-3 text-rose-400">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>YOU (RED):</span>
            <span className="text-2xl font-black text-white">{playerScore}</span>
          </div>
          <div className="text-slate-400 text-xs font-mono">
            [Move Mouse Vertically] Control Paddle
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span>AI (BLACK):</span>
            <span className="text-2xl font-black text-white">{aiScore}</span>
            <span className="w-3 h-3 rounded-full bg-slate-600" />
          </div>
        </div>

        {/* Ping Pong Table Canvas */}
        <div className="relative bg-slate-900/90 p-4 flex items-center justify-center">
          <canvas ref={canvasRef} className="block cursor-ns-resize rounded-xl shadow-2xl" />

          {/* Winner Celebration Modal */}
          {winner && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
              <h3 className="text-2xl font-extrabold text-white tracking-widest">{winner} WINS THE MATCH!</h3>
              <p className="text-slate-300 text-sm">FINAL SCORE: {playerScore} - {aiScore}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/40 transition-all hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" /> PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
