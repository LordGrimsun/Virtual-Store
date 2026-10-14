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
  const [currentRoom, setCurrentRoom] = useState('Conference Table');
  const [inAudioRange, setInAudioRange] = useState(['Stefan', 'Alex', 'Graham', 'Wes', 'Phil']);
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
      text: 'Welcome back Stan! You are currently with the team at the central conference table. PR #342 passed CI tests and is ready for your sign-off.',
      time: '12:10 PM'
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Room Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Steven', text: 'Headphones on for deep coding, ping me if needed!', time: '12:01 PM' },
    { sender: 'Graham', text: 'Fresh doughnuts on the table! 🍩 Grab one while warm.', time: '12:05 PM' },
    { sender: 'Wes', text: 'Reviewing the spatial audio latency benchmarks now.', time: '12:08 PM' }
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
  const targetPosRef = useRef(new THREE.Vector3(12.5, 0, -11.5)); // Starts at his desk matching screenshot
  const isSittingRef = useRef(true);
  const avatarsRef = useRef([]);
  const chairsRef = useRef([]);
  const cameraZoomRef = useRef(19);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe9eef3);
    scene.fog = new THREE.FogExp2(0xe9eef3, 0.012);
    sceneRef.current = scene;

    // True Isometric Camera Setup with perfect framing matching screenshot
    const aspect = width / height;
    const d = cameraZoomRef.current;
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 0.1, 1000
    );
    // Camera angle: 45° azimuth, 35.264° elevation (True Isometric)
    camera.position.set(30, 36, 30);
    camera.lookAt(1.0, 0, 1.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting System (Natural architectural office lighting)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd8e2ea, 1.35);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffdf7, 1.45);
    sunLight.position.set(22, 38, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    const sCam = 32;
    sunLight.shadow.camera.left = -sCam;
    sunLight.shadow.camera.right = sCam;
    sunLight.shadow.camera.top = sCam;
    sunLight.shadow.camera.bottom = -sCam;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const ambientFill = new THREE.DirectionalLight(0xcde1f3, 0.55);
    ambientFill.position.set(-20, 25, -20);
    scene.add(ambientFill);

    // 3. Custom Procedural Light Birch Plank Flooring (Exact match to screenshot)
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d');
    fCtx.fillStyle = '#eae5db'; // Light wood floor tone from Spot screenshot
    fCtx.fillRect(0, 0, 1024, 1024);

    // Subtle grain & wood plank seams
    fCtx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    fCtx.lineWidth = 2;
    for (let y = 0; y < 1024; y += 48) {
      fCtx.beginPath();
      fCtx.moveTo(0, y);
      fCtx.lineTo(1024, y);
      fCtx.stroke();
    }
    for (let y = 0; y < 1024; y += 48) {
      const offset = (y / 48) % 2 === 0 ? 0 : 96;
      for (let x = offset; x < 1024; x += 192) {
        fCtx.beginPath();
        fCtx.moveTo(x, y);
        fCtx.lineTo(x, y + 48);
        fCtx.stroke();
      }
    }
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(12, 12);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.82,
      metalness: 0.04
    });

    const floorGeo = new THREE.PlaneGeometry(65, 55);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = 'floor';
    scene.add(floor);

    // Surrounding dark patio & lawn border
    const patioMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
    const patio = new THREE.Mesh(new THREE.BoxGeometry(68, 0.5, 58), patioMat);
    patio.position.y = -0.26;
    scene.add(patio);

    // 4. Shared Office Materials
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28 });
    const deskTopMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xc8b598, roughness: 0.7 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x718096, metalness: 0.85, roughness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd69e2e, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xd93838, roughness: 0.4 });
    const chairBeigeMat = new THREE.MeshStandardMaterial({ color: 0xd8cebe, roughness: 0.75 });
    const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.06,
      transmission: 0.92,
      thickness: 0.4
    });

    // 5. Office Builders Matching Spot Screenshot
    // A. Planter Box (Matte black trough with lush leafy foliage)
    const createPlanter = (x, z, w, d, h = 1.05) => {
      const group = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blackMat);
      box.position.y = h / 2;
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);

      // Soil bed
      const soil = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.1, d - 0.1), new THREE.MeshStandardMaterial({ color: 0x22170f }));
      soil.position.y = h - 0.05;
      group.add(soil);

      // Dense snake plants / ficus foliage (matching screenshot)
      const numPlants = Math.max(4, Math.floor((w + d) * 3.5));
      for (let i = 0; i < numPlants; i++) {
        const leafColor = i % 2 === 0 ? 0x22543d : 0x2f855a;
        const plantGeo = new THREE.ConeGeometry(0.32, 0.9 + Math.random() * 0.4, 6);
        const plant = new THREE.Mesh(plantGeo, new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.55 }));
        const px = (Math.random() - 0.5) * (w - 0.25);
        const pz = (Math.random() - 0.5) * (d - 0.25);
        plant.position.set(px, h + 0.35, pz);
        plant.rotation.y = Math.random() * Math.PI;
        plant.rotation.z = (Math.random() - 0.5) * 0.25;
        plant.castShadow = true;
        group.add(plant);
      }

      group.position.set(x, 0, z);
      scene.add(group);
      return group;
    };

    // B. Desk Workstations (White dual desks with monitors, laptops, lamps, mugs)
    const createDeskPair = (x, z, rotY = 0) => {
      const group = new THREE.Group();
      const topGeo = new THREE.BoxGeometry(2.5, 0.1, 1.45);

      // Desk 1 & Desk 2
      const top1 = new THREE.Mesh(topGeo, deskTopMat);
      top1.position.set(0, 1.15, -0.76);
      top1.castShadow = true;
      top1.receiveShadow = true;
      group.add(top1);

      const top2 = new THREE.Mesh(topGeo, deskTopMat);
      top2.position.set(0, 1.15, 0.76);
      top2.castShadow = true;
      top2.receiveShadow = true;
      group.add(top2);

      // Privacy Divider
      const div = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.06), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      div.position.set(0, 1.4, 0);
      group.add(div);

      // Desk Legs
      const legGeo = new THREE.BoxGeometry(0.08, 1.1, 0.08);
      [[-1.15, -1.4], [1.15, -1.4], [-1.15, 1.4], [1.15, 1.4], [-1.15, 0], [1.15, 0]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, whiteMat);
        leg.position.set(lx, 0.55, lz);
        leg.castShadow = true;
        group.add(leg);
      });

      // Monitors with glowing blue code displays
      const screenGeo = new THREE.BoxGeometry(0.95, 0.58, 0.04);
      const mon1 = new THREE.Mesh(screenGeo, blackMat);
      mon1.position.set(-0.35, 1.55, -0.55);
      mon1.castShadow = true;
      group.add(mon1);

      // Glowing screen texture
      const disp1 = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.48), screenGlowMat);
      disp1.position.set(-0.35, 1.55, -0.52);
      disp1.rotation.y = Math.PI;
      group.add(disp1);

      // Brass Gooseneck Lamp
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.05, 12), brassMat);
      lamp.position.set(0.85, 1.22, -0.6);
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

      // Chairs
      const addDeskChair = (cx, cz, crot) => {
        const cGrp = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.72), whiteMat);
        seat.position.y = 0.75;
        seat.castShadow = true;
        cGrp.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.72, 0.08), whiteMat);
        back.position.set(0, 1.1, 0.32);
        back.castShadow = true;
        cGrp.add(back);

        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8), metalMat);
        post.position.y = 0.38;
        cGrp.add(post);

        // Clickable chair target
        cGrp.position.set(cx, 0, cz);
        cGrp.rotation.y = crot;
        group.add(cGrp);

        // Register chair coordinate for click-to-sit
        chairsRef.current.push({
          pos: new THREE.Vector3(x + cx, 0, z + cz),
          rot: crot + rotY
        });
      };

      addDeskChair(0, -1.55, 0);
      addDeskChair(0, 1.55, Math.PI);

      group.position.set(x, 0, z);
      group.rotation.y = rotY;
      scene.add(group);
      return group;
    };

    // C. Central Collaboration Table (Angled with 8 chairs, treats plate & cake dome)
    const createCollaborationTable = () => {
      const group = new THREE.Group();

      // Big white rounded table
      const table = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.12, 1.9), whiteMat);
      table.position.y = 1.15;
      table.castShadow = true;
      table.receiveShadow = true;
      group.add(table);

      // White table support pylons
      [-2.4, 2.4].forEach((px) => {
        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.38, 1.1, 16), whiteMat);
        pylon.position.set(px, 0.55, 0);
        pylon.castShadow = true;
        group.add(pylon);
      });

      // Red Glazed Doughnuts Plate in Center
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.32, 0.05, 18), whiteMat);
      plate.position.set(0.6, 1.23, 0.1);
      plate.name = 'doughnutPlate';
      group.add(plate);

      for (let i = 0; i < 4; i++) {
        const donut = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.05, 8, 16), redMat);
        donut.rotation.x = Math.PI / 2;
        donut.position.set(0.55 + (i % 2) * 0.13, 1.28, 0.05 + Math.floor(i / 2) * 0.13);
        group.add(donut);
      }

      // Pastries Dome Stand (from screenshot near Wes)
      const domeStand = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.32, 0.06, 16), whiteMat);
      domeStand.position.set(2.4, 1.23, 0.2);
      group.add(domeStand);

      const glassDome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
      glassDome.position.set(2.4, 1.26, 0.2);
      group.add(glassDome);

      // Coffee cups & tumblers
      const cup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.15, 10), blackMat);
      cup1.position.set(1.4, 1.24, -0.3);
      group.add(cup1);

      const cup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.15, 10), whiteMat);
      cup2.position.set(-1.2, 1.24, 0.4);
      group.add(cup2);

      // Beige bucket conference chairs with sleek metal legs
      const addTableChair = (cx, cz, crot) => {
        const cGrp = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.08, 0.72), chairBeigeMat);
        seat.position.y = 0.72;
        seat.castShadow = true;
        cGrp.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.65, 0.08), chairBeigeMat);
        back.position.set(0, 1.02, 0.34);
        back.castShadow = true;
        cGrp.add(back);

        [[-0.32, -0.3], [0.32, -0.3], [-0.32, 0.3], [0.32, 0.3]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.68, 6), metalMat);
          leg.position.set(lx, 0.34, lz);
          cGrp.add(leg);
        });

        cGrp.position.set(cx, 0, cz);
        cGrp.rotation.y = crot;
        group.add(cGrp);

        chairsRef.current.push({
          pos: new THREE.Vector3(cx, 0, cz).applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 6).add(new THREE.Vector3(0.5, 0, 1.8)),
          rot: crot - Math.PI / 6
        });
      };

      // 4 chairs top side, 4 chairs bottom side
      [-2.4, -0.8, 0.8, 2.4].forEach((xOff) => {
        addTableChair(xOff, -1.4, 0); // North row
        addTableChair(xOff, 1.4, Math.PI); // South row
      });

      group.position.set(0.5, 0, 1.8);
      group.rotation.y = -Math.PI / 6;
      scene.add(group);
      return group;
    };

    // D. Rolling Whiteboard Screen (Exact match to screenshot)
    const createRollingWhiteboard = (x, z, rotY) => {
      const group = new THREE.Group();
      // Whiteboard surface
      const board = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 0.06), whiteMat);
      board.position.y = 2.1;
      board.castShadow = true;
      group.add(board);

      // Aluminum bezel frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.7, 0.08), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8 }));
      frame.position.set(0, 2.1, -0.01);
      group.add(frame);

      // Aluminum tubular legs
      [-1.25, 1.25].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), metalMat);
        leg.position.set(lx, 1.1, 0);
        group.add(leg);

        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.85), metalMat);
        foot.position.set(lx, 0.03, 0);
        group.add(foot);
      });

      group.position.set(x, 0, z);
      group.rotation.y = rotY;
      scene.add(group);
      return group;
    };

    // E. Glass Executive Boardroom (Top Left)
    const createGlassMeetingRoom = () => {
      const group = new THREE.Group();
      // Left glass wall
      const glassWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 8.5), glassMat);
      glassWall1.position.set(-8.5, 1.75, -9.5);
      group.add(glassWall1);

      // Front glass wall with black double door frame
      const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.5, 0.1), glassMat);
      frontGlass.position.set(-5.4, 1.75, -5.5);
      group.add(frontGlass);

      // Black headers & mullions
      const header = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.15, 0.15), blackMat);
      header.position.set(-5.4, 3.45, -5.5);
      group.add(header);

      // Double Door Frame
      const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.9, 0.12), glassMat);
      doorGlass.position.set(-6.5, 1.45, -5.5);
      group.add(doorGlass);

      // Vertical silver door handles
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), metalMat);
      handle.position.set(-6.6, 1.35, -5.42);
      group.add(handle);

      // Inner meeting table & chairs
      const innerTable = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.12, 1.6), blackMat);
      innerTable.position.set(-5.8, 1.1, -9.5);
      group.add(innerTable);

      scene.add(group);
    };

    // F. Upper Left Lounge (White Scandinavian sofas & planter enclosure)
    const createUpperLounge = () => {
      const group = new THREE.Group();
      const sofaMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 });

      const sofa1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.55, 0.95), sofaMat);
      sofa1.position.set(-10.5, 0.35, -2.5);
      sofa1.castShadow = true;
      group.add(sofa1);

      const sofa2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.55, 0.95), sofaMat);
      sofa2.position.set(-10.5, 0.35, 1.2);
      sofa2.castShadow = true;
      group.add(sofa2);

      const coffeeTable = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.45, 24), whiteMat);
      coffeeTable.position.set(-10.5, 0.22, -0.65);
      coffeeTable.castShadow = true;
      group.add(coffeeTable);

      scene.add(group);
    };

    // G. Lower Central Lounge (Black couch, beige armchairs, round marble table)
    const createLowerLounge = () => {
      const group = new THREE.Group();
      // Long black modern leather sofa
      const bSofa = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.55, 1.05), blackMat);
      bSofa.position.set(-1.8, 0.35, 8.5);
      bSofa.rotation.y = -Math.PI / 7;
      bSofa.castShadow = true;
      group.add(bSofa);

      // Beige armchair 1
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.55, 0.95), chairBeigeMat);
      arm1.position.set(-4.5, 0.35, 9.8);
      arm1.rotation.y = Math.PI / 4;
      arm1.castShadow = true;
      group.add(arm1);

      // Round coffee table with plant vase
      const marbleTable = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.38, 24), whiteMat);
      marbleTable.position.set(-2.8, 0.19, 10.6);
      marbleTable.castShadow = true;
      group.add(marbleTable);

      const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.25, 10), whiteMat);
      vase.position.set(-2.8, 0.45, 10.6);
      group.add(vase);

      scene.add(group);
    };

    // 6. Stylized Bobblehead 3D Avatar Generator (Identical to Spot Screenshot)
    const createAvatar = (name, initialPos, config = {}) => {
      const group = new THREE.Group();

      const skinMat = new THREE.MeshStandardMaterial({
        color: config.skinColor || 0xf6d8c3,
        roughness: 0.5
      });
      const clothMat = new THREE.MeshStandardMaterial({
        color: config.shirtColor || 0x3182ce,
        roughness: 0.7
      });
      const hairMat = new THREE.MeshStandardMaterial({
        color: config.hairColor || 0x4a3728,
        roughness: 0.8
      });

      // Spherical stylized head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), skinMat);
      head.position.y = 1.9;
      head.castShadow = true;
      group.add(head);

      // Hat / Cap / Hair Styling
      if (config.hasCap) {
        const capMat = new THREE.MeshStandardMaterial({ color: config.capColor || 0x2d3748 });
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.2, 16), capMat);
        cap.position.set(0, 2.15, -0.05);
        cap.rotation.x = 0.15;
        group.add(cap);

        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.35), capMat);
        visor.position.set(0, 2.05, 0.4);
        group.add(visor);
      } else {
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), hairMat);
        hair.position.set(0, 2.02, -0.06);
        group.add(hair);
      }

      // Headphones accessory
      if (config.hasHeadphones) {
        const hpMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const band = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 8, 16, Math.PI), hpMat);
        band.position.set(0, 1.95, 0);
        band.rotation.z = Math.PI;
        group.add(band);

        const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), hpMat);
        c1.rotation.z = Math.PI / 2;
        c1.position.set(-0.44, 1.9, 0);
        group.add(c1);

        const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), hpMat);
        c2.rotation.z = Math.PI / 2;
        c2.position.set(0.44, 1.9, 0);
        group.add(c2);
      }

      // Torso / Clothes
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.85, 16), clothMat);
      torso.position.y = 1.15;
      torso.castShadow = true;
      group.add(torso);

      // Sitting vs standing pose
      if (config.isSitting) {
        const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.55), new THREE.MeshStandardMaterial({ color: 0x2d3748 }));
        leg1.position.set(-0.16, 0.72, 0.3);
        group.add(leg1);

        const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.55), new THREE.MeshStandardMaterial({ color: 0x2d3748 }));
        leg2.position.set(0.16, 0.72, 0.3);
        group.add(leg2);
      } else {
        const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.75, 8), new THREE.MeshStandardMaterial({ color: 0x2d3748 }));
        leg1.position.set(-0.16, 0.4, 0);
        group.add(leg1);

        const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.75, 8), new THREE.MeshStandardMaterial({ color: 0x2d3748 }));
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
        hasHeadphones: config.hasHeadphones || false,
        isPlayer: config.isPlayer || false,
        status: config.status || 'online'
      };
    };

    // 7. Replicate the Exact Layout from the User's Screenshot:
    // Green Planters Enclosing Upper Lounge
    createPlanter(-13.5, -3.5, 0.9, 7.5);
    createPlanter(-7.5, -3.5, 0.9, 7.5);
    createPlanter(-10.5, -7.5, 6.9, 0.9);
    createPlanter(-10.5, 0.5, 6.9, 0.9);

    // Green Planters Along Balcony Border
    createPlanter(19.0, 16.0, 0.8, 18.0);
    createPlanter(5.0, 21.0, 28.0, 0.8);

    // Glass Executive Boardroom (Top Left)
    createGlassMeetingRoom();

    // Upper Left Lounge (White sofas)
    createUpperLounge();

    // Central Collaboration Table & Doughnuts
    createCollaborationTable();

    // Rolling Whiteboard Screen
    createRollingWhiteboard(5.4, 1.2, -Math.PI / 4);

    // Lower Central Lounge
    createLowerLounge();

    // 6 Desk Clusters (Top Right & Mid Right matching screenshot)
    createDeskPair(4.0, -10.5, 0);
    createDeskPair(8.5, -10.5, 0);
    createDeskPair(13.0, -10.5, 0);

    createDeskPair(5.5, -4.5, 0);
    createDeskPair(10.5, -4.5, 0);

    createDeskPair(8.0, 3.5, -Math.PI / 6);

    // 8. Populate All Teammates in the Exact Screenshot Positions:
    const avatarsList = [];

    // Steven sitting at desk with headphones: ● Steven 🎧
    avatarsList.push(
      createAvatar('Steven', new THREE.Vector3(4.0, 0, -11.9), {
        isSitting: true,
        hasHeadphones: true,
        shirtColor: 0xffffff,
        hairColor: 0xe2e8f0,
        rotationY: 0
      })
    );

    // Stan (you) sitting at top right desk: ● Stan (you)
    const playerObj = createAvatar('Stan (you)', new THREE.Vector3(12.8, 0, -11.9), {
      isSitting: true,
      hasHeadphones: isHeadphonesOn,
      shirtColor: 0x38bdf8,
      hairColor: 0x5a3e28,
      isPlayer: true,
      rotationY: 0
    });
    playerMeshRef.current = playerObj.mesh;
    avatarsList.push(playerObj);

    // Central Table Teammates:
    // Stefan (dark cap, blue hoodie)
    avatarsList.push(
      createAvatar('Stefan', new THREE.Vector3(-1.4, 0, 0.6), {
        isSitting: true,
        hasCap: true,
        capColor: 0x1a202c,
        shirtColor: 0x2563eb,
        rotationY: Math.PI / 3
      })
    );

    // Phil (brown hair, navy shirt)
    avatarsList.push(
      createAvatar('Phil', new THREE.Vector3(-0.6, 0, -0.4), {
        isSitting: true,
        shirtColor: 0x1e3a8a,
        hairColor: 0x451a03,
        rotationY: Math.PI / 2
      })
    );

    // Alex (bright green cap, green sweater)
    avatarsList.push(
      createAvatar('Alex', new THREE.Vector3(0.8, 0, 0.2), {
        isSitting: true,
        hasCap: true,
        capColor: 0x48bb78,
        shirtColor: 0x38a169,
        rotationY: Math.PI / 2
      })
    );

    // Graham (green cap opposite Alex)
    avatarsList.push(
      createAvatar('Graham', new THREE.Vector3(1.1, 0, 2.5), {
        isSitting: true,
        hasCap: true,
        capColor: 0x48bb78,
        shirtColor: 0x2f855a,
        rotationY: -Math.PI / 2
      })
    );

    // Wes (blonde hair, red & black plaid flannel shirt)
    avatarsList.push(
      createAvatar('Wes', new THREE.Vector3(2.6, 0, 1.2), {
        isSitting: true,
        shirtColor: 0x9b2c2c,
        hairColor: 0xf6e05e,
        rotationY: 0
      })
    );

    // Mat (standing near black couch)
    avatarsList.push(
      createAvatar('Mat', new THREE.Vector3(-3.2, 0, 7.2), {
        isSitting: false,
        shirtColor: 0x2b6cb0,
        hairColor: 0x1a202c,
        rotationY: Math.PI / 4
      })
    );

    // Edward (seated in armchair talking to Mat)
    avatarsList.push(
      createAvatar('Edward', new THREE.Vector3(-4.5, 0, 9.8), {
        isSitting: true,
        shirtColor: 0xffffff,
        hairColor: 0x718096,
        rotationY: -Math.PI / 4
      })
    );

    // Andi (blonde buns, pink top, bottom left)
    avatarsList.push(
      createAvatar('Andi', new THREE.Vector3(-12.5, 0, 9.0), {
        isSitting: true,
        shirtColor: 0xed64a6,
        hairColor: 0xfefcbf,
        rotationY: 0
      })
    );

    // DevBot (OpenClaw Autonomous Agent stationed in Glass Boardroom)
    avatarsList.push(
      createAvatar('DevBot (AI)', new THREE.Vector3(-6.2, 0, -8.2), {
        isSitting: true,
        shirtColor: 0x10b981,
        hairColor: 0x059669,
        status: 'ai-agent',
        rotationY: Math.PI / 2
      })
    );

    avatarsRef.current = avatarsList;

    // 9. Interactive Raycasting & Click-to-Move / Click-to-Sit
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      // Ignore if clicking on UI overlay
      if (e.target.closest('header, aside, .Platform_uiDock, .Platform_toast')) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Check if user clicked on the doughnut plate!
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

        // Stand up from chair when moving
        isSittingRef.current = false;

        // Detect Room
        if (point.x < -4 && point.z < -4) {
          setCurrentRoom('Glass Boardroom');
        } else if (point.x < -6) {
          setCurrentRoom('West Lounge');
        } else if (point.x > 3 && point.z < -2) {
          setCurrentRoom('Engineering Desks');
        } else if (point.z > 6) {
          setCurrentRoom('South Cafe Lounge');
        } else {
          setCurrentRoom('Conference Table');
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 10. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Avatar movement towards target point
      if (playerMeshRef.current) {
        const player = playerMeshRef.current;
        const target = targetPosRef.current;
        const dist = player.position.distanceTo(target);

        if (dist > 0.15) {
          const dir = new THREE.Vector3().subVectors(target, player.position).normalize();
          const targetAngle = Math.atan2(dir.x, dir.z);
          player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetAngle, 0.18);
          player.position.addScaledVector(dir, Math.min(dist, delta * 5.8));

          // Natural walking bob
          player.position.y = Math.abs(Math.sin(elapsed * 11)) * 0.12;
        } else {
          player.position.y = 0;
        }
      }

      // Billboard Project 3D Avatar Coordinates to 2D Screen Space
      const projected = [];
      avatarsRef.current.forEach((av) => {
        const pos = new THREE.Vector3();
        av.mesh.getWorldPosition(pos);
        pos.y += 2.65; // Directly above head
        pos.project(camera);

        const x = ((pos.x + 1) * width) / 2;
        const y = ((-pos.y + 1) * height) / 2;

        projected.push({
          name: av.name,
          x,
          y,
          isPlayer: av.isPlayer,
          hasHeadphones: av.hasHeadphones,
          status: av.status
        });
      });
      setScreenAvatars(projected);

      // Detect Spatial Audio Proximity (within 7.5 units)
      if (playerMeshRef.current) {
        const pPos = playerMeshRef.current.position;
        const nearby = [];
        avatarsRef.current.forEach((av) => {
          if (!av.isPlayer) {
            const d = pPos.distanceTo(av.mesh.position);
            if (d < 7.5) {
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
      const zoomFactor = e.deltaY * 0.015;
      cameraZoomRef.current = Math.max(10, Math.min(32, cameraZoomRef.current + zoomFactor));
      const curAspect = container.clientWidth / container.clientHeight;
      const curD = cameraZoomRef.current;
      camera.left = -curD * curAspect;
      camera.right = curD * curAspect;
      camera.top = curD;
      camera.bottom = -curD;
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const asp = w / h;
      const dNow = cameraZoomRef.current;
      camera.left = -dNow * asp;
      camera.right = dNow * asp;
      camera.top = dNow;
      camera.bottom = -dNow;
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
  }, [isHeadphonesOn]);

  // Jump camera/avatar to specific room
  const jumpToRoom = (roomName) => {
    setCurrentRoom(roomName);
    if (roomName === 'Conference Table') {
      targetPosRef.current.set(0.5, 0, 1.8);
    } else if (roomName === 'Engineering Desks') {
      targetPosRef.current.set(8.5, 0, -10.5);
    } else if (roomName === 'Glass Boardroom') {
      targetPosRef.current.set(-6.0, 0, -8.0);
    } else if (roomName === 'West Lounge') {
      targetPosRef.current.set(-10.5, 0, -0.5);
    } else if (roomName === 'South Cafe Lounge') {
      targetPosRef.current.set(-2.5, 0, 8.5);
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
      let replyText = "I've indexed your request in the spatial context. Everything is running smoothly across all services!";
      if (query.toLowerCase().includes('pr') || query.toLowerCase().includes('pull request')) {
        replyText = "PR #342 ('Spatial audio optimization') passed all CI tests. PR #345 had a minor lint warning in AuthModal.";
      } else if (query.toLowerCase().includes('status') || query.toLowerCase().includes('release')) {
        replyText = "The v3 release candidate build is deployed on staging. Latency metrics show 18ms WebRTC roundtrip.";
      } else if (query.toLowerCase().includes('doughnut') || query.toLowerCase().includes('coffee')) {
        replyText = "Graham just dropped fresh glazed doughnuts at the central collaboration table! Go grab one.";
      }
      setAiMessages((prev) => [...prev, { sender: 'DevBot', text: replyText, time: 'Just now' }]);
    }, 800);
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
            <span>Room: <strong style={{ color: '#0f172a' }}>{currentRoom}</strong></span>
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
              <span>In Proximity Audio: <strong>{inAudioRange.slice(0, 3).join(', ')}{inAudioRange.length > 3 ? ` +${inAudioRange.length - 3}` : ''}</strong></span>
            </div>
          )}
        </div>

        {/* Right: Media Controls & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Quick Room Teleport Dropdown */}
          <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {['Conference Table', 'Engineering Desks', 'Glass Boardroom', 'West Lounge'].map((r) => (
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
              border: `1px solid ${isMuted ? '#fca5a5' : '#86efac'}`,
              color: isMuted ? '#dc2626' : '#15803d',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{isMuted ? 'Muted' : 'Unmuted'}</span>
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: isVideoOn ? '#dbeafe' : '#f8fafc',
              border: `1px solid ${isVideoOn ? '#93c5fd' : '#cbd5e1'}`,
              color: isVideoOn ? '#1d4ed8' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isVideoOn ? <Video size={15} /> : <VideoOff size={15} />}
            <span>{isVideoOn ? 'Camera On' : 'Camera Off'}</span>
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: isScreenSharing ? '#e0e7ff' : '#f8fafc',
              border: `1px solid ${isScreenSharing ? '#a5b4fc' : '#cbd5e1'}`,
              color: isScreenSharing ? '#4338ca' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Monitor size={15} />
            <span>{isScreenSharing ? 'Sharing' : 'Share Screen'}</span>
          </button>

          {/* Headphones Toggle */}
          <button
            onClick={() => setIsHeadphonesOn(!isHeadphonesOn)}
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: isHeadphonesOn ? '#f1f5f9' : '#f8fafc',
              border: '1px solid #cbd5e1',
              color: isHeadphonesOn ? '#0f172a' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Headphones size={15} />
            <span>{isHeadphonesOn ? 'Headphones On' : 'Headphones Off'}</span>
          </button>

          {/* Reactions */}
          <div style={{ display: 'flex', gap: '3px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '2rem' }}>
            {['👋', '🍩', '🚀', '👏', '☕'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                style={{ fontSize: '1.05rem', cursor: 'pointer', padding: '2px 4px', background: 'transparent' }}
                title="Send Emote"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Tools Toggles */}
          <div style={{ display: 'flex', gap: '4px', marginLeft: '0.5rem' }}>
            <button
              onClick={() => setActiveTab(activeTab === 'ai' ? 'none' : 'ai')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: activeTab === 'ai' ? '#10b981' : '#f8fafc',
                color: activeTab === 'ai' ? '#fff' : '#1e293b',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Bot size={16} />
              <span>OpenClaw</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'whiteboard' ? 'none' : 'whiteboard')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: activeTab === 'whiteboard' ? '#2563eb' : '#f8fafc',
                color: activeTab === 'whiteboard' ? '#fff' : '#1e293b',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Edit3 size={16} />
              <span>Whiteboard</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'chat' ? 'none' : 'chat')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: activeTab === 'chat' ? '#38bdf8' : '#f8fafc',
                color: activeTab === 'chat' ? '#fff' : '#1e293b',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={16} />
              <span>Chat</span>
            </button>
          </div>

          {/* Exit to Marketing Website */}
          <button
            onClick={onExit}
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '0.5rem'
            }}
          >
            <LogOut size={15} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* 2. Main 3D Spatial Canvas + Overlays */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: 'calc(100vh - 62px)', overflow: 'hidden' }}>
        {/* Three.js Container */}
        <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />

        {/* Floating Donut Notification */}
        {donutToast && (
          <div className="Platform_toast" style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #86efac',
            color: '#166534',
            padding: '10px 20px',
            borderRadius: '2rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 1000,
            animation: 'popIn 0.25s ease-out'
          }}>
            {donutToast}
          </div>
        )}

        {/* 2D Floating Nameplates Billboarded Over 3D Coordinates (Exact match to Spot Screenshot) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {screenAvatars.map((av, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${av.x}px`,
                top: `${av.y}px`,
                transform: 'translate(-50%, -100%)',
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '9999px',
                padding: '3px 10px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                color: '#1e293b',
                whiteSpace: 'nowrap',
                transition: 'left 0.08s ease-out, top 0.08s ease-out',
                pointerEvents: 'none'
              }}
            >
              {/* Green online presence dot */}
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: av.status === 'ai-agent' ? '#10b981' : '#60c449',
                boxShadow: '0 0 6px rgba(96, 196, 73, 0.5)',
                display: 'inline-block'
              }} />

              {/* Exact Name text formatting (Stan (you)) */}
              {av.isPlayer ? (
                <span>
                  <strong style={{ fontWeight: 800 }}>Stan</strong> <span style={{ color: '#64748b', fontWeight: 500 }}>(you)</span>
                </span>
              ) : (
                <strong style={{ fontWeight: 700 }}>{av.name}</strong>
              )}

              {av.hasHeadphones && <span style={{ fontSize: '0.85rem' }}>🎧</span>}

              {/* Floating reaction bubble if this is player */}
              {av.isPlayer && activeReaction && (
                <div style={{
                  position: 'absolute',
                  bottom: '135%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1.85rem',
                  animation: 'floatUp 1.2s ease-out forwards'
                }}>
                  {activeReaction}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Help Tooltip & Zoom Controls */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '8px 16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            color: '#475569',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '1.1rem' }}>🖱️</span>
            <span><strong>Click anywhere</strong> to walk or sit in any chair &bull; Scroll wheel to zoom &bull; Click doughnuts for treats</span>
          </div>
        </div>

        {/* 3. Slide-in Drawers: OpenClaw AI Chat */}
        {activeTab === 'ai' && (
          <aside style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '380px',
            height: 'calc(100% - 40px)',
            background: '#ffffff',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 100
          }}>
            <div style={{ padding: '1rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} color="#10b981" />
                <div>
                  <strong style={{ fontSize: '1rem', color: '#1e293b' }}>DevBot (OpenClaw)</strong>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Active in Glass Boardroom</div>
                </div>
              </div>
              <button onClick={() => setActiveTab('none')} style={{ cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {aiMessages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.sender === 'You' ? '#2563eb' : '#f1f5f9',
                    color: m.sender === 'You' ? '#fff' : '#1e293b',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    lineHeight: 1.45
                  }}
                >
                  <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: '3px' }}>{m.sender} &bull; {m.time}</div>
                  <div>{m.text}</div>
                </div>
              ))}
              {aiTyping && (
                <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontStyle: 'italic' }}>
                  DevBot is thinking...
                </div>
              )}
            </div>

            <form onSubmit={sendAiMessage} style={{ padding: '0.85rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask DevBot anything..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#10b981',
                  color: '#fff',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </aside>
        )}

        {/* 4. Slide-in Drawers: Collaborative Whiteboard */}
        {activeTab === 'whiteboard' && (
          <aside style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '440px',
            height: 'calc(100% - 40px)',
            background: '#ffffff',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 100
          }}>
            <div style={{ padding: '1rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#2563eb" />
                <strong style={{ fontSize: '1rem', color: '#1e293b' }}>Rolling Whiteboard</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={clearWhiteboard}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
                <button onClick={() => setActiveTab('none')} style={{ cursor: 'pointer', color: '#64748b' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Color:</span>
              {['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed', '#1e293b'].map((c) => (
                <div
                  key={c}
                  onClick={() => setDrawColor(c)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: c,
                    cursor: 'pointer',
                    boxShadow: drawColor === c ? '0 0 0 3px #93c5fd' : 'none'
                  }}
                />
              ))}
            </div>

            <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <canvas
                ref={whiteboardCanvasRef}
                width={400}
                height={460}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  flex: 1,
                  cursor: 'crosshair',
                  touchAction: 'none'
                }}
              />
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '8px', textAlign: 'center' }}>
                Draw with mouse or stylus &bull; Live in real-time next to the collaboration table
              </div>
            </div>
          </aside>
        )}

        {/* 5. Slide-in Drawers: Room Chat */}
        {activeTab === 'chat' && (
          <aside style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '360px',
            height: 'calc(100% - 40px)',
            background: '#ffffff',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 100
          }}>
            <div style={{ padding: '1rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#1e293b' }}>#{currentRoom.toLowerCase().replace(/\s+/g, '-')}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Room Chat</div>
              </div>
              <button onClick={() => setActiveTab('none')} style={{ cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === userName ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.sender === userName ? '#2563eb' : '#f1f5f9',
                    color: m.sender === userName ? '#fff' : '#1e293b',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: '2px' }}>{m.sender} &bull; {m.time}</div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={sendChatMessage} style={{ padding: '0.85rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder={`Message #${currentRoom.toLowerCase().replace(/\s+/g, '-')}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
}
