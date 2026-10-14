import React, { useState } from 'react';
import {
  X, Headphones, Smile, Settings, User, BookOpen,
  MessageCircle, BarChart2, ShieldCheck, LogOut, Check
} from 'lucide-react';

/**
 * UserProfileDrawer: Exactly recreates the right user profile & status menu from media_1791967544187.webp
 * including custom status input, "Grabbing lunch" preset, Headphones Mode toggle, and settings links.
 */
export default function UserProfileDrawer({
  isOpen,
  onClose,
  userName = 'Ayush',
  userEmail = 'ayush@spotvirtual.com',
  isHeadphonesOn,
  onToggleHeadphones,
  onExit
}) {
  const [customStatus, setCustomStatus] = useState('');
  const [currentStatusPreset, setCurrentStatusPreset] = useState('Grabbing lunch');
  const [statusDuration, setStatusDuration] = useState('1 hour');
  const [feedbackToast, setFeedbackToast] = useState(null);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '62px',
      right: '16px',
      width: '320px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e2e8f0',
      zIndex: 100,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 1. Profile Header */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              {userName[0] || 'A'}
            </div>
            <span style={{
              position: 'absolute',
              bottom: 1,
              right: 1,
              width: 11,
              height: 11,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #ffffff'
            }} />
          </div>

          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              {userName}
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
              Present
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* 2. Set Status Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '10px'
        }}>
          <Smile size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Set your status"
            value={customStatus}
            onChange={(e) => setCustomStatus(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customStatus.trim()) {
                setCurrentStatusPreset(customStatus);
                showToast(`Status updated to: "${customStatus}"`);
              }
            }}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.82rem',
              width: '100%',
              color: '#1e293b'
            }}
          />
        </div>

        {/* 3. Preset Status Chip (e.g. Grabbing Lunch - 1 hour) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: '#f8fafc',
          borderRadius: '6px',
          marginBottom: '14px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
            <span>🍔</span>
            <span style={{ fontWeight: 600 }}>{currentStatusPreset}</span>
            <span style={{ color: '#94a3b8' }}>&mdash; {statusDuration}</span>
          </div>
          <button
            onClick={() => showToast('Status cleared')}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={13} />
          </button>
        </div>

        {/* 4. Headphones Mode Toggle Switch */}
        <div style={{
          padding: '12px',
          background: isHeadphonesOn ? '#f0fdf4' : '#f8fafc',
          borderRadius: '8px',
          border: isHeadphonesOn ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Headphones size={16} color={isHeadphonesOn ? '#16a34a' : '#334155'} />
              <strong style={{ fontSize: '0.85rem', color: isHeadphonesOn ? '#15803d' : '#0f172a' }}>
                Headphones Mode
              </strong>
            </div>

            {/* Toggle switch */}
            <button
              onClick={onToggleHeadphones}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                background: isHeadphonesOn ? '#22c55e' : '#cbd5e1',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              <span style={{
                position: 'absolute',
                top: 2,
                left: isHeadphonesOn ? 18 : 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', lineHeight: 1.3 }}>
            Mute notifications, conversations and other sounds.
          </span>
        </div>

        {/* 5. Navigation & Settings Action Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
          {[
            { label: 'User settings', action: () => showToast('Opening User Settings...') },
            { label: 'Change your avatar', action: () => showToast('Avatar customizer opened!') },
            { label: 'Learn how to use Spot', action: () => showToast('Spot keyboard shortcuts: WASD to walk, Click to sit, Spacebar PTT') },
            { label: 'Give us feedback!', action: () => showToast('Thank you for pairing with us!') },
            { label: 'Media stats', action: () => showToast('Opus 48kHz Stereo &bull; 60 FPS &bull; WebGL Native') }
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                padding: '8px 6px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                color: '#334155',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {item.label}
            </button>
          ))}

          <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />

          <button
            onClick={() => showToast('Superadmin telemetry console active')}
            style={{
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              padding: '8px 6px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              color: '#334155',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Superadmin
          </button>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />

          {/* Sign out */}
          <button
            onClick={onExit}
            style={{
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              padding: '8px 6px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#b91c1c', display: 'block' }}>
              Sign out
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {userEmail}
            </span>
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '8px 12px',
          fontSize: '0.76rem',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {feedbackToast}
        </div>
      )}
    </div>
  );
}
