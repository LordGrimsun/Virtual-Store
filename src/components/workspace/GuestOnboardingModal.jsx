import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Volume2, ChevronRight, ChevronLeft,
  RotateCcw, Check, Loader2, ArrowLeft, ArrowRight, Shield
} from 'lucide-react';
import AvatarPreview3D from './AvatarPreview3D';

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
  invitedBy = '',
  onComplete,
  onClose
}) {
  const [step, setStep] = useState('join'); // 'join' | 'customize-avatar' | 'choose-area' | 'setup-audio-video' | 'waiting-room'
  const [fullName, setFullName] = useState('');
  const [selectedRoomSlug, setSelectedRoomSlug] = useState(roomSlug || 'lobby');
  const [selectedRoomName, setSelectedRoomName] = useState(roomName || 'Lobby');
  const [skinToneIndex, setSkinToneIndex] = useState(0); // Default peach skin (#f6d5be) matching reference image!
  const [customSkinColor, setCustomSkinColor] = useState('');
  const [avatarGender, setAvatarGender] = useState('male');
  const [avatarRotation, setAvatarRotation] = useState(0);

  // Granular customization states
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'face' | 'hair' | 'tops' | 'pants' | 'shoes'
  const [hairType, setHairType] = useState('black_waves');
  const [hairColor, setHairColor] = useState('#1c1917');
  const [faceType, setFaceType] = useState('happy');
  const [mouthType, setMouthType] = useState('smile_teeth');
  const [noseType, setNoseType] = useState('clean');
  const [clothing, setClothing] = useState('red_hoodie');
  const [shirtColor, setShirtColor] = useState('#dc2626');
  const [pantsType, setPantsType] = useState('cargo_pants');
  const [pantsColor, setPantsColor] = useState('#18181b');
  const [shoesType, setShoesType] = useState('platform_sneakers');
  const [shoesColor, setShoesColor] = useState('#dc2626');

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
  const skinColorPickerRef = useRef(null);
  const hairColorPickerRef = useRef(null);
  const shirtColorPickerRef = useRef(null);
  const pantsColorPickerRef = useRef(null);
  const shoesColorPickerRef = useRef(null);

  // Available skin tones matching Spot Virtual palette (real_spot_after_continue.png)
  const skinTones = ['#f6d5be', '#dfb18e', '#ba8659', '#8a5836', '#453328'];

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
    setStep('choose-area');
  };

  const handleAreaContinue = () => {
    setStep('setup-audio-video');
  };

  const handleAudioVideoContinue = () => {
    setStep('waiting-room');
  };

  const handleEnterSpace = () => {
    if (onComplete) {
      const activeSkin = skinToneIndex === -1 ? (customSkinColor || '#f6d5be') : skinTones[skinToneIndex];
      onComplete({
        fullName: fullName || 'Guest',
        skinTone: activeSkin,
        gender: avatarGender,
        hairType,
        hairColor,
        faceType,
        mouthType,
        noseType,
        clothing,
        shirtColor,
        pantsType,
        pantsColor,
        shoesType,
        shoesColor,
        isMicOn,
        isVideoOn: isCameraOn,
        spaceSlug,
        roomSlug: selectedRoomSlug,
        roomName: selectedRoomName
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

            {invitedBy && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '12px 16px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#15803d',
                  fontSize: '14px',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <span style={{ fontSize: '18px' }}>👋</span>
                <span>You were invited by <strong>{invitedBy}</strong> to join <strong>{roomName || 'the workspace'}</strong>!</span>
              </div>
            )}

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

      {/* ================= STEP 2: CUSTOMIZE AVATAR STUDIO ================= */}
      {step === 'customize-avatar' && (() => {
        // Presets based on reference archetypes
        const presets = [
          {
            id: 'ayush',
            name: 'Ayush',
            tag: 'Red Hoodie & Waves',
            gender: 'male',
            hairType: 'black_waves',
            hairColor: '#1c1917',
            faceType: 'happy',
            mouthType: 'smile_teeth',
            noseType: 'clean',
            clothing: 'red_hoodie',
            shirtColor: '#dc2626',
            pantsType: 'cargo_pants',
            pantsColor: '#18181b',
            shoesType: 'platform_sneakers',
            shoesColor: '#dc2626'
          },
          {
            id: 'sarah',
            name: 'Sarah',
            tag: 'Pink Waves & Headphones',
            gender: 'female',
            hairType: 'long_waves_headphones',
            hairColor: '#3e2723',
            faceType: 'wink',
            mouthType: 'smile_teeth',
            noseType: 'blush',
            clothing: 'pink_jacket',
            shirtColor: '#f472b6',
            pantsType: 'jeans',
            pantsColor: '#38bdf8',
            shoesType: 'platform_sneakers',
            shoesColor: '#f472b6'
          },
          {
            id: 'stefan',
            name: 'Stefan',
            tag: 'Cyber Techwear',
            gender: 'male',
            hairType: 'cyber_spikes',
            hairColor: '#0284c7',
            faceType: 'smirk',
            mouthType: 'smirk',
            noseType: 'clean',
            clothing: 'cyber_jacket',
            shirtColor: '#18181b',
            pantsType: 'cyber_pants',
            pantsColor: '#18181b',
            shoesType: 'cyber_sneakers',
            shoesColor: '#00f0ff'
          },
          {
            id: 'wes',
            name: 'Wes',
            tag: 'Moto Biker & Shades',
            gender: 'male',
            hairType: 'swept_brown',
            hairColor: '#6b4226',
            faceType: 'sunglasses',
            mouthType: 'smirk',
            noseType: 'clean',
            clothing: 'moto_jacket',
            shirtColor: '#18181b',
            pantsType: 'cargo_pants',
            pantsColor: '#27272a',
            shoesType: 'platform_sneakers',
            shoesColor: '#18181b'
          },
          {
            id: 'phil',
            name: 'Phil',
            tag: 'Safari Explorer Fedora',
            gender: 'male',
            hairType: 'safari_hat',
            hairColor: '#4a2c1d',
            faceType: 'happy',
            mouthType: 'smile_teeth',
            noseType: 'clean',
            clothing: 'safari_khaki',
            shirtColor: '#d4b996',
            pantsType: 'shorts',
            pantsColor: '#c4a480',
            shoesType: 'boots',
            shoesColor: '#5c3d2e'
          },
          {
            id: 'chloe',
            name: 'Chloe',
            tag: 'Artist Topknot Overalls',
            gender: 'female',
            hairType: 'topknot_waves',
            hairColor: '#4a2c1d',
            faceType: 'happy',
            mouthType: 'smile_teeth',
            noseType: 'freckles',
            clothing: 'overalls',
            shirtColor: '#d97706',
            pantsType: 'overalls_bottom',
            pantsColor: '#d97706',
            shoesType: 'platform_sneakers',
            shoesColor: '#ffffff'
          },
          {
            id: 'devbot',
            name: 'DevBot',
            tag: 'Emerald AI Mascot',
            gender: 'male',
            hairType: 'black_waves',
            hairColor: '#10b981',
            faceType: 'cyber_visor',
            mouthType: 'smile_teeth',
            noseType: 'clean',
            clothing: 'cyber_jacket',
            shirtColor: '#059669',
            pantsType: 'cyber_pants',
            pantsColor: '#18181b',
            shoesType: 'cyber_sneakers',
            shoesColor: '#10b981'
          }
        ];

        const eyeOptions = [
          { id: 'happy', label: 'Anime Eyes', desc: 'Big sparkling catchlights' },
          { id: 'wink', label: 'Playful Wink', desc: 'Cute wink with flutter lashes' },
          { id: 'sunglasses', label: 'Wayfarers', desc: 'Dark sleek sunglasses' },
          { id: 'glasses', label: 'Smart Glasses', desc: 'Round wire frames' },
          { id: 'smirk', label: 'Focused Eyes', desc: 'Confident anime gaze' },
          { id: 'cyber_visor', label: 'Cyber Visor', desc: 'Digital glow scanlines' }
        ];

        const mouthOptions = [
          { id: 'smile_teeth', label: 'Teeth Smile', desc: 'Cheerful open smile with white teeth' },
          { id: 'gentle_smile', label: 'Gentle Smile', desc: 'Sweet curved smile line' },
          { id: 'smirk', label: 'Side Smirk', desc: 'Confident anime grin' },
          { id: 'open_laugh', label: 'Joyful Laugh', desc: 'Big open joyful laugh' }
        ];

        const noseOptions = [
          { id: 'clean', label: 'Clean', desc: 'Smooth classic face' },
          { id: 'cute_nose', label: 'Cute Nose', desc: 'Subtle anime nose dash' },
          { id: 'blush', label: 'Rosy Blush', desc: 'Soft pink cheek blush' },
          { id: 'freckles', label: 'Freckles', desc: 'Sun-kissed cheek freckles' }
        ];

        const hairOptions = [
          { id: 'black_waves', label: 'Wavy Locks', category: 'all' },
          { id: 'swept_brown', label: 'Side Sweep', category: 'all' },
          { id: 'cyber_spikes', label: 'Cyber Spikes', category: 'all' },
          { id: 'pompadour', label: 'Pompadour', category: 'male' },
          { id: 'afro_short', label: 'Textured Fade', category: 'male' },
          { id: 'long_waves_headphones', label: 'Waves + Headphones', category: 'female' },
          { id: 'topknot_waves', label: 'Topknot Half-Bun', category: 'female' },
          { id: 'twin_buns', label: 'Twin Space Buns', category: 'female' },
          { id: 'bob_cut', label: 'French Bob', category: 'female' },
          { id: 'high_ponytail', label: 'High Ponytail', category: 'female' },
          { id: 'beanie', label: 'Knit Beanie', category: 'all' },
          { id: 'safari_hat', label: 'Safari Fedora', category: 'all' }
        ];

        const hairColorPalette = [
          { hex: '#1c1917', label: 'Espresso Black' },
          { hex: '#5c3826', label: 'Chestnut Brown' },
          { hex: '#3e2723', label: 'Soft Brunette' },
          { hex: '#eab308', label: 'Honey Blonde' },
          { hex: '#0284c7', label: 'Electric Blue' },
          { hex: '#b91c1c', label: 'Ruby Red' },
          { hex: '#94a3b8', label: 'Platinum Silver' },
          { hex: '#f472b6', label: 'Pastel Pink' }
        ];

        const topOptions = [
          { id: 'red_hoodie', label: 'Open Hoodie', desc: 'Drawstrings, white tee & straps' },
          { id: 'pink_jacket', label: 'Streetwear Jacket', desc: 'Zip jacket over crop tee' },
          { id: 'cyber_jacket', label: 'Cyber Techwear', desc: 'Neon circuits & reactor' },
          { id: 'moto_jacket', label: 'Biker Moto Jacket', desc: 'Leather jacket with sling strap' },
          { id: 'safari_khaki', label: 'Safari Explorer', desc: 'Utility pockets & gold compass' },
          { id: 'overalls', label: 'Workwear Dungarees', desc: 'Cozy sweater + denim bib' },
          { id: 'casual_tee', label: 'Minimal Tee', desc: 'Casual crewneck t-shirt' },
          { id: 'formal_shirt', label: 'Dress Shirt + Tie', desc: 'Collared shirt with necktie' }
        ];

        const topColorPalette = [
          { hex: '#dc2626', label: 'Crimson' },
          { hex: '#f472b6', label: 'Rose' },
          { hex: '#00f0ff', label: 'Cyber Cyan' },
          { hex: '#18181b', label: 'Midnight' },
          { hex: '#d4b996', label: 'Khaki' },
          { hex: '#d97706', label: 'Mustard' },
          { hex: '#16a34a', label: 'Forest' },
          { hex: '#2563eb', label: 'Royal Navy' },
          { hex: '#ffffff', label: 'White' }
        ];

        const pantsOptions = [
          { id: 'cargo_pants', label: '3D Cargo Pants', desc: 'Outer flap pockets on thighs' },
          { id: 'jeans', label: 'Denim Jeans', desc: 'Classic blue jean wash' },
          { id: 'trousers', label: 'Tailored Chinos', desc: 'Clean straight-leg dress pants' },
          { id: 'shorts', label: 'Adventure Shorts', desc: 'Cargo shorts with bare knees' },
          { id: 'cyber_pants', label: 'Cyber Pants', desc: 'Techwear with neon stripes' }
        ];

        const pantsColorPalette = [
          { hex: '#18181b', label: 'Midnight Black' },
          { hex: '#38bdf8', label: 'Denim Blue' },
          { hex: '#1e3a8a', label: 'Dark Indigo' },
          { hex: '#c4a480', label: 'Safari Khaki' },
          { hex: '#3f6212', label: 'Olive Army' },
          { hex: '#e2d7c5', label: 'Warm Beige' },
          { hex: '#f8fafc', label: 'Crisp White' }
        ];

        const shoesOptions = [
          { id: 'platform_sneakers', label: 'Platform Sneakers', desc: 'Two-tone chunky rubber soles' },
          { id: 'high_tops', label: 'Skate High-Tops', desc: 'White collar & side emblem' },
          { id: 'boots', label: 'Adventure Boots', desc: 'Rugged lug soles' },
          { id: 'cyber_sneakers', label: 'Cyber Kicks', desc: 'Glowing neon LED soles' }
        ];

        const shoesColorPalette = [
          { hex: '#dc2626', label: 'Red' },
          { hex: '#f472b6', label: 'Pink' },
          { hex: '#00f0ff', label: 'Cyan' },
          { hex: '#18181b', label: 'Black' },
          { hex: '#c4a480', label: 'Tan' },
          { hex: '#ffffff', label: 'White' }
        ];

        const applyPreset = (p) => {
          setAvatarGender(p.gender);
          setHairType(p.hairType);
          setHairColor(p.hairColor);
          setFaceType(p.faceType);
          setMouthType(p.mouthType);
          setNoseType(p.noseType);
          setClothing(p.clothing);
          setShirtColor(p.shirtColor);
          setPantsType(p.pantsType);
          setPantsColor(p.pantsColor);
          setShoesType(p.shoesType);
          setShoesColor(p.shoesColor);
        };

        const activeSkinHex = skinToneIndex === -1 ? (customSkinColor || '#f6d5be') : skinTones[skinToneIndex];

        return (
          <div
            style={{
              width: '100%',
              maxWidth: '860px',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <SpotBrandHeader marginBottom="14px" />

            <h2
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 6px 0',
                letterSpacing: '-0.02em'
              }}
            >
              Customize your avatar
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px 0', maxWidth: '520px', textAlign: 'center', lineHeight: 1.5 }}>
              Fine-tune hair, facial expression, clothing, pants, shoes, and colors to create your authentic look.
            </p>

            {/* Customizer Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f3f4f6',
                padding: '4px',
                borderRadius: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {[
                { id: 'presets', label: 'Presets', emoji: '✨' },
                { id: 'face', label: 'Face', emoji: '😊' },
                { id: 'hair', label: 'Hair', emoji: '💇' },
                { id: 'tops', label: 'Tops', emoji: '👕' },
                { id: 'pants', label: 'Pants', emoji: '👖' },
                { id: 'shoes', label: 'Shoes', emoji: '👟' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    color: activeTab === tab.id ? '#111827' : '#6b7280',
                    background: activeTab === tab.id ? '#ffffff' : 'transparent',
                    border: 'none',
                    boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Two-Column Studio Workspace */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                width: '100%',
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}
            >
              {/* Left Column: Interactive 3D WebGL Avatar Viewport */}
              <div
                style={{
                  width: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#f9fafb',
                  borderRadius: '14px',
                  border: '1px solid #e5e7eb',
                  padding: '16px',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '288px',
                    height: '330px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AvatarPreview3D
                    skinColor={activeSkinHex}
                    gender={avatarGender}
                    hairType={hairType}
                    hairColor={hairColor}
                    faceType={faceType}
                    mouthType={mouthType}
                    noseType={noseType}
                    clothing={clothing}
                    shirtColor={shirtColor}
                    pantsType={pantsType}
                    pantsColor={pantsColor}
                    shoesType={shoesType}
                    shoesColor={shoesColor}
                    rotationAngle={avatarRotation}
                    onRotationChange={(deg) => setAvatarRotation(deg)}
                  />
                </div>

                {/* Sub-viewport Quick Controls: Rotate & Gender */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '8px'
                  }}
                >
                  <button
                    onClick={() => setAvatarRotation((r) => (r - 45 + 360) % 360)}
                    title="Rotate Left 45°"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ArrowLeft size={16} color="#4b5563" />
                  </button>

                  {/* Gender Toggle Pills */}
                  <div
                    style={{
                      display: 'flex',
                      background: '#e5e7eb',
                      borderRadius: '8px',
                      padding: '2px'
                    }}
                  >
                    <button
                      onClick={() => {
                        setAvatarGender('male');
                        if (hairType === 'long_waves_headphones') setHairType('black_waves');
                        if (clothing === 'pink_jacket') setClothing('red_hoodie');
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: avatarGender === 'male' ? '#ffffff' : 'transparent',
                        color: avatarGender === 'male' ? '#111827' : '#6b7280',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: avatarGender === 'male' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      👦 Male
                    </button>
                    <button
                      onClick={() => {
                        setAvatarGender('female');
                        if (hairType === 'black_waves') setHairType('long_waves_headphones');
                        if (clothing === 'red_hoodie') setClothing('pink_jacket');
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: avatarGender === 'female' ? '#ffffff' : 'transparent',
                        color: avatarGender === 'female' ? '#111827' : '#6b7280',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: avatarGender === 'female' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      👧 Female
                    </button>
                  </div>

                  <button
                    onClick={() => setAvatarRotation((r) => (r + 45) % 360)}
                    title="Rotate Right 45°"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ArrowRight size={16} color="#4b5563" />
                  </button>
                </div>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>
                  Drag avatar to spin 360°
                </span>
              </div>

              {/* Right Column: Customization Controls Panel */}
              <div
                style={{
                  flex: '1 1 420px',
                  minWidth: '320px',
                  maxHeight: '390px',
                  overflowY: 'auto',
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e5e7eb',
                  padding: '20px',
                  textAlign: 'left'
                }}
              >
                {/* ================= TAB: PRESETS ================= */}
                {activeTab === 'presets' && (
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
                      Ready-to-Wear Archetypes
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px 0' }}>
                      Select a complete character style inspired by the user reference, or mix-and-match in other tabs.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                      {presets.map((p) => {
                        const isSelected = clothing === p.clothing && hairType === p.hairType;
                        return (
                          <div
                            key={p.id}
                            data-preset-id={p.id}
                            onClick={() => applyPreset(p)}
                            style={{
                              padding: '12px',
                              borderRadius: '10px',
                              border: isSelected ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: isSelected ? '#eff6ff' : '#f9fafb',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{p.name}</span>
                              <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: p.gender === 'female' ? '#fce7f3' : '#e0f2fe', color: p.gender === 'female' ? '#be185d' : '#0369a1' }}>
                                {p.gender === 'female' ? 'Female' : 'Male'}
                              </span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#4b5563', display: 'block' }}>{p.tag}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ================= TAB: FACE ================= */}
                {activeTab === 'face' && (
                  <div>
                    {/* A. Eyes / Eyewear */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Eyes & Eyewear
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                        {eyeOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setFaceType(opt.id)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: faceType === opt.id ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: faceType === opt.id ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B. Mouth Expression */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Mouth Expression
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                        {mouthOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setMouthType(opt.id)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: mouthType === opt.id ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: mouthType === opt.id ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* C. Nose & Cheeks */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Nose & Cheeks
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                        {noseOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setNoseType(opt.id)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: noseType === opt.id ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: noseType === opt.id ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* D. Skin Tone Palette */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Skin Tone
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {skinTones.map((tone, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSkinToneIndex(idx);
                              setCustomSkinColor('');
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: tone,
                              border: skinToneIndex === idx ? '3px solid #ffffff' : '2px solid #ffffff',
                              boxShadow: skinToneIndex === idx ? '0 0 0 2px #0091ff' : '0 1px 3px rgba(0,0,0,0.15)',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          />
                        ))}
                        <button
                          title="Custom Skin Color"
                          onClick={() => skinColorPickerRef.current?.click()}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: customSkinColor || '#fafafa',
                            border: skinToneIndex === -1 ? '2px solid #0091ff' : '1.5px dashed #9ca3af',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {!customSkinColor && <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>+</span>}
                          <input
                            ref={skinColorPickerRef}
                            type="color"
                            value={customSkinColor || skinTones[skinToneIndex] || '#f6d5be'}
                            onChange={(e) => {
                              setCustomSkinColor(e.target.value);
                              setSkinToneIndex(-1);
                            }}
                            style={{ opacity: 0, position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB: HAIR ================= */}
                {activeTab === 'hair' && (
                  <div>
                    {/* A. Hair Styles */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Hairstyle (12 Styles)
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        {hairOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setHairType(opt.id)}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: hairType === opt.id ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: hairType === opt.id ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B. Hair Colors */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Hair Color
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {hairColorPalette.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setHairColor(c.hex)}
                            title={c.label}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: c.hex,
                              border: hairColor === c.hex ? '3px solid #ffffff' : '2px solid #ffffff',
                              boxShadow: hairColor === c.hex ? '0 0 0 2px #0091ff' : '0 1px 3px rgba(0,0,0,0.15)',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                        <button
                          title="Custom Hair Color"
                          onClick={() => hairColorPickerRef.current?.click()}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#fafafa',
                            border: '1.5px dashed #9ca3af',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>+</span>
                          <input
                            ref={hairColorPickerRef}
                            type="color"
                            value={hairColor || '#1c1917'}
                            onChange={(e) => setHairColor(e.target.value)}
                            style={{ opacity: 0, position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB: TOPS (CLOTHES) ================= */}
                {activeTab === 'tops' && (
                  <div>
                    {/* A. Top Styles */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Tops & Jackets (8 Styles)
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        {topOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setClothing(opt.id)}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: clothing === opt.id ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: clothing === opt.id ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B. Top Colors */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Top Color
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {topColorPalette.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setShirtColor(c.hex)}
                            title={c.label}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: c.hex,
                              border: shirtColor === c.hex ? '3px solid #ffffff' : '2px solid #ffffff',
                              boxShadow: shirtColor === c.hex ? '0 0 0 2px #0091ff' : '0 1px 3px rgba(0,0,0,0.15)',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                        <button
                          title="Custom Shirt Color"
                          onClick={() => shirtColorPickerRef.current?.click()}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#fafafa',
                            border: '1.5px dashed #9ca3af',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>+</span>
                          <input
                            ref={shirtColorPickerRef}
                            type="color"
                            value={shirtColor || '#dc2626'}
                            onChange={(e) => setShirtColor(e.target.value)}
                            style={{ opacity: 0, position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB: PANTS ================= */}
                {activeTab === 'pants' && (
                  <div>
                    {/* A. Bottom Styles */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Pants & Bottoms (5 Styles)
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        {pantsOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setPantsType(opt.id)}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: pantsType === opt.id ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: pantsType === opt.id ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B. Pants Colors */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Pants Color
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {pantsColorPalette.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setPantsColor(c.hex)}
                            title={c.label}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: c.hex,
                              border: pantsColor === c.hex ? '3px solid #ffffff' : '2px solid #ffffff',
                              boxShadow: pantsColor === c.hex ? '0 0 0 2px #0091ff' : '0 1px 3px rgba(0,0,0,0.15)',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                        <button
                          title="Custom Pants Color"
                          onClick={() => pantsColorPickerRef.current?.click()}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#fafafa',
                            border: '1.5px dashed #9ca3af',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>+</span>
                          <input
                            ref={pantsColorPickerRef}
                            type="color"
                            value={pantsColor || '#18181b'}
                            onChange={(e) => setPantsColor(e.target.value)}
                            style={{ opacity: 0, position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB: SHOES ================= */}
                {activeTab === 'shoes' && (
                  <div>
                    {/* A. Footwear Styles */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Shoes & Footwear
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        {shoesOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setShoesType(opt.id)}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: shoesType === opt.id ? '2px solid #0091ff' : '1px solid #e5e7eb',
                              background: shoesType === opt.id ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B. Footwear Colors */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>
                        Shoe Accent Color
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {shoesColorPalette.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setShoesColor(c.hex)}
                            title={c.label}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: c.hex,
                              border: shoesColor === c.hex ? '3px solid #ffffff' : '2px solid #ffffff',
                              boxShadow: shoesColor === c.hex ? '0 0 0 2px #0091ff' : '0 1px 3px rgba(0,0,0,0.15)',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                        <button
                          title="Custom Shoe Color"
                          onClick={() => shoesColorPickerRef.current?.click()}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#fafafa',
                            border: '1.5px dashed #9ca3af',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>+</span>
                          <input
                            ref={shoesColorPickerRef}
                            type="color"
                            value={shoesColor || '#dc2626'}
                            onChange={(e) => setShoesColor(e.target.value)}
                            style={{ opacity: 0, position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <button
              onClick={handleAvatarContinue}
              style={{
                width: '100%',
                maxWidth: '420px',
                height: '48px',
                background: '#14C939',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '14px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#0ea82d')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#14C939')}
            >
              Continue
            </button>

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
                gap: '4px'
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        );
      })()}

      {/* ================= STEP 2.5: CHOOSE STARTING AREA ================= */}
      {step === 'choose-area' && (
        <div
          style={{
            width: '100%',
            maxWidth: '720px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <SpotBrandHeader marginBottom="16px" />

          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 8px 0',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Choose Your Starting Location
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 24px 0',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Select where your avatar will spawn inside the virtual office.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              width: '100%',
              marginBottom: '28px'
            }}
          >
            {[
              { slug: 'auditorium', name: 'Auditorium', icon: '🎬', desc: 'Cinema Stage & Stadium Seating' },
              { slug: 'boardroom', name: 'Boardroom', icon: '💼', desc: 'Executive Sofas & Starry Wall Screen' },
              { slug: 'workspace-a', name: 'Workspace A', icon: '💻', desc: 'Team Desks & Facing Dual Monitors' },
              { slug: 'conference-b', name: 'Conference B', icon: '📊', desc: 'Sprint Standup & White Sled Chairs' },
              { slug: 'cubicle-1', name: 'Focus Cubicle 1', icon: '🎧', desc: 'Private Sound-Isolated Workstation' },
              { slug: 'cubicle-2', name: 'Focus Cubicle 2', icon: '🎧', desc: 'Private Sound-Isolated Workstation' },
              { slug: 'patio', name: 'Patio Terrace', icon: '♟️', desc: 'Interactive Chessboard & City Skyline' },
              { slug: 'lobby', name: 'Lobby', icon: '🌐', desc: 'Reception & Visitor Greeting Area' },
              { slug: 'lounge-c', name: 'Lounge C', icon: '☕', desc: 'Casual Breakout Sofas & Coffee Bar' }
            ].map((area) => {
              const isSelected = selectedRoomSlug === area.slug;
              return (
                <div
                  key={area.slug}
                  onClick={() => {
                    setSelectedRoomSlug(area.slug);
                    setSelectedRoomName(area.name);
                  }}
                  style={{
                    padding: '16px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #10b981' : '1px solid #e2e8f0',
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '24px' }}>{area.icon}</span>
                    {isSelected && (
                      <span style={{
                        background: '#10b981',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>✓</span>
                    )}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{area.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.3 }}>{area.desc}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAreaContinue}
            style={{
              width: '100%',
              maxWidth: '320px',
              height: '46px',
              background: '#14C939',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(20, 201, 57, 0.3)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Continue to Device Setup
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
            <ArrowLeft size={14} /> Back to Avatar Customization
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
            onClick={() => setStep('choose-area')}
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
