import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Volume2, VolumeX, Trophy, Gamepad2, Sparkles } from 'lucide-react';

export default function ArcadeGameWidget({ isOpen, onClose }) {
  const [activeGame, setActiveGame] = useState('invaders'); // 'invaders' | 'snake' | 'breaker'
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState({ invaders: 1450, snake: 280, breaker: 920 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const gameStateRef = useRef({});

  // Sound effects generator via Web Audio API
  const playRetroSound = (type) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'eat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'bounce') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'over') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Keyboard controls
  const keysRef = useRef({});
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      keysRef.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen]);

  // Game Loop Controller
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 640);
    const height = (canvas.height = 440);

    // Reset game state based on active game
    setIsGameOver(false);
    setScore(0);
    setGameStarted(true);

    if (activeGame === 'invaders') {
      const state = {
        player: { x: width / 2 - 18, y: height - 45, width: 36, height: 22, speed: 6 },
        lasers: [],
        invaders: [],
        invaderDir: 1,
        invaderSpeed: 1.2,
        invaderDropCounter: 0,
        lastShoot: 0,
        lives: 3
      };
      // Spawn invader grid
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
          state.invaders.push({
            x: 70 + c * 60,
            y: 45 + r * 38,
            width: 34,
            height: 22,
            alive: true,
            type: r === 0 ? 0 : r <= 2 ? 1 : 2
          });
        }
      }
      gameStateRef.current = state;

      const loop = (time) => {
        ctx.fillStyle = '#090a12';
        ctx.fillRect(0, 0, width, height);

        // Retro Starfield
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 40; i++) {
          const sx = (i * 123 + time * 0.04) % width;
          const sy = (i * 97) % height;
          ctx.fillRect(sx, sy, (i % 3) + 1, (i % 3) + 1);
        }

        const s = gameStateRef.current;
        if (!s.isOver) {
          // Player movement
          if ((keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) && s.player.x > 10) {
            s.player.x -= s.player.speed;
          }
          if ((keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) && s.player.x < width - s.player.width - 10) {
            s.player.x += s.player.speed;
          }
          // Player shooting
          if ((keysRef.current[' '] || keysRef.current['ArrowUp'] || keysRef.current['w']) && time - s.lastShoot > 280) {
            s.lasers.push({ x: s.player.x + s.player.width / 2 - 2, y: s.player.y, speed: 8 });
            s.lastShoot = time;
            playRetroSound('laser');
          }

          // Move lasers
          for (let i = s.lasers.length - 1; i >= 0; i--) {
            s.lasers[i].y -= s.lasers[i].speed;
            if (s.lasers[i].y < 0) {
              s.lasers.splice(i, 1);
            }
          }

          // Move Invaders
          let hitWall = false;
          let anyAlive = false;
          s.invaders.forEach((inv) => {
            if (!inv.alive) return;
            anyAlive = true;
            inv.x += s.invaderDir * s.invaderSpeed;
            if (inv.x > width - 50 || inv.x < 15) {
              hitWall = true;
            }
            if (inv.y + inv.height >= s.player.y) {
              s.isOver = true;
            }
          });

          if (hitWall) {
            s.invaderDir *= -1;
            s.invaders.forEach((inv) => (inv.y += 14));
            s.invaderSpeed = Math.min(4.5, s.invaderSpeed + 0.15);
          }

          // Check Win (Respawn wave)
          if (!anyAlive) {
            s.invaderSpeed += 0.4;
            s.invaders.forEach((inv) => {
              inv.alive = true;
              inv.y -= 80;
            });
          }

          // Laser-Invader collisions
          s.lasers.forEach((laser, lIdx) => {
            s.invaders.forEach((inv) => {
              if (inv.alive && laser.x > inv.x && laser.x < inv.x + inv.width && laser.y > inv.y && laser.y < inv.y + inv.height) {
                inv.alive = false;
                s.lasers.splice(lIdx, 1);
                const pts = (3 - inv.type) * 50;
                setScore((prev) => {
                  const ns = prev + pts;
                  setHighScores((hs) => ({ ...hs, invaders: Math.max(hs.invaders, ns) }));
                  return ns;
                });
                playRetroSound('hit');
              }
            });
          });

          if (s.isOver) {
            setIsGameOver(true);
            playRetroSound('over');
          }
        }

        // Draw Invaders
        s.invaders.forEach((inv) => {
          if (!inv.alive) return;
          const colors = ['#f43f5e', '#a855f7', '#06b6d4'];
          ctx.fillStyle = colors[inv.type];
          ctx.beginPath();
          ctx.roundRect(inv.x, inv.y, inv.width, inv.height, 4);
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(inv.x + 6, inv.y + 6, 6, 6);
          ctx.fillRect(inv.x + inv.width - 12, inv.y + 6, 6, 6);
        });

        // Draw Lasers
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 8;
        s.lasers.forEach((l) => {
          ctx.fillRect(l.x, l.y, 4, 12);
        });
        ctx.shadowBlur = 0;

        // Draw Player Ship
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#16a34a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(s.player.x + s.player.width / 2, s.player.y);
        ctx.lineTo(s.player.x + s.player.width, s.player.y + s.player.height);
        ctx.lineTo(s.player.x, s.player.y + s.player.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);

    } else if (activeGame === 'snake') {
      const gridSize = 20;
      const state = {
        snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
        food: { x: 18, y: 10 },
        lastTick: 0,
        speed: 100
      };
      gameStateRef.current = state;

      const loop = (time) => {
        ctx.fillStyle = '#080c14';
        ctx.fillRect(0, 0, width, height);

        // Cyber Grid Lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        const s = gameStateRef.current;
        // Direction change handling
        if ((keysRef.current['ArrowUp'] || keysRef.current['w']) && s.dir.y === 0) s.nextDir = { x: 0, y: -1 };
        if ((keysRef.current['ArrowDown'] || keysRef.current['s']) && s.dir.y === 0) s.nextDir = { x: 0, y: 1 };
        if ((keysRef.current['ArrowLeft'] || keysRef.current['a']) && s.dir.x === 0) s.nextDir = { x: -1, y: 0 };
        if ((keysRef.current['ArrowRight'] || keysRef.current['d']) && s.dir.x === 0) s.nextDir = { x: 1, y: 0 };

        if (!s.isOver && time - s.lastTick > s.speed) {
          s.lastTick = time;
          s.dir = s.nextDir;
          const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

          // Wall collision
          const cols = Math.floor(width / gridSize);
          const rows = Math.floor(height / gridSize);
          if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            s.isOver = true;
          }
          // Self collision
          s.snake.forEach((seg) => {
            if (seg.x === head.x && seg.y === head.y) s.isOver = true;
          });

          if (!s.isOver) {
            s.snake.unshift(head);
            // Check Food
            if (head.x === s.food.x && head.y === s.food.y) {
              setScore((prev) => {
                const ns = prev + 20;
                setHighScores((hs) => ({ ...hs, snake: Math.max(hs.snake, ns) }));
                return ns;
              });
              playRetroSound('eat');
              s.speed = Math.max(55, s.speed - 2);
              // Spawn new food
              s.food = {
                x: Math.floor(Math.random() * (cols - 2)) + 1,
                y: Math.floor(Math.random() * (rows - 2)) + 1
              };
            } else {
              s.snake.pop();
            }
          } else {
            setIsGameOver(true);
            playRetroSound('over');
          }
        }

        // Draw Food
        ctx.fillStyle = '#eab308';
        ctx.shadowColor = '#ca8a04';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(s.food.x * gridSize + gridSize / 2, s.food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Snake
        s.snake.forEach((seg, i) => {
          ctx.fillStyle = i === 0 ? '#38bdf8' : '#0284c7';
          ctx.beginPath();
          ctx.roundRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2, 4);
          ctx.fill();
        });

        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);

    } else if (activeGame === 'breaker') {
      const state = {
        paddle: { x: width / 2 - 45, y: height - 30, width: 90, height: 14, speed: 7 },
        ball: { x: width / 2, y: height - 60, vx: 4, vy: -4, radius: 7 },
        bricks: []
      };
      const brickRows = 5;
      const brickCols = 10;
      const brickW = 56;
      const brickH = 20;
      const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8'];

      for (let r = 0; r < brickRows; r++) {
        for (let c = 0; c < brickCols; c++) {
          state.bricks.push({
            x: 35 + c * (brickW + 4),
            y: 40 + r * (brickH + 4),
            width: brickW,
            height: brickH,
            color: colors[r],
            alive: true,
            pts: (brickRows - r) * 15
          });
        }
      }
      gameStateRef.current = state;

      const loop = () => {
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        const s = gameStateRef.current;
        if (!s.isOver) {
          if ((keysRef.current['ArrowLeft'] || keysRef.current['a']) && s.paddle.x > 10) {
            s.paddle.x -= s.paddle.speed;
          }
          if ((keysRef.current['ArrowRight'] || keysRef.current['d']) && s.paddle.x < width - s.paddle.width - 10) {
            s.paddle.x += s.paddle.speed;
          }

          // Ball movement
          s.ball.x += s.ball.vx;
          s.ball.y += s.ball.vy;

          // Wall bounce
          if (s.ball.x - s.ball.radius < 0 || s.ball.x + s.ball.radius > width) {
            s.ball.vx *= -1;
            playRetroSound('bounce');
          }
          if (s.ball.y - s.ball.radius < 0) {
            s.ball.vy *= -1;
            playRetroSound('bounce');
          }

          // Paddle bounce
          if (
            s.ball.y + s.ball.radius >= s.paddle.y &&
            s.ball.x >= s.paddle.x &&
            s.ball.x <= s.paddle.x + s.paddle.width
          ) {
            s.ball.vy = -Math.abs(s.ball.vy);
            const hitRatio = (s.ball.x - (s.paddle.x + s.paddle.width / 2)) / (s.paddle.width / 2);
            s.ball.vx = hitRatio * 6;
            playRetroSound('bounce');
          }

          // Bottom loss
          if (s.ball.y > height) {
            s.isOver = true;
            setIsGameOver(true);
            playRetroSound('over');
          }

          // Brick collision
          s.bricks.forEach((b) => {
            if (!b.alive) return;
            if (
              s.ball.x + s.ball.radius > b.x &&
              s.ball.x - s.ball.radius < b.x + b.width &&
              s.ball.y + s.ball.radius > b.y &&
              s.ball.y - s.ball.radius < b.y + b.height
            ) {
              b.alive = false;
              s.ball.vy *= -1;
              setScore((prev) => {
                const ns = prev + b.pts;
                setHighScores((hs) => ({ ...hs, breaker: Math.max(hs.breaker, ns) }));
                return ns;
              });
              playRetroSound('hit');
            }
          });
        }

        // Draw Bricks
        s.bricks.forEach((b) => {
          if (!b.alive) return;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, b.width, b.height, 3);
          ctx.fill();
        });

        // Draw Paddle
        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#9333ea';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(s.paddle.x, s.paddle.y, s.paddle.width, s.paddle.height, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, s.ball.radius, 0, Math.PI * 2);
        ctx.fill();

        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, activeGame]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-slate-950 border-4 border-purple-600/70 rounded-2xl shadow-2xl shadow-purple-900/50 overflow-hidden flex flex-col font-mono text-white">
        {/* Retro Arcade Bezel Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 border-b-2 border-purple-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wider text-purple-200 flex items-center gap-2">
                SPOT RETRO ARCADE <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </h2>
              <p className="text-xs text-purple-400/80">AUTHENTIC 1980s CABINET CHIP-SET</p>
            </div>
          </div>

          {/* Game Switcher Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-lg border border-purple-500/30">
            <button
              onClick={() => setActiveGame('invaders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeGame === 'invaders' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              SPACE INVADERS
            </button>
            <button
              onClick={() => setActiveGame('snake')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeGame === 'snake' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              CYBER SNAKE
            </button>
            <button
              onClick={() => setActiveGame('breaker')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeGame === 'breaker' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              BRICK BREAKER
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-2 rounded-lg bg-slate-900 border border-purple-500/30 hover:bg-slate-800 text-purple-300 transition-colors"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-purple-500/30 hover:bg-rose-900/50 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Scorebar */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-purple-500/20 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span>SCORE:</span>
              <span className="text-sm font-black text-white">{score.toString().padStart(5, '0')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>HIGH SCORE:</span>
              <span className="text-sm font-black text-white">{highScores[activeGame].toString().padStart(5, '0')}</span>
            </div>
          </div>
          <div className="text-slate-400 flex items-center gap-3">
            <span>[A/D or Arrows] Move</span>
            <span>[Space] Shoot/Action</span>
          </div>
        </div>

        {/* CRT Arcade Screen Area */}
        <div className="relative bg-black p-4 flex items-center justify-center overflow-hidden">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-800 shadow-[inset_0_0_80px_rgba(168,85,247,0.2)]">
            <canvas ref={canvasRef} className="block cursor-crosshair" />

            {/* CRT Scanline Filter Overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0.7) 1px, transparent 1px, transparent 2px)'
              }}
            />

            {/* Game Over Screen */}
            {isGameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <h3 className="text-3xl font-extrabold text-rose-500 tracking-widest animate-pulse">GAME OVER</h3>
                <p className="text-slate-300 text-sm">FINAL SCORE: <span className="font-bold text-yellow-400">{score}</span></p>
                <button
                  onClick={() => {
                    setIsGameOver(false);
                    setScore(0);
                    // Retrigger activeGame reset
                    setActiveGame((g) => (g === 'invaders' ? 'snake' : 'invaders'));
                    setTimeout(() => setActiveGame(activeGame), 10);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-purple-600/40 transition-all hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" /> PLAY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
