import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Sparkles, Volume2, Plus, Trash2, Award } from 'lucide-react';

/**
 * SpinWheelWidget: Accurate reproduction of Spot Virtual's SpinWheelWidget
 * from spotvirtual.com static/vite/SpinWheelWidget-BWdEUyPy.js.
 * Interactive random picker for speakers, meeting turns, or prizes.
 */
export default function SpinWheelWidget({ isOpen, onClose }) {
  const [items, setItems] = useState([
    'Stan (You)', 'Wes', 'Stefan', 'Steven', 'Chloe', 'Sarah', 'DevBot', 'Quick Icebreaker'
  ]);
  const [newItem, setNewItem] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef(null);

  const colors = [
    '#38bdf8', '#22c55e', '#f59e0b', '#ec4899',
    '#8b5cf6', '#06b6d4', '#f97316', '#a855f7'
  ];

  useEffect(() => {
    if (!isOpen) return;
    drawWheel(rotation);
  }, [isOpen, items, rotation]);

  const drawWheel = (currentAngle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    const numSegments = items.length;
    const arcSize = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);

    // Save before rotating
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(currentAngle);

    // Outer wheel border
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Draw Segments
    for (let i = 0; i < numSegments; i++) {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arcSize);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      // Border between segments
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(items[i], radius - 24, 5);
      ctx.restore();
    }

    // Center Hub
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPOT', 0, 4);

    ctx.restore();

    // Top Pointer Arrow (Fixed)
    ctx.save();
    ctx.translate(center, 12);
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 26);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  };

  const handleSpin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const spinRotations = 5 + Math.random() * 5; // 5 to 10 full turns
    const randomStopAngle = Math.random() * 2 * Math.PI;
    const totalAddedAngle = spinRotations * 2 * Math.PI + randomStopAngle;
    const startAngle = rotation;
    const targetAngle = startAngle + totalAddedAngle;
    const duration = 4000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const cur = startAngle + totalAddedAngle * easeOut;

      setRotation(cur);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calculate winner: the top pointer is at angle -PI/2 (top)
        const normalized = (cur % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const arcSize = (2 * Math.PI) / items.length;
        // Pointer is at 270 deg (3*PI/2) in canvas orientation
        const pointerAngle = (3 * Math.PI / 2 - normalized + 4 * Math.PI) % (2 * Math.PI);
        const winIdx = Math.floor(pointerAngle / arcSize) % items.length;
        setWinner(items[winIdx]);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '680px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        border: '1px solid #cbd5e1',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🎡</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Conference B: Speaker Spin Wheel</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.85 }}>Spot Random Selector &bull; Turn-taking & Icebreakers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', padding: '24px', gap: '24px', background: '#f8fafc' }}>
          {/* Wheel Canvas & Spin Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <canvas ref={canvasRef} width={340} height={340} style={{ width: '340px', height: '340px' }} />

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              style={{
                marginTop: '16px',
                padding: '12px 36px',
                borderRadius: '2rem',
                background: isSpinning ? '#94a3b8' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} />
              <span>{isSpinning ? 'SPINNING...' : 'SPIN WHEEL!'}</span>
            </button>

            {winner && (
              <div style={{
                marginTop: '14px',
                padding: '10px 20px',
                background: '#fef3c7',
                border: '1.5px solid #fde68a',
                borderRadius: '12px',
                color: '#b45309',
                fontWeight: 800,
                fontSize: '1rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Award size={20} color="#d97706" />
                <span>Selected: <strong>{winner}</strong>! 🎉</span>
              </div>
            )}
          </div>

          {/* Wheel Participants List */}
          <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              Wheel Segments ({items.length})
            </span>

            <div style={{
              flex: 1,
              maxHeight: '220px',
              overflowY: 'auto',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px'
            }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#1e293b',
                    background: idx % 2 === 0 ? '#f8fafc' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[idx % colors.length] }} />
                    <span style={{ fontWeight: 600 }}>{item}</span>
                  </div>
                  {items.length > 2 && (
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Item */}
            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Add name or topic..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.78rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <span>Conference Room B Tabletop Widget</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
