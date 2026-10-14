import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Link2, Compass, MapPin, Sparkles } from 'lucide-react';

/**
 * SpotLinkModal: Handles copying the active Spot deep link matching the user's request:
 * https://spotvirtual.com/@sunnkesh-4c24f4f3d747fffc/@office/@conference-b
 * and provides input to teleport to any custom Spot room URL.
 */
export default function SpotLinkModal({
  isOpen,
  onClose,
  currentRoom = 'Conference Room B',
  workspaceSlug = '@sunnkesh-4c24f4f3d747fffc',
  spaceSlug = '@office',
  onTeleportToRoom
}) {
  const [copied, setCopied] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  // Format room slug
  const roomSlug = currentRoom.toLowerCase().includes('conference') ? '@conference-b'
    : currentRoom.toLowerCase().includes('huddle') ? '@huddle'
    : currentRoom.toLowerCase().includes('cafe') ? '@cafe'
    : currentRoom.toLowerCase().includes('desks') ? '@engineering'
    : '@workspace';

  const spotOriginUrl = `https://spotvirtual.com/${workspaceSlug}/${spaceSlug}/${roomSlug}`;
  const deployedShareUrl = `https://spot-virtual.vercel.app/${workspaceSlug}/${spaceSlug}/${roomSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deployedShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleJoinUrl = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    try {
      // Parse any Spot URL
      const clean = inputUrl.trim();
      let targetRoomName = 'Conference Room B';

      if (clean.includes('conference-b') || clean.includes('conference')) {
        targetRoomName = 'Conference Room B';
      } else if (clean.includes('huddle')) {
        targetRoomName = 'Round Table Huddle';
      } else if (clean.includes('cafe') || clean.includes('bar')) {
        targetRoomName = 'Cafe / Bar';
      } else if (clean.includes('desk') || clean.includes('engineering')) {
        targetRoomName = 'Engineering Desks';
      } else if (clean.includes('all-hands') || clean.includes('workspace')) {
        targetRoomName = 'All-Hands Table';
      }

      onTeleportToRoom(targetRoomName);
      onClose();
    } catch (err) {
      setErrorMsg('Please enter a valid Spot URL (e.g. https://spotvirtual.com/@org/@space/@room)');
    }
  };

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
      zIndex: 250,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '580px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
        border: '1px solid #cbd5e1',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #0f172a)',
          color: '#ffffff',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: '#ffffff'
            }}>
              🔗
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Spot Room Link & Gateway</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>Direct Access: Sunn Kesh Digital HQ &bull; {currentRoom}</p>
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

        {/* Body */}
        <div style={{ padding: '24px', background: '#f8fafc' }}>
          {/* Active Room Share Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Share Live Room Link
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '1rem',
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                Instant Access
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f1f5f9',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1'
            }}>
              <code style={{
                flex: 1,
                fontSize: '0.82rem',
                color: '#0284c7',
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {deployedShareUrl}
              </code>

              <button
                onClick={handleCopyLink}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: copied ? '#22c55e' : '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Teammates clicking this link join directly into <strong>{currentRoom}</strong>
              </span>

              <a
                href={spotOriginUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  color: '#0284c7',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>Spot Official Link</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Join / Teleport to Any Spot Link Form */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
              Teleport by Spot URL
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.78rem', color: '#64748b' }}>
              Paste any Spot Virtual URL (e.g. <code>https://spotvirtual.com/@sunnkesh-4c24f4f3d747fffc/@office/@conference-b</code>) to connect directly:
            </p>

            <form onSubmit={handleJoinUrl} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="https://spotvirtual.com/@org/@space/@room"
                value={inputUrl}
                onChange={(e) => { setInputUrl(e.target.value); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Compass size={14} />
                <span>Teleport</span>
              </button>
            </form>

            {errorMsg && (
              <p style={{ color: '#ef4444', fontSize: '0.78rem', margin: '8px 0 0 0' }}>
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <span>Workspace Slug: <strong>{workspaceSlug}</strong></span>
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
