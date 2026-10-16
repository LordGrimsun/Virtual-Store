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

  const SpotBrandHeader = ({ marginBottom = '24px' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom }}>
      <img
        src="data:image/svg+xml,%3csvg%20width='50'%20height='50'%20viewBox='0%200%2050%2050'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20y='21.875'%20width='50'%20height='6.25'%20fill='%230D8225'/%3e%3cpath%20d='M50%2028.125C50%2040.2062%2038.8071%2050%2025%2050C11.1929%2050%200%2040.2062%200%2028.125C0%2016.0438%2011.1929%206.25%2025%206.25C38.8071%206.25%2050%2016.0438%2050%2028.125Z'%20fill='%230D8225'/%3e%3cellipse%20cx='25'%20cy='21.875'%20rx='25'%20ry='21.875'%20fill='%2314C939'/%3e%3c/svg%3e"
        alt="Spot"
        style={{ width: '28px', height: '28px' }}
      />
      <span
        style={{
          fontFamily: 'Comfortaa, cursive, sans-serif',
          fontWeight: 300,
          fontSize: '26px',
          color: '#111827',
          letterSpacing: '-0.5px'
        }}
      >
        spot
      </span>
    </div>
  );

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
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
              flex: 1.15,
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              overflow: 'hidden'
            }}
          >
            <img
              src="https://spotvirtual.com/static/vite/login-hero-CnrJe5Jj.svg"
              alt="Spot Login Hero"
              style={{
                maxWidth: '640px',
                width: '92%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
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
            <SpotBrandHeader marginBottom="24px" />

            <h1
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '30px',
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 10px 0'
              }}
            >
              Visit {spaceName}
            </h1>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                color: '#4b5563',
                margin: '0 0 28px 0',
                lineHeight: 1.5
              }}
            >
              Continue below to visit <strong style={{ color: '#111827' }}>{orgName}</strong> in the{' '}
              <strong style={{ color: '#111827' }}>{spaceName}</strong> space.
            </p>

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
                    height: '48px',
                    padding: '0 16px',
                    fontSize: '15px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0091ff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 145, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '48px',
                  background: '#14C939',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0ea82d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#14C939')}
              >
                Continue
              </button>
            </form>

            <div style={{ marginTop: '28px', fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
              By visiting, you agree to our{' '}
              <a
                href="https://www.spotvirtual.com/terms-of-service/"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#0091ff', textDecoration: 'none' }}
              >
                Terms of Service
              </a>
            </div>

            <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              Already have an account?{' '}
              <a
                href="#signin"
                onClick={(e) => {
                  e.preventDefault();
                  if (onClose) onClose();
                }}
                style={{ color: '#0091ff', textDecoration: 'none' }}
              >
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
          <SpotBrandHeader marginBottom="20px" />

          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 10px 0'
            }}
          >
            Customize your avatar
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', margin: '0 0 32px 0', maxWidth: '380px', lineHeight: 1.5 }}>
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
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    left: '16px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#14C939'
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
                    background: '#14C939'
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

            {/* Right Controls */}
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
                onClick={() => setAvatarGender('female')}
                title="Female"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: avatarGender === 'female' ? '#f0fdf4' : '#ffffff',
                  border: avatarGender === 'female' ? '2px solid #14C939' : '1px solid #e5e7eb',
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
                onClick={() => setAvatarGender('male')}
                title="Male"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: avatarGender === 'male' ? '#f0fdf4' : '#ffffff',
                  border: avatarGender === 'male' ? '2px solid #14C939' : '1px solid #e5e7eb',
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
              background: '#14C939',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
              fontFamily: 'Inter, sans-serif'
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
              color: '#0091ff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'Inter, sans-serif'
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
          <SpotBrandHeader marginBottom="20px" />

          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 8px 0'
            }}
          >
            Audio & video setup
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', maxWidth: '380px', lineHeight: 1.5 }}>
            Make sure your mic, camera and speakers are setup correctly before joining.
          </p>

          {/* Video Preview Box */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '210px',
              borderRadius: '8px',
              background: '#09090b',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
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
              <span style={{ color: '#d1d5db', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
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
                  background: isMicOn ? '#14C939' : '#374151',
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
                  background: isCameraOn ? '#14C939' : '#374151',
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

          {/* Device Dropdowns */}
          <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedAudioInput}
                onChange={(e) => setSelectedAudioInput(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px 0 36px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {audioInputDevices.map((d, i) => (
                  <option key={i} value={d.deviceId}>{d.label || `Fake Default Audio Input`}</option>
                ))}
              </select>
              <Mic size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <select
                value={selectedVideo}
                onChange={(e) => setSelectedVideo(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px 0 36px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {videoDevices.map((d, i) => (
                  <option key={i} value={d.deviceId}>{d.label || `System default`}</option>
                ))}
              </select>
              <Video size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>

            <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <select
                  value={selectedAudioOutput}
                  onChange={(e) => setSelectedAudioOutput(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px 0 36px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    background: '#ffffff',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {audioOutputDevices.map((d, i) => (
                    <option key={i} value={d.deviceId}>{d.label || `Fake Default Audio Output`}</option>
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
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#0091ff',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Test
              </button>
            </div>
          </div>

          <button
            onClick={handleAudioVideoContinue}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '48px',
              background: '#14C939',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Continue
          </button>

          <button
            onClick={() => setStep('customize-avatar')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0091ff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'Inter, sans-serif'
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
          <SpotBrandHeader marginBottom="20px" />

          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 10px 0'
            }}
          >
            Waiting to be let in...
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: '#4b5563',
              margin: '0 0 20px 0',
              maxWidth: '440px',
              lineHeight: 1.5
            }}
          >
            You're currently waiting to be let into <strong>{spaceName}</strong>. Someone from{' '}
            <strong>{orgName}</strong> will let you in shortly.
          </p>

          <div style={{ margin: '8px 0 20px 0' }}>
            <Loader2 size={32} color="#0091ff" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          </div>

          <button
            onClick={() => setStep('setup-audio-video')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0091ff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '24px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Official Spot Waiting Room Hero Illustration */}
          <img
            src="https://spotvirtual.com/static/vite/waiting-room-hero-AObid9Ex.svg"
            alt="Waiting in room"
            style={{
              maxWidth: '460px',
              width: '92%',
              height: 'auto',
              objectFit: 'contain',
              marginBottom: '28px'
            }}
          />

          <button
            onClick={handleEnterSpace}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '48px',
              background: isAdmitted ? '#14C939' : '#0091ff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {isAdmitted ? (
              <>
                <Check size={18} />
                <span>You were admitted! Enter {spaceName}</span>
              </>
            ) : (
              <span>Enter as Host / Admitted</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
