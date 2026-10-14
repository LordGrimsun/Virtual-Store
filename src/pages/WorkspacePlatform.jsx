import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Headphones, Volume2,
  Users, Bot, MessageSquare, Edit3, Share2, LogOut, Settings,
  Sparkles, Send, Plus, Check, ChevronRight, X, PhoneCall, VolumeX,
  Maximize2, ZoomIn, ZoomOut, RotateCcw, HelpCircle, Coffee, Compass,
  Terminal, Sliders, Camera, Layers, Radio, Play, Smile
} from 'lucide-react';

export default function WorkspacePlatform({ user, onExit }) {
  const mountRef = useRef(null);

  // User & Room state
  const [userName, setUserName] = useState(user?.fullName || 'Stan');
  const [currentRoom, setCurrentRoom] = useState('All-Hands Table');
  const [currentRoomId, setCurrentRoomId] = useState('all-hands-table');
  const [inAudioRange, setInAudioRange] = useState(['Alex', 'Wes', 'Stefan', 'Steven', 'Phil']);
  const [activeTab, setActiveTab] = useState('none'); // 'none', 'ai', 'team', 'chat', 'whiteboard', 'settings', 'emotes'
  const [activeReaction, setActiveReaction] = useState(null);
  const [donutToast, setDonutToast] = useState(null);

  // Audio / Media toggles
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHeadphonesOn, setIsHeadphonesOn] = useState(false);
  const [pushToTalkActive, setPushToTalkActive] = useState(false);

  // Spot Virtual Background state (from spotxyz/virtual-background)
  const [bgMode, setBgMode] = useState('blur'); // 'none', 'blur', 'spot-office', 'cyber'
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const [hasCameraStream, setHasCameraStream] = useState(false);

  // Spot Audio Devices configuration (from spotxyz/macos-audio-devices)
  const [audioDevices, setAudioDevices] = useState({ inputs: [], outputs: [] });
  const [selectedInput, setSelectedInput] = useState('');
  const [selectedOutput, setSelectedOutput] = useState('');
  const [spatialFalloff, setSpatialFalloff] = useState(8.5);
  const [noiseSuppression, setNoiseSuppression] = useState(true);

  // Spot OpenClaw Agent Gateway state (from spotxyz/spot-openclaw)
  const [openClawSubTab, setOpenClawSubTab] = useState('chat'); // 'chat' or 'console'
  const [agentLeaseActive, setAgentLeaseActive] = useState(true);
  const [toolLogs, setToolLogs] = useState([
    {
      time: '12:00:01',
      tool: 'spot_observe',
      result: { ok: true, worldId: 'spot-world-hq', avatarsCount: 11, roomsCount: 6, agentConnected: true }
    }
  ]);
  const [consoleCommand, setConsoleCommand] = useState('spot_observe');

  // AI Agent Chat state
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'DevBot',
      text: 'Welcome back Stan! I am running on the Spot OpenClaw channel plugin (v0.2.0). All spatial tools (spot_move, spot_emotes, spot_rooms) are live.',
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

  // Three.js Scene References
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const playerMeshRef = useRef(null);
  const targetPosRef = useRef(new THREE.Vector3(0.5, 0, 11.2)); // Starts in the foreground lounge
  const isSittingRef = useRef(false);
  const avatarsRef = useRef([]);
  const chairsRef = useRef([]);
  const wavingHandMeshRef = useRef(null);
  const playerAnimStateRef = useRef({ emote: null, emoteTime: 0 });

  // 1. Enumerate Media Devices (Microphones & Speakers)
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

  // 2. Virtual Background Webcam Stream Pipeline (spotxyz/virtual-background)
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
            setHasCameraStream(true);
          }
        })
        .catch((err) => {
          console.warn('Webcam permission not granted; using fallback simulator:', err);
          setHasCameraStream(false);
        });

      // Canvas background segmentation & rendering loop
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
              // Google Meet / Spot Canvas Bokeh Blur effect
              ctx.filter = 'blur(10px)';
              ctx.drawImage(video, 0, 0, w, h);
              ctx.filter = 'none';

              // Composite sharp user foreground in center oval
              ctx.save();
              ctx.beginPath();
              ctx.ellipse(w / 2, h / 2 + 10, w * 0.32, h * 0.44, 0, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(video, 0, 0, w, h);
              ctx.restore();
            } else if (bgMode === 'spot-office') {
              // Composite Spot Office virtual background
              const bgGrad = ctx.createLinearGradient(0, 0, w, h);
              bgGrad.addColorStop(0, '#eedfce');
              bgGrad.addColorStop(1, '#94a3b8');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);

              // Draw subtle Spot logo in corner
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.arc(30, 30, 8, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#1e293b';
              ctx.font = 'bold 12px sans-serif';
              ctx.fillText('spot HQ', 45, 34);

              // Composite user
              ctx.save();
              ctx.beginPath();
              ctx.ellipse(w / 2, h / 2 + 10, w * 0.34, h * 0.45, 0, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(video, 0, 0, w, h);
              ctx.restore();
            } else if (bgMode === 'cyber') {
              // Cyber grid background
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
              // None / Normal camera
              ctx.filter = 'none';
              ctx.drawImage(video, 0, 0, w, h);
            }
          } else {
            // Simulated feed with animated avatar silhouette
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

  // 3. Push-To-Talk Keyboard Hotkey (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setPushToTalkActive(true);
        setIsMuted(false);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setPushToTalkActive(false);
        setIsMuted(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 4. Three.js Main Office Environment
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbdd4bc);
    scene.fog = new THREE.FogExp2(0xbdd4bc, 0.0075);
    sceneRef.current = scene;

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.5, 500);
    camera.position.set(0.5, 24.5, 42.0);
    camera.lookAt(0.5, 1.8, -3.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8ba67e, 1.45);
    hemiLight.position.set(0, 60, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffef5, 1.55);
    sunLight.position.set(28, 45, 24);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    const sCam = 36;
    sunLight.shadow.camera.left = -sCam;
    sunLight.shadow.camera.right = sCam;
    sunLight.shadow.camera.top = sCam;
    sunLight.shadow.camera.bottom = -sCam;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    const ambientFill = new THREE.DirectionalLight(0xd9ebff, 0.65);
    ambientFill.position.set(-25, 28, -25);
    scene.add(ambientFill);

    // Procedural Floor Texture
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d');
    fCtx.fillStyle = '#eee7de';
    fCtx.fillRect(0, 0, 1024, 1024);
    fCtx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    fCtx.lineWidth = 1.5;
    for (let y = 0; y < 1024; y += 32) {
      fCtx.beginPath();
      fCtx.moveTo(0, y);
      fCtx.lineTo(1024, y);
      fCtx.stroke();
    }
    for (let y = 0; y < 1024; y += 32) {
      const offset = (y / 32) % 2 === 0 ? 0 : 80;
      for (let x = offset; x < 1024; x += 160) {
        fCtx.beginPath();
        fCtx.moveTo(x, y);
        fCtx.lineTo(x, y + 32);
        fCtx.stroke();
      }
    }
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(16, 12);

    // Blue Chart Canvas
    const chartCanvas = document.createElement('canvas');
    chartCanvas.width = 1024;
    chartCanvas.height = 512;
    const cCtx = chartCanvas.getContext('2d');
    cCtx.fillStyle = '#ffffff';
    cCtx.fillRect(0, 0, 1024, 512);
    cCtx.strokeStyle = '#e2e8f0';
    cCtx.lineWidth = 2;
    for (let y = 60; y < 450; y += 60) {
      cCtx.beginPath();
      cCtx.moveTo(60, y);
      cCtx.lineTo(960, y);
      cCtx.stroke();
    }
    const pts = [
      [80, 360], [140, 320], [200, 370], [260, 240], [320, 280],
      [380, 190], [440, 230], [500, 150], [560, 220], [620, 120],
      [680, 180], [740, 110], [800, 160], [860, 90], [940, 130]
    ];
    const grad = cCtx.createLinearGradient(0, 90, 0, 420);
    grad.addColorStop(0, 'rgba(37, 99, 235, 0.7)');
    grad.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    cCtx.beginPath();
    cCtx.moveTo(pts[0][0], 420);
    pts.forEach(([px, py]) => cCtx.lineTo(px, py));
    cCtx.lineTo(pts[pts.length - 1][0], 420);
    cCtx.closePath();
    cCtx.fillStyle = grad;
    cCtx.fill();
    cCtx.beginPath();
    pts.forEach(([px, py], i) => {
      if (i === 0) cCtx.moveTo(px, py);
      else cCtx.lineTo(px, py);
    });
    cCtx.strokeStyle = '#2563eb';
    cCtx.lineWidth = 6;
    cCtx.stroke();
    const chartTexture = new THREE.CanvasTexture(chartCanvas);

    // Digital KPI Canvas (168 161 47 34 34 / 83 85 6 52 25)
    const kpiCanvas = document.createElement('canvas');
    kpiCanvas.width = 1024;
    kpiCanvas.height = 512;
    const kCtx = kpiCanvas.getContext('2d');
    kCtx.fillStyle = '#0f172a';
    kCtx.fillRect(0, 0, 1024, 512);
    kCtx.font = 'bold 96px "Courier New", monospace';
    kCtx.textAlign = 'center';
    kCtx.textBaseline = 'middle';
    const topKPIs = [
      { text: '168', color: '#f43f5e', x: 120 },
      { text: '161', color: '#06b6d4', x: 330 },
      { text: '47', color: '#22c55e', x: 550 },
      { text: '34', color: '#22c55e', x: 730 },
      { text: '34', color: '#22c55e', x: 910 }
    ];
    topKPIs.forEach(({ text, color, x }) => {
      kCtx.fillStyle = color;
      kCtx.shadowColor = color;
      kCtx.shadowBlur = 18;
      kCtx.fillText(text, x, 170);
    });
    const btmKPIs = [
      { text: '83', color: '#38bdf8', x: 120 },
      { text: '85', color: '#38bdf8', x: 330 },
      { text: '6', color: '#f8fafc', x: 550 },
      { text: '52', color: '#38bdf8', x: 730 },
      { text: '25', color: '#22c55e', x: 910 }
    ];
    btmKPIs.forEach(({ text, color, x }) => {
      kCtx.fillStyle = color;
      kCtx.shadowColor = color;
      kCtx.shadowBlur = 18;
      kCtx.fillText(text, x, 360);
    });
    kCtx.shadowBlur = 0;
    const kpiTexture = new THREE.CanvasTexture(kpiCanvas);

    // Architecture Canvas
    const archCanvas = document.createElement('canvas');
    archCanvas.width = 1024;
    archCanvas.height = 512;
    const aCtx = archCanvas.getContext('2d');
    aCtx.fillStyle = '#ffffff';
    aCtx.fillRect(0, 0, 1024, 512);
    aCtx.strokeStyle = '#94a3b8';
    aCtx.lineWidth = 3;
    aCtx.strokeRect(80, 60, 360, 390);
    aCtx.strokeRect(520, 60, 420, 390);
    aCtx.fillStyle = '#fef08a';
    aCtx.fillRect(430, 90, 80, 70);
    aCtx.fillStyle = '#fbcfe8';
    aCtx.fillRect(430, 200, 80, 70);
    aCtx.strokeStyle = '#ef4444';
    aCtx.lineWidth = 4;
    aCtx.beginPath();
    aCtx.moveTo(410, 160);
    aCtx.lineTo(520, 160);
    aCtx.stroke();
    const archTexture = new THREE.CanvasTexture(archCanvas);

    // Front-Left New Features Canvas
    const featCanvas = document.createElement('canvas');
    featCanvas.width = 512;
    featCanvas.height = 512;
    const featCtx = featCanvas.getContext('2d');
    featCtx.fillStyle = '#ffffff';
    featCtx.fillRect(0, 0, 512, 512);
    featCtx.fillStyle = '#0f172a';
    featCtx.font = 'bold 34px sans-serif';
    featCtx.fillText('New Features', 40, 70);
    featCtx.fillStyle = '#f8fafc';
    featCtx.fillRect(40, 110, 432, 60);
    featCtx.fillStyle = '#334155';
    featCtx.font = '500 24px sans-serif';
    featCtx.fillText('Calendar', 60, 148);
    featCtx.fillText('0%', 420, 148);
    featCtx.fillStyle = '#2563eb';
    featCtx.fillRect(40, 190, 432, 65);
    featCtx.fillStyle = '#ffffff';
    featCtx.font = 'bold 24px sans-serif';
    featCtx.fillText('Spot Prints', 60, 230);
    featCtx.fillText('100%', 400, 230);
    featCtx.fillStyle = '#f8fafc';
    featCtx.fillRect(40, 275, 432, 60);
    featCtx.fillStyle = '#334155';
    featCtx.font = '500 24px sans-serif';
    featCtx.fillText('Documents', 60, 313);
    featCtx.fillText('0%', 420, 313);
    const featTexture = new THREE.CanvasTexture(featCanvas);

    // Mobile Schedule Canvas (10:42 1 on 1 with Stan)
    const schedCanvas = document.createElement('canvas');
    schedCanvas.width = 512;
    schedCanvas.height = 768;
    const sCtx = schedCanvas.getContext('2d');
    sCtx.fillStyle = '#ffffff';
    sCtx.fillRect(0, 0, 512, 768);
    sCtx.fillStyle = '#0f172a';
    sCtx.font = 'bold 54px sans-serif';
    sCtx.fillText('10:42', 50, 90);
    const bColors = ['#f59e0b', '#ef4444', '#06b6d4', '#10b981', '#8b5cf6'];
    bColors.forEach((col, idx) => {
      sCtx.fillStyle = col;
      sCtx.fillRect(50 + idx * 75, 260 - (idx % 3) * 50, 65, 180 + (idx % 3) * 50);
    });
    sCtx.fillStyle = '#1e293b';
    sCtx.font = 'bold 30px sans-serif';
    sCtx.fillText('1 on 1 with Stan', 50, 520);
    sCtx.fillStyle = '#22c55e';
    sCtx.beginPath();
    sCtx.roundRect(50, 560, 180, 55, 12);
    sCtx.fill();
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 22px sans-serif';
    sCtx.fillText('Schedule', 85, 595);
    const schedTexture = new THREE.CanvasTexture(schedCanvas);

    const createNoMeetTexture = (timeStr) => {
      const nmCanvas = document.createElement('canvas');
      nmCanvas.width = 512;
      nmCanvas.height = 256;
      const nmCtx = nmCanvas.getContext('2d');
      nmCtx.fillStyle = '#ffffff';
      nmCtx.fillRect(0, 0, 512, 256);
      nmCtx.fillStyle = '#38bdf8';
      nmCtx.fillRect(30, 30, 140, 196);
      nmCtx.fillStyle = '#fef08a';
      nmCtx.beginPath();
      nmCtx.arc(70, 70, 22, 0, Math.PI * 2);
      nmCtx.fill();
      nmCtx.fillStyle = '#22c55e';
      nmCtx.beginPath();
      nmCtx.arc(100, 226, 70, Math.PI, 0);
      nmCtx.fill();
      nmCtx.fillStyle = '#0f172a';
      nmCtx.font = 'bold 42px sans-serif';
      nmCtx.fillText(timeStr, 200, 95);
      nmCtx.fillStyle = '#64748b';
      nmCtx.font = '500 24px sans-serif';
      nmCtx.fillText('No meetings', 200, 145);
      return new THREE.CanvasTexture(nmCanvas);
    };

    // Shared Materials
    const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.84 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.85 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const chairBeigeMat = new THREE.MeshStandardMaterial({ color: 0xd5cbbe, roughness: 0.75 });
    const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbfdbfe,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      transmission: 0.94,
      thickness: 0.3
    });

    // Exterior Landscape (Rolling Green Hills & 3D Trees Outside)
    const outdoorGround = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 160),
      new THREE.MeshStandardMaterial({ color: 0x82a56a, roughness: 0.95 })
    );
    outdoorGround.rotation.x = -Math.PI / 2;
    outdoorGround.position.set(0, -0.05, -20);
    outdoorGround.receiveShadow = true;
    scene.add(outdoorGround);

    const createHill = (x, z, r, h, color) => {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(r, h, 18), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
      hill.position.set(x, h / 2 - 2, z);
      scene.add(hill);
    };
    createHill(-45, -55, 38, 22, 0x5b8a45);
    createHill(-15, -65, 48, 28, 0x4d7c3b);
    createHill(25, -60, 42, 25, 0x5b8a45);
    createHill(60, -50, 36, 20, 0x4d7c3b);

    const createTree = (x, z, scale = 1) => {
      const treeGrp = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * scale, 0.45 * scale, 3 * scale, 6), new THREE.MeshStandardMaterial({ color: 0x543d2b }));
      trunk.position.y = 1.5 * scale;
      treeGrp.add(trunk);
      [
        { r: 2.2 * scale, h: 2.5 * scale, y: 3.2 * scale },
        { r: 1.7 * scale, h: 2.2 * scale, y: 4.6 * scale },
        { r: 1.1 * scale, h: 1.8 * scale, y: 5.8 * scale }
      ].forEach((tier) => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(tier.r, tier.h, 7), new THREE.MeshStandardMaterial({ color: 0x3d6b2c, roughness: 0.8 }));
        cone.position.y = tier.y;
        treeGrp.add(cone);
      });
      treeGrp.position.set(x, 0, z);
      scene.add(treeGrp);
    };
    [-42, -28, -8, 8, 24, 38, 52].forEach((tx, idx) => {
      createTree(tx, -42 - (idx % 3) * 6, 1.2 + (idx % 2) * 0.4);
    });

    // Brick Wall Section in upper right background
    const brickWall = new THREE.Mesh(new THREE.BoxGeometry(28, 3.2, 0.6), new THREE.MeshStandardMaterial({ color: 0xba9b84, roughness: 0.85 }));
    brickWall.position.set(32, 1.6, -34);
    scene.add(brickWall);

    // Floor Slab
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(64, 0.4, 40), floorMat);
    floorMesh.position.set(0, -0.2, -4);
    floorMesh.receiveShadow = true;
    floorMesh.name = 'floor';
    scene.add(floorMesh);

    // Walls
    const createWall = (x, z, w, d, h = 3.6) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blackMat);
      wall.position.set(x, h / 2, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      scene.add(wall);
      return wall;
    };
    createWall(-20, -22, 24, 0.45);
    createWall(18, -22, 28, 0.45);
    createWall(-31.5, -14, 0.45, 16);
    createWall(-20, -6, 23, 0.45);
    createWall(-8.5, -14, 0.45, 16);
    createWall(-8.5, 0, 0.45, 12);

    // Planters
    const createPlanter = (x, z, w, d, h = 1.05) => {
      const group = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blackMat);
      box.position.y = h / 2;
      box.castShadow = true;
      group.add(box);
      const soil = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.1, d - 0.1), new THREE.MeshStandardMaterial({ color: 0x1f1610 }));
      soil.position.y = h - 0.05;
      group.add(soil);
      const numPlants = Math.max(5, Math.floor((w + d) * 3.2));
      for (let i = 0; i < numPlants; i++) {
        const blade = new THREE.Mesh(
          new THREE.ConeGeometry(0.24, 1.1 + Math.random() * 0.4, 5),
          new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x22543d : 0x2f855a, roughness: 0.6 })
        );
        blade.position.set((Math.random() - 0.5) * (w - 0.25), h + 0.4, (Math.random() - 0.5) * (d - 0.25));
        blade.rotation.y = Math.random() * Math.PI;
        group.add(blade);
      }
      group.position.set(x, 0, z);
      scene.add(group);
    };
    createPlanter(-7.5, 3.5, 0.8, 7.0);
    createPlanter(-4.0, 6.8, 6.5, 0.8);
    createPlanter(-2.0, 1.8, 0.8, 4.2);
    createPlanter(-31.5, 5.0, 0.8, 18.0);
    createPlanter(-16.0, 15.5, 31.0, 0.8);
    createPlanter(15.0, 15.5, 31.0, 0.8);

    // Zone 1: Theater Screen & Chairs
    const theaterScreen = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 3.8, 0.08),
      new THREE.MeshStandardMaterial({ map: createNoMeetTexture('09:38'), roughness: 0.3 })
    );
    theaterScreen.position.set(-20, 2.2, -21.7);
    scene.add(theaterScreen);

    // Zone 2: Round Table Huddle & Interactive Board
    const featBoard = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 3.2, 0.1),
      new THREE.MeshStandardMaterial({ map: featTexture, roughness: 0.25 })
    );
    featBoard.position.set(-20.5, 2.3, -5.6);
    scene.add(featBoard);

    const roundTable = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.12, 32), whiteMat);
    roundTable.position.set(-19.5, 1.15, 4.5);
    scene.add(roundTable);

    const roundPylon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.1, 16), whiteMat);
    roundPylon.position.set(-19.5, 0.55, 4.5);
    scene.add(roundPylon);

    // Zone 3: Middle Nook Sofa & Gold Table
    const nookSofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.55, 0.95), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 }));
    nookSofa.position.set(-4.5, 0.35, 4.2);
    nookSofa.rotation.y = Math.PI / 2;
    scene.add(nookSofa);

    const goldTable = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.5, 16), brassMat);
    goldTable.position.set(-4.5, 0.25, 1.8);
    scene.add(goldTable);

    // Zone 4: Foreground Lounge & Sofa
    const bSofa = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.55, 1.1), blackMat);
    bSofa.position.set(-2.0, 0.35, 9.8);
    scene.add(bSofa);

    const drumTable = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.42, 24), whiteMat);
    drumTable.position.set(-1.8, 0.21, 11.8);
    scene.add(drumTable);

    // Zone 5: Center Long All-Hands Table & Doughnuts Plate
    const createAllHandsTable = () => {
      const group = new THREE.Group();
      const table = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.12, 2.0), whiteMat);
      table.position.y = 1.15;
      group.add(table);

      [-3.0, 0, 3.0].forEach((px) => {
        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.36, 1.1, 16), whiteMat);
        pylon.position.set(px, 0.55, 0);
        group.add(pylon);
      });

      // Bowl of red apples
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.26, 0.2, 16), whiteMat);
      bowl.position.set(-2.0, 1.3, 0.1);
      group.add(bowl);
      for (let a = 0; a < 5; a++) {
        const apple = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), redMat);
        apple.position.set(-2.0 + (a % 2) * 0.12, 1.42, 0.1 + Math.floor(a / 2) * 0.12);
        group.add(apple);
      }

      // Doughnuts Plate (Clickable)
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.05, 18), redMat);
      plate.position.set(0.2, 1.23, 0.1);
      plate.name = 'doughnutPlate';
      group.add(plate);
      for (let i = 0; i < 4; i++) {
        const donut = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.05, 8, 16), new THREE.MeshStandardMaterial({ color: 0x92400e }));
        donut.rotation.x = Math.PI / 2;
        donut.position.set(0.15 + (i % 2) * 0.13, 1.28, 0.05 + Math.floor(i / 2) * 0.13);
        group.add(donut);
      }

      // Pastry Dome
      const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.06, 16), whiteMat);
      domeBase.position.set(2.6, 1.23, 0.1);
      group.add(domeBase);
      const glassDome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
      glassDome.position.set(2.6, 1.26, 0.1);
      group.add(glassDome);

      // Chairs
      const addTableChair = (cx, cz, crot) => {
        const cGrp = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.08, 0.7), chairBeigeMat);
        seat.position.y = 0.72;
        cGrp.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.65, 0.08), chairBeigeMat);
        back.position.set(0, 1.02, 0.32);
        cGrp.add(back);
        cGrp.position.set(cx, 0, cz);
        cGrp.rotation.y = crot;
        group.add(cGrp);
      };
      [-3.3, -2.0, -0.7, 0.7, 2.0, 3.3].forEach((xOff) => {
        addTableChair(xOff, -1.35, 0);
        addTableChair(xOff, 1.35, Math.PI);
      });

      group.position.set(4.5, 0, 3.8);
      scene.add(group);
    };
    createAllHandsTable();

    // Zone 6: Glass Boardroom
    const glassBack = new THREE.Mesh(new THREE.BoxGeometry(9.6, 3.5, 0.1), glassMat);
    glassBack.position.set(0, 1.75, -21.8);
    scene.add(glassBack);
    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(9.6, 3.5, 0.1), glassMat);
    glassFront.position.set(0, 1.75, -12.5);
    scene.add(glassFront);
    const innerTable = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.12, 1.8), blackMat);
    innerTable.position.set(0, 1.1, -17.0);
    scene.add(innerTable);

    // Zone 7: Mobile Whiteboard Stand
    const mobileScreen = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.4, 0.08),
      new THREE.MeshStandardMaterial({ map: schedTexture, roughness: 0.25 })
    );
    mobileScreen.position.set(12.5, 2.4, 3.8);
    mobileScreen.rotation.y = -Math.PI / 10;
    scene.add(mobileScreen);

    // Zone 8: Desk Pairs
    const createDeskPair = (x, z) => {
      const group = new THREE.Group();
      const top1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 1.5), whiteMat);
      top1.position.set(0, 1.15, -0.8);
      group.add(top1);
      const top2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 1.5), whiteMat);
      top2.position.set(0, 1.15, 0.8);
      group.add(top2);
      const div = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.5, 0.06), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      div.position.set(0, 1.45, 0);
      group.add(div);
      const mon1 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.58, 0.04), blackMat);
      mon1.position.set(-0.4, 1.58, -0.6);
      group.add(mon1);
      const disp1 = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.48), screenGlowMat);
      disp1.position.set(-0.4, 1.58, -0.57);
      disp1.rotation.y = Math.PI;
      group.add(disp1);
      group.position.set(x, 0, z);
      scene.add(group);
    };
    createDeskPair(17.5, -12.5);
    createDeskPair(22.5, -12.5);
    createDeskPair(18.5, -6.0);
    createDeskPair(23.5, -6.0);
    createDeskPair(19.0, 0.5);
    createDeskPair(24.0, 0.5);

    // Zone 9: Triple Back Wall Dashboards
    const screen1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.7, 0.08), new THREE.MeshStandardMaterial({ map: chartTexture, roughness: 0.2 }));
    screen1.position.set(10.8, 2.3, -21.7);
    scene.add(screen1);

    const screen2 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.7, 0.08), new THREE.MeshStandardMaterial({ map: kpiTexture, roughness: 0.2 }));
    screen2.position.set(16.5, 2.3, -21.7);
    scene.add(screen2);

    const screen3 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.7, 0.08), new THREE.MeshStandardMaterial({ map: archTexture, roughness: 0.2 }));
    screen3.position.set(22.2, 2.3, -21.7);
    scene.add(screen3);

    // Avatar Generator
    const createAvatar = (name, initialPos, config = {}) => {
      const group = new THREE.Group();
      const skinMat = new THREE.MeshStandardMaterial({ color: config.skinColor || 0xf6d8c3, roughness: 0.55 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), skinMat);
      head.position.y = 1.9;
      group.add(head);

      if (config.hatType === 'spot_cap') {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.2, 16), whiteMat);
        cap.position.set(0, 2.15, -0.05);
        cap.rotation.x = 0.15;
        group.add(cap);
        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.35), whiteMat);
        visor.position.set(0, 2.05, 0.4);
        group.add(visor);
      } else {
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), new THREE.MeshStandardMaterial({ color: config.hairColor || 0x4a3728 }));
        hair.position.set(0, 2.02, -0.06);
        group.add(hair);
      }

      if (config.hasWavingHand) {
        const handGroup = new THREE.Group();
        const palm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.06), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        handGroup.add(palm);
        handGroup.position.set(0.55, 2.45, 0.2);
        group.add(handGroup);
        wavingHandMeshRef.current = handGroup;
      }

      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.38, 0.85, 16),
        new THREE.MeshStandardMaterial({ color: config.shirtColor || 0x0284c7, roughness: 0.6 })
      );
      torso.position.y = 1.15;
      group.add(torso);

      group.position.copy(initialPos);
      scene.add(group);
      return { name, mesh: group, isPlayer: config.isPlayer || false, status: config.status || 'online' };
    };

    const avatarsList = [];
    // Player: Stan (you) in foreground lounge
    const playerObj = createAvatar('Stan (you)', new THREE.Vector3(0.3, 0, 11.2), { isPlayer: true, hatType: 'spot_cap', shirtColor: 0x0284c7 });
    playerMeshRef.current = playerObj.mesh;
    avatarsList.push(playerObj);

    // Other Teammates matching screenshot
    avatarsList.push(createAvatar('Wes', new THREE.Vector3(2.4, 0, 11.2), { shirtColor: 0x991b1b }));
    avatarsList.push(createAvatar('Stefan', new THREE.Vector3(1.2, 0, 2.5), { shirtColor: 0x7c3aed }));
    avatarsList.push(createAvatar('Phil', new THREE.Vector3(4.8, 0, 2.5), { shirtColor: 0xdc2626 }));
    avatarsList.push(createAvatar('Sarah', new THREE.Vector3(-17.2, 0, 4.8), { shirtColor: 0x0284c7, hasWavingHand: true }));
    avatarsList.push(createAvatar('Andi', new THREE.Vector3(-21.5, 0, 5.8), { shirtColor: 0xf472b6 }));
    avatarsList.push(createAvatar('Chloe', new THREE.Vector3(-4.5, 0, 4.2), { shirtColor: 0xf1f5f9 }));
    avatarsList.push(createAvatar('Steven', new THREE.Vector3(17.5, 0, -14.1), { shirtColor: 0xffffff }));
    avatarsList.push(createAvatar('Alex', new THREE.Vector3(22.5, 0, -14.1), { shirtColor: 0x334155 }));
    avatarsList.push(createAvatar('Graham', new THREE.Vector3(15.2, 0, -5.2), { shirtColor: 0x16a34a }));
    avatarsList.push(createAvatar('DevBot (AI)', new THREE.Vector3(0, 0, -17.0), { shirtColor: 0x10b981, status: 'ai-agent' }));

    avatarsRef.current = avatarsList;

    // Raycast Pointer Down
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      if (e.target.closest('header, aside, .Platform_uiDock, .Platform_toast, .Platform_modal')) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let clickedObj = intersects[0].object;
        while (clickedObj && clickedObj !== scene) {
          if (clickedObj.name === 'doughnutPlate') {
            setDonutToast('Stan grabbed a fresh glazed doughnut! 🍩');
            setTimeout(() => setDonutToast(null), 3000);
            return;
          }
          clickedObj = clickedObj.parent;
        }

        const point = intersects[0].point;
        targetPosRef.current.set(point.x, 0, point.z);
        isSittingRef.current = false;

        // Detect Zone
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
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (wavingHandMeshRef.current) {
        wavingHandMeshRef.current.rotation.z = Math.sin(elapsed * 5) * 0.22;
      }

      // Player Movement & Emote animations
      if (playerMeshRef.current) {
        const player = playerMeshRef.current;
        const target = targetPosRef.current;
        const dist = player.position.distanceTo(target);

        // Check if emote is playing
        const animState = playerAnimStateRef.current;
        if (animState.emote) {
          if (animState.emote === 'wave' || animState.emote === 'cheer') {
            player.position.y = Math.abs(Math.sin(elapsed * 10)) * 0.35;
          } else if (animState.emote === 'dance') {
            player.rotation.y += delta * 6;
            player.position.y = Math.abs(Math.sin(elapsed * 8)) * 0.2;
          }
        } else if (dist > 0.15) {
          const dir = new THREE.Vector3().subVectors(target, player.position).normalize();
          const targetAngle = Math.atan2(dir.x, dir.z);
          player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetAngle, 0.2);
          player.position.addScaledVector(dir, Math.min(dist, delta * 6.2));
          player.position.y = Math.abs(Math.sin(elapsed * 12)) * 0.12;
        } else {
          player.position.y = 0;
        }
      }

      // Project Avatar Names
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

  // Jump camera/avatar to specific room
  const jumpToRoom = (roomName) => {
    setCurrentRoom(roomName);
    if (roomName === 'All-Hands Table') {
      targetPosRef.current.set(4.5, 0, 5.5);
      setCurrentRoomId('all-hands-table');
    } else if (roomName === 'Engineering Desks') {
      targetPosRef.current.set(18.5, 0, -6.0);
      setCurrentRoomId('engineering-desks');
    } else if (roomName === 'Glass Boardroom') {
      targetPosRef.current.set(0, 0, -16.0);
      setCurrentRoomId('glass-boardroom');
    } else if (roomName === 'Round Table Huddle') {
      targetPosRef.current.set(-17.0, 0, 5.0);
      setCurrentRoomId('round-table-huddle');
    } else if (roomName === 'Presentation Hall') {
      targetPosRef.current.set(-20.0, 0, -12.0);
      setCurrentRoomId('presentation-hall');
    } else if (roomName === 'Foreground Lounge') {
      targetPosRef.current.set(0.5, 0, 11.2);
      setCurrentRoomId('foreground-lounge');
    }
  };

  // Trigger Canonical Spot Emote (from spot-openclaw)
  const triggerEmote = (emoteId, emoji) => {
    setActiveReaction(emoji);
    playerAnimStateRef.current = { emote: emoteId, emoteTime: Date.now() };

    // Broadcast in room chat
    setChatMessages((prev) => [
      ...prev,
      { sender: userName, text: `*used emote ${emoji} (${emoteId})*`, time: 'Just now' }
    ]);

    setTimeout(() => {
      setActiveReaction(null);
      playerAnimStateRef.current = { emote: null, emoteTime: 0 };
    }, 2800);
  };

  // Trigger Canonical Spot Social Gesture (from spot-openclaw)
  const triggerGesture = (gestureId, label, emoji) => {
    setActiveReaction(emoji);
    setChatMessages((prev) => [
      ...prev,
      { sender: userName, text: `*sent gesture ${label} ${emoji} to nearby teammates!*`, time: 'Just now' }
    ]);
    setTimeout(() => setActiveReaction(null), 3000);
  };

  // Spot OpenClaw Tools Execution (from spotxyz/spot-openclaw)
  const executeOpenClawTool = (toolName, params = {}) => {
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
      {/* Hidden HTML5 video element for camera stream */}
      <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

      {/* 1. Spot Virtual Top Bar */}
      <header style={{
        height: '62px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        {/* Left: Spot Logo & Active Room Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onExit}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#60c449', display: 'inline-block' }} />
            <strong style={{ fontSize: '1.25rem', letterSpacing: '-0.5px', color: '#1e293b' }}>Spot</strong>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/ Virtual Office</span>
          </div>

          <div style={{
            background: '#f1f5f9',
            padding: '5px 14px',
            borderRadius: '2rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#334155',
            fontWeight: 600
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0284c7' }} />
            <span>Zone: <strong style={{ color: '#0f172a' }}>{currentRoom}</strong></span>
          </div>

          {inAudioRange.length > 0 && (
            <div style={{
              background: 'rgba(96, 196, 73, 0.12)',
              border: '1px solid #86efac',
              padding: '5px 14px',
              borderRadius: '2rem',
              fontSize: '0.85rem',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600
            }}>
              <PhoneCall size={14} color="#16a34a" />
              <span>Spatial Audio: <strong>{inAudioRange.slice(0, 3).join(', ')}{inAudioRange.length > 3 ? ` +${inAudioRange.length - 3}` : ''}</strong></span>
            </div>
          )}
        </div>

        {/* Right: Quick Zone Jump & Media Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Quick Room Teleport Dropdown */}
          <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {['Foreground Lounge', 'All-Hands Table', 'Engineering Desks', 'Round Table Huddle', 'Presentation Hall'].map((r) => (
              <button
                key={r}
                onClick={() => jumpToRoom(r)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: currentRoom === r ? '#ffffff' : 'transparent',
                  color: currentRoom === r ? '#0f172a' : '#64748b',
                  boxShadow: currentRoom === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {r.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Mic Toggle (supports Push-to-Talk) */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title="Press Spacebar anytime to Push-to-Talk"
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: isMuted ? '#fee2e2' : '#f0fdf4',
              border: isMuted ? '1px solid #fca5a5' : '1px solid #bbf7d0',
              color: isMuted ? '#b91c1c' : '#15803d',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{isMuted ? 'Muted' : pushToTalkActive ? 'PTT Active' : 'Unmuted'}</span>
          </button>

          {/* Camera Toggle (with Virtual Background Engine) */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: isVideoOn ? '#dbeafe' : '#f8fafc',
              border: '1px solid #cbd5e1',
              color: isVideoOn ? '#1d4ed8' : '#475569',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {isVideoOn ? <Video size={15} /> : <VideoOff size={15} />}
            <span>{isVideoOn ? 'Camera Active' : 'Camera Off'}</span>
          </button>

          {/* Audio Devices & Settings Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'settings' ? 'none' : 'settings')}
            style={{
              padding: '7px 10px',
              borderRadius: '2rem',
              background: activeTab === 'settings' ? '#e2e8f0' : '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              cursor: 'pointer'
            }}
            title="Audio Devices & Settings"
          >
            <Sliders size={16} />
          </button>

          {/* Exit / Leave Button */}
          <button
            onClick={onExit}
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* 2. Main 3D Viewport */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />

        {/* Projected 2D Floating Nameplates */}
        {screenAvatars.map((av, idx) => (
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
              gap: '5px',
              background: av.isPlayer ? 'rgba(30, 41, 59, 0.92)' : 'rgba(255, 255, 255, 0.92)',
              color: av.isPlayer ? '#ffffff' : '#0f172a',
              padding: '3px 8px',
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              border: av.isPlayer ? '1px solid #0284c7' : '1px solid #e2e8f0',
              fontSize: '11px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: av.status === 'ai-agent' ? '#10b981' : '#22c55e',
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)'
            }} />
            <span>{av.name}</span>
          </div>
        ))}

        {/* Live Camera Feed with Spot Virtual Background Engine (from spotxyz/virtual-background) */}
        {isVideoOn && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '280px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #334155',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            zIndex: 40
          }}>
            <div style={{ padding: '8px 12px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={14} color="#38bdf8" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>Virtual Background</span>
              </div>
              <button onClick={() => setIsVideoOn(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <canvas ref={videoCanvasRef} width={280} height={210} style={{ display: 'block', width: '100%', height: '210px' }} />

            <div style={{ padding: '8px 10px', background: '#0f172a', display: 'flex', gap: '6px', justifyContent: 'center' }}>
              {[
                { id: 'blur', label: 'Bokeh Blur' },
                { id: 'spot-office', label: 'Spot HQ' },
                { id: 'cyber', label: 'Cyber Grid' },
                { id: 'none', label: 'None' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setBgMode(m.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: bgMode === m.id ? '#0284c7' : '#1e293b',
                    color: bgMode === m.id ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>SPOT VIRTUAL PLATFORM &bull; OPENCLAW v0.2.0</p>
          <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>
            Click floor to walk &bull; Scroll wheel to zoom &bull; Hold Space for Push-to-Talk
          </p>
        </div>

        {/* 3. Floating Bottom Dock */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: '3rem',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 40
        }}>
          {/* Canonical Spot Emotes (spotxyz/spot-openclaw) */}
          <div style={{ display: 'flex', gap: '3px', borderRight: '1px solid #e2e8f0', paddingRight: '8px' }}>
            {[
              { id: 'wave', emoji: '👋' },
              { id: 'clap', emoji: '👏' },
              { id: 'cheer', emoji: '🎉' },
              { id: 'dance', emoji: '💃' },
              { id: 'thumbsup', emoji: '👍' },
              { id: 'heart', emoji: '❤️' },
              { id: 'doughnut', emoji: '🍩' }
            ].map((em) => (
              <button
                key={em.id}
                onClick={() => triggerEmote(em.id, em.emoji)}
                title={`Spot Emote: ${em.id}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.25rem',
                  padding: '5px 7px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                {em.emoji}
              </button>
            ))}
          </div>

          {/* Social Gestures Dropdown Button */}
          <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #e2e8f0', paddingRight: '8px' }}>
            <button
              onClick={() => triggerGesture('highfive', 'High Five', '✋')}
              style={{ fontSize: '0.75rem', fontWeight: 600, padding: '5px 8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', cursor: 'pointer' }}
            >
              ✋ High Five
            </button>
            <button
              onClick={() => triggerGesture('fistbump', 'Fist Bump', '👊')}
              style={{ fontSize: '0.75rem', fontWeight: 600, padding: '5px 8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', cursor: 'pointer' }}
            >
              👊 Fist Bump
            </button>
          </div>

          {/* OpenClaw Agent Drawer Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'ai' ? 'none' : 'ai')}
            style={{
              padding: '8px 16px',
              borderRadius: '2rem',
              background: activeTab === 'ai' ? '#10b981' : '#f0fdf4',
              color: activeTab === 'ai' ? '#ffffff' : '#15803d',
              border: '1px solid #86efac',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Bot size={16} />
            <span>OpenClaw Plugin</span>
          </button>

          {/* Whiteboard Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'whiteboard' ? 'none' : 'whiteboard')}
            style={{
              padding: '8px 16px',
              borderRadius: '2rem',
              background: activeTab === 'whiteboard' ? '#2563eb' : '#eff6ff',
              color: activeTab === 'whiteboard' ? '#ffffff' : '#1d4ed8',
              border: '1px solid #bfdbfe',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={16} />
            <span>Whiteboard</span>
          </button>

          {/* Room Chat Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'none' : 'chat')}
            style={{
              padding: '8px 16px',
              borderRadius: '2rem',
              background: activeTab === 'chat' ? '#0f172a' : '#f8fafc',
              color: activeTab === 'chat' ? '#ffffff' : '#334155',
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
        </div>

        {/* 4. Side Drawer: OpenClaw Agent & Tools Console (spotxyz/spot-openclaw) */}
        {activeTab === 'ai' && (
          <aside style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '420px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 60
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Spot OpenClaw Gateway</h3>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Plugin v0.2.0 &bull; WebSocket Connected</span>
              </div>
              <button onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            {/* Sub-tab navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}>
              <button
                onClick={() => setOpenClawSubTab('chat')}
                style={{
                  flex: 1,
                  padding: '9px',
                  background: openClawSubTab === 'chat' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: openClawSubTab === 'chat' ? '2px solid #10b981' : 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: openClawSubTab === 'chat' ? '#0f172a' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                Agent Chat
              </button>
              <button
                onClick={() => setOpenClawSubTab('console')}
                style={{
                  flex: 1,
                  padding: '9px',
                  background: openClawSubTab === 'console' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: openClawSubTab === 'console' ? '2px solid #10b981' : 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: openClawSubTab === 'console' ? '#0f172a' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                Tools Execution
              </button>
            </div>

            {openClawSubTab === 'chat' ? (
              <>
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {aiMessages.map((msg, i) => (
                    <div key={i} style={{
                      alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: msg.sender === 'You' ? '#2563eb' : '#f1f5f9',
                      color: msg.sender === 'You' ? '#ffffff' : '#1e293b',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      lineHeight: 1.45
                    }}>
                      <div style={{ fontSize: '0.72rem', opacity: 0.75, marginBottom: '3px' }}>{msg.sender} &bull; {msg.time}</div>
                      <div>{msg.text}</div>
                    </div>
                  ))}
                  {aiTyping && (
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>DevBot is executing tool...</div>
                  )}
                </div>

                <form onSubmit={sendAiMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Ask DevBot or command avatar..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '2rem',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button type="submit" style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <Send size={16} />
                  </button>
                </form>
              </>
            ) : (
              /* Spot Tools Interactive Console */
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  Execute official Spot OpenClaw Agent tools directly against the live world:
                </p>

                {/* Tool Trigger Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'spot_observe', label: 'spot_observe' },
                    { id: 'spot_rooms', label: 'spot_rooms' },
                    { id: 'spot_emotes', label: 'spot_emotes' },
                    { id: 'spot_gestures', label: 'spot_gestures' },
                    { id: 'spot_teleport', label: 'spot_teleport' },
                    { id: 'spot_move_to_room', label: 'spot_move_to_room' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => executeOpenClawTool(t.id)}
                      style={{
                        padding: '7px 10px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      ▶ {t.label}
                    </button>
                  ))}
                </div>

                <h4 style={{ margin: '10px 0 0', fontSize: '0.8rem', color: '#334155' }}>Tool Execution Telemetry:</h4>
                <div style={{
                  flex: 1,
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: '10px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {toolLogs.map((log, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                      <span style={{ color: '#22c55e' }}>[{log.time}]</span> <span style={{ color: '#f59e0b' }}>{log.tool}()</span>
                      <pre style={{ margin: '3px 0 0', whiteSpace: 'pre-wrap', color: '#94a3b8' }}>
                        {JSON.stringify(log.result, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* 5. Side Drawer: Audio Devices & Settings (spotxyz/macos-audio-devices) */}
        {activeTab === 'settings' && (
          <aside style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '380px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 60
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#0f172a" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Audio & Spatial Settings</h3>
              </div>
              <button onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Microphone Input Device:
                </label>
                <select
                  value={selectedInput}
                  onChange={(e) => setSelectedInput(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {audioDevices.inputs.length > 0 ? (
                    audioDevices.inputs.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Microphone ${i + 1}`}</option>
                    ))
                  ) : (
                    <option value="default">Default System Microphone</option>
                  )}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Speaker / Headphone Output:
                </label>
                <select
                  value={selectedOutput}
                  onChange={(e) => setSelectedOutput(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {audioDevices.outputs.length > 0 ? (
                    audioDevices.outputs.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Speaker ${i + 1}`}</option>
                    ))
                  ) : (
                    <option value="default">Default System Output</option>
                  )}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Spatial Audio Radius:</label>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>{spatialFalloff} units</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="0.5"
                  value={spatialFalloff}
                  onChange={(e) => setSpatialFalloff(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>Noise Suppression</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Filters typing and background noise</span>
                </div>
                <input
                  type="checkbox"
                  checked={noiseSuppression}
                  onChange={(e) => setNoiseSuppression(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Push-to-Talk Hotkey:</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  Hold <kbd style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Spacebar</kbd> anytime to temporarily unmute and speak.
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* 6. Side Drawer: Interactive Whiteboard */}
        {activeTab === 'whiteboard' && (
          <aside style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '460px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 60
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Office Whiteboard</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={clearWhiteboard} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>Clear</button>
                <button onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', borderBottom: '1px solid #f1f5f9' }}>
              {['#2563eb', '#dc2626', '#16a34a', '#0f172a', '#d97706'].map((color) => (
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

            <div style={{ flex: 1, padding: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <canvas
                ref={whiteboardCanvasRef}
                width={420}
                height={540}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'crosshair',
                  border: '1px solid #e2e8f0'
                }}
              />
            </div>
          </aside>
        )}

        {/* 7. Side Drawer: Room Chat */}
        {activeTab === 'chat' && (
          <aside style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '360px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 60
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#0f172a" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Room Chat &bull; {currentRoom}</h3>
              </div>
              <button onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  background: msg.sender === userName ? '#eff6ff' : '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <div style={{ color: '#0f172a' }}>{msg.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={sendChatMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Message room..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '2rem',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
              <button type="submit" style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Send size={16} />
              </button>
            </form>
          </aside>
        )}
      </main>
    </div>
  );
}
