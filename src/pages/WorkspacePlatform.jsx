import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Headphones, Volume2,
  Users, Bot, MessageSquare, Edit3, Share2, LogOut, Settings,
  Sparkles, Send, Plus, Check, ChevronRight, ChevronDown, X, PhoneCall, VolumeX,
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, HelpCircle, Coffee, Compass,
  Terminal, Sliders, Camera, Layers, Radio, Play, Smile, MapPin, Calendar,
  TrendingUp, Tv, CheckCircle2, UserCheck, Activity, Eye, Tag,
  Grid, Mail, Clock, Hammer, Search, Home
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

export default function WorkspacePlatform({ user, onExit }) {
  const mountRef = useRef(null);

  // User & Room state (defaults to Boardroom / Sunn Kesh HQ matching media_1791969444037.png)
  const [userName, setUserName] = useState(user?.fullName || 'Ayush Kesharwani');
  const [currentRoom, setCurrentRoom] = useState(user?.targetRoom || 'Boardroom');
  const [currentRoomId, setCurrentRoomId] = useState('boardroom');
  const [workspaceSlug, setWorkspaceSlug] = useState(user?.workspaceSlug || '@sunnkesh-4c24f4f3d747fffc');
  const [inAudioRange, setInAudioRange] = useState(['Alex', 'Wes', 'Stefan', 'Steven', 'Phil']);
  const [activeTab, setActiveTab] = useState('none'); // 'none', 'ai', 'team', 'chat', 'whiteboard', 'settings'
  const [activeReaction, setActiveReaction] = useState(null);
  const [donutToast, setDonutToast] = useState(null);
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
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isSpacesSidebarOpen, setIsSpacesSidebarOpen] = useState(true); // Open by default matching reference
  const screensRef = useRef({});
  const screenTexturesRef = useRef(null);

  // Spot Tabletop Widgets & Link Modal
  const [isConnectFourOpen, setIsConnectFourOpen] = useState(false);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [isWatercoolerOpen, setIsWatercoolerOpen] = useState(false);
  const [isSpotLinkModalOpen, setIsSpotLinkModalOpen] = useState(false);

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
  const targetPosRef = useRef(new THREE.Vector3(-9, 0, 16));
  const isSittingRef = useRef(false);
  const avatarsRef = useRef([]);
  const chairsRef = useRef([]);
  const wavingHandMeshRef = useRef(null);
  const playerAnimStateRef = useRef({ emote: null, emoteTime: 0 });
  const keysPressedRef = useRef({});

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

  // 3. Real Screen Sharing Handler
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenStream(stream);
      setIsScreenSharing(true);
      setIsScreenModalOpen(true);
      if (screenShareVideoRef.current) {
        screenShareVideoRef.current.srcObject = stream;
        screenShareVideoRef.current.play();
      }
      playSound('chime');
      setChatMessages((prev) => [
        ...prev,
        { sender: userName, text: '🖥️ *started sharing screen in the workspace!*', time: 'Just now' }
      ]);
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.warn('Screen share canceled or denied:', err);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
    }
    setScreenStream(null);
    setIsScreenSharing(false);
    setIsScreenModalOpen(false);
    playSound('click');
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

    // Elevated three-quarter view: keep the same working distance, but tilt down
    // more so the office fills the viewport and the distant landscape stays secondary.
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(34, aspect, 0.5, 600);
    // Perspective view focusing on Boardroom (-9, 0, 16)
    camera.position.set(-9.0, 15.0, 31.0);
    camera.lookAt(-9.0, 1.8, 16.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
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
    const roster = avatarSystem.createRoster(scene);
    avatarsRef.current = roster;

    const playerObj = roster.find((a) => a.isPlayer);
    if (playerObj) {
      playerMeshRef.current = playerObj.mesh;
      playerPartsRef.current = playerObj.parts;
    }

    const sarahObj = roster.find((a) => a.name === 'Sarah');
    if (sarahObj && sarahObj.parts?.wavingHandMesh) {
      wavingHandMeshRef.current = sarahObj.parts.wavingHandMesh;
    }

    // Raycast Pointer Down (Interactions, Movement & Click-to-Sit)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      if (e.target.closest('header, aside, .Platform_uiDock, .Platform_toast, .Platform_modal, .Platform_minimap')) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let clickedObj = intersects[0].object;

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

          // 12-Icon Screen Display Target Click (media_1791967521142.png)
          if (['featBoard', 'mobileSchedule', 'screen1', 'screen2', 'screen3', 'theaterScreen', 'boardroomScreen'].includes(clickedObj.name)) {
            playSound('chime');
            const screenDisplayNames = {
              theaterScreen: 'Main Auditorium Theater Screen',
              featBoard: 'Roadmap & Sprints Feature Board',
              mobileSchedule: 'Mobile Stand Schedule Whiteboard',
              screen1: 'Telemetry Area Chart Display',
              screen2: 'Digital LED KPI Scoreboard',
              screen3: 'Architecture Blueprint Display',
              boardroomScreen: 'Conference Room B Presentation Screen'
            };
            setActiveScreenTarget({
              id: clickedObj.name,
              name: screenDisplayNames[clickedObj.name] || 'Spot Office Screen',
              mesh: clickedObj
            });
            return;
          }

          // Conference Room B Tabletop Widgets & Audio Controls
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

          if (clickedObj.name === 'clickable_chair' || clickedObj.name?.startsWith('chair_')) {
            const nearestChair = chairsRef.current.reduce((closest, chair) => {
              const d = chair.pos.distanceTo(intersects[0].point);
              return !closest || d < closest.dist ? { chair, dist: d } : closest;
            }, null);

            if (nearestChair && nearestChair.dist < 3.5) {
              playSound('click');
              targetPosRef.current.copy(nearestChair.chair.pos);
              isSittingRef.current = true;
              return;
            }
          }

          clickedObj = clickedObj.parent;
        }

        const point = intersects[0].point;
        targetPosRef.current.set(point.x, 0, point.z);
        isSittingRef.current = false;
        playSound('click');

        if (point.x < -10 && point.z < -8) {
          setCurrentRoom('Presentation Hall');
          setCurrentRoomId('presentation-hall');
        } else if (point.x < -10) {
          setCurrentRoom('Round Table Huddle');
          setCurrentRoomId('round-table-huddle');
        } else if (point.x > 8 && point.z < -4) {
          setCurrentRoom('Engineering Desks');
          setCurrentRoomId('engineering-desks');
        } else if (point.z < -8) {
          setCurrentRoom('Glass Boardroom');
          setCurrentRoomId('glass-boardroom');
        } else if (point.z > 8) {
          setCurrentRoom('Foreground Lounge');
          setCurrentRoomId('foreground-lounge');
        } else {
          setCurrentRoom('All-Hands Table');
          setCurrentRoomId('all-hands-table');
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
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

      // Sarah's waving cartoon hand
      if (wavingHandMeshRef.current) {
        wavingHandMeshRef.current.rotation.z = Math.sin(elapsed * 5) * 0.22;
      }

      // Process Keyboard WASD Movement
      const keys = keysPressedRef.current;
      const moveVec = new THREE.Vector3(0, 0, 0);
      if (keys['KeyW'] || keys['ArrowUp']) moveVec.z -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) moveVec.z += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) moveVec.x -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) moveVec.x += 1;

      if (playerMeshRef.current && playerPartsRef.current) {
        const player = playerMeshRef.current;
        const parts = playerPartsRef.current;
        let isMoving = false;

        if (moveVec.lengthSq() > 0) {
          moveVec.normalize();
          player.position.addScaledVector(moveVec, delta * 6.5);
          targetPosRef.current.copy(player.position);
          const angle = Math.atan2(moveVec.x, moveVec.z);
          player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, angle, 0.25);
          isSittingRef.current = false;
          isMoving = true;
        } else {
          const target = targetPosRef.current;
          const dist = player.position.distanceTo(target);

          if (dist > 0.15) {
            const dir = new THREE.Vector3().subVectors(target, player.position).normalize();
            const targetAngle = Math.atan2(dir.x, dir.z);
            player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetAngle, 0.2);
            player.position.addScaledVector(dir, Math.min(dist, delta * 6.2));
            isMoving = true;
          }
        }

        // Kinematics & Pose Animation
        if (isMoving) {
          walkCycle += delta * 12;
          // Articulated legs alternating swing
          if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = Math.sin(walkCycle) * 0.55;
          if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -Math.sin(walkCycle) * 0.55;
          // Articulated arms counter swing
          if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -Math.sin(walkCycle) * 0.45;
          if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = Math.sin(walkCycle) * 0.45;
          // Natural vertical hip bobbing
          player.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.08;
        } else if (isSittingRef.current) {
          // Seated pose on chair cushion
          player.position.y = -0.15;
          if (parts.leftLegPivot) {
            parts.leftLegPivot.rotation.x = -Math.PI / 2;
            parts.rightLegPivot.rotation.x = -Math.PI / 2;
          }
          if (parts.leftArmPivot) {
            parts.leftArmPivot.rotation.x = -Math.PI / 3;
            parts.rightArmPivot.rotation.x = -Math.PI / 3;
          }
        } else {
          // Idle standing pose with gentle breathing sway
          player.position.y = 0;
          if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = 0;
          if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = 0;
          if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = 0;

          // Emote handling
          const animState = playerAnimStateRef.current;
          if (animState.emote === 'wave' && parts.rightArmPivot) {
            parts.rightArmPivot.rotation.z = Math.PI * 0.75 + Math.sin(elapsed * 12) * 0.3;
            parts.rightArmPivot.rotation.x = -0.3;
          } else if (parts.rightArmPivot) {
            parts.rightArmPivot.rotation.z = 0;
            parts.rightArmPivot.rotation.x = 0;
          }

          if (parts.torsoGroup) {
            parts.torsoGroup.position.y = 1.15 + Math.sin(elapsed * 2.5) * 0.015;
          }
        }

        setPlayerCoord({ x: player.position.x, z: player.position.z });
      }

      // Project Avatar Names to 2D Screen Space
      const projected = [];
      avatarsRef.current.forEach((av) => {
        const pos = new THREE.Vector3();
        av.mesh.getWorldPosition(pos);
        pos.y += 2.65;
        pos.project(camera);

        const x = ((pos.x + 1) * width) / 2;
        const y = ((-pos.y + 1) * height) / 2;

        projected.push({
          name: av.name,
          x,
          y,
          isPlayer: av.isPlayer,
          status: av.status
        });
      });
      setScreenAvatars(projected);

      // Proximity Detection
      if (playerMeshRef.current) {
        const pPos = playerMeshRef.current.position;
        const nearby = [];
        avatarsRef.current.forEach((av) => {
          if (!av.isPlayer) {
            const d = pPos.distanceTo(av.mesh.position);
            if (d < spatialFalloff) {
              nearby.push(av.name.replace(' (AI)', ''));
            }
          }
        });
        setInAudioRange(nearby);
      }

      // Smooth Camera Follow or Top-Down Blueprint View (media_1791969443822.png vs media_1791969444163.png)
      if (playerMeshRef.current && camera) {
        if (isTopDownBlueprint) {
          camera.position.lerp(new THREE.Vector3(0, 68, 0), 0.08);
          camera.lookAt(0, 0, 0);
        } else {
          const p = playerMeshRef.current.position;
          camera.position.lerp(new THREE.Vector3(p.x, 15.0, p.z + 16.0), 0.06);
          camera.lookAt(p.x, 1.8, p.z);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      camera.position.z = Math.max(28, Math.min(58, camera.position.z + zoomFactor));
      camera.position.y = Math.max(16, Math.min(34, camera.position.y + zoomFactor * 0.5));
    };

    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

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
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [spatialFalloff]);

  // Jump camera/avatar to specific room across the 12 canonical Spot rooms
  const jumpToRoom = (roomName) => {
    playSound('chime');
    const clean = (roomName || '').toLowerCase();
    let target = new THREE.Vector3(-9, 0, 16);
    let slug = 'boardroom';
    let formattedName = 'Boardroom';

    if (clean.includes('auditorium')) {
      target.set(-24, 0, 14);
      slug = 'auditorium';
      formattedName = 'Auditorium';
    } else if (clean.includes('boardroom')) {
      target.set(-9, 0, 16);
      slug = 'boardroom';
      formattedName = 'Boardroom';
    } else if (clean.includes('chat a')) {
      target.set(12, 0, -4);
      slug = 'chat-a';
      formattedName = 'Chat A';
    } else if (clean.includes('chat b')) {
      target.set(12, 0, 4);
      slug = 'chat-b';
      formattedName = 'Chat B';
    } else if (clean.includes('conference a')) {
      target.set(19, 0, 16);
      slug = 'conference-a';
      formattedName = 'Conference A';
    } else if (clean.includes('conference b') || clean.includes('conference')) {
      target.set(5, 0, 16);
      slug = 'conference-b';
      formattedName = 'Conference B';
    } else if (clean.includes('lobby')) {
      target.set(22, 0, -16);
      slug = 'lobby';
      formattedName = 'Lobby';
    } else if (clean.includes('lounge a')) {
      target.set(23, 0, 0);
      slug = 'lounge-a';
      formattedName = 'Lounge A';
    } else if (clean.includes('lounge b')) {
      target.set(-1, 0, 2);
      slug = 'lounge-b';
      formattedName = 'Lounge B';
    } else if (clean.includes('lounge c')) {
      target.set(-21, 0, 0);
      slug = 'lounge-c';
      formattedName = 'Lounge C';
    } else if (clean.includes('patio')) {
      target.set(-23, 0, -16);
      slug = 'patio';
      formattedName = 'Patio';
    } else if (clean.includes('workspace')) {
      target.set(0, 0, -16);
      slug = 'workspace-a';
      formattedName = 'Workspace A';
    }

    targetPosRef.current.copy(target);
    setCurrentRoom(formattedName);
    setCurrentRoomId(slug);

    if (playerMeshRef.current) {
      playerMeshRef.current.position.copy(target);
    }

    if (cameraRef.current && !isTopDownBlueprint) {
      cameraRef.current.position.set(target.x, 15.0, target.z + 16.0);
      cameraRef.current.lookAt(target.x, 1.8, target.z);
    }

    try {
      window.history.pushState({}, '', `/${workspaceSlug}/@office/@${slug}`);
    } catch (e) {}
  };

  // Spot 3D Screen Content Switcher (media_1791967521142.png)
  const handleUpdateScreenContent = (screenId, contentType, payload) => {
    playSound('chime');

    let targetMesh = null;
    if (screensRef.current && screensRef.current[screenId]) {
      targetMesh = screensRef.current[screenId];
    } else if (sceneRef.current) {
      targetMesh = sceneRef.current.getObjectByName(screenId);
    }

    if (!targetMesh) {
      console.warn(`Screen mesh "${screenId}" not found in scene.`);
      return;
    }

    const texSys = screenTexturesRef.current;

    if (contentType === 'starry-logo') {
      const tex = texSys?.createStarryLogoTexture ? texSys.createStarryLogoTexture() : texSys?.starryLogoTexture;
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = tex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'timer') {
      const minutes = payload?.minutes || 15;
      const tex = texSys?.createTimerTexture ? texSys.createTimerTexture(`${minutes}:00`, 'Session Countdown') : null;
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = tex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'kpi') {
      if (texSys?.kpiTexture) {
        targetMesh.material.map = texSys.kpiTexture;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'screenshare') {
      if (screenShareVideoRef.current && screenStream) {
        const vidTex = new THREE.VideoTexture(screenShareVideoRef.current);
        vidTex.colorSpace = THREE.SRGBColorSpace;
        targetMesh.material.map = vidTex;
        targetMesh.material.needsUpdate = true;
      }
    } else if (contentType === 'youtube') {
      const ytCanvas = document.createElement('canvas');
      ytCanvas.width = 1024;
      ytCanvas.height = 512;
      const yCtx = ytCanvas.getContext('2d');
      yCtx.fillStyle = '#0f0f0f';
      yCtx.fillRect(0, 0, 1024, 512);

      // YouTube red badge icon
      yCtx.fillStyle = '#ff0000';
      yCtx.beginPath();
      yCtx.roundRect(462, 190, 100, 70, 16);
      yCtx.fill();
      yCtx.fillStyle = '#ffffff';
      yCtx.beginPath();
      yCtx.moveTo(502, 210);
      yCtx.lineTo(534, 225);
      yCtx.lineTo(502, 240);
      yCtx.closePath();
      yCtx.fill();

      // Title & URL
      yCtx.font = 'bold 36px sans-serif';
      yCtx.fillStyle = '#ffffff';
      yCtx.textAlign = 'center';
      yCtx.fillText('Spot Office YouTube Stream', 512, 120);

      yCtx.font = '22px monospace';
      yCtx.fillStyle = '#94a3b8';
      const cleanUrl = payload?.url ? payload.url.substring(0, 50) + (payload.url.length > 50 ? '...' : '') : 'https://youtube.com';
      yCtx.fillText(cleanUrl, 512, 310);

      yCtx.fillStyle = '#22c55e';
      yCtx.font = 'bold 20px sans-serif';
      yCtx.fillText('● SYNCED PLAYBACK ACROSS ALL WORKSPACES', 512, 420);

      const ytTex = new THREE.CanvasTexture(ytCanvas);
      ytTex.colorSpace = THREE.SRGBColorSpace;
      targetMesh.material.map = ytTex;
      targetMesh.material.needsUpdate = true;
    } else if (contentType === 'image') {
      if (payload?.url) {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        loader.load(
          payload.url,
          (loadedTex) => {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            targetMesh.material.map = loadedTex;
            targetMesh.material.needsUpdate = true;
          },
          undefined,
          (err) => console.warn('Image texture load err:', err)
        );
      }
    } else if (contentType === 'document') {
      const docCanvas = document.createElement('canvas');
      docCanvas.width = 1024;
      docCanvas.height = 512;
      const dCtx = docCanvas.getContext('2d');
      dCtx.fillStyle = '#ffffff';
      dCtx.fillRect(0, 0, 1024, 512);

      dCtx.fillStyle = '#0f172a';
      dCtx.font = 'bold 36px sans-serif';
      dCtx.textAlign = 'left';
      dCtx.fillText('📄 Spot Collaborative Workspace Notes', 60, 70);

      dCtx.fillStyle = '#334155';
      dCtx.font = '24px sans-serif';
      const rawText = payload?.text || '# Sprint Architecture\n- Realtime 3D office collaboration\n- Dynamic display projection\n- Spatial audio & status presence';
      const lines = rawText.split('\n');
      lines.slice(0, 9).forEach((line, idx) => {
        dCtx.fillText(line, 60, 130 + idx * 36);
      });

      const docTex = new THREE.CanvasTexture(docCanvas);
      docTex.colorSpace = THREE.SRGBColorSpace;
      targetMesh.material.map = docTex;
      targetMesh.material.needsUpdate = true;
    } else if (contentType === 'webpage') {
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
          <span>You have 30 days left in your trial.</span>
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

      {/* 3. Top-Right Floating Viewport Action Buttons (media_1791969444163.png) */}
      <div style={{
        position: 'absolute',
        top: isTrialBannerOpen ? '48px' : '16px',
        right: isBuildModeOpen ? '336px' : '16px',
        display: 'flex',
        gap: '8px',
        zIndex: 60,
        transition: 'right 0.2s ease'
      }}>
        {/* Blue Avatar / First Person View Toggle */}
        <button
          onClick={() => {
            if (playerMeshRef.current && cameraRef.current) {
              const p = playerMeshRef.current.position;
              cameraRef.current.position.set(p.x, 3.5, p.z + 4.5);
              cameraRef.current.lookAt(p.x, 2.0, p.z - 6.0);
            }
          }}
          title="Avatar First-Person / Close Camera"
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
            color: '#0091ff'
          }}
        >
          <UserCheck size={18} />
        </button>

        {/* Recenter Camera on Avatar */}
        <button
          onClick={() => {
            if (playerMeshRef.current && cameraRef.current) {
              const p = playerMeshRef.current.position;
              cameraRef.current.position.set(p.x, 15.0, p.z + 16.0);
              cameraRef.current.lookAt(p.x, 1.8, p.z);
            }
          }}
          title="Recenter Camera on Avatar"
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
            color: '#4b5563'
          }}
        >
          <Compass size={18} />
        </button>

        {/* 3x3 Grid Icon: Toggle Top-Down Floorplan Blueprint View */}
        <button
          onClick={() => setIsTopDownBlueprint(!isTopDownBlueprint)}
          title={isTopDownBlueprint ? 'Switch to 3D Perspective View' : 'Switch to Floorplan Blueprint View (media_1791969443822.png)'}
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
        <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />

        {/* Projected 2D Floating Nameplates */}
        {showNameplates && screenAvatars.map((av, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${av.x}px`,
              top: `${av.y}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
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
              zIndex: 10
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
              const wx = (mx - 0.5) * 55;
              const wz = (my - 0.5) * 35;
              targetPosRef.current.set(wx, 0, wz);
              isSittingRef.current = false;
              playSound('click');
            }}
            style={{
              width: '100%',
              height: '82px',
              background: '#1e293b',
              borderRadius: '6px',
              position: 'relative',
              cursor: 'crosshair',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', left: '10%', top: '15%', width: '30%', height: '35%', border: '1px dashed #475569', borderRadius: 2 }} />
            <div style={{ position: 'absolute', right: '10%', top: '15%', width: '40%', height: '70%', border: '1px dashed #475569', borderRadius: 2 }} />

            {avatarsRef.current.filter((a) => !a.isPlayer).map((av, idx) => {
              const mx = ((av.mesh.position.x / 55) + 0.5) * 100;
              const my = ((av.mesh.position.z / 35) + 0.5) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${Math.max(5, Math.min(95, mx))}%`,
                    top: `${Math.max(5, Math.min(95, my))}%`,
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
              left: `${Math.max(5, Math.min(95, ((playerCoord.x / 55) + 0.5) * 100))}%`,
              top: `${Math.max(5, Math.min(95, ((playerCoord.z / 35) + 0.5) * 100))}%`,
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

        {/* Top-Left Controls Legend */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '10px 16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          zIndex: 20,
          pointerEvents: 'none'
        }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>SPOT VIRTUAL PLATFORM &bull; PHOTOREALISTIC 3D</p>
          <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>
            WASD / Arrows to walk &bull; Click chairs to sit &bull; Click boards to inspect &bull; Spacebar PTT
          </p>
        </div>

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

            {/* Add Teammate / Invite */}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Spot workspace link copied to clipboard!');
              }}
              title="Invite Members"
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
            >
              <Users size={18} />
            </button>

            {/* Hammer / Build Tool (Toggles Build Mode!) */}
            <button
              onClick={() => setIsBuildModeOpen(!isBuildModeOpen)}
              title="Toggle Build Mode"
              style={{
                background: isBuildModeOpen ? '#0091ff' : 'transparent',
                border: 'none',
                color: isBuildModeOpen ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                transition: 'background 0.15s ease'
              }}
            >
              <Hammer size={18} />
            </button>

            {/* Expand / Fullscreen View */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                else document.exitFullscreen();
              }}
              title="Toggle Fullscreen"
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
            >
              <Maximize2 size={18} />
            </button>
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

            {/* Layers / Floorplan View Toggle */}
            <button
              onClick={() => setIsTopDownBlueprint(!isTopDownBlueprint)}
              title="Toggle Top-Down Floorplan Blueprint"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isTopDownBlueprint ? '#0091ff' : 'transparent',
                border: 'none',
                color: isTopDownBlueprint ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={18} />
            </button>

            {/* 3-Dots More Menu */}
            <button
              onClick={() => setActiveTab(activeTab === 'ai' ? 'none' : 'ai')}
              title="OpenClaw AI Agent & Apps"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: activeTab !== 'none' ? '#0091ff' : 'transparent',
                border: 'none',
                color: activeTab !== 'none' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} />
            </button>
          </div>

          {/* Right Section: Room badge, Calendar, Mail, Clock, Chat, Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Active Room Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: '#242c3d',
              color: '#f8fafc',
              fontSize: '13px',
              fontWeight: 500
            }}>
              <MessageSquare size={14} color="#0091ff" />
              <span>{currentRoom}</span>
            </div>

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

        {/* 8. Spot 12-Icon Screen Display Manager Toolbar (media_1791967521142.png) */}
        {activeScreenTarget && (
          <ScreenDisplayManager
            activeScreen={activeScreenTarget.id}
            onClose={() => setActiveScreenTarget(null)}
            onUpdateScreenContent={handleUpdateScreenContent}
            onStartScreenShare={startScreenShare}
          />
        )}

        {/* 9. Spot Spaces & Team Presence Sidebar (media_1791967544265.webp) */}
        <SpacesSidebar
          isOpen={isSpacesSidebarOpen}
          onClose={() => setIsSpacesSidebarOpen(false)}
          currentRoom={currentRoom}
          onSelectRoom={(rm) => jumpToRoom(rm)}
          userName={userName}
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

        {/* 14. Spot Room Link Modal & Deep Link Teleport */}
        <SpotLinkModal
          isOpen={isSpotLinkModalOpen}
          onClose={() => setIsSpotLinkModalOpen(false)}
          currentRoom={currentRoom}
          workspaceSlug={workspaceSlug}
          onTeleportToRoom={jumpToRoom}
        />
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
