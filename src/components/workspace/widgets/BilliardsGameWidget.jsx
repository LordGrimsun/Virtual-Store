import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, Target } from 'lucide-react';

export default function BilliardsGameWidget({ isOpen, onClose }) {
  const [ballsPocketed, setBallsPocketed] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [power, setPower] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const stateRef = useRef(null);

  // Sound effects generator
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
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'clash') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(640, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'pocket') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {}
  };

  const initGame = () => {
    setBallsPocketed(0);
    const tableW = 600;
    const tableH = 320;
    const ballR = 10;

    const balls = [];
    // Cue Ball (White)
    balls.push({
      id: 0,
      x: 160,
      y: tableH / 2,
      vx: 0,
      vy: 0,
      radius: ballR,
      color: '#f8fafc',
      isCue: true,
      inPocket: false
    });

    // 8-Ball Triangle Rack
    const ballColors = [
      '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981',
      '#18181b', // 8-Ball in center
      '#ec4899', '#06b6d4', '#f97316', '#eab308'
    ];

    const rackStartX = 420;
    const rackStartY = tableH / 2;
    let bIdx = 0;
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row <= col; row++) {
        if (bIdx >= ballColors.length) break;
        const bx = rackStartX + col * (ballR * 1.76);
        const by = rackStartY + (row - col / 2) * (ballR * 2.1);
        balls.push({
          id: bIdx + 1,
          x: bx,
          y: by,
          vx: 0,
          vy: 0,
          radius: ballR,
          color: ballColors[bIdx],
          isCue: false,
          inPocket: false
        });
        bIdx++;
      }
    }

    // 6 Table Pockets (Corners and Center Sides)
    const pockets = [
      { x: 30, y: 30, r: 20 },
      { x: tableW / 2, y: 24, r: 18 },
      { x: tableW - 30, y: 30, r: 20 },
      { x: 30, y: tableH - 30, r: 20 },
      { x: tableW / 2, y: tableH - 24, r: 18 },
      { x: tableW - 30, y: tableH - 30, r: 20 }
    ];

    stateRef.current = {
      tableW,
      tableH,
      ballR,
      balls,
      pockets,
      mousePos: { x: 0, y: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      dragDist: 0,
      ballsMoving: false
    };
  };

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    initGame();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 660;
    canvas.height = 380;

    const onMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - 30;
      const my = e.clientY - rect.top - 30;
      const s = stateRef.current;
      if (!s || s.ballsMoving) return;

      const cueBall = s.balls[0];
      if (cueBall.inPocket) {
        // Respawn cue ball if sunk
        cueBall.inPocket = false;
        cueBall.x = 160;
        cueBall.y = s.tableH / 2;
        cueBall.vx = 0;
        cueBall.vy = 0;
      }

      s.isDragging = true;
      s.dragStart = { x: mx, y: my };
      setIsAiming(true);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - 30;
      const my = e.clientY - rect.top - 30;
      const s = stateRef.current;
      if (!s) return;
      s.mousePos = { x: mx, y: my };

      if (s.isDragging) {
        const dx = mx - s.dragStart.x;
        const dy = my - s.dragStart.y;
        const dist = Math.min(120, Math.hypot(dx, dy));
        s.dragDist = dist;
        setPower(Math.round((dist / 120) * 100));
      }
    };

    const onMouseUp = () => {
      const s = stateRef.current;
      if (!s || !s.isDragging) return;

      const cueBall = s.balls[0];
      if (!cueBall.inPocket && s.dragDist > 8) {
        const dx = s.mousePos.x - cueBall.x;
        const dy = s.mousePos.y - cueBall.y;
        const angle = Math.atan2(dy, dx);
        const impulse = (s.dragDist / 120) * 16;

        // Cue strikes ball towards mouse direction
        cueBall.vx = Math.cos(angle) * impulse;
        cueBall.vy = Math.sin(angle) * impulse;
        playSound('hit');
      }

      s.isDragging = false;
      s.dragDist = 0;
      setIsAiming(false);
      setPower(0);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Physics Animation Loop
    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Wood Rail Cushion Border
      ctx.save();
      ctx.translate(30, 30);

      // Felt Background
      ctx.fillStyle = '#065f46'; // Tournament Emerald Felt
      ctx.fillRect(0, 0, s.tableW, s.tableH);

      // Draw Cushions Outer Frame
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 16;
      ctx.strokeRect(-8, -8, s.tableW + 16, s.tableH + 16);

      // Inner Cushion Line
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 6;
      ctx.strokeRect(0, 0, s.tableW, s.tableH);

      // Draw Pockets
      s.pockets.forEach((p) => {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Update Physics & Ball-Ball Collisions
      let moving = false;
      const friction = 0.985;

      for (let i = 0; i < s.balls.length; i++) {
        const b = s.balls[i];
        if (b.inPocket) continue;

        if (Math.hypot(b.vx, b.vy) > 0.05) {
          moving = true;
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= friction;
          b.vy *= friction;

          // Wall Cushions Bouncing
          if (b.x - b.radius < 12) {
            b.x = 12 + b.radius;
            b.vx *= -0.85;
            playSound('clash');
          }
          if (b.x + b.radius > s.tableW - 12) {
            b.x = s.tableW - 12 - b.radius;
            b.vx *= -0.85;
            playSound('clash');
          }
          if (b.y - b.radius < 12) {
            b.y = 12 + b.radius;
            b.vy *= -0.85;
            playSound('clash');
          }
          if (b.y + b.radius > s.tableH - 12) {
            b.y = s.tableH - 12 - b.radius;
            b.vy *= -0.85;
            playSound('clash');
          }

          // Check Pocket Sinking
          s.pockets.forEach((p) => {
            if (Math.hypot(b.x - p.x, b.y - p.y) < p.r + 4) {
              b.inPocket = true;
              b.vx = 0;
              b.vy = 0;
              playSound('pocket');
              if (!b.isCue) {
                setBallsPocketed((prev) => prev + 1);
              }
            }
          });
        } else {
          b.vx = 0;
          b.vy = 0;
        }

        // Ball vs Ball Collisions
        for (let j = i + 1; j < s.balls.length; j++) {
          const b2 = s.balls[j];
          if (b2.inPocket) continue;

          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < b.radius + b2.radius && dist > 0) {
            const overlap = b.radius + b2.radius - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate balls
            b.x -= nx * overlap * 0.5;
            b.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            // Elastic impulse
            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2;

            b.vx -= p * nx * 0.95;
            b.vy -= p * ny * 0.95;
            b2.vx += p * nx * 0.95;
            b2.vy += p * ny * 0.95;

            playSound('clash');
          }
        }
      }

      s.ballsMoving = moving;

      // Draw Balls
      s.balls.forEach((b) => {
        if (b.inPocket) return;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // 3D Ball Shading / Glint
        const grad = ctx.createRadialGradient(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.35,
          1,
          b.x,
          b.y,
          b.radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Number dot on 8-ball
        if (b.id === 6) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Cue Stick & Aim Line
      const cueBall = s.balls[0];
      if (!s.ballsMoving && !cueBall.inPocket) {
        const dx = s.mousePos.x - cueBall.x;
        const dy = s.mousePos.y - cueBall.y;
        const angle = Math.atan2(dy, dx);

        // Aiming trajectory line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cueBall.x, cueBall.y);
        ctx.lineTo(cueBall.x + Math.cos(angle) * 140, cueBall.y + Math.sin(angle) * 140);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cue Stick
        const cueDist = 25 + s.dragDist * 0.6;
        const cueX = cueBall.x - Math.cos(angle) * cueDist;
        const cueY = cueBall.y - Math.sin(angle) * cueDist;
        const cueEndX = cueBall.x - Math.cos(angle) * (cueDist + 160);
        const cueEndY = cueBall.y - Math.sin(angle) * (cueDist + 160);

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(cueX, cueY);
        ctx.lineTo(cueEndX, cueEndY);
        ctx.stroke();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-slate-950 border-4 border-emerald-600/70 rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden flex flex-col font-sans text-white">
        {/* Billiards Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b-2 border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wider text-emerald-200 flex items-center gap-2">
                TOURNAMENT 8-BALL BILLIARDS <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              </h2>
              <p className="text-xs text-emerald-400/80">REALTIME PHYSICAL POCKET BILLIARDS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={initGame}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 hover:bg-slate-800 text-xs text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RE-RACK
            </button>
            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-2 rounded-lg bg-slate-900 border border-emerald-500/30 hover:bg-slate-800 text-emerald-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-emerald-500/30 hover:bg-rose-900/50 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live HUD Bar */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-emerald-500/20 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-6">
            <div className="text-emerald-400">
              POCKETED: <span className="text-sm font-black text-white">{ballsPocketed} / 10</span>
            </div>
            <div className="text-amber-400 flex items-center gap-2">
              <span>SHOT POWER:</span>
              <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-75"
                  style={{ width: `${power}%` }}
                />
              </div>
              <span className="text-xs font-mono">{power}%</span>
            </div>
          </div>
          <div className="text-slate-400">
            [Click & Drag] Aim & Pull Back • [Release] Shoot
          </div>
        </div>

        {/* 2D Green Felt Pool Table */}
        <div className="relative bg-emerald-950/80 p-4 flex items-center justify-center">
          <canvas ref={canvasRef} className="block cursor-crosshair rounded-xl shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
