import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Info, Lock } from 'lucide-react';

/**
 * RoomSettingsModal: Exact replica of Spot Virtual room settings modal
 * References:
 * - media_1792295862715.png (Overview Tab: /settings/overview)
 * - media_1792295862717.png (Transcription Tab: /settings/transcription)
 */
export default function RoomSettingsModal({
  isOpen,
  onClose,
  initialTab = 'overview', // 'overview' | 'transcription' | 'advanced'
  roomName = 'Lobby',
  onSave
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentRoomName, setCurrentRoomName] = useState(roomName);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'overview');
      setCurrentRoomName(roomName || 'Lobby');
    }
  }, [isOpen, initialTab, roomName]);

  // Overview Tab state (media_1792295862715.png)
  const [guestAccessMode, setGuestAccessMode] = useState('Inherit from Office — Knock');
  const [requirePassword, setRequirePassword] = useState(false);
  const [spatialAudio, setSpatialAudio] = useState(false);
  const [meetingRoom, setMeetingRoom] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Transcription Tab state (media_1792295862717.png)
  const [autoTranscribe, setAutoTranscribe] = useState(false);
  const [whoCanStop, setWhoCanStop] = useState('Anyone in the conversation');
  const [postRecaps, setPostRecaps] = useState(false);
  const [aiSummaries, setAiSummaries] = useState(true); // ON by default in reference

  // Advanced Tab state
  const [maxParticipants, setMaxParticipants] = useState('50');
  const [defaultMicMuted, setDefaultMicMuted] = useState(true);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/@sunnkesh-4c24f4f3d747fffc/@office/@${(currentRoomName || 'lobby').toLowerCase()}`;
    navigator.clipboard?.writeText?.(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        roomName: currentRoomName,
        guestAccessMode,
        requirePassword,
        spatialAudio,
        meetingRoom,
        autoTranscribe,
        whoCanStop,
        postRecaps,
        aiSummaries
      });
    }
    onClose();
  };

  // Reusable Pill Toggle Switch component matching Spot styling
  const ToggleSwitch = ({ checked, onChange, label, infoTooltip }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '14px 0' }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? '#0091ff' : '#cbd5e1',
          border: 'none',
          padding: '2px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.2s ease',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
          {label}
        </span>
        {infoTooltip && (
          <span title={infoTooltip} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}>
            <Info size={15} color="#0091ff" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '920px',
          maxWidth: '96vw',
          height: '560px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Left Sidebar matching media_1792295862715.png */}
        <div
          style={{
            width: '230px',
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            padding: '28px 16px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header with Door Icon and Uppercase Room Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              paddingLeft: '12px'
            }}
          >
            <span style={{ fontSize: '14px' }}>🚪</span>
            <span>{currentRoomName}</span>
          </div>

          {/* Navigation Menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'transcription', label: 'Transcription' },
              { id: 'advanced', label: 'Advanced' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : '#334155',
                    background: isActive ? '#0091ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '28px 36px',
            overflowY: 'auto',
            position: 'relative'
          }}
        >
          {/* Close 'X' Button at top-right */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            <X size={20} />
          </button>

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: '0 0 24px 0',
                  letterSpacing: '-0.01em'
                }}
              >
                Room Overview
              </h2>

              {/* ROOM NAME field */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}
                >
                  ROOM NAME
                </label>
                <input
                  type="text"
                  value={currentRoomName}
                  onChange={(e) => setCurrentRoomName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '6px',
                    border: '1.5px solid #0091ff',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* GUEST ACCESS Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#64748b',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginBottom: '4px'
                      }}
                    >
                      GUEST ACCESS
                    </label>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                      Allow guests to enter this room by simply going to this room's public URL.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '18px',
                      background: '#0091ff',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {copiedLink ? <Check size={14} /> : null}
                    <span>{copiedLink ? 'Copied' : 'Copy link'}</span>
                  </button>
                </div>

                <div style={{ position: 'relative', marginTop: '12px' }}>
                  <select
                    value={guestAccessMode}
                    onChange={(e) => setGuestAccessMode(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      background: '#ffffff',
                      fontSize: '14px',
                      color: '#0f172a',
                      appearance: 'none',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Inherit from Office — Knock">Inherit from Office — Knock</option>
                    <option value="Open — Anyone with link">Open — Anyone with link</option>
                    <option value="Closed — Members only">Closed — Members only</option>
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#64748b'
                    }}
                  >
                    ▾
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ToggleSwitch
                  checked={requirePassword}
                  onChange={setRequirePassword}
                  label="Require a password for guests"
                />
                <ToggleSwitch
                  checked={spatialAudio}
                  onChange={setSpatialAudio}
                  label="Turn on spatial audio"
                  infoTooltip="Enables 3D positional distance attenuation for audio in this room."
                />
                <ToggleSwitch
                  checked={meetingRoom}
                  onChange={setMeetingRoom}
                  label="Meeting room"
                  infoTooltip="Designate this space as an active conference room with presentation controls."
                />
              </div>

              {/* Save Button */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: '9px 24px',
                    borderRadius: '6px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#15803d')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#16a34a')}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: TRANSCRIPTION ================= */}
          {activeTab === 'transcription' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: '0 0 24px 0',
                  letterSpacing: '-0.01em'
                }}
              >
                Transcription
              </h2>

              {/* Automatically transcribe conversations toggle */}
              <ToggleSwitch
                checked={autoTranscribe}
                onChange={setAutoTranscribe}
                label="Automatically transcribe conversations"
                infoTooltip="When active, speech-to-text will automatically log meeting discussions."
              />

              {/* WHO CAN STOP Section */}
              <div style={{ margin: '14px 0 20px 0' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}
                >
                  WHO CAN STOP
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={whoCanStop}
                    onChange={(e) => setWhoCanStop(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      background: '#ffffff',
                      fontSize: '14px',
                      color: '#0f172a',
                      appearance: 'none',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Anyone in the conversation">Anyone in the conversation</option>
                    <option value="Only hosts and admins">Only hosts and admins</option>
                    <option value="The person who started it">The person who started it</option>
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#64748b'
                    }}
                  >
                    ▾
                  </div>
                </div>
              </div>

              {/* Post recaps toggle */}
              <ToggleSwitch
                checked={postRecaps}
                onChange={setPostRecaps}
                label="Post recaps to room chat"
                infoTooltip="Publishes summary text to the room chat channel upon call conclusion."
              />

              {/* AI summaries & action items toggle (ON by default) */}
              <ToggleSwitch
                checked={aiSummaries}
                onChange={setAiSummaries}
                label="AI summaries & action items"
              />

              {/* Privacy Notice Box matching media_1792295862717.png */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#64748b',
                  margin: '18px 0 20px 0'
                }}
              >
                <Lock size={15} color="#94a3b8" />
                <span>
                  Transcription runs on each participant's device. Audio is never uploaded — only text, attributed by speaker.
                </span>
              </div>

              {/* Save Button */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: '9px 24px',
                    borderRadius: '6px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#15803d')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#16a34a')}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 3: ADVANCED ================= */}
          {activeTab === 'advanced' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: '0 0 24px 0',
                  letterSpacing: '-0.01em'
                }}
              >
                Advanced Settings
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}
                >
                  ROOM CAPACITY
                </label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  style={{
                    width: '120px',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
              </div>

              <ToggleSwitch
                checked={defaultMicMuted}
                onChange={setDefaultMicMuted}
                label="Mute microphones when entering this room"
              />

              {/* Save Button */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: '9px 24px',
                    borderRadius: '6px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#15803d')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#16a34a')}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
