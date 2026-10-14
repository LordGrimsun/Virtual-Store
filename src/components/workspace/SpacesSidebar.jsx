import React, { useState } from 'react';
import {
  Home, MapPin, Wrench, Users, Sparkles, ChevronDown,
  ChevronRight, X, Coffee, Layers, Compass, Smile, Eye
} from 'lucide-react';

/**
 * SpacesSidebar: Collapsible left sidebar matching media_1791967544265.webp
 * Shows the team switcher, spaces hierarchy tree, and real-time team presence grouped by room.
 */
export default function SpacesSidebar({
  isOpen,
  onClose,
  currentRoom,
  onSelectRoom,
  userName = 'Ayush'
}) {
  const [isHqExpanded, setIsHqExpanded] = useState(true);

  if (!isOpen) return null;

  const spaces = [
    {
      id: 'workspace',
      name: 'Workspace 🏠',
      roomName: 'All-Hands Table',
      active: true,
      members: [
        { name: `${userName} (you)`, role: 'Fullstack Lead', isMe: true },
        { name: 'Wes', role: 'Platform Architect', isMe: false },
        { name: 'Stefan', role: 'Audio Engineer', isMe: false },
        { name: 'Phil', role: 'Infrastructure', isMe: false },
        { name: 'Steven', role: 'Frontend Engineer', isMe: false },
        { name: 'Alex 😊', role: 'WebRTC Specialist', isMe: false }
      ]
    },
    {
      id: 'huddle',
      name: 'Round Table Huddle',
      roomName: 'Round Table Huddle',
      active: true,
      members: [
        { name: 'Sarah', role: 'Product Designer', isMe: false },
        { name: 'Andi', role: 'Operations', isMe: false }
      ]
    },
    {
      id: 'cafe',
      name: 'Cafe / Bar ☕',
      roomName: 'Foreground Lounge',
      active: true,
      members: [
        { name: 'Chloe', role: 'Growth & Events', isMe: false }
      ]
    },
    {
      id: 'boardroom',
      name: 'Glass Boardroom',
      roomName: 'Glass Boardroom',
      active: true,
      members: [
        { name: 'DevBot (AI)', role: 'Autonomous Agent', isMe: false }
      ]
    },
    {
      id: 'presentation',
      name: 'Presentation Hall',
      roomName: 'Presentation Hall',
      active: false,
      members: []
    },
    {
      id: 'patio',
      name: 'Front Patio',
      roomName: 'Engineering Desks',
      active: true,
      members: [
        { name: 'Graham', role: 'Security & DevOps', isMe: false }
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: '62px',
      left: 0,
      bottom: 0,
      width: '280px',
      background: '#181f2a',
      color: '#f8fafc',
      zIndex: 80,
      display: 'flex',
      flexDirection: 'row',
      boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 1. Left Vertical Icon Rail (Matching media_1791967544265.webp) */}
      <div style={{
        width: '54px',
        background: '#0f1724',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: '12px'
      }}>
        {/* Spot Team Badge */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#22c55e',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)'
        }}>
          ST
        </div>

        <div style={{ width: '28px', height: '1px', background: '#1e293b' }} />

        <button title="Spaces Home" style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '6px' }}>
          <Home size={18} />
        </button>

        <button title="Office Floorplan" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}>
          <MapPin size={18} />
        </button>

        <button title="Office Customizer" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}>
          <Wrench size={18} />
        </button>

        <div style={{ width: '28px', height: '1px', background: '#1e293b' }} />

        {/* Team Avatar Circles */}
        {['G', 'A', 'K', 'M', 'S'].map((initial, idx) => (
          <div
            key={idx}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#334155',
              color: '#e2e8f0',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {initial}
          </div>
        ))}
      </div>

      {/* 2. Main Spaces Hierarchy Tree */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Header: Team Switcher */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff' }}>Spot Team</span>
            <ChevronDown size={14} color="#94a3b8" />
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Spaces Hierarchy List */}
        <div style={{ padding: '14px 12px', flex: 1 }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.8px', marginBottom: '8px' }}>
            SPACES
          </div>

          {/* HQ Parent Node */}
          <div style={{ marginBottom: '6px' }}>
            <div
              onClick={() => setIsHqExpanded(!isHqExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              {isHqExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <span>HQ</span>
            </div>

            {/* Sub-Rooms */}
            {isHqExpanded && (
              <div style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                {spaces.map((space) => {
                  const isCurrent = currentRoom === space.roomName;
                  return (
                    <div key={space.id} style={{ marginBottom: '4px' }}>
                      <div
                        onClick={() => onSelectRoom(space.roomName)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: isCurrent ? '#0284c7' : 'transparent',
                          color: isCurrent ? '#ffffff' : '#cbd5e1',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: space.active ? '#22c55e' : '#64748b'
                          }} />
                          <span>{space.name}</span>
                        </div>
                        {space.members.length > 0 && (
                          <span style={{
                            fontSize: '10px',
                            background: isCurrent ? 'rgba(255,255,255,0.2)' : '#334155',
                            padding: '1px 6px',
                            borderRadius: '10px',
                            color: '#ffffff'
                          }}>
                            {space.members.length}
                          </span>
                        )}
                      </div>

                      {/* Members Inside this Room */}
                      {space.members.length > 0 && (
                        <div style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '3px' }}>
                          {space.members.map((mem, midx) => (
                            <div
                              key={midx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 6px',
                                fontSize: '0.74rem',
                                color: mem.isMe ? '#4ade80' : '#94a3b8'
                              }}
                            >
                              <span style={{
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: mem.isMe ? '#4ade80' : '#22c55e'
                              }} />
                              <span style={{ fontWeight: mem.isMe ? 700 : 500 }}>{mem.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
