import React, { useState } from 'react';
import {
  Monitor, Video, Image, Globe, Users, Disc, FileText,
  BarChart3, Play, Calendar, Clock, LayoutGrid, X, Check,
  ExternalLink, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';

/**
 * ScreenDisplayManager: Renders the 12-icon floating display toolbar matching media_1791967521142.png
 * and provides full interactive controls to display custom content (YouTube, images, web pages,
 * screen share, starry logo, KPI, timers, and documents) on any office screen.
 */
export default function ScreenDisplayManager({
  activeScreen,
  screenPos,
  onClose,
  onUpdateScreenContent,
  onStartScreenShare
}) {
  const [selectedTool, setSelectedTool] = useState(null); // 'youtube', 'image', 'web', 'timer', etc.
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [docContent, setDocContent] = useState('# Sprint 42 - Architectural Standup\n- Review Spot 3D virtual office rebuild\n- OpenClaw gateway v0.2.0 testing\n- P2P spatial audio verification');

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
      onStartScreenShare();
      onUpdateScreenContent(activeScreen, 'screenshare', {});
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

  const handleApplyContent = () => {
    if (selectedTool === 'youtube') {
      onUpdateScreenContent(activeScreen, 'youtube', { url: youtubeUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    } else if (selectedTool === 'image') {
      onUpdateScreenContent(activeScreen, 'image', { url: imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800' });
    } else if (selectedTool === 'webpage') {
      onUpdateScreenContent(activeScreen, 'webpage', { url: webUrl || 'https://spotvirtual.com' });
    } else if (selectedTool === 'timer') {
      onUpdateScreenContent(activeScreen, 'timer', { minutes: timerMinutes });
    } else if (selectedTool === 'document') {
      onUpdateScreenContent(activeScreen, 'document', { text: docContent });
    }
    onClose();
  };

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

        {/* Downward Pointer Arrow touching the top center of the screen frame (media_1791993853484.png) */}
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
      {selectedTool && selectedTool !== 'screenshare' && selectedTool !== 'starry-logo' && selectedTool !== 'kpi' && (
        <div style={{
          marginTop: '16px',
          width: '440px',
          background: '#ffffff',
          borderRadius: '14px',
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
              Display on {activeScreen?.replace('screen', 'Board ').replace('featBoard', 'Roadmap Board').replace('mobileSchedule', 'Mobile Easel') || 'Screen'}
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
                  YouTube Video URL or Video ID
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
                  {[
                    { label: 'Spot Product Tour', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
                    { label: 'Lofi Coding Music', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setYoutubeUrl(preset.url)}
                      style={{ fontSize: '11px', padding: '5px 8px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Image */}
            {selectedTool === 'image' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Image URL (PNG, JPG, WebP)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
                  {[
                    { label: 'Architecture Blueprint', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800' },
                    { label: 'City Skyline', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setImageUrl(preset.url)}
                      style={{ fontSize: '11px', padding: '5px 8px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
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
                  Embed interactive web apps directly onto the 3D surface for team collaboration.
                </span>
              </div>
            )}

            {/* Presentation Timer */}
            {selectedTool === 'timer' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Presentation Countdown Timer (Minutes)
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                  {[5, 10, 15, 25, 45].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimerMinutes(mins)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        border: timerMinutes === mins ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        background: timerMinutes === mins ? '#e0f2fe' : '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
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
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#0284c7', color: '#fff', border: 'none', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
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
