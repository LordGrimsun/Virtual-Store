import React, { useState } from 'react';
import { X, Trash2, Palette, Pin, Check } from 'lucide-react';

export default function StickyNoteWidget({ isOpen, onClose, defaultColor = 'yellow' }) {
  const [color, setColor] = useState(defaultColor);
  const [content, setContent] = useState('✨ Team Standup Notes:\n- Review Lobby redesign\n- Check swimming pool lighting\n- Test mini-games in Arcade Zone');
  const [isPinned, setIsPinned] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const colorThemes = {
    yellow: { bg: '#fef08a', border: '#facc15', text: '#713f12', header: '#fde047' },
    pink: { bg: '#fbcfe8', border: '#f472b6', text: '#831843', header: '#f9a8d4' },
    cyan: { bg: '#cffafe', border: '#22d3ee', text: '#155e75', header: '#a5f3fc' },
    green: { bg: '#bbf7d0', border: '#4ade80', text: '#14532d', header: '#86efac' }
  };

  const theme = colorThemes[color] || colorThemes.yellow;

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '120px',
      left: '120px',
      width: '280px',
      background: theme.bg,
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
      zIndex: 1200,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: theme.header,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Pin size={15} color={isPinned ? '#2563eb' : '#64748b'} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: theme.text }}>
            STICKY NOTE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Color pickers */}
          {Object.keys(colorThemes).map((cKey) => (
            <button
              key={cKey}
              onClick={() => setColor(cKey)}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: colorThemes[cKey].border,
                border: color === cKey ? '2px solid #0f172a' : '1px solid rgba(0,0,0,0.2)',
                cursor: 'pointer',
                padding: 0
              }}
            />
          ))}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#475569',
              padding: '2px',
              marginLeft: '6px'
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Note Content Area */}
      <div style={{ padding: '12px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: '13px',
            lineHeight: 1.5,
            color: theme.text,
            fontWeight: 500
          }}
          placeholder="Type sticky note here..."
        />
      </div>

      {/* Footer */}
      <div style={{
        padding: '6px 12px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#64748b'
      }}>
        <span>Ayush &bull; Lobby</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setContent('')}
            title="Clear note"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }}
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {savedToast ? 'Saved!' : 'Pin to Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
