import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Headphones, Volume2,
  Users, Bot, MessageSquare, Edit3, Share2, LogOut, Settings,
  Sparkles, Send, Plus, Check, ChevronRight, X, PhoneCall, VolumeX,
  Maximize2, ZoomIn, ZoomOut, RotateCcw, HelpCircle, Coffee, Compass
} from 'lucide-react';

export default function WorkspacePlatform({ user, onExit }) {
  const mountRef = useRef(null);

  // User & Room state
  const [userName, setUserName] = useState(user?.fullName || 'Stan');
  const [currentRoom, setCurrentRoom] = useState('All-Hands Lounge');
  const [inAudioRange, setInAudioRange] = useState(['Alex', 'Wes', 'Stefan', 'Steven', 'Phil']);
  const [activeTab, setActiveTab] = useState('none'); // 'none', 'ai', 'team', 'chat', 'whiteboard'
  const [activeReaction, setActiveReaction] = useState(null);
  const [donutToast, setDonutToast] = useState(null);

  // Audio / Media toggles
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHeadphonesOn, setIsHeadphonesOn] = useState(false);

  // AI Agent Chat state
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'DevBot',
      text: 'Welcome back Stan! You are in the main open office. All 10 workspaces are live with spatial audio enabled.',
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & WebGL Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbdd4bc); // Soft atmospheric outdoor sky
    scene.fog = new THREE.FogExp2(0xbdd4bc, 0.0075);
    sceneRef.current = scene;

    // Perspective Camera matching the wide isometric screenshot framing
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

    // 2. Lighting System (Natural architectural daylight)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8ba67e, 1.45);
    hemiLight.position.set(0, 60, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffef5, 1.55);
    sunLight.position.set(28, 45, 24);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 120;
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

    // 3. Procedural Textures Generation (Canvas Texture Helpers)

    // A. Floor Texture: Light Birch / Bleached Blonde Wood Planks
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d');
    fCtx.fillStyle = '#eee7de';
    fCtx.fillRect(0, 0, 1024, 1024);

    // Subtle grain lines
    fCtx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    fCtx.lineWidth = 1.5;
    for (let y = 0; y < 1024; y += 32) {
      fCtx.beginPath();
      fCtx.moveTo(0, y);
      fCtx.lineTo(1024, y);
      fCtx.stroke();
    }
    // Vertical seams with staggered offsets
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

    // B. Display Texture 1: Blue Stock / Metric Area Chart
    const chartCanvas = document.createElement('canvas');
    chartCanvas.width = 1024;
    chartCanvas.height = 512;
    const cCtx = chartCanvas.getContext('2d');
    cCtx.fillStyle = '#ffffff';
    cCtx.fillRect(0, 0, 1024, 512);

    // Gridlines
    cCtx.strokeStyle = '#e2e8f0';
    cCtx.lineWidth = 2;
    for (let y = 60; y < 450; y += 60) {
      cCtx.beginPath();
      cCtx.moveTo(60, y);
      cCtx.lineTo(960, y);
      cCtx.stroke();
    }

    // Blue Area Chart Fill & Line
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

    // C. Display Texture 2: Giant Digital LED KPI Scoreboard (168 161 47 34 34 / 83 85 6 52 25)
    const kpiCanvas = document.createElement('canvas');
    kpiCanvas.width = 1024;
    kpiCanvas.height = 512;
    const kCtx = kpiCanvas.getContext('2d');
    kCtx.fillStyle = '#0f172a';
    kCtx.fillRect(0, 0, 1024, 512);

    // Subtle dark matrix grid
    kCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    kCtx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 40) {
      kCtx.beginPath();
      kCtx.moveTo(x, 0);
      kCtx.lineTo(x, 512);
      kCtx.stroke();
    }

    // Top row numbers: 168 (pink), 161 (cyan), 47 (green), 34 (green), 34 (green)
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

    // Bottom row numbers: 83 (blue), 85 (blue), 6 (white), 52 (blue), 25 (green)
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

    // D. Display Texture 3: Whiteboard Architecture Blueprint Diagram
    const archCanvas = document.createElement('canvas');
    archCanvas.width = 1024;
    archCanvas.height = 512;
    const aCtx = archCanvas.getContext('2d');
    aCtx.fillStyle = '#ffffff';
    aCtx.fillRect(0, 0, 1024, 512);

    // Outer diagram border and boxes
    aCtx.strokeStyle = '#94a3b8';
    aCtx.lineWidth = 3;
    aCtx.strokeRect(80, 60, 360, 390);
    aCtx.strokeRect(520, 60, 420, 390);

    // Inner UI frames and circuits
    aCtx.strokeStyle = '#64748b';
    aCtx.strokeRect(110, 100, 300, 120);
    aCtx.strokeRect(110, 260, 140, 150);
    aCtx.strokeRect(270, 260, 140, 150);

    // Sticky notes & callouts
    aCtx.fillStyle = '#fef08a';
    aCtx.fillRect(430, 90, 80, 70);
    aCtx.fillStyle = '#fbcfe8';
    aCtx.fillRect(430, 200, 80, 70);

    // Connection arrows
    aCtx.strokeStyle = '#ef4444';
    aCtx.lineWidth = 4;
    aCtx.beginPath();
    aCtx.moveTo(410, 160);
    aCtx.lineTo(520, 160);
    aCtx.stroke();

    aCtx.strokeStyle = '#22c55e';
    aCtx.beginPath();
    aCtx.moveTo(410, 320);
    aCtx.lineTo(520, 260);
    aCtx.stroke();
    const archTexture = new THREE.CanvasTexture(archCanvas);

    // E. Display Texture 4: Front-Left "New Features" UI Screen
    const featCanvas = document.createElement('canvas');
    featCanvas.width = 512;
    featCanvas.height = 512;
    const featCtx = featCanvas.getContext('2d');
    featCtx.fillStyle = '#ffffff';
    featCtx.fillRect(0, 0, 512, 512);

    featCtx.fillStyle = '#0f172a';
    featCtx.font = 'bold 34px sans-serif';
    featCtx.fillText('New Features', 40, 70);

    // Row 1: Calendar 0%
    featCtx.fillStyle = '#f8fafc';
    featCtx.fillRect(40, 110, 432, 60);
    featCtx.fillStyle = '#334155';
    featCtx.font = '500 24px sans-serif';
    featCtx.fillText('Calendar', 60, 148);
    featCtx.fillText('0%', 420, 148);

    // Row 2: Spot Prints 100% (Selected in bright blue)
    featCtx.fillStyle = '#2563eb';
    featCtx.fillRect(40, 190, 432, 65);
    featCtx.fillStyle = '#ffffff';
    featCtx.font = 'bold 24px sans-serif';
    featCtx.fillText('Spot Prints', 60, 230);
    featCtx.fillText('100%', 400, 230);

    // Row 3: Documents 0%
    featCtx.fillStyle = '#f8fafc';
    featCtx.fillRect(40, 275, 432, 60);
    featCtx.fillStyle = '#334155';
    featCtx.font = '500 24px sans-serif';
    featCtx.fillText('Documents', 60, 313);
    featCtx.fillText('0%', 420, 313);
    const featTexture = new THREE.CanvasTexture(featCanvas);

    // F. Display Texture 5: Mobile Whiteboard "10:42 1 on 1 with Stan"
    const schedCanvas = document.createElement('canvas');
    schedCanvas.width = 512;
    schedCanvas.height = 768;
    const sCtx = schedCanvas.getContext('2d');
    sCtx.fillStyle = '#ffffff';
    sCtx.fillRect(0, 0, 512, 768);

    sCtx.fillStyle = '#0f172a';
    sCtx.font = 'bold 54px sans-serif';
    sCtx.fillText('10:42', 50, 90);

    // Colorful city buildings artwork
    const bColors = ['#f59e0b', '#ef4444', '#06b6d4', '#10b981', '#8b5cf6'];
    bColors.forEach((col, idx) => {
      sCtx.fillStyle = col;
      sCtx.fillRect(50 + idx * 75, 260 - (idx % 3) * 50, 65, 180 + (idx % 3) * 50);
    });

    sCtx.fillStyle = '#1e293b';
    sCtx.font = 'bold 30px sans-serif';
    sCtx.fillText('1 on 1 with Stan', 50, 520);

    // Green Schedule button
    sCtx.fillStyle = '#22c55e';
    sCtx.beginPath();
    sCtx.roundRect(50, 560, 180, 55, 12);
    sCtx.fill();
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 22px sans-serif';
    sCtx.fillText('Schedule', 85, 595);
    const schedTexture = new THREE.CanvasTexture(schedCanvas);

    // G. Display Texture 6: "09:38 No meetings" (Theater & Boardroom)
    const createNoMeetTexture = (timeStr) => {
      const nmCanvas = document.createElement('canvas');
      nmCanvas.width = 512;
      nmCanvas.height = 256;
      const nmCtx = nmCanvas.getContext('2d');
      nmCtx.fillStyle = '#ffffff';
      nmCtx.fillRect(0, 0, 512, 256);

      // Landscape artwork on left
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

      // Text on right
      nmCtx.fillStyle = '#0f172a';
      nmCtx.font = 'bold 42px sans-serif';
      nmCtx.fillText(timeStr, 200, 95);
      nmCtx.fillStyle = '#64748b';
      nmCtx.font = '500 24px sans-serif';
      nmCtx.fillText('No meetings', 200, 145);
      return new THREE.CanvasTexture(nmCanvas);
    };

    // H. Spot Logo Texture for Back Signage
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 512;
    logoCanvas.height = 256;
    const lCtx = logoCanvas.getContext('2d');
    lCtx.fillStyle = '#000000';
    lCtx.fillRect(0, 0, 512, 256);

    // Glowing green circle
    lCtx.fillStyle = '#22c55e';
    lCtx.beginPath();
    lCtx.arc(120, 128, 38, 0, Math.PI * 2);
    lCtx.fill();

    // Spot text
    lCtx.fillStyle = '#ffffff';
    lCtx.font = 'bold 84px sans-serif';
    lCtx.fillText('spot', 185, 156);
    const logoTexture = new THREE.CanvasTexture(logoCanvas);

    // I. Buffalo Plaid Flannel Texture (Red and Black)
    const plaidCanvas = document.createElement('canvas');
    plaidCanvas.width = 128;
    plaidCanvas.height = 128;
    const pCtx = plaidCanvas.getContext('2d');
    pCtx.fillStyle = '#b91c1c'; // Red
    pCtx.fillRect(0, 0, 128, 128);
    pCtx.fillStyle = '#111827'; // Black
    pCtx.fillRect(0, 0, 64, 64);
    pCtx.fillRect(64, 64, 64, 64);
    pCtx.fillStyle = 'rgba(0,0,0,0.4)';
    pCtx.fillRect(64, 0, 64, 64);
    pCtx.fillRect(0, 64, 64, 64);
    const plaidTexture = new THREE.CanvasTexture(plaidCanvas);
    plaidTexture.wrapS = THREE.RepeatWrapping;
    plaidTexture.wrapT = THREE.RepeatWrapping;
    plaidTexture.repeat.set(4, 4);

    // J. Striped Sweater Texture (Purple and White)
    const stripeCanvas = document.createElement('canvas');
    stripeCanvas.width = 64;
    stripeCanvas.height = 64;
    const stCtx = stripeCanvas.getContext('2d');
    stCtx.fillStyle = '#ffffff';
    stCtx.fillRect(0, 0, 64, 64);
    stCtx.fillStyle = '#6b21a8'; // Purple
    stCtx.fillRect(0, 0, 64, 32);
    const stripeTexture = new THREE.CanvasTexture(stripeCanvas);
    stripeTexture.wrapS = THREE.RepeatWrapping;
    stripeTexture.wrapT = THREE.RepeatWrapping;
    stripeTexture.repeat.set(1, 6);

    // 4. Shared Office Materials
    const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.84 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xc8b598, roughness: 0.7 });
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

    // 5. Exterior Landscape (Rolling Green Hills & 3D Trees Outside)
    // Outdoor ground plane
    const outdoorGroundMat = new THREE.MeshStandardMaterial({ color: 0x82a56a, roughness: 0.95 });
    const outdoorGround = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), outdoorGroundMat);
    outdoorGround.rotation.x = -Math.PI / 2;
    outdoorGround.position.set(0, -0.05, -20);
    outdoorGround.receiveShadow = true;
    scene.add(outdoorGround);

    // Rolling green hills in the background
    const hillMat1 = new THREE.MeshStandardMaterial({ color: 0x5b8a45, roughness: 0.9 });
    const hillMat2 = new THREE.MeshStandardMaterial({ color: 0x4d7c3b, roughness: 0.92 });

    const createHill = (x, z, r, h, mat) => {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(r, h, 18), mat);
      hill.position.set(x, h / 2 - 2, z);
      scene.add(hill);
    };

    createHill(-45, -55, 38, 22, hillMat1);
    createHill(-15, -65, 48, 28, hillMat2);
    createHill(25, -60, 42, 25, hillMat1);
    createHill(60, -50, 36, 20, hillMat2);

    // Low-Poly Trees on hills
    const createTree = (x, z, scale = 1) => {
      const treeGrp = new THREE.Group();
      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * scale, 0.45 * scale, 3 * scale, 6), new THREE.MeshStandardMaterial({ color: 0x543d2b }));
      trunk.position.y = 1.5 * scale;
      treeGrp.add(trunk);

      // Foliage layers
      const fMat = new THREE.MeshStandardMaterial({ color: 0x3d6b2c, roughness: 0.8 });
      [
        { r: 2.2 * scale, h: 2.5 * scale, y: 3.2 * scale },
        { r: 1.7 * scale, h: 2.2 * scale, y: 4.6 * scale },
        { r: 1.1 * scale, h: 1.8 * scale, y: 5.8 * scale }
      ].forEach((tier) => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(tier.r, tier.h, 7), fMat);
        cone.position.y = tier.y;
        treeGrp.add(cone);
      });

      treeGrp.position.set(x, 0, z);
      scene.add(treeGrp);
    };

    // Distant trees
    [-42, -28, -8, 8, 24, 38, 52].forEach((tx, idx) => {
      createTree(tx, -42 - (idx % 3) * 6, 1.2 + (idx % 2) * 0.4);
    });

    // Brick Wall Section in upper right background
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xba9b84, roughness: 0.85 });
    const brickWall = new THREE.Mesh(new THREE.BoxGeometry(28, 3.2, 0.6), brickMat);
    brickWall.position.set(32, 1.6, -34);
    scene.add(brickWall);

    // 6. Interior Birch Floor Slab
    const floorGeo = new THREE.BoxGeometry(64, 0.4, 40);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.2, -4);
    floorMesh.receiveShadow = true;
    floorMesh.name = 'floor';
    scene.add(floorMesh);

    // 7. Architectural Walls System (Matte Charcoal Black)
    const wallHeight = 3.6;
    const createWall = (x, z, w, d, h = wallHeight) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blackMat);
      wall.position.set(x, h / 2, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      scene.add(wall);
      return wall;
    };

    // Main back boundary wall
    createWall(-20, -22, 24, 0.45); // Left back wall
    createWall(18, -22, 28, 0.45);  // Right back wall (behind dashboards)

    // Theater / Presentation room walls (far left)
    createWall(-31.5, -14, 0.45, 16); // Left exterior wall
    createWall(-20, -6, 23, 0.45);    // Theater front partition wall
    createWall(-8.5, -14, 0.45, 16);  // Theater right partition wall

    // Front-left partition wall
    createWall(-8.5, 0, 0.45, 12);

    // 8. Architectural Planter Dividers (Black troughs with dense green blade plants)
    const createPlanter = (x, z, w, d, h = 1.05) => {
      const group = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blackMat);
      box.position.y = h / 2;
      box.castShadow = true;
      group.add(box);

      // Soil bed
      const soil = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.1, d - 0.1), new THREE.MeshStandardMaterial({ color: 0x1f1610 }));
      soil.position.y = h - 0.05;
      group.add(soil);

      // Dense upright snake plant blades
      const numPlants = Math.max(5, Math.floor((w + d) * 3.2));
      for (let i = 0; i < numPlants; i++) {
        const leafColor = i % 2 === 0 ? 0x22543d : 0x2f855a;
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.1 + Math.random() * 0.4, 5), new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.6 }));
        const px = (Math.random() - 0.5) * (w - 0.25);
        const pz = (Math.random() - 0.5) * (d - 0.25);
        blade.position.set(px, h + 0.4, pz);
        blade.rotation.y = Math.random() * Math.PI;
        blade.rotation.z = (Math.random() - 0.5) * 0.2;
        group.add(blade);
      }

      group.position.set(x, 0, z);
      scene.add(group);
      return group;
    };

    // Planter dividers matching the screenshot layout
    createPlanter(-7.5, 3.5, 0.8, 7.0);   // Separator between round table & center lounge
    createPlanter(-4.0, 6.8, 6.5, 0.8);   // L-turn planter enclosing middle nook
    createPlanter(-2.0, 1.8, 0.8, 4.2);   // Nook back planter

    // Perimeter boundary planters (front & left edges)
    createPlanter(-31.5, 5.0, 0.8, 18.0);
    createPlanter(-16.0, 15.5, 31.0, 0.8);
    createPlanter(15.0, 15.5, 31.0, 0.8);

    // 9. Zone 1: Far-Left Presentation Hall / Theater
    // Large projection screen showing 09:38 No meetings
    const theaterScreen = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 3.8, 0.08),
      new THREE.MeshStandardMaterial({ map: createNoMeetTexture('09:38'), roughness: 0.3 })
    );
    theaterScreen.position.set(-20, 2.2, -21.7);
    scene.add(theaterScreen);

    // Dual rows of auditorium chairs facing the screen
    const createTheaterChair = (cx, cz) => {
      const cGrp = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.6), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      seat.position.y = 0.55;
      cGrp.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.06), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      back.position.set(0, 0.85, 0.28);
      cGrp.add(back);

      [[-0.26, -0.22], [0.26, -0.22], [-0.26, 0.22], [0.26, 0.22]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 6), metalMat);
        leg.position.set(lx, 0.27, lz);
        cGrp.add(leg);
      });

      cGrp.position.set(cx, 0, cz);
      scene.add(cGrp);
    };

    // Row 1 & Row 2 theater chairs
    [-23.5, -21.5, -19.5, -17.5, -15.5].forEach((tx) => {
      createTheaterChair(tx, -14.5);
      createTheaterChair(tx, -11.5);
    });

    // 10. Zone 2: Front-Left Round Table Huddle & Interactive Board
    // Large "New Features" interactive display
    const featBoard = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 3.2, 0.1),
      new THREE.MeshStandardMaterial({ map: featTexture, roughness: 0.25 })
    );
    featBoard.position.set(-20.5, 2.3, -5.6);
    scene.add(featBoard);

    // Round White Table
    const roundTable = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.12, 32), whiteMat);
    roundTable.position.set(-19.5, 1.15, 4.5);
    roundTable.castShadow = true;
    roundTable.receiveShadow = true;
    scene.add(roundTable);

    // Table pedestal
    const roundPylon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.1, 16), whiteMat);
    roundPylon.position.set(-19.5, 0.55, 4.5);
    scene.add(roundPylon);

    // Center teleconference mic
    const micDome = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.35, 16), blackMat);
    micDome.position.set(-19.5, 1.35, 4.5);
    scene.add(micDome);

    // 6 beige modern armchairs around round table
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const cx = -19.5 + Math.cos(angle) * 3.1;
      const cz = 4.5 + Math.sin(angle) * 3.1;

      const chair = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.8), chairBeigeMat);
      seat.position.y = 0.65;
      chair.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.1), chairBeigeMat);
      back.position.set(0, 0.95, 0.38);
      chair.add(back);

      [[-0.35, -0.3], [0.35, -0.3], [-0.35, 0.3], [0.35, 0.3]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 6), metalMat);
        leg.position.set(lx, 0.3, lz);
        chair.add(leg);
      });

      chair.position.set(cx, 0, cz);
      chair.rotation.y = -angle + Math.PI / 2;
      scene.add(chair);
    }

    // 11. Zone 3: Middle Nook (between planters)
    // Curved white modern sofa
    const nookSofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.55, 0.95), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 }));
    nookSofa.position.set(-4.5, 0.35, 4.2);
    nookSofa.rotation.y = Math.PI / 2;
    nookSofa.castShadow = true;
    scene.add(nookSofa);

    // Gold pedestal drink table
    const goldTable = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.5, 16), brassMat);
    goldTable.position.set(-4.5, 0.25, 1.8);
    scene.add(goldTable);

    // 12. Zone 4: Foreground Lounge & Standing Avatars (Front Center)
    // Long 3-seater modern black leather sofa
    const bSofa = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.55, 1.1), blackMat);
    bSofa.position.set(-2.0, 0.35, 9.8);
    bSofa.castShadow = true;
    scene.add(bSofa);

    // Beige armchairs flanking coffee table
    const createArmchair = (x, z, rotY) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.55, 1.05), chairBeigeMat);
      arm.position.set(x, 0.35, z);
      arm.rotation.y = rotY;
      arm.castShadow = true;
      scene.add(arm);
    };
    createArmchair(-5.2, 10.5, Math.PI / 6);
    createArmchair(1.8, 10.5, -Math.PI / 6);

    // Round white drum coffee table with flower vase
    const drumTable = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.42, 24), whiteMat);
    drumTable.position.set(-1.8, 0.21, 11.8);
    drumTable.castShadow = true;
    scene.add(drumTable);

    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.3, 10), whiteMat);
    vase.position.set(-1.8, 0.55, 11.8);
    scene.add(vase);

    const sprig = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 6), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
    sprig.position.set(-1.8, 0.8, 11.8);
    scene.add(sprig);

    // 13. Zone 5: Center Long All-Hands / Dining Table
    const createAllHandsTable = () => {
      const group = new THREE.Group();

      // Extended long white table
      const table = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.12, 2.0), whiteMat);
      table.position.y = 1.15;
      table.castShadow = true;
      table.receiveShadow = true;
      group.add(table);

      // Support pylons
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

      // Red plate with doughnuts
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

      // Pastry dome cloche on pedestal
      const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.06, 16), whiteMat);
      domeBase.position.set(2.6, 1.23, 0.1);
      group.add(domeBase);

      const glassDome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
      glassDome.position.set(2.6, 1.26, 0.1);
      group.add(glassDome);

      // Black coffee mugs
      const mug1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 10), blackMat);
      mug1.position.set(1.2, 1.25, -0.4);
      group.add(mug1);

      // 12 Cantilever sand chairs
      const addTableChair = (cx, cz, crot) => {
        const cGrp = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.08, 0.7), chairBeigeMat);
        seat.position.y = 0.72;
        cGrp.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.65, 0.08), chairBeigeMat);
        back.position.set(0, 1.02, 0.32);
        cGrp.add(back);

        [[-0.32, -0.28], [0.32, -0.28], [-0.32, 0.28], [0.32, 0.28]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.68, 6), metalMat);
          leg.position.set(lx, 0.34, lz);
          cGrp.add(leg);
        });

        cGrp.position.set(cx, 0, cz);
        cGrp.rotation.y = crot;
        group.add(cGrp);

        chairsRef.current.push({
          pos: new THREE.Vector3(cx, 0, cz).add(new THREE.Vector3(4.5, 0, 3.8)),
          rot: crot
        });
      };

      // 6 North chairs, 6 South chairs
      [-3.3, -2.0, -0.7, 0.7, 2.0, 3.3].forEach((xOff) => {
        addTableChair(xOff, -1.35, 0);       // North row
        addTableChair(xOff, 1.35, Math.PI);  // South row
      });

      group.position.set(4.5, 0, 3.8);
      scene.add(group);
      return group;
    };
    createAllHandsTable();

    // 14. Zone 6: Center-Back Glass Boardroom
    const createGlassBoardroom = () => {
      const group = new THREE.Group();
      // Glass walls
      const glassBack = new THREE.Mesh(new THREE.BoxGeometry(9.6, 3.5, 0.1), glassMat);
      glassBack.position.set(0, 1.75, -21.8);
      group.add(glassBack);

      const glassFront = new THREE.Mesh(new THREE.BoxGeometry(9.6, 3.5, 0.1), glassMat);
      glassFront.position.set(0, 1.75, -12.5);
      group.add(glassFront);

      const glassLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 9.3), glassMat);
      glassLeft.position.set(-4.8, 1.75, -17.15);
      group.add(glassLeft);

      const glassRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 9.3), glassMat);
      glassRight.position.set(4.8, 1.75, -17.15);
      group.add(glassRight);

      // Black headers
      const header = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.16, 0.16), blackMat);
      header.position.set(0, 3.5, -12.5);
      group.add(header);

      // Double glass doors with handles
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), metalMat);
      handle.position.set(-0.8, 1.35, -12.4);
      group.add(handle);

      // Mounted wall display: 09:34 No meetings
      const roomScreen = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 2.0, 0.08),
        new THREE.MeshStandardMaterial({ map: createNoMeetTexture('09:34'), roughness: 0.3 })
      );
      roomScreen.position.set(2.2, 2.4, -21.6);
      group.add(roomScreen);

      // Inner meeting table & chairs
      const innerTable = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.12, 1.8), blackMat);
      innerTable.position.set(0, 1.1, -17.0);
      group.add(innerTable);

      scene.add(group);
    };
    createGlassBoardroom();

    // 15. Zone 7: Standing Mobile Whiteboard / Digital Board
    const createMobileDisplay = () => {
      const group = new THREE.Group();
      // Display panel
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 3.4, 0.08),
        new THREE.MeshStandardMaterial({ map: schedTexture, roughness: 0.25 })
      );
      screen.position.y = 2.4;
      screen.castShadow = true;
      group.add(screen);

      // White frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.1), whiteMat);
      frame.position.set(0, 2.4, -0.01);
      group.add(frame);

      // Mobile legs on wheels
      [-1.15, 1.15].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), whiteMat);
        leg.position.set(lx, 1.2, 0);
        group.add(leg);

        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.9), whiteMat);
        foot.position.set(lx, 0.04, 0);
        group.add(foot);
      });

      group.position.set(12.5, 0, 3.8);
      group.rotation.y = -Math.PI / 10;
      scene.add(group);
    };
    createMobileDisplay();

    // 16. Zone 8: Open Office Desk Clusters (Right Side)
    const createDeskPair = (x, z, rotY = 0) => {
      const group = new THREE.Group();
      const topGeo = new THREE.BoxGeometry(2.8, 0.1, 1.5);

      // Desk 1 & Desk 2
      const top1 = new THREE.Mesh(topGeo, whiteMat);
      top1.position.set(0, 1.15, -0.8);
      top1.castShadow = true;
      top1.receiveShadow = true;
      group.add(top1);

      const top2 = new THREE.Mesh(topGeo, whiteMat);
      top2.position.set(0, 1.15, 0.8);
      top2.castShadow = true;
      top2.receiveShadow = true;
      group.add(top2);

      // Privacy Divider
      const div = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.5, 0.06), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      div.position.set(0, 1.45, 0);
      group.add(div);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.08, 1.1, 0.08);
      [[-1.3, -1.45], [1.3, -1.45], [-1.3, 1.45], [1.3, 1.45], [-1.3, 0], [1.3, 0]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, whiteMat);
        leg.position.set(lx, 0.55, lz);
        group.add(leg);
      });

      // Dual Monitors
      const screenGeo = new THREE.BoxGeometry(0.95, 0.58, 0.04);
      const mon1 = new THREE.Mesh(screenGeo, blackMat);
      mon1.position.set(-0.4, 1.58, -0.6);
      group.add(mon1);

      const disp1 = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.48), screenGlowMat);
      disp1.position.set(-0.4, 1.58, -0.57);
      disp1.rotation.y = Math.PI;
      group.add(disp1);

      // Brass Gooseneck Lamp
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.05, 12), brassMat);
      lamp.position.set(0.9, 1.22, -0.65);
      group.add(lamp);

      // Red Coffee Mug
      const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12), redMat);
      mug.position.set(0.65, 1.25, -0.35);
      group.add(mug);

      // Open Laptop on desk 2
      const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.4), metalMat);
      laptopBase.position.set(0.3, 1.22, 0.5);
      group.add(laptopBase);

      const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.02), screenGlowMat);
      laptopScreen.position.set(0.3, 1.4, 0.3);
      laptopScreen.rotation.x = -0.2;
      group.add(laptopScreen);

      // Swivel office chairs
      const addDeskChair = (cx, cz, crot) => {
        const cGrp = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.72), whiteMat);
        seat.position.y = 0.75;
        cGrp.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.72, 0.08), whiteMat);
        back.position.set(0, 1.1, 0.32);
        cGrp.add(back);

        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8), metalMat);
        post.position.y = 0.38;
        cGrp.add(post);

        cGrp.position.set(cx, 0, cz);
        cGrp.rotation.y = crot;
        group.add(cGrp);

        chairsRef.current.push({
          pos: new THREE.Vector3(x + cx, 0, z + cz),
          rot: crot + rotY
        });
      };

      addDeskChair(0, -1.6, 0);
      addDeskChair(0, 1.6, Math.PI);

      group.position.set(x, 0, z);
      group.rotation.y = rotY;
      scene.add(group);
      return group;
    };

    // 3 Rows of Open Office Desks matching the screenshot
    createDeskPair(17.5, -12.5, 0);
    createDeskPair(22.5, -12.5, 0);

    createDeskPair(18.5, -6.0, 0);
    createDeskPair(23.5, -6.0, 0);

    createDeskPair(19.0, 0.5, 0);
    createDeskPair(24.0, 0.5, 0);

    // 17. Zone 9: Triple Dashboard Wall Displays (Back Right Wall)
    // Display 1: Blue Stock / Metric Area Chart
    const screen1 = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 2.7, 0.08),
      new THREE.MeshStandardMaterial({ map: chartTexture, roughness: 0.2 })
    );
    screen1.position.set(10.8, 2.3, -21.7);
    scene.add(screen1);

    // Display 2: Giant Digital LED KPI Scoreboard (168 161 47 34 34)
    const screen2 = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.7, 0.08),
      new THREE.MeshStandardMaterial({ map: kpiTexture, roughness: 0.2 })
    );
    screen2.position.set(16.5, 2.3, -21.7);
    scene.add(screen2);

    // Display 3: Whiteboard Architecture Blueprint Diagram
    const screen3 = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 2.7, 0.08),
      new THREE.MeshStandardMaterial({ map: archTexture, roughness: 0.2 })
    );
    screen3.position.set(22.2, 2.3, -21.7);
    scene.add(screen3);

    // 18. Zone 10: Far Back Corridor & Spot Branding
    [-10.0, 1.0, 28.0].forEach((lx) => {
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.2, 0.06),
        new THREE.MeshStandardMaterial({ map: logoTexture })
      );
      sign.position.set(lx, 2.8, -26.5);
      scene.add(sign);
    });

    // 19. Stylized 3D Bobblehead Avatar Generator (Exact Spot Virtual styling)
    const createAvatar = (name, initialPos, config = {}) => {
      const group = new THREE.Group();

      const skinMat = new THREE.MeshStandardMaterial({
        color: config.skinColor || 0xf6d8c3,
        roughness: 0.55
      });
      const hairMat = new THREE.MeshStandardMaterial({
        color: config.hairColor || 0x4a3728,
        roughness: 0.75
      });

      // Spherical stylized head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), skinMat);
      head.position.y = 1.9;
      head.castShadow = true;
      group.add(head);

      // Hat / Cap / Hair Styling
      if (config.hatType === 'spot_cap') {
        // White baseball cap with green Spot circle emblem
        const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.2, 16), capMat);
        cap.position.set(0, 2.15, -0.05);
        cap.rotation.x = 0.15;
        group.add(cap);

        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.35), capMat);
        visor.position.set(0, 2.05, 0.4);
        group.add(visor);

        // Green circle logo on cap
        const logo = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
        logo.position.set(0, 2.18, 0.42);
        logo.rotation.x = -0.2;
        group.add(logo);
      } else if (config.hatType === 'beanie') {
        const beanieMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
        const beanie = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5), beanieMat);
        beanie.position.set(0, 2.0, 0);
        group.add(beanie);
      } else if (config.hairType === 'blond_styled') {
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
        hair.position.set(0, 2.05, -0.05);
        group.add(hair);
      } else if (config.hairType === 'orange_buns') {
        const oHair = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
        oHair.position.set(0, 2.05, -0.05);
        group.add(oHair);
      } else {
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), hairMat);
        hair.position.set(0, 2.02, -0.06);
        group.add(hair);
      }

      // Eyeglasses
      if (config.hasGlasses) {
        const glassFrameMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
        const g1 = new THREE.Mesh(new THREE.RingGeometry(0.07, 0.1, 16), glassFrameMat);
        g1.position.set(-0.16, 1.92, 0.41);
        group.add(g1);
        const g2 = new THREE.Mesh(new THREE.RingGeometry(0.07, 0.1, 16), glassFrameMat);
        g2.position.set(0.16, 1.92, 0.41);
        group.add(g2);
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), glassFrameMat);
        bridge.position.set(0, 1.92, 0.41);
        group.add(bridge);
      }

      // Goatee / Beard
      if (config.hasBeard) {
        const beard = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.18, 12), new THREE.MeshStandardMaterial({ color: 0x2d3748 }));
        beard.position.set(0, 1.68, 0.32);
        group.add(beard);
      }

      // Torso / Clothing Texture
      let torsoMat;
      if (config.clothing === 'cyan_puffer') {
        torsoMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35 });
      } else if (config.clothing === 'plaid_flannel') {
        torsoMat = new THREE.MeshStandardMaterial({ map: plaidTexture, roughness: 0.8 });
      } else if (config.clothing === 'purple_striped') {
        torsoMat = new THREE.MeshStandardMaterial({ map: stripeTexture, roughness: 0.8 });
      } else if (config.clothing === 'red_blazer') {
        torsoMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
      } else if (config.clothing === 'green_hoodie') {
        torsoMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.65 });
      } else if (config.clothing === 'pink_hoodie') {
        torsoMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.65 });
      } else {
        torsoMat = new THREE.MeshStandardMaterial({ color: config.shirtColor || 0xffffff, roughness: 0.7 });
      }

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.85, 16), torsoMat);
      torso.position.y = 1.15;
      torso.castShadow = true;
      group.add(torso);

      // Puffer jacket horizontal quilted rings
      if (config.clothing === 'cyan_puffer') {
        [0.9, 1.15, 1.4].forEach((qy) => {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.04, 8, 16), new THREE.MeshStandardMaterial({ color: 0x0369a1 }));
          ring.rotation.x = Math.PI / 2;
          ring.position.y = qy;
          group.add(ring);
        });
      }

      // Waving Hand gesture (woman at round table)
      if (config.hasWavingHand) {
        const handGroup = new THREE.Group();
        const palm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.06), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        handGroup.add(palm);

        // 4 fingers + thumb
        for (let f = 0; f < 4; f++) {
          const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
          finger.position.set(-0.12 + f * 0.08, 0.28, 0);
          handGroup.add(finger);
        }
        const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        thumb.position.set(0.2, 0.05, 0);
        thumb.rotation.z = -Math.PI / 4;
        handGroup.add(thumb);

        handGroup.position.set(0.55, 2.45, 0.2);
        group.add(handGroup);
        wavingHandMeshRef.current = handGroup;
      }

      // Sitting vs standing pose
      if (config.isSitting) {
        const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.55), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        leg1.position.set(-0.16, 0.72, 0.3);
        group.add(leg1);

        const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.55), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        leg2.position.set(0.16, 0.72, 0.3);
        group.add(leg2);
      } else {
        const pantsColor = config.pantsColor || 0x1e293b;
        const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.75, 8), new THREE.MeshStandardMaterial({ color: pantsColor }));
        leg1.position.set(-0.16, 0.4, 0);
        group.add(leg1);

        const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.75, 8), new THREE.MeshStandardMaterial({ color: pantsColor }));
        leg2.position.set(0.16, 0.4, 0);
        group.add(leg2);
      }

      group.position.copy(initialPos);
      if (config.rotationY) group.rotation.y = config.rotationY;
      scene.add(group);

      return {
        name,
        mesh: group,
        isSitting: config.isSitting || false,
        isPlayer: config.isPlayer || false,
        status: config.status || 'online'
      };
    };

    // 20. Populate All Avatars in the Exact Positions from the Reference Screenshot:
    const avatarsList = [];

    // Foreground Standing Avatar 1 (Left): Guy in Spot cap, glasses, beard, cyan puffer jacket
    const playerObj = createAvatar('Stan (you)', new THREE.Vector3(0.3, 0, 11.2), {
      isSitting: false,
      hatType: 'spot_cap',
      hasGlasses: true,
      hasBeard: true,
      clothing: 'cyan_puffer',
      pantsColor: 0x0f172a,
      isPlayer: true,
      rotationY: 0
    });
    playerMeshRef.current = playerObj.mesh;
    avatarsList.push(playerObj);

    // Foreground Standing Avatar 2 (Right): Blonde hair, red and black buffalo check plaid flannel
    avatarsList.push(
      createAvatar('Wes', new THREE.Vector3(2.4, 0, 11.2), {
        isSitting: false,
        hairType: 'blond_styled',
        clothing: 'plaid_flannel',
        pantsColor: 0xa8a29e,
        rotationY: 0
      })
    );

    // Long All-Hands Table Teammates:
    // Left: Guy with purple striped sweater
    avatarsList.push(
      createAvatar('Stefan', new THREE.Vector3(1.2, 0, 2.5), {
        isSitting: true,
        hairColor: 0x4a3728,
        clothing: 'purple_striped',
        rotationY: 0
      })
    );

    // Right: Guy with red suit blazer and glasses
    avatarsList.push(
      createAvatar('Phil', new THREE.Vector3(4.8, 0, 2.5), {
        isSitting: true,
        hairColor: 0x1f2937,
        hasGlasses: true,
        clothing: 'red_blazer',
        rotationY: 0
      })
    );

    // Front-Left Round Table Avatars:
    // Blonde woman in pink hoodie
    avatarsList.push(
      createAvatar('Andi', new THREE.Vector3(-21.5, 0, 5.8), {
        isSitting: true,
        hairColor: 0xfef08a,
        clothing: 'pink_hoodie',
        rotationY: Math.PI / 4
      })
    );

    // Brunette woman
    avatarsList.push(
      createAvatar('Elena', new THREE.Vector3(-19.5, 0, 7.2), {
        isSitting: true,
        hairColor: 0x451a03,
        shirtColor: 0xd97706,
        rotationY: 0
      })
    );

    // Woman with the iconic waving yellow hand 👋
    avatarsList.push(
      createAvatar('Sarah', new THREE.Vector3(-17.2, 0, 4.8), {
        isSitting: true,
        hairColor: 0x78350f,
        shirtColor: 0x0284c7,
        hasWavingHand: true,
        rotationY: -Math.PI / 3
      })
    );

    // Person in middle planter nook (orange hair, glasses, sitting on white sofa)
    avatarsList.push(
      createAvatar('Chloe', new THREE.Vector3(-4.5, 0, 4.2), {
        isSitting: true,
        hairType: 'orange_buns',
        hasGlasses: true,
        shirtColor: 0xf1f5f9,
        rotationY: Math.PI / 2
      })
    );

    // Open Office Desk Teammates:
    // Steven in white shirt at desk
    avatarsList.push(
      createAvatar('Steven', new THREE.Vector3(17.5, 0, -14.1), {
        isSitting: true,
        shirtColor: 0xffffff,
        hairColor: 0x94a3b8,
        rotationY: 0
      })
    );

    // Teammate with dark beanie at desk
    avatarsList.push(
      createAvatar('Alex', new THREE.Vector3(22.5, 0, -14.1), {
        isSitting: true,
        hatType: 'beanie',
        hasGlasses: true,
        shirtColor: 0x334155,
        rotationY: 0
      })
    );

    // Teammate standing in green hoodie talking to colleagues
    avatarsList.push(
      createAvatar('Graham', new THREE.Vector3(15.2, 0, -5.2), {
        isSitting: false,
        clothing: 'green_hoodie',
        hairColor: 0x78350f,
        rotationY: Math.PI / 2
      })
    );

    // Additional engineers at desks
    avatarsList.push(
      createAvatar('Mat', new THREE.Vector3(18.5, 0, -7.6), {
        isSitting: true,
        shirtColor: 0x3b82f6,
        rotationY: 0
      })
    );

    // DevBot (Autonomous AI Agent in Glass Boardroom)
    avatarsList.push(
      createAvatar('DevBot (AI)', new THREE.Vector3(0, 0, -17.0), {
        isSitting: true,
        shirtColor: 0x10b981,
        hairColor: 0x059669,
        status: 'ai-agent',
        rotationY: Math.PI / 2
      })
    );

    avatarsRef.current = avatarsList;

    // 21. Interactive Pointer Down & Click-to-Move
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      if (e.target.closest('header, aside, .Platform_uiDock, .Platform_toast')) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Check if user clicked on doughnut plate
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
        } else if (point.x < -10) {
          setCurrentRoom('Round Table Huddle');
        } else if (point.x > 8 && point.z < -4) {
          setCurrentRoom('Engineering Desks');
        } else if (point.z < -8) {
          setCurrentRoom('Glass Boardroom');
        } else if (point.z > 8) {
          setCurrentRoom('Foreground Lounge');
        } else {
          setCurrentRoom('All-Hands Table');
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 22. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Waving hand animation
      if (wavingHandMeshRef.current) {
        wavingHandMeshRef.current.rotation.z = Math.sin(elapsed * 5) * 0.22;
      }

      // Player Movement
      if (playerMeshRef.current) {
        const player = playerMeshRef.current;
        const target = targetPosRef.current;
        const dist = player.position.distanceTo(target);

        if (dist > 0.15) {
          const dir = new THREE.Vector3().subVectors(target, player.position).normalize();
          const targetAngle = Math.atan2(dir.x, dir.z);
          player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetAngle, 0.2);
          player.position.addScaledVector(dir, Math.min(dist, delta * 6.2));
          player.position.y = Math.abs(Math.sin(elapsed * 12)) * 0.12; // Natural walking bob
        } else {
          player.position.y = 0;
        }
      }

      // Project 3D Avatar Names to 2D Screen Space
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

      // Proximity Audio Detection (within 8.5 units)
      if (playerMeshRef.current) {
        const pPos = playerMeshRef.current.position;
        const nearby = [];
        avatarsRef.current.forEach((av) => {
          if (!av.isPlayer) {
            const d = pPos.distanceTo(av.mesh.position);
            if (d < 8.5) {
              nearby.push(av.name.replace(' (AI)', ''));
            }
          }
        });
        setInAudioRange(nearby);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Zoom handler
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      camera.position.z = Math.max(28, Math.min(58, camera.position.z + zoomFactor));
      camera.position.y = Math.max(16, Math.min(34, camera.position.y + zoomFactor * 0.5));
    };

    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Resize Handler
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
  }, []);

  // Jump camera/avatar to specific room
  const jumpToRoom = (roomName) => {
    setCurrentRoom(roomName);
    if (roomName === 'All-Hands Table') {
      targetPosRef.current.set(4.5, 0, 5.5);
    } else if (roomName === 'Engineering Desks') {
      targetPosRef.current.set(18.5, 0, -6.0);
    } else if (roomName === 'Glass Boardroom') {
      targetPosRef.current.set(0, 0, -16.0);
    } else if (roomName === 'Round Table Huddle') {
      targetPosRef.current.set(-17.0, 0, 5.0);
    } else if (roomName === 'Presentation Hall') {
      targetPosRef.current.set(-20.0, 0, -12.0);
    } else if (roomName === 'Foreground Lounge') {
      targetPosRef.current.set(0.5, 0, 11.2);
    }
  };

  // Reactions
  const triggerReaction = (emoji) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 2500);
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
      let replyText = "All spatial channels and metrics are running in real-time. How can I assist you in this workspace?";
      if (query.toLowerCase().includes('kpi') || query.toLowerCase().includes('board') || query.toLowerCase().includes('metric')) {
        replyText = "The back wall KPI matrix reports 168 deployments, 161 active nodes, and 47 microservices active with 99.98% uptime.";
      } else if (query.toLowerCase().includes('pr') || query.toLowerCase().includes('pull request')) {
        replyText = "PR #342 ('Spatial audio latency optimization') passed CI tests and is deployed.";
      } else if (query.toLowerCase().includes('doughnut') || query.toLowerCase().includes('fruit')) {
        replyText = "Fresh glazed doughnuts and red apples are at the central all-hands table!";
      }
      setAiMessages((prev) => [...prev, { sender: 'DevBot', text: replyText, time: 'Just now' }]);
    }, 750);
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

          {/* Mic Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
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
            <span>{isMuted ? 'Muted' : 'Unmuted'}</span>
          </button>

          {/* Camera Toggle */}
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
            <span>{isVideoOn ? 'Camera On' : 'Camera Off'}</span>
          </button>

          {/* Exit / Home Button */}
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
            <span>Leave Space</span>
          </button>
        </div>
      </header>

      {/* 2. Main 3D Interactive Viewport */}
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

        {/* Controls Overlay Legend */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '10px 16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          zIndex: 20,
          pointerEvents: 'none'
        }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>SPOT VIRTUAL 3D PLATFORM</p>
          <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>
            Click anywhere on floor to walk &bull; Scroll wheel to zoom
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
          {/* Reaction Buttons */}
          <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #e2e8f0', paddingRight: '8px' }}>
            {['👋', '👏', '❤️', '🔥', '🍩'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.25rem',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* AI Drawer Button */}
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
            <span>OpenClaw AI</span>
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

          {/* Chat Button */}
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

        {/* 4. Side Drawer: OpenClaw Autonomous AI Agent */}
        {activeTab === 'ai' && (
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
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>DevBot &bull; AI Agent</h3>
              </div>
              <button onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

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
                <div style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>DevBot is thinking...</div>
              )}
            </div>

            <form onSubmit={sendAiMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask DevBot anything..."
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
          </aside>
        )}

        {/* 5. Side Drawer: Interactive Whiteboard */}
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

            {/* Color Palette */}
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

        {/* 6. Side Drawer: Room Chat */}
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
