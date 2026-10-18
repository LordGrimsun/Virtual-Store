import React, { useState } from 'react';
import { X, MapPin, Navigation, Eye, Users, Compass, Maximize2 } from 'lucide-react';

/**
 * CampusMapModal: High-resolution interactive floorplan & campus navigation map.
 * Displays all zones across the 116m x 92m Spot Virtual mega-campus.
 * Users can click anywhere to navigate, view live teammate locations, and jump to rooms.
 */
export default function CampusMapModal({
  isOpen,
  onClose,
  currentRoom = 'Boardroom',
  onTeleport,
  playerCoord = { x: 0, z: 0 },
  teammates = [],
  isTopDownBlueprint = false,
  onToggleTopDownBlueprint
}) {
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  // Mega-campus dimensions (world coordinate bounds)
  const WORLD_WIDTH = 116; // X from -58 to +58
  const WORLD_DEPTH = 92;  // Z from -46 to +46

  // Coordinate mapping helper: World coordinates (X, Z) -> Floorplan percentage (left%, top%)
  const toMapCoord = (x, z) => {
    const left = ((x / WORLD_WIDTH) + 0.5) * 100;
    const top = ((z / WORLD_DEPTH) + 0.5) * 100;
    return {
      left: `${Math.max(2, Math.min(98, left))}%`,
      top: `${Math.max(2, Math.min(98, top))}%`
    };
  };

  // Mega-Campus Zone Definitions with accurate room coordinates & teleport targets
  const campusZones = [
    {
      id: 'executive-cabins',
      name: 'Executive Cabins & CEO Suite',
      badge: '👔',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: '#60a5fa',
      x1: -58, z1: -46, x2: -34, z2: -12,
      target: { x: -44, z: -20, name: 'Executive Cabins' },
      description: 'CEO Penthouse, VP Suite, & Director Offices with 4K wall screens'
    },
    {
      id: 'boardroom',
      name: 'Executive Boardroom',
      badge: '📊',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.15)',
      border: '#818cf8',
      x1: -42, z1: -32, x2: -34, z2: -24,
      target: { x: -38, z: -28, name: 'Boardroom' },
      description: '14-seat executive boardroom with 85-inch 4K keynote display'
    },
    {
      id: 'breakout-suite-1',
      name: 'Collaborative Suite 1',
      badge: '💡',
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.14)',
      border: '#22d3ee',
      x1: -26, z1: 8, x2: -14, z2: 14,
      target: { x: -20, z: 11, name: 'Collaborative Suite 1' },
      description: 'Executive conference table & 4K presentation display'
    },
    {
      id: 'breakout-suite-2',
      name: 'Collaborative Suite 2',
      badge: '🛋️',
      color: '#14b8a6',
      bg: 'rgba(20, 184, 166, 0.14)',
      border: '#2dd4bf',
      x1: -26, z1: 14, x2: -14, z2: 20,
      target: { x: -20, z: 17, name: 'Collaborative Suite 2' },
      description: 'Luxury curved bouclé lounge sofa & creative presentation screen'
    },
    {
      id: 'grand-atrium',
      name: 'Grand Central Atrium & Lobby',
      badge: '🏢',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.12)',
      border: '#a78bfa',
      x1: -14, z1: -6, x2: 6, z2: 14,
      target: { x: -4, z: 4, name: 'Lobby' },
      description: 'Reception desk, social tea table, and central corridor hub'
    },
    {
      id: 'auditorium',
      name: 'Auditorium & Keynote Theater',
      badge: '🎭',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.14)',
      border: '#fbbf24',
      x1: 6, z1: -20, x2: 34, z2: 6,
      target: { x: 20, z: -6, name: 'Auditorium' },
      description: '50-seat stadium seating with giant telecast keynote screen'
    },
    {
      id: 'east-promenade',
      name: 'East Promenade Workstations',
      badge: '💻',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: '#34d399',
      x1: 20, z1: 10, x2: 34, z2: 36,
      target: { x: 27, z: 23, name: 'Workspace A' },
      description: 'Window-facing ergonomic workstations & collaborative pods'
    },
    {
      id: 'fitness-gym',
      name: 'Fitness & Gym Center',
      badge: '🏋️',
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.14)',
      border: '#fb7185',
      x1: -60, z1: 20, x2: -24, z2: 46,
      target: { x: -42, z: 32, name: 'Fitness Gym' },
      description: 'Treadmills, spin bikes, bench press, & 75-inch workout TV'
    },
    {
      id: 'arcade-zone',
      name: 'Retro Arcade & Gaming Zone',
      badge: '🕹️',
      color: '#d946ef',
      bg: 'rgba(217, 70, 239, 0.14)',
      border: '#e879f9',
      x1: -24, z1: 20, x2: 6, z2: 46,
      target: { x: -9, z: 33, name: 'Arcade Zone' },
      description: 'Arcade cabinets, 8-ball billiards, & tournament ping pong'
    },
    {
      id: 'swimming-pool',
      name: 'Swimming Pool & Sun Deck',
      badge: '🏊',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.16)',
      border: '#38bdf8',
      x1: 6, z1: 20, x2: 34, z2: 46,
      target: { x: 20, z: 33, name: 'Swimming Pool' },
      description: 'Illuminated pool deck, sun loungers, & swimming lane'
    },
    {
      id: 'chess-terrace',
      name: 'Outdoor Chess Terrace & Park',
      badge: '♟️',
      color: '#84cc16',
      bg: 'rgba(132, 204, 22, 0.12)',
      border: '#a3e635',
      x1: -24, z1: -46, x2: 6, z2: -24,
      target: { x: -9, z: -35, name: 'Chess Terrace' },
      description: 'Giant outdoor chessboard, manicured boxwood hedges & park benches'
    },
    {
      id: 'market-hall',
      name: 'Grand Event Market & Bazaar Hall',
      badge: '🛍️',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.15)',
      border: '#fb923c',
      x1: 32, z1: -46, x2: 58, z2: 8,
      target: { x: 45, z: -20, name: 'Grand Market Hall' },
      description: '8 artisan market stalls: electronics, groceries, bakery, boba cafe, swag, books & gathering plaza'
    }
  ];

  // Quick jump teleport rooms list
  const quickRooms = [
    { name: 'Lobby', badge: '🏢', x: -4, z: 4 },
    { name: 'Auditorium', badge: '🎭', x: 20, z: -6 },
    { name: 'Grand Market Hall', badge: '🛍️', x: 45, z: -20 },
    { name: 'Boardroom', badge: '📊', x: -38, z: -28 },
    { name: 'Collaborative Suite 1', badge: '💡', x: -20, z: 11 },
    { name: 'Collaborative Suite 2', badge: '🛋️', x: -20, z: 17 },
    { name: 'Fitness Gym', badge: '🏋️', x: -42, z: 32 },
    { name: 'Arcade Zone', badge: '🕹️', x: -9, z: 33 },
    { name: 'Swimming Pool', badge: '🏊', x: 20, z: 33 },
    { name: 'Chess Terrace', badge: '♟️', x: -9, z: -35 }
  ];

  // Filtered zones based on search query
  const filteredZones = campusZones.filter((z) =>
    z.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    z.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Handle map click: translate click position to 3D world coordinates
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickXPercent = (e.clientX - rect.left) / rect.width;
    const clickYPercent = (e.clientY - rect.top) / rect.height;

    // Convert to 3D space
    const targetX = (clickXPercent - 0.5) * WORLD_WIDTH;
    const targetZ = (clickYPercent - 0.5) * WORLD_DEPTH;

    // Find if clicked inside a specific zone
    const hitZone = campusZones.find(
      (z) => targetX >= z.x1 && targetX <= z.x2 && targetZ >= z.z1 && targetZ <= z.z2
    );

    const roomName = hitZone ? hitZone.target.name : 'Office Floor';
    onTeleport?.(roomName, targetX, targetZ);
  };

  const playerPos = toMapCoord(playerCoord.x, playerCoord.z);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '1000px',
          maxWidth: '96vw',
          maxHeight: '94vh',
          background: '#0f172a',
          borderRadius: '16px',
          border: '1px solid #334155',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
            }}>
              <Navigation size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
                  Spot Virtual Campus Floorplan & Navigation
                </h2>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  ● 11 ONLINE
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Click anywhere on the map to walk or teleport directly. Press <kbd style={{ background: '#334155', padding: '1px 5px', borderRadius: '4px', color: '#e2e8f0', fontSize: '10px' }}>M</kbd> anytime to toggle map.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 3D Top-Down Aerial View Toggle */}
            <button
              onClick={onToggleTopDownBlueprint}
              title={isTopDownBlueprint ? 'Switch back to 3D Perspective View' : 'Switch 3D Viewport to Aerial Bird’s-Eye Blueprint'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                background: isTopDownBlueprint ? '#0284c7' : '#334155',
                color: '#ffffff',
                border: '1px solid #475569',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Eye size={14} />
              <span>{isTopDownBlueprint ? '3D Viewport Active' : '3D Aerial View'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: '#334155',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#475569')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#334155')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Main Body: Interactive Map Canvas */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
          {/* Floorplan Graphical Board */}
          <div
            onClick={handleMapClick}
            style={{
              position: 'relative',
              width: '100%',
              height: '460px',
              background: '#0b1120',
              borderRadius: '12px',
              border: '2px solid #1e293b',
              overflow: 'hidden',
              cursor: 'crosshair',
              boxShadow: 'inset 0 2px 20px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Subtle Grid Matrix Background */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.8,
              pointerEvents: 'none'
            }} />

            {/* Render Campus Architectural Zones */}
            {campusZones.map((zone) => {
              const leftPercent = ((zone.x1 / WORLD_WIDTH) + 0.5) * 100;
              const rightPercent = ((zone.x2 / WORLD_WIDTH) + 0.5) * 100;
              const topPercent = ((zone.z1 / WORLD_DEPTH) + 0.5) * 100;
              const bottomPercent = ((zone.z2 / WORLD_DEPTH) + 0.5) * 100;

              const width = rightPercent - leftPercent;
              const height = bottomPercent - topPercent;
              const isHovered = hoveredRoom === zone.id;
              const isCurrent = currentRoom.toLowerCase().includes(zone.target.name.toLowerCase()) ||
                                zone.target.name.toLowerCase().includes(currentRoom.toLowerCase());

              return (
                <div
                  key={zone.id}
                  onMouseEnter={() => setHoveredRoom(zone.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTeleport?.(zone.target.name, zone.target.x, zone.target.z);
                  }}
                  title={`${zone.name} - Click to Teleport`}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                    background: isHovered ? zone.color + '33' : (isCurrent ? zone.color + '26' : zone.bg),
                    border: isCurrent ? `2px solid ${zone.color}` : `1px dashed ${zone.border}`,
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                    padding: '6px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: isHovered ? `0 0 16px ${zone.color}40` : (isCurrent ? `0 0 12px ${zone.color}30` : 'none')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13px' }}>{zone.badge}</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isHovered || isCurrent ? '#f8fafc' : zone.color,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {zone.name}
                      </span>
                    </div>
                    {isCurrent && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        background: zone.color,
                        color: '#ffffff',
                        padding: '1px 5px',
                        borderRadius: '4px'
                      }}>
                        YOU ARE HERE
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: '9px',
                    color: '#94a3b8',
                    lineHeight: 1.2,
                    opacity: isHovered ? 1 : 0.8,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {zone.description}
                  </span>
                </div>
              );
            })}

            {/* Teammate Markers */}
            {teammates.filter(t => !t.isPlayer).map((tm, idx) => {
              const tmPos = toMapCoord(tm.x, tm.z);
              return (
                <div
                  key={idx}
                  title={`${tm.name} (${tm.role || 'Teammate'})`}
                  style={{
                    position: 'absolute',
                    left: tmPos.left,
                    top: tmPos.top,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: tm.status === 'ai-agent' ? '#10b981' : '#38bdf8',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}>
                    {tm.name ? tm.name[0] : 'U'}
                  </div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    marginTop: '2px',
                    whiteSpace: 'nowrap'
                  }}>
                    {tm.name?.split(' ')[0]}
                  </span>
                </div>
              );
            })}

            {/* Player Avatar Locator Beacon */}
            <div
              style={{
                position: 'absolute',
                left: playerPos.left,
                top: playerPos.top,
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Outer Pulsing Radar Ring */}
              <div style={{
                position: 'absolute',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.25)',
                border: '2px solid #38bdf8',
                animation: 'pulse 1.8s infinite',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%'
              }} />

              {/* Core Player Dot */}
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#0284c7',
                border: '2.5px solid #ffffff',
                boxShadow: '0 0 12px #38bdf8',
                zIndex: 2
              }} />

              {/* Player Tag */}
              <div style={{
                marginTop: '4px',
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.03em'
              }}>
                YOU ({playerCoord.x.toFixed(1)}m, {playerCoord.z.toFixed(1)}m)
              </div>
            </div>
          </div>

          {/* Quick-Jump Teleport Pills */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={14} color="#38bdf8" />
              <span>QUICK TELEPORT ROOMS</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quickRooms.map((room) => {
                const isActive = currentRoom.toLowerCase().includes(room.name.toLowerCase());
                return (
                  <button
                    key={room.name}
                    onClick={() => onTeleport?.(room.name, room.x, room.z)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: isActive ? '#0284c7' : '#1e293b',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      border: isActive ? '1px solid #38bdf8' : '1px solid #334155',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#334155';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.color = '#cbd5e1';
                      }
                    }}
                  >
                    <span>{room.badge}</span>
                    <span>{room.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
