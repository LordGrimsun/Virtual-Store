import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Volume2, ChevronRight, ChevronLeft,
  RotateCcw, Check, Loader2, ArrowLeft, Shield
} from 'lucide-react';

/**
 * GuestOnboardingModal: Reverse-engineered 4-step guest join & knock flow from Spot Virtual:
 * Step 1: /visit/guest/:orgSlug/:worldSlug/:spotSlug/join
 * Step 2: /visit/guest/:orgSlug/:worldSlug/:spotSlug/customize-avatar
 * Step 3: /visit/guest/:orgSlug/:worldSlug/:spotSlug/setup-audio-video
 * Step 4: /visit/authed/:orgSlug/:worldSlug/:spotSlug/waiting-room
 */
export default function GuestOnboardingModal({
  isOpen,
  orgName = 'Sunnkesh',
  orgSlug = 'sunnkesh-4c24f4f3d747fffc',
  spaceName = 'Office',
  spaceSlug = 'office',
  roomName = 'Lobby',
  roomSlug = 'lobby',
  onComplete,
  onClose
}) {
  const [step, setStep] = useState('join'); // 'join' | 'customize-avatar' | 'setup-audio-video' | 'waiting-room'
  const [fullName, setFullName] = useState('');
  const [skinToneIndex, setSkinToneIndex] = useState(2);
  const [avatarGender, setAvatarGender] = useState('male');
  const [avatarRotation, setAvatarRotation] = useState(0);

  // AV settings
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [audioInputDevices, setAudioInputDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [isAdmitted, setIsAdmitted] = useState(false);

  const videoPreviewRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Available skin tones matching Spot Virtual palette
  const skinTones = ['#F9D3B4', '#E8B688', '#C68B59', '#8D5524', '#4A3121'];

  useEffect(() => {
    if (!isOpen) return;

    // Discover media devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const audioInputs = devices.filter((d) => d.kind === 'audioinput');
        const audioOutputs = devices.filter((d) => d.kind === 'audiooutput');
        const videos = devices.filter((d) => d.kind === 'videoinput');

        setAudioInputDevices(audioInputs.length ? audioInputs : [{ deviceId: 'default', label: 'Default Microphone' }]);
        setAudioOutputDevices(audioOutputs.length ? audioOutputs : [{ deviceId: 'default', label: 'Default Speakers' }]);
        setVideoDevices(videos.length ? videos : [{ deviceId: 'default', label: 'Default HD Camera' }]);

        if (audioInputs[0]) setSelectedAudioInput(audioInputs[0].deviceId);
        if (audioOutputs[0]) setSelectedAudioOutput(audioOutputs[0].deviceId);
        if (videos[0]) setSelectedVideo(videos[0].deviceId);
      }).catch(() => {
        setAudioInputDevices([{ deviceId: 'default', label: 'Default Microphone' }]);
        setAudioOutputDevices([{ deviceId: 'default', label: 'Default Speakers' }]);
        setVideoDevices([{ deviceId: 'default', label: 'Default HD Camera' }]);
      });
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  // Handle camera preview stream
  useEffect(() => {
    if (step === 'setup-audio-video' && isCameraOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then((stream) => {
            mediaStreamRef.current = stream;
            if (videoPreviewRef.current) {
              videoPreviewRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            setIsCameraOn(false);
          });
      }
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
    }
  }, [step, isCameraOn]);

  // Auto-knock simulation in waiting room
  useEffect(() => {
    if (step === 'waiting-room') {
      const timer = setTimeout(() => {
        setIsAdmitted(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setStep('customize-avatar');
  };

  const handleAvatarContinue = () => {
    setStep('setup-audio-video');
  };

  const handleAudioVideoContinue = () => {
    setStep('waiting-room');
  };

  const handleEnterSpace = () => {
    if (onComplete) {
      onComplete({
        fullName: fullName || 'Guest',
        skinTone: skinTones[skinToneIndex],
        isMicOn,
        isVideoOn: isCameraOn,
        spaceSlug,
        roomSlug
      });
    }
  };

  const testAudioOutput = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* ================= STEP 1: JOIN ================= */}
      {step === 'join' && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            maxHeight: '100vh',
            overflow: 'hidden'
          }}
        >
          {/* Left Hero Graphic Banner */}
          <div
            style={{
              flex: 1.1,
              background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {/* SVG illustrated workspace & avatars matching real_spot_office_lobby.png */}
            <svg
              width="540"
              height="500"
              viewBox="0 0 540 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ zIndex: 1 }}
            >
              {/* Background soft shapes */}
              <circle cx="270" cy="250" r="200" fill="#dbeafe" opacity="0.6" />
              <circle cx="340" cy="180" r="120" fill="#ede9fe" opacity="0.7" />

              {/* Floating Horse Mascot */}
              <g transform="translate(80, 80) scale(0.85)">
                <ellipse cx="60" cy="80" rx="36" ry="24" fill="#a78bfa" />
                <circle cx="90" cy="55" r="20" fill="#a78bfa" />
                <polygon points="100,45 115,25 95,35" fill="#8b5cf6" />
                <polygon points="85,45 75,25 90,38" fill="#8b5cf6" />
                <circle cx="98" cy="52" r="3" fill="#ffffff" />
                <rect x="40" y="95" width="8" height="26" rx="4" fill="#8b5cf6" />
                <rect x="70" y="95" width="8" height="26" rx="4" fill="#8b5cf6" />
                <path d="M 30,75 Q 10,85 20,105" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" />
              </g>

              {/* Central Floating Avatar Girl with glasses */}
              <g transform="translate(240, 140) scale(0.95)">
                <ellipse cx="60" cy="130" rx="28" ry="38" fill="#3b82f6" />
                <circle cx="60" cy="65" r="30" fill="#f9d3b4" />
                <path d="M 30,55 Q 60,15 90,55 Q 85,25 60,20 Q 35,25 30,55" fill="#1e293b" />
                {/* Glasses */}
                <rect x="42" y="58" width="14" height="10" rx="2" stroke="#0f172a" strokeWidth="2.5" fill="none" />
                <rect x="64" y="58" width="14" height="10" rx="2" stroke="#0f172a" strokeWidth="2.5" fill="none" />
                <line x1="56" y1="63" x2="64" y2="63" stroke="#0f172a" strokeWidth="2.5" />
                {/* Coffee mug */}
                <rect x="85" y="120" width="16" height="18" rx="3" fill="#ef4444" />
                <path d="M 101,124 Q 107,129 101,134" stroke="#ef4444" strokeWidth="2.5" fill="none" />
              </g>

              {/* Guy on Beanbag coder with headphones */}
              <g transform="translate(100, 260) scale(0.9)">
                {/* Orange beanbag */}
                <ellipse cx="90" cy="120" rx="65" ry="42" fill="#fb923c" />
                <ellipse cx="80" cy="90" rx="24" ry="32" fill="#22c55e" />
                <circle cx="80" cy="45" r="22" fill="#c68b59" />
                {/* Hair */}
                <path d="M 60,40 Q 80,20 100,38 Z" fill="#451a03" />
                {/* Headphones */}
                <path d="M 58,45 Q 80,18 102,45" stroke="#1f2937" strokeWidth="4" fill="none" />
                <circle cx="58" cy="47" r="5" fill="#1f2937" />
                <circle cx="102" cy="47" r="5" fill="#1f2937" />
                {/* Laptop */}
                <rect x="90" y="80" width="36" height="24" rx="2" fill="#cbd5e1" transform="rotate(-15 90 80)" />
              </g>

              {/* Guy with phone in green chair */}
              <g transform="translate(340, 260) scale(0.9)">
                <ellipse cx="70" cy="115" rx="45" ry="35" fill="#38bdf8" />
                <ellipse cx="65" cy="85" rx="22" ry="30" fill="#a855f7" />
                <circle cx="65" cy="45" r="22" fill="#e8b688" />
                <path d="M 45,40 Q 65,15 85,38 Z" fill="#312e81" />
                {/* Phone */}
                <rect x="42" y="75" width="12" height="20" rx="2" fill="#1e293b" />
              </g>

              {/* Decorative sparkle stars */}
              <g fill="#f59e0b">
                <path d="M 190,70 L 193,78 L 201,81 L 193,84 L 190,92 L 187,84 L 179,81 L 187,78 Z" />
                <path d="M 420,110 L 422,116 L 428,118 L 422,120 L 420,126 L 418,120 L 412,118 L 418,116 Z" />
              </g>
            </svg>
          </div>

          {/* Right Form Card matching Spot Virtual */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px 80px',
              maxWidth: '560px'
            }}
          >
            {/* Spot Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#10b981'
                }}
              />
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                spot
              </span>
            </div>

            {/* Space Title */}
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>
              Visit {spaceName}
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 32px 0', lineHeight: 1.5 }}>
              Continue below to visit <strong style={{ color: '#111827' }}>{orgName}</strong> in the{' '}
              <strong style={{ color: '#111827' }}>{spaceSlug}</strong> space.
            </p>

            {/* Form */}
            <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <input
                  id="spot_field_1"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    height: '52px',
                    padding: '0 16px',
                    fontSize: '15px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Continue button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '52px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#10b981')}
              >
                Continue
              </button>
            </form>

            <div style={{ marginTop: '28px', fontSize: '13px', color: '#9ca3af', lineHeight: 1.6 }}>
              By visiting, you agree to our{' '}
              <a href="https://www.spotvirtual.com/terms-of-service/" target="_blank" rel="noreferrer" style={{ color: '#6b7280', textDecoration: 'underline' }}>
                Terms of Service
              </a>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', fontSize: '14px', color: '#6b7280' }}>
              Already have an account?{' '}
              <a href="#signin" onClick={(e) => { e.preventDefault(); if (onClose) onClose(); }} style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: CUSTOMIZE AVATAR ================= */}
      {step === 'customize-avatar' && (
        <div
          style={{
            width: '100%',
            maxWidth: '540px',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* Spot Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>spot</span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 10px 0' }}>
            Customize your avatar
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 32px 0', maxWidth: '380px' }}>
            Choose an avatar that fits your personality! You can further customize your avatar later.
          </p>

          {/* Avatar Preview Box matching real_spot_after_continue.png */}
          <div
            style={{
              position: 'relative',
              width: '360px',
              height: '340px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px'
            }}
          >
            {/* Left Skin Tone Palette Circles */}
            <div
              style={{
                position: 'absolute',
                left: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 10
              }}
            >
              {skinTones.map((tone, idx) => (
                <button
                  key={idx}
                  onClick={() => setSkinToneIndex(idx)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: tone,
                    border: skinToneIndex === idx ? '3px solid #0091ff' : '2px solid #ffffff',
                    boxShadow: skinToneIndex === idx ? '0 0 0 2px #0091ff' : '0 1px 3px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none',
                    transition: 'transform 0.15s ease'
                  }}
                />
              ))}
            </div>

            {/* Center 3D Avatar Rendering */}
            <div
              style={{
                width: '180px',
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${avatarRotation}deg)`,
                transition: 'transform 0.25s ease'
              }}
            >
              {/* Head & Hair */}
              <div
                style={{
                  width: '64px',
                  height: '72px',
                  borderRadius: '32px 32px 28px 28px',
                  background: skinTones[skinToneIndex],
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {/* Stylized hair */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    right: '-6px',
                    height: '42px',
                    background: '#18181b',
                    borderRadius: '34px 34px 10px 10px'
                  }}
                />
                {/* Eyes */}
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    left: '16px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    right: '16px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981'
                  }}
                />
              </div>

              {/* Upper Body Shirt */}
              <div
                style={{
                  width: '74px',
                  height: '85px',
                  background: avatarGender === 'male' ? '#93c5fd' : '#f472b6',
                  borderRadius: '12px 12px 6px 6px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '8px',
                  position: 'relative',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ width: '2px', height: '100%', background: 'rgba(0,0,0,0.1)' }} />
              </div>

              {/* Pants */}
              <div
                style={{
                  width: '64px',
                  height: '95px',
                  display: 'flex',
                  gap: '6px',
                  marginTop: '-2px'
                }}
              >
                <div style={{ flex: 1, background: '#1e3a8a', borderRadius: '4px 4px 6px 6px' }} />
                <div style={{ flex: 1, background: '#1e3a8a', borderRadius: '4px 4px 6px 6px' }} />
              </div>

              {/* Shoes */}
              <div style={{ width: '68px', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                <div style={{ width: '28px', height: '12px', background: '#e2e8f0', borderRadius: '4px' }} />
                <div style={{ width: '28px', height: '12px', background: '#e2e8f0', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Right Controls (Gender swapper & Rotation arrows) */}
            <div
              style={{
                position: 'absolute',
                right: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 10
              }}
            >
              <button
                onClick={() => setAvatarGender('male')}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: avatarGender === 'male' ? '#f0fdf4' : '#ffffff',
                  border: avatarGender === 'male' ? '2px solid #10b981' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                👨
              </button>

              <button
                onClick={() => setAvatarGender('female')}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: avatarGender === 'female' ? '#f0fdf4' : '#ffffff',
                  border: avatarGender === 'female' ? '2px solid #10b981' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                👩
              </button>

              <button
                onClick={() => setAvatarRotation((r) => (r + 45) % 360)}
                title="Rotate Right"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={18} color="#4b5563" />
              </button>

              <button
                onClick={() => setAvatarRotation((r) => (r - 45 + 360) % 360)}
                title="Rotate Left"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={18} color="#4b5563" />
              </button>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={handleAvatarContinue}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '48px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}
          >
            Continue
          </button>

          {/* Back button */}
          <button
            onClick={() => setStep('join')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0284c7',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      )}

      {/* ================= STEP 3: AUDIO & VIDEO SETUP ================= */}
      {step === 'setup-audio-video' && (
        <div
          style={{
            width: '100%',
            maxWidth: '520px',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* Spot Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>spot</span>
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>
            Audio & video setup
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', maxWidth: '380px' }}>
            Make sure your mic, camera and speakers are setup correctly before joining.
          </p>

          {/* Video Preview Box matching real_spot_step3.png */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '210px',
              borderRadius: '10px',
              background: '#09090b',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
            }}
          >
            {isCameraOn ? (
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#d1d5db', fontSize: '13.5px' }}>
                Your mic and camera are <strong>off</strong>
              </span>
            )}

            {/* Bottom-left Mic and Camera pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                display: 'flex',
                gap: '8px',
                background: 'rgba(0,0,0,0.5)',
                padding: '4px 8px',
                borderRadius: '20px',
                backdropFilter: 'blur(4px)'
              }}
            >
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isMicOn ? '#10b981' : '#374151',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isMicOn ? <Mic size={15} /> : <MicOff size={15} color="#ef4444" />}
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCameraOn ? '#10b981' : '#374151',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isCameraOn ? <Video size={15} /> : <VideoOff size={15} color="#ef4444" />}
              </button>
            </div>
          </div>

          {/* Device Dropdowns matching Spot layout */}
          <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {/* Audio Input (Mic) */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedAudioInput}
                onChange={(e) => setSelectedAudioInput(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px 0 36px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {audioInputDevices.map((d, i) => (
                  <option key={i} value={d.deviceId}>{d.label || `Microphone ${i + 1}`}</option>
                ))}
              </select>
              <Mic size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>

            {/* Video Input (Camera) */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedVideo}
                onChange={(e) => setSelectedVideo(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px 0 36px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {videoDevices.map((d, i) => (
                  <option key={i} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>
                ))}
              </select>
              <Video size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>

            {/* Audio Output (Speakers) with Test button */}
            <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <select
                  value={selectedAudioOutput}
                  onChange={(e) => setSelectedAudioOutput(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px 0 36px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: '#ffffff',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {audioOutputDevices.map((d, i) => (
                    <option key={i} value={d.deviceId}>{d.label || `Speaker ${i + 1}`}</option>
                  ))}
                </select>
                <Volume2 size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
              <button
                type="button"
                onClick={testAudioOutput}
                style={{
                  padding: '0 14px',
                  height: '42px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Test
              </button>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={handleAudioVideoContinue}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '48px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}
          >
            Continue
          </button>

          {/* Back button */}
          <button
            onClick={() => setStep('customize-avatar')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0284c7',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      )}

      {/* ================= STEP 4: WAITING ROOM / KNOCK ================= */}
      {step === 'waiting-room' && (
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* Spot Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>spot</span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 10px 0' }}>
            Waiting to be let in...
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 24px 0', maxWidth: '420px', lineHeight: 1.5 }}>
            You're currently waiting to be let into <strong style={{ color: '#111827' }}>{spaceName}</strong>. Someone from{' '}
            <strong style={{ color: '#111827' }}>{orgName}</strong> will let you in shortly.
          </p>

          {/* Animated Spinner matching real_spot_step4.png */}
          <div style={{ margin: '8px 0 20px 0' }}>
            <Loader2 size={32} color="#0091ff" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          </div>

          {/* Back button */}
          <button
            onClick={() => setStep('setup-audio-video')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0284c7',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '28px'
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Team table illustration matching real_spot_step4.png */}
          <svg
            width="380"
            height="180"
            viewBox="0 0 380 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: '24px' }}
          >
            {/* Table */}
            <rect x="90" y="110" width="200" height="12" rx="4" fill="#64748b" />
            <rect x="186" y="122" width="8" height="45" fill="#475569" />

            {/* Left seated person */}
            <circle cx="95" cy="80" r="16" fill="#8d5524" />
            <path d="M 80,105 Q 95,95 110,105 L 105,140 L 85,140 Z" fill="#38bdf8" />

            {/* Center standing person */}
            <circle cx="190" cy="55" r="16" fill="#f9d3b4" />
            <path d="M 175,75 Q 190,65 205,75 L 202,135 L 178,135 Z" fill="#22c55e" />

            {/* Right seated person */}
            <circle cx="285" cy="80" r="16" fill="#e8b688" />
            <path d="M 270,105 Q 285,95 300,105 L 295,140 L 275,140 Z" fill="#4ade80" />

            {/* Plant & Mug */}
            <rect x="140" y="98" width="12" height="12" rx="2" fill="#ef4444" />
            <circle cx="240" cy="100" r="8" fill="#10b981" />
          </svg>

          {/* Admitted button / Enter space button */}
          <button
            onClick={handleEnterSpace}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '48px',
              background: isAdmitted ? '#10b981' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isAdmitted ? '0 2px 6px rgba(16, 185, 129, 0.3)' : '0 2px 6px rgba(2, 132, 199, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isAdmitted ? (
              <>
                <Check size={18} />
                <span>You were admitted! Enter {spaceName}</span>
              </>
            ) : (
              <>
                <span>Enter as Host / Admitted</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
