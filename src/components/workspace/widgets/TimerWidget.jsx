import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Clock, Bell } from 'lucide-react';

export default function TimerWidget({ isOpen, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 mins default Pomodoro
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'standup' | 'custom'

  const timerRef = useRef(null);

  const presets = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    standup: 15 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // Audio fallback
    }
  };

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectPreset = (pKey) => {
    setIsRunning(false);
    setMode(pKey);
    setSecondsLeft(presets[pKey] || 25 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(presets[mode] || 25 * 60);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '120px',
      right: '80px',
      width: '320px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
      border: '1px solid #cbd5e1',
      zIndex: 1300,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: '#0f172a',
        padding: '12px 16px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#38bdf8" />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Team Focus Timer</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        {/* Preset Tabs */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '3px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {[
            { key: 'pomodoro', label: '25m Focus' },
            { key: 'standup', label: '15m Standup' },
            { key: 'shortBreak', label: '5m Break' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleSelectPreset(tab.key)}
              style={{
                flex: 1,
                padding: '6px 0',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                background: mode === tab.key ? '#ffffff' : 'transparent',
                color: mode === tab.key ? '#0f172a' : '#64748b',
                boxShadow: mode === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Big Digital Countdown Display */}
        <div style={{
          fontSize: '52px',
          fontWeight: 800,
          fontFamily: 'monospace',
          color: secondsLeft <= 60 && isRunning ? '#ef4444' : '#0f172a',
          letterSpacing: '-2px',
          marginBottom: '20px'
        }}>
          {formatTime(secondsLeft)}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={handleReset}
            title="Reset Timer"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: isRunning ? '#f59e0b' : '#0284c7',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.4)'
            }}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
          </button>

          <button
            onClick={playChime}
            title="Test Chime Sound"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Bell size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
