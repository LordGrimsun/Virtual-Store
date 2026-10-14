import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, MessageCircle, Bot, Users, Smile, Coffee, Bell } from 'lucide-react';

export default function WorkspaceLiveDemo() {
  const [userPos, setUserPos] = useState({ x: 260, y: 190 });
  const [activeBubble, setActiveBubble] = useState(null);
  const [activeZone, setActiveZone] = useState('Central Office');
  const [confettiActive, setConfettiActive] = useState(false);
  const [botMessage, setBotMessage] = useState('OpenClaw Bot: Watching channels...');
  const canvasRef = useRef(null);

  // Colleague positions
  const colleagues = [
    { id: 'sarah', name: 'Sarah (Design)', x: 120, y: 110, role: 'colleague', color: '#ec4899', msg: 'Hey! Check out the new layouts!' },
    { id: 'david', name: 'David (Eng)', x: 420, y: 120, role: 'colleague', color: '#8b5cf6', msg: 'PR merged! Time for a release.' },
    { id: 'openclaw', name: 'OpenClaw Agent', x: 280, y: 310, role: 'agent', color: '#10b981', msg: 'AI Agent ready! Ask me anything.' }
  ];

  // Move user avatar on click
  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));
    setUserPos({ x, y });

    // Detect zone
    if (x < 200 && y < 200) {
      setActiveZone('Design Pod');
    } else if (x > 340 && y < 200) {
      setActiveZone('Engineering Room');
    } else if (y > 250) {
      setActiveZone('AI Agent Lab');
    } else {
      setActiveZone('Central Watercooler');
    }

    // Check proximity to bot
    const distToBot = Math.hypot(x - 280, y - 310);
    if (distToBot < 90) {
      setBotMessage('OpenClaw Bot: You stepped into my zone! I am connected via Spot API.');
    } else {
      setBotMessage('OpenClaw Bot: Ambient presence active in channels.');
    }
  };

  const triggerEmote = (emote, message) => {
    setActiveBubble(message);
    if (emote === 'confetti') {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 2500);
    }
    setTimeout(() => setActiveBubble(null), 3000);
  };

  return (
    <div className="Sandbox_wrapper" style={{ marginTop: '2.5rem' }}>
      {/* Top Bar */}
      <div className="Sandbox_header">
        <div className="Sandbox_title">
          <Sparkles size={18} color="#60c449" />
          <span>Interactive Spot Virtual HQ Demo</span>
        </div>
        <div className="Sandbox_status">
          <span className="ai-agents_liveDot" />
          <span>Zone: {activeZone}</span>
        </div>
      </div>

      {/* Interactive 2D Canvas */}
      <div
        ref={canvasRef}
        className="Sandbox_canvas"
        onClick={handleCanvasClick}
        title="Click anywhere to walk your avatar"
      >
        {/* Background Room Zones */}
        <div className="Sandbox_zone" style={{ top: 20, left: 20, width: 170, height: 160, background: 'rgba(59, 130, 246, 0.08)' }}>
          <span className="Sandbox_zoneName" style={{ color: '#60a5fa' }}>Design Pod</span>
        </div>

        <div className="Sandbox_zone" style={{ top: 20, right: 20, width: 170, height: 160, background: 'rgba(168, 85, 247, 0.08)' }}>
          <span className="Sandbox_zoneName" style={{ color: '#c084fc' }}>Engineering Room</span>
        </div>

        <div className="Sandbox_zone" style={{ bottom: 20, left: '20%', width: '60%', height: 130, background: 'rgba(16, 185, 129, 0.08)' }}>
          <span className="Sandbox_zoneName" style={{ color: '#34d399' }}>AI Agents & OpenClaw Hub</span>
        </div>

        {/* Center Watercooler */}
        <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.35, textAlign: 'center', pointerEvents: 'none' }}>
          <Coffee size={32} color="#ffffff" style={{ margin: '0 auto' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Watercooler</span>
        </div>

        {/* Colleagues */}
        {colleagues.map((c) => (
          <div
            key={c.id}
            className="Sandbox_avatar"
            style={{ top: c.y, left: c.x }}
            onClick={(e) => {
              e.stopPropagation();
              triggerEmote('chat', `${c.name}: "${c.msg}"`);
            }}
          >
            <div className={`Sandbox_avatarCircle ${c.role}`} style={{ backgroundColor: c.color }}>
              {c.role === 'agent' ? <Bot size={18} color="#fff" /> : c.name[0]}
            </div>
            <span className="Sandbox_avatarLabel">{c.name}</span>
          </div>
        ))}

        {/* User Avatar */}
        <div className="Sandbox_avatar" style={{ top: userPos.y, left: userPos.x }}>
          {activeBubble && (
            <div className="Sandbox_bubble">
              {activeBubble}
            </div>
          )}
          <div className="Sandbox_avatarCircle user">
            You
          </div>
          <span className="Sandbox_avatarLabel">You (Click floor to move)</span>
        </div>

        {/* Confetti Animation Effect */}
        {confettiActive && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: `${(i * 3.3)}%`,
                  width: `${6 + (i % 5)}px`,
                  height: `${10 + (i % 6)}px`,
                  backgroundColor: ['#60c449', '#59a7f0', '#ec4899', '#fbbf24', '#a855f7'][i % 5],
                  animation: `fall ${1.5 + (i % 10) * 0.1}s linear infinite`,
                  transform: `rotate(${i * 24}deg)`
                }}
              />
            ))}
            <style>{`
              @keyframes fall {
                to { transform: translateY(420px) rotate(720deg); }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="Sandbox_toolbar">
        <div className="Sandbox_emotes">
          <button
            type="button"
            className="Sandbox_emoteBtn"
            onClick={() => triggerEmote('highfive', '✋ High-fived David!')}
          >
            ✋ High-Five
          </button>
          <button
            type="button"
            className="Sandbox_emoteBtn"
            onClick={() => triggerEmote('confetti', '🎉 Big Win celebrated with Confetti!')}
          >
            🎉 Celebrate Confetti
          </button>
          <button
            type="button"
            className="Sandbox_emoteBtn"
            onClick={() => triggerEmote('coffee', '☕ Grabbing virtual coffee at the watercooler')}
          >
            ☕ Watercooler
          </button>
          <button
            type="button"
            className="Sandbox_emoteBtn"
            onClick={() => triggerEmote('gong', '🔔 Gong hit! The entire office heard that!')}
          >
            🔔 Hit Gong
          </button>
        </div>

        <div className="Sandbox_instructions">
          <span>{botMessage}</span>
        </div>
      </div>
    </div>
  );
}
