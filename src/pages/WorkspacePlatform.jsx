import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Headphones, Volume2,
  Users, Bot, MessageSquare, Edit3, Share2, LogOut, Settings,
  Sparkles, Send, Plus, Check, ChevronRight, ChevronDown, X, PhoneCall, VolumeX,
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, HelpCircle, Coffee, Compass,
  Terminal, Sliders, Camera, Layers, Radio, Play, Smile, MapPin, Calendar,
  TrendingUp, Tv, CheckCircle2, UserCheck, Activity, Eye, Tag,
  Grid, Mail, Clock, Hammer, Search, Home, MoreVertical, MoreHorizontal,
  Paperclip, BarChart3, Crosshair, Globe, Youtube, ArrowLeft, UserPlus
} from 'lucide-react';

import { createOfficeScreenTextures } from '../components/workspace/OfficeScreens';
import { buildOfficeEnvironment } from '../components/workspace/OfficeEnvironment';
import { buildOfficeFurniture } from '../components/workspace/OfficeFurniture';
import { createAvatarSystem } from '../components/workspace/AvatarSystem';
import ScreenDisplayManager from '../components/workspace/ScreenDisplayManager';
import UserProfileDrawer from '../components/workspace/UserProfileDrawer';
import SpacesSidebar from '../components/workspace/SpacesSidebar';
import ConnectFourWidget from '../components/workspace/widgets/ConnectFourWidget';
import SpinWheelWidget from '../components/workspace/widgets/SpinWheelWidget';
import WatercoolerWidget from '../components/workspace/widgets/WatercoolerWidget';
import SpotLinkModal from '../components/workspace/SpotLinkModal';
import RoomSettingsModal from '../components/workspace/RoomSettingsModal';
import ChessGameWidget from '../components/workspace/widgets/ChessGameWidget';
import ArcadeGameWidget from '../components/workspace/widgets/ArcadeGameWidget';
import BilliardsGameWidget from '../components/workspace/widgets/BilliardsGameWidget';
import PingPongGameWidget from '../components/workspace/widgets/PingPongGameWidget';
import StickyNoteWidget from '../components/workspace/widgets/StickyNoteWidget';
import SharedBrowserWidget from '../components/workspace/widgets/SharedBrowserWidget';
import PollWidget from '../components/workspace/widgets/PollWidget';
import YouTubeWidget from '../components/workspace/widgets/YouTubeWidget';
import TimerWidget from '../components/workspace/widgets/TimerWidget';

export default function WorkspacePlatform({ user, onExit }) {
  const mountRef = useRef(null);

  // User & Space/Room state (support both @office and @ser-emY)
  const isInitialSer = user?.spaceSlug?.includes('ser') || user?.spotUri?.includes('ser');
  const [userName, setUserName] = useState(user?.fullName || 'Ayush Kesharwani');
  const [currentSpace, setCurrentSpace] = useState(isInitialSer ? 'ser-emY' : (user?.spaceSlug || 'office'));
  const [currentSpaceName, setCurrentSpaceName] = useState(isInitialSer ? 'ser' : (user?.spaceName || 'Office'));
  const [currentRoom, setCurrentRoom] = useState(user?.targetRoom || (isInitialSer ? 'Office A' : 'Boardroom'));
  const [currentRoomId, setCurrentRoomId] = useState(user?.targetRoomId || (isInitialSer ? 'office-a' : 'boardroom'));
  const [workspaceSlug, setWorkspaceSlug] = useState(user?.workspaceSlug || 'sunnkesh-4c24f4f3d747fffc');
  const [inAudioRange, setInAudioRange] = useState(['Alex', 'Wes', 'Stefan', 'Steven', 'Phil']);
  const [activeTab, setActiveTab] = useState('none'); // 'none', 'ai', 'team', 'chat', 'whiteboard', 'settings'
  const [activeReaction, setActiveReaction] = useState(null);
  const [donutToast, setDonutToast] = useState(null);
  const setToastMessage = (msg) => setDonutToast(msg);
  const [showNameplates, setShowNameplates] = useState(true);

  // Spot UI & Build Mode state (media_1791969443822.png & media_1791969444094.png)
  const [isBuildModeOpen, setIsBuildModeOpen] = useState(false);
  const [buildModeTab, setBuildModeTab] = useState('Floorplan'); // 'Add', 'Floorplan', 'Environment', 'Brand'
  const [currentEnvTheme, setCurrentEnvTheme] = useState('Seattle');
  const [isTopDownBlueprint, setIsTopDownBlueprint] = useState(false);
  const [isTrialBannerOpen, setIsTrialBannerOpen] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const envHandlerRef = useRef(null);

  // Audio / Media toggles
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHeadphonesOn, setIsHeadphonesOn] = useState(false);
  const [pushToTalkActive, setPushToTalkActive] = useState(false);

  // Real Screen Sharing (getDisplayMedia)
  const screenShareVideoRef = useRef(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);

  // Spot Dynamic Screen Displays & Sidebars
  const [activeScreenTarget, setActiveScreenTarget] = useState(null);
  const [activeScreenPos, setActiveScreenPos] = useState(null);
  const activeScreenTargetRef = useRef(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isSpacesSidebarOpen, setIsSpacesSidebarOpen] = useState(true); // Open by default matching reference
  const screensRef = useRef({});
  const screenTexturesRef = useRef(null);

  // Spot Tabletop Widgets & Link Modal
  const [isConnectFourOpen, setIsConnectFourOpen] = useState(false);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [isWatercoolerOpen, setIsWatercoolerOpen] = useState(false);
  const [isSpotLinkModalOpen, setIsSpotLinkModalOpen] = useState(false);
  const [isChessOpen, setIsChessOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isBilliardsOpen, setIsBilliardsOpen] = useState(false);
  const [isPingPongOpen, setIsPingPongOpen] = useState(false);
  const [isSwimming, setIsSwimming] = useState(false);
  const isSwimmingRef = useRef(false);

  // New Spot Virtual Widgets & Menus (media_1792293223270.png, media_1792293223278.png, media_1792293223292.png, media_1792293238602.png)
  const [isStickyNoteOpen, setIsStickyNoteOpen] = useState(false);
  const [isSharedBrowserOpen, setIsSharedBrowserOpen] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [isYouTubeOpen, setIsYouTubeOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isObjectsMenuOpen, setIsObjectsMenuOpen] = useState(false);
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [isRoomChatOpen, setIsRoomChatOpen] = useState(false);
  const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);
  const [roomSettingsTab, setRoomSettingsTab] = useState('overview');
  const [hoveredToolbarTooltip, setHoveredToolbarTooltip] = useState(null);
  const [hoverChairScreenPos, setHoverChairScreenPos] = useState(null);
  const [hoveredAvatarPopup, setHoveredAvatarPopup] = useState(null);
  const [proximityMode, setProximityMode] = useState(true);
  const [roomChatDraft, setRoomChatDraft] = useState('');
  const [roomMessages, setRoomMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Chen',
      text: 'Hey everyone! Welcome to the Lobby. The product showcase will begin shortly.',
      time: '11:42 AM'
    }
  ]);

  // Interactive Object Modals
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTeammate, setSelectedTeammate] = useState(null);

  // Spot Virtual Background state (from spotxyz/virtual-background)
  const [bgMode, setBgMode] = useState('blur'); // 'none', 'blur', 'spot-office', 'cyber'
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);

  // Spot Audio Devices configuration (from spotxyz/macos-audio-devices)
  const [audioDevices, setAudioDevices] = useState({ inputs: [], outputs: [] });
  const [selectedInput, setSelectedInput] = useState('');
  const [selectedOutput, setSelectedOutput] = useState('');
  const [spatialFalloff, setSpatialFalloff] = useState(8.5);
  const [noiseSuppression, setNoiseSuppression] = useState(true);

  // Spot OpenClaw Agent Gateway state (from spotxyz/spot-openclaw)
  const [openClawSubTab, setOpenClawSubTab] = useState('chat'); // 'chat' or 'console'
  const [toolLogs, setToolLogs] = useState([
    {
      time: '12:00:01',
      tool: 'spot_observe',
      result: { ok: true, worldId: 'spot-world-hq', avatarsCount: 11, roomsCount: 6, agentConnected: true }
    }
  ]);

  // AI Agent Chat state
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'DevBot',
      text: 'Welcome back Stan! The 3D virtual office is rebuilt with stylized humanoid avatars, high-poly ergonomic furniture, and photorealistic lighting. You can walk with WASD/Arrows, click to sit, share your screen, or execute spatial tools.',
      time: '12:10 PM'
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Room Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Steven', text: 'Headphones on for deep coding, ping me if needed!', time: '12:01 PM' },
    { sender: 'Graham', text: 'Fresh glazed doughnuts & fruit bowl on the long table! 🍩🍎', time: '12:05 PM' },
    { sender: 'Wes', text: 'KPI board is looking green today across all metrics.', time: '12:08 PM' }
  ]);

  // Whiteboard drawing state
  const whiteboardCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#2563eb');

  // Floating Nameplates projected to screen coordinates
  const [screenAvatars, setScreenAvatars] = useState([]);
  const [playerCoord, setPlayerCoord] = useState({ x: 0.3, z: 11.2 });

  // Three.js Scene References
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const playerMeshRef = useRef(null);
  const playerPartsRef = useRef(null);

  const getInitialPlayerPosition = () => {
    const tr = user?.targetRoom?.toLowerCase() || user?.targetRoomId?.toLowerCase() || '';
    if (tr.includes('auditorium')) {
      return new THREE.Vector3(18, 0, -10);
    }
    if (tr.includes('lounge c') || tr.includes('lounge-c') || tr.includes('concourse')) {
      return new THREE.Vector3(-10, 0, 1.5);
    }
    if (tr.includes('lobby')) {
      return new THREE.Vector3(0, 0, -38.5);
    }
    if (tr.includes('office a') || tr.includes('office-a') || isInitialSer) {
      return new THREE.Vector3(-4, 0, 16);
    }
    return new THREE.Vector3(-23, 0, -12.5); // Boardroom open walkway south of conference table
  };
  const targetPosRef = useRef(getInitialPlayerPosition());
  const isSittingRef = useRef(false);
  const chairRotYRef = useRef(0);
  const seatHeightRef = useRef(0.46);
  const avatarsRef = useRef([]);
  const chairsRef = useRef([]);
  const wavingHandMeshRef = useRef(null);
  const playerAnimStateRef = useRef({ emote: null, emoteTime: 0 });
  const keysPressedRef = useRef({});

  // Dynamic Camera Orbit, Zoom & Showcase Screen Presentation
  const cameraDistanceRef = useRef(4.8);
  const cameraOrbitAngleRef = useRef(0);
  const cameraPitchAngleRef = useRef(0.20); // GTA San Andreas third-person chase cam ~11.5° pitch
  const cameraTargetYOffsetRef = useRef(0);
  const isDraggingOrbitRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0, time: 0, button: 0 });
  const isPointerMovedRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastUiUpdateRef = useRef(0);
  const activeVideoTextureRef = useRef(null);
  const activeVideoElementRef = useRef(null);
  const screenTimerIntervalRef = useRef(null);
  const showcaseScreenRef = useRef(null);
  const [showcaseScreenTarget, setShowcaseScreenTarget] = useState(null);
  const cameraOverrideRef = useRef(null);

  // 1. Procedural Web Audio Sound Synthesizer
  const audioCtxRef = useRef(null);
  const playSound = (type) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'crunch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'highfive') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // 2. Enumerate Media Devices
  useEffect(() => {
    async function loadDevices() {
      try {
        if (navigator.mediaDevices?.enumerateDevices) {
          const devs = await navigator.mediaDevices.enumerateDevices();
          const inputs = devs.filter((d) => d.kind === 'audioinput');
          const outputs = devs.filter((d) => d.kind === 'audiooutput');
          setAudioDevices({ inputs, outputs });
          if (inputs.length > 0) setSelectedInput(inputs[0].deviceId);
          if (outputs.length > 0) setSelectedOutput(outputs[0].deviceId);
        }
      } catch (err) {
        console.warn('Media devices enumeration:', err);
      }
    }
    loadDevices();
  }, []);

  // Showcase Screen View and Content Handlers
  const showcaseScreen = (target) => {
    if (!target) return;
    showcaseScreenRef.current = target;
    setShowcaseScreenTarget(target);
    playSound('chime');
    setToastMessage(`Showcasing ${target.name}! 🎥`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const exitShowcaseScreen = () => {
    showcaseScreenRef.current = null;
    setShowcaseScreenTarget(null);
    playSound('click');
  };

  // Helper: Generates an unmistakable, high-energy 60 FPS live presentation stream with live timecode,
  // animated audio spectrum equalizer, presenter cards, and dynamic laser pointer so telecast is never static or blank
  const createActiveKeynoteStream = (streamTitle = 'Auditorium Cinema Keynote Broadcast', presenter = 'Ayush', mode = 'telecast') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const startTime = Date.now();

    const render = () => {
      frame++;
      const w = 1280;
      const h = 720;
      const elapsedMs = Date.now() - startTime;
      const elapsedSec = Math.floor(elapsedMs / 1000);
      const ms = Math.floor((elapsedMs % 1000) / 10);
      const timecode = `${String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:${String(elapsedSec % 60).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;

      // 1. Dark high-tech cyber gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Animated grid background
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridOffset = (frame * 0.6) % 40;
      for (let x = gridOffset; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = gridOffset; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. Top Header with Spot Branding & Flashing LIVE Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.fillRect(0, 0, w, 80);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 80);
      ctx.lineTo(w, 80);
      ctx.stroke();

      // Spot logo dot
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(55, 40, 14, 0, Math.PI * 2);
      ctx.fill();

      // Brand text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('spot virtual', 80, 48);

      // Screen location badge
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('● AUDITORIUM CINEMA SCREEN  •  CHANNEL #01 LIVE', 245, 48);

      // Flashing LIVE badge
      const pulse = (Math.sin(frame * 0.12) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.6})`;
      ctx.beginPath();
      ctx.roundRect(w - 380, 22, 130, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(w - 362, 40, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('LIVE TELECAST', w - 348, 45);

      // Timecode
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`REC ${timecode}`, w - 40, 46);

      // 4. Main Slide Canvas Card
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, 100, w - 80, h - 140, 16);
      ctx.fill();
      ctx.stroke();

      // Slide Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(streamTitle || 'Spot Virtual All-Hands Keynote: 3D Coworking & Live Telecast', 75, 155);

      // Presenter Info
      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px sans-serif';
      ctx.fillText(`Broadcasting live from ${presenter || 'Ayush'} • 1080p 60 FPS • Stereo Audio Sync`, 75, 188);

      // 3 Live Architectural & Telecast Status Cards
      const cards = [
        { title: 'Auditorium Stage', val: 'IMAX Cinema', sub: '4-Tier Theater Seating', col: '#10b981', x: 75 },
        { title: 'Screen Broadcast', val: '60 FPS 1080p', sub: 'Zero-Lag Canvas Sync', col: '#38bdf8', x: 460 },
        { title: 'Spatial Audio Nodes', val: '48 kHz Opus', sub: 'Zone Sound Isolation', col: '#a855f7', x: 845 }
      ];

      cards.forEach((c) => {
        ctx.fillStyle = '#111827';
        ctx.strokeStyle = c.col;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(c.x, 218, 355, 140, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.fillText(c.title, c.x + 20, 255);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(c.val, c.x + 20, 300);

        ctx.fillStyle = c.col;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`✓ ${c.sub}`, c.x + 20, 335);
      });

      // Animated Sound / Telemetry Visualizer Waveform at the bottom
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(75, 385, w - 150, 195, 12);
      ctx.fill();
      ctx.stroke();

      // Title above visualizer
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('REALTIME AUDIO / VIDEO TELEMETRY STREAM SPECTRUM', 95, 412);

      // Waveform bars
      const barCount = 46;
      const barWidth = 19;
      const barSpacing = 5;
      const startX = 95;
      for (let b = 0; b < barCount; b++) {
        const barHeight = Math.abs(Math.sin((b * 0.22) + frame * 0.09) * 95) + Math.abs(Math.cos((b * 0.38) - frame * 0.06) * 45) + 12;
        const barY = 560 - barHeight;
        const grad = ctx.createLinearGradient(0, barY, 0, 560);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.6, '#6366f1');
        grad.addColorStop(1, '#a855f7');
        ctx.fillStyle = grad;
        ctx.fillRect(startX + b * (barWidth + barSpacing), barY, barWidth, barHeight);
      }

      // Moving presenter laser pointer
      const cursorX = 260 + Math.sin(frame * 0.035) * 360;
      const cursorY = 300 + Math.cos(frame * 0.055) * 55;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.28)';
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    const intervalId = setInterval(render, 1000 / 30);
    render();
    const stream = canvas.captureStream(30);
    stream._renderInterval = intervalId;
    return stream;
  };

  // 3. Robust Real Screen Sharing & Telecast Engine
  const startScreenShare = async (specificScreenId) => {
    // Intelligently resolve the target screen
    const targetScreenId = specificScreenId ||
      activeScreenTargetRef.current?.id ||
      activeScreenTarget?.id ||
      (currentRoomId && currentRoomId.includes('auditorium') ? 'auditorium' : currentRoomId?.replace('-', '_')) ||
      'auditorium';

    let target = null;
    if (activeScreenTargetRef.current?.id === targetScreenId && activeScreenTargetRef.current?.mesh) {
      target = activeScreenTargetRef.current.mesh;
    } else if (activeScreenTarget?.id === targetScreenId && activeScreenTarget?.mesh) {
      target = activeScreenTarget.mesh;
    } else if (screensRef.current?.[targetScreenId]) {
      target = screensRef.current[targetScreenId];
    } else if (screensRef.current?.[`screen_${targetScreenId}`]) {
      target = screensRef.current[`screen_${targetScreenId}`];
    } else if (sceneRef.current) {
      target = sceneRef.current.getObjectByName(`screen_${targetScreenId}`) || sceneRef.current.getObjectByName(targetScreenId);
    }

    if (target?.userData?.displayMesh) {
      target = target.userData.displayMesh;
    }

    const screenName = target?.userData?.displayName || activeScreenTarget?.name || `Office Screen (${targetScreenId})`;

    let stream = null;
    let isLiveCapture = false;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // No artificial timeout: allow the user to comfortably choose Entire Screen / Window / Chrome Tab
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always',
            displaySurface: 'monitor',
            frameRate: { ideal: 60, max: 60 }
          },
          audio: false
        });
        isLiveCapture = true;
      }
    } catch (err) {
      console.log('Real screen capture unavailable or cancelled by user, falling back to live presentation broadcast:', err);
      if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
        setToastMessage('Display capture note: Launching high-res interactive telecast feed.');
      }
    }

    // If real hardware capture was cancelled or unsupported, use vibrant 60 FPS presentation telecast
    if (!stream) {
      stream = createActiveKeynoteStream('Auditorium Cinema Keynote Broadcast', userName, 'telecast');
    }

    setScreenStream(stream);
    setIsScreenSharing(true);
    setIsScreenModalOpen(true);

    // Clean up previous video element if any
    if (activeVideoElementRef.current) {
      try {
        activeVideoElementRef.current.pause();
        activeVideoElementRef.current.srcObject = null;
        if (activeVideoElementRef.current.parentNode) {
          activeVideoElementRef.current.parentNode.removeChild(activeVideoElementRef.current);
        }
      } catch (e) {}
    }

    // Attach to offscreen DOM container so Chromium decodes frames continuously without suspension
    let video = document.getElementById('spot-screen-telecast-sink');
    if (!video) {
      video = document.createElement('video');
      video.id = 'spot-screen-telecast-sink';
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.muted = true;
      video.autoplay = true;
      video.style.position = 'fixed';
      video.style.top = '-9999px';
      video.style.left = '-9999px';
      video.style.width = '32px';
      video.style.height = '32px';
      video.style.opacity = '0.001';
      video.style.pointerEvents = 'none';
      video.style.zIndex = '-9999';
      document.body.appendChild(video);
    }

    video.srcObject = stream;
    video.muted = true;
    try {
      await video.play();
    } catch (e) {
      console.warn('Video play error:', e);
    }

    activeVideoElementRef.current = video;

    // Project real-time video texture directly onto this specific 3D display
    const vidTex = new THREE.VideoTexture(video);
    vidTex.colorSpace = THREE.SRGBColorSpace;
    vidTex.minFilter = THREE.LinearFilter;
    vidTex.magFilter = THREE.LinearFilter;
    vidTex.generateMipmaps = false;
    activeVideoTextureRef.current = vidTex;

    if (target && target.material) {
      target.material.map = vidTex;
      target.material.needsUpdate = true;
    }

    // Light up screen bezel / casing back-light
    if (target?.parent?.children) {
      target.parent.children.forEach((c) => {
        if (c.isPointLight) {
          c.color.setHex(0x38bdf8);
          c.intensity = 1.6;
        }
      });
    }

    playSound('chime');
    setToastMessage(`Telecasting live screen to ${screenName}! 🖥️`);
    setTimeout(() => setToastMessage(null), 3500);

    setChatMessages((prev) => [
      ...prev,
      { sender: userName, text: `🖥️ *started telecasting live screen to ${screenName}!*`, time: 'Just now' }
    ]);

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.onended = () => {
        stopScreenShare(targetScreenId);
      };
    }
    return true;
  };

  // Synchronize Screen Share Stream into the Live Broadcast PiP Video Element
  useEffect(() => {
    if (isScreenSharing && isScreenModalOpen && screenShareVideoRef.current && screenStream) {
      screenShareVideoRef.current.srcObject = screenStream;
      screenShareVideoRef.current.play().catch(() => {});
    }
  }, [isScreenSharing, isScreenModalOpen, screenStream]);

  const stopScreenShare = (screenId) => {
    if (screenStream) {
      if (screenStream._renderInterval) clearInterval(screenStream._renderInterval);
      screenStream.getTracks().forEach((t) => t.stop());
    }
    setScreenStream(null);
    setIsScreenSharing(false);
    setIsScreenModalOpen(false);

    if (activeVideoElementRef.current) {
      try {
        activeVideoElementRef.current.pause();
        activeVideoElementRef.current.srcObject = null;
        activeVideoElementRef.current = null;
      } catch (e) {}
    }
    activeVideoTextureRef.current = null;

    const targetScreenId = screenId ||
      activeScreenTargetRef.current?.id ||
      activeScreenTarget?.id ||
      (currentRoomId && currentRoomId.includes('auditorium') ? 'auditorium' : currentRoomId?.replace('-', '_')) ||
      'auditorium';

    let target = null;
    if (screensRef.current?.[targetScreenId]) {
      target = screensRef.current[targetScreenId];
    } else if (screensRef.current?.[`screen_${targetScreenId}`]) {
      target = screensRef.current[`screen_${targetScreenId}`];
    } else if (sceneRef.current) {
      target = sceneRef.current.getObjectByName(`screen_${targetScreenId}`) || sceneRef.current.getObjectByName(targetScreenId);
    }
    if (target?.userData?.displayMesh) target = target.userData.displayMesh;

    if (target && target.material) {
      // Restore authentic role-specific texture
      const texSys = screenTexturesRef.current;
      let defaultTex = texSys?.createStarryLogoTexture ? texSys.createStarryLogoTexture() : texSys?.starryLogoTexture;
      if (targetScreenId.includes('conference_b') && texSys?.createSprintBoardTexture) {
        defaultTex = texSys.createSprintBoardTexture();
      } else if (targetScreenId.includes('conference_a') && texSys?.kpiTexture) {
        defaultTex = texSys.kpiTexture;
      } else if (targetScreenId.includes('auditorium') && texSys?.createAuditoriumKeynoteTexture) {
        defaultTex = texSys.createAuditoriumKeynoteTexture();
      } else if (targetScreenId.includes('workspace') && texSys?.createCiCdMonitorTexture) {
        defaultTex = texSys.createCiCdMonitorTexture();
      } else if (targetScreenId.startsWith('desk_') && texSys?.createCodeEditorTexture) {
        defaultTex = texSys.createCodeEditorTexture();
      }
      if (defaultTex) {
        defaultTex.colorSpace = THREE.SRGBColorSpace;
        target.material.map = defaultTex;
        target.material.needsUpdate = true;
      }

      // Reset casing glow
      if (target?.parent?.children) {
        target.parent.children.forEach((c) => {
          if (c.isPointLight) {
            c.color.setHex(0x22c55e);
            c.intensity = 0.4;
          }
        });
      }
    }
    playSound('click');
    setToastMessage('Stopped screen telecast.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Real Camera Streaming directly to screen
  const startCameraStream = async (specificScreenId) => {
    const targetScreenId = specificScreenId ||
      activeScreenTargetRef.current?.id ||
      activeScreenTarget?.id ||
      (currentRoomId && currentRoomId.includes('auditorium') ? 'auditorium' : currentRoomId?.replace('-', '_')) ||
      'auditorium';

    let target = null;
    if (activeScreenTargetRef.current?.id === targetScreenId && activeScreenTargetRef.current?.mesh) {
      target = activeScreenTargetRef.current.mesh;
    } else if (activeScreenTarget?.id === targetScreenId && activeScreenTarget?.mesh) {
      target = activeScreenTarget.mesh;
    } else if (screensRef.current?.[targetScreenId]) {
      target = screensRef.current[targetScreenId];
    } else if (screensRef.current?.[`screen_${targetScreenId}`]) {
      target = screensRef.current[`screen_${targetScreenId}`];
    } else if (sceneRef.current) {
      target = sceneRef.current.getObjectByName(`screen_${targetScreenId}`) || sceneRef.current.getObjectByName(targetScreenId);
    }
    if (target?.userData?.displayMesh) target = target.userData.displayMesh;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

      if (activeVideoElementRef.current) {
        try {
          activeVideoElementRef.current.pause();
          activeVideoElementRef.current.srcObject = null;
          if (activeVideoElementRef.current.parentNode) {
            activeVideoElementRef.current.parentNode.removeChild(activeVideoElementRef.current);
          }
        } catch (e) {}
      }

      let video = document.getElementById('spot-screen-telecast-sink');
      if (!video) {
        video = document.createElement('video');
        video.id = 'spot-screen-telecast-sink';
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.muted = true;
        video.autoplay = true;
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.style.width = '32px';
        video.style.height = '32px';
        video.style.opacity = '0.001';
        video.style.pointerEvents = 'none';
        video.style.zIndex = '-9999';
        document.body.appendChild(video);
      }

      video.srcObject = stream;
      video.muted = true;
      await video.play();

      activeVideoElementRef.current = video;

      const vidTex = new THREE.VideoTexture(video);
      vidTex.colorSpace = THREE.SRGBColorSpace;
      vidTex.minFilter = THREE.LinearFilter;
      vidTex.magFilter = THREE.LinearFilter;
      vidTex.generateMipmaps = false;
      activeVideoTextureRef.current = vidTex;

      if (target && target.material) {
        target.material.map = vidTex;
        target.material.needsUpdate = true;
      }

      if (target?.parent?.children) {
        target.parent.children.forEach((c) => {
          if (c.isPointLight) {
            c.color.setHex(0x10b981);
            c.intensity = 1.6;
          }
        });
      }

      playSound('chime');
      setToastMessage('Live camera stream broadcast on screen! 📹');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.warn('Camera access denied:', err);
      setToastMessage('Camera permission denied or camera device not found.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // 4. Keyboard WASD & Spacebar PTT Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        keysPressedRef.current[e.code] = true;
        isSittingRef.current = false;
      }

      if (e.code === 'KeyN') {
        setShowNameplates((prev) => !prev);
      }

      if (e.code === 'Escape') {
        if (showcaseScreenRef.current) {
          exitShowcaseScreen();
        }
      }

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setPushToTalkActive(true);
        setIsMuted(false);
        playSound('click');
      }
    };

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        keysPressedRef.current[e.code] = false;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setPushToTalkActive(false);
        setIsMuted(true);
        playSound('click');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 5. Virtual Background Webcam Stream Pipeline
  useEffect(() => {
    let stream = null;
    let animFrame = null;

    if (isVideoOn) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('Webcam permission not granted; using fallback simulator:', err);
        });

      const renderVideoCanvas = () => {
        const canvas = videoCanvasRef.current;
        const video = videoRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          if (video && video.readyState >= 2) {
            if (bgMode === 'blur') {
              ctx.filter = 'blur(10px)';
              ctx.drawImage(video, 0, 0, w, h);
              ctx.filter = 'none';
              ctx.save();
              ctx.beginPath();
              ctx.ellipse(w / 2, h / 2 + 10, w * 0.32, h * 0.44, 0, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(video, 0, 0, w, h);
              ctx.restore();
            } else if (bgMode === 'spot-office') {
              const bgGrad = ctx.createLinearGradient(0, 0, w, h);
              bgGrad.addColorStop(0, '#eedfce');
              bgGrad.addColorStop(1, '#94a3b8');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.arc(30, 30, 8, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#1e293b';
              ctx.font = 'bold 12px sans-serif';
              ctx.fillText('spot HQ', 45, 34);
              ctx.save();
              ctx.beginPath();
              ctx.ellipse(w / 2, h / 2 + 10, w * 0.34, h * 0.45, 0, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(video, 0, 0, w, h);
              ctx.restore();
            } else if (bgMode === 'cyber') {
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(0, 0, w, h);
              ctx.strokeStyle = '#06b6d4';
              ctx.lineWidth = 1;
              for (let x = 0; x < w; x += 30) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
              }
              for (let y = 0; y < h; y += 30) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
              }
              ctx.save();
              ctx.beginPath();
              ctx.ellipse(w / 2, h / 2 + 10, w * 0.34, h * 0.45, 0, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(video, 0, 0, w, h);
              ctx.restore();
            } else {
              ctx.filter = 'none';
              ctx.drawImage(video, 0, 0, w, h);
            }
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(w / 2, h / 2 - 20, 48, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(w / 2, h / 2 + 65, 75, 45, 0, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(userName, w / 2, h - 25);
          }
        }
        animFrame = requestAnimationFrame(renderVideoCanvas);
      };
      animFrame = requestAnimationFrame(renderVideoCanvas);
    }

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isVideoOn, bgMode, userName]);

  // 6. Three.js Main Office Environment (ACES Filmic Tone Mapping + Precision Camera)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc9e0e8);
    scene.fog = new THREE.FogExp2(0xc9e0e8, 0.0042);
    sceneRef.current = scene;

    // Authentic GTA San Andreas third-person gameplay camera with 54° FOV and cinematic depth
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(54, aspect, 0.2, 600);
    // Initial third-person chase camera position
    const initPos = targetPosRef.current;
    camera.position.set(initPos.x + 1.2, 2.4, initPos.z + 4.6);
    camera.lookAt(initPos.x, 1.45, initPos.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    chairsRef.current = [];

    // Build Screen Textures
    const screenTextures = createOfficeScreenTextures();
    screenTexturesRef.current = screenTextures;

    // Build Architecture Environment & Lighting
    const envHandler = buildOfficeEnvironment(scene, screenTextures, currentEnvTheme);
    envHandlerRef.current = envHandler;

    // Build Office Furniture, Desks, Cantilever Chairs, Props
    screensRef.current = buildOfficeFurniture(scene, screenTextures, chairsRef);

    // Build Stylized 3D Humanoid Avatars
    const avatarSystem = createAvatarSystem();
    const playerConfig = {
      name: userName || user?.fullName || 'Ayush (you)',
      skinColor: user?.skinTone || 0xf6d5be,
      gender: user?.avatarGender || 'male',
      hairType: user?.hairType || (user?.avatarGender === 'female' ? 'long_waves_headphones' : 'black_waves'),
      hairColor: user?.hairColor,
      faceType: user?.faceType,
      mouthType: user?.mouthType,
      noseType: user?.noseType,
      clothing: user?.clothing,
      shirtColor: user?.shirtColor || 0xdc2626,
      pantsType: user?.pantsType,
      pantsColor: user?.pantsColor,
      shoesType: user?.shoesType,
      shoesColor: user?.shoesColor
    };
    const roster = avatarSystem.createRoster(scene, playerConfig);
    avatarsRef.current = roster;

    const playerObj = roster.find((a) => a.isPlayer);
    if (playerObj) {
      playerMeshRef.current = playerObj.mesh;
      playerPartsRef.current = playerObj.parts;

      // Spawn player at targetRoom if specified in user prop or URL
      const initialRoom = user?.targetRoom || currentRoom;
      if (initialRoom) {
        const clean = initialRoom.toLowerCase();
        let target = new THREE.Vector3(-23, 0, -12.5);
        let slug = 'boardroom';
        let formattedName = 'Boardroom';
        if (clean.includes('auditorium')) {
          target.set(18, 0, -10);
          slug = 'auditorium';
          formattedName = 'Auditorium';
        } else if (clean.includes('conference b') || clean.includes('cabin') || clean.includes('conference')) {
          target.set(-4, 0, -11.5);
          slug = 'conference-b';
          formattedName = 'Meeting Cabin';
        } else if (clean.includes('conference a') || clean.includes('promenade')) {
          target.set(29.4, 0, 12);
          slug = 'conference-a';
          formattedName = 'Window Promenade';
        } else if (clean.includes('lounge c') || clean.includes('concourse')) {
          target.set(-10, 0, 1.5);
          slug = 'lounge-c';
          formattedName = 'Lounge C';
        } else if (clean.includes('patio') || clean.includes('terrace')) {
          target.set(-23, 0, 19);
          slug = 'patio';
          formattedName = 'Patio';
        } else if (clean.includes('cubicle-1') || clean.includes('cubicle 1')) {
          target.set(-22.5, 0, 11);
          slug = 'cubicle-1';
          formattedName = 'Focus Cubicle 1';
        } else if (clean.includes('cubicle-2') || clean.includes('cubicle 2')) {
          target.set(-16.5, 0, 11);
          slug = 'cubicle-2';
          formattedName = 'Focus Cubicle 2';
        } else if (clean.includes('workspace')) {
          target.set(0, 0, 16);
          slug = 'workspace-a';
          formattedName = 'Workspace A';
        } else if (clean.includes('lobby')) {
          target.set(0, 0, -38.5);
          slug = 'lobby';
          formattedName = 'Lobby';
        }
        playerObj.mesh.position.copy(target);
        targetPosRef.current.copy(target);
        setCurrentRoom(formattedName);
        setCurrentRoomId(slug);
        if (slug === 'auditorium') {
          playerObj.mesh.rotation.y = Math.PI / 2; // Face East towards cinema stage and screen
          cameraOrbitAngleRef.current = -Math.PI / 2; // Camera behind player (West), looking East
          cameraPitchAngleRef.current = 0.22;
          cameraDistanceRef.current = 6.0;
          cameraTargetYOffsetRef.current = 0;
          camera.position.set(target.x - 5.8, 2.4, target.z);
          camera.lookAt(target.x + 2.5, 1.45, target.z);
        } else if (slug === 'conference-a') {
          playerObj.mesh.rotation.y = Math.PI / 2; // Face East towards promenade windows
          cameraOrbitAngleRef.current = -Math.PI / 2;
          cameraPitchAngleRef.current = 0.20;
          cameraDistanceRef.current = 4.8;
          cameraTargetYOffsetRef.current = 0;
          camera.position.set(target.x - 4.6, 2.4, target.z);
          camera.lookAt(target.x + 2.0, 1.45, target.z);
        } else if (slug === 'lobby') {
          playerObj.mesh.rotation.y = Math.PI; // Face North towards skyline
          cameraOrbitAngleRef.current = 0; // Camera at South, behind player looking North
          cameraPitchAngleRef.current = 0.12; // Level horizon view
          cameraDistanceRef.current = 4.2;
          cameraTargetYOffsetRef.current = 0;
          camera.position.set(target.x, 1.85, target.z + 4.2);
          camera.lookAt(target.x, 1.35, target.z - 4.5);
        } else {
          playerObj.mesh.rotation.y = Math.PI; // Face North into room (away from camera)
          cameraOrbitAngleRef.current = 0; // Camera at South, behind player looking North
          cameraPitchAngleRef.current = 0.20;
          cameraDistanceRef.current = 4.8;
          cameraTargetYOffsetRef.current = 0;
          camera.position.set(target.x, 2.4, target.z + 4.6);
          camera.lookAt(target.x, 1.45, target.z - 2.5);
        }
      }
    }

    const sarahObj = roster.find((a) => a.name === 'Sarah');
    if (sarahObj && sarahObj.parts?.wavingHandMesh) {
      wavingHandMeshRef.current = sarahObj.parts.wavingHandMesh;
    }

    // Raycast Interaction & Click-to-Sit Engine
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      if (e.target.closest('header, aside, .Platform_uiDock, .Platform_toast, .Platform_modal, .Platform_minimap, button')) return;

      pointerDownPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now(), button: e.button };
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      isDraggingOrbitRef.current = true;
      isPointerMovedRef.current = false;
      if (renderer?.domElement) {
        renderer.domElement.style.cursor = 'grabbing';
      }
      document.body.style.cursor = 'grabbing';
    };

    const handleSceneClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Priority 1: Check if ANY intersected object is a Screen
        for (let i = 0; i < Math.min(intersects.length, 12); i++) {
          let obj = intersects[i].object;
          while (obj && obj !== scene) {
            if (obj.name?.startsWith('screen_') || obj.name?.startsWith('casing_screen_') || obj.userData?.isSpotScreen) {
              playSound('chime');
              const targetMesh = obj.userData?.displayMesh || (obj.isMesh && obj.name.startsWith('screen_') ? obj : null) || (obj.parent?.getObjectByName(obj.name.replace('casing_', '')));
              const rawKey = obj.userData?.screenKey || obj.name.replace('casing_', '').replace('screen_', '');
              const screenId = rawKey.replace('_north', '');

              const screenDisplayNames = {
                boardroom: 'Boardroom Presentation Screen',
                conference_b: 'Conference Room B Presentation Screen',
                conference_a: 'Conference Room A Presentation Screen',
                auditorium: 'Auditorium Main Stage Display',
                workspace_a: 'Workspace A Team Display',
                chat_a: 'Chat A Monitor',
                chat_b: 'Chat B Monitor',
                lounge_a: 'Lounge A Video Wall'
              };

              const targetData = {
                id: screenId,
                name: screenDisplayNames[screenId] || obj.userData?.displayName || `Office Display (${screenId})`,
                mesh: targetMesh || obj
              };
              activeScreenTargetRef.current = targetData;
              setActiveScreenTarget(targetData);

              // Immediately compute initial 2D screenPos
              if (targetData.mesh && camera && container) {
                const sPos = new THREE.Vector3();
                targetData.mesh.getWorldPosition(sPos);
                const sHeight = targetData.mesh.userData?.height || 2.7;
                sPos.y += sHeight / 2 + 0.12;
                sPos.project(camera);
                if (sPos.z < 1) {
                  const cWidth = container.clientWidth || window.innerWidth;
                  const cHeight = container.clientHeight || window.innerHeight;
                  const sx = Math.round(((sPos.x + 1) * cWidth) / 2);
                  const sy = Math.round(((-sPos.y + 1) * cHeight) / 2);
                  setActiveScreenPos({ x: sx, y: sy });
                }
              }
              return;
            }
            obj = obj.parent;
          }
        }

        // Priority 2: Check for interactive tabletop widgets, doughnuts, apples, avatars, or audio puck
        for (let i = 0; i < Math.min(intersects.length, 8); i++) {
          let clickedObj = intersects[i].object;
          while (clickedObj && clickedObj !== scene) {
            if (clickedObj.name === 'doughnutPlate') {
              playSound('crunch');
              setDonutToast('Stan grabbed a fresh glazed doughnut! 🍩');
              setTimeout(() => setDonutToast(null), 3000);
              return;
            }
            if (clickedObj.name === 'appleBowl') {
              playSound('crunch');
              setDonutToast('Stan grabbed a crisp red apple! 🍎');
              setTimeout(() => setDonutToast(null), 3000);
              return;
            }
            if (clickedObj.name === 'widget_connectFour') {
              playSound('chime');
              setIsConnectFourOpen(true);
              return;
            }
            if (clickedObj.name === 'widget_spinWheel') {
              playSound('chime');
              setIsSpinWheelOpen(true);
              return;
            }
            if (clickedObj.name === 'widget_watercooler') {
              playSound('chime');
              setIsWatercoolerOpen(true);
              return;
            }
            if (clickedObj.name === 'clickable_chessboard' || clickedObj.userData?.isChessboard) {
              playSound('chime');
              setIsChessOpen(true);
              return;
            }
            if (clickedObj.name === 'clickable_arcade' || clickedObj.userData?.isArcade) {
              playSound('chime');
              setIsArcadeOpen(true);
              return;
            }
            if (clickedObj.name === 'clickable_billiards' || clickedObj.userData?.isBilliards) {
              playSound('chime');
              setIsBilliardsOpen(true);
              return;
            }
            if (clickedObj.name === 'clickable_pingpong' || clickedObj.userData?.isPingPong) {
              playSound('chime');
              setIsPingPongOpen(true);
              return;
            }
            if (clickedObj.name === 'confAudioPuck') {
              playSound('click');
              setIsMuted((prev) => !prev);
              setDonutToast(!isMuted ? 'Conference Room B: Muted 🔇' : 'Conference Room B: Unmuted 🎙️');
              setTimeout(() => setDonutToast(null), 3000);
              return;
            }
            if (clickedObj.name?.startsWith('avatar_')) {
              const rawName = clickedObj.name.replace('avatar_head_', '').replace('avatar_', '');
              const av = roster.find((a) => a.name === rawName && !a.isPlayer);
              if (av) {
                playSound('click');
                setSelectedTeammate(av);
                setActiveModal('teammate');
                return;
              }
            }
            clickedObj = clickedObj.parent;
          }
        }

        // Priority 2.5: Interactive Swinging Doors (Click to Open/Close)
        for (let i = 0; i < Math.min(intersects.length, 8); i++) {
          let doorObj = intersects[i].object;
          while (doorObj && doorObj !== scene) {
            if (doorObj.userData?.isInteractiveDoor || doorObj.name === 'doorway_group') {
              playSound('click');
              const nowOpen = doorObj.userData?.toggleDoor ? doorObj.userData.toggleDoor() : false;
              setToastMessage(nowOpen ? 'Opened office door! 🚪' : 'Closed office door! 🚪');
              setTimeout(() => setToastMessage(null), 2500);
              return;
            }
            doorObj = doorObj.parent;
          }
        }

        // Helper: Execute sit on chair with proper rotation, seat height, and camera calibration
        const executeSitOnChair = (chairObj, clickPt = null) => {
          if (!chairObj) return false;
          let chairPos = chairObj.userData?.chairPos;
          let chairRotY = chairObj.userData?.chairRotY ?? 0;
          let seatHeight = chairObj.userData?.seatHeight ?? 0.46;
          const isAudBench = chairObj.userData?.name?.toLowerCase().includes('auditorium') || chairObj.name?.includes('bench');

          if (isAudBench && chairsRef.current.length > 0 && clickPt) {
            const nearest = chairsRef.current
              .filter((c) => c.name?.toLowerCase().includes('auditorium'))
              .reduce((closest, chair) => {
                const d = chair.pos.distanceTo(clickPt);
                return !closest || d < closest.dist ? { chair, dist: d } : closest;
              }, null);
            if (nearest && nearest.dist < 3.5) {
              chairPos = nearest.chair.pos;
              chairRotY = nearest.chair.rot ?? (Math.PI / 2);
              seatHeight = nearest.chair.seatHeight ?? 0.46;
            }
          }

          if (chairPos) {
            playSound('click');
            if (playerMeshRef.current) {
              playerMeshRef.current.position.set(chairPos.x, seatHeight - 0.40, chairPos.z);
              playerMeshRef.current.rotation.y = chairRotY;
            }
            targetPosRef.current.set(chairPos.x, 0, chairPos.z);
            chairRotYRef.current = chairRotY;
            seatHeightRef.current = seatHeight;
            isSittingRef.current = true;

            if (isAudBench || (chairPos.x >= 10 && chairPos.z < 4)) {
              cameraOrbitAngleRef.current = -Math.PI / 2;
              cameraPitchAngleRef.current = 0.26;
              cameraDistanceRef.current = 22.0;
              cameraTargetYOffsetRef.current = 0;
            }
            return true;
          }
          return false;
        };
        window.__spotExecuteSitOnChair = executeSitOnChair;

        // Priority 3: Responsive Click-to-Sit & Seamless Seat Switching on chairs, armchairs, sofas, and benches
        for (let i = 0; i < Math.min(intersects.length, 6); i++) {
          let chairObj = intersects[i].object;
          while (chairObj && chairObj !== scene) {
            if (chairObj.name === 'clickable_chair' || chairObj.userData?.isChair || chairObj.name?.startsWith('chair_') || chairObj.name?.startsWith('sofa_')) {
              if (executeSitOnChair(chairObj, intersects[i].point)) return;

              const nearestChair = chairsRef.current.reduce((closest, chair) => {
                const d = chair.pos.distanceTo(intersects[i].point);
                return !closest || d < closest.dist ? { chair, dist: d } : closest;
              }, null);

              if (nearestChair && nearestChair.dist < 5.0) {
                playSound('click');
                const nPos = nearestChair.chair.pos;
                const nRot = nearestChair.chair.rot ?? 0;
                const nSeatHeight = nearestChair.chair.seatHeight ?? 0.46;
                if (playerMeshRef.current) {
                  playerMeshRef.current.position.set(nPos.x, nSeatHeight - 0.40, nPos.z);
                  playerMeshRef.current.rotation.y = nRot;
                }
                targetPosRef.current.set(nPos.x, 0, nPos.z);
                chairRotYRef.current = nRot;
                seatHeightRef.current = nSeatHeight;
                isSittingRef.current = true;

                if (nearestChair.chair.name?.toLowerCase().includes('auditorium') || (nPos.x >= 10 && nPos.z < 4)) {
                  cameraOrbitAngleRef.current = -Math.PI / 2;
                  cameraPitchAngleRef.current = 0.26;
                  cameraDistanceRef.current = 22.0;
                  cameraTargetYOffsetRef.current = 0;
                }
                return;
              }
            }
            chairObj = chairObj.parent;
          }
        }

        const point = intersects[0].point;
        if (isSittingRef.current && playerMeshRef.current) {
          playerMeshRef.current.position.y = 0;
        }
        targetPosRef.current.set(point.x, 0, point.z);
        isSittingRef.current = false;
        playSound('click');

        // Authentic Spot Virtual rooms detection based on floor coordinates (Mega-Campus layout)
        let detectedRoom = 'Grand Central Atrium';
        let detectedSlug = 'grand-atrium';

        // Check new Mega-Campus wings first
        if (point.x < -26 && point.z > 8) {
          detectedRoom = 'Fitness & Gym Center';
          detectedSlug = 'gym';
        } else if (point.x > 26 && point.z > 8) {
          detectedRoom = 'Swimming Pool & Sun Deck';
          detectedSlug = 'swimming-pool';
        } else if (point.x >= -20 && point.x <= 20 && point.z > 20) {
          detectedRoom = 'Arcade & Game Zone';
          detectedSlug = 'game-zone';
        } else if (point.x < -26 && point.z < -8) {
          detectedRoom = 'Executive Cabins';
          detectedSlug = 'executive-cabins';
        } else if (point.x >= -16 && point.x <= 16 && point.z >= -8 && point.z <= 16) {
          detectedRoom = 'Grand Central Atrium';
          detectedSlug = 'grand-atrium';
        } else if (point.z < -8) {
          // North wing (Boardroom, Meeting Cabin, Auditorium)
          if (point.x < -14) {
            detectedRoom = 'Boardroom';
            detectedSlug = 'boardroom';
          } else if (point.x < 6) {
            detectedRoom = 'Meeting Cabin';
            detectedSlug = 'conference-b';
          } else {
            detectedRoom = 'Auditorium';
            detectedSlug = 'auditorium';
          }
        } else if (point.x >= 6 && point.z < 4) {
          // Auditorium open atrium stage and tiered seating
          detectedRoom = 'Auditorium';
          detectedSlug = 'auditorium';
        } else if (point.x >= 22 && point.z >= 4) {
          // East Window Promenade
          detectedRoom = 'Window Promenade';
          detectedSlug = 'conference-a';
        } else if (point.z > 8) {
          // South wing
          if (point.x < -14) {
            if (point.z > 14) {
              detectedRoom = 'Patio';
              detectedSlug = 'patio';
            } else if (point.x < -19.5) {
              detectedRoom = 'Focus Cubicle 1';
              detectedSlug = 'cubicle-1';
            } else {
              detectedRoom = 'Focus Cubicle 2';
              detectedSlug = 'cubicle-2';
            }
          } else if (point.x > 12) {
            detectedRoom = 'Lobby';
            detectedSlug = 'lobby';
          } else {
            detectedRoom = 'Workspace A';
            detectedSlug = 'workspace-a';
          }
        } else {
          // Central concourse
          detectedRoom = 'Lounge C';
          detectedSlug = 'lounge-c';
        }

        setCurrentRoom(detectedRoom);
        setCurrentRoomId(detectedSlug);
      }
    };

    // Helper: Precise Acoustic Zone & Room Detection
    const getAcousticZone = (pos) => {
      if (!pos) return 'open-floor';
      const { x, z } = pos;
      if (z < -25) return 'lobby';
      if (x < -26 && z > 8) return 'gym';
      if (x > 26 && z > 8) return 'swimming-pool';
      if (x >= -20 && x <= 20 && z > 20) return 'game-zone';
      if (x < -26 && z < -8) return 'executive-cabins';
      if (x >= -16 && x <= 16 && z >= -8 && z <= 16) return 'grand-atrium';
      if (x >= -26 && x <= -14 && z >= 8 && z <= 14) {
        return x < -19.5 ? 'cubicle-1' : 'cubicle-2';
      }
      if (z < -8) {
        if (x < -14) return 'boardroom';
        if (x < 6) return 'conference-b';
        return 'auditorium';
      }
      if (x >= 6 && z < 4) return 'auditorium';
      if (x >= 22 && z >= 4) return 'conference-a';
      if (z > 8) {
        if (x < -14 && z > 14) return 'patio';
        return 'workspace-a';
      }
      return 'open-floor';
    };

    const getRoomDisplayName = (pos) => {
      if (!pos) return 'Workspace';
      const { x, z } = pos;
      if (z < -25) return 'Lobby';
      if (x < -26 && z > 8) return 'Fitness & Gym Center';
      if (x > 26 && z > 8) return 'Swimming Pool & Sun Deck';
      if (x >= -20 && x <= 20 && z > 20) return 'Arcade & Game Zone';
      if (x < -26 && z < -8) return 'Executive Cabins';
      if (x >= -16 && x <= 16 && z >= -8 && z <= 16) return 'Grand Central Atrium';
      if (z < -8) {
        if (x < -14) return 'Boardroom';
        if (x < 6) return 'Meeting Cabin';
        return 'Auditorium';
      }
      if (x >= 6 && z < 4) return 'Auditorium';
      if (x >= 22 && z >= 4) return 'Window Promenade';
      if (x < -14 && z >= -8) {
        if (z > 14) return 'Patio';
        if (x < -19.5) return 'Focus Cubicle 1';
        return 'Focus Cubicle 2';
      }
      return 'Workspace A';
    };

    // Animation Loop (Silky 60 FPS without React lag)
    let animId;
    let lastTime = performance.now();
    const startTime = performance.now();
    let walkCycle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;

      // Realtime video texture updates for screen sharing
      if (activeVideoTextureRef.current) {
        activeVideoTextureRef.current.needsUpdate = true;
      }

      // Sarah's waving cartoon hand
      if (wavingHandMeshRef.current) {
        wavingHandMeshRef.current.rotation.z = Math.sin(elapsed * 5) * 0.22;
      }

      // Swimming Pool Water Gentle Ripples
      if (scene.userData.poolWaterMesh) {
        scene.userData.poolWaterMesh.position.y = -0.15 + Math.sin(elapsed * 2.2) * 0.025;
      }

      // Animate interactive doors & proximity opening
      const doors = scene.userData.interactiveDoors;
      if (doors && doors.length > 0) {
        for (let d = 0; d < doors.length; d++) {
          const dg = doors[d];
          if (dg.userData?.doorLPivot) {
            dg.userData.currentAngle = THREE.MathUtils.lerp(
              dg.userData.currentAngle,
              dg.userData.targetAngle || 0,
              0.14
            );
            dg.userData.doorLPivot.rotation.y = -dg.userData.currentAngle;
            if (dg.userData.doorRPivot) {
              dg.userData.doorRPivot.rotation.y = dg.userData.currentAngle;
            }
          }

          if (playerMeshRef.current && dg.userData?.center) {
            const distToDoor = playerMeshRef.current.position.distanceTo(dg.userData.center);
            if (distToDoor < 2.4 && !dg.userData.isOpen) {
              dg.userData.toggleDoor(true);
              playSound('click');
            } else if (distToDoor > 3.4 && dg.userData.isOpen) {
              dg.userData.toggleDoor(false);
            }
          }
        }
      }

      // Collision Resolution Engine against officeWalls and closed interactiveDoors
      const resolveWallCollision = (curX, curZ, stepX, stepZ) => {
        const playerRadius = 0.40;
        const walls = scene.userData.officeWalls || [];
        const doorsList = scene.userData.interactiveDoors || [];

        const collidesAt = (px, pz) => {
          // Perimeter boundaries for 120m x 96m Mega-Campus (X: ±58, Z: ±46)
          if (Math.abs(pz) > 45.4) return true;
          if (Math.abs(px) > 57.4) return true;

          // Check interior walls
          for (let i = 0; i < walls.length; i++) {
            const w = walls[i];
            const hw = w.width / 2 + playerRadius;
            const hd = w.depth / 2 + playerRadius;
            if (
              px >= w.center.x - hw &&
              px <= w.center.x + hw &&
              pz >= w.center.z - hd &&
              pz <= w.center.z + hd
            ) {
              return true;
            }
          }

          // Check closed doors
          for (let j = 0; j < doorsList.length; j++) {
            const dg = doorsList[j];
            if (!dg.userData?.isOpen && dg.userData?.center) {
              const dc = dg.userData.center;
              const rot = dg.rotation.y || 0;
              const isRotated = Math.abs(Math.sin(rot)) > 0.5;
              const dWidth = isRotated ? (dg.userData.depth || 0.4) : (dg.userData.width || 2.8);
              const dDepth = isRotated ? (dg.userData.width || 2.8) : (dg.userData.depth || 0.4);
              const hw = dWidth / 2 + playerRadius;
              const hd = dDepth / 2 + playerRadius;
              if (
                px >= dc.x - hw &&
                px <= dc.x + hw &&
                pz >= dc.z - hd &&
                pz <= dc.z + hd
              ) {
                return true;
              }
            }
          }
          return false;
        };

        const nextX = curX + stepX;
        const nextZ = curZ + stepZ;

        if (!collidesAt(nextX, nextZ)) {
          return { x: nextX, z: nextZ };
        }
        // Wall sliding on X
        if (!collidesAt(nextX, curZ)) {
          return { x: nextX, z: curZ };
        }
        // Wall sliding on Z
        if (!collidesAt(curX, nextZ)) {
          return { x: curX, z: nextZ };
        }
        return { x: curX, z: curZ };
      };

      // Process Keyboard WASD Movement (GTA San Andreas camera-relative movement)
      const keys = keysPressedRef.current;
      let inputForward = 0; // W / Up = +1 (Forward), S / Down = -1 (Backward)
      let inputRight = 0;   // D / Right = +1 (Right), A / Left = -1 (Left)
      if (keys['KeyW'] || keys['ArrowUp']) inputForward += 1;
      if (keys['KeyS'] || keys['ArrowDown']) inputForward -= 1;
      if (keys['KeyA'] || keys['ArrowLeft']) inputRight -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) inputRight += 1;

      if (playerMeshRef.current && playerPartsRef.current) {
        const player = playerMeshRef.current;
        const parts = playerPartsRef.current;
        let isMoving = false;

        if (inputForward !== 0 || inputRight !== 0) {
          // Normalize input so diagonal movement speed is uniform
          const inputLen = Math.hypot(inputForward, inputRight);
          const normFwd = inputForward / inputLen;
          const normRight = inputRight / inputLen;

          // Camera horizontal forward vector (sightline into scene)
          const camFwd = new THREE.Vector3();
          if (camera) {
            camera.getWorldDirection(camFwd);
            camFwd.y = 0;
            if (camFwd.lengthSq() > 0.0001) {
              camFwd.normalize();
            } else {
              camFwd.set(0, 0, -1);
            }
          } else {
            camFwd.set(0, 0, -1);
          }

          // Camera horizontal right vector (perpendicular to sightline, pointing screen right)
          const camRight = new THREE.Vector3(-camFwd.z, 0, camFwd.x);

          // Combined movement direction relative to camera viewpoint:
          // W / Up: Moves FORWARD along camera sightline into screen
          // S / Down: Moves BACKWARD towards camera / player
          // D / Right: Moves RIGHT on screen
          // A / Left: Moves LEFT on screen
          const moveX = camFwd.x * normFwd + camRight.x * normRight;
          const moveZ = camFwd.z * normFwd + camRight.z * normRight;

          if (isSittingRef.current) {
            isSittingRef.current = false;
            const forwardX = Math.sin(player.rotation.y) * 0.45;
            const forwardZ = Math.cos(player.rotation.y) * 0.45;
            player.position.x += forwardX;
            player.position.z += forwardZ;
            player.position.y = 0;
            targetPosRef.current.copy(player.position);
          }

          const inWater = player.position.x >= 32.2 && player.position.x <= 51.8 && player.position.z >= 16.2 && player.position.z <= 37.8;
          const moveSpeed = inWater ? 4.5 : 6.8;
          const stepX = moveX * delta * moveSpeed;
          const stepZ = moveZ * delta * moveSpeed;
          const resolved = resolveWallCollision(player.position.x, player.position.z, stepX, stepZ);
          player.position.x = resolved.x;
          player.position.z = resolved.z;
          targetPosRef.current.copy(player.position);

          // GTA San Andreas smooth character rotation towards movement direction
          const targetRot = Math.atan2(moveX, moveZ);
          let rotDiff = targetRot - player.rotation.y;
          while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
          while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
          player.rotation.y += rotDiff * 0.28;

          isSittingRef.current = false;
          isMoving = true;
        } else {
          const target = targetPosRef.current;
          const dx = target.x - player.position.x;
          const dz = target.z - player.position.z;
          const dist = Math.hypot(dx, dz);

          if (dist > 0.15) {
            const targetAngle = Math.atan2(dx, dz);
            let rotDiff = targetAngle - player.rotation.y;
            while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
            while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
            player.rotation.y += rotDiff * 0.22;

            const inWater = player.position.x >= 32.2 && player.position.x <= 51.8 && player.position.z >= 16.2 && player.position.z <= 37.8;
            const step = Math.min(dist, delta * (inWater ? 4.2 : 6.2));
            const stepX = (dx / dist) * step;
            const stepZ = (dz / dist) * step;
            const resolved = resolveWallCollision(player.position.x, player.position.z, stepX, stepZ);
            player.position.x = resolved.x;
            player.position.z = resolved.z;
            isMoving = true;
          }
        }

        // Kinematics & Pose Animation (Swimming, Walking, Sitting, Idle)
        const inPool = player.position.x >= 32.2 && player.position.x <= 51.8 && player.position.z >= 16.2 && player.position.z <= 37.8;
        if (inPool !== isSwimmingRef.current) {
          isSwimmingRef.current = inPool;
          setIsSwimming(inPool);
        }

        if (inPool) {
          isSittingRef.current = false;
          if (isMoving) {
            walkCycle += delta * 8;
            player.position.y = -0.48 + Math.sin(walkCycle * 2) * 0.05;
            avatarSystem.applyAvatarPose(parts, { isSwimming: true, isMoving: true, swimCycle: walkCycle });
          } else {
            // Idle treading water with gentle bobbing
            player.position.y = -0.48 + Math.sin(elapsed * 2.0) * 0.04;
            avatarSystem.applyAvatarPose(parts, { isSwimming: true, isMoving: false, elapsed });
          }
        } else if (isMoving) {
          walkCycle += delta * 12;
          player.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.08;
          avatarSystem.applyAvatarPose(parts, { isMoving: true, walkCycle });
        } else if (isSittingRef.current) {
          // Seated pose on chair cushion naturally with knee bend and outward orientation
          player.position.y = (seatHeightRef.current || 0.46) - 0.40;
          player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, chairRotYRef.current, 0.25);
          avatarSystem.applyAvatarPose(parts, { isSitting: true });
        } else {
          // Idle standing pose with gentle breathing sway
          player.position.y = 0;
          const animState = playerAnimStateRef.current;
          avatarSystem.applyAvatarPose(parts, { isMoving: false, emote: animState.emote, elapsed });
        }
      }

      // Throttled UI & HUD projection updates (8 Hz instead of 60 Hz to eliminate React CPU lag)
      if (currentTime - lastUiUpdateRef.current > 120) {
        lastUiUpdateRef.current = currentTime;

        // Proximity Detection with Acoustic Zone Isolation & Room-Culled Nameplates
        if (playerMeshRef.current) {
          const pPos = playerMeshRef.current.position;
          const playerZone = getAcousticZone(pPos);
          const privateZones = ['lobby', 'cubicle-1', 'cubicle-2', 'auditorium', 'boardroom', 'conference-b', 'workspace-a', 'patio', 'executive-cabins', 'gym', 'swimming-pool', 'game-zone'];
          const isPlayerInPrivateRoom = privateZones.includes(playerZone);

          // Project Avatar Names to 2D Screen Space ONLY if:
          // 1. Not player's own avatar (keeps third-person camera clear and clean)
          // 2. In front of camera (sPos.z >= -1.0 && sPos.z <= 1.0)
          // 3. In the same acoustic zone/room
          // 4. Within close conversational distance (< 6.5 meters)
          const projected = [];
          avatarsRef.current.forEach((av) => {
            if (av.isPlayer || !av.mesh) return;

            const avPos = new THREE.Vector3();
            av.mesh.getWorldPosition(avPos);

            // Proximity check: must be in close conversational range (< 6.5m)
            const dist = pPos.distanceTo(avPos);
            if (dist > 6.5) return;

            // Room / Zone check: must be in same acoustic space
            const avZone = getAcousticZone(avPos);
            if (avZone !== playerZone) return;

            // Frustum projection:
            const sPos = avPos.clone();
            sPos.y += 2.65;
            sPos.project(camera);

            if (sPos.z < -1.0 || sPos.z > 1.0) return;

            const x = ((sPos.x + 1) * width) / 2;
            const y = ((-sPos.y + 1) * height) / 2;

            if (x < 10 || x > width - 10 || y < 10 || y > height - 10) return;

            projected.push({
              name: av.name,
              x,
              y,
              isPlayer: false,
              status: av.status,
              role: av.role || 'Teammate',
              dist,
              avatarObj: av
            });
          });
          setScreenAvatars(projected);

          const nearby = [];
          avatarsRef.current.forEach((av) => {
            if (!av.isPlayer && av.mesh) {
              const avZone = getAcousticZone(av.mesh.position);
              const isAvInPrivateRoom = privateZones.includes(avZone);

              if (isPlayerInPrivateRoom) {
                if (avZone === playerZone) {
                  nearby.push(av.name.replace(' (AI)', ''));
                }
              } else {
                if (!isAvInPrivateRoom) {
                  const d = pPos.distanceTo(av.mesh.position);
                  if (d < spatialFalloff) {
                    nearby.push(av.name.replace(' (AI)', ''));
                  }
                }
              }
            }
          });
          setInAudioRange(nearby);
          setPlayerCoord({ x: pPos.x, z: pPos.z });
        }

        // Project Active Screen Target to 2D Screen Space for floating tool pill
        if (activeScreenTargetRef.current?.mesh && camera && container) {
          const sPos = new THREE.Vector3();
          activeScreenTargetRef.current.mesh.getWorldPosition(sPos);
          const sHeight = activeScreenTargetRef.current.mesh.userData?.height || 2.7;
          sPos.y += sHeight / 2 + 0.12;
          sPos.project(camera);
          if (sPos.z < 1) {
            const cWidth = container.clientWidth || window.innerWidth;
            const cHeight = container.clientHeight || window.innerHeight;
            const sx = Math.round(((sPos.x + 1) * cWidth) / 2);
            const sy = Math.round(((-sPos.y + 1) * cHeight) / 2);
            setActiveScreenPos((prev) => {
              if (!prev || Math.abs(prev.x - sx) > 1 || Math.abs(prev.y - sy) > 1) {
                return { x: sx, y: sy };
              }
              return prev;
            });
          } else {
            setActiveScreenPos(null);
          }
        } else if (!activeScreenTargetRef.current) {
          setActiveScreenPos(null);
        }
      }

      // Smooth Dynamic Camera with Mouse Wheel Zoom & Orbit / Showcase Screen View
      if (camera) {
        if (cameraOverrideRef.current) {
          const { pos, lookAt } = cameraOverrideRef.current;
          camera.position.set(pos.x, pos.y, pos.z);
          camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
        } else if (showcaseScreenRef.current?.mesh) {
          const screenMesh = showcaseScreenRef.current.mesh;
          const sPos = new THREE.Vector3();
          screenMesh.getWorldPosition(sPos);
          const screenRot = screenMesh.getWorldQuaternion(new THREE.Quaternion());
          const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(screenRot);
          const sWidth = screenMesh.userData?.width || 4.8;
          const sHeight = screenMesh.userData?.height || 2.7;
          const isDeskMon = screenMesh.userData?.isDeskMonitor || sWidth < 1.6;
          const maxDist = sWidth > 10 ? 16.5 : 11.5;
          const viewDist = isDeskMon ? 0.88 : Math.max(2.6, Math.min(sWidth * 1.12, maxDist));
          const camTargetPos = sPos.clone().addScaledVector(normal, viewDist);
          camTargetPos.y = sPos.y + (isDeskMon ? 0.02 : Math.max(0.6, sHeight * 0.12));

          camera.position.lerp(camTargetPos, 0.08);
          camera.lookAt(sPos.x, sPos.y, sPos.z);
        } else if (isTopDownBlueprint) {
          camera.position.lerp(new THREE.Vector3(0, 68, 0), 0.08);
          camera.lookAt(0, 0, 0);
        } else if (playerMeshRef.current) {
          const p = playerMeshRef.current.position;
          const dist = cameraDistanceRef.current;
          const angle = cameraOrbitAngleRef.current;
          const pitch = cameraPitchAngleRef.current;

          // Check if player is in the Auditorium (East atrium: X >= 6 and Z < 4)
          const isAuditorium = p.x >= 6 && p.z < 4;
          const isAuditoriumSeated = isAuditorium && isSittingRef.current;

          if (isAuditoriumSeated) {
            // Authentic Spot Virtual Auditorium Framing (Exact match to media_1792207254846.png)
            const screenX = 31.65;
            const screenZ = -10.0;
            const lookY = 3.6 + (cameraTargetYOffsetRef.current || 0);

            const camDist = Math.max(6.0, dist);
            const camX = screenX - camDist * Math.cos(pitch);
            const camY = Math.max(1.8, 3.2 + (camDist * 0.12) * Math.sin(pitch) + (cameraTargetYOffsetRef.current || 0) * 0.5);
            const camZ = THREE.MathUtils.lerp(p.z, screenZ, 0.45) + Math.sin(angle + Math.PI / 2) * (dist * 0.25);

            camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.12);
            camera.lookAt(screenX, lookY, screenZ);
          } else {
            // GTA San Andreas Third-Person Chase Cam
            // Follows right behind the avatar at shoulder level, framing the character in lower-third
            // and the world ahead in full 3D perspective
            const fwdDist = Math.min(dist * 0.40, 3.2);
            const lookTargetX = p.x - Math.sin(angle) * fwdDist;
            const lookTargetZ = p.z - Math.cos(angle) * fwdDist;
            const baseLookY = isAuditorium ? 2.0 : 1.40;
            const lookY = p.y + baseLookY + (cameraTargetYOffsetRef.current || 0);

            const camX = p.x + Math.sin(angle) * dist * Math.cos(pitch);
            const camY = Math.max(0.6, p.y + 1.45 + dist * Math.sin(pitch));
            const camZ = p.z + Math.cos(angle) * dist * Math.cos(pitch);

            camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.14);
            camera.lookAt(lookTargetX, lookY, lookTargetZ);
          }
        }
      }

      // Dynamic Wall Occlusion: Smoothly fade any foreground wall crossing the camera's sightline to the player/target
      const walls = scene.userData.officeWalls;
      if (walls && walls.length > 0 && camera) {
        const camPos = camera.position;
        const targetPos = showcaseScreenRef.current?.mesh
          ? showcaseScreenRef.current.mesh.position
          : (playerMeshRef.current ? playerMeshRef.current.position : new THREE.Vector3(0, 1.5, 0));

        const camToTargetX = targetPos.x - camPos.x;
        const camToTargetZ = targetPos.z - camPos.z;
        const targetDistSq = camToTargetX * camToTargetX + camToTargetZ * camToTargetZ;
        const targetDist = Math.sqrt(targetDistSq);

        if (targetDist > 0.5) {
          const rayDirX = camToTargetX / targetDist;
          const rayDirZ = camToTargetZ / targetDist;

          for (let i = 0; i < walls.length; i++) {
            const w = walls[i];
            const toWallX = w.center.x - camPos.x;
            const toWallZ = w.center.z - camPos.z;

            // Project wall onto camera-to-target sightline
            const projDist = toWallX * rayDirX + toWallZ * rayDirZ;

            // Check if wall is positioned between camera and target or if camera is inside wall bounds
            let isOccluding = false;
            const camInsideWall = (
              Math.abs(camPos.x - w.center.x) <= (w.width / 2 + 0.45) &&
              Math.abs(camPos.z - w.center.z) <= (w.depth / 2 + 0.45)
            );
            if (camInsideWall) {
              isOccluding = true;
            } else if (projDist > 0.15 && projDist < targetDist - 0.2) {
              const perpDistSq = (toWallX * toWallX + toWallZ * toWallZ) - (projDist * projDist);
              const perpDist = perpDistSq > 0 ? Math.sqrt(perpDistSq) : 0;
              const threshold = Math.max(1.8, Math.min(w.width, w.depth) / 2 + 1.2);
              if (perpDist < threshold) {
                isOccluding = true;
              }
            }

            const targetOpacity = isOccluding ? 0.08 : 1.0;
            if (w.mesh?.material) {
              w.mesh.material.opacity = THREE.MathUtils.lerp(w.mesh.material.opacity, targetOpacity, 0.2);
            }
            if (w.trimMesh?.material) {
              w.trimMesh.material.opacity = THREE.MathUtils.lerp(w.trimMesh.material.opacity, targetOpacity, 0.2);
            }
          }
        }
      }

      // Avatar Translucency during Screen Showcase: prevents avatar heads and bodies from ever blocking the screen
      const isShowcaseActive = Boolean(showcaseScreenRef.current?.mesh);
      avatarsRef.current.forEach((av) => {
        if (av.mesh) {
          av.mesh.traverse((child) => {
            if (child.isMesh && child.material && !child.userData?.isSpotScreen) {
              const targetOpacity = isShowcaseActive ? 0.20 : 1.0;
              const mat = child.material;
              if (Math.abs(mat.opacity - targetOpacity) > 0.02) {
                mat.transparent = true;
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.25);
              }
            }
          });
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Global Showcase Screen helper for automated inspection or UI buttons
    window.__spotShowcaseScreen = (screenIdOrName) => {
      let target = null;
      if (typeof screenIdOrName === 'object' && screenIdOrName?.mesh) {
        target = screenIdOrName;
      } else {
        const id = String(screenIdOrName || 'boardroom').replace('screen_', '').replace('casing_', '');
        const mesh = screensRef.current?.[id] || screensRef.current?.[`screen_${id}`];
        if (mesh) {
          target = { id, name: mesh.userData?.displayName || id, mesh };
        }
      }
      if (target) {
        showcaseScreen(target);
        return true;
      }
      return false;
    };

    // Global Screen Share helper for testing & automation
    window.__spotStartScreenShare = (screenId) => {
      return startScreenShare(screenId);
    };
    window.__spotStopScreenShare = (screenId) => {
      return stopScreenShare(screenId);
    };

    // Global Sit helper for reliable testing & automation
    window.__spotSitOnChair = (nameKeyword = 'Sofa') => {
      const found = chairsRef.current.find((c) =>
        c.name.toLowerCase().includes(nameKeyword.toLowerCase())
      );
      if (found) {
        playSound('click');
        targetPosRef.current.copy(found.pos);
        chairRotYRef.current = found.rot ?? 0;
        seatHeightRef.current = found.seatHeight ?? 0.46;
        isSittingRef.current = true;
        if (playerMeshRef.current) {
          playerMeshRef.current.position.copy(found.pos);
          playerMeshRef.current.position.y = (found.seatHeight ?? 0.46) - 0.40;
          playerMeshRef.current.rotation.y = found.rot ?? 0;
        }
        if (found.name?.toLowerCase().includes('auditorium') || (found.pos.x >= 10 && found.pos.z < 4)) {
          cameraOrbitAngleRef.current = -Math.PI / 2;
          cameraPitchAngleRef.current = 0.26;
          cameraDistanceRef.current = 22.0;
          cameraTargetYOffsetRef.current = 0;
        }
        return found;
      }
      return null;
    };

    window.__spotJumpToRoom = (roomName) => {
      jumpToRoom(roomName);
    };

    window.__spotOpenChess = () => {
      setIsChessOpen(true);
    };

    window.__spotCloseChess = () => {
      setIsChessOpen(false);
    };

    window.__spotOpenArcade = () => {
      setIsArcadeOpen(true);
    };

    window.__spotCloseArcade = () => {
      setIsArcadeOpen(false);
    };

    window.__spotOpenBilliards = () => {
      setIsBilliardsOpen(true);
    };

    window.__spotCloseBilliards = () => {
      setIsBilliardsOpen(false);
    };

    window.__spotOpenPingPong = () => {
      setIsPingPongOpen(true);
    };

    window.__spotClosePingPong = () => {
      setIsPingPongOpen(false);
    };

    window.__spotOpenInvite = () => {
      setIsSpotLinkModalOpen(true);
    };

    window.__spotCloseInvite = () => {
      setIsSpotLinkModalOpen(false);
    };

    window.__spotOpenStickyNote = () => {
      setIsStickyNoteOpen(true);
    };

    window.__spotCloseStickyNote = () => {
      setIsStickyNoteOpen(false);
    };

    window.__spotOpenSharedBrowser = () => {
      setIsSharedBrowserOpen(true);
    };

    window.__spotCloseSharedBrowser = () => {
      setIsSharedBrowserOpen(false);
    };

    window.__spotOpenPoll = () => {
      setIsPollOpen(true);
    };

    window.__spotClosePoll = () => {
      setIsPollOpen(false);
    };

    window.__spotOpenYouTube = () => {
      setIsYouTubeOpen(true);
    };

    window.__spotCloseYouTube = () => {
      setIsYouTubeOpen(false);
    };

    window.__spotOpenTimer = () => {
      setIsTimerOpen(true);
    };

    window.__spotCloseTimer = () => {
      setIsTimerOpen(false);
    };

    window.__spotOpenObjectsMenu = () => {
      setIsObjectsMenuOpen(true);
    };

    window.__spotCloseObjectsMenu = () => {
      setIsObjectsMenuOpen(false);
    };

    window.__spotOpenRoomMenu = () => {
      setIsRoomMenuOpen(true);
    };

    window.__spotCloseRoomMenu = () => {
      setIsRoomMenuOpen(false);
    };

    window.__spotOpenRoomChat = () => {
      setIsRoomChatOpen(true);
    };

    window.__spotCloseRoomChat = () => {
      setIsRoomChatOpen(false);
    };

    window.__spotCloseSidebar = () => {
      setIsSpacesSidebarOpen(false);
    };

    window.__spotToggleSidebar = (val) => {
      setIsSpacesSidebarOpen((prev) => (val !== undefined ? val : !prev));
    };

    window.__spotHoverSofa = () => {
      const sofa = chairsRef.current.find((c) => c.name?.includes('Lobby Black Sofa') || c.name?.includes('Sofa'));
      if (sofa && cameraRef.current && rendererRef.current) {
        const pVec = sofa.pos.clone();
        pVec.y += (sofa.seatHeight || 0.46) + 0.12;
        pVec.project(cameraRef.current);
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        const sx = ((pVec.x + 1) * rect.width) / 2 + rect.left;
        const sy = ((-pVec.y + 1) * rect.height) / 2 + rect.top;
        setHoverChairScreenPos({ x: sx, y: sy, chairObj: sofa, hitPoint: sofa.pos });
      }
    };

    window.__spotOpenRoomSettings = (tab = 'overview') => {
      setRoomSettingsTab(tab);
      setIsRoomSettingsOpen(true);
    };

    window.__spotCloseRoomSettings = () => {
      setIsRoomSettingsOpen(false);
    };

    window.__spotHoverAvatar = (name = 'Phil') => {
      const av = avatarsRef.current.find((a) => a.name.toLowerCase().includes(name.toLowerCase()));
      if (av && cameraRef.current && renderer?.domElement) {
        const headVec = new THREE.Vector3();
        av.mesh.getWorldPosition(headVec);
        headVec.y += 2.5;
        headVec.project(cameraRef.current);
        const rect = renderer.domElement.getBoundingClientRect();
        const sx = ((headVec.x + 1) * rect.width) / 2 + rect.left;
        const sy = ((-headVec.y + 1) * rect.height) / 2 + rect.top;
        setHoveredAvatarPopup({
          name: av.name,
          role: av.role || (av.status === 'ai-agent' ? 'Autonomous AI Agent' : 'Team Member'),
          status: av.status,
          room: getRoomDisplayName(av.mesh.position),
          x: sx,
          y: sy,
          isAI: av.status === 'ai-agent' || av.name.includes('DevBot'),
          avatarObj: av
        });
      }
    };

    window.__spotCloseAvatarPopup = () => {
      setHoveredAvatarPopup(null);
    };

    const checkSettingsUrl = () => {
      const fullUrl = window.location.pathname + window.location.hash + window.location.search;
      if (fullUrl.includes('/settings/transcription')) {
        setRoomSettingsTab('transcription');
        setIsRoomSettingsOpen(true);
      } else if (fullUrl.includes('/settings/advanced')) {
        setRoomSettingsTab('advanced');
        setIsRoomSettingsOpen(true);
      } else if (fullUrl.includes('/settings/overview') || fullUrl.includes('/settings')) {
        setRoomSettingsTab('overview');
        setIsRoomSettingsOpen(true);
      }
    };
    checkSettingsUrl();
    window.addEventListener('hashchange', checkSettingsUrl);
    window.addEventListener('popstate', checkSettingsUrl);

    // Mouse Wheel Zoom: GTA San Andreas zoom range between 1.2m (close over-shoulder) and 16.0m (tactical chase)
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.015;
      cameraDistanceRef.current = THREE.MathUtils.clamp(cameraDistanceRef.current + zoomFactor, 1.2, 16.0);

      // Scrolling UP (deltaY < 0): zoom in AND smoothly level camera towards eye-level
      // so whatever is in front of the avatar comes directly into view
      if (e.deltaY < 0) {
        cameraPitchAngleRef.current = THREE.MathUtils.clamp(
          cameraPitchAngleRef.current - 0.025,
          -0.12,
          0.95
        );
      } else if (e.deltaY > 0) {
        // Scrolling DOWN (deltaY > 0): zoom out AND gently raise pitch for tactical chase overview
        cameraPitchAngleRef.current = THREE.MathUtils.clamp(
          cameraPitchAngleRef.current + 0.020,
          -0.12,
          0.95
        );
      }
    };

    // Mouse Orbit Dragging, Vertical Pan & Pointer Cursor Detection
    let lastHoverCheck = 0;
    const checkInteractiveHover = (clientX, clientY) => {
      if (!renderer || !renderer.domElement || !camera || !scene) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        return;
      }
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      let isInteractive = false;
      for (let i = 0; i < Math.min(hits.length, 10); i++) {
        let obj = hits[i].object;
        while (obj && obj !== scene) {
          if (
            obj.userData?.isSpotScreen ||
            obj.name?.startsWith('screen_') ||
            obj.name?.startsWith('casing_screen_') ||
            obj.userData?.isChair ||
            obj.name === 'clickable_chair' ||
            obj.name?.startsWith('chair_') ||
            obj.name?.startsWith('sofa_') ||
            obj.userData?.chairPos ||
            obj.userData?.isInteractiveDoor ||
            obj.name === 'doorway_group' ||
            obj.userData?.isAvatar ||
            obj.name?.startsWith('avatar_') ||
            obj.userData?.isChessboard ||
            obj.name === 'clickable_chessboard' ||
            obj.userData?.isArcade ||
            obj.name === 'clickable_arcade' ||
            obj.userData?.isBilliards ||
            obj.name === 'clickable_billiards' ||
            obj.userData?.isPingPong ||
            obj.name === 'clickable_pingpong' ||
            obj.name?.startsWith('widget_') ||
            obj.name === 'doughnutPlate' ||
            obj.name === 'appleBowl' ||
            obj.name === 'confAudioPuck'
          ) {
            isInteractive = true;
            break;
          }
          obj = obj.parent;
        }
        if (isInteractive) break;
      }

      renderer.domElement.style.cursor = isInteractive ? 'pointer' : 'grab';

      // Check for hovered chair/sofa cushion to show the floating "Sit down" tooltip (media_1792293223278.png)
      let hoveredChair = null;
      for (let i = 0; i < Math.min(hits.length, 8); i++) {
        let obj = hits[i].object;
        while (obj && obj !== scene) {
          if (
            obj.userData?.isChair ||
            obj.name === 'clickable_chair' ||
            obj.name?.startsWith('chair_') ||
            obj.name?.startsWith('sofa_') ||
            obj.userData?.chairPos
          ) {
            hoveredChair = { obj, hitPoint: hits[i].point };
            break;
          }
          obj = obj.parent;
        }
        if (hoveredChair) break;
      }

      if (hoveredChair && !isSittingRef.current) {
        const chairObj = hoveredChair.obj;
        const pVec = new THREE.Vector3();
        if (chairObj.userData?.chairPos) {
          pVec.copy(chairObj.userData.chairPos);
        } else {
          chairObj.getWorldPosition(pVec);
        }
        pVec.y += (chairObj.userData?.seatHeight || 0.46) + 0.12;
        pVec.project(camera);
        const sx = ((pVec.x + 1) * rect.width) / 2 + rect.left;
        const sy = ((-pVec.y + 1) * rect.height) / 2 + rect.top;
        setHoverChairScreenPos({ x: sx, y: sy, chairObj, hitPoint: hoveredChair.hitPoint });
      } else {
        setHoverChairScreenPos(null);
      }

      // Check for hovered avatar to display interactive Spot Virtual profile name popup ("who is who")
      let hoveredAv = null;
      for (let i = 0; i < Math.min(hits.length, 12); i++) {
        let obj = hits[i].object;
        while (obj && obj !== scene) {
          if (obj.userData?.isAvatar || obj.name?.startsWith('avatar_')) {
            const rawName = obj.userData?.name || obj.name?.replace('avatar_head_', '').replace('avatar_', '');
            const match = avatarsRef.current.find((a) => !a.isPlayer && (a.name === rawName || a.name.includes(rawName)));
            if (match) {
              hoveredAv = match;
              break;
            }
          }
          const matchAv = avatarsRef.current.find((a) => !a.isPlayer && (a.mesh === obj || a.mesh === obj.parent || a.mesh === obj.parent?.parent));
          if (matchAv) {
            hoveredAv = matchAv;
            break;
          }
          obj = obj.parent;
        }
        if (hoveredAv) break;
      }

      if (hoveredAv) {
        const headVec = new THREE.Vector3();
        hoveredAv.mesh.getWorldPosition(headVec);
        headVec.y += 2.5;
        headVec.project(camera);

        if (headVec.z >= -1 && headVec.z <= 1) {
          const sx = ((headVec.x + 1) * rect.width) / 2 + rect.left;
          const sy = ((-headVec.y + 1) * rect.height) / 2 + rect.top;

          setHoveredAvatarPopup({
            name: hoveredAv.name,
            role: hoveredAv.role || (hoveredAv.status === 'ai-agent' ? 'Autonomous AI Agent' : 'Team Member'),
            status: hoveredAv.status,
            room: getRoomDisplayName(hoveredAv.mesh.position),
            x: sx,
            y: sy,
            isAI: hoveredAv.status === 'ai-agent' || hoveredAv.name.includes('DevBot'),
            avatarObj: hoveredAv
          });
        }
      } else {
        setHoveredAvatarPopup(null);
      }
    };

    const handlePointerMove = (e) => {
      if (isDraggingOrbitRef.current) {
        if (renderer?.domElement) {
          renderer.domElement.style.cursor = 'grabbing';
        }
        document.body.style.cursor = 'grabbing';

        const dx = e.clientX - pointerDownPosRef.current.x;
        const dy = e.clientY - pointerDownPosRef.current.y;
        if (Math.hypot(dx, dy) > 4) {
          isPointerMovedRef.current = true;
          if (showcaseScreenRef.current) {
            showcaseScreenRef.current = null;
            setShowcaseScreenTarget(null);
          }
        }

        if (isPointerMovedRef.current) {
          const deltaX = e.clientX - lastMousePosRef.current.x;
          const deltaY = e.clientY - lastMousePosRef.current.y;
          lastMousePosRef.current = { x: e.clientX, y: e.clientY };

          if (pointerDownPosRef.current.button === 2 || pointerDownPosRef.current.button === 1 || e.shiftKey) {
            // Right-drag / middle-drag / shift-drag: Vertical and lateral camera pan
            cameraTargetYOffsetRef.current = THREE.MathUtils.clamp(
              cameraTargetYOffsetRef.current - deltaY * 0.015,
              -4.0,
              8.0
            );
          } else {
            cameraOrbitAngleRef.current -= deltaX * 0.005;
            // Dragging UP (deltaY < 0) tilts camera UP towards eye-level / sky
            // Dragging DOWN (deltaY > 0) elevates camera overhead
            cameraPitchAngleRef.current = THREE.MathUtils.clamp(
              cameraPitchAngleRef.current + deltaY * 0.004,
              -0.15,
              0.95
            );
          }
        }
      } else {
        // Throttled hover check for interactive elements vs canvas navigation
        const now = performance.now();
        if (now - lastHoverCheck > 30) {
          lastHoverCheck = now;
          checkInteractiveHover(e.clientX, e.clientY);
        }
      }
    };

    const handlePointerUp = (e) => {
      if (!isDraggingOrbitRef.current) return;
      isDraggingOrbitRef.current = false;
      document.body.style.cursor = '';
      if (renderer?.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }

      // Single click (not drag): trigger scene interaction
      if (!isPointerMovedRef.current && pointerDownPosRef.current.button === 0) {
        handleSceneClick(e);
      }

      if (e && typeof e.clientX === 'number') {
        checkInteractiveHover(e.clientX, e.clientY);
      }
    };

    const handlePointerLeave = () => {
      if (!isDraggingOrbitRef.current && renderer?.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      document.body.style.cursor = '';
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [spatialFalloff]);

  // Jump camera/avatar to specific room across both Office and ser spaces
  const jumpToRoom = (roomName) => {
    playSound('chime');
    const clean = (roomName || '').toLowerCase();
    let target = new THREE.Vector3(-23, 0, -12.5);
    let slug = 'boardroom';
    let formattedName = 'Boardroom';

    if (clean.includes('swimming') || clean.includes('pool') || clean.includes('deck')) {
      target.set(42, 0, 24);
      slug = 'swimming-pool';
      formattedName = 'Swimming Pool & Sun Deck';
    } else if (clean.includes('gym') || clean.includes('fitness')) {
      target.set(-42, 0, 24);
      slug = 'gym';
      formattedName = 'Fitness & Gym Center';
    } else if (clean.includes('arcade') || clean.includes('game')) {
      target.set(0, 0, 28);
      slug = 'game-zone';
      formattedName = 'Arcade & Game Zone';
    } else if (clean.includes('cabin') || clean.includes('executive')) {
      target.set(-50, 0, -32);
      slug = 'executive-cabins';
      formattedName = 'Executive Cabins';
    } else if (clean.includes('atrium') || clean.includes('grand')) {
      target.set(0, 0, 2);
      slug = 'grand-atrium';
      formattedName = 'Grand Central Atrium';
    } else if (clean.includes('office-a') || clean.includes('office a')) {
      target.set(-8, 0, 14);
      slug = 'office-a';
      formattedName = 'Office A';
    } else if (clean.includes('focus-pod-1') || clean.includes('focus pod 1')) {
      target.set(10, 0, -8);
      slug = 'focus-pod-1';
      formattedName = 'Focus Pod 1';
    } else if (clean.includes('focus-pod-2') || clean.includes('focus pod 2')) {
      target.set(10, 0, 8);
      slug = 'focus-pod-2';
      formattedName = 'Focus Pod 2';
    } else if (clean.includes('team-suite') || clean.includes('team suite')) {
      target.set(0, 0, 16);
      slug = 'team-suite';
      formattedName = 'Team Suite';
    } else if (clean.includes('terrace')) {
      target.set(-18, 0, -12);
      slug = 'terrace';
      formattedName = 'Terrace Lounge';
    } else if (clean.includes('auditorium')) {
      target.set(18, 0, -10);
      slug = 'auditorium';
      formattedName = 'Auditorium';
    } else if (clean.includes('boardroom')) {
      target.set(-23, 0, -12.5);
      slug = 'boardroom';
      formattedName = 'Boardroom';
    } else if (clean.includes('conference b') || clean.includes('conference')) {
      target.set(-4, 0, -11.5);
      slug = 'conference-b';
      formattedName = 'Meeting Cabin';
    } else if (clean.includes('conference a') || clean.includes('promenade')) {
      target.set(29.4, 0, 12);
      slug = 'conference-a';
      formattedName = 'Window Promenade';
    } else if (clean.includes('lounge c') || clean.includes('concourse')) {
      target.set(-10, 0, 1.5);
      slug = 'lounge-c';
      formattedName = 'Lounge C';
    } else if (clean.includes('patio')) {
      target.set(-23, 0, 19);
      slug = 'patio';
      formattedName = 'Patio';
    } else if (clean.includes('cubicle-1') || clean.includes('cubicle 1')) {
      target.set(-22.5, 0, 11);
      slug = 'cubicle-1';
      formattedName = 'Focus Cubicle 1';
    } else if (clean.includes('cubicle-2') || clean.includes('cubicle 2')) {
      target.set(-16.5, 0, 11);
      slug = 'cubicle-2';
      formattedName = 'Focus Cubicle 2';
    } else if (clean.includes('workspace')) {
      target.set(0, 0, 16);
      slug = 'workspace-a';
      formattedName = 'Workspace A';
    } else if (clean.includes('lobby')) {
      target.set(0, 0, -38.5);
      slug = 'lobby';
      formattedName = 'Lobby';
    }

    targetPosRef.current.copy(target);
    setCurrentRoom(formattedName);
    setCurrentRoomId(slug);

    if (playerMeshRef.current) {
      playerMeshRef.current.position.copy(target);
      if (slug === 'auditorium' || slug === 'conference-a') {
        playerMeshRef.current.rotation.y = Math.PI / 2; // Face East towards stage/promenade
      } else if (slug === 'lobby') {
        playerMeshRef.current.rotation.y = Math.PI; // Face North into sofa and skyline view
      } else if (slug === 'swimming-pool' || slug === 'gym' || slug === 'game-zone' || slug === 'grand-atrium') {
        playerMeshRef.current.rotation.y = 0; // Face South
      } else {
        playerMeshRef.current.rotation.y = Math.PI; // Face North into room
      }
    }

    if (slug === 'lobby') {
      cameraDistanceRef.current = 4.2;
      cameraOrbitAngleRef.current = 0;
      cameraPitchAngleRef.current = 0.12;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x, 1.85, target.z + 4.2);
        cameraRef.current.lookAt(target.x, 1.35, target.z - 4.5);
      }
    } else if (slug === 'auditorium') {
      cameraDistanceRef.current = 6.0;
      cameraOrbitAngleRef.current = -Math.PI / 2;
      cameraPitchAngleRef.current = 0.22;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x - 5.8, 2.4, target.z);
        cameraRef.current.lookAt(target.x + 2.5, 1.45, target.z);
      }
    } else if (slug === 'conference-a') {
      cameraDistanceRef.current = 4.8;
      cameraOrbitAngleRef.current = -Math.PI / 2;
      cameraPitchAngleRef.current = 0.20;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x - 4.6, 2.4, target.z);
        cameraRef.current.lookAt(target.x + 2.0, 1.45, target.z);
      }
    } else if (slug === 'swimming-pool') {
      cameraDistanceRef.current = 6.5;
      cameraOrbitAngleRef.current = Math.PI;
      cameraPitchAngleRef.current = 0.32;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x, 3.2, target.z - 5.8);
        cameraRef.current.lookAt(target.x, 1.0, target.z + 8.0);
      }
    } else if (slug === 'game-zone') {
      cameraDistanceRef.current = 6.5;
      cameraOrbitAngleRef.current = Math.PI;
      cameraPitchAngleRef.current = 0.28;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x, 3.0, target.z - 5.5);
        cameraRef.current.lookAt(target.x, 1.2, target.z + 6.0);
      }
    } else if (slug === 'gym') {
      cameraDistanceRef.current = 5.6;
      cameraOrbitAngleRef.current = Math.PI;
      cameraPitchAngleRef.current = 0.24;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x, 2.8, target.z - 5.2);
        cameraRef.current.lookAt(target.x, 1.4, target.z + 2.5);
      }
    } else if (slug === 'executive-cabins') {
      cameraDistanceRef.current = 4.8;
      cameraOrbitAngleRef.current = 0;
      cameraPitchAngleRef.current = 0.22;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x, 2.4, target.z + 4.5);
        cameraRef.current.lookAt(target.x, 1.35, target.z - 3.0);
      }
    } else if (slug === 'grand-atrium') {
      cameraDistanceRef.current = 6.0;
      cameraOrbitAngleRef.current = Math.PI;
      cameraPitchAngleRef.current = 0.24;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x, 2.8, target.z - 5.5);
        cameraRef.current.lookAt(target.x, 1.4, target.z + 5.0);
      }
    } else {
      cameraDistanceRef.current = 4.8;
      cameraOrbitAngleRef.current = 0;
      cameraPitchAngleRef.current = 0.20;
      cameraTargetYOffsetRef.current = 0;
      if (cameraRef.current && !isTopDownBlueprint) {
        cameraRef.current.position.set(target.x, 2.4, target.z + 4.6);
        cameraRef.current.lookAt(target.x, 1.45, target.z - 2.5);
      }
    }
    isSittingRef.current = false;

    try {
      const sp = (currentSpace === 'ser-emY' || currentSpace === 'ser') ? 'ser-emY' : 'office';
      window.history.pushState({}, '', `/@${workspaceSlug.replace('@', '')}/@${sp}/@${slug}`);
    } catch (e) {}
  };

  // Switch between Spaces (@office vs @ser-emY)
  const handleSelectSpace = (newSpaceSlug, newSpaceName) => {
    playSound('chime');
    const cleanSlug = (newSpaceSlug || '').replace('@', '');
    const cleanName = newSpaceName || (cleanSlug.includes('ser') ? 'ser' : 'Office');
    setCurrentSpace(cleanSlug);
    setCurrentSpaceName(cleanName);

    if (cleanSlug.includes('ser')) {
      jumpToRoom('Office A');
      setToastMessage('Switched to "ser" space (Office A & Focus Pods)! 🏢');
      setTimeout(() => setToastMessage(null), 3000);
      try {
        window.history.pushState({}, '', `/@${workspaceSlug.replace('@', '')}/@ser-emY/@office-a`);
      } catch (e) {}
    } else {
      jumpToRoom('Boardroom');
      setToastMessage('Switched to "Office" space (12 rooms)! 🏢');
      setTimeout(() => setToastMessage(null), 3000);
      try {
        window.history.pushState({}, '', `/@${workspaceSlug.replace('@', '')}/@office/@boardroom`);
      } catch (e) {}
    }
  };

  // Spot 3D Screen Content Switcher (media_1791967521142.png)
  const handleUpdateScreenContent = (screenId, contentType, payload) => {
    playSound('chime');

    const targetKey = screenId ||
      activeScreenTargetRef.current?.id ||
      activeScreenTarget?.id ||
      (currentRoomId && currentRoomId.includes('auditorium') ? 'auditorium' : currentRoomId?.replace('-', '_')) ||
      'auditorium';

    let targetMesh = null;
    if (activeScreenTargetRef.current?.id === targetKey && activeScreenTargetRef.current?.mesh) {
      targetMesh = activeScreenTargetRef.current.mesh;
    } else if (activeScreenTarget?.id === targetKey && activeScreenTarget?.mesh) {
      targetMesh = activeScreenTarget.mesh;
    } else if (screensRef.current && screensRef.current[targetKey]) {
      targetMesh = screensRef.current[targetKey];
    } else if (screensRef.current && screensRef.current[`screen_${targetKey}`]) {
      targetMesh = screensRef.current[`screen_${targetKey}`];
    } else if (sceneRef.current) {
      targetMesh = sceneRef.current.getObjectByName(`screen_${targetKey}`) || sceneRef.current.getObjectByName(targetKey);
    }

    if (targetMesh?.userData?.displayMesh) {
      targetMesh = targetMesh.userData.displayMesh;
    }

    if (!targetMesh) {
      console.warn(`Screen mesh "${targetKey}" not found in scene.`);
      return;
    }

    const texSys = screenTexturesRef.current;

    // Clear any previous countdown timer interval on screen
    if (screenTimerIntervalRef.current) {
      clearInterval(screenTimerIntervalRef.current);
      screenTimerIntervalRef.current = null;
    }

    if (contentType === 'starry-logo') {
      activeVideoTextureRef.current = null;
      const tex = texSys?.createStarryLogoTexture ? texSys.createStarryLogoTexture() : texSys?.starryLogoTexture;
      if (tex && targetMesh.material) {
        tex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = tex;
        targetMesh.material.needsUpdate = true;
      }
      setToastMessage('Reset screen to Spot Starry Space Galaxy! 🌌');
      setTimeout(() => setToastMessage(null), 2500);
    } else if (contentType === 'timer') {
      activeVideoTextureRef.current = null;
      const totalMinutes = payload?.minutes || 15;
      let remainingSeconds = totalMinutes * 60;

      const renderTimerFrame = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        const tex = texSys?.createTimerTexture ? texSys.createTimerTexture(timeStr, 'Session Countdown') : null;
        if (tex && targetMesh.material) {
          tex.colorSpace = THREE.SRGBColorSpace;
          targetMesh.material.map = tex;
          targetMesh.material.needsUpdate = true;
        }
      };

      renderTimerFrame(remainingSeconds);

      screenTimerIntervalRef.current = setInterval(() => {
        remainingSeconds -= 1;
        if (remainingSeconds <= 0) {
          clearInterval(screenTimerIntervalRef.current);
          screenTimerIntervalRef.current = null;
          renderTimerFrame(0);
          playSound('chime');
          setToastMessage('⏱️ Presentation countdown completed!');
          setTimeout(() => setToastMessage(null), 3500);
        } else {
          renderTimerFrame(remainingSeconds);
        }
      }, 1000);

      setToastMessage(`Started ${totalMinutes}m countdown timer on screen! ⏱️`);
      setTimeout(() => setToastMessage(null), 2500);
    } else if (contentType === 'kpi') {
      activeVideoTextureRef.current = null;
      if (texSys?.kpiTexture && targetMesh.material) {
        targetMesh.material.map = texSys.kpiTexture;
        targetMesh.material.needsUpdate = true;
      }
      setToastMessage('KPI Telemetry Dashboard active on screen! 📊');
      setTimeout(() => setToastMessage(null), 2500);
    } else if (contentType === 'screenshare') {
      startScreenShare(targetKey);
      return;
    } else if (contentType === 'webcam') {
      startCameraStream(targetKey);
      return;
    } else if (contentType === 'meeting') {
      startScreenShare(targetKey);
      return;
    } else if (contentType === 'calendar') {
      activeVideoTextureRef.current = null;
      const calTex = texSys?.schedTexture;
      if (calTex && targetMesh.material) {
        calTex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = calTex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'widgets') {
      activeVideoTextureRef.current = null;
      const wCanvas = document.createElement('canvas');
      wCanvas.width = 1024;
      wCanvas.height = 512;
      const wCtx = wCanvas.getContext('2d');
      wCtx.fillStyle = '#f8fafc';
      wCtx.fillRect(0, 0, 1024, 512);
      wCtx.fillStyle = '#0f172a';
      wCtx.font = 'bold 36px sans-serif';
      wCtx.fillText('🎨 Interactive Team Whiteboard & Tabletop Apps', 60, 70);
      wCtx.fillStyle = '#475569';
      wCtx.font = '22px sans-serif';
      wCtx.fillText('Launch games and collaborative tools from the bottom bar or tabletop objects!', 60, 130);

      // Colorful widget cards
      [
        { name: 'Connect Four', color: '#3b82f6', x: 60 },
        { name: 'Spin The Wheel', color: '#10b981', x: 370 },
        { name: 'Watercooler Prompts', color: '#f59e0b', x: 680 }
      ].forEach((w) => {
        wCtx.fillStyle = w.color;
        wCtx.beginPath();
        wCtx.roundRect(w.x, 190, 280, 180, 12);
        wCtx.fill();
        wCtx.fillStyle = '#ffffff';
        wCtx.font = 'bold 26px sans-serif';
        wCtx.textAlign = 'center';
        wCtx.fillText(w.name, w.x + 140, 290);
      });
      wCtx.textAlign = 'left';

      const wTex = new THREE.CanvasTexture(wCanvas);
      wTex.colorSpace = THREE.SRGBColorSpace;
      if (targetMesh.material) {
        targetMesh.material.map = wTex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'youtube') {
      activeVideoTextureRef.current = null;
      const rawUrl = payload?.url || '';
      const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      const videoId = ytMatch ? ytMatch[1] : null;

      if (videoId) {
        const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        loader.load(
          thumbUrl,
          (loadedTex) => {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            if (targetMesh.material) {
              targetMesh.material.map = loadedTex;
              targetMesh.material.needsUpdate = true;
            }
            setToastMessage('YouTube video broadcast active on screen! ▶️');
            setTimeout(() => setToastMessage(null), 2500);
          },
          undefined,
          () => {
            const ytTex = texSys?.createYoutubePlayerTexture
              ? texSys.createYoutubePlayerTexture(rawUrl, 'Spot Virtual Stream')
              : null;
            if (ytTex && targetMesh.material) {
              ytTex.colorSpace = THREE.SRGBColorSpace;
              targetMesh.material.map = ytTex;
              targetMesh.material.needsUpdate = true;
            }
          }
        );
      } else {
        const ytTex = texSys?.createYoutubePlayerTexture
          ? texSys.createYoutubePlayerTexture(rawUrl, 'Spot Virtual Video Stream')
          : null;
        if (ytTex && targetMesh.material) {
          ytTex.colorSpace = THREE.SRGBColorSpace;
          targetMesh.material.map = ytTex;
          targetMesh.material.needsUpdate = true;
        }
      }
    } else if (contentType === 'image') {
      activeVideoTextureRef.current = null;
      if (payload?.url) {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        loader.load(
          payload.url,
          (loadedTex) => {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            loadedTex.minFilter = THREE.LinearFilter;
            loadedTex.magFilter = THREE.LinearFilter;
            if (targetMesh.material) {
              targetMesh.material.map = loadedTex;
              targetMesh.material.needsUpdate = true;
            }
            setToastMessage('Image presented on screen! 🖼️');
            setTimeout(() => setToastMessage(null), 2500);
          },
          undefined,
          (err) => {
            console.warn('Image texture load err:', err);
            setToastMessage('Failed to load image. Please upload a file from your device.');
            setTimeout(() => setToastMessage(null), 3500);
          }
        );
      }
    } else if (contentType === 'document') {
      activeVideoTextureRef.current = null;
      const docTex = texSys?.createDocumentDisplayTexture
        ? texSys.createDocumentDisplayTexture(payload?.title || 'Collaborative Office Notes', payload?.text)
        : null;
      if (docTex) {
        docTex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = docTex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'code') {
      activeVideoTextureRef.current = null;
      const cTex = texSys?.createCodeEditorTexture ? texSys.createCodeEditorTexture(payload?.fileName || 'WorkspacePlatform.jsx') : null;
      if (cTex) {
        cTex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = cTex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'terminal') {
      activeVideoTextureRef.current = null;
      const tTex = texSys?.createTerminalLogsTexture ? texSys.createTerminalLogsTexture() : null;
      if (tTex) {
        tTex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = tTex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'sprint') {
      activeVideoTextureRef.current = null;
      const sTex = texSys?.createSprintBoardTexture ? texSys.createSprintBoardTexture() : null;
      if (sTex) {
        sTex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = sTex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'webpage') {
      activeVideoTextureRef.current = null;
      const webCanvas = document.createElement('canvas');
      webCanvas.width = 1024;
      webCanvas.height = 512;
      const wCtx = webCanvas.getContext('2d');
      wCtx.fillStyle = '#f8fafc';
      wCtx.fillRect(0, 0, 1024, 512);

      // Browser Chrome header
      wCtx.fillStyle = '#e2e8f0';
      wCtx.fillRect(0, 0, 1024, 60);
      wCtx.fillStyle = '#ffffff';
      wCtx.beginPath();
      wCtx.roundRect(140, 12, 744, 36, 8);
      wCtx.fill();

      wCtx.fillStyle = '#475569';
      wCtx.font = '16px monospace';
      wCtx.textAlign = 'left';
      wCtx.fillText(payload?.url || 'https://spotvirtual.com', 160, 36);

      // Content preview
      wCtx.fillStyle = '#0284c7';
      wCtx.font = 'bold 44px sans-serif';
      wCtx.fillText('🌐 Live Web Application Embed', 60, 150);

      wCtx.fillStyle = '#64748b';
      wCtx.font = '24px sans-serif';
      wCtx.fillText('Interactive browser frame projected in Spot virtual office space', 60, 210);

      const webTex = new THREE.CanvasTexture(webCanvas);
      webTex.colorSpace = THREE.SRGBColorSpace;
      targetMesh.material.map = webTex;
      targetMesh.material.needsUpdate = true;
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: userName, text: `🖥️ Updated **${screenId}** to display **${contentType}**!`, time: 'Just now' }
    ]);
  };

  // Expose test helper hooks for automated test verification
  if (typeof window !== 'undefined') {
    window.__spotSelectScreen = (screenId) => {
      const targetMesh = screensRef.current?.[screenId] || screensRef.current?.[`screen_${screenId}`] || sceneRef.current?.getObjectByName(`screen_${screenId}`);
      if (targetMesh) {
        const targetData = {
          id: screenId,
          name: targetMesh.userData?.displayName || `Office Display (${screenId})`,
          mesh: targetMesh
        };
        activeScreenTargetRef.current = targetData;
        setActiveScreenTarget(targetData);
        if (cameraRef.current && mountRef.current) {
          const sPos = new THREE.Vector3();
          targetMesh.getWorldPosition(sPos);
          const sHeight = targetMesh.userData?.height || 2.7;
          sPos.y += sHeight / 2 + 0.12;
          sPos.project(cameraRef.current);
          const cWidth = mountRef.current.clientWidth || window.innerWidth;
          const cHeight = mountRef.current.clientHeight || window.innerHeight;
          const sx = Math.round(((sPos.x + 1) * cWidth) / 2);
          const sy = Math.round(((-sPos.y + 1) * cHeight) / 2);
          setActiveScreenPos({ x: sx, y: sy });
        }
        return true;
      }
      return false;
    };
    window.__spotUpdateScreenContent = handleUpdateScreenContent;
    window.__spotStartScreenShare = startScreenShare;
    window.__spotStopScreenShare = stopScreenShare;
    window.__spotSetCamera = (pos, lookAt) => {
      cameraOverrideRef.current = { pos, lookAt };
    };
    window.__spotClearCameraOverride = () => {
      cameraOverrideRef.current = null;
    };
    window.__spotTeleportPlayer = (x, z) => {
      if (playerMeshRef.current) {
        playerMeshRef.current.position.set(x, 0, z);
        targetPosRef.current.set(x, 0, z);
      }
    };
  }

  // Trigger Canonical Spot Emote
  const triggerEmote = (emoteId, emoji) => {
    playSound('highfive');
    setActiveReaction(emoji);
    playerAnimStateRef.current = { emote: emoteId, emoteTime: Date.now() };

    setChatMessages((prev) => [
      ...prev,
      { sender: userName, text: `*used emote ${emoji} (${emoteId})*`, time: 'Just now' }
    ]);

    setTimeout(() => {
      setActiveReaction(null);
      playerAnimStateRef.current = { emote: null, emoteTime: 0 };
    }, 2800);
  };

  // Trigger Canonical Spot Social Gesture
  const triggerGesture = (gestureId, label, emoji) => {
    playSound('highfive');
    setActiveReaction(emoji);
    setChatMessages((prev) => [
      ...prev,
      { sender: userName, text: `*sent gesture ${label} ${emoji} to nearby teammates!*`, time: 'Just now' }
    ]);
    setTimeout(() => setActiveReaction(null), 3000);
  };

  // Spot OpenClaw Tools Execution
  const executeOpenClawTool = (toolName, params = {}) => {
    playSound('click');
    let result = {};
    const now = new Date().toLocaleTimeString();

    if (toolName === 'spot_observe') {
      result = {
        ok: true,
        worldId: 'spot-world-hq',
        avatar: {
          name: userName,
          spotId: currentRoomId,
          position: { x: targetPosRef.current.x.toFixed(2), z: targetPosRef.current.z.toFixed(2) },
          joined: true
        },
        nearbyAvatars: inAudioRange,
        roomsCount: 6
      };
    } else if (toolName === 'spot_rooms') {
      result = {
        ok: true,
        rooms: [
          { id: 'presentation-hall', name: 'Presentation Hall', threadId: 'th_hall_101', access: 'open' },
          { id: 'round-table-huddle', name: 'Round Table Huddle', threadId: 'th_huddle_102', access: 'open' },
          { id: 'foreground-lounge', name: 'Foreground Lounge', threadId: 'th_lounge_103', access: 'open' },
          { id: 'all-hands-table', name: 'All-Hands Table', threadId: 'th_hands_104', access: 'open' },
          { id: 'glass-boardroom', name: 'Glass Boardroom', threadId: 'th_board_105', access: 'open' },
          { id: 'engineering-desks', name: 'Engineering Desks', threadId: 'th_eng_106', access: 'open' }
        ]
      };
    } else if (toolName === 'spot_emotes') {
      result = {
        ok: true,
        emotes: ['wave', 'clap', 'cheer', 'dance', 'laugh', 'thumbsup', 'heart']
      };
    } else if (toolName === 'spot_gestures') {
      result = {
        ok: true,
        gestures: ['highfive', 'fistbump', 'handshake']
      };
    } else if (toolName === 'spot_teleport') {
      jumpToRoom('Glass Boardroom');
      result = { ok: true, teleportedTo: 'Glass Boardroom', coords: { x: 0, z: -16.0 } };
    } else if (toolName === 'spot_move_to_room') {
      jumpToRoom(params.room || 'Engineering Desks');
      result = { ok: true, movedTo: params.room || 'Engineering Desks' };
    } else {
      result = { ok: true, executed: toolName };
    }

    setToolLogs((prev) => [{ time: now, tool: toolName, result }, ...prev.slice(0, 15)]);
  };

  // AI Agent Message Sender
  const sendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { sender: 'You', text: aiInput, time: 'Just now' };
    setAiMessages((prev) => [...prev, userMsg]);
    const query = aiInput;
    setAiInput('');
    setAiTyping(true);

    setTimeout(() => {
      setAiTyping(false);
      let replyText = "Executed via Spot OpenClaw plugin. All spatial services are responsive!";
      if (query.toLowerCase().includes('observe') || query.toLowerCase().includes('where')) {
        executeOpenClawTool('spot_observe');
        replyText = `You are currently in the ${currentRoom}. 11 avatars are online, and ${inAudioRange.length} teammates are in spatial audio range.`;
      } else if (query.toLowerCase().includes('move') || query.toLowerCase().includes('teleport')) {
        executeOpenClawTool('spot_teleport');
        replyText = "Teleported your avatar to the Glass Boardroom using spot_teleport tool.";
      } else if (query.toLowerCase().includes('wave') || query.toLowerCase().includes('dance')) {
        triggerEmote('wave', '👋');
        replyText = "Dispatched canonical Spot emote 'wave' (👋) to your avatar.";
      } else if (query.toLowerCase().includes('kpi') || query.toLowerCase().includes('metric')) {
        replyText = "The back wall scoreboard reports: 168 deployments, 161 active nodes, and 47 services online.";
      }
      setAiMessages((prev) => [...prev, { sender: 'DevBot', text: replyText, time: 'Just now' }]);
    }, 700);
  };

  // Room Chat Message Sender
  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: userName, text: chatInput, time: 'Just now' }]);
    setChatInput('');
  };

  // Whiteboard drawing handlers
  const startDrawing = (e) => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#090d16',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

      {/* 1. Purple Trial Notice Banner (media_1791969444037.png & media_1791969444163.png) */}
      {isTrialBannerOpen && (
        <div style={{
          height: '36px',
          background: '#5c45b8',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontSize: '13px',
          fontWeight: 500,
          zIndex: 60,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <span>You have 27 days left in your trial.</span>
          <button
            onClick={() => alert('Spot Enterprise Free Forever Activated!')}
            style={{
              marginLeft: '12px',
              background: '#493796',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '4px',
              padding: '2px 10px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Manage Billing
          </button>
          <button
            onClick={() => setIsTrialBannerOpen(false)}
            title="Dismiss"
            style={{
              position: 'absolute',
              right: '12px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Top-Center Floating Build Mode Tool Pill (media_1791969443822.png & media_1791969444037.png) */}
      {isBuildModeOpen && (
        <div style={{
          position: 'absolute',
          top: isTrialBannerOpen ? '48px' : '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          gap: '6px',
          zIndex: 70
        }}>
          <button
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Grid Snapping"
          >
            <Grid size={16} color="#4b5563" />
          </button>
          <button
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Boundary Mode"
          >
            <Maximize2 size={16} color="#4b5563" />
          </button>
          <button
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Partition Walls"
          >
            <Edit3 size={16} color="#4b5563" />
          </button>
          <button
            onClick={() => setIsBuildModeOpen(false)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Save Blueprint"
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => setIsBuildModeOpen(false)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Spatial Audio Hearing & Microphone Status HUD (Top-Left) */}
      <div style={{
        position: 'absolute',
        top: isTrialBannerOpen ? '48px' : '16px',
        left: isSpacesSidebarOpen ? '256px' : '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 60,
        transition: 'left 0.25s ease'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isMuted ? '#ef4444' : '#22c55e',
            boxShadow: isMuted ? '0 0 6px #ef4444' : '0 0 8px #22c55e'
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
            {['office-a', 'focus-pod-1', 'focus-pod-2', 'team-suite', 'chat-a', 'chat-b', 'boardroom'].includes(currentRoomId)
              ? `🔒 In private cabin: ${currentRoom}`
              : (isMuted ? 'Spatial Audio Muted' : 'Spatial Audio Connected')}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {['office-a', 'focus-pod-1', 'focus-pod-2', 'team-suite', 'chat-a', 'chat-b', 'boardroom'].includes(currentRoomId)
              ? '• Acoustically Isolated'
              : `• ${inAudioRange.length} in hearing range`}
          </span>
        </div>
      </div>

      {/* 3. Top-Right Floating Viewport Action Buttons (Matching media_1791993853484.png) */}
      <div style={{
        position: 'absolute',
        top: isTrialBannerOpen ? '48px' : '16px',
        right: isBuildModeOpen ? '336px' : '16px',
        display: 'flex',
        gap: '8px',
        zIndex: 60,
        transition: 'right 0.2s ease'
      }}>
        {/* Zoom In Button */}
        <button
          onClick={() => {
            cameraDistanceRef.current = THREE.MathUtils.clamp(cameraDistanceRef.current - 0.8, 1.2, 16.0);
            cameraPitchAngleRef.current = THREE.MathUtils.clamp(cameraPitchAngleRef.current - 0.03, -0.12, 0.95);
            playSound('click');
          }}
          title="Zoom In (+)"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
        >
          <ZoomIn size={18} />
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={() => {
            cameraDistanceRef.current = THREE.MathUtils.clamp(cameraDistanceRef.current + 0.8, 1.2, 16.0);
            cameraPitchAngleRef.current = THREE.MathUtils.clamp(cameraPitchAngleRef.current + 0.02, -0.12, 0.95);
            playSound('click');
          }}
          title="Zoom Out (−)"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
        >
          <ZoomOut size={18} />
        </button>

        {/* Blue Avatar / Focus Avatar View Toggle (media_1791993853484.png) */}
        <button
          onClick={() => {
            if (showcaseScreenRef.current) {
              showcaseScreenRef.current = null;
              setShowcaseScreenTarget(null);
            }
            cameraDistanceRef.current = 2.4;
            if (playerMeshRef.current) {
              cameraOrbitAngleRef.current = playerMeshRef.current.rotation.y + Math.PI;
            }
            cameraPitchAngleRef.current = 0.14;
            cameraTargetYOffsetRef.current = 0;
            playSound('click');
          }}
          title="Avatar Close Focus / Over-the-Shoulder"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0091ff',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
        >
          <UserCheck size={18} />
        </button>

        {/* Recenter / GTA San Andreas Chase View Button */}
        <button
          onClick={() => {
            if (showcaseScreenRef.current) {
              showcaseScreenRef.current = null;
              setShowcaseScreenTarget(null);
            }
            cameraDistanceRef.current = 4.8;
            if (playerMeshRef.current) {
              cameraOrbitAngleRef.current = playerMeshRef.current.rotation.y + Math.PI;
            }
            cameraPitchAngleRef.current = 0.20;
            cameraTargetYOffsetRef.current = 0;
            playSound('click');
          }}
          title="Recenter Camera / GTA Chase Cam (Target Icon)"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4b5563',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
        >
          <Compass size={18} />
        </button>

        {/* Showcase Room Screen View Button */}
        <button
          onClick={() => {
            const screenId = currentRoomId?.replace('-', '_') || 'boardroom';
            window.__spotShowcaseScreen?.(screenId);
          }}
          title="Showcase Room Presentation Screen"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: showcaseScreenTarget ? '#10b981' : '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: showcaseScreenTarget ? '#ffffff' : '#16a34a',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!showcaseScreenTarget) e.currentTarget.style.background = '#f0fdf4';
          }}
          onMouseLeave={(e) => {
            if (!showcaseScreenTarget) e.currentTarget.style.background = '#ffffff';
          }}
        >
          <Tv size={18} />
        </button>

        {/* 3x3 Grid Icon: Apps / Blueprint Toggle (media_1791993853484.png) */}
        <button
          onClick={() => setIsTopDownBlueprint(!isTopDownBlueprint)}
          title={isTopDownBlueprint ? 'Switch to 3D Perspective View' : 'Switch to Floorplan Blueprint View'}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isTopDownBlueprint ? '#0091ff' : '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isTopDownBlueprint ? '#ffffff' : '#4b5563',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!isTopDownBlueprint) e.currentTarget.style.background = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            if (!isTopDownBlueprint) e.currentTarget.style.background = '#ffffff';
          }}
        >
          <Grid size={18} />
        </button>
      </div>

      {/* 4. Right Build Mode Drawer (media_1791969443822.png, media_1791969444037.png, media_1791969444094.png) */}
      {isBuildModeOpen && (
        <aside style={{
          position: 'fixed',
          top: isTrialBannerOpen ? '36px' : 0,
          right: 0,
          bottom: '52px',
          width: '320px',
          background: '#ffffff',
          borderLeft: '1px solid #e5e7eb',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
          zIndex: 65,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          {/* Header */}
          <div style={{
            height: '52px',
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f3f5'
          }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>Build Mode</h3>
            <button
              onClick={() => setIsBuildModeOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs: Add, Floorplan, Environment, Brand */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0 14px' }}>
            {['Add', 'Floorplan', 'Environment', 'Brand'].map((tab) => (
              <button
                key={tab}
                onClick={() => setBuildModeTab(tab)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: buildModeTab === tab ? '2px solid #0091ff' : '2px solid transparent',
                  color: buildModeTab === tab ? '#0091ff' : '#6b7280',
                  fontWeight: buildModeTab === tab ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Drawer Body Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {/* FLOORPLAN TAB (media_1791969443822.png) */}
            {buildModeTab === 'Floorplan' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                      CEILING HEIGHT
                    </label>
                    <input
                      type="text"
                      defaultValue="6"
                      readOnly
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', color: '#111827' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                      WALL THICKNESS
                    </label>
                    <input
                      type="text"
                      defaultValue="0.32"
                      readOnly
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', color: '#111827' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    FLOOR MATERIAL
                  </label>
                  <select style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', color: '#111827' }}>
                    <option>Bleached Birch Wood</option>
                    <option>Light Oak</option>
                    <option>White Marble</option>
                    <option>Charcoal Carpet</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    FLOOR ANGLE
                  </label>
                  <input
                    type="text"
                    placeholder="0°"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', color: '#111827' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    CEILING MATERIAL
                  </label>
                  <select style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', color: '#111827' }}>
                    <option>Acoustic Plaster</option>
                    <option>Wood Slat Canopy</option>
                    <option>Exposed Industrial</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    WALL MATERIAL
                  </label>
                  <select style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', color: '#111827' }}>
                    <option>Default</option>
                    <option>Glass Clerestory</option>
                    <option>Black Acoustic Slats</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    WALL COLOR
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 10px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: '#f8f8f8', border: '1px solid #d1d5db' }} />
                    <span style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>#f8f8f8</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    EXTERIOR MATERIAL
                  </label>
                  <select style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', color: '#111827' }}>
                    <option>Seattle Streetscape</option>
                    <option>Grass Lawn</option>
                    <option>Granite Sidewalk</option>
                  </select>
                </div>
              </div>
            )}

            {/* ENVIRONMENT TAB (media_1791969444094.png) */}
            {buildModeTab === 'Environment' && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
                  TYPE
                </label>
                <div style={{ border: '1px solid #0091ff', borderRadius: '6px', overflow: 'hidden' }}>
                  {[
                    'Seattle',
                    'Beach',
                    'Desert',
                    'Football Field',
                    'Mars',
                    'Moon',
                    'None',
                    'Park',
                    'Park Night',
                    'Simple Desert'
                  ].map((envOption) => (
                    <div
                      key={envOption}
                      onClick={() => {
                        setCurrentEnvTheme(envOption);
                        if (envHandlerRef.current?.setEnvironment) {
                          envHandlerRef.current.setEnvironment(envOption);
                        }
                      }}
                      style={{
                        padding: '10px 14px',
                        background: currentEnvTheme === envOption ? '#f0f9ff' : '#ffffff',
                        color: currentEnvTheme === envOption ? '#0091ff' : '#374151',
                        fontWeight: currentEnvTheme === envOption ? 600 : 400,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f3f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{envOption}</span>
                      {currentEnvTheme === envOption && <Check size={16} color="#0091ff" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADD TAB (media_1791969444037.png) */}
            {buildModeTab === 'Add' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #0091ff', borderRadius: '6px', padding: '7px 10px', marginBottom: '14px' }}>
                  <Search size={14} color="#9ca3af" />
                  <input
                    type="text"
                    placeholder="Search props"
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
                  />
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '8px' }}>
                  Displays
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { name: 'Wall Display', desc: 'Starry Spot screen', badge: '✓' },
                    { name: 'Monitor Stand', desc: 'Standing display', badge: '' },
                    { name: 'Whiteboard', desc: 'Hanging whiteboard', badge: '' },
                    { name: 'Easel Display', desc: 'Podium easel', badge: '' },
                    { name: 'Floor Speaker', desc: 'Hi-Fi acoustics', badge: '' },
                    { name: 'Wide Screen', desc: 'Auditorium theater', badge: '✓' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => alert(`Selected ${item.name}`)}
                      style={{
                        border: item.badge ? '2px solid #a855f7' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#ffffff',
                        position: 'relative'
                      }}
                    >
                      {item.badge && (
                        <div style={{ position: 'absolute', top: '6px', right: '6px', width: '16px', height: '16px', borderRadius: '50%', background: '#a855f7', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ✓
                        </div>
                      )}
                      <div style={{ width: '48px', height: '32px', margin: '0 auto 8px', background: '#0f172a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tv size={16} color="#22c55e" />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{item.name}</div>
                      <div style={{ fontSize: '10.5px', color: '#6b7280', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BRAND TAB */}
            {buildModeTab === 'Brand' && (
              <div style={{ fontSize: '13px', color: '#4b5563' }}>
                <p>Customize organization banners, wall plaques, and presentation signage.</p>
                <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <strong>Current Brand:</strong> Spot Virtual HQ
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 2. Main 3D Viewport */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

        {/* Projected 2D Floating In-Room Nameplates */}
        {showNameplates && screenAvatars.map((av, idx) => (
          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (av.avatarObj) {
                setHoveredAvatarPopup({
                  name: av.name,
                  role: av.role || (av.status === 'ai-agent' ? 'Autonomous AI Agent' : 'Team Member'),
                  status: av.status,
                  room: getRoomDisplayName(av.avatarObj.mesh.position),
                  x: av.x,
                  y: av.y,
                  isAI: av.status === 'ai-agent' || av.name.includes('DevBot'),
                  avatarObj: av.avatarObj
                });
              }
            }}
            style={{
              position: 'absolute',
              left: `${av.x}px`,
              top: `${av.y}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: av.isPlayer ? 'rgba(22, 163, 74, 0.96)' : 'rgba(255, 255, 255, 0.97)',
              color: av.isPlayer ? '#ffffff' : '#334155',
              padding: '4px 10px',
              borderRadius: '14px',
              boxShadow: '0 2px 7px rgba(15, 23, 42, 0.16)',
              border: av.isPlayer ? '1px solid #4ade80' : '1px solid rgba(148, 163, 184, 0.28)',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              zIndex: 10,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 7px rgba(15, 23, 42, 0.16)';
            }}
          >
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: av.isPlayer ? '#4ade80' : av.status === 'ai-agent' ? '#10b981' : '#22c55e',
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)'
            }} />
            <span>{av.name}</span>
          </div>
        ))}


        {/* Floating Screen Toolbar for Interactive Display Configuration & Showcase */}
        {activeScreenTarget && (
          <ScreenDisplayManager
            activeScreen={activeScreenTarget.id}
            screenPos={activeScreenPos}
            screenTitle={activeScreenTarget.name}
            onClose={() => {
              activeScreenTargetRef.current = null;
              setActiveScreenTarget(null);
              setActiveScreenPos(null);
            }}
            onShowcaseScreen={() => showcaseScreen(activeScreenTarget)}
            onStartScreenShare={(id) => startScreenShare(id)}
            onUpdateScreenContent={(screenId, contentType, data) => handleUpdateScreenContent(screenId, contentType, data)}
          />
        )}

        {/* Floating Active Showcase Banner when in Screen Showcase View */}
        {showcaseScreenTarget && (
          <div style={{
            position: 'absolute',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.94)',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            border: '1px solid #38bdf8',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} color="#38bdf8" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Showcase: {showcaseScreenTarget.name}</span>
            </div>
            <button
              onClick={exitShowcaseScreen}
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
            >
              Exit Showcase
            </button>
          </div>
        )}

        {/* Live Camera Feed with Spot Virtual Background Engine */}
        {isVideoOn && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '230px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            zIndex: 30
          }}>
            <div style={{ background: '#0f172a', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>SPOT CAMERA FEED</span>
              <button onClick={() => setIsVideoOn(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>
            <canvas ref={videoCanvasRef} width={230} height={155} style={{ display: 'block', background: '#000' }} />
            <div style={{ padding: '8px', display: 'flex', gap: '4px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              {['blur', 'spot-office', 'cyber', 'none'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBgMode(mode)}
                  style={{
                    flex: 1,
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '4px 0',
                    borderRadius: '4px',
                    border: 'none',
                    background: bgMode === mode ? '#0284c7' : '#e2e8f0',
                    color: bgMode === mode ? '#fff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Floating Screen Share Broadcast Window */}
        {isScreenSharing && isScreenModalOpen && (
          <div style={{
            position: 'absolute',
            bottom: '90px',
            left: '24px',
            width: '380px',
            background: '#0f172a',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            border: '2px solid #2563eb',
            overflow: 'hidden',
            zIndex: 35
          }}>
            <div style={{ padding: '8px 12px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700 }}>LIVE SCREEN BROADCAST</span>
              <button onClick={() => setIsScreenModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <Minimize2 size={15} />
              </button>
            </div>
            <video ref={screenShareVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '210px', objectFit: 'contain', background: '#000' }} />
            <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a' }}>
              <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 600 }}>● Broadcasting to all teammates</span>
              <button onClick={stopScreenShare} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                Stop Sharing
              </button>
            </div>
          </div>
        )}

        {/* Interactive Object Modals */}
        {activeModal && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            border: '1px solid #cbd5e1',
            width: '460px',
            maxWidth: '90vw',
            zIndex: 100,
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <strong style={{ fontSize: '0.95rem' }}>
                {activeModal === 'features' && '🚀 Spot Release Roadmap'}
                {activeModal === 'schedule' && '📅 1 on 1 Schedule with Stan'}
                {activeModal === 'analytics' && '📈 Realtime Cluster Telemetry'}
                {activeModal === 'kpi' && '⚡ Production KPI Scoreboard'}
                {activeModal === 'blueprint' && '🛠️ Architecture Flowchart'}
                {activeModal === 'theater' && '🎭 All-Hands Presentation Stage'}
                {activeModal === 'teammate' && '👤 Teammate Profile & Actions'}
              </strong>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {activeModal === 'features' && (
                <div>
                  <p style={{ margin: '0 0 1rem', color: '#475569', fontSize: '0.85rem' }}>
                    Features status as displayed on the huddle board:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>Calendar Integration</span>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>0%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#dbeafe', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <span style={{ fontWeight: 700, color: '#1d4ed8' }}>Spot Prints (3D Office Engine)</span>
                      <span style={{ fontWeight: 800, color: '#1d4ed8' }}>100% Complete</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>Documents Collaboration</span>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>0%</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'schedule' && (
                <div>
                  <p style={{ margin: '0 0 1rem', color: '#475569', fontSize: '0.85rem' }}>
                    Book a direct 1-on-1 sync with Stan:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {['11:00 AM (Today)', '02:30 PM (Today)', '04:00 PM (Today)', '10:00 AM (Tomorrow)'].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          playSound('chime');
                          setActiveModal(null);
                          setDonutToast(`1 on 1 scheduled with Stan for ${slot}! 📅`);
                          setTimeout(() => setDonutToast(null), 3500);
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'analytics' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1rem' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>WebRTC Latency</span>
                      <strong style={{ fontSize: '1.25rem', color: '#0284c7', display: 'block' }}>18 ms</strong>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Spatial Audio</span>
                      <strong style={{ fontSize: '1.25rem', color: '#16a34a', display: 'block' }}>48 kHz Opus</strong>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Frame Rate</span>
                      <strong style={{ fontSize: '1.25rem', color: '#7c3aed', display: 'block' }}>60 FPS</strong>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                    All audio streams are mixed peer-to-peer with zero server storage. WebGL shaders are operating at native resolution.
                  </p>
                </div>
              )}

              {activeModal === 'kpi' && (
                <div style={{ background: '#0f172a', color: '#fff', padding: '1.25rem', borderRadius: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '1rem' }}>
                    <div><span style={{ color: '#f43f5e', fontSize: '1.5rem', fontWeight: 900 }}>168</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>DEPLOYS</span></div>
                    <div><span style={{ color: '#06b6d4', fontSize: '1.5rem', fontWeight: 900 }}>161</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>ACTIVE</span></div>
                    <div><span style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 900 }}>47</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>NODES</span></div>
                    <div><span style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 900 }}>34</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>ROOMS</span></div>
                    <div><span style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 900 }}>34</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>CHANNELS</span></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                    <div><span style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 900 }}>83</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>GATEWAY</span></div>
                    <div><span style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 900 }}>85</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>PINGS</span></div>
                    <div><span style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 900 }}>6</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>ZONES</span></div>
                    <div><span style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 900 }}>52</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>MSGS/SEC</span></div>
                    <div><span style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 900 }}>25</span><br/><span style={{ fontSize: '10px', color: '#64748b' }}>AGENTS</span></div>
                  </div>
                </div>
              )}

              {activeModal === 'blueprint' && (
                <div>
                  <p style={{ margin: '0 0 1rem', color: '#475569', fontSize: '0.85rem' }}>
                    Spot Virtual Engine Architecture (Three.js WebGL + Mediasoup SFU + OpenClaw Gateway):
                  </p>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', background: '#f8fafc', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    <div style={{ color: '#2563eb' }}>[Client Browser] ──WebSocket──&gt; [Agent Gateway v0.2.0]</div>
                    <div style={{ color: '#16a34a', margin: '4px 0' }}>[WebRTC Mediasoup] ──SRTP──&gt; [Spatial Audio & Screen Mixer]</div>
                    <div style={{ color: '#d97706' }}>[OpenClaw Runtime] ──Tools──&gt; [spot_move, spot_emotes, spot_rooms]</div>
                  </div>
                </div>
              )}

              {activeModal === 'theater' && (
                <div>
                  <p style={{ margin: '0 0 1rem', color: '#475569', fontSize: '0.85rem' }}>
                    All-Hands Presentation Hall Stage is currently idle (09:38 No meetings).
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        startScreenShare();
                      }}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Broadcast Screen to Stage
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        jumpToRoom('Presentation Hall');
                      }}
                      style={{ padding: '10px 16px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Take Seat in Audience
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'teammate' && selectedTeammate && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>
                      {selectedTeammate.name[0]}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{selectedTeammate.name}</h4>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{selectedTeammate.role}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <button
                      onClick={() => {
                        playSound('highfive');
                        triggerGesture('highfive', 'High Five', '✋');
                        setActiveModal(null);
                      }}
                      style={{ padding: '9px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ✋ High Five
                    </button>
                    <button
                      onClick={() => {
                        playSound('highfive');
                        triggerGesture('fistbump', 'Fist Bump', '👊');
                        setActiveModal(null);
                      }}
                      style={{ padding: '9px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', fontWeight: 600, cursor: 'pointer' }}
                    >
                      👊 Fist Bump
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        setActiveTab('chat');
                      }}
                      style={{ padding: '9px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', fontWeight: 600, cursor: 'pointer' }}
                    >
                      💬 Direct Message
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        targetPosRef.current.copy(selectedTeammate.mesh.position);
                        playSound('click');
                      }}
                      style={{ padding: '9px', borderRadius: '6px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🚶 Walk To Teammate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. Interactive Radar Minimap HUD (Bottom-Right) */}
        <div className="Platform_minimap" style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '160px',
          height: '110px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          padding: '6px',
          zIndex: 35
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>OFFICE RADAR</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#22c55e' }}>● 11 ONLINE</span>
          </div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mx = (e.clientX - rect.left) / rect.width;
              const my = (e.clientY - rect.top) / rect.height;
              const wx = (mx - 0.5) * 116;
              const wz = (my - 0.5) * 92;
              targetPosRef.current.set(wx, 0, wz);
              isSittingRef.current = false;
              playSound('click');
            }}
            style={{
              width: '100%',
              height: '82px',
              background: '#0f172a',
              borderRadius: '6px',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              border: '1px solid #1e293b'
            }}
          >
            {/* Mega-Campus Zone Outlines */}
            {/* Executive Cabins (Top-Left) */}
            <div title="Executive Cabins" style={{ position: 'absolute', left: '2%', top: '2%', width: '26%', height: '40%', border: '1px dashed #64748b', borderRadius: 2, background: 'rgba(51, 65, 85, 0.3)' }}>
              <span style={{ fontSize: '6px', color: '#94a3b8', position: 'absolute', top: '1px', left: '2px', fontWeight: 700 }}>CABINS</span>
            </div>
            {/* Auditorium (Top-Right) */}
            <div title="Auditorium" style={{ position: 'absolute', right: '2%', top: '2%', width: '38%', height: '40%', border: '1px dashed #38bdf8', borderRadius: 2, background: 'rgba(14, 165, 233, 0.12)' }}>
              <span style={{ fontSize: '6px', color: '#38bdf8', position: 'absolute', top: '1px', left: '2px', fontWeight: 700 }}>AUDITORIUM</span>
            </div>
            {/* Central Atrium */}
            <div title="Grand Central Atrium" style={{ position: 'absolute', left: '34%', top: '38%', width: '28%', height: '26%', border: '1px dotted #475569', borderRadius: 2 }}>
              <span style={{ fontSize: '5.5px', color: '#64748b', position: 'absolute', top: '1px', left: '2px', fontWeight: 700 }}>ATRIUM</span>
            </div>
            {/* Fitness Gym (Bottom-Left) */}
            <div title="Fitness Gym" style={{ position: 'absolute', left: '2%', bottom: '2%', width: '26%', height: '40%', border: '1px dashed #f43f5e', borderRadius: 2, background: 'rgba(244, 63, 94, 0.15)' }}>
              <span style={{ fontSize: '6px', color: '#f43f5e', position: 'absolute', bottom: '1px', left: '2px', fontWeight: 700 }}>GYM</span>
            </div>
            {/* Arcade & Game Zone (Bottom-Center) */}
            <div title="Arcade & Game Zone" style={{ position: 'absolute', left: '32%', bottom: '2%', width: '32%', height: '32%', border: '1px dashed #a855f7', borderRadius: 2, background: 'rgba(168, 85, 247, 0.15)' }}>
              <span style={{ fontSize: '6px', color: '#c084fc', position: 'absolute', bottom: '1px', left: '2px', fontWeight: 700 }}>ARCADE</span>
            </div>
            {/* Swimming Pool & Sun Deck (Bottom-Right) */}
            <div title="Swimming Pool & Sun Deck" style={{ position: 'absolute', right: '2%', bottom: '2%', width: '30%', height: '40%', border: '1px dashed #06b6d4', borderRadius: 2, background: 'rgba(6, 182, 212, 0.22)' }}>
              <span style={{ fontSize: '6px', color: '#22d3ee', position: 'absolute', bottom: '1px', left: '2px', fontWeight: 700 }}>POOL</span>
            </div>

            {avatarsRef.current.filter((a) => !a.isPlayer).map((av, idx) => {
              const mx = ((av.mesh.position.x / 116) + 0.5) * 100;
              const my = ((av.mesh.position.z / 92) + 0.5) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${Math.max(4, Math.min(96, mx))}%`,
                    top: `${Math.max(4, Math.min(96, my))}%`,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: av.status === 'ai-agent' ? '#10b981' : '#22c55e',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              );
            })}

            <div style={{
              position: 'absolute',
              left: `${Math.max(4, Math.min(96, ((playerCoord.x / 116) + 0.5) * 100))}%`,
              top: `${Math.max(4, Math.min(96, ((playerCoord.z / 92) + 0.5) * 100))}%`,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8',
              transform: 'translate(-50%, -50%)',
              zIndex: 5
            }} />
          </div>
        </div>

        {/* Spot Desktop Client Build Watermark (media_1791967544189.webp) */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '24px',
          color: '#64748b',
          fontSize: '11px',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 35
        }}>
          0.0.1-re1fb443a / 60fps (N) (F)
        </div>

        {/* Click Feedback Toast */}
        {donutToast && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.92)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '2rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
            border: '1px solid #38bdf8',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{donutToast}</span>
          </div>
        )}

        {/* Reaction Floating Animation */}
        {activeReaction && (
          <div style={{
            position: 'absolute',
            bottom: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '3.5rem',
            animation: 'floatUp 2.5s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 100
          }}>
            {activeReaction}
          </div>
        )}


        {/* 8. Spot Bottom Control Bar (media_1791969444163.png) */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '52px',
          background: '#181f2a',
          borderTop: '1px solid #2d3748',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 80,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          {/* Left Section: Team Emblem, Room Indicator, Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar Circle 'S' */}
            <div
              onClick={() => setIsUserProfileOpen(!isUserProfileOpen)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#334155',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              S
            </div>

            {/* Room Breadcrumb: Office / 1 [CurrentRoom] */}
            <div
              onClick={() => setIsSpacesSidebarOpen(!isSpacesSidebarOpen)}
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', lineHeight: 1.2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                <Home size={11} />
                <span>Office</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>1</span>
                <span>{currentRoom}</span>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: '#334155', margin: '0 4px' }} />

            {/* Add Teammate / Invite with Tooltip */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsSpotLinkModalOpen(true)}
                onMouseEnter={() => setHoveredToolbarTooltip('invite')}
                onMouseLeave={() => setHoveredToolbarTooltip(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
              >
                <UserPlus size={18} />
              </button>
              {hoveredToolbarTooltip === 'invite' && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                  zIndex: 1500
                }}>
                  Invite people
                </div>
              )}
            </div>

            {/* Hammer / Build Tool with Tooltip matching media_1792295911672.png */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsBuildModeOpen(!isBuildModeOpen)}
                onMouseEnter={() => setHoveredToolbarTooltip('build')}
                onMouseLeave={() => setHoveredToolbarTooltip(null)}
                style={{
                  background: isBuildModeOpen ? '#0091ff' : 'transparent',
                  border: 'none',
                  color: isBuildModeOpen ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  transition: 'background 0.15s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Hammer size={18} />
              </button>
              {hoveredToolbarTooltip === 'build' && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                  zIndex: 1500
                }}>
                  Build mode
                </div>
              )}
            </div>

            {/* Expand / Fullscreen View with Tooltip */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                  else document.exitFullscreen();
                }}
                onMouseEnter={() => setHoveredToolbarTooltip('fullscreen')}
                onMouseLeave={() => setHoveredToolbarTooltip(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
              >
                <Maximize2 size={18} />
              </button>
              {hoveredToolbarTooltip === 'fullscreen' && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                  zIndex: 1500
                }}>
                  Full screen
                </div>
              )}
            </div>
          </div>

          {/* Center Pill Dock: Media Controls, Reactions, Hand Raise, Views */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#242c3d',
            borderRadius: '24px',
            padding: '4px 8px',
            gap: '4px'
          }}>
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              title="Toggle Microphone (Spacebar to Push-to-Talk)"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isMuted ? '#ef4444' : 'transparent',
                border: 'none',
                color: isMuted ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              title="Toggle Camera"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isVideoOn ? '#0091ff' : 'transparent',
                border: 'none',
                color: isVideoOn ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>

            {/* Screen Share */}
            <button
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              title="Share Screen"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isScreenSharing ? '#10b981' : 'transparent',
                border: 'none',
                color: isScreenSharing ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Monitor size={18} />
            </button>

            {/* Headphones / Audio */}
            <button
              onClick={() => setIsHeadphonesOn(!isHeadphonesOn)}
              title="Headphones Mode (Mute spatial audio)"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isHeadphonesOn ? '#f59e0b' : 'transparent',
                border: 'none',
                color: isHeadphonesOn ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isHeadphonesOn ? <VolumeX size={18} /> : <Headphones size={18} />}
            </button>

            {/* Reaction Smiley */}
            <button
              onClick={() => triggerEmote('cheer', '🎉')}
              title="Send Reaction"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Smile size={18} />
            </button>

            {/* Raise Hand */}
            <button
              onClick={() => triggerEmote('wave', '✋')}
              title="Raise Hand"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '16px' }}>✋</span>
            </button>

            {/* Objects & Widgets Menu Toggle (media_1792293223278.png) */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsObjectsMenuOpen(!isObjectsMenuOpen);
                  setIsRoomMenuOpen(false);
                }}
                title="Add Objects & Widgets"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isObjectsMenuOpen ? '#ffffff' : 'transparent',
                  border: 'none',
                  color: isObjectsMenuOpen ? '#0f172a' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Layers size={18} />
              </button>

              {/* Objects & Widgets Popover matching media_1792293223278.png */}
              {isObjectsMenuOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '48px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '210px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.22)',
                  border: '1px solid #cbd5e1',
                  padding: '8px 0',
                  zIndex: 1500,
                  textAlign: 'left'
                }}>
                  <div style={{ padding: '6px 14px 2px', fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                    OBJECTS
                  </div>
                  <button
                    onClick={() => {
                      setIsStickyNoteOpen(true);
                      setIsObjectsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#0f172a',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '15px' }}>📋</span>
                    <span>Sticky note</span>
                  </button>

                  <div style={{ padding: '8px 14px 2px', fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                    WIDGETS
                  </div>
                  <button
                    onClick={() => {
                      setIsSharedBrowserOpen(true);
                      setIsObjectsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#0f172a',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Globe size={16} color="#0284c7" />
                    <span>Shared browser</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPollOpen(true);
                      setIsObjectsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#0f172a',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <BarChart3 size={16} color="#06b6d4" />
                    <span>Poll</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsYouTubeOpen(true);
                      setIsObjectsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#0f172a',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Youtube size={16} color="#ef4444" />
                    <span>YouTube</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerOpen(true);
                      setIsObjectsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#0f172a',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Clock size={16} color="#64748b" />
                    <span>Timer</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3-Dots Room Actions Menu (media_1792293223292.png) */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsRoomMenuOpen(!isRoomMenuOpen);
                  setIsObjectsMenuOpen(false);
                }}
                title="Room Actions"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isRoomMenuOpen ? '#ffffff' : 'transparent',
                  border: 'none',
                  color: isRoomMenuOpen ? '#0f172a' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MoreVertical size={18} />
              </button>

              {/* Room Actions Popover matching media_1792293223292.png */}
              {isRoomMenuOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '48px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '200px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                  border: '1px solid #cbd5e1',
                  padding: '6px 0',
                  zIndex: 1500,
                  textAlign: 'left'
                }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setToastMessage(`Copied link to ${currentRoom}! 📋`);
                      setTimeout(() => setToastMessage(null), 3000);
                      setIsRoomMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#1e293b',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Copy link
                  </button>
                  <button
                    onClick={() => {
                      if (playerMeshRef.current) {
                        const p = playerMeshRef.current.position;
                        avatarsRef.current.forEach((av, i) => {
                          if (!av.isPlayer && av.mesh) {
                            av.mesh.position.set(p.x + (i + 1) * 1.2, 0, p.z + 1.2);
                            av.initialSitting = false;
                            avatarSystem.applyAvatarPose(av.parts, { isSitting: false });
                          }
                        });
                        playSound('chime');
                        setToastMessage(`All members moved to ${currentRoom}! 👥`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }
                      setIsRoomMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#1e293b',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Move members here
                  </button>
                  <button
                    onClick={() => {
                      const nextState = !isPresenterMode;
                      setIsPresenterMode(nextState);
                      playSound('click');
                      setToastMessage(nextState ? 'Presenter Mode ON 🎙️' : 'Presenter Mode OFF');
                      setTimeout(() => setToastMessage(null), 3000);
                      setIsRoomMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: isPresenterMode ? '#0284c7' : '#1e293b',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {isPresenterMode ? 'Turn off Presenter Mode' : 'Turn on Presenter Mode'}
                  </button>
                  <button
                    onClick={() => {
                      setIsRoomMenuOpen(false);
                      setRoomSettingsTab('overview');
                      setIsRoomSettingsOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#1e293b',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Room settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Room badge & Chat trigger, Calendar, Mail, Clock, Chat, Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Active Room Badge Button (media_1792293238602.png) */}
            <button
              onClick={() => setIsRoomChatOpen(!isRoomChatOpen)}
              title="Open Room Chat Feed"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                background: isRoomChatOpen ? '#0284c7' : '#242c3d',
                color: '#f8fafc',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={15} color={isRoomChatOpen ? '#ffffff' : '#0091ff'} />
              <span>{currentRoom}</span>
            </button>

            {/* Calendar */}
            <button
              onClick={() => alert('Calendar: Next standup in Conference B at 2:00 PM')}
              title="Calendar"
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
            >
              <Calendar size={18} />
            </button>

            {/* Mail */}
            <button
              onClick={() => alert('Mail: 2 unread team invites')}
              title="Mail / Messages"
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
            >
              <Mail size={18} />
            </button>

            {/* Clock */}
            <button
              onClick={() => alert(`Local Office Time: ${new Date().toLocaleTimeString()}`)}
              title="Schedule / Time"
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
            >
              <Clock size={18} />
            </button>

            {/* Room Chat Bubble */}
            <button
              onClick={() => setActiveTab(activeTab === 'chat' ? 'none' : 'chat')}
              title="Room Chat"
              style={{
                background: activeTab === 'chat' ? '#0091ff' : 'transparent',
                border: 'none',
                color: activeTab === 'chat' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px'
              }}
            >
              <MessageSquare size={18} />
            </button>

            {/* User Avatar Circle with Online Dot */}
            <div
              onClick={() => setIsUserProfileOpen(!isUserProfileOpen)}
              style={{ position: 'relative', cursor: 'pointer' }}
              title="Open User Profile"
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #0091ff'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Ayush"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#10b981',
                border: '1.5px solid #181f2a'
              }} />
            </div>
          </div>
        </div>

        {/* 9. Spot Spaces & Team Presence Sidebar (media_1791967544265.webp) */}
        <SpacesSidebar
          isOpen={isSpacesSidebarOpen}
          onClose={() => setIsSpacesSidebarOpen(false)}
          currentSpace={currentSpace}
          onSelectSpace={handleSelectSpace}
          currentRoom={currentRoom}
          onSelectRoom={(rm) => jumpToRoom(rm)}
          userName={userName}
          onOpenInvite={() => setIsSpotLinkModalOpen(true)}
        />

        {/* 10. Spot User Profile & Status Drawer (media_1791967544187.webp) */}
        <UserProfileDrawer
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          userName={userName}
          userEmail="ayush@spotvirtual.com"
          isHeadphonesOn={isHeadphonesOn}
          onToggleHeadphones={() => setIsHeadphonesOn(!isHeadphonesOn)}
          onExit={onExit}
        />

        {/* 11. Connect Four Tabletop Widget (spotvirtual.com ConnectFourWidget) */}
        <ConnectFourWidget
          isOpen={isConnectFourOpen}
          onClose={() => setIsConnectFourOpen(false)}
        />

        {/* 12. Spin The Wheel Tabletop Widget (spotvirtual.com SpinWheelWidget) */}
        <SpinWheelWidget
          isOpen={isSpinWheelOpen}
          onClose={() => setIsSpinWheelOpen(false)}
        />

        {/* 13. Watercooler Prompt Generator (spotvirtual.com WatercoolerWidget) */}
        <WatercoolerWidget
          isOpen={isWatercoolerOpen}
          onClose={() => setIsWatercoolerOpen(false)}
        />

        {/* 14. Terrace Giant Chessboard Widget (spotvirtual.com ChessGameWidget) */}
        <ChessGameWidget
          isOpen={isChessOpen}
          onClose={() => setIsChessOpen(false)}
        />

        {/* 14b. Playable Retro Arcade Cabinet Widget */}
        <ArcadeGameWidget
          isOpen={isArcadeOpen}
          onClose={() => setIsArcadeOpen(false)}
        />

        {/* 14c. Playable 8-Ball Billiards Table Widget */}
        <BilliardsGameWidget
          isOpen={isBilliardsOpen}
          onClose={() => setIsBilliardsOpen(false)}
        />

        {/* 14d. Playable Table Tennis Ping Pong Widget */}
        <PingPongGameWidget
          isOpen={isPingPongOpen}
          onClose={() => setIsPingPongOpen(false)}
        />

        {/* Floating Swimming Water HUD Indicator */}
        {isSwimming && (
          <div style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(2, 132, 199, 0.98))',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '9999px',
            boxShadow: '0 12px 30px -4px rgba(14, 165, 233, 0.55), 0 0 20px rgba(56, 189, 248, 0.45)',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            userSelect: 'none',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ fontSize: '22px' }}>🏊</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em' }}>SWIMMING IN POOL</span>
              <span style={{ fontSize: '11px', opacity: 0.9, fontWeight: 500 }}>WASD / Arrow keys for front crawl & flutter kicks</span>
            </div>
          </div>
        )}

        {/* 15. Spot Room Link Modal & Deep Link Teleport */}
        <SpotLinkModal
          isOpen={isSpotLinkModalOpen}
          onClose={() => setIsSpotLinkModalOpen(false)}
          currentRoom={currentRoom}
          workspaceSlug={workspaceSlug}
          userName={userName}
          onTeleportToRoom={jumpToRoom}
        />

        {/* 15b. Spot Room Settings Modal (Overview / Transcription / Advanced) */}
        <RoomSettingsModal
          isOpen={isRoomSettingsOpen}
          onClose={() => setIsRoomSettingsOpen(false)}
          initialTab={roomSettingsTab}
          roomName={currentRoom}
          onSave={(settings) => {
            if (settings.roomName && settings.roomName !== currentRoom) {
              setCurrentRoom(settings.roomName);
            }
          }}
        />

        {/* 16. Interactive Sticky Note Widget */}
        <StickyNoteWidget
          isOpen={isStickyNoteOpen}
          onClose={() => setIsStickyNoteOpen(false)}
        />

        {/* 17. Collaborative Shared Browser Widget */}
        <SharedBrowserWidget
          isOpen={isSharedBrowserOpen}
          onClose={() => setIsSharedBrowserOpen(false)}
        />

        {/* 18. Live Team Poll Widget */}
        <PollWidget
          isOpen={isPollOpen}
          onClose={() => setIsPollOpen(false)}
        />

        {/* 19. Synchronized YouTube Video Player Widget */}
        <YouTubeWidget
          isOpen={isYouTubeOpen}
          onClose={() => setIsYouTubeOpen(false)}
        />

        {/* 20. Productivity Focus Timer & Stopwatch Widget */}
        <TimerWidget
          isOpen={isTimerOpen}
          onClose={() => setIsTimerOpen(false)}
        />

        {/* 21. Floating "Sit down" Badge on Furniture Hover (media_1792293223278.png) */}
        {hoverChairScreenPos && !isSittingRef.current && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (window.__spotExecuteSitOnChair && hoverChairScreenPos.chairObj) {
                window.__spotExecuteSitOnChair(hoverChairScreenPos.chairObj, hoverChairScreenPos.hitPoint);
              }
              setHoverChairScreenPos(null);
            }}
            style={{
              position: 'fixed',
              left: `${hoverChairScreenPos.x}px`,
              top: `${hoverChairScreenPos.y - 18}px`,
              transform: 'translate(-50%, -100%)',
              background: '#0f172a',
              color: '#ffffff',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              zIndex: 1000,
              userSelect: 'none',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Sit down
          </div>
        )}

        {/* 21b. Interactive Avatar Profile Name Popup ("Who is who") */}
        {hoveredAvatarPopup && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: `${hoveredAvatarPopup.x}px`,
              top: `${hoveredAvatarPopup.y - 12}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto',
              zIndex: 2000,
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '12px 14px',
              boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12)',
              minWidth: '220px',
              maxWidth: '260px',
              fontFamily: 'Inter, -apple-system, sans-serif',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            {/* Header: Initial/Icon + Name + Status Dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: hoveredAvatarPopup.isAI ? '#10b981' : '#0091ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  flexShrink: 0
                }}
              >
                {hoveredAvatarPopup.isAI ? '🤖' : hoveredAvatarPopup.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hoveredAvatarPopup.name}
                  </span>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: hoveredAvatarPopup.isAI ? '#10b981' : '#22c55e',
                      boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
                      flexShrink: 0
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {hoveredAvatarPopup.role}
                </div>
              </div>
            </div>

            {/* Room Location Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '11px',
                color: '#cbd5e1',
                marginBottom: '10px'
              }}
            >
              <span>📍</span>
              <span>{hoveredAvatarPopup.room}</span>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('highfive');
                  triggerGesture('wave', 'Waved at ' + hoveredAvatarPopup.name, '👋');
                  setToastMessage(`Waved at ${hoveredAvatarPopup.name}! 👋`);
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                style={{
                  flex: 1,
                  padding: '5px 6px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
              >
                <span>👋 Wave</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoomChatOpen(true);
                  setHoveredAvatarPopup(null);
                }}
                style={{
                  flex: 1,
                  padding: '5px 6px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
              >
                <span>💬 Chat</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hoveredAvatarPopup.avatarObj?.mesh) {
                    const target = hoveredAvatarPopup.avatarObj.mesh.position.clone();
                    target.z += 1.5;
                    targetPosRef.current.copy(target);
                    playSound('click');
                    setToastMessage(`Walking to ${hoveredAvatarPopup.name}... 🚶`);
                    setTimeout(() => setToastMessage(null), 2500);
                  }
                  setHoveredAvatarPopup(null);
                }}
                style={{
                  flex: 1,
                  padding: '5px 6px',
                  borderRadius: '6px',
                  background: '#0091ff',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#007be5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#0091ff')}
              >
                <span>🚶 Go To</span>
              </button>
            </div>

            {/* Downward Pointer Triangle */}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #0f172a'
              }}
            />
          </div>
        )}

        {/* 22. Top Right Floating 3D Canvas Controls (media_1792293223270.png) */}
        <div style={{
          position: 'fixed',
          top: isTrialBannerOpen ? '50px' : '16px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 100
        }}>
          {/* Proximity Audio Mode Toggle */}
          <button
            onClick={() => {
              setProximityMode(!proximityMode);
              setToastMessage(proximityMode ? 'Proximity Audio: Disabled 🌐' : 'Proximity Audio: Enabled 🎧');
              setTimeout(() => setToastMessage(null), 2500);
            }}
            title="Toggle Proximity Audio"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: proximityMode ? '#0284c7' : '#64748b',
              cursor: 'pointer'
            }}
          >
            <Radio size={20} />
          </button>

          {/* Center Camera on Player Avatar */}
          <button
            onClick={() => {
              if (playerMeshRef.current) {
                cameraOrbitAngleRef.current = 0;
                cameraPitchAngleRef.current = 0.24;
                cameraDistanceRef.current = 4.2;
                setToastMessage('Camera centered on avatar 🎯');
                setTimeout(() => setToastMessage(null), 2500);
              }
            }}
            title="Center on Avatar"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            <Crosshair size={20} />
          </button>

          {/* Spaces Directory / Rooms Grid Toggle */}
          <button
            onClick={() => setIsSpacesSidebarOpen(!isSpacesSidebarOpen)}
            title="Toggle Spaces & Rooms Directory"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            <Grid size={20} />
          </button>
        </div>

        {/* 23. Room Chat Drawer matching media_1792293238602.png ("Message Lobby") */}
        {isRoomChatOpen && (
          <div style={{
            position: 'fixed',
            top: isTrialBannerOpen ? '36px' : '0',
            right: 0,
            bottom: '56px',
            width: '360px',
            background: '#ffffff',
            boxShadow: '-4px 0 25px rgba(0,0,0,0.12)',
            borderLeft: '1px solid #cbd5e1',
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {/* Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsRoomChatOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                >
                  <ArrowLeft size={18} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                  <span>🚪</span>
                  <span>{currentRoom}</span>
                  <ChevronDown size={14} color="#64748b" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={16} color="#64748b" style={{ cursor: 'pointer' }} />
                <Maximize2 size={15} color="#64748b" style={{ cursor: 'pointer' }} />
                <button
                  onClick={() => setIsRoomChatOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
              {/* Big Circular S Avatar & Start of Feed */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                color: '#475569',
                marginBottom: '16px'
              }}>
                S
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                <span>🚪</span>
                <span>{currentRoom}</span>
              </div>

              <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
                Created by Ayush Kesharwani on Wednesday 14 October.
              </p>
              <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#94a3b8', lineHeight: 1.4 }}>
                This is the start of the room's chat feed.
              </p>

              {/* Messages Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {roomMessages.map((msg) => (
                  <div key={msg.id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700
                    }}>
                      {msg.sender[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{msg.sender}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input Footer */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!roomChatDraft.trim()) return;
                  const newMsg = {
                    id: Date.now(),
                    sender: userName,
                    text: roomChatDraft.trim(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                  setRoomMessages((prev) => [...prev, newMsg]);
                  setRoomChatDraft('');
                  playSound('click');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1.5px solid #0284c7',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  background: '#ffffff'
                }}
              >
                <input
                  type="text"
                  placeholder={`Message ${currentRoom}`}
                  value={roomChatDraft}
                  onChange={(e) => setRoomChatDraft(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smile size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
                    <Paperclip size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
                  </div>
                  <button
                    type="submit"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: roomChatDraft.trim() ? '#0284c7' : '#cbd5e1',
                      cursor: roomChatDraft.trim() ? 'pointer' : 'default',
                      padding: '2px'
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* 9. Sliding Side Drawers (AI Agent, Room Chat, Whiteboard, Settings) */}
      {activeTab !== 'none' && (
        <aside style={{
          position: 'fixed',
          top: '62px',
          right: 0,
          bottom: 0,
          width: '420px',
          background: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Drawer Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeTab === 'ai' && <Bot size={18} color="#10b981" />}
              {activeTab === 'chat' && <MessageSquare size={18} color="#0284c7" />}
              {activeTab === 'whiteboard' && <Edit3 size={18} color="#2563eb" />}
              {activeTab === 'settings' && <Sliders size={18} color="#64748b" />}
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                {activeTab === 'ai' && 'Spot OpenClaw Gateway (v0.2.0)'}
                {activeTab === 'chat' && 'Room Chat & Threads'}
                {activeTab === 'whiteboard' && 'Interactive Whiteboard'}
                {activeTab === 'settings' && 'Audio & Device Settings'}
              </strong>
            </div>
            <button
              onClick={() => setActiveTab('none')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            {/* OpenClaw Sub-Tabs */}
            {activeTab === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                  <button
                    onClick={() => setOpenClawSubTab('chat')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: 'none',
                      background: openClawSubTab === 'chat' ? '#ffffff' : 'transparent',
                      color: openClawSubTab === 'chat' ? '#0f172a' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    AI Agent Chat
                  </button>
                  <button
                    onClick={() => setOpenClawSubTab('console')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: 'none',
                      background: openClawSubTab === 'console' ? '#ffffff' : 'transparent',
                      color: openClawSubTab === 'console' ? '#0f172a' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    OpenClaw Tools Console
                  </button>
                </div>

                {openClawSubTab === 'chat' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {aiMessages.map((m, idx) => (
                        <div
                          key={idx}
                          style={{
                            alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            background: m.sender === 'You' ? '#0284c7' : '#f1f5f9',
                            color: m.sender === 'You' ? '#ffffff' : '#0f172a',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px', fontWeight: 600 }}>{m.sender} &bull; {m.time}</div>
                          <div>{m.text}</div>
                        </div>
                      ))}
                      {aiTyping && (
                        <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem', color: '#64748b' }}>
                          DevBot is querying OpenClaw gateway...
                        </div>
                      )}
                    </div>
                    <form onSubmit={sendAiMessage} style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask DevBot or trigger spatial tools..."
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', cursor: 'pointer' }}>
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                      <button
                        onClick={() => executeOpenClawTool('spot_observe')}
                        style={{ padding: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        📡 spot_observe
                      </button>
                      <button
                        onClick={() => executeOpenClawTool('spot_rooms')}
                        style={{ padding: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🏢 spot_rooms
                      </button>
                      <button
                        onClick={() => executeOpenClawTool('spot_emotes')}
                        style={{ padding: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🎉 spot_emotes
                      </button>
                      <button
                        onClick={() => executeOpenClawTool('spot_teleport')}
                        style={{ padding: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        ⚡ spot_teleport
                      </button>
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>EXECUTION LOGS:</div>
                    <div style={{ flex: 1, background: '#090d16', color: '#22c55e', padding: '10px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '10px', overflowY: 'auto', maxHeight: '320px' }}>
                      {toolLogs.map((log, idx) => (
                        <div key={idx} style={{ marginBottom: '8px', borderBottom: '1px dashed #1e293b', paddingBottom: '6px' }}>
                          <span style={{ color: '#94a3b8' }}>[{log.time}]</span> <span style={{ color: '#38bdf8' }}>TOOL:</span> {log.tool}
                          <pre style={{ margin: '4px 0 0', color: '#a7f3d0', whiteSpace: 'pre-wrap' }}>{JSON.stringify(log.result, null, 2)}</pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Room Chat */}
            {activeTab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: m.sender === userName ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: m.sender === userName ? '#0f172a' : '#f1f5f9',
                        color: m.sender === userName ? '#ffffff' : '#0f172a',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px', fontWeight: 600 }}>{m.sender} &bull; {m.time}</div>
                      <div>{m.text}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendChatMessage} style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Message in #${currentRoomId}...`}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', cursor: 'pointer' }}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* Whiteboard */}
            {activeTab === 'whiteboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#0f172a'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setDrawColor(color)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: color,
                          border: drawColor === color ? '2px solid #000' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={clearWhiteboard}
                    style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', border: 'none', cursor: 'pointer' }}
                  >
                    Clear Board
                  </button>
                </div>
                <canvas
                  ref={whiteboardCanvasRef}
                  width={380}
                  height={420}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    background: '#ffffff',
                    cursor: 'crosshair',
                    touchAction: 'none'
                  }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
                  Whiteboard changes synchronize live with all participants in {currentRoom}.
                </span>
              </div>
            )}

            {/* Device Settings */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Microphone Input
                  </label>
                  <select
                    value={selectedInput}
                    onChange={(e) => setSelectedInput(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    {audioDevices.inputs.length > 0 ? (
                      audioDevices.inputs.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone (${d.deviceId.slice(0, 8)})`}</option>
                      ))
                    ) : (
                      <option value="">Default Internal Microphone</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Audio Output (Speakers/Headphones)
                  </label>
                  <select
                    value={selectedOutput}
                    onChange={(e) => setSelectedOutput(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    {audioDevices.outputs.length > 0 ? (
                      audioDevices.outputs.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Speaker (${d.deviceId.slice(0, 8)})`}</option>
                      ))
                    ) : (
                      <option value="">Default Audio Output</option>
                    )}
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Spatial Audio Radius</label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>{spatialFalloff}m</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="18"
                    step="0.5"
                    value={spatialFalloff}
                    onChange={(e) => setSpatialFalloff(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Voices fade realistically as teammates move outside this proximity radius.</span>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>DeepFilterNet Noise Suppression</span>
                    <input
                      type="checkbox"
                      checked={noiseSuppression}
                      onChange={(e) => setNoiseSuppression(e.target.checked)}
                      style={{ width: 18, height: 18 }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Filters out background typing, air conditioning, and room reverb in WebRTC Opus streams.
                  </span>
                </div>

                <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#1d4ed8', display: 'block', marginBottom: '4px' }}>Spacebar Push-to-Talk</strong>
                  <span style={{ fontSize: '0.82rem', color: '#334155' }}>
                    Hold down the <strong>Spacebar</strong> anytime to instantly unmute your microphone. Releasing spacebar returns you to muted state.
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
