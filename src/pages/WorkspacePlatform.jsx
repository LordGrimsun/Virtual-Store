import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Headphones, Volume2,
  Users, Bot, MessageSquare, Edit3, Share2, LogOut, Settings,
  Sparkles, Send, Plus, Check, ChevronRight, X, PhoneCall, VolumeX
} from 'lucide-react';

export default function WorkspacePlatform({ user, onExit }) {
  // Navigation / Floor state
  const [userPos, setUserPos] = useState({ x: 380, y: 140 });
  const [currentRoom, setCurrentRoom] = useState('Engineering Lab');
  const [proximityConnected, setProximityConnected] = useState(null);
  const [activeTab, setActiveTab] = useState('team'); // 'team', 'ai', 'chat', 'whiteboard'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Audio / Media toggles
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHeadphonesOn, setIsHeadphonesOn] = useState(true);

  // Reactions
  const [activeReaction, setActiveReaction] = useState(null);

  // AI Agent Chat state
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'DevBot',
      text: 'Hey there! I am your OpenClaw workspace agent. You can ask me to inspect pull requests, run diagnostics, or summarize team discussions in this room.',
      time: '11:42 AM'
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Room Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sarah Chen', text: 'Morning everyone! Pushed the latest WebRTC latency fixes.', time: '11:30 AM' },
    { sender: 'Alex Mercer', text: 'Looks great! Meeting in the Boardroom at 2 PM for the design sync.', time: '11:35 AM' }
  ]);

  // Whiteboard drawing state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#60c449');

  // Teammates in the workspace
  const teammates = [
    { id: '1', name: 'Sarah Chen', role: 'Staff Engineer', room: 'Engineering Lab', x: 320, y: 110, color: '#3b82f6', isSpeaking: true },
    { id: '2', name: 'Alex Mercer', role: 'Product Lead', room: 'Boardroom', x: 740, y: 120, color: '#ec4899', isSpeaking: false },
    { id: '3', name: 'Elena Rostova', role: 'Senior Designer', room: 'Focus Pod A', x: 110, y: 310, color: '#8b5cf6', isSpeaking: false },
    { id: '4', name: 'Marcus Vance', role: 'DevOps Lead', room: 'Kitchen', x: 410, y: 360, color: '#f59e0b', isSpeaking: false },
    { id: '5', name: 'DevBot (OpenClaw)', role: 'AI Autonomous Agent', room: 'AI Station', x: 750, y: 360, color: '#10b981', isBot: true }
  ];

  // Defined Rooms on the 2D floorplan
  const rooms = [
    { name: 'Main Lounge', x: 40, y: 40, w: 220, h: 180, color: 'rgba(59, 130, 246, 0.08)', border: '#3b82f6' },
    { name: 'Engineering Lab', x: 280, y: 40, w: 320, h: 200, color: 'rgba(96, 196, 73, 0.08)', border: '#60c449' },
    { name: 'Boardroom', x: 620, y: 40, w: 320, h: 200, color: 'rgba(236, 72, 153, 0.08)', border: '#ec4899' },
    { name: 'Focus Pod A', x: 40, y: 240, w: 105, h: 180, color: 'rgba(139, 92, 246, 0.08)', border: '#8b5cf6' },
    { name: 'Focus Pod B', x: 155, y: 240, w: 105, h: 180, color: 'rgba(139, 92, 246, 0.08)', border: '#8b5cf6' },
    { name: 'Kitchen & Cafe', x: 280, y: 260, w: 320, h: 160, color: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b' },
    { name: 'AI Station', x: 620, y: 260, w: 320, h: 160, color: 'rgba(16, 185, 129, 0.08)', border: '#10b981' }
  ];

  // Update room when user moves
  useEffect(() => {
    const foundRoom = rooms.find(
      (r) => userPos.x >= r.x && userPos.x <= r.x + r.w && userPos.y >= r.y && userPos.y <= r.y + r.h
    );
    if (foundRoom) {
      setCurrentRoom(foundRoom.name);
    } else {
      setCurrentRoom('Hallway');
    }

    // Check proximity to any teammate (95px distance)
    let closest = null;
    teammates.forEach((t) => {
      const dist = Math.hypot(t.x - userPos.x, t.y - userPos.y);
      if (dist < 95) {
        closest = t;
      }
    });
    setProximityConnected(closest);
  }, [userPos]);

  // Keyboard navigation (Arrow keys / WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 15;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        setUserPos((prev) => ({ ...prev, y: Math.max(30, prev.y - step) }));
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        setUserPos((prev) => ({ ...prev, y: Math.min(430, prev.y + step) }));
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        setUserPos((prev) => ({ ...prev, x: Math.max(30, prev.x - step) }));
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        setUserPos((prev) => ({ ...prev, x: Math.min(950, prev.x + step) }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Floor click to move
  const handleFloorClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setUserPos({ x: Math.max(30, Math.min(950, x)), y: Math.max(30, Math.min(430, y)) });
  };

  // Reactions
  const triggerReaction = (emoji) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 2500);
  };

  // AI Agent Message Sender
  const sendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { sender: 'You', text: aiInput, time: 'Just now' };
    setAiMessages((prev) => [...prev, userMsg]);
    const query = aiInput;
    setAiInput('');
    setAiTyping(true);

    setTimeout(() => {
      setAiTyping(false);
      let replyText = "I've indexed your request in the spatial context. Everything is running smoothly across all services!";
      if (query.toLowerCase().includes('pr') || query.toLowerCase().includes('pull request')) {
        replyText = "PR #342 ('Spatial audio optimization') passed all CI tests and is waiting for your review. PR #345 had a minor lint warning in AuthModal.";
      } else if (query.toLowerCase().includes('sprint') || query.toLowerCase().includes('status')) {
        replyText = "Sprint progress is at 88%. 14 tasks closed this week, with 2 in QA testing. Next milestone is scheduled for Friday.";
      } else if (query.toLowerCase().includes('who') || query.toLowerCase().includes('team')) {
        replyText = "Currently, Sarah Chen is active in the Engineering Lab, Alex is in the Boardroom, Elena is in Focus Pod A, and Marcus is in the Cafe.";
      }
      setAiMessages((prev) => [...prev, { sender: 'DevBot', text: replyText, time: 'Just now' }]);
    }, 900);
  };

  // Room Chat Message Sender
  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'You', text: chatInput, time: 'Just now' }]);
    setChatInput('');
  };

  // Whiteboard drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="Platform_container">
      {/* 1. Top Navigation Bar */}
      <header className="Platform_topBar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#60c449', display: 'inline-block' }} />
            <strong style={{ fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Spot Virtual HQ</strong>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '4px 12px',
            borderRadius: '2rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#cbd5e1'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
            <span>Room: <strong>{currentRoom}</strong></span>
          </div>

          {proximityConnected && (
            <div style={{
              background: 'rgba(96, 196, 73, 0.2)',
              border: '1px solid #60c449',
              padding: '4px 12px',
              borderRadius: '2rem',
              fontSize: '0.85rem',
              color: '#86efac',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'pulse 1.5s infinite'
            }}>
              <PhoneCall size={14} />
              <span>In Audio Range: <strong>{proximityConnected.name}</strong></span>
            </div>
          )}
        </div>

        {/* Media & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              padding: '8px 14px',
              borderRadius: '2rem',
              background: isMuted ? '#ef4444' : '#334155',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} color="#4ade80" />}
            <span>{isMuted ? 'Muted' : 'Live Mic'}</span>
          </button>

          {/* Video */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={{
              padding: '8px 14px',
              borderRadius: '2rem',
              background: isVideoOn ? '#22c55e' : '#334155',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isVideoOn ? <Video size={16} /> : <VideoOff size={16} />}
            <span>{isVideoOn ? 'Camera On' : 'Camera Off'}</span>
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            style={{
              padding: '8px 14px',
              borderRadius: '2rem',
              background: isScreenSharing ? '#3b82f6' : '#334155',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Monitor size={16} />
            <span>{isScreenSharing ? 'Sharing' : 'Share Screen'}</span>
          </button>

          {/* Headphones */}
          <button
            onClick={() => setIsHeadphonesOn(!isHeadphonesOn)}
            style={{
              padding: '8px 14px',
              borderRadius: '2rem',
              background: '#334155',
              color: isHeadphonesOn ? '#86efac' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isHeadphonesOn ? <Headphones size={16} /> : <VolumeX size={16} />}
            <span>{isHeadphonesOn ? 'Spatial Audio' : 'Do Not Disturb'}</span>
          </button>

          {/* Reactions bar */}
          <div style={{ display: 'flex', gap: '4px', background: '#334155', padding: '4px 8px', borderRadius: '2rem' }}>
            {['👋', '🚀', '❤️', '👏', '☕'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                style={{ fontSize: '1.1rem', cursor: 'pointer', padding: '0 4px', background: 'transparent' }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Exit / Return to Website */}
          <button
            onClick={onExit}
            style={{
              marginLeft: '0.5rem',
              padding: '8px 16px',
              borderRadius: '2rem',
              background: 'transparent',
              border: '1px solid #64748b',
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Exit to Website</span>
          </button>
        </div>
      </header>

      {/* 2. Main Platform Body */}
      <div className="Platform_mainArea">
        {/* Left Drawer / Panel */}
        <aside className={`Platform_sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid #334155', background: '#1e293b' }}>
            <button
              onClick={() => setActiveTab('team')}
              style={{
                flex: 1,
                padding: '12px 6px',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'team' ? '#60c449' : '#94a3b8',
                borderBottom: activeTab === 'team' ? '2px solid #60c449' : 'none'
              }}
            >
              <Users size={16} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Team
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              style={{
                flex: 1,
                padding: '12px 6px',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'ai' ? '#10b981' : '#94a3b8',
                borderBottom: activeTab === 'ai' ? '2px solid #10b981' : 'none'
              }}
            >
              <Bot size={16} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              OpenClaw
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '12px 6px',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'chat' ? '#38bdf8' : '#94a3b8',
                borderBottom: activeTab === 'chat' ? '2px solid #38bdf8' : 'none'
              }}
            >
              <MessageSquare size={16} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('whiteboard')}
              style={{
                flex: 1,
                padding: '12px 6px',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'whiteboard' ? '#ec4899' : '#94a3b8',
                borderBottom: activeTab === 'whiteboard' ? '2px solid #ec4899' : 'none'
              }}
            >
              <Edit3 size={16} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Board
            </button>
          </div>

          {/* Tab Content: Team Directory */}
          {activeTab === 'team' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.75rem' }}>
                Online Teammates (5)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(96, 196, 73, 0.1)',
                  border: '1px solid #60c449'
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#60c449', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                    YOU
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.fullName || 'You'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#86efac' }}>📍 {currentRoom}</div>
                  </div>
                </div>

                {teammates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setUserPos({ x: t.x + 30, y: t.y + 10 })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                      {t.isBot ? '🤖' : t.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {t.name}
                        {t.isSpeaking && <span style={{ color: '#4ade80', fontSize: '0.7rem' }}>🎙️</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.room} &bull; {t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: OpenClaw AI Chat */}
          {activeTab === 'ai' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>DevBot (OpenClaw Agent)</div>
                  <div style={{ fontSize: '0.7rem', color: '#86efac' }}>Autonomous Spatial Copilot</div>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {aiMessages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: m.sender === 'You' ? '#3b82f6' : '#0f172a',
                      border: m.sender === 'You' ? 'none' : '1px solid #334155',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      lineHeight: 1.4
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px' }}>{m.sender}</div>
                    <div>{m.text}</div>
                  </div>
                ))}
                {aiTyping && (
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    DevBot is thinking...
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div style={{ padding: '0 0.75rem', display: 'flex', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {['Status update?', 'Inspect PRs', 'Summarize room'].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setAiInput(prompt); }}
                    style={{
                      background: '#334155',
                      color: '#cbd5e1',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      cursor: 'pointer'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={sendAiMessage} style={{ padding: '0.75rem', borderTop: '1px solid #334155', display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Ask DevBot anything..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0f172a',
                    border: '1px solid #334155',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="submit"
                  style={{ background: '#10b981', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {/* Tab Content: Room Chat */}
          {activeTab === 'chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', background: '#0f172a', borderBottom: '1px solid #334155' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>#{currentRoom.toLowerCase().replace(/\s+/g, '-')}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Public room chat for anyone nearby</div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: m.sender === 'You' ? '#2563eb' : '#0f172a',
                      border: m.sender === 'You' ? 'none' : '1px solid #334155',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px' }}>{m.sender} &bull; {m.time}</div>
                    <div>{m.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendChatMessage} style={{ padding: '0.75rem', borderTop: '1px solid #334155', display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder={`Message #${currentRoom.toLowerCase().replace(/\s+/g, '-')}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0f172a',
                    border: '1px solid #334155',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="submit"
                  style={{ background: '#38bdf8', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {/* Tab Content: Whiteboard */}
          {activeTab === 'whiteboard' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>In-Room Whiteboard</span>
                <button
                  onClick={clearCanvas}
                  style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Clear
                </button>
              </div>

              {/* Color picker */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['#60c449', '#38bdf8', '#f59e0b', '#ec4899', '#ffffff'].map((color) => (
                  <div
                    key={color}
                    onClick={() => setDrawColor(color)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: color,
                      cursor: 'pointer',
                      border: drawColor === color ? '2px solid #fff' : 'none'
                    }}
                  />
                ))}
              </div>

              <canvas
                ref={canvasRef}
                width={280}
                height={340}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  background: '#090d16',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  cursor: 'crosshair',
                  touchAction: 'none'
                }}
              />
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Draw with your mouse or stylus to collaborate in real-time.
              </div>
            </div>
          )}
        </aside>

        {/* 3. Main Interactive Spatial Stage */}
        <main className="Platform_stage">
          <div
            onClick={handleFloorClick}
            style={{
              width: '980px',
              height: '460px',
              background: '#0f172a',
              borderRadius: '1.25rem',
              border: '2px solid #334155',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              cursor: 'crosshair'
            }}
          >
            {/* Rooms Background Grids */}
            {rooms.map((room) => {
              const isCurrent = currentRoom === room.name;
              return (
                <div
                  key={room.name}
                  style={{
                    position: 'absolute',
                    left: room.x,
                    top: room.y,
                    width: room.w,
                    height: room.h,
                    backgroundColor: room.color,
                    border: `1.5px solid ${isCurrent ? '#60c449' : room.border}`,
                    borderRadius: '12px',
                    padding: '8px 12px',
                    pointerEvents: 'none',
                    transition: 'border-color 0.2s ease',
                    boxShadow: isCurrent ? 'inset 0 0 20px rgba(96, 196, 73, 0.15)' : 'none'
                  }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isCurrent ? '#86efac' : '#94a3b8',
                    letterSpacing: '0.05em'
                  }}>
                    {room.name}
                  </div>
                </div>
              );
            })}

            {/* Teammates Avatars */}
            {teammates.map((t) => {
              const inProximity = proximityConnected?.id === t.id;
              return (
                <div
                  key={t.id}
                  style={{
                    position: 'absolute',
                    left: t.x,
                    top: t.y,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  {/* Proximity line to user */}
                  {inProximity && (
                    <svg
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '980px',
                        height: '460px',
                        pointerEvents: 'none',
                        zIndex: 0,
                        transform: `translate(${-t.x}px, ${-t.y}px)`
                      }}
                    >
                      <line
                        x1={t.x}
                        y1={t.y}
                        x2={userPos.x}
                        y2={userPos.y}
                        stroke="#60c449"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  )}

                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: t.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: '#fff',
                      boxShadow: inProximity ? '0 0 16px #60c449' : '0 4px 10px rgba(0,0,0,0.4)',
                      border: inProximity ? '2px solid #86efac' : '2px solid rgba(255,255,255,0.4)'
                    }}
                  >
                    {t.isBot ? '🤖' : t.name[0]}
                  </div>
                  <div style={{
                    marginTop: 4,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    {t.name}
                  </div>
                </div>
              );
            })}

            {/* User Avatar with Glowing Proximity Radius */}
            <div
              style={{
                position: 'absolute',
                left: userPos.x,
                top: userPos.y,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20,
                transition: 'top 0.12s ease-out, left 0.12s ease-out',
                pointerEvents: 'none'
              }}
            >
              {/* Proximity Circle (90px radius) */}
              <div
                style={{
                  position: 'absolute',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(96, 196, 73, 0.4)',
                  background: 'radial-gradient(circle, rgba(96, 196, 73, 0.12) 0%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                  pointerEvents: 'none'
                }}
              />

              {/* Floating Reaction Bubble */}
              {activeReaction && (
                <div style={{
                  position: 'absolute',
                  bottom: '120%',
                  fontSize: '1.75rem',
                  animation: 'floatUp 1.2s ease-out forwards'
                }}>
                  {activeReaction}
                </div>
              )}

              {/* Avatar circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#60c449',
                  border: '3px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: '#ffffff',
                  boxShadow: '0 6px 18px rgba(96, 196, 73, 0.5)'
                }}
              >
                YOU
              </div>
              <div style={{
                marginTop: 4,
                fontSize: '0.72rem',
                fontWeight: 800,
                background: '#166534',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap'
              }}>
                {user?.fullName || 'You (Host)'}
              </div>
            </div>

            {/* Bottom-right floor instructions */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 14,
              fontSize: '0.75rem',
              color: '#94a3b8',
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              pointerEvents: 'none'
            }}>
              Click floor or use <strong>WASD / Arrow Keys</strong> to navigate rooms
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
