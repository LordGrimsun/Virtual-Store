import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, RotateCcw, Globe, Maximize2, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SharedBrowserWidget({ isOpen, onClose }) {
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Virtual_workplace');
  const [inputUrl, setInputUrl] = useState('https://en.wikipedia.org/wiki/Virtual_workplace');
  const [history, setHistory] = useState(['https://en.wikipedia.org/wiki/Virtual_workplace']);
  const [historyIndex, setHistoryIndex] = useState(0);

  if (!isOpen) return null;

  const quickBookmarks = [
    { title: 'Virtual Workplace', url: 'https://en.wikipedia.org/wiki/Virtual_workplace' },
    { title: 'Three.js Docs', url: 'https://threejs.org' },
    { title: 'WebGL Spec', url: 'https://www.khronos.org/webgl/' },
    { title: 'Vite Guide', url: 'https://vitejs.dev' }
  ];

  const handleNavigate = (e) => {
    e?.preventDefault();
    let target = inputUrl.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }
    setUrl(target);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(target);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setUrl(prev);
      setInputUrl(prev);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setUrl(next);
      setInputUrl(next);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '940px',
      maxWidth: '94vw',
      height: '620px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
      border: '1px solid #cbd5e1',
      zIndex: 1300,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Browser Chrome Header */}
      <div style={{
        background: '#f1f5f9',
        borderBottom: '1px solid #cbd5e1',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Navigation buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            style={{
              background: 'transparent',
              border: 'none',
              color: historyIndex === 0 ? '#cbd5e1' : '#475569',
              cursor: historyIndex === 0 ? 'default' : 'pointer',
              padding: '4px'
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            style={{
              background: 'transparent',
              border: 'none',
              color: historyIndex === history.length - 1 ? '#cbd5e1' : '#475569',
              cursor: historyIndex === history.length - 1 ? 'default' : 'pointer',
              padding: '4px'
            }}
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setUrl((u) => u + '')}
            style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px' }}
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Address Bar Form */}
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '6px 12px',
            gap: '8px'
          }}>
            <ShieldCheck size={14} color="#16a34a" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#1e293b'
              }}
              placeholder="Search or enter web address"
            />
          </div>
        </form>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            background: '#dbeafe',
            color: '#1e40af',
            padding: '3px 8px',
            borderRadius: '12px'
          }}>
            Shared with Lobby
          </span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}
            title="Open in external tab"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px'
      }}>
        <Globe size={13} color="#0284c7" />
        {quickBookmarks.map((b) => (
          <button
            key={b.title}
            onClick={() => {
              setUrl(b.url);
              setInputUrl(b.url);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => (e.target.style.background = '#e2e8f0')}
            onMouseOut={(e) => (e.target.style.background = 'transparent')}
          >
            {b.title}
          </button>
        ))}
      </div>

      {/* Browser Viewport */}
      <div style={{ flex: 1, position: 'relative', background: '#ffffff' }}>
        <iframe
          src={url}
          title="Shared Browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
        />
      </div>
    </div>
  );
}
