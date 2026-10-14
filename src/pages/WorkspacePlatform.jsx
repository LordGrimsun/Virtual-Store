import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Headphones, Volume2,
  Users, Bot, MessageSquare, Edit3, Share2, LogOut, Settings,
  Sparkles, Send, Plus, Check, ChevronRight, X, PhoneCall, VolumeX,
  Maximize2, RotateCcw, HelpCircle, Coffee
} from 'lucide-react';

export default function WorkspacePlatform({ user, onExit }) {
  const mountRef = useRef(null);

  // User & Room state
  const [userName, setUserName] = useState(user?.fullName || 'Stan');
  const [currentRoom, setCurrentRoom] = useState('Central Collaboration Table');
  const [inAudioRange, setInAudioRange] = useState(['Stefan', 'Alex', 'Graham', 'Wes']);
  const [activeTab, setActiveTab] = useState('none'); // 'none', 'ai', 'team', 'chat', 'whiteboard'
  const [activeReaction, setActiveReaction] = useState(null);

  // Audio / Media toggles
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHeadphonesOn, setIsHeadphonesOn] = useState(true);

  // AI Agent Chat state
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'DevBot',
      text: 'Hey Stan! I am monitoring all project rooms. Currently, 7 teammates are at the central table discussing the v3 release, and Steven is focused at his desk.',
      time: '12:05 PM'
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Room Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Steven', text: 'Headphones on for deep focus, ping me if urgent!', time: '11:58 AM' },
    { sender: 'Alex', text: 'Grabbing fresh coffee before the standup.', time: '12:02 PM' },
    { sender: 'Graham', text: 'Doughnuts on the meeting table for everyone 🍩', time: '12:04 PM' }
  ]);

  // Whiteboard drawing state
  const whiteboardCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#2563eb');

  // Floating Nameplate positions projected to screen coordinates
  const [screenAvatars, setScreenAvatars] = useState([]);

  // Three.js Scene References
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const playerMeshRef = useRef(null);
  const targetPosRef = useRef(new THREE.Vector3(1.2, 0, 0.8));
  const avatarsRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce5ec); // Soft Scandinavian architectural daylight
    scene.fog = new THREE.FogExp2(0xdce5ec, 0.015);
    sceneRef.current = scene;

    // Isometric Camera setup (Telephoto look similar to Spot Virtual screenshot)
    const aspect = width / height;
    const d = 18;
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 0.1, 1000
    );
    // Angled top-down isometric view matching Spot screenshot
    camera.position.set(24, 28, 24);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting System
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd0d9e2, 1.25);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.4);
    sunLight.position.set(20, 35, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 80;
    const sCam = 25;
    sunLight.shadow.camera.left = -sCam;
    sunLight.shadow.camera.right = sCam;
    sunLight.shadow.camera.top = sCam;
    sunLight.shadow.camera.bottom = -sCam;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xb0d4f1, 0.5);
    fillLight.position.set(-18, 20, -18);
    scene.add(fillLight);

    // 3. Materials
    // Procedural birch wood floor texture
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const fCtx = floorCanvas.getContext('2d');
    fCtx.fillStyle = '#eae5dc'; // Light wood tone from Spot
    fCtx.fillRect(0, 0, 512, 512);

    // Subtle plank lines
    fCtx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    fCtx.lineWidth = 2;
    for (let y = 0; y < 512; y += 32) {
      fCtx.beginPath();
      fCtx.moveTo(0, y);
      fCtx.lineTo(512, y);
      fCtx.stroke();
    }
    // Staggered vertical seams
    for (let y = 0; y < 512; y += 32) {
      const offset = (y / 32) % 2 === 0 ? 0 : 64;
      for (let x = offset; x < 512; x += 128) {
        fCtx.beginPath();
        fCtx.moveTo(x, y);
        fCtx.lineTo(x, y + 32);
        fCtx.stroke();
      }
    }
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(16, 16);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.85,
      metalness: 0.05
    });

    const floorGeo = new THREE.PlaneGeometry(55, 45);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = 'floor';
    scene.add(floor);

    // Surrounding dark patio edge & grass border
    const patioMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.9 });
    const patioGeo = new THREE.BoxGeometry(57, 0.4, 47);
    const patio = new THREE.Mesh(patioGeo, patioMat);
    patio.position.y = -0.22;
    scene.add(patio);

    // 4. Helper Builders for Office Assets (Spot Virtual Exact Models)
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xc8b598, roughness: 0.7 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x718096, metalness: 0.8, roughness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd69e2e, metalness: 0.85, roughness: 0.3 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xe53e3e, roughness: 0.4 });
    const chairBeigeMat = new THREE.MeshStandardMaterial({ color: 0xd8cebf, roughness: 0.75 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x8ec5fc,
      transparent: true,
      opacity: 0.32,
      roughness: 0.08,
      transmission: 0.9,
      thickness: 0.5
    });

    // Planter Box Generator
    const createPlanter = (x, z, w, d, h = 1.0) => {
      const group = new THREE.Group();
      // Box trough
      const boxGeo = new THREE.BoxGeometry(w, h, d);
      const box = new THREE.Mesh(boxGeo, blackMat);
      box.position.y = h / 2;
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);

      // Soil
      const soilGeo = new THREE.BoxGeometry(w - 0.1, 0.1, d - 0.1);
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x2d2013 });
      const soil = new THREE.Mesh(soilGeo, soilMat);
      soil.position.y = h - 0.05;
      group.add(soil);

      // Lush leafy plants
      const numPlants = Math.max(3, Math.floor((w + d) * 3));
      for (let i = 0; i < numPlants; i++) {
        const leafColor = i % 2 === 0 ? 0x2f855a : 0x38a169;
        const leafMat = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.6 });
        const plantGeo = new THREE.ConeGeometry(0.35, 0.8 + Math.random() * 0.4, 5);
        const plant = new THREE.Mesh(plantGeo, leafMat);
        const px = (Math.random() - 0.5) * (w - 0.3);
        const pz = (Math.random() - 0.5) * (d - 0.3);
        plant.position.set(px, h + 0.3, pz);
        plant.rotation.y = Math.random() * Math.PI;
        plant.rotation.z = (Math.random() - 0.5) * 0.3;
        plant.castShadow = true;
        group.add(plant);
      }

      group.position.set(x, 0, z);
      scene.add(group);
      return group;
    };

    // Desk Cluster Generator (White minimalist dual workstation)
    const createDeskPair = (x, z, rotY = 0) => {
      const group = new THREE.Group();
      // Table tops (pair facing each other)
      const topGeo = new THREE.BoxGeometry(2.4, 0.1, 1.4);
      const top1 = new THREE.Mesh(topGeo, whiteMat);
      top1.position.set(0, 1.15, -0.75);
      top1.castShadow = true;
      top1.receiveShadow = true;
      group.add(top1);

      const top2 = new THREE.Mesh(topGeo, whiteMat);
      top2.position.set(0, 1.15, 0.75);
      top2.castShadow = true;
      top2.receiveShadow = true;
      group.add(top2);

      // Privacy divider between desks
      const divGeo = new THREE.BoxGeometry(2.3, 0.45, 0.08);
      const divMat = new THREE.MeshStandardMaterial({ color: 0xedf2f7 });
      const divider = new THREE.Mesh(divGeo, divMat);
      divider.position.set(0, 1.4, 0);
      group.add(divider);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.08, 1.1, 0.08);
      [[-1.1, -1.4], [1.1, -1.4], [-1.1, 1.4], [1.1, 1.4], [-1.1, 0], [1.1, 0]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, whiteMat);
        leg.position.set(lx, 0.55, lz);
        leg.castShadow = true;
        group.add(leg);
      });

      // Monitors & laptops on desk 1
      const monBase = new THREE.BoxGeometry(0.3, 0.03, 0.2);
      const monStand = new THREE.BoxGeometry(0.05, 0.35, 0.05);
      const monScreen = new THREE.BoxGeometry(0.9, 0.55, 0.04);
      const screenDisp = new THREE.Mesh(monScreen, blackMat);
      screenDisp.position.set(-0.3, 1.5, -0.6);
      screenDisp.castShadow = true;
      group.add(screenDisp);

      // Brass lamp
      const lampBase = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12);
      const lamp = new THREE.Mesh(lampBase, brassMat);
      lamp.position.set(0.8, 1.22, -0.6);
      group.add(lamp);

      // Red Coffee Mug
      const mugGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.14, 10);
      const mug = new THREE.Mesh(mugGeo, redMat);
      mug.position.set(0.6, 1.25, -0.4);
      group.add(mug);

      // Monitors on desk 2
      const screenDisp2 = new THREE.Mesh(monScreen, blackMat);
      screenDisp2.position.set(0.2, 1.5, 0.6);
      screenDisp2.castShadow = true;
      group.add(screenDisp2);

      // Office Chairs
      const chairGeo = new THREE.BoxGeometry(0.7, 0.1, 0.7);
      const chairBackGeo = new THREE.BoxGeometry(0.7, 0.7, 0.1);
      const chairPostGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8);

      const addChair = (cx, cz, crot) => {
        const cGrp = new THREE.Group();
        const seat = new THREE.Mesh(chairGeo, whiteMat);
        seat.position.y = 0.75;
        seat.castShadow = true;
        cGrp.add(seat);

        const back = new THREE.Mesh(chairBackGeo, whiteMat);
        back.position.set(0, 1.1, 0.3);
        back.castShadow = true;
        cGrp.add(back);

        const post = new THREE.Mesh(chairPostGeo, metalMat);
        post.position.y = 0.35;
        cGrp.add(post);

        cGrp.position.set(cx, 0, cz);
        cGrp.rotation.y = crot;
        group.add(cGrp);
      };

      addChair(0, -1.5, 0);
      addChair(0, 1.5, Math.PI);

      group.position.set(x, 0, z);
      group.rotation.y = rotY;
      scene.add(group);
      return group;
    };

    // Central Long Collaboration Table (From Spot Virtual Screenshot)
    const createCollaborationTable = () => {
      const group = new THREE.Group();
      // Big white rounded conference table
      const tableGeo = new THREE.BoxGeometry(6.5, 0.12, 1.8);
      const table = new THREE.Mesh(tableGeo, whiteMat);
      table.position.y = 1.15;
      table.castShadow = true;
      table.receiveShadow = true;
      group.add(table);

      // Table support pylons
      const pylonGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.1, 16);
      const p1 = new THREE.Mesh(pylonGeo, whiteMat);
      p1.position.set(-2.2, 0.55, 0);
      p1.castShadow = true;
      group.add(p1);

      const p2 = new THREE.Mesh(pylonGeo, whiteMat);
      p2.position.set(2.2, 0.55, 0);
      p2.castShadow = true;
      group.add(p2);

      // Delicious Red Doughnuts Plate in Center
      const plateGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.04, 16);
      const plate = new THREE.Mesh(plateGeo, whiteMat);
      plate.position.set(0.5, 1.23, 0.1);
      group.add(plate);

      // Red glazed treats
      for (let i = 0; i < 4; i++) {
        const torusGeo = new THREE.TorusGeometry(0.09, 0.05, 8, 16);
        const donut = new THREE.Mesh(torusGeo, redMat);
        donut.rotation.x = Math.PI / 2;
        donut.position.set(0.45 + (i % 2) * 0.12, 1.28, 0.05 + Math.floor(i / 2) * 0.12);
        group.add(donut);
      }

      // Coffee cups on table
      const cupGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.12, 10);
      const cup1 = new THREE.Mesh(cupGeo, blackMat);
      cup1.position.set(1.6, 1.24, -0.3);
      group.add(cup1);

      const cup2 = new THREE.Mesh(cupGeo, whiteMat);
      cup2.position.set(-1.4, 1.24, 0.4);
      group.add(cup2);

      // Modern Beige Chairs around table
      const chairSeatGeo = new THREE.BoxGeometry(0.75, 0.08, 0.7);
      const chairBackGeo = new THREE.BoxGeometry(0.75, 0.65, 0.08);

      const addTableChair = (cx, cz, rot) => {
        const cGrp = new THREE.Group();
        const seat = new THREE.Mesh(chairSeatGeo, chairBeigeMat);
        seat.position.y = 0.7;
        seat.castShadow = true;
        cGrp.add(seat);

        const back = new THREE.Mesh(chairBackGeo, chairBeigeMat);
        back.position.set(0, 1.0, 0.32);
        back.castShadow = true;
        cGrp.add(back);

        // 4 sleek metal legs
        const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.65, 6);
        [[-0.3, -0.28], [0.3, -0.28], [-0.3, 0.28], [0.3, 0.28]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(legGeo, metalMat);
          leg.position.set(lx, 0.32, lz);
          cGrp.add(leg);
        });

        cGrp.position.set(cx, 0, cz);
        cGrp.rotation.y = rot;
        group.add(cGrp);
      };

      // 4 chairs top side, 4 chairs bottom side
      [-2.1, -0.7, 0.7, 2.1].forEach((xOff) => {
        addTableChair(xOff, -1.35, 0); // Facing south
        addTableChair(xOff, 1.35, Math.PI); // Facing north
      });

      // Position table at an angle like the screenshot
      group.position.set(0.5, 0, 1.8);
      group.rotation.y = -Math.PI / 6; // Angled alignment
      scene.add(group);
      return group;
    };

    // Rolling Whiteboard next to the table
    const createRollingWhiteboard = (x, z, rotY) => {
      const group = new THREE.Group();
      // Whiteboard panel
      const boardGeo = new THREE.BoxGeometry(2.4, 1.5, 0.06);
      const board = new THREE.Mesh(boardGeo, whiteMat);
      board.position.y = 2.0;
      board.castShadow = true;
      group.add(board);

      // Aluminum frame
      const frameGeo = new THREE.BoxGeometry(2.5, 1.6, 0.08);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(0, 2.0, -0.01);
      group.add(frame);

      // Support legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.1, 8);
      const leg1 = new THREE.Mesh(legGeo, metalMat);
      leg1.position.set(-1.15, 1.05, 0);
      group.add(leg1);

      const leg2 = new THREE.Mesh(legGeo, metalMat);
      leg2.position.set(1.15, 1.05, 0);
      group.add(leg2);

      // Caster feet
      const footGeo = new THREE.BoxGeometry(0.08, 0.06, 0.8);
      const f1 = new THREE.Mesh(footGeo, metalMat);
      f1.position.set(-1.15, 0.03, 0);
      group.add(f1);

      const f2 = new THREE.Mesh(footGeo, metalMat);
      f2.position.set(1.15, 0.03, 0);
      group.add(f2);

      group.position.set(x, 0, z);
      group.rotation.y = rotY;
      scene.add(group);
      return group;
    };

    // Glass Conference Room (Top Left)
    const createGlassMeetingRoom = () => {
      const group = new THREE.Group();
      // Glass Wall Left
      const wallGeo = new THREE.BoxGeometry(0.1, 3.4, 7.5);
      const glassWall1 = new THREE.Mesh(wallGeo, glassMat);
      glassWall1.position.set(-8.5, 1.7, -9.5);
      group.add(glassWall1);

      // Glass Wall Front with Black Double Door Frame
      const frontGlassGeo = new THREE.BoxGeometry(5.5, 3.4, 0.1);
      const frontGlass = new THREE.Mesh(frontGlassGeo, glassMat);
      frontGlass.position.set(-5.75, 1.7, -5.75);
      group.add(frontGlass);

      // Black Frame Headers & Posts
      const headerGeo = new THREE.BoxGeometry(5.7, 0.15, 0.15);
      const header = new THREE.Mesh(headerGeo, blackMat);
      header.position.set(-5.75, 3.35, -5.75);
      group.add(header);

      // Double Door frame & silver handles
      const doorFrameGeo = new THREE.BoxGeometry(2.0, 2.8, 0.12);
      const doorGlass = new THREE.Mesh(doorFrameGeo, glassMat);
      doorGlass.position.set(-6.5, 1.4, -5.75);
      group.add(doorGlass);

      const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
      const handle1 = new THREE.Mesh(handleGeo, metalMat);
      handle1.position.set(-6.6, 1.3, -5.68);
      group.add(handle1);

      // Conference Table inside glass room
      const innerTable = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 1.5), blackMat);
      innerTable.position.set(-6.0, 1.1, -9.5);
      group.add(innerTable);

      scene.add(group);
    };

    // Lounge Sectional (Upper Left)
    const createLoungeArea = () => {
      const group = new THREE.Group();
      // Curved white modular couches
      const couchMat = new THREE.MeshStandardMaterial({ color: 0xf7fafc, roughness: 0.85 });
      const sofa1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.9), couchMat);
      sofa1.position.set(-10.5, 0.35, -2.5);
      sofa1.castShadow = true;
      group.add(sofa1);

      const sofa2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.9), couchMat);
      sofa2.position.set(-10.5, 0.35, 1.0);
      sofa2.castShadow = true;
      group.add(sofa2);

      // Round white coffee table
      const tableGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.45, 24);
      const cTable = new THREE.Mesh(tableGeo, whiteMat);
      cTable.position.set(-10.5, 0.22, -0.75);
      cTable.castShadow = true;
      group.add(cTable);

      scene.add(group);
    };

    // Lower Central Lounge (Black couch, beige armchairs, round coffee table)
    const createLowerLounge = () => {
      const group = new THREE.Group();
      // Sleek black 3-seater sofa
      const sofaGeo = new THREE.BoxGeometry(3.2, 0.55, 1.0);
      const bSofa = new THREE.Mesh(sofaGeo, blackMat);
      bSofa.position.set(-1.8, 0.35, 8.5);
      bSofa.rotation.y = -Math.PI / 7;
      bSofa.castShadow = true;
      group.add(bSofa);

      // Beige armchair 1
      const armGeo = new THREE.BoxGeometry(0.95, 0.55, 0.9);
      const arm1 = new THREE.Mesh(armGeo, chairBeigeMat);
      arm1.position.set(-4.5, 0.35, 9.8);
      arm1.rotation.y = Math.PI / 4;
      arm1.castShadow = true;
      group.add(arm1);

      // Round coffee table with plant vase
      const tableGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.38, 24);
      const marbleTable = new THREE.Mesh(tableGeo, whiteMat);
      marbleTable.position.set(-2.8, 0.19, 10.6);
      marbleTable.castShadow = true;
      group.add(marbleTable);

      const vaseGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.25, 10);
      const vase = new THREE.Mesh(vaseGeo, whiteMat);
      vase.position.set(-2.8, 0.45, 10.6);
      group.add(vase);

      scene.add(group);
    };

    // 5. Stylized 3D Avatar Generator (Matching Spot Bobblehead Character Aesthetics)
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

      // Head
      const headGeo = new THREE.SphereGeometry(0.42, 20, 20);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 1.9;
      head.castShadow = true;
      group.add(head);

      // Cap / Hair / Headphone accessory
      if (config.hasCap) {
        const capGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.2, 16);
        const capMat = new THREE.MeshStandardMaterial({ color: config.capColor || 0x2d3748 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(0, 2.15, -0.05);
        cap.rotation.x = 0.15;
        group.add(cap);

        // Cap bill/visor
        const visorGeo = new THREE.BoxGeometry(0.42, 0.05, 0.35);
        const visor = new THREE.Mesh(visorGeo, capMat);
        visor.position.set(0, 2.05, 0.4);
        group.add(visor);
      } else {
        // Standard Hair volume
        const hairGeo = new THREE.SphereGeometry(0.44, 16, 16);
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set(0, 2.02, -0.06);
        group.add(hair);
      }

      // Headphones if applicable
      if (config.hasHeadphones) {
        const hpBandGeo = new THREE.TorusGeometry(0.46, 0.04, 8, 16, Math.PI);
        const hpMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const band = new THREE.Mesh(hpBandGeo, hpMat);
        band.position.set(0, 1.95, 0);
        band.rotation.z = Math.PI;
        group.add(band);

        const cupGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
        const c1 = new THREE.Mesh(cupGeo, hpMat);
        c1.rotation.z = Math.PI / 2;
        c1.position.set(-0.44, 1.9, 0);
        group.add(c1);

        const c2 = new THREE.Mesh(cupGeo, hpMat);
        c2.rotation.z = Math.PI / 2;
        c2.position.set(0.44, 1.9, 0);
        group.add(c2);
      }

      // Torso / Shirt
      const torsoGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.85, 16);
      const torso = new THREE.Mesh(torsoGeo, clothMat);
      torso.position.y = 1.15;
      torso.castShadow = true;
      group.add(torso);

      // Sitting vs standing pose legs
      if (config.isSitting) {
        // Upper legs horizontal
        const legGeo = new THREE.BoxGeometry(0.16, 0.16, 0.55);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x2d3748 });
        const leg1 = new THREE.Mesh(legGeo, legMat);
        leg1.position.set(-0.16, 0.72, 0.3);
        group.add(leg1);

        const leg2 = new THREE.Mesh(legGeo, legMat);
        leg2.position.set(0.16, 0.72, 0.3);
        group.add(leg2);
      } else {
        // Standing legs
        const legGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.75, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x2d3748 });
        const leg1 = new THREE.Mesh(legGeo, legMat);
        leg1.position.set(-0.16, 0.4, 0);
        group.add(leg1);

        const leg2 = new THREE.Mesh(legGeo, legMat);
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

    // 6. Build the entire Scene Geometry Matching the User's Screenshot!
    // Planters enclosing Upper Left Lounge
    createPlanter(-13.5, -3.5, 0.9, 7.5);
    createPlanter(-7.5, -3.5, 0.9, 7.5);
    createPlanter(-10.5, -7.5, 6.9, 0.9);
    createPlanter(-10.5, 0.5, 6.9, 0.9);

    // Planters along bottom right balcony railing
    createPlanter(18.0, 16.0, 0.8, 18.0);
    createPlanter(5.0, 20.0, 26.0, 0.8);

    // Glass Conference Room
    createGlassMeetingRoom();

    // Upper Left Lounge furniture
    createLoungeArea();

    // Central Collaboration Table
    createCollaborationTable();

    // Rolling Whiteboard
    createRollingWhiteboard(5.4, 1.2, -Math.PI / 4);

    // Lower Central Lounge
    createLowerLounge();

    // 6 Desk Clusters in Top Right & Mid Right (Matching screenshot)
    createDeskPair(4.0, -10.5, 0);
    createDeskPair(8.5, -10.5, 0);
    createDeskPair(13.0, -10.5, 0);

    createDeskPair(5.5, -4.5, 0);
    createDeskPair(10.5, -4.5, 0);

    createDeskPair(7.5, 3.5, -Math.PI / 6);

    // 7. Populate Teammate Avatars in exact locations from the user's screenshot!
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

    // Stan (You) sitting at top right desk: ● Stan (you)
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

    // Teammates around the Central Collaboration Table
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

    // Graham (green cap, sitting opposite Alex)
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

    // Mat (blue shirt, dark hair standing near black couch)
    avatarsList.push(
      createAvatar('Mat', new THREE.Vector3(-3.2, 0, 7.2), {
        isSitting: false,
        shirtColor: 0x2b6cb0,
        hairColor: 0x1a202c,
        rotationY: Math.PI / 4
      })
    );

    // Edward (sitting in beige armchair talking to Mat)
    avatarsList.push(
      createAvatar('Edward', new THREE.Vector3(-4.5, 0, 9.8), {
        isSitting: true,
        shirtColor: 0xffffff,
        hairColor: 0x718096,
        rotationY: -Math.PI / 4
      })
    );

    // Andi (blonde buns/pigtails, pink shirt, bottom left)
    avatarsList.push(
      createAvatar('Andi', new THREE.Vector3(-12.5, 0, 9.0), {
        isSitting: true,
        shirtColor: 0xed64a6,
        hairColor: 0xfefcbf,
        rotationY: 0
      })
    );

    // DevBot (OpenClaw Autonomous Agent stationed in the Glass Lab)
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

    // 8. Raycasting Click-to-Move Handler
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(floor);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        targetPosRef.current.set(point.x, 0, point.z);

        // Update active room label based on target position
        if (point.x < -4 && point.z < -4) {
          setCurrentRoom('Glass Boardroom');
        } else if (point.x < -6) {
          setCurrentRoom('West Lounge');
        } else if (point.x > 3 && point.z < -2) {
          setCurrentRoom('Engineering Desks');
        } else if (point.z > 6) {
          setCurrentRoom('South Cafe Lounge');
        } else {
          setCurrentRoom('Central Collaboration Table');
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth avatar movement towards target position
      if (playerMeshRef.current) {
        const player = playerMeshRef.current;
        const target = targetPosRef.current;
        const dist = player.position.distanceTo(target);

        if (dist > 0.15) {
          // Look towards movement direction
          const dir = new THREE.Vector3().subVectors(target, player.position).normalize();
          const targetAngle = Math.atan2(dir.x, dir.z);
          player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetAngle, 0.15);

          // Move forward
          player.position.addScaledVector(dir, Math.min(dist, delta * 5.5));

          // Natural walking bobbing
          player.position.y = Math.abs(Math.sin(elapsed * 10)) * 0.12;
        } else {
          player.position.y = 0;
        }
      }

      // Project 3D Avatars to Screen Pixels for 2D Floating Nameplates
      const projected = [];
      avatarsRef.current.forEach((av) => {
        const pos = new THREE.Vector3();
        av.mesh.getWorldPosition(pos);
        pos.y += 2.65; // Position directly above avatar head
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

      // Check proximity between Player and Teammates (within 6 units)
      if (playerMeshRef.current) {
        const pPos = playerMeshRef.current.position;
        const nearby = [];
        avatarsRef.current.forEach((av) => {
          if (!av.isPlayer) {
            const d = pPos.distanceTo(av.mesh.position);
            if (d < 6.5) {
              nearby.push(av.name);
            }
          }
        });
        setInAudioRange(nearby);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const asp = w / h;
      camera.left = -d * asp;
      camera.right = d * asp;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isHeadphonesOn]);

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
    }, 850);
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
        {/* Left: Spot Logo & Room Indicator */}
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
          {/* Mic */}
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

          {/* Video */}
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
            <span>{isScreenSharing ? 'Sharing Screen' : 'Share'}</span>
          </button>

          {/* Headphones Toggle */}
          <button
            onClick={() => setIsHeadphonesOn(!isHeadphonesOn)}
            style={{
              padding: '7px 14px',
              borderRadius: '2rem',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: isHeadphonesOn ? '#0f172a' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isHeadphonesOn ? <Headphones size={15} /> : <VolumeX size={15} />}
            <span>{isHeadphonesOn ? 'Listening' : 'DND'}</span>
          </button>

          {/* Emoji Reactions */}
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

        {/* 2D Floating Nameplates Billboarded Over 3D Coordinates (Matching Spot Screenshot!) */}
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
                border: '1px solid #cbd5e1',
                borderRadius: '2rem',
                padding: '3px 10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                transition: 'left 0.1s ease-out, top 0.1s ease-out',
                pointerEvents: 'none'
              }}
            >
              {/* Green online presence dot */}
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: av.status === 'ai-agent' ? '#10b981' : '#60c449',
                display: 'inline-block'
              }} />

              <span>{av.name}</span>

              {av.hasHeadphones && <span style={{ fontSize: '0.85rem' }}>🎧</span>}

              {/* Floating reaction bubble if this is player */}
              {av.isPlayer && activeReaction && (
                <div style={{
                  position: 'absolute',
                  bottom: '130%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1.75rem',
                  animation: 'floatUp 1.2s ease-out forwards'
                }}>
                  {activeReaction}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Help Tooltip */}
        <div style={{
          position: 'absolute',
          bottom: '18px',
          left: '20px',
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
          <span><strong>Click anywhere</strong> on the floor to walk &bull; Walk near colleagues for proximity audio</span>
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
                <strong style={{ fontSize: '1rem', color: '#1e293b' }}>Collaborative Whiteboard</strong>
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
                Draw with mouse or stylus &bull; Changes visible to anyone near the rolling whiteboard
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
