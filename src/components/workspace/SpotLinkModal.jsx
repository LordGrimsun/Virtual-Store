import React, { useState } from 'react';
import { X, Link2, Check, ChevronDown, ChevronRight, Mail, Sparkles, Send } from 'lucide-react';

/**
 * SpotLinkModal: Exact pixel-accurate implementation of the Spot Virtual invite modal
 * matching media_1792293223270.png:
 * - "Invite people to Sunnkesh"
 * - Pill toggle: "Invite guests" vs "Invite members"
 * - "Guests are automatically removed when they disconnect unless a member role has been assigned."
 * - "INVITE TO" select dropdown
 * - "> Advanced options" accordion
 * - Full-width vibrant green "Copy link" button
 * - "Or send invite via email"
 */
export default function SpotLinkModal({
  isOpen,
  onClose,
  currentRoom = 'Lobby',
  workspaceSlug = '@sunnkesh-4c24f4f3d747fffc',
  spaceSlug = '@office',
  userName = 'Ayush Kesharwani',
  onTeleportToRoom
}) {
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'members'
  const [selectedRoom, setSelectedRoom] = useState(currentRoom || 'Lobby');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [linkExpiration, setLinkExpiration] = useState('never'); // 'never' | '7days' | '30days'
  const [maxUses, setMaxUses] = useState('unlimited');
  const [copied, setCopied] = useState(false);
  const [isEmailInviteOpen, setIsEmailInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailSentToast, setEmailSentToast] = useState(false);

  if (!isOpen) return null;

  // Format room slug matching canonical office rooms
  const cleanRoom = (selectedRoom || currentRoom || 'Lobby').toLowerCase();
  let roomSlug = '@lobby';
  if (cleanRoom.includes('lobby')) roomSlug = '@lobby';
  else if (cleanRoom.includes('boardroom')) roomSlug = '@boardroom';
  else if (cleanRoom.includes('swimming') || cleanRoom.includes('pool')) roomSlug = '@swimming-pool';
  else if (cleanRoom.includes('arcade') || cleanRoom.includes('game')) roomSlug = '@game-zone';
  else if (cleanRoom.includes('gym') || cleanRoom.includes('fitness')) roomSlug = '@gym';
  else if (cleanRoom.includes('cabin') || cleanRoom.includes('executive')) roomSlug = '@executive-cabins';
  else if (cleanRoom.includes('atrium') || cleanRoom.includes('grand')) roomSlug = '@grand-atrium';
  else if (cleanRoom.includes('auditorium')) roomSlug = '@auditorium';
  else if (cleanRoom.includes('conference-b')) roomSlug = '@conference-b';
  else if (cleanRoom.includes('conference-a')) roomSlug = '@conference-a';
  else if (cleanRoom.includes('cubicle-1')) roomSlug = '@cubicle-1';
  else if (cleanRoom.includes('cubicle-2')) roomSlug = '@cubicle-2';
  else if (cleanRoom.includes('workspace')) roomSlug = '@workspace-a';
  else if (cleanRoom.includes('lounge-c')) roomSlug = '@lounge-c';

  const cleanOrg = workspaceSlug.startsWith('@') ? workspaceSlug : `@${workspaceSlug}`;
  const cleanSpace = spaceSlug.startsWith('@') ? spaceSlug : `@${spaceSlug}`;
  const roleQuery = activeTab === 'members' ? '&role=member' : '&role=guest';
  const inviteQuery = `?invitedBy=${encodeURIComponent(userName)}${roleQuery}`;

  const deployedShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#/${cleanOrg}/${cleanSpace}/${roomSlug}${inviteQuery}`
    : `https://spot-virtual.vercel.app/#/${cleanOrg}/${cleanSpace}/${roomSlug}${inviteQuery}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(deployedShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setEmailSentToast(true);
    setTimeout(() => {
      setEmailSentToast(false);
      setInviteEmail('');
      setIsEmailInviteOpen(false);
    }, 2200);
  };

  const availableRooms = [
    { id: 'Lobby', name: 'Lobby' },
    { id: 'Boardroom', name: 'Boardroom' },
    { id: 'Swimming Pool & Sun Deck', name: 'Swimming Pool & Sun Deck' },
    { id: 'Arcade & Game Zone', name: 'Arcade & Game Zone' },
    { id: 'Fitness & Gym Center', name: 'Fitness & Gym Center' },
    { id: 'Executive Cabins', name: 'Executive Cabins' },
    { id: 'Grand Central Atrium', name: 'Grand Central Atrium' },
    { id: 'Auditorium', name: 'Auditorium' },
    { id: 'Conference A', name: 'Conference A' },
    { id: 'Conference B', name: 'Conference B' },
    { id: 'Focus Cubicle 1', name: 'Focus Cubicle 1' },
    { id: 'Focus Cubicle 2', name: 'Focus Cubicle 2' },
    { id: 'Workspace A', name: 'Workspace A' },
    { id: 'Lounge C', name: 'Lounge C' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '520px',
        maxWidth: '92vw',
        boxShadow: '0 25px 65px rgba(0, 0, 0, 0.28)',
        border: '1px solid #e2e8f0',
        padding: '28px 32px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Title matching media_1792293223270.png */}
        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '22px',
          fontWeight: 400,
          color: '#111827',
          lineHeight: 1.3
        }}>
          Invite people to <strong style={{ fontWeight: 800 }}>Sunnkesh</strong>
        </h2>

        {/* Pill Toggle Switch: Invite guests vs Invite members */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <button
            onClick={() => setActiveTab('guests')}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'guests' ? '#ffffff' : 'transparent',
              color: activeTab === 'guests' ? '#111827' : '#64748b',
              fontWeight: activeTab === 'guests' ? 700 : 500,
              fontSize: '14px',
              boxShadow: activeTab === 'guests' ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Invite guests
          </button>
          <button
            onClick={() => setActiveTab('members')}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'members' ? '#ffffff' : 'transparent',
              color: activeTab === 'members' ? '#111827' : '#64748b',
              fontWeight: activeTab === 'members' ? 700 : 500,
              fontSize: '14px',
              boxShadow: activeTab === 'members' ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Invite members
          </button>
        </div>

        {/* Subtext description */}
        <p style={{
          margin: '0 0 20px 0',
          fontSize: '13px',
          lineHeight: 1.5,
          color: '#6b7280'
        }}>
          {activeTab === 'guests'
            ? 'Guests are automatically removed when they disconnect unless a member role has been assigned.'
            : 'Members have persistent workspace permissions, team chat access, and reserved seats across all rooms.'}
        </p>

        {/* Dropdown label */}
        <label style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 800,
          color: '#64748b',
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          INVITE TO
        </label>

        {/* Room select dropdown */}
        <div style={{ position: 'relative', marginBottom: '18px' }}>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '14px',
              color: '#111827',
              appearance: 'none',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {availableRooms.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            color="#6b7280"
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Collapsible Advanced Options */}
        <div style={{ marginBottom: '22px' }}>
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0284c7',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isAdvancedOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            <span>Advanced options</span>
          </button>

          {isAdvancedOpen && (
            <div style={{
              marginTop: '12px',
              padding: '14px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>Link Expiration:</span>
                <select
                  value={linkExpiration}
                  onChange={(e) => setLinkExpiration(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="never">Never expires</option>
                  <option value="7days">7 days</option>
                  <option value="30days">30 days</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>Max Uses:</span>
                <select
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="unlimited">Unlimited</option>
                  <option value="10">10 uses</option>
                  <option value="1">1 use only</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Big Vibrant Green "Copy link" button matching media_1792293223270.png */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '8px',
            border: 'none',
            background: copied ? '#059669' : '#16a34a', // Spot vibrant emerald green
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
            transition: 'background 0.15s ease'
          }}
        >
          {copied ? <Check size={18} /> : <Link2 size={18} />}
          <span>{copied ? 'Link copied to clipboard!' : 'Copy link'}</span>
        </button>

        {/* Or send invite via email link */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {!isEmailInviteOpen ? (
            <button
              onClick={() => setIsEmailInviteOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0284c7',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Or <span style={{ textDecoration: 'underline' }}>send invite via email</span>
            </button>
          ) : (
            <form onSubmit={handleSendEmail} style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {emailSentToast ? 'Sent!' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
