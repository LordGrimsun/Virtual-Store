import React, { useState, useRef } from 'react';
import {
  Monitor, Video, Image, Globe, Users, Disc, FileText,
  BarChart3, Play, Calendar, Clock, LayoutGrid, X, Check,
  ExternalLink, Sparkles, AlertCircle, RefreshCw, Upload
} from 'lucide-react';

/**
 * ScreenDisplayManager: Renders the 12-icon floating display toolbar matching media_1791967521142.png
 * and provides full interactive controls to display authentic content (local image upload, real YouTube,
 * live WebRTC screen share, camera stream, countdown timers, and markdown notes) on any office screen.
 */
export default function ScreenDisplayManager({
  activeScreen,
  screenPos,
  onClose,
  onUpdateScreenContent,
  onStartScreenShare
}) {
  const [selectedTool, setSelectedTool] = useState(null); // 'youtube', 'image', 'webpage', 'timer', 'document'
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [docContent, setDocContent] = useState('# Sprint 42 - Architectural Standup\n- Review Spot 3D virtual office rebuild\n- OpenClaw gateway v0.2.0 testing\n- P2P spatial audio verification');
  const fileInputRef = useRef(null);

  // The 12 Canonical Spot Screen Toolbar Icons (Exact order from media_1791993853484.png)
  const screenTools = [
    { id: 'screenshare', label: 'Share Screen', icon: Monitor, color: '#38bdf8' },
    { id: 'webcam', label: 'Camera Stream', icon: Video, color: '#10b981' },
    { id: 'image', label: 'Image Slide', icon: Image, color: '#f59e0b' },
    { id: 'webpage', label: 'Web Page / Embed', icon: Globe, color: '#6366f1' },
    { id: 'meeting', label: 'Presentation Stage', icon: Users, color: '#ec4899' },
    { id: 'starry-logo', label: 'Spot Starry Galaxy (Default)', icon: Disc, color: '#22c55e' },
    { id: 'document', label: 'Meeting Document / Notes', icon: FileText, color: '#8b5cf6' },
    { id: 'kpi', label: 'KPI Dashboard & Telemetry', icon: BarChart3, color: '#06b6d4' },
    { id: 'youtube', label: 'YouTube Video', icon: Play, color: '#ef4444' },
    { id: 'calendar', label: 'Team Calendar', icon: Calendar, color: '#f97316' },
    { id: 'timer', label: 'Countdown Timer', icon: Clock, color: '#eab308' },
    { id: 'widgets', label: 'Widgets & Whiteboard', icon: LayoutGrid, color: '#14b8a6' }
  ];

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);

    if (toolId === 'screenshare') {
      if (onStartScreenShare) {
        onStartScreenShare(activeScreen);
      } else if (onUpdateScreenContent) {
        onUpdateScreenContent(activeScreen, 'screenshare', {});
      }
      onClose();
    } else if (toolId === 'starry-logo') {
      onUpdateScreenContent(activeScreen, 'starry-logo', {});
      onClose();
    } else if (toolId === 'kpi') {
      onUpdateScreenContent(activeScreen, 'kpi', {});
      onClose();
    } else if (toolId === 'webcam') {
      onUpdateScreenContent(activeScreen, 'webcam', {});
      onClose();
    } else if (toolId === 'meeting') {
      onUpdateScreenContent(activeScreen, 'meeting', {});
      onClose();
    } else if (toolId === 'calendar') {
      onUpdateScreenContent(activeScreen, 'calendar', {});
      onClose();
    } else if (toolId === 'widgets') {
      onUpdateScreenContent(activeScreen, 'widgets', {});
      onClose();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImageUrl(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyContent = () => {
    if (selectedTool === 'youtube') {
      if (!youtubeUrl.trim()) return;
      onUpdateScreenContent(activeScreen, 'youtube', { url: youtubeUrl.trim() });
    } else if (selectedTool === 'image') {
      if (!imageUrl) return;
      onUpdateScreenContent(activeScreen, 'image', { url: imageUrl });
    } else if (selectedTool === 'webpage') {
      if (!webUrl.trim()) return;
      onUpdateScreenContent(activeScreen, 'webpage', { url: webUrl.trim() });
    } else if (selectedTool === 'timer') {
      onUpdateScreenContent(activeScreen, 'timer', { minutes: timerMinutes });
    } else if (selectedTool === 'document') {
      onUpdateScreenContent(activeScreen, 'document', { text: docContent });
    }
    onClose();
  };

  const isApplyDisabled =
    (selectedTool === 'image' && !imageUrl) ||
    (selectedTool === 'youtube' && !youtubeUrl.trim()) ||
    (selectedTool === 'webpage' && !webUrl.trim());

  return (
    <div style={{
      position: 'absolute',
      top: screenPos ? `${Math.max(50, screenPos.y - 10)}px` : '78px',
      left: screenPos ? `${screenPos.x}px` : '50%',
      transform: screenPos ? 'translate(-50%, -100%)' : 'translateX(-50%)',
      zIndex: 120,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      animation: 'fadeIn 0.15s ease-out',
      pointerEvents: 'auto',
      transition: 'left 0.05s linear, top 0.05s linear'
    }}>
      {/* 1. The 12-Icon Floating Toolbar (Exact Match to media_1791993853484.png) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '3px 6px',
        boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        position: 'relative'
      }}>
        {screenTools.map((tool) => {
          const IconComp = tool.icon;
          const isSelected = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              title={tool.label}
              style={{
                background: isSelected ? '#f1f5f9' : 'transparent',
                color: isSelected ? '#0f172a' : '#374151',
                border: isSelected ? '1px solid #cbd5e1' : '1px solid transparent',
                borderRadius: '4px',
                padding: '5px 7px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'transparent';
              }}
            >
              <IconComp size={16} color={tool.id === 'starry-logo' ? '#22c55e' : (tool.id === 'youtube' ? '#ef4444' : '#374151')} />
            </button>
          );
        })}

        <div style={{ width: '1px', height: '18px', background: '#e5e7eb', margin: '0 2px' }} />

        <button
          onClick={onClose}
          title="Close Toolbar"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '3px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <X size={14} />
        </button>

        {/* Downward Pointer Arrow touching the top center of the screen frame */}
        <div style={{
          position: 'absolute',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '10px',
          height: '10px',
          background: '#ffffff',
          borderRight: '1px solid #d1d5db',
          borderBottom: '1px solid #d1d5db'
        }} />
      </div>

      {/* 2. Interactive Content Selection Modal */}
      {selectedTool && !['screenshare', 'starry-logo', 'kpi', 'webcam', 'meeting', 'calendar', 'widgets'].includes(selectedTool) && (
        <div style={{
          marginTop: '16px',
          width: '450px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden'
        }}>
          {/* Modal Header */}
          <div style={{
            background: '#0f172a',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff'
          }}>
            <strong style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#38bdf8" />
              Display on {activeScreen?.replace('screen_', '').replace('_', ' ').toUpperCase() || 'Screen'}
            </strong>
            <button onClick={() => setSelectedTool(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '1.25rem' }}>
            {/* YouTube Embed */}
            {selectedTool === 'youtube' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  YouTube Video Link or URL
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginBottom: '10px' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '1rem' }}>
                  Paste any YouTube URL to project the official video thumbnail and stream directly onto this 3D display.
                </span>
              </div>
            )}

            {/* Custom Image with Real File Upload */}
            {selectedTool === 'image' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Upload Image from Device or Enter URL
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '8px',
                    border: '1.5px dashed #3b82f6',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
                >
                  <Upload size={16} />
                  <span>Choose Image File from Computer</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>OR PASTE IMAGE URL</span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                </div>

                <input
                  type="text"
                  placeholder="https://example.com/slide.png"
                  value={imageUrl.startsWith('data:') ? `[Local File: ${fileName || 'Selected Image'}]` : imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setFileName('');
                  }}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginBottom: '10px' }}
                />

                {imageUrl && (
                  <div style={{ marginBottom: '12px', position: 'relative', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#0f172a' }}>
                    <img
                      src={imageUrl}
                      alt="Screen Preview"
                      style={{ width: '100%', height: '130px', objectFit: 'contain' }}
                    />
                    <div style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>
                      Ready to project to 3D screen
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setFileName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      title="Clear image"
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Web Page / URL */}
            {selectedTool === 'webpage' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Web Page or App URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com or Figma/Miro link"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginBottom: '10px' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '1rem' }}>
                  Embed interactive web apps and live dashboards directly on the 3D surface.
                </span>
              </div>
            )}

            {/* Presentation Countdown Timer */}
            {selectedTool === 'timer' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Presentation Countdown Timer (Minutes)
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                  {[1, 5, 10, 15, 25, 45].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimerMinutes(mins)}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        border: timerMinutes === mins ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        background: timerMinutes === mins ? '#e0f2fe' : '#f8fafc',
                        color: timerMinutes === mins ? '#0369a1' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '1rem' }}>
                  Starts an active live ticking countdown clock that counts down every second in real time on this 3D wall display.
                </span>
              </div>
            )}

            {/* Collaborative Document */}
            {selectedTool === 'document' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Collaborative Markdown Document
                </label>
                <textarea
                  rows={5}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '1rem' }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setSelectedTool(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyContent}
                disabled={isApplyDisabled}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  background: isApplyDisabled ? '#94a3b8' : '#0284c7',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: isApplyDisabled ? 'not-allowed' : 'pointer'
                }}
              >
                Display on Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
