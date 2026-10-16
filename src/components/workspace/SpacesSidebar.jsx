import React, { useState } from 'react';
import {
  ChevronDown, X, Search, UserPlus, Users, Radio, Globe, Home
} from 'lucide-react';

/**
 * SpacesSidebar: Clean, pixel-accurate left room directory matching Spot Virtual reference screenshots:
 * media_1791969443822.png, media_1791969444037.png, media_1791969444163.png
 * Features the exact 12 rooms, member list, and green + Invite button.
 */
export default function SpacesSidebar({
  isOpen,
  onClose,
  currentSpace = 'office',
  onSelectSpace,
  currentRoom = 'Boardroom',
  onSelectRoom,
  userName = 'Ayush Kesharwani',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
  onOpenInvite
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOfficeMenuOpen, setIsOfficeMenuOpen] = useState(false);

  if (!isOpen) return null;

  const isSerSpace = currentSpace === 'ser-emY' || currentSpace === '@ser-emY' || currentSpace === 'ser';
  const spaceDisplayName = isSerSpace ? 'ser' : 'Office';

  // The 12 canonical rooms for Office space matching Spot Virtual blueprint (media_1791969443822.png)
  const officeRooms = [
    { id: 'auditorium', name: 'Auditorium', badge: '🏠', isHome: true },
    { id: 'boardroom', name: 'Boardroom', badge: null },
    { id: 'chat-a', name: 'Chat A', badge: null },
    { id: 'chat-b', name: 'Chat B', badge: null },
    { id: 'conference-a', name: 'Conference A', badge: null },
    { id: 'conference-b', name: 'Conference B', badge: null },
    { id: 'cubicle-1', name: 'Focus Cubicle 1', badge: '🎧' },
    { id: 'cubicle-2', name: 'Focus Cubicle 2', badge: '🎧' },
    { id: 'lobby', name: 'Lobby', badge: '🌐', isGlobe: true },
    { id: 'lounge-a', name: 'Lounge A', badge: '((•))', isBroadcast: true },
    { id: 'lounge-b', name: 'Lounge B', badge: '((•))', isBroadcast: true },
    { id: 'lounge-c', name: 'Lounge C', badge: '((•))', isBroadcast: true },
    { id: 'patio', name: 'Patio', badge: '((•))', isBroadcast: true },
    { id: 'workspace-a', name: 'Workspace A', badge: null }
  ];

  // The dedicated rooms for ser-emY space reverse-engineered from live spotvirtual.com/@sunnkesh-4c24f4f3d747fffc/@ser-emY/@office-a
  const serRooms = [
    { id: 'office-a', name: 'Office A', badge: '🏠', isHome: true },
    { id: 'focus-pod-1', name: 'Focus Pod 1', badge: null },
    { id: 'focus-pod-2', name: 'Focus Pod 2', badge: null },
    { id: 'team-suite', name: 'Team Suite', badge: '((•))', isBroadcast: true },
    { id: 'terrace', name: 'Terrace Lounge', badge: '🌐', isGlobe: true }
  ];

  const canonicalRooms = isSerSpace ? serRooms : officeRooms;

  // Teammates presence list
  const teammates = isSerSpace
    ? [
        { name: 'Stefan M.', room: 'Office A', role: 'Audio Lead' },
        { name: 'Sarah Chen', room: 'Team Suite', role: 'Design Lead' },
        { name: 'DevBot (AI)', room: 'Focus Pod 1', role: 'Autonomous Agent' }
      ]
    : [
        { name: 'Sarah Chen', room: 'Conference A', role: 'Design Lead' },
        { name: 'Wes Vance', room: 'Workspace A', role: 'Platform Architect' },
        { name: 'Stefan M.', room: 'Lounge B', role: 'Audio Lead' },
        { name: 'DevBot (AI)', room: 'Conference B', role: 'Autonomous Agent' }
      ];

  const filteredRooms = canonicalRooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const normalizeRoomName = (name) => {
    if (!name) return isSerSpace ? 'office-a' : 'boardroom';
    const clean = name.toLowerCase();
    if (clean.includes('office-a') || clean.includes('office a')) return 'office-a';
    if (clean.includes('focus-pod-1') || clean.includes('focus pod 1')) return 'focus-pod-1';
    if (clean.includes('focus-pod-2') || clean.includes('focus pod 2')) return 'focus-pod-2';
    if (clean.includes('team-suite') || clean.includes('team suite')) return 'team-suite';
    if (clean.includes('terrace')) return 'terrace';
    if (clean.includes('auditorium')) return 'auditorium';
    if (clean.includes('boardroom')) return 'boardroom';
    if (clean.includes('chat a')) return 'chat-a';
    if (clean.includes('chat b')) return 'chat-b';
    if (clean.includes('conference a')) return 'conference-a';
    if (clean.includes('conference b')) return 'conference-b';
    if (clean.includes('cubicle 1') || clean.includes('cubicle-1')) return 'cubicle-1';
    if (clean.includes('cubicle 2') || clean.includes('cubicle-2')) return 'cubicle-2';
    if (clean.includes('lobby')) return 'lobby';
    if (clean.includes('lounge a')) return 'lounge-a';
    if (clean.includes('lounge b')) return 'lounge-b';
    if (clean.includes('lounge c')) return 'lounge-c';
    if (clean.includes('patio')) return 'patio';
    if (clean.includes('workspace')) return 'workspace-a';
    return clean.replace(/\s+/g, '-');
  };

  const activeSlug = normalizeRoomName(currentRoom);

  return (
    <aside
      aria-label="Room Directory"
      style={{
        position: 'fixed',
        top: '36px', // Below top purple trial bar
        left: 0,
        bottom: '52px', // Above bottom dock
        width: '242px',
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 12px rgba(0,0,0,0.06)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* 1. Header: Space Dropdown & Close X */}
      <div
        style={{
          height: '52px',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f3f5',
          position: 'relative'
        }}
      >
        <button
          id="space_dropdown_trigger"
          onClick={() => setIsOfficeMenuOpen(!isOfficeMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isOfficeMenuOpen ? '#f3f4f6' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '6px'
          }}
        >
          {/* Green Spot Space Emblem */}
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981'
              }}
            />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
            {spaceDisplayName}
          </span>
          <ChevronDown size={15} color="#6b7280" />
        </button>

        {/* Space Selector Dropdown Menu */}
        {isOfficeMenuOpen && (
          <div
            id="space_dropdown_menu"
            style={{
              position: 'absolute',
              top: '52px',
              left: '10px',
              width: '220px',
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              padding: '6px',
              zIndex: 100
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', padding: '6px 8px 4px', letterSpacing: '0.05em' }}>
              Spaces in Sunnkesh
            </div>

            {/* Space 1: Office */}
            <button
              id="space_option_office"
              onClick={() => {
                setIsOfficeMenuOpen(false);
                if (onSelectSpace) onSelectSpace('office', 'Office');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                background: !isSerSpace ? '#f0fdf4' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: !isSerSpace ? '#10b981' : '#111827' }}>
                  Office
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  12 rooms (@lobby, @boardroom...)
                </div>
              </div>
              {!isSerSpace && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />}
            </button>

            {/* Space 2: ser */}
            <button
              id="space_option_ser"
              onClick={() => {
                setIsOfficeMenuOpen(false);
                if (onSelectSpace) onSelectSpace('ser-emY', 'ser');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                background: isSerSpace ? '#f0fdf4' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                marginTop: '2px'
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: isSerSpace ? '#10b981' : '#111827' }}>
                  ser
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Office A (@office-a, focus pods...)
                </div>
              </div>
              {isSerSpace && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          title="Collapse sidebar"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* 2. Search Input */}
      <div style={{ padding: '12px 14px 8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '7px 10px',
            fontSize: '13px'
          }}
        >
          <Search size={14} color="#9ca3af" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find members"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '13px',
              color: '#1f2937'
            }}
          />
        </div>
      </div>

      {/* 3. Canonical 12 Rooms List matching media_1791969443822.png */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 8px 14px'
        }}
      >
        {filteredRooms.map((room) => {
          const isSelected = activeSlug === room.id;
          const occupants = teammates.filter(
            (t) => normalizeRoomName(t.room) === room.id
          );

          return (
            <div key={room.id} style={{ marginBottom: '2px' }}>
              <button
                onClick={() => onSelectRoom(room.name, room.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: isSelected ? '6px 6px 0 0' : '6px',
                  background: isSelected ? '#0091ff' : 'transparent',
                  color: isSelected ? '#ffffff' : '#374151',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: isSelected ? 600 : 500,
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Spot room icon symbol */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isSelected ? '#ffffff' : '#6b7280'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                  <span>{room.name}</span>
                </div>

                {/* Right Badge icon if any */}
                {room.badge && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: isSelected ? '#ffffff' : '#0284c7',
                      fontWeight: 600
                    }}
                  >
                    {room.badge}
                  </span>
                )}
              </button>

              {/* If active room is selected: show active user (Ayush Kesharwani (you)) */}
              {isSelected && (
                <div
                  style={{
                    background: '#f8fafc',
                    borderLeft: '2px solid #0091ff',
                    padding: '8px 12px 8px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '0 0 6px 6px',
                    marginBottom: '4px'
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={userAvatar}
                      alt="Ayush"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#10b981',
                        border: '1px solid #ffffff'
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '12.5px',
                      color: '#1f2937',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {userName}{' '}
                    <span style={{ color: '#6b7280', fontSize: '11.5px' }}>(you)</span>
                  </span>
                </div>
              )}

              {/* Show any simulated occupants in non-selected rooms */}
              {!isSelected && occupants.length > 0 && (
                <div style={{ paddingLeft: '24px', paddingTop: '2px' }}>
                  {occupants.map((occ, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        padding: '2px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <div
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: '#10b981'
                        }}
                      />
                      <span>{occ.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Green + Invite Button */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid #f1f3f5',
          background: '#ffffff'
        }}
      >
        <button
          onClick={() => {
            if (onOpenInvite) onOpenInvite();
            else {
              navigator.clipboard?.writeText(window.location.href);
              alert('Spot workspace link copied to clipboard!');
            }
          }}
          style={{
            width: '100%',
            height: '40px',
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#10b981')}
        >
          <UserPlus size={16} />
          <span>+ Invite</span>
        </button>
      </div>
    </aside>
  );
}
