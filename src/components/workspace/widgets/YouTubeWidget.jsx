import React, { useState } from 'react';
import { X, Play, Youtube, ExternalLink, Sparkles } from 'lucide-react';

export default function YouTubeWidget({ isOpen, onClose }) {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk'); // lofi hip hop radio
  const [embedId, setEmbedId] = useState('jfKfPfyJRdk');
  const [inputUrl, setInputUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk');

  if (!isOpen) return null;

  const presets = [
    { title: '☕ Lofi Study Beats', id: 'jfKfPfyJRdk', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { title: '🌊 Relaxing Ocean Wave Ambient', id: 'bn9F19Hi1Lk', url: 'https://www.youtube.com/watch?v=bn9F19Hi1Lk' },
    { title: '💻 Synthwave Chill Radio', id: '4xDzrJKXOOY', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' },
    { title: '🚀 Future of Remote Work & 3D Web', id: 'kJQP7kiw5Fk', url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk' }
  ];

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleLoadVideo = (e) => {
    e?.preventDefault();
    const id = extractYouTubeId(inputUrl);
    if (id) {
      setEmbedId(id);
      setVideoUrl(inputUrl);
    } else {
      alert('Please enter a valid YouTube video link');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '840px',
      maxWidth: '92vw',
      background: '#0f172a',
      borderRadius: '16px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
      border: '1px solid #334155',
      zIndex: 1300,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        background: '#1e293b',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Youtube size={20} color="#ef4444" />
          <span style={{ fontSize: '14px', fontWeight: 700 }}>Synchronized YouTube Player</span>
          <span style={{
            fontSize: '11px',
            background: '#ef4444',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 800
          }}>
            LIVE ROOM SYNC
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* URL Input Bar */}
      <form onSubmit={handleLoadVideo} style={{
        background: '#0f172a',
        padding: '8px 16px',
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #1e293b'
      }}>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste YouTube video link..."
          style={{
            flex: 1,
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '6px 12px',
            color: '#ffffff',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Play Video
        </button>
      </form>

      {/* Video Viewport */}
      <div style={{ position: 'relative', width: '100%', height: '440px', background: '#000000' }}>
        <iframe
          src={`https://www.youtube.com/embed/${embedId}?autoplay=1&enablejsapi=1`}
          title="YouTube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>

      {/* Quick Presets Bar */}
      <div style={{
        background: '#1e293b',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Quick Channels:</span>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setEmbedId(p.id);
              setInputUrl(p.url);
              setVideoUrl(p.url);
            }}
            style={{
              background: embedId === p.id ? '#334155' : '#0f172a',
              border: embedId === p.id ? '1px solid #ef4444' : '1px solid #334155',
              borderRadius: '20px',
              color: '#f8fafc',
              fontSize: '11px',
              padding: '4px 10px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
