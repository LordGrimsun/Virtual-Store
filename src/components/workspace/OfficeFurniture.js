import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/**
 * Builds all pixel-accurate office furniture across all 12 canonical Spot rooms:
 * - Boardroom: Facing black sofas, circular gold coffee tables, white armchairs, starry Spot screen
 * - Conference B & A: Long conference tables with white cantilever sled-base chairs and wall screens
 * - Auditorium: 7 tiers of black stadium bench seating and presentation stage screen
 * - Patio: Giant chessboard with chess pieces, sunken pool lounge, chevron terrace seating
 * - Workspace A: 4 workstation pods with monitors, dividers, and task chairs
 * - Lobby: Reception desk with computers and waiting area armchairs
 * - Chat A & B: Private call booths with desks, monitors, and chairs
 * - Lounge A, B, C: Sunken lounge pit, coffee bar, buffet table, and cocktail tables
 */
export function buildOfficeFurniture(scene, screenTextures, chairsRef) {
  const furnitureGroup = new THREE.Group();
  furnitureGroup.name = 'office_furniture_group';
  scene.add(furnitureGroup);

  // =========================================================================
  // LUXURY PROCEDURAL TEXTURE GENERATORS (Canvas2D)
  // Photorealistic Italian Nero Marquina & Calacatta marble, smoked walnut,
  // full-grain luxury leather, and textured warm ivory bouclé wool fabric.
  // =========================================================================

  // 1. Nero Marquina Black Italian Marble Texture
  const createNeroMarquinaTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep crystalline charcoal/black base with subtle micro-tonal variation
    const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
    baseGrad.addColorStop(0, '#0c0f14');
    baseGrad.addColorStop(0.5, '#121620');
    baseGrad.addColorStop(1, '#090c10');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle dark mineral clouding
    for (let i = 0; i < 40; i++) {
      const cx = (i * 137.5) % 1024;
      const cy = (i * 249.3) % 1024;
      const r = 80 + (i % 7) * 20;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(28, 36, 50, 0.22)');
      grad.addColorStop(1, 'rgba(12, 15, 20, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Elegant branching white & champagne gold marble veins
    const drawVein = (startX, startY, angle, length, branchDepth, mainColor, branchColor) => {
      ctx.save();
      let x = startX;
      let y = startY;
      let curAngle = angle;
      const steps = Math.floor(length / 8);

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let s = 0; s < steps; s++) {
        curAngle += Math.sin(s * 0.35 + startX) * 0.25;
        const dist = 8;
        x += Math.cos(curAngle) * dist;
        y += Math.sin(curAngle) * dist;
        ctx.lineTo(x, y);

        if (branchDepth > 0 && s % 12 === 0) {
          drawVein(x, y, curAngle + (s % 2 === 0 ? 0.7 : -0.7), length * 0.45, branchDepth - 1, branchColor, 'rgba(255, 255, 255, 0.35)');
        }
      }

      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Soft vein mineral bleed
      ctx.lineWidth = 5.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();
      ctx.restore();
    };

    drawVein(80, 100, 0.65, 950, 2, 'rgba(240, 245, 255, 0.88)', 'rgba(226, 186, 102, 0.75)');
    drawVein(320, 50, 0.82, 850, 2, 'rgba(235, 240, 250, 0.80)', 'rgba(255, 255, 255, 0.5)');
    drawVein(150, 600, 0.55, 750, 2, 'rgba(226, 186, 102, 0.82)', 'rgba(245, 248, 255, 0.6)');
    drawVein(650, 120, 0.95, 820, 2, 'rgba(245, 248, 255, 0.75)', 'rgba(212, 175, 55, 0.65)');
    drawVein(50, 850, 0.45, 600, 1, 'rgba(240, 245, 255, 0.70)', 'rgba(255, 255, 255, 0.4)');

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // 2. Calacatta Gold White Italian Marble Texture
  const createCalacattaGoldTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
    baseGrad.addColorStop(0, '#fbfcfd');
    baseGrad.addColorStop(0.5, '#f4f6f9');
    baseGrad.addColorStop(1, '#eef1f5');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    for (let i = 0; i < 35; i++) {
      const cx = (i * 179.3) % 1024;
      const cy = (i * 311.7) % 1024;
      const r = 90 + (i % 6) * 25;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(160, 170, 185, 0.16)');
      grad.addColorStop(1, 'rgba(250, 250, 252, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const drawCalacattaVein = (startX, startY, angle, length, mainColor, accentColor) => {
      ctx.save();
      let x = startX;
      let y = startY;
      let curAngle = angle;
      const steps = Math.floor(length / 10);

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let s = 0; s < steps; s++) {
        curAngle += Math.sin(s * 0.4 + startY) * 0.22;
        const dist = 9;
        x += Math.cos(curAngle) * dist;
        y += Math.sin(curAngle) * dist;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    };

    drawCalacattaVein(100, 80, 0.72, 900, 'rgba(148, 163, 184, 0.45)', 'rgba(212, 175, 55, 0.85)');
    drawCalacattaVein(420, 60, 0.85, 820, 'rgba(160, 170, 185, 0.40)', 'rgba(202, 138, 4, 0.80)');
    drawCalacattaVein(120, 550, 0.58, 800, 'rgba(148, 163, 184, 0.38)', 'rgba(212, 175, 55, 0.75)');

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // 3. Smoked Architectural Walnut Wood Texture
  const createSmokedWalnutTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#241710';
    ctx.fillRect(0, 0, 1024, 1024);

    for (let x = 0; x < 1024; x += 4) {
      const wave = Math.sin(x * 0.015) * 20 + Math.sin(x * 0.06) * 8;
      const alpha = 0.08 + Math.sin(x * 0.025 + wave * 0.1) * 0.08;
      ctx.fillStyle = `rgba(68, 44, 28, ${alpha})`;
      ctx.fillRect(x, 0, 4, 1024);
    }

    for (let i = 0; i < 400; i++) {
      const px = (i * 263.3) % 1024;
      const py = (i * 179.7) % 1024;
      const plen = 25 + (i % 10) * 8;
      ctx.fillStyle = 'rgba(16, 9, 6, 0.28)';
      ctx.fillRect(px, py, 1.2, plen);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // 4. Textured Bouclé Wool Fabric Texture
  const createBoucleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f7f5ef';
    ctx.fillRect(0, 0, 512, 512);

    for (let y = 0; y < 512; y += 8) {
      for (let x = 0; x < 512; x += 8) {
        const shade = (x + y) % 16 === 0 ? 'rgba(230, 224, 212, 0.55)' : 'rgba(255, 255, 255, 0.65)';
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.arc(x + 4, y + 4, 3.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // 5. Full-Grain Luxury Leather Texture
  const createLeatherTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#161920';
    ctx.fillRect(0, 0, 512, 512);

    for (let y = 0; y < 512; y += 6) {
      for (let x = 0; x < 512; x += 6) {
        const shade = (x * 3 + y * 7) % 13 > 6 ? 'rgba(32, 38, 48, 0.45)' : 'rgba(10, 12, 16, 0.50)';
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.arc(x + 3, y + 3, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // 6. Photorealistic Ficus Lyrata (Fiddle-Leaf Fig) Leaf Texture
  const createFicusLeafTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep glossy emerald green leaf blade gradient
    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
    grad.addColorStop(0, '#1e4d2b');
    grad.addColorStop(0.7, '#153a20');
    grad.addColorStop(1, '#0e2916');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Prominent central rib spine (light chartreuse / lime green)
    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(256, 512);
    ctx.lineTo(256, 25);
    ctx.stroke();

    // Radiating pinnate lateral veins
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.45)';
    ctx.lineWidth = 2.8;
    for (let y = 460; y > 60; y -= 36) {
      // Left vein
      ctx.beginPath();
      ctx.moveTo(256, y);
      ctx.quadraticCurveTo(140, y - 25, 30, y - 55);
      ctx.stroke();

      // Right vein
      ctx.beginPath();
      ctx.moveTo(256, y);
      ctx.quadraticCurveTo(372, y - 25, 482, y - 55);
      ctx.stroke();
    }

    // Leaf cuticle waxy specular sheen
    const glossGrad = ctx.createLinearGradient(0, 0, 512, 512);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
    glossGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
    ctx.fillStyle = glossGrad;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const neroMarbleTex = createNeroMarquinaTexture();
  const calacattaMarbleTex = createCalacattaGoldTexture();
  const smokedWalnutTex = createSmokedWalnutTexture();
  const boucleTex = createBoucleTexture();
  const leatherTex = createLeatherTexture();
  const ficusLeafTex = createFicusLeafTexture();

  // Premium Luxury Materials Suite
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.65 });
  const blackLeatherMat = new THREE.MeshStandardMaterial({
    color: 0x181c24,
    map: leatherTex,
    roughness: 0.38,
    metalness: 0.08
  });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
  const whiteChairMat = new THREE.MeshStandardMaterial({
    color: 0xf4f6fa,
    map: leatherTex,
    roughness: 0.35,
    metalness: 0.06
  });
  const tubArmchairMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f4,
    map: boucleTex,
    roughness: 0.82
  });
  const brassGoldMat = new THREE.MeshStandardMaterial({
    color: 0xe5c158,
    metalness: 0.88,
    roughness: 0.20
  });
  const champagneBrassMat = brassGoldMat;
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.85,
    roughness: 0.22
  });
  const neroMarbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: neroMarbleTex,
    roughness: 0.16,
    metalness: 0.12
  });
  const darkTableMat = neroMarbleMat;
  const calacattaMarbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: calacattaMarbleTex,
    roughness: 0.18,
    metalness: 0.10
  });
  const smokedWalnutMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: smokedWalnutTex,
    roughness: 0.32,
    metalness: 0.04
  });
  const woodDeskMat = smokedWalnutMat;
  const smokedGlassMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.62,
    roughness: 0.12,
    metalness: 0.18
  });
  const velvetOchreMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
  const velvetEmeraldMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.85 });
  const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.14, metalness: 0.02 });
  const candleAmberMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    transparent: true,
    opacity: 0.82,
    roughness: 0.15,
    metalness: 0.10
  });

  const screenBezelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4 });
  const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const turquoiseMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.65 });
  const cushionYellowMat = velvetOchreMat;
  const cushionOrangeMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 });
  const billiardGreenMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.85 });
  const pingPongBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6 });
  const woodTeakMat = smokedWalnutMat;
  const whiteResortMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const gymRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });

  const roundedBox = (width, height, depth, radius = 0.045) => {
    const safeRadius = Math.max(0.005, Math.min(radius, width * 0.45, height * 0.45, depth * 0.45));
    return new RoundedBoxGeometry(width, height, depth, 3, safeRadius);
  };

  const screensMap = {};
  const furnitureObstacles = [];
  scene.userData.furnitureObstacles = furnitureObstacles;

  const registerObstacle = (cx, cz, halfW, halfD, name = 'obstacle') => {
    furnitureObstacles.push({
      center: new THREE.Vector2(cx, cz),
      halfWidth: halfW,
      halfDepth: halfD,
      name
    });
  };

  // Helper: Wall-Mounted Starry Spot Screen (matching media_1791993853484.png & media_1791969444037.png)
  const createSpotWallScreen = (x, y, z, width = 4.8, height = 2.7, rotY = 0, screenKey = 'boardroom', defaultTex = null, displayName = '') => {
    const screenGrp = new THREE.Group();
    screenGrp.name = `screen_group_${screenKey}`;

    // Dark bezel casing
    const casing = new THREE.Mesh(roundedBox(width + 0.12, height + 0.12, 0.12, 0.04), screenBezelMat);
    casing.castShadow = true;
    casing.name = `casing_screen_${screenKey}`;
    screenGrp.add(casing);

    // Display face with role-specific texture (Exact match to media_1791993853484.png & media_1792034444325.png)
    const texture = defaultTex || (screenTextures?.createStarryLogoTexture ? screenTextures.createStarryLogoTexture() : (screenTextures?.starryLogoTexture || screenTextures?.logoTexture));
    if (texture) texture.colorSpace = THREE.SRGBColorSpace;
    const displayMat = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const displayMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), displayMat);
    displayMesh.position.z = 0.07;
    displayMesh.name = `screen_${screenKey}`;
    displayMesh.userData = { isSpotScreen: true, screenKey, width, height, displayMesh, displayName };
    casing.userData = { isSpotScreen: true, screenKey, width, height, displayMesh, displayName };
    screenGrp.userData = { isSpotScreen: true, screenKey, width, height, displayMesh, displayName };
    screenGrp.add(displayMesh);

    // Subtle edge back-light
    const glow = new THREE.PointLight(0x22c55e, 0.4, 3.5);
    glow.position.set(0, 0, 0.2);
    screenGrp.add(glow);

    screenGrp.position.set(x, y, z);
    screenGrp.rotation.y = rotY;
    furnitureGroup.add(screenGrp);

    screensMap[screenKey] = displayMesh;
    screensMap[`screen_${screenKey}`] = displayMesh;
    return displayMesh;
  };

  // Helper: Modern Ergonomic Workstation Monitor (Large 34" Ultrawide Display)
  const createWorkstationMonitor = (mx, my, mz, rotY = 0, screenKey = 'workstation_mon', defaultTex = null, displayName = 'Workstation Monitor') => {
    const monGrp = new THREE.Group();
    monGrp.name = `screen_group_${screenKey}`;

    // 1. Metal Stand Base (resting on desk at my)
    const base = new THREE.Mesh(roundedBox(0.36, 0.016, 0.24, 0.02), chromeMat);
    base.position.set(0, 0.008, 0);
    monGrp.add(base);

    // 2. Stand Vertical Riser / Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.020, 0.36, 16), blackMat);
    neck.position.set(0, 0.19, -0.04);
    monGrp.add(neck);

    // 3. Monitor Bezel Casing (width: 1.20, height: 0.68, depth: 0.035) - Modern 34" Ultrawide
    const casing = new THREE.Mesh(roundedBox(1.20, 0.68, 0.035, 0.015), screenBezelMat);
    casing.position.set(0, 0.38, 0);
    casing.castShadow = true;
    casing.name = `casing_screen_${screenKey}`;
    monGrp.add(casing);

    // 4. Display Screen Face with dedicated high-def texture (width: 1.15, height: 0.64)
    const texture = defaultTex || (screenTextures?.createCodeEditorTexture ? screenTextures.createCodeEditorTexture() : screenTextures?.starryLogoTexture);
    if (texture) texture.colorSpace = THREE.SRGBColorSpace;
    const displayMat = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const displayMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.64), displayMat);
    displayMesh.position.set(0, 0.38, 0.020);
    displayMesh.name = `screen_${screenKey}`;
    displayMesh.userData = { isSpotScreen: true, screenKey, width: 1.15, height: 0.64, displayMesh, isDeskMonitor: true, displayName };
    casing.userData = { isSpotScreen: true, screenKey, width: 1.15, height: 0.64, displayMesh, isDeskMonitor: true, displayName };
    monGrp.userData = { isSpotScreen: true, screenKey, width: 1.15, height: 0.64, displayMesh, isDeskMonitor: true, displayName };
    monGrp.add(displayMesh);

    monGrp.position.set(mx, my, mz);
    monGrp.rotation.y = rotY;
    furnitureGroup.add(monGrp);

    screensMap[screenKey] = displayMesh;
    screensMap[`screen_${screenKey}`] = displayMesh;
    return displayMesh;
  };

  // Helper: Luxury Bauhaus Soft-Pad Cantilever Conference Chair (Eames / Breuer style)
  const createCantileverChair = (cx, cz, crot, chairName = 'Conference Chair', cushionMat = whiteChairMat) => {
    const chair = new THREE.Group();
    const chairPos = new THREE.Vector3(cx, 0, cz);

    // 1. Continuous Tubular Sled Frame in Mirror Chrome
    const frameMat = chromeMat;
    const pipeRadius = 0.016;

    // Sled base runners
    const skidL = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.56, 14), frameMat);
    skidL.rotation.x = Math.PI / 2;
    skidL.position.set(-0.24, 0.022, 0);
    skidL.castShadow = true;
    chair.add(skidL);

    const skidR = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.56, 14), frameMat);
    skidR.rotation.x = Math.PI / 2;
    skidR.position.set(0.24, 0.022, 0);
    skidR.castShadow = true;
    chair.add(skidR);

    // Front horizontal crossbar linking skids
    const crossbarFront = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.48, 14), frameMat);
    crossbarFront.rotation.z = Math.PI / 2;
    crossbarFront.position.set(0, 0.022, 0.28);
    chair.add(crossbarFront);

    // Upright vertical cantilever risers
    const riserL = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.44, 14), frameMat);
    riserL.position.set(-0.24, 0.24, -0.26);
    riserL.castShadow = true;
    chair.add(riserL);

    const riserR = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.44, 14), frameMat);
    riserR.position.set(0.24, 0.24, -0.26);
    riserR.castShadow = true;
    chair.add(riserR);

    // Upper seat support arms extending forward
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.48, 14), frameMat);
    upperArmL.rotation.x = Math.PI / 2;
    upperArmL.position.set(-0.24, 0.44, -0.02);
    chair.add(upperArmL);

    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.48, 14), frameMat);
    upperArmR.rotation.x = Math.PI / 2;
    upperArmR.position.set(0.24, 0.44, -0.02);
    chair.add(upperArmR);

    // 2. Soft-Pad Channeled Leather Seating (3 horizontal cushioned ribs)
    const seatBase = new THREE.Mesh(roundedBox(0.50, 0.04, 0.46, 0.015), cushionMat);
    seatBase.position.set(0, 0.43, 0);
    seatBase.castShadow = true;
    seatBase.name = 'clickable_chair';
    seatBase.userData = { isChair: true, name: chairName, chairPos, chairRotY: crot, seatHeight: 0.46 };
    chair.add(seatBase);

    [-0.14, 0.0, 0.14].forEach((rz) => {
      const rib = new THREE.Mesh(roundedBox(0.48, 0.045, 0.13, 0.02), cushionMat);
      rib.position.set(0, 0.46, rz);
      rib.castShadow = true;
      rib.name = 'clickable_chair';
      rib.userData = seatBase.userData;
      chair.add(rib);
    });

    // 3. Ergonomic Channeled Backrest with Tubular Perimeter Frame & Upholstered Back
    // Chrome tubular perimeter rails
    [-0.24, 0.24].forEach((sx) => {
      const sideRail = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.50, 14), frameMat);
      sideRail.position.set(sx, 0.72, -0.25);
      sideRail.castShadow = true;
      chair.add(sideRail);
    });
    const topRail = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.48, 14), frameMat);
    topRail.rotation.z = Math.PI / 2;
    topRail.position.set(0, 0.97, -0.25);
    topRail.castShadow = true;
    chair.add(topRail);

    // Upholstered tailored back panel
    const backPanel = new THREE.Mesh(roundedBox(0.46, 0.48, 0.024, 0.012), cushionMat);
    backPanel.position.set(0, 0.72, -0.24);
    backPanel.castShadow = true;
    chair.add(backPanel);

    // 4 front horizontal cushioned ribs
    [-0.15, -0.05, 0.05, 0.15].forEach((ry) => {
      const rib = new THREE.Mesh(roundedBox(0.46, 0.09, 0.055, 0.02), cushionMat);
      rib.position.set(0, 0.72 + ry, -0.205);
      rib.castShadow = true;
      rib.name = 'clickable_chair';
      rib.userData = seatBase.userData;
      chair.add(rib);
    });

    // 4. Padded Leather Armrest Sleeves
    [-0.25, 0.25].forEach((ax) => {
      const armRiser = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, 0.22, 12), frameMat);
      armRiser.position.set(ax, 0.54, 0.08);
      chair.add(armRiser);

      const armPad = new THREE.Mesh(roundedBox(0.045, 0.024, 0.32, 0.01), cushionMat);
      armPad.position.set(ax, 0.65, -0.06);
      armPad.castShadow = true;
      chair.add(armPad);
    });

    chair.position.set(cx, 0, cz);
    chair.rotation.y = crot;
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos, chairRotY: crot, seatHeight: 0.46 };
    furnitureGroup.add(chair);

    if (chairsRef?.current) {
      chairsRef.current.push({ name: chairName, pos: chairPos, rot: crot, seatHeight: 0.46 });
    }
    return chair;
  };

  // Helper: Luxury Italian Black Leather 3-Seater Sofa with Floating Brass Plinth & Accent Pillows
  const createBlackSofa = (cx, cz, crot, sofaName = 'Boardroom Sofa') => {
    const sofa = new THREE.Group();
    const defaultCenterPos = new THREE.Vector3(
      cx + 0.12 * Math.sin(crot),
      0,
      cz + 0.12 * Math.cos(crot)
    );
    sofa.name = 'clickable_chair';
    sofa.userData = { isChair: true, name: sofaName, chairPos: defaultCenterPos, chairRotY: crot, seatHeight: 0.46 };

    // 1. Recessed Floating Champagne Brass Shadow Plinth
    const brassReveal = new THREE.Mesh(roundedBox(2.32, 0.04, 0.82, 0.02), brassGoldMat);
    brassReveal.position.y = 0.02;
    sofa.add(brassReveal);

    // 2. Main Charcoal Leather Plinth Body
    const base = new THREE.Mesh(roundedBox(2.40, 0.20, 0.88, 0.05), blackMat);
    base.position.y = 0.18;
    base.castShadow = true;
    sofa.add(base);

    // 3. 3 Individual Tailored Seat Cushions with Double-Piped Welt Borders
    [-0.72, 0, 0.72].forEach((sx, idx) => {
      const cosR = Math.cos(crot);
      const sinR = Math.sin(crot);
      const localZ = 0.08;
      const worldX = cx + sx * cosR + localZ * sinR;
      const worldZ = cz - sx * sinR + localZ * cosR;
      const cushionWorldPos = new THREE.Vector3(worldX, 0, worldZ);

      // Main cushion core
      const cushion = new THREE.Mesh(roundedBox(0.68, 0.15, 0.62, 0.05), blackLeatherMat);
      cushion.position.set(sx, 0.38, 0.08);
      cushion.castShadow = true;
      cushion.name = 'clickable_chair';
      cushion.userData = {
        isChair: true,
        name: `${sofaName} Cushion ${idx + 1}`,
        chairPos: cushionWorldPos,
        chairRotY: crot,
        seatHeight: 0.46
      };
      sofa.add(cushion);

      // Tailored welt cord piping along perimeter edge
      const welt = new THREE.Mesh(roundedBox(0.695, 0.024, 0.635, 0.012), blackLeatherMat);
      welt.position.set(sx, 0.44, 0.08);
      sofa.add(welt);

      // Subtle center leather button tuft indentation
      const tuft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.010, 12), blackMat);
      tuft.position.set(sx, 0.455, 0.08);
      sofa.add(tuft);

      if (chairsRef?.current) {
        chairsRef.current.push({
          name: `${sofaName} Cushion ${idx + 1}`,
          pos: cushionWorldPos,
          rot: crot,
          seatHeight: 0.46
        });
      }
    });

    // 4. Contoured Backrest Frame with 3 Padded Lumbar Cushions
    const backFrame = new THREE.Mesh(roundedBox(2.36, 0.52, 0.20, 0.05), blackMat);
    backFrame.position.set(0, 0.64, -0.33);
    backFrame.castShadow = true;
    backFrame.name = 'clickable_chair';
    backFrame.userData = sofa.userData;
    sofa.add(backFrame);

    [-0.72, 0, 0.72].forEach((bx) => {
      const backCushion = new THREE.Mesh(roundedBox(0.67, 0.38, 0.12, 0.04), blackLeatherMat);
      backCushion.position.set(bx, 0.67, -0.22);
      backCushion.castShadow = true;
      sofa.add(backCushion);
    });

    // 5. Tailored Armrests with Champagne Brass Inlay & Italian Cream Leather Arm Caps
    [-1.12, 1.12].forEach((ax) => {
      const arm = new THREE.Mesh(roundedBox(0.18, 0.36, 0.84, 0.04), blackLeatherMat);
      arm.position.set(ax, 0.46, 0);
      arm.castShadow = true;
      sofa.add(arm);

      const brassTrim = new THREE.Mesh(roundedBox(0.186, 0.018, 0.846, 0.008), brassGoldMat);
      brassTrim.position.set(ax, 0.63, 0);
      sofa.add(brassTrim);

      const cap = new THREE.Mesh(roundedBox(0.20, 0.055, 0.86, 0.025), whiteChairMat);
      cap.position.set(ax, 0.665, 0);
      cap.castShadow = true;
      sofa.add(cap);
    });

    // 6. Designer Throw Pillows / Bolster Accents
    // Left: Textured cream bouclé lumbar pillow
    const pillowL = new THREE.Mesh(roundedBox(0.38, 0.26, 0.14, 0.04), tubArmchairMat);
    pillowL.position.set(-0.92, 0.50, 0.05);
    pillowL.rotation.set(0.1, 0.22, 0.22);
    pillowL.castShadow = true;
    sofa.add(pillowL);

    // Right: Burnt ochre / camel velvet accent pillow
    const pillowR = new THREE.Mesh(roundedBox(0.32, 0.32, 0.13, 0.04), velvetOchreMat);
    pillowR.position.set(0.92, 0.50, 0.05);
    pillowR.rotation.set(0.1, -0.25, -0.20);
    pillowR.castShadow = true;
    sofa.add(pillowR);

    sofa.position.set(cx, 0, cz);
    sofa.rotation.y = crot;
    furnitureGroup.add(sofa);

    return sofa;
  };

  // Helper: Luxury Sculptural Tub Armchair in Ivory Bouclé with Tapered Champagne Brass Spindle Legs
  const createTubArmchair = (cx, cz, crot, chairName = 'Boardroom Tub Chair') => {
    const chair = new THREE.Group();
    const tubPos = new THREE.Vector3(cx, 0, cz);
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos: tubPos, chairRotY: crot, seatHeight: 0.46 };

    // 1. Sculptural Curved Barrel Bucket Shell
    const tub = new THREE.Mesh(roundedBox(0.84, 0.52, 0.78, 0.14), tubArmchairMat);
    tub.position.y = 0.42;
    tub.castShadow = true;
    tub.name = 'clickable_chair';
    tub.userData = { isChair: true, name: chairName, chairPos: tubPos, chairRotY: crot, seatHeight: 0.46 };
    chair.add(tub);

    // Inner back vertical fluted channels
    [-0.24, -0.12, 0, 0.12, 0.24].forEach((fx) => {
      const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.38, 12), tubArmchairMat);
      flute.position.set(fx, 0.48, -0.22);
      chair.add(flute);
    });

    // 2. Deep Removable Seat Cushion with Welt Piping
    const cushion = new THREE.Mesh(roundedBox(0.64, 0.14, 0.58, 0.06), tubArmchairMat);
    cushion.position.set(0, 0.42, 0.06);
    cushion.castShadow = true;
    cushion.name = 'clickable_chair';
    cushion.userData = chair.userData;
    chair.add(cushion);

    const welt = new THREE.Mesh(roundedBox(0.655, 0.02, 0.595, 0.01), tubArmchairMat);
    welt.position.set(0, 0.48, 0.06);
    chair.add(welt);

    // 3. Curved Lumbar Support Cushion Nestled Inside
    const lumbar = new THREE.Mesh(roundedBox(0.48, 0.18, 0.10, 0.04), whiteMat);
    lumbar.position.set(0, 0.46, -0.16);
    chair.add(lumbar);

    // 4. Splayed Tapered Champagne Brass Legs with Solid Turned Ferrules
    [-1, 1].forEach((lx) => {
      [-1, 1].forEach((lz) => {
        const legGrp = new THREE.Group();
        legGrp.position.set(lx * 0.28, 0, lz * 0.26);

        // Tapered spindle leg
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.026, 0.28, 12),
          brassGoldMat
        );
        leg.position.y = 0.14;
        leg.rotation.z = lx * -0.08;
        leg.rotation.x = lz * 0.08;
        leg.castShadow = true;
        legGrp.add(leg);

        // Polished brass floor ferrule glide
        const ferrule = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.035, 12),
          brassGoldMat
        );
        ferrule.position.y = 0.018;
        legGrp.add(ferrule);

        chair.add(legGrp);
      });
    });

    chair.position.set(cx, 0, cz);
    chair.rotation.y = crot;
    furnitureGroup.add(chair);

    if (chairsRef?.current) {
      chairsRef.current.push({ name: chairName, pos: tubPos, rot: crot, seatHeight: 0.46 });
    }
    return chair;
  };

  // Helper: Luxury Marble & Champagne Brass Coffee & Tea Table with Dual Tier & Tea Service Staging
  const createRoundCoffeeTable = (cx, cz, radius = 0.7, height = 0.42, options = {}) => {
    const table = new THREE.Group();

    // 1. Polished Marble Tabletop (Nero Marquina black marble with high-gloss veining)
    const marbleTop = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.042, 48),
      neroMarbleMat
    );
    marbleTop.position.y = height;
    marbleTop.castShadow = true;
    marbleTop.receiveShadow = true;
    table.add(marbleTop);

    // 2. Solid Beveled Champagne Brass Edge Bezel Ring
    const brassRim = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.016, radius + 0.016, 0.044, 48, 1, true),
      brassGoldMat
    );
    brassRim.position.y = height;
    table.add(brassRim);

    // 3. Secondary Floating Lower Shelf in Smoked Glass (at y = 0.16)
    const lowerRadius = radius * 0.78;
    const lowerShelf = new THREE.Mesh(
      new THREE.CylinderGeometry(lowerRadius, lowerRadius, 0.018, 36),
      smokedGlassMat
    );
    lowerShelf.position.y = 0.16;
    table.add(lowerShelf);

    // 4 Architectural Brass Standoff Rods supporting the lower shelf
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2;
      const sr = lowerRadius * 0.75;
      const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, height - 0.16, 12), brassGoldMat);
      standoff.position.set(Math.cos(ang) * sr, (height + 0.16) / 2, Math.sin(ang) * sr);
      table.add(standoff);
    }

    // 4. Central Fluted Architectural Brass Column & Stepped Heavy Base
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.08, height - 0.045, 24),
      brassGoldMat
    );
    stem.position.y = (height - 0.045) / 2;
    table.add(stem);

    // Collar rings on stem
    const collarTop = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.024, 24), brassGoldMat);
    collarTop.position.y = height - 0.035;
    table.add(collarTop);

    const basePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.58, radius * 0.62, 0.030, 36),
      brassGoldMat
    );
    basePlate.position.y = 0.015;
    basePlate.castShadow = true;
    table.add(basePlate);

    // Recessed floor shadow gap ring
    const shadowPlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.50, radius * 0.50, 0.012, 24),
      blackMat
    );
    shadowPlinth.position.y = 0.006;
    table.add(shadowPlinth);

    // 5. Luxury Hospitality Staging: Designer Tea Service, Amber Candle & Art Monograph
    // (Rendered on key hospitality tables like the Main Lobby)
    const isMainTeaTable = options.isTeaTable ?? false;
    if (isMainTeaTable) {
      const teaSet = new THREE.Group();
      teaSet.position.set(0, height + 0.021, 0);

      // A. Brushed Champagne Brass Serving Tray
      const tray = new THREE.Mesh(roundedBox(0.42, 0.016, 0.28, 0.02), brassGoldMat);
      tray.position.set(0.08, 0.008, 0.04);
      tray.rotation.y = 0.15;
      tray.castShadow = true;
      teaSet.add(tray);

      // Tray lip handles
      [-0.20, 0.20].forEach((hx) => {
        const handle = new THREE.Mesh(roundedBox(0.018, 0.024, 0.12, 0.008), brassGoldMat);
        handle.position.set(0.08 + hx * Math.cos(0.15), 0.022, 0.04 + hx * Math.sin(0.15));
        handle.rotation.y = 0.15;
        teaSet.add(handle);
      });

      // B. Modern Minimalist Porcelain Teapot
      const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.09, 18), porcelainMat);
      potBody.position.set(0.02, 0.06, 0.04);
      potBody.castShadow = true;
      teaSet.add(potBody);

      const potLid = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.052, 0.018, 18), porcelainMat);
      potLid.position.set(0.02, 0.11, 0.04);
      teaSet.add(potLid);

      const potKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.015, 12), brassGoldMat);
      potKnob.position.set(0.02, 0.125, 0.04);
      teaSet.add(potKnob);

      const potHandle = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.008, 8, 16, Math.PI), smokedWalnutMat);
      potHandle.position.set(0.02, 0.135, 0.04);
      potHandle.rotation.x = Math.PI / 2;
      teaSet.add(potHandle);

      // C. 2 Modern Ceramic Tea Cups with Saucers
      [[-0.08, 0.02], [-0.04, -0.07]].forEach(([cx, cz]) => {
        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.008, 16), porcelainMat);
        saucer.position.set(cx + 0.08, 0.02, cz + 0.04);
        teaSet.add(saucer);

        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.045, 16), porcelainMat);
        cup.position.set(cx + 0.08, 0.045, cz + 0.04);
        cup.castShadow = true;
        teaSet.add(cup);

        // Tea liquid surface
        const teaLiquid = new THREE.Mesh(new THREE.CircleGeometry(0.024, 16), new THREE.MeshBasicMaterial({ color: 0x92400e }));
        teaLiquid.rotation.x = -Math.PI / 2;
        teaLiquid.position.set(cx + 0.08, 0.062, cz + 0.04);
        teaSet.add(teaLiquid);
      });

      // D. Scented Fluted Amber Glass Candle with Warm Ambient Glow
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.065, 18), candleAmberMat);
      candle.position.set(-0.24, 0.035, -0.12);
      candle.castShadow = true;
      teaSet.add(candle);

      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfde047 }));
      flame.scale.set(1.0, 1.8, 1.0);
      flame.position.set(-0.24, 0.075, -0.12);
      teaSet.add(flame);

      const candleGlow = new THREE.PointLight(0xfbbf24, 0.45, 2.5);
      candleGlow.position.set(-0.24, 0.09, -0.12);
      teaSet.add(candleGlow);

      // E. Hardcover Luxury Art Monograph Book ("SPOT ARCHITECTURE & DESIGN")
      const book = new THREE.Mesh(roundedBox(0.24, 0.028, 0.18, 0.012), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 }));
      book.position.set(-0.16, 0.014, 0.16);
      book.rotation.y = -0.32;
      book.castShadow = true;
      teaSet.add(book);

      table.add(teaSet);
    }

    table.position.set(cx, 0, cz);
    furnitureGroup.add(table);
    return table;
  };

  // Helper: Luxury Marble & Champagne Brass Drink Table
  const createDrinkTable = (cx, cz) => {
    const table = new THREE.Group();

    // Polished Calacatta Gold marble top with beveled brass casing
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.032, 28), calacattaMarbleMat);
    top.position.y = 0.48;
    top.castShadow = true;
    table.add(top);

    const brassRim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.035, 28, 1, true), brassGoldMat);
    brassRim.position.y = 0.48;
    table.add(brassRim);

    // Slender brass stem with turned knurled collar
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.48, 14), brassGoldMat);
    leg.position.y = 0.24;
    table.add(leg);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.025, 16), brassGoldMat);
    collar.position.y = 0.38;
    table.add(collar);

    // Heavy stepped brass disc base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.22, 0.026, 28), brassGoldMat);
    base.position.y = 0.013;
    base.castShadow = true;
    table.add(base);

    table.position.set(cx, 0, cz);
    furnitureGroup.add(table);
    return table;
  };

  // Helper: Flower Vase with purple/lavender flower (media_1792165933956.png & media_1792165933914.png)
  const createFlowerVase = (cx, cy, cz) => {
    const vaseGrp = new THREE.Group();
    const vaseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.22, 16),
      whiteMat
    );
    vaseMesh.position.y = 0.11;
    vaseMesh.castShadow = true;
    vaseGrp.add(vaseMesh);

    // Green stem & lavender flower buds
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.28, 8),
      new THREE.MeshStandardMaterial({ color: 0x15803d })
    );
    stem.position.set(0, 0.25, 0);
    vaseGrp.add(stem);

    const bloom = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5 })
    );
    bloom.position.set(0, 0.38, 0);
    bloom.scale.set(1.0, 1.4, 1.0);
    vaseGrp.add(bloom);

    vaseGrp.position.set(cx, cy, cz);
    furnitureGroup.add(vaseGrp);
    return vaseGrp;
  };

  // Helper: Photorealistic Ficus Lyrata (Fiddle-Leaf Fig) Architectural Tree
  const createPottedPlant = (cx, cz, plantName = 'Ficus Lyrata Plant') => {
    const plant = new THREE.Group();

    // 1. Recessed Champagne Brass Plinth Reveal Ring
    const brassReveal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.035, 24),
      brassGoldMat
    );
    brassReveal.position.y = 0.0175;
    plant.add(brassReveal);

    // 2. Architectural Fluted Matte White Ceramic Cylinder Pot (openEnded to eliminate coplanar top face)
    const potMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.38,
      metalness: 0.05
    });
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.26, 0.56, 28, 1, true),
      potMat
    );
    pot.position.y = 0.30;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plant.add(pot);

    // Pot base plate
    const potBase = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), potMat);
    potBase.rotation.x = Math.PI / 2;
    potBase.position.y = 0.025;
    plant.add(potBase);

    // 3. Polished Champagne Brass Top Rim Collar
    const brassRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.018, 12, 28),
      brassGoldMat
    );
    brassRim.rotation.x = Math.PI / 2;
    brassRim.position.y = 0.58;
    plant.add(brassRim);

    // 4. Dark Organic Potting Soil Bed with Micro-Mulch Top Layer (recessed below rim)
    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.30, 0.30, 0.06, 24),
      new THREE.MeshStandardMaterial({
        color: 0x221811,
        roughness: 0.95,
        metalness: 0.0
      })
    );
    soil.position.y = 0.52;
    plant.add(soil);

    // 5. Natural Branching Stems & Woody Trunks
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x423223,
      roughness: 0.88,
      metalness: 0.04
    });

    // Central primary trunk
    const mainTrunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.038, 1.48, 10),
      stemMat
    );
    mainTrunk.position.set(0.01, 1.25, -0.01);
    mainTrunk.rotation.z = -0.025;
    mainTrunk.castShadow = true;
    plant.add(mainTrunk);

    // Branch bough 1 (left lateral)
    const branch1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.022, 0.65, 8),
      stemMat
    );
    branch1.position.set(-0.08, 1.28, 0.04);
    branch1.rotation.set(-0.15, 0.2, 0.32);
    branch1.castShadow = true;
    plant.add(branch1);

    // Branch bough 2 (right lateral)
    const branch2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.022, 0.58, 8),
      stemMat
    );
    branch2.position.set(0.07, 1.38, -0.03);
    branch2.rotation.set(0.18, -0.25, -0.30);
    branch2.castShadow = true;
    plant.add(branch2);

    // 6. Sculpted Fiddle-Leaf Fig Leaf Blades with Curvature & Vein Texture
    const ficusMat = new THREE.MeshStandardMaterial({
      map: ficusLeafTex,
      roughness: 0.28,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Function to build a custom curved 3D fiddle-leaf geometry
    const createCurvedLeafGeometry = (width, height) => {
      const geom = new THREE.PlaneGeometry(width, height, 6, 8);
      const pos = geom.attributes.position;
      const hw = width / 2;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Normalized coordinate along length (-0.5 at base to +0.5 at tip)
        const ny = y / height;
        // Fiddle violin shape: taper base, flare mid, slight waist, wide obovate tip
        const taper = 0.55 + 0.65 * Math.sin((ny + 0.5) * Math.PI);
        pos.setX(i, x * taper);
        // Transverse concave bowl curvature (cupped leaf blade)
        const nx = x / hw;
        const cup = (1.0 - nx * nx) * 0.032;
        // Longitudinal arch bend
        const arch = Math.sin((ny + 0.5) * Math.PI) * 0.045;
        pos.setZ(i, cup - arch);
      }
      geom.computeVertexNormals();
      return geom;
    };

    const leafConfigs = [
      { y: 0.92, rad: 0.22, angle: 0.35, pitch: 0.58, roll: 0.12, w: 0.32, h: 0.48 },
      { y: 1.06, rad: 0.25, angle: 2.15, pitch: 0.52, roll: -0.15, w: 0.35, h: 0.52 },
      { y: 1.20, rad: 0.27, angle: 4.25, pitch: 0.46, roll: 0.18, w: 0.38, h: 0.56 },
      { y: 1.28, rad: 0.26, angle: 5.85, pitch: 0.42, roll: -0.22, w: 0.36, h: 0.54 },
      { y: 1.38, rad: 0.28, angle: 1.25, pitch: 0.38, roll: -0.10, w: 0.40, h: 0.60 },
      { y: 1.48, rad: 0.27, angle: 2.50, pitch: 0.35, roll: 0.18, w: 0.40, h: 0.60 },
      { y: 1.58, rad: 0.26, angle: 3.40, pitch: 0.32, roll: 0.14, w: 0.38, h: 0.58 },
      { y: 1.68, rad: 0.24, angle: 5.20, pitch: 0.28, roll: -0.12, w: 0.36, h: 0.54 },
      { y: 1.78, rad: 0.21, angle: 0.85, pitch: 0.24, roll: 0.08, w: 0.34, h: 0.50 },
      { y: 1.88, rad: 0.18, angle: 2.80, pitch: 0.20, roll: -0.14, w: 0.32, h: 0.48 },
      { y: 1.96, rad: 0.14, angle: 4.60, pitch: 0.16, roll: 0.10, w: 0.30, h: 0.44 },
      { y: 2.05, rad: 0.10, angle: 1.60, pitch: 0.12, roll: -0.06, w: 0.28, h: 0.40 },
      { y: 2.12, rad: 0.06, angle: 3.75, pitch: 0.08, roll: 0.04, w: 0.26, h: 0.38 },
      { y: 2.18, rad: 0.02, angle: 0.00, pitch: 0.04, roll: 0.00, w: 0.24, h: 0.34 }
    ];

    leafConfigs.forEach((cfg) => {
      const leafMesh = new THREE.Mesh(createCurvedLeafGeometry(cfg.w, cfg.h), ficusMat);

      // Position leaf along radial offset from stem
      const lx = Math.cos(cfg.angle) * cfg.rad;
      const lz = Math.sin(cfg.angle) * cfg.rad;
      leafMesh.position.set(lx, cfg.y, lz);

      // Orient leaf pointing outwards and slightly drooping
      leafMesh.rotation.y = -cfg.angle + Math.PI / 2;
      leafMesh.rotation.x = cfg.pitch;
      leafMesh.rotation.z = cfg.roll;
      leafMesh.castShadow = true;
      plant.add(leafMesh);

      // Short leaf petiole connector to trunk
      const petiole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.009, cfg.rad * 0.95, 6),
        stemMat
      );
      petiole.position.set(lx * 0.48, cfg.y - 0.02, lz * 0.48);
      petiole.rotation.y = -cfg.angle + Math.PI / 2;
      petiole.rotation.z = Math.PI / 2 - cfg.pitch * 0.5;
      plant.add(petiole);
    });

    plant.position.set(cx, 0, cz);
    furnitureGroup.add(plant);
    return plant;
  };

  // Helper: Luxury Curved Pillowy Ivory Bouclé Sectional Sofa (Meeting Cabin)
  const createCreamCurvedSofa = (cx, cz, crot, sofaName = 'Meeting Cabin Curved Sofa') => {
    const sofa = new THREE.Group();
    const defaultCenterPos = new THREE.Vector3(
      cx + 0.12 * Math.sin(crot),
      0,
      cz + 0.12 * Math.cos(crot)
    );
    sofa.name = 'clickable_chair';
    sofa.userData = { isChair: true, name: sofaName, chairPos: defaultCenterPos, chairRotY: crot, seatHeight: 0.46 };

    // 1. Recessed Champagne Brass Plinth Reveal Ring
    const brassReveal = new THREE.Mesh(roundedBox(2.72, 0.04, 0.98, 0.08), brassGoldMat);
    brassReveal.position.y = 0.02;
    sofa.add(brassReveal);

    // 2. Rounded Tubular Base in Cream Bouclé
    const base = new THREE.Mesh(roundedBox(2.80, 0.20, 1.05, 0.10), tubArmchairMat);
    base.position.y = 0.17;
    base.castShadow = true;
    sofa.add(base);

    // 3. Pillowy Curved Continuous Seat Cushion with Welt Piping
    const cushion = new THREE.Mesh(roundedBox(2.62, 0.22, 0.92, 0.12), tubArmchairMat);
    cushion.position.set(0, 0.35, 0.06);
    cushion.castShadow = true;
    cushion.name = 'clickable_chair';
    cushion.userData = sofa.userData;
    sofa.add(cushion);

    const welt = new THREE.Mesh(roundedBox(2.64, 0.024, 0.935, 0.015), tubArmchairMat);
    welt.position.set(0, 0.45, 0.06);
    sofa.add(welt);

    // 4. Vertical Channel-Tufted Fluted Backrest
    const back = new THREE.Mesh(roundedBox(2.70, 0.48, 0.30, 0.14), tubArmchairMat);
    back.position.set(0, 0.58, -0.36);
    back.castShadow = true;
    back.name = 'clickable_chair';
    back.userData = sofa.userData;
    sofa.add(back);

    [-0.9, -0.45, 0, 0.45, 0.9].forEach((fx) => {
      const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 12), tubArmchairMat);
      flute.position.set(fx, 0.60, -0.22);
      sofa.add(flute);
    });

    // 5. Designer Velvet Throw Pillows
    const pillowL = new THREE.Mesh(roundedBox(0.36, 0.36, 0.14, 0.04), velvetEmeraldMat);
    pillowL.position.set(-0.85, 0.52, -0.05);
    pillowL.rotation.set(0.12, 0.25, 0.18);
    pillowL.castShadow = true;
    sofa.add(pillowL);

    const pillowR = new THREE.Mesh(roundedBox(0.32, 0.32, 0.12, 0.04), velvetOchreMat);
    pillowR.position.set(0.85, 0.52, -0.05);
    pillowR.rotation.set(0.12, -0.25, -0.18);
    pillowR.castShadow = true;
    sofa.add(pillowR);

    sofa.position.set(cx, 0, cz);
    sofa.rotation.y = crot;
    furnitureGroup.add(sofa);

    if (chairsRef?.current) {
      chairsRef.current.push({
        name: sofaName,
        pos: defaultCenterPos,
        rot: crot,
        seatHeight: 0.46
      });
    }
    return sofa;
  };

  // Helper: Luxury Cream Bouclé Bench Armchair with Brass Reveal Feet
  const createBenchArmchair = (cx, cz, crot, chairName = 'Lounge Bench Armchair') => {
    const chair = new THREE.Group();
    const benchPos = new THREE.Vector3(cx, 0, cz);
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos: benchPos, chairRotY: crot, seatHeight: 0.44 };

    // Floating brass reveal feet
    [-0.52, 0.52].forEach((fx) => {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.64), brassGoldMat);
      foot.position.set(fx, 0.0175, 0);
      foot.castShadow = true;
      chair.add(foot);
    });

    // Dark base frame
    const base = new THREE.Mesh(roundedBox(1.30, 0.12, 0.72, 0.04), blackMat);
    base.position.y = 0.12;
    chair.add(base);

    // Thick ribbed cream bouclé seat cushion
    const cushion = new THREE.Mesh(roundedBox(1.24, 0.22, 0.68, 0.08), tubArmchairMat);
    cushion.position.y = 0.30;
    cushion.castShadow = true;
    cushion.name = 'clickable_chair';
    cushion.userData = chair.userData;
    chair.add(cushion);

    const welt = new THREE.Mesh(roundedBox(1.255, 0.02, 0.695, 0.01), tubArmchairMat);
    welt.position.y = 0.39;
    chair.add(welt);

    // Low contour backrest
    const back = new THREE.Mesh(roundedBox(1.24, 0.26, 0.16, 0.06), tubArmchairMat);
    back.position.set(0, 0.44, -0.26);
    back.castShadow = true;
    back.name = 'clickable_chair';
    back.userData = chair.userData;
    chair.add(back);

    chair.position.set(cx, 0, cz);
    chair.rotation.y = crot;
    furnitureGroup.add(chair);

    if (chairsRef?.current) {
      chairsRef.current.push({ name: chairName, pos: benchPos, rot: crot, seatHeight: 0.44 });
    }
    return chair;
  };

  // Helper: Luxury Curved Black Armchair with Beveled Brass Swivel Base
  const createWindowArmchair = (cx, cz, crot, chairName = 'Window Armchair') => {
    const chair = new THREE.Group();
    const chairPos = new THREE.Vector3(cx, 0, cz);
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos, chairRotY: crot, seatHeight: 0.46 };

    // 1. Heavy Stepped Champagne Brass Swivel Plinth
    const goldRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.45, 0.045, 32),
      brassGoldMat
    );
    goldRing.position.y = 0.0225;
    goldRing.castShadow = true;
    chair.add(goldRing);

    const shadowRing = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.015, 24), blackMat);
    shadowRing.position.y = 0.0075;
    chair.add(shadowRing);

    // 2. Sculptural Wrap-around Shell in Italian Nero Leather
    const body = new THREE.Mesh(
      roundedBox(0.84, 0.54, 0.82, 0.14),
      blackLeatherMat
    );
    body.position.y = 0.38;
    body.castShadow = true;
    body.name = 'clickable_chair';
    body.userData = chair.userData;
    chair.add(body);

    // Vertical Champagne Brass Spine Detail running up rear
    const spine = new THREE.Mesh(roundedBox(0.04, 0.42, 0.025, 0.01), brassGoldMat);
    spine.position.set(0, 0.42, -0.40);
    chair.add(spine);

    // 3. Deep Tufted Seat Cushion
    const cushion = new THREE.Mesh(
      roundedBox(0.66, 0.14, 0.62, 0.06),
      blackLeatherMat
    );
    cushion.position.set(0, 0.42, 0.06);
    cushion.castShadow = true;
    cushion.name = 'clickable_chair';
    cushion.userData = chair.userData;
    chair.add(cushion);

    const welt = new THREE.Mesh(roundedBox(0.675, 0.02, 0.635, 0.01), blackLeatherMat);
    welt.position.set(0, 0.48, 0.06);
    chair.add(welt);

    chair.position.set(cx, 0, cz);
    chair.rotation.y = crot;
    furnitureGroup.add(chair);

    if (chairsRef?.current) {
      chairsRef.current.push({ name: chairName, pos: chairPos, rot: crot, seatHeight: 0.46 });
    }
    return chair;
  };

  // =========================================================================
  // 1. BOARDROOM (Northwest: X: -32 to -14, Z: -24 to -8)
  // Exact match to media_1792165933867.png (top-left) & media_1792165933406.png
  // =========================================================================
  // West wall starry Spot screen
  createSpotWallScreen(
    -31.7, 1.55, -16.0, 3.8, 2.1, Math.PI / 2, 'boardroom',
    screenTextures?.starryLogoTexture,
    'Boardroom Presentation Screen'
  );

  // Luxury Architectural Boardroom Conference Table (8.0m long x 1.8m wide)
  // 1. Primary tabletop slab in book-matched smoked architectural walnut
  const boardTableTop = new THREE.Mesh(roundedBox(8.0, 0.07, 1.8, 0.04), smokedWalnutMat);
  boardTableTop.position.set(-23.0, 0.745, -16.0);
  boardTableTop.castShadow = true;
  furnitureGroup.add(boardTableTop);

  // 2. Continuous beveled champagne brass perimeter edge bezel
  const boardTableBezel = new THREE.Mesh(roundedBox(8.04, 0.074, 1.84, 0.04), brassGoldMat);
  boardTableBezel.position.set(-23.0, 0.743, -16.0);
  furnitureGroup.add(boardTableBezel);

  // 3. Recessed dark floating shadow gap sub-frame
  const boardTableSubframe = new THREE.Mesh(roundedBox(7.82, 0.03, 1.62, 0.03), blackMat);
  boardTableSubframe.position.set(-23.0, 0.70, -16.0);
  furnitureGroup.add(boardTableSubframe);

  // 4. Integrated center brushed brass power & AV connectivity trough (4.2m long)
  const boardTroughHousing = new THREE.Mesh(roundedBox(4.2, 0.012, 0.28, 0.015), brassGoldMat);
  boardTroughHousing.position.set(-23.0, 0.782, -16.0);
  furnitureGroup.add(boardTroughHousing);

  [-1.05, 1.05].forEach((tx) => {
    const lid = new THREE.Mesh(roundedBox(2.02, 0.008, 0.23, 0.01), brassGoldMat);
    lid.position.set(-23.0 + tx, 0.784, -16.0);
    furnitureGroup.add(lid);
  });

  // 5. Heavy Architectural Trestle Plinth Pedestals with champagne brass collars
  [-2.6, 0, 2.6].forEach((px) => {
    // Walnut columnar body
    const legBody = new THREE.Mesh(roundedBox(0.24, 0.64, 1.12, 0.04), smokedWalnutMat);
    legBody.position.set(-23.0 + px, 0.35, -16.0);
    legBody.castShadow = true;
    furnitureGroup.add(legBody);

    // Top brass collar
    const legTopCollar = new THREE.Mesh(roundedBox(0.26, 0.035, 1.16, 0.02), brassGoldMat);
    legTopCollar.position.set(-23.0 + px, 0.68, -16.0);
    furnitureGroup.add(legTopCollar);

    // Bottom floor brass shoe plinth
    const legBaseShoe = new THREE.Mesh(roundedBox(0.28, 0.03, 1.18, 0.02), brassGoldMat);
    legBaseShoe.position.set(-23.0 + px, 0.015, -16.0);
    legBaseShoe.castShadow = true;
    furnitureGroup.add(legBaseShoe);
  });

  // 6. Executive Boardroom Centerpiece: Brushed brass tray with smoked glass carafes
  const carafeTray = new THREE.Mesh(roundedBox(1.1, 0.014, 0.22, 0.01), brassGoldMat);
  carafeTray.position.set(-23.0, 0.788, -16.0);
  carafeTray.castShadow = true;
  furnitureGroup.add(carafeTray);

  [-0.30, 0.30].forEach((cx) => {
    const carafe = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.16, 16), smokedGlassMat);
    carafe.position.set(-23.0 + cx, 0.875, -16.0);
    carafe.castShadow = true;
    furnitureGroup.add(carafe);

    const carafeCap = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 12), smokedWalnutMat);
    carafeCap.position.set(-23.0 + cx, 0.965, -16.0);
    furnitureGroup.add(carafeCap);
  });

  // 7. Executive Leather Desk Blotters for all 12 seating positions
  [-3.0, -1.8, -0.6, 0.6, 1.8, 3.0].forEach((bx) => {
    // North seat blotter
    const northBlotter = new THREE.Mesh(roundedBox(0.56, 0.005, 0.38, 0.01), blackLeatherMat);
    northBlotter.position.set(-23.0 + bx, 0.782, -16.58);
    furnitureGroup.add(northBlotter);

    // South seat blotter
    const southBlotter = new THREE.Mesh(roundedBox(0.56, 0.005, 0.38, 0.01), blackLeatherMat);
    southBlotter.position.set(-23.0 + bx, 0.782, -15.42);
    furnitureGroup.add(southBlotter);
  });

  // 12 White Cantilever Chairs (6 north, 6 south) matching media_1792165933867.png
  [-3.0, -1.8, -0.6, 0.6, 1.8, 3.0].forEach((cx, idx) => {
    createCantileverChair(-23.0 + cx, -17.2, 0, `Boardroom North Chair ${idx + 1}`);
    createCantileverChair(-23.0 + cx, -14.8, Math.PI, `Boardroom South Chair ${idx + 1}`);
  });

  // Register Boardroom Table collision obstacle
  registerObstacle(-23.0, -16.0, 4.3, 1.2, 'Boardroom Conference Table');

  // Potted ficus tree in corner
  createPottedPlant(-30.5, -9.5, 'Boardroom Ficus');

  // =========================================================================
  // 2. MEETING CABIN / PRIVATE LOUNGE (North-Center: X: -14 to +6, Z: -24 to -8)
  // Exact match to media_1792165933956.png
  // =========================================================================
  // Starry Spot screen mounted on dividing wall
  createSpotWallScreen(
    -13.8, 1.55, -16.0, 3.2, 1.8, Math.PI / 2, 'conference_b',
    screenTextures?.starryLogoTexture,
    'Meeting Cabin Presentation Screen'
  );

  // Two facing cream curved sofas
  createCreamCurvedSofa(-4.0, -18.2, 0, 'Meeting Cabin North Sofa');
  createCreamCurvedSofa(-4.0, -13.8, Math.PI, 'Meeting Cabin South Sofa');

  // Round black coffee table with lavender flower vase
  createRoundCoffeeTable(-4.0, -16.0, 0.55, 0.38);
  createFlowerVase(-4.0, 0.38, -16.0);

  // Register Meeting Cabin Lounge Set collision obstacle
  registerObstacle(-4.0, -16.0, 1.8, 2.5, 'Meeting Cabin Lounge Set');

  // Gold side table with dome lamp next to north sofa
  createDrinkTable(-1.6, -18.2);
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.22, 16), brassGoldMat);
  lampBase.position.set(-1.6, 0.59, -18.2);
  furnitureGroup.add(lampBase);
  const lampDome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), whiteMat);
  lampDome.position.set(-1.6, 0.70, -18.2);
  furnitureGroup.add(lampDome);

  // Potted ficus plant (positioned in southwest corner at Z = -21.5, well clear of the screen face at Z = -16.0)
  createPottedPlant(-12.8, -21.5, 'Meeting Cabin Plant');

  // =========================================================================
  // 3. AUDITORIUM OPEN ATRIUM (East: X: +6 to +32, Z: -24 to +4)
  // Exact match to media_1792165933867.png & media_1792165933914.png
  // =========================================================================
  // Dark vertical slatted backdrop structure framing the cinema screen on the East Wall
  const slattedBackdrop = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 9.2, 17.0),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 })
  );
  slattedBackdrop.position.set(31.85, 4.6, -10.0);
  slattedBackdrop.receiveShadow = true;
  furnitureGroup.add(slattedBackdrop);

  // Massive 14m x 7.2m Cinema Presentation Screen facing West
  createSpotWallScreen(
    31.65, 4.4, -10.0, 14.0, 7.2, -Math.PI / 2, 'auditorium',
    screenTextures?.createAuditoriumKeynoteTexture ? screenTextures.createAuditoriumKeynoteTexture() : screenTextures?.starryLogoTexture,
    'Auditorium Cinema Keynote Display'
  );

  // Elevated White Stage Platform in front of screen
  const audStage = new THREE.Mesh(
    roundedBox(3.6, 0.25, 15.4, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 })
  );
  audStage.position.set(29.6, 0.125, -10.0);
  audStage.receiveShadow = true;
  furnitureGroup.add(audStage);
  registerObstacle(29.6, -10.0, 1.9, 7.8, 'Auditorium Main Stage');

  // Sleek Black Speaker Podium / Lectern on stage
  const audPodium = new THREE.Mesh(
    roundedBox(0.65, 1.1, 0.55, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
  );
  audPodium.position.set(27.4, 0.70, -10.0);
  audPodium.rotation.y = -Math.PI / 2;
  audPodium.castShadow = true;
  furnitureGroup.add(audPodium);

  // 5 Stepped Stadium Seating Tiers facing East towards the cinema screen (50 Luxury Cinema Seats)
  const audTiers = [
    { x: 23.5, y: 0.00, riserH: 0.00 },
    { x: 20.5, y: 0.28, riserH: 0.28 },
    { x: 17.5, y: 0.56, riserH: 0.56 },
    { x: 14.5, y: 0.84, riserH: 0.84 },
    { x: 11.5, y: 1.12, riserH: 1.12 }
  ];

  audTiers.forEach((tier, tIdx) => {
    // Stepped concrete/carpet riser floor
    if (tier.riserH > 0) {
      const riserStep = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, tier.riserH, 14.6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
      );
      riserStep.position.set(tier.x, tier.riserH / 2, -10.0);
      riserStep.receiveShadow = true;
      furnitureGroup.add(riserStep);
    }

    // Long dark charcoal stadium bench
    const bench = new THREE.Mesh(
      roundedBox(0.85, 0.22, 14.0, 0.06),
      blackLeatherMat
    );
    bench.position.set(tier.x, tier.y + 0.34, -10.0);
    bench.castShadow = true;
    bench.name = 'clickable_chair';
    bench.userData = {
      isChair: true,
      name: `Auditorium Tier ${tIdx + 1} Bench`,
      chairPos: new THREE.Vector3(tier.x, tier.y, -10.0),
      chairRotY: Math.PI / 2,
      seatHeight: tier.y + 0.46
    };
    furnitureGroup.add(bench);

    // 10 Individually clickable seat cushions along each bench (50 seats total)
    for (let s = 0; s < 10; s++) {
      const sz = -16.0 + s * 1.33;
      const seatWorldPos = new THREE.Vector3(tier.x, tier.y, sz);
      const facingEastRot = Math.PI / 2; // Facing East towards the big cinema screen

      const cushion = new THREE.Mesh(roundedBox(0.72, 0.08, 1.15, 0.04), blackMat);
      cushion.position.set(tier.x, tier.y + 0.47, sz);
      cushion.castShadow = true;
      cushion.name = 'clickable_chair';
      cushion.userData = {
        isChair: true,
        name: `Auditorium Tier ${tIdx + 1} Seat ${s + 1}`,
        chairPos: seatWorldPos,
        chairRotY: facingEastRot,
        seatHeight: tier.y + 0.46
      };
      furnitureGroup.add(cushion);

      if (chairsRef?.current) {
        chairsRef.current.push({
          name: `Auditorium Tier ${tIdx + 1} Seat ${s + 1}`,
          pos: seatWorldPos,
          rot: facingEastRot,
          seatHeight: tier.y + 0.46
        });
      }
    }
  });

  // =========================================================================
  // 4. CENTRAL CONCOURSE / LOUNGE C (X = -32 to +14, Z = -8 to +8)
  // Exact match to media_1792165947435.png & media_1792165933956.png
  // =========================================================================
  // The iconic Spot 3-Disc Overlapping Circular Coffee Table Cluster (media_1792165947435.png)
  const create3DiscCoffeeCluster = (cx, cz) => {
    const cluster = new THREE.Group();

    // Disc 1: Center disc (highest) - Polished Nero Marquina black marble with champagne brass bezel
    const d1 = new THREE.Mesh(new THREE.CylinderGeometry(0.70, 0.70, 0.045, 32), neroMarbleMat);
    d1.position.set(0, 0.42, 0);
    d1.castShadow = true;
    cluster.add(d1);
    const d1Bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.708, 0.708, 0.048, 32, 1, true), brassGoldMat);
    d1Bezel.position.set(0, 0.42, 0);
    cluster.add(d1Bezel);

    const stem1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.40, 24), brassGoldMat);
    stem1.position.set(0, 0.20, 0);
    cluster.add(stem1);
    const collar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.025, 24), brassGoldMat);
    collar1.position.set(0, 0.38, 0);
    cluster.add(collar1);
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.025, 24), brassGoldMat);
    base1.position.set(0, 0.015, 0);
    cluster.add(base1);

    // Disc 2: Overlapping disc 2 (left/south) - Smoked architectural walnut with champagne brass rim
    const d2 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.045, 32), smokedWalnutMat);
    d2.position.set(-0.85, 0.36, 0.45);
    d2.castShadow = true;
    cluster.add(d2);
    const d2Bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.658, 0.658, 0.048, 32, 1, true), brassGoldMat);
    d2Bezel.position.set(-0.85, 0.36, 0.45);
    cluster.add(d2Bezel);

    const stem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.34, 24), brassGoldMat);
    stem2.position.set(-0.85, 0.17, 0.45);
    cluster.add(stem2);
    const collar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.025, 24), brassGoldMat);
    collar2.position.set(-0.85, 0.32, 0.45);
    cluster.add(collar2);
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.40, 0.025, 24), brassGoldMat);
    base2.position.set(-0.85, 0.015, 0.45);
    cluster.add(base2);

    // Disc 3: Overlapping disc 3 (right/south) - Polished Calacatta Gold white marble with champagne brass rim
    const d3 = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.60, 0.045, 32), calacattaMarbleMat);
    d3.position.set(0.80, 0.38, 0.40);
    d3.castShadow = true;
    cluster.add(d3);
    const d3Bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.608, 0.608, 0.048, 32, 1, true), brassGoldMat);
    d3Bezel.position.set(0.80, 0.38, 0.40);
    cluster.add(d3Bezel);

    const stem3 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.36, 24), brassGoldMat);
    stem3.position.set(0.80, 0.18, 0.40);
    cluster.add(stem3);
    const collar3 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.025, 24), brassGoldMat);
    collar3.position.set(0.80, 0.34, 0.40);
    cluster.add(collar3);
    const base3 = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.025, 24), brassGoldMat);
    base3.position.set(0.80, 0.015, 0.40);
    cluster.add(base3);

    // Staging: Stacked architectural design monographs on Disc 3
    const book1 = new THREE.Mesh(roundedBox(0.24, 0.022, 0.18, 0.01), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 }));
    book1.position.set(0.80, 0.413, 0.40);
    book1.rotation.y = 0.25;
    book1.castShadow = true;
    cluster.add(book1);

    const book2 = new THREE.Mesh(roundedBox(0.22, 0.020, 0.16, 0.01), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 }));
    book2.position.set(0.80, 0.434, 0.40);
    book2.rotation.y = -0.12;
    book2.castShadow = true;
    cluster.add(book2);

    cluster.position.set(cx, 0, cz);
    furnitureGroup.add(cluster);

    // Elegant fluted ceramic vase with lavender orchids on center marble disc
    createFlowerVase(cx, 0.42, cz);
  };

  create3DiscCoffeeCluster(-10.0, 4.0);

  // Seating surrounding the 3-disc coffee cluster (media_1792165947435.png)
  createBlackSofa(-14.2, 4.0, Math.PI / 2, 'Lounge C West Sofa');
  createBlackSofa(-5.8, 4.0, -Math.PI / 2, 'Lounge C East Sofa');

  // North bench armchairs with gold drink table
  createBenchArmchair(-11.6, 1.4, 0, 'Lounge C North Bench 1');
  createBenchArmchair(-8.4, 1.4, 0, 'Lounge C North Bench 2');
  createDrinkTable(-10.0, 1.4);

  // South bench armchairs with gold drink table
  createBenchArmchair(-11.6, 6.6, Math.PI, 'Lounge C South Bench 1');
  createBenchArmchair(-8.4, 6.6, Math.PI, 'Lounge C South Bench 2');
  createDrinkTable(-10.0, 6.6);

  // Potted plant next to west sofa (media_1792165947435.png)
  createPottedPlant(-14.2, 2.0, 'Lounge C Ficus');

  // Credenza & Refreshment Station (media_1792165933956.png lower-left & media_1792165933867.png)
  const credenzaMat = new THREE.MeshStandardMaterial({ color: 0x134e4a, roughness: 0.6 }); // Teal/green body
  const credenzaTopMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }); // Dark top
  const credenza = new THREE.Mesh(roundedBox(2.8, 0.85, 0.72, 0.04), credenzaMat);
  credenza.position.set(-21.0, 0.42, 0.0);
  credenza.castShadow = true;
  furnitureGroup.add(credenza);

  const credTop = new THREE.Mesh(roundedBox(2.88, 0.06, 0.76, 0.02), credenzaTopMat);
  credTop.position.set(-21.0, 0.86, 0.0);
  furnitureGroup.add(credTop);
  createFlowerVase(-21.0, 0.88, 0.0);

  // Refreshment credenza with blue water dispenser jug (media_1792165933867.png)
  const refCred = new THREE.Mesh(roundedBox(2.4, 0.85, 0.72, 0.04), woodDeskMat);
  refCred.position.set(-26.0, 0.42, -4.0);
  furnitureGroup.add(refCred);

  // Water cooler dispenser
  const coolerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 16), whiteMat);
  coolerBase.position.set(-26.4, 1.02, -4.0);
  furnitureGroup.add(coolerBase);

  const waterBottle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.45, 16),
    new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, roughness: 0.1 })
  );
  waterBottle.position.set(-26.4, 1.40, -4.0);
  furnitureGroup.add(waterBottle);

  // Coffee machine
  const coffeeMachine = new THREE.Mesh(
    roundedBox(0.40, 0.38, 0.35, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 })
  );
  coffeeMachine.position.set(-25.6, 1.04, -4.0);
  furnitureGroup.add(coffeeMachine);

  // Cocktail table with two white curved armchairs outside Cabin door (media_1792165933956.png)
  createRoundCoffeeTable(-4.0, 2.0, 0.65, 0.45);
  createFlowerVase(-4.0, 0.45, 2.0);
  createTubArmchair(-5.4, 2.0, Math.PI / 2, 'Lounge C Tub Chair 1');
  createTubArmchair(-2.6, 2.0, -Math.PI / 2, 'Lounge C Tub Chair 2');

  // =========================================================================
  // 4b. MAIN LOBBY & RECEPTION WAITING LOUNGE (X = 0, Z = -43.8)
  // Matching media_1792293223270.png and media_1792293223278.png:
  // Sleek black 3-seater sofa with cream arms, potted plant to the left,
  // round coffee table, and facing the panoramic glass window overlooking Seattle city skyline.
  // =========================================================================
  createBlackSofa(0, -43.8, 0, 'Lobby Black Sofa');
  createRoundCoffeeTable(0, -41.2, 0.75, 0.45, { isTeaTable: true });
  createPottedPlant(-2.4, -43.5, 'Lobby Ficus Plant');
  createWindowArmchair(2.8, -41.2, -Math.PI / 2, 'Lobby Guest Armchair');

  // =========================================================================
  // 5. EAST PROMENADE WINDOW SEATING (X = +22 to +32, Z = +6 to +24)
  // Exact match to media_1792165933867.png & media_1792165933914.png
  // Pairs of curved black armchairs with cocktail tables looking out at Seattle
  // =========================================================================
  // Moved to Z >= 13.0 so chairs never clip into the pool wall at Z = 8.0 (fixes media_1792311429902.png)
  [13.0, 18.0, 23.0, 28.0, 33.0].forEach((wz, idx) => {
    // Round cocktail table
    createRoundCoffeeTable(29.4, wz, 0.52, 0.46);
    createFlowerVase(29.4, 0.46, wz);

    // North facing armchair
    createWindowArmchair(29.4, wz - 1.25, 0, `Window Promenade Set ${idx + 1} North Chair`);
    // South facing armchair
    createWindowArmchair(29.4, wz + 1.25, Math.PI, `Window Promenade Set ${idx + 1} South Chair`);
  });

  // =========================================================================
  // 6. SOUTH WING: COLLABORATIVE BREAKOUT SUITES 1 & 2, WORKSPACE A & PATIO
  // =========================================================================

  // --- COLLABORATIVE BREAKOUT SUITE 1 (North Suite: X: -26 to -14, Z: 8 to 14) ---
  // Executive meeting table for 4 to 6 people + 4K Presentation Wall Screen
  const suite1Table = new THREE.Mesh(roundedBox(3.2, 0.07, 1.4, 0.04), smokedWalnutMat);
  suite1Table.position.set(-20.0, 0.74, 11.0);
  suite1Table.castShadow = true;
  furnitureGroup.add(suite1Table);

  const suite1Bezel = new THREE.Mesh(roundedBox(3.24, 0.074, 1.44, 0.04), brassGoldMat);
  suite1Bezel.position.set(-20.0, 0.738, 11.0);
  furnitureGroup.add(suite1Bezel);

  // Twin walnut pedestals with brass shoes
  [-0.9, 0.9].forEach((px) => {
    const plinth = new THREE.Mesh(roundedBox(0.22, 0.65, 0.85, 0.03), smokedWalnutMat);
    plinth.position.set(-20.0 + px, 0.35, 11.0);
    plinth.castShadow = true;
    furnitureGroup.add(plinth);

    const shoe = new THREE.Mesh(roundedBox(0.24, 0.025, 0.88, 0.02), brassGoldMat);
    shoe.position.set(-20.0 + px, 0.012, 11.0);
    furnitureGroup.add(shoe);
  });

  // 4 Cantilever Chairs (2 North facing South, 2 South facing North)
  createCantileverChair(-20.8, 9.8, 0, 'Collaborative Suite 1 North Chair 1');
  createCantileverChair(-19.2, 9.8, 0, 'Collaborative Suite 1 North Chair 2');
  createCantileverChair(-20.8, 12.2, Math.PI, 'Collaborative Suite 1 South Chair 1');
  createCantileverChair(-19.2, 12.2, Math.PI, 'Collaborative Suite 1 South Chair 2');

  // Big 4K Ultra-HD Wall Screen mounted flush on West wall (X = -25.82)
  createSpotWallScreen(
    -25.82, 1.70, 11.0, 4.0, 2.2, Math.PI / 2, 'suite_1_screen',
    screenTextures?.createCodeEditorTexture ? screenTextures.createCodeEditorTexture('SuiteArchitecture.ts') : screenTextures?.starryLogoTexture,
    'Collaborative Suite 1 4K Presentation Screen'
  );
  registerObstacle(-20.0, 11.0, 1.8, 0.9, 'Suite 1 Meeting Table');

  // --- COLLABORATIVE BREAKOUT SUITE 2 (South Suite: X: -26 to -14, Z: 14 to 20) ---
  // Luxury creative lounge suite: Curved cream bouclé sofa + 2 tub armchairs + marble table + 4K Screen
  createCreamCurvedSofa(-20.0, 18.2, Math.PI, 'Collaborative Suite 2 Curved Sofa');
  createTubArmchair(-22.2, 16.5, Math.PI / 2, 'Collaborative Suite 2 West Tub Chair');
  createTubArmchair(-17.8, 16.5, -Math.PI / 2, 'Collaborative Suite 2 East Tub Chair');
  createRoundCoffeeTable(-20.0, 16.5, 0.65, 0.42, { isTeaTable: true });
  createFlowerVase(-20.0, 0.42, 16.5);

  // Big 4K Ultra-HD Wall Screen mounted flush on West wall (X = -25.82)
  createSpotWallScreen(
    -25.82, 1.70, 17.0, 4.0, 2.2, Math.PI / 2, 'suite_2_screen',
    screenTextures?.createDesignCanvasTexture ? screenTextures.createDesignCanvasTexture() : screenTextures?.chartTexture,
    'Collaborative Suite 2 4K Creative Screen'
  );
  registerObstacle(-20.0, 17.2, 2.0, 1.8, 'Suite 2 Lounge Suite');

  // Workspace A: 2 Collaboration Desks with properly oriented monitors (x: -4 and +4, z: 16)
  const createCollabPod = (px, pz, podId) => {
    const pod = new THREE.Group();
    const desk = new THREE.Mesh(roundedBox(3.4, 0.08, 2.0, 0.04), woodDeskMat);
    desk.position.y = 0.74;
    desk.castShadow = true;
    pod.add(desk);

    const divider = new THREE.Mesh(
      roundedBox(3.2, 0.44, 0.06, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
    );
    divider.position.set(0, 0.96, 0);
    pod.add(divider);

    // North monitors face North (rotY = Math.PI) toward chairs at pz - 1.3
    createWorkstationMonitor(
      px - 0.85, 0.78, pz - 0.28, Math.PI,
      `desk_${podId}_n_left`,
      screenTextures?.createCodeEditorTexture ? screenTextures.createCodeEditorTexture('CollabModule.ts') : screenTextures?.chartTexture,
      `Collab Pod ${podId} (IDE)`
    );
    createWorkstationMonitor(
      px + 0.85, 0.78, pz - 0.28, Math.PI,
      `desk_${podId}_n_right`,
      screenTextures?.createTerminalLogsTexture ? screenTextures.createTerminalLogsTexture() : screenTextures?.kpiTexture,
      `Collab Pod ${podId} (Terminal)`
    );

    // South monitors face South (rotY = 0) toward chairs at pz + 1.3
    createWorkstationMonitor(
      px - 0.85, 0.78, pz + 0.28, 0,
      `desk_${podId}_s_left`,
      screenTextures?.createDesignCanvasTexture ? screenTextures.createDesignCanvasTexture() : screenTextures?.featTexture,
      `Collab Pod ${podId} (Figma Canvas)`
    );
    createWorkstationMonitor(
      px + 0.85, 0.78, pz + 0.28, 0,
      `desk_${podId}_s_right`,
      screenTextures?.createTelecastLiveTexture ? screenTextures.createTelecastLiveTexture(`Pod ${podId}`, 'Team') : screenTextures?.starryLogoTexture,
      `Collab Pod ${podId} (Telecast)`
    );

    [-0.85, 0.85].forEach((dx) => {
      createCantileverChair(px + dx, pz - 1.3, 0, `Collab Pod ${podId} North Chair`);
      createCantileverChair(px + dx, pz + 1.3, Math.PI, `Collab Pod ${podId} South Chair`);
    });

    pod.position.set(px, 0, pz);
    furnitureGroup.add(pod);
  };

  createCollabPod(-4.0, 16.0, 1);
  createCollabPod(4.0, 16.0, 2);

  // Workspace A Team CI/CD Screen mounted flush on South dividing wall (Z = 20)
  createSpotWallScreen(
    -7.0, 1.55, 19.82, 3.8, 2.1, 0, 'workspace_a',
    screenTextures?.createCiCdMonitorTexture ? screenTextures.createCiCdMonitorTexture() : screenTextures?.chartTexture,
    'Workspace A Team CI/CD Monitor'
  );

  // Mega Arcade: Giant 8x8 Tournament Chessboard Court at (x: -14.0, z: 32.0)
  const chessGrp = new THREE.Group();
  chessGrp.name = 'clickable_chessboard';
  chessGrp.userData = { isChessboard: true, name: 'Giant Tournament Chessboard' };

  const boardSize = 5.2;
  const squareSize = boardSize / 8;
  const whiteTileMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const blackTileMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

  const border = new THREE.Mesh(
    roundedBox(boardSize + 0.3, 0.05, boardSize + 0.3, 0.04),
    brassGoldMat
  );
  border.position.y = 0.015;
  border.name = 'clickable_chessboard';
  border.userData = { isChessboard: true };
  chessGrp.add(border);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isBlack = (r + c) % 2 === 1;
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(squareSize - 0.02, 0.04, squareSize - 0.02),
        isBlack ? blackTileMat : whiteTileMat
      );
      tile.position.set((c - 3.5) * squareSize, 0.03, (r - 3.5) * squareSize);
      tile.name = 'clickable_chessboard';
      tile.userData = { isChessboard: true, row: r, col: c };
      chessGrp.add(tile);

      if (r === 0 || r === 1 || r === 6 || r === 7) {
        const pieceMat = r < 2 ? blackMat : whiteMat;
        const piece = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.16, 0.45, 12),
          pieceMat
        );
        piece.position.set((c - 3.5) * squareSize, 0.25, (r - 3.5) * squareSize);
        piece.castShadow = true;
        piece.name = 'clickable_chessboard';
        piece.userData = { isChessboard: true };
        chessGrp.add(piece);
      }
    }
  }
  chessGrp.position.set(-14.0, 0, 32.0);
  furnitureGroup.add(chessGrp);

  // Spectator seating benches along Tournament Chessboard Court
  [-17.5, -10.5].forEach((bx) => {
    const bench = new THREE.Mesh(roundedBox(0.65, 0.44, 3.8, 0.04), darkTableMat);
    bench.position.set(bx, 0.22, 32.0);
    bench.castShadow = true;
    bench.userData = {
      isChair: true,
      name: 'Chess Spectator Bench',
      chairPos: new THREE.Vector3(bx, 0.44, 32.0),
      chairRotY: bx < -14 ? Math.PI / 2 : -Math.PI / 2,
      seatHeight: 0.44
    };
    furnitureGroup.add(bench);
    chairsRef.current.push({
      name: 'Chess Spectator Bench',
      pos: new THREE.Vector3(bx, 0.44, 32.0),
      rot: bx < -14 ? Math.PI / 2 : -Math.PI / 2,
      seatHeight: 0.44
    });
  });

  // =========================================================================
  // MEGA-CAMPUS EXPANSION: 1. FITNESS & GYM CENTER FURNITURE (X: -58 to -26, Z: +8 to +46)
  // =========================================================================

  // 1. Commercial Treadmills
  const createTreadmill = (tx, tz, rotY = 0) => {
    const tm = new THREE.Group();
    tm.name = 'clickable_treadmill';
    tm.userData = { isGymEquipment: true, gymType: 'treadmill', name: 'Commercial Treadmill' };

    const base = new THREE.Mesh(roundedBox(1.1, 0.22, 2.2, 0.05), blackMat);
    base.position.y = 0.11;
    base.castShadow = true;
    base.name = 'clickable_treadmill';
    base.userData = { isGymEquipment: true, gymType: 'treadmill', name: 'Commercial Treadmill' };
    tm.add(base);

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 1.8), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.95 }));
    belt.position.set(0, 0.23, 0.1);
    belt.name = 'clickable_treadmill';
    belt.userData = { isGymEquipment: true, gymType: 'treadmill', name: 'Commercial Treadmill' };
    tm.add(belt);

    [-0.48, 0.48].forEach((rx) => {
      const riser = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.25, 0.08), chromeMat);
      riser.position.set(rx, 0.72, -0.85);
      tm.add(riser);

      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 12), blackLeatherMat);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(rx, 1.25, -0.35);
      tm.add(rail);
    });

    const consoleBox = new THREE.Mesh(roundedBox(0.9, 0.25, 0.08, 0.02), screenBezelMat);
    consoleBox.position.set(0, 1.35, -0.85);
    consoleBox.rotation.x = -0.3;
    tm.add(consoleBox);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.18), screenGlowMat);
    screen.position.set(0, 1.35, -0.80);
    screen.rotation.x = -0.3;
    tm.add(screen);

    tm.position.set(tx, 0, tz);
    tm.rotation.y = rotY;
    furnitureGroup.add(tm);

    chairsRef.current.push({
      name: 'Commercial Treadmill',
      pos: new THREE.Vector3(tx, 0.45, tz + 0.1),
      rot: rotY,
      seatHeight: 0.45,
      isGym: true,
      gymType: 'treadmill'
    });
  };

  [-48, -44, -40, -36].forEach((x) => {
    createTreadmill(x, 14, Math.PI);
  });
  registerObstacle(-42, 14, 7.0, 1.3, 'Treadmills Row');

  // 2. Stationary Spin Exercise Bikes
  const createSpinBike = (bx, bz, rotY = 0) => {
    const sb = new THREE.Group();
    sb.name = 'clickable_spinbike';
    sb.userData = { isGymEquipment: true, gymType: 'spinbike', name: 'Spin Exercise Bike' };

    const feet = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.2), chromeMat);
    feet.position.y = 0.025;
    sb.add(feet);

    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24), chromeMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0, 0.45, 0.35);
    sb.add(wheel);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.9), gymRedMat);
    frame.position.set(0, 0.45, -0.05);
    frame.rotation.x = -0.25;
    sb.add(frame);

    const seat = new THREE.Mesh(roundedBox(0.28, 0.08, 0.32, 0.04), blackLeatherMat);
    seat.position.set(0, 0.82, -0.35);
    seat.name = 'clickable_spinbike';
    seat.userData = {
      isChair: true,
      isGymEquipment: true,
      gymType: 'spinbike',
      name: 'Spin Exercise Bike',
      chairPos: new THREE.Vector3(bx, 0.82, bz),
      chairRotY: rotY,
      seatHeight: 0.82
    };
    sb.add(seat);
    chairsRef.current.push({
      name: 'Spin Exercise Bike',
      pos: new THREE.Vector3(bx, 0.82, bz),
      rot: rotY,
      seatHeight: 0.82,
      isGym: true,
      gymType: 'spinbike'
    });

    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 12), chromeMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 1.05, 0.3);
    sb.add(bar);

    sb.position.set(bx, 0, bz);
    sb.rotation.y = rotY;
    furnitureGroup.add(sb);
  };

  [-46, -42, -38].forEach((x) => {
    createSpinBike(x, 22, Math.PI);
  });
  registerObstacle(-42, 22, 5.0, 0.9, 'Spin Bikes Row');

  // 3. Olympic Bench Press Stations
  const createBenchPress = (px, pz, rotY = 0) => {
    const bp = new THREE.Group();
    bp.name = 'clickable_benchpress';
    bp.userData = { isGymEquipment: true, gymType: 'benchpress', name: 'Olympic Bench Press' };

    [-0.6, 0.6].forEach((x) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.35, 0.08), chromeMat);
      post.position.set(x, 0.675, -0.4);
      bp.add(post);

      const catchHook = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.16), blackMat);
      catchHook.position.set(x, 1.15, -0.35);
      bp.add(catchHook);
    });

    const bench = new THREE.Mesh(roundedBox(0.45, 0.12, 1.45, 0.04), blackLeatherMat);
    bench.position.set(0, 0.46, 0.1);
    bench.castShadow = true;
    bench.name = 'clickable_benchpress';
    bench.userData = {
      isChair: true,
      isGymEquipment: true,
      gymType: 'benchpress',
      name: 'Olympic Bench Press',
      chairPos: new THREE.Vector3(px, 0.46, pz),
      chairRotY: rotY,
      seatHeight: 0.46
    };
    bp.add(bench);
    chairsRef.current.push({
      name: 'Olympic Bench Press',
      pos: new THREE.Vector3(px, 0.46, pz),
      rot: rotY,
      seatHeight: 0.46,
      isGym: true,
      gymType: 'benchpress'
    });

    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 16), chromeMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 1.25, -0.35);
    bp.add(bar);

    [-0.9, 0.9].forEach((x) => {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24), blackMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.set(x, 1.25, -0.35);
      bp.add(plate);
    });

    bp.position.set(px, 0, pz);
    bp.rotation.y = rotY;
    furnitureGroup.add(bp);
  };

  createBenchPress(-46, 32, 0);
  createBenchPress(-38, 32, 0);
  registerObstacle(-42, 32, 5.2, 1.1, 'Bench Press Stations');

  // 4. Dumbbell Rack
  const createDumbbellRack = (rx, rz, rotY = 0) => {
    const dr = new THREE.Group();
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.65), darkTableMat);
    frameL.position.set(-1.6, 0.425, 0);
    dr.add(frameL);
    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.65), darkTableMat);
    frameR.position.set(1.6, 0.425, 0);
    dr.add(frameR);

    [0.38, 0.68].forEach((y, tier) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.04, 0.28), blackMat);
      shelf.position.set(0, y, tier === 0 ? 0.12 : -0.1);
      shelf.rotation.x = 0.15;
      dr.add(shelf);

      for (let i = -4; i <= 4; i += 2) {
        const db = new THREE.Group();
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24, 12), chromeMat);
        handle.rotation.z = Math.PI / 2;
        db.add(handle);

        const rSize = 0.08 + tier * 0.03 + Math.abs(i) * 0.01;
        [-0.12, 0.12].forEach((hx) => {
          const hex = new THREE.Mesh(new THREE.CylinderGeometry(rSize, rSize, 0.05, 6), blackMat);
          hex.rotation.z = Math.PI / 2;
          hex.position.x = hx;
          db.add(hex);
        });

        db.position.set(i * 0.35, y + 0.06, tier === 0 ? 0.12 : -0.1);
        dr.add(db);
      }
    });

    dr.position.set(rx, 0, rz);
    dr.rotation.y = rotY;
    furnitureGroup.add(dr);
  };

  createDumbbellRack(-55, 26, Math.PI / 2);
  registerObstacle(-55, 26, 0.6, 2.0, 'Dumbbell Rack');

  // Gym Keynote TV Wall Screen mounted flush on South Wall (Z = 45.8) facing North
  // Completely clear of the entrance glass doors at (X = -42, Z = 8)
  createSpotWallScreen(-42, 2.1, 45.8, 5.4, 3.0, Math.PI, 'gym_screen', screenTextures?.videoTexture, 'Fitness Center Keynote Wall');

  // =========================================================================
  // MEGA-CAMPUS EXPANSION: 2. LUXURY SWIMMING POOL & RESORT DECK (X: +26 to +58, Z: +8 to +46)
  // =========================================================================

  // 5. Poolside Sun Loungers
  const createSunLounger = (lx, lz, rotY = 0) => {
    const sl = new THREE.Group();
    const frame = new THREE.Mesh(roundedBox(0.85, 0.22, 2.1, 0.04), woodTeakMat);
    frame.position.y = 0.11;
    frame.castShadow = true;
    sl.add(frame);

    const cushion = new THREE.Mesh(roundedBox(0.80, 0.14, 2.0, 0.05), whiteResortMat);
    cushion.position.y = 0.26;
    cushion.castShadow = true;
    cushion.userData = {
      isChair: true,
      name: 'Poolside Sun Lounger',
      chairPos: new THREE.Vector3(lx, 0.44, lz),
      chairRotY: rotY,
      seatHeight: 0.44
    };
    sl.add(cushion);

    const pillow = new THREE.Mesh(roundedBox(0.65, 0.10, 0.35, 0.04), turquoiseMat);
    pillow.position.set(0, 0.36, -0.75);
    sl.add(pillow);

    sl.position.set(lx, 0, lz);
    sl.rotation.y = rotY;
    furnitureGroup.add(sl);

    chairsRef.current.push({
      name: 'Poolside Sun Lounger',
      pos: new THREE.Vector3(lx, 0.44, lz),
      rot: rotY,
      seatHeight: 0.44
    });
  };

  // North pool loungers (facing South over the water)
  [36, 40, 44, 48].forEach((x) => {
    createSunLounger(x, 11, 0);
  });

  // South pool loungers (facing North over the water)
  [36, 40, 44, 48].forEach((x) => {
    createSunLounger(x, 43, Math.PI);
  });

  // 6. Resort Shade Parasols
  const createResortParasol = (ux, uz) => {
    const p = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.12, 16), darkTableMat);
    base.position.y = 0.06;
    p.add(base);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.7, 12), woodTeakMat);
    pole.position.y = 1.35;
    p.add(pole);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.6, 16), whiteResortMat);
    canopy.position.y = 2.65;
    canopy.castShadow = true;
    p.add(canopy);

    p.position.set(ux, 0, uz);
    furnitureGroup.add(p);
  };

  createResortParasol(38, 9.8);
  createResortParasol(46, 9.8);
  createResortParasol(38, 44.2);
  createResortParasol(46, 44.2);

  // 7. Resort Daybed Cabanas
  const createPoolsideCabana = (cx, cz, rotY = 0) => {
    const cabana = new THREE.Group();
    [-1.2, 1.2].forEach((x) => {
      [-1.2, 1.2].forEach((z) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), woodTeakMat);
        post.position.set(x, 1.2, z);
        cabana.add(post);
      });
    });

    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 2.6), whiteResortMat);
    roof.position.y = 2.44;
    roof.castShadow = true;
    cabana.add(roof);

    const mattress = new THREE.Mesh(roundedBox(2.2, 0.35, 2.2, 0.08), whiteResortMat);
    mattress.position.y = 0.38;
    mattress.castShadow = true;
    mattress.userData = {
      isChair: true,
      name: 'Resort Daybed Cabana',
      chairPos: new THREE.Vector3(cx, 0.48, cz),
      chairRotY: rotY,
      seatHeight: 0.48
    };
    cabana.add(mattress);

    chairsRef.current.push({
      name: 'Resort Daybed Cabana',
      pos: new THREE.Vector3(cx, 0.48, cz),
      rot: rotY,
      seatHeight: 0.48
    });

    cabana.position.set(cx, 0, cz);
    cabana.rotation.y = rotY;
    furnitureGroup.add(cabana);
  };

  createPoolsideCabana(55, 18, -Math.PI / 2);
  createPoolsideCabana(55, 34, -Math.PI / 2);

  // 8. Diving Board & Pool Ladder
  const createDivingBoard = (dx, dz, rotY = 0) => {
    const db = new THREE.Group();
    const standL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.30, 0.12), chromeMat);
    standL.position.set(0, 0.15, -0.6);
    db.add(standL);
    const standR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.30, 0.12), chromeMat);
    standR.position.set(0, 0.15, 0.2);
    db.add(standR);

    const plank = new THREE.Mesh(roundedBox(0.65, 0.08, 2.5, 0.04), whiteResortMat);
    plank.position.set(0, 0.34, 0.7);
    plank.castShadow = true;
    db.add(plank);

    db.position.set(dx, 0, dz);
    db.rotation.y = rotY;
    furnitureGroup.add(db);
  };

  createDivingBoard(31.2, 27, Math.PI / 2);

  const createPoolLadder = (lx, lz, rotY = 0) => {
    const pl = new THREE.Group();
    [-0.28, 0.28].forEach((x) => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 12), chromeMat);
      rail.position.set(x, 0.35, 0);
      pl.add(rail);
    });
    [0.12, 0.25, 0.38].forEach((y) => {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 12), chromeMat);
      rung.rotation.z = Math.PI / 2;
      rung.position.set(0, y, 0);
      pl.add(rung);
    });
    pl.position.set(lx, 0, lz);
    pl.rotation.y = rotY;
    furnitureGroup.add(pl);
  };

  createPoolLadder(52.2, 27, -Math.PI / 2);

  // =========================================================================
  // MEGA-CAMPUS EXPANSION: 3. MEGA ARCADE & ENTERTAINMENT GAME ZONE (X: -20 to +20, Z: +20 to +46)
  // =========================================================================

  // 9. Tournament 8-Ball Billiards Table
  const createBilliardsTable = (bx, bz, rotY = 0) => {
    const bt = new THREE.Group();
    bt.name = 'clickable_billiards';
    bt.userData = { isBilliardsTable: true, name: 'Tournament 8-Ball Billiards' };

    [-1.1, 1.1].forEach((x) => {
      [-0.6, 0.6].forEach((z) => {
        const leg = new THREE.Mesh(roundedBox(0.18, 0.72, 0.18, 0.04), darkTableMat);
        leg.position.set(x, 0.36, z);
        leg.castShadow = true;
        bt.add(leg);
      });
    });

    const frame = new THREE.Mesh(roundedBox(2.65, 0.25, 1.5, 0.05), woodTeakMat);
    frame.position.y = 0.72;
    frame.castShadow = true;
    frame.name = 'clickable_billiards';
    frame.userData = { isBilliardsTable: true };
    bt.add(frame);

    const cloth = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.06, 1.2), billiardGreenMat);
    cloth.position.y = 0.83;
    cloth.receiveShadow = true;
    cloth.name = 'clickable_billiards';
    cloth.userData = { isBilliardsTable: true };
    bt.add(cloth);

    [[-1.18, -0.6], [0, -0.62], [1.18, -0.6], [-1.18, 0.6], [0, 0.62], [1.18, 0.6]].forEach(([px, pz]) => {
      const pocket = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 12), blackMat);
      pocket.position.set(px, 0.84, pz);
      bt.add(pocket);
    });

    const ballMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
    const cueBallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c <= r; c++) {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), ballMat);
        ball.position.set(0.45 + r * 0.052, 0.88, (c - r / 2) * 0.058);
        ball.castShadow = true;
        ball.name = 'clickable_billiards';
        ball.userData = { isBilliardsTable: true };
        bt.add(ball);
      }
    }
    const cueBall = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), cueBallMat);
    cueBall.position.set(-0.55, 0.88, 0);
    cueBall.name = 'clickable_billiards';
    cueBall.userData = { isBilliardsTable: true };
    bt.add(cueBall);

    const lamp = new THREE.Group();
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 8), brassGoldMat);
    rod.position.y = 2.0;
    lamp.add(rod);
    [-0.6, 0, 0.6].forEach((x) => {
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.22, 16), billiardGreenMat);
      shade.position.set(x, 1.5, 0);
      lamp.add(shade);

      const light = new THREE.PointLight(0xfff5e6, 0.8, 4.5);
      light.position.set(x, 1.38, 0);
      lamp.add(light);
    });
    bt.add(lamp);

    bt.position.set(bx, 0, bz);
    bt.rotation.y = rotY;
    furnitureGroup.add(bt);
  };

  createBilliardsTable(-14, 40, 0);

  // 10. Table Tennis / Ping Pong Table
  const createPingPongTable = (px, pz, rotY = 0) => {
    const pt = new THREE.Group();
    pt.name = 'clickable_pingpong';
    pt.userData = { isPingPongTable: true, name: 'Tournament Ping Pong' };

    [-1.0, 1.0].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 1.2), chromeMat);
      leg.position.set(x, 0.36, 0);
      leg.castShadow = true;
      pt.add(leg);
    });

    const tableTop = new THREE.Mesh(roundedBox(2.74, 0.08, 1.52, 0.02), pingPongBlueMat);
    tableTop.position.y = 0.76;
    tableTop.castShadow = true;
    tableTop.name = 'clickable_pingpong';
    tableTop.userData = { isPingPongTable: true };
    pt.add(tableTop);

    const centerLine = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.085, 0.02), whiteMat);
    centerLine.position.y = 0.765;
    pt.add(centerLine);

    const net = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 1.62), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 }));
    net.position.set(0, 0.88, 0);
    pt.add(net);

    const paddleRed = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16), gymRedMat);
    paddleRed.position.set(-0.6, 0.81, 0.3);
    paddleRed.name = 'clickable_pingpong';
    paddleRed.userData = { isPingPongTable: true };
    pt.add(paddleRed);

    const paddleBlack = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16), blackMat);
    paddleBlack.position.set(0.6, 0.81, -0.3);
    paddleBlack.name = 'clickable_pingpong';
    paddleBlack.userData = { isPingPongTable: true };
    pt.add(paddleBlack);

    pt.position.set(px, 0, pz);
    pt.rotation.y = rotY;
    furnitureGroup.add(pt);
  };

  createPingPongTable(12, 32, 0);

  // 11. Retro Arcade Cabinets with Interactive Playable Trigger
  const createArcadeCabinet = (ax, az, rotY = 0, title = 'ARCADE', marqueeColor = 0xa855f7) => {
    const ac = new THREE.Group();
    ac.name = 'clickable_arcade';
    ac.userData = { isArcadeCabinet: true, title, name: `${title} Arcade Machine` };

    const body = new THREE.Mesh(roundedBox(0.76, 1.85, 0.82, 0.04), blackMat);
    body.position.y = 0.925;
    body.castShadow = true;
    body.name = 'clickable_arcade';
    body.userData = { isArcadeCabinet: true, title };
    ac.add(body);

    const marquee = new THREE.Mesh(roundedBox(0.68, 0.22, 0.12, 0.02), new THREE.MeshBasicMaterial({ color: marqueeColor }));
    marquee.position.set(0, 1.70, 0.36);
    ac.add(marquee);

    const crt = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.48), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    crt.position.set(0, 1.32, 0.36);
    crt.rotation.x = -0.35;
    crt.name = 'clickable_arcade';
    crt.userData = { isArcadeCabinet: true, title };
    ac.add(crt);

    const ctrlPanel = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, 0.32), darkTableMat);
    ctrlPanel.position.set(0, 0.98, 0.42);
    ctrlPanel.rotation.x = 0.2;
    ac.add(ctrlPanel);

    [-0.18, 0.18].forEach((jx) => {
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), chromeMat);
      stick.position.set(jx, 1.05, 0.44);
      ac.add(stick);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), gymRedMat);
      ball.position.set(jx, 1.11, 0.44);
      ac.add(ball);
    });

    ac.position.set(ax, 0, az);
    ac.rotation.y = rotY;
    furnitureGroup.add(ac);
  };

  createArcadeCabinet(4, 44, Math.PI, 'STREET FIGHTER', 0xef4444);
  createArcadeCabinet(8, 44, Math.PI, 'PAC-MAN', 0xeab308);
  createArcadeCabinet(12, 44, Math.PI, 'SPACE INVADERS', 0x22c55e);
  createArcadeCabinet(16, 44, Math.PI, 'GALAXY RUN', 0x3b82f6);

  // 12. Gamer Lounge with 85" Curved OLED Display and Floor Credenza Unit
  const createGamerLounge = (gx, gz, rotY = 0) => {
    const gl = new THREE.Group();

    // Floor credenza media unit
    const credenza = new THREE.Mesh(roundedBox(3.8, 0.45, 0.75, 0.04), darkTableMat);
    credenza.position.set(0, 0.225, -1.8);
    gl.add(credenza);

    // Twin mounting pillars anchoring TV securely to credenza (eliminates floating TV glitch!)
    [-0.85, 0.85].forEach((mx) => {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.15, 0.08), chromeMat);
      pylon.position.set(mx, 0.98, -1.8);
      gl.add(pylon);
    });

    // Sleek soundbar resting on credenza
    const soundbar = new THREE.Mesh(roundedBox(2.2, 0.08, 0.12, 0.02), blackMat);
    soundbar.position.set(0, 0.49, -1.74);
    gl.add(soundbar);

    const tvBezel = new THREE.Mesh(roundedBox(3.4, 1.85, 0.12, 0.04), screenBezelMat);
    tvBezel.position.set(0, 1.65, -1.8);
    tvBezel.castShadow = true;
    gl.add(tvBezel);

    const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.25, 1.7), new THREE.MeshBasicMaterial({
      map: screenTextures?.starryLogoTexture || screenTextures?.logoTexture,
      color: 0x38bdf8
    }));
    tvScreen.position.set(0, 1.65, -1.73);
    gl.add(tvScreen);

    const beanbagColors = [0x2563eb, 0x9333ea, 0x059669, 0xd97706];
    const bbOffsets = [
      { x: -1.3, z: 0.2 },
      { x: -0.45, z: 0.5 },
      { x: 0.45, z: 0.5 },
      { x: 1.3, z: 0.2 }
    ];

    bbOffsets.forEach((bpos, idx) => {
      const bbMat = new THREE.MeshStandardMaterial({ color: beanbagColors[idx], roughness: 0.9 });
      const bb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 14), bbMat);
      bb.scale.set(1.1, 0.65, 1.1);
      bb.position.set(bpos.x, 0.32, bpos.z);
      bb.castShadow = true;

      const worldPos = new THREE.Vector3(gx + bpos.x, 0.38, gz + bpos.z);
      bb.userData = {
        isChair: true,
        name: `Gamer Beanbag ${idx + 1}`,
        chairPos: worldPos,
        chairRotY: rotY,
        seatHeight: 0.38
      };
      gl.add(bb);
      chairsRef.current.push({
        name: `Gamer Beanbag ${idx + 1}`,
        pos: worldPos,
        rot: rotY,
        seatHeight: 0.38
      });
    });

    gl.position.set(gx, 0, gz);
    gl.rotation.y = rotY;
    furnitureGroup.add(gl);
  };

  createGamerLounge(-2, 42, Math.PI);

  // 13. Poolside Outdoor Cinema Jumbotron LED Screen (8.0m x 4.5m)
  const createPoolsideCinemaScreen = (px, pz, rotY = 0) => {
    const pj = new THREE.Group();
    // Twin marine stainless steel pillars
    [-3.2, 3.2].forEach((sx) => {
      const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 5.5, 16), chromeMat);
      pylon.position.set(sx, 2.75, 0);
      pylon.castShadow = true;
      pj.add(pylon);
    });

    // Pylon crossbar
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.14, 0.14), chromeMat);
    crossbar.position.set(0, 4.8, 0);
    pj.add(crossbar);

    // Weather-sealed LED display housing (8.2m wide x 4.7m high x 0.28m deep)
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.25 });
    const housing = new THREE.Mesh(roundedBox(8.2, 4.7, 0.28, 0.08), housingMat);
    housing.position.set(0, 3.8, 0.05);
    housing.castShadow = true;
    pj.add(housing);

    // High-definition display screen face (8.0m x 4.5m)
    const screenFaceMat = new THREE.MeshBasicMaterial({
      map: screenTextures?.createAuditoriumKeynoteTexture ? screenTextures.createAuditoriumKeynoteTexture() : screenTextures?.starryLogoTexture,
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 4.5), screenFaceMat);
    screenFace.position.set(0, 3.8, 0.20);
    screenFace.name = 'screen_pool_jumbotron';
    screenFace.userData = {
      isSpotScreen: true,
      screenKey: 'pool_jumbotron',
      width: 8.0,
      height: 4.5,
      displayMesh: screenFace,
      displayName: 'Poolside Cinema Jumbotron'
    };
    housing.userData = screenFace.userData;
    pj.add(screenFace);

    pj.position.set(px, 0, pz);
    pj.rotation.y = rotY;
    furnitureGroup.add(pj);

    screensMap['pool_jumbotron'] = screenFace;
    screensMap['screen_pool_jumbotron'] = screenFace;
    screensMap['pool_cinema'] = screenFace;
  };

  createPoolsideCinemaScreen(56.5, 27.0, -Math.PI / 2);

  // =========================================================================
  // MEGA-CAMPUS EXPANSION: 4. EXECUTIVE CABINS WING (X: -58 to -32, Z: -46 to -8)
  // =========================================================================

  const createExecutiveSuite = (ex, ez, rotY = 0, name = 'CEO Executive Desk', screenKey = 'exec_screen') => {
    const es = new THREE.Group();

    // 1. Executive Architectural Smoked Walnut Desk
    // Top slab
    const deskTop = new THREE.Mesh(roundedBox(2.8, 0.065, 1.3, 0.03), smokedWalnutMat);
    deskTop.position.set(0, 0.74, 0);
    deskTop.castShadow = true;
    es.add(deskTop);

    // Beveled champagne brass perimeter edge bezel
    const deskBezel = new THREE.Mesh(roundedBox(2.84, 0.07, 1.34, 0.03), brassGoldMat);
    deskBezel.position.set(0, 0.738, 0);
    es.add(deskBezel);

    // Architectural side plinths with champagne brass collars & shoes
    [-1.15, 1.15].forEach((px) => {
      const plinthBody = new THREE.Mesh(roundedBox(0.24, 0.65, 1.12, 0.03), smokedWalnutMat);
      plinthBody.position.set(px, 0.35, 0);
      plinthBody.castShadow = true;
      es.add(plinthBody);

      const topCollar = new THREE.Mesh(roundedBox(0.26, 0.03, 1.15, 0.02), brassGoldMat);
      topCollar.position.set(px, 0.69, 0);
      es.add(topCollar);

      const shoePlinth = new THREE.Mesh(roundedBox(0.27, 0.025, 1.16, 0.02), brassGoldMat);
      shoePlinth.position.set(px, 0.012, 0);
      shoePlinth.castShadow = true;
      es.add(shoePlinth);
    });

    // Recessed architectural modesty panel with subtle brass inlay
    const modestyPanel = new THREE.Mesh(roundedBox(2.0, 0.45, 0.03, 0.01), smokedWalnutMat);
    modestyPanel.position.set(0, 0.45, -0.42);
    es.add(modestyPanel);

    // Hand-stitched full-grain leather desk blotter
    const blotter = new THREE.Mesh(roundedBox(1.2, 0.006, 0.65, 0.02), blackLeatherMat);
    blotter.position.set(0, 0.776, 0.08);
    es.add(blotter);

    // Brushed champagne brass desk lamp
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 16), brassGoldMat);
    lampBase.position.set(-1.05, 0.785, -0.2);
    es.add(lampBase);

    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 12), brassGoldMat);
    lampStem.position.set(-1.05, 0.98, -0.2);
    es.add(lampStem);

    const lampShade = new THREE.Mesh(roundedBox(0.28, 0.04, 0.12, 0.01), brassGoldMat);
    lampShade.position.set(-1.00, 1.18, -0.15);
    lampShade.rotation.z = -0.15;
    es.add(lampShade);

    // 2. High-End Executive Swivel High-Back Chair (Eames Soft-Pad Style)
    const chairGroup = new THREE.Group();

    // Horizontal channeled cushion ribs on seat
    [0.16, 0.0, -0.16].forEach((rz) => {
      const rib = new THREE.Mesh(roundedBox(0.62, 0.048, 0.17, 0.024), blackLeatherMat);
      rib.position.set(0, 0.435, rz);
      rib.castShadow = true;
      chairGroup.add(rib);
    });

    // Seat welt border
    const seatBorder = new THREE.Mesh(roundedBox(0.66, 0.05, 0.58, 0.02), blackLeatherMat);
    seatBorder.position.set(0, 0.41, 0);
    chairGroup.add(seatBorder);

    // High-Back with 4 horizontal pillowed cushions & integrated headrest
    [0.55, 0.72, 0.89, 1.06].forEach((ry, idx) => {
      const ribH = idx === 3 ? 0.16 : 0.14;
      const backRib = new THREE.Mesh(roundedBox(0.60, ribH, 0.065, 0.024), blackLeatherMat);
      backRib.position.set(0, ry, -0.28);
      backRib.castShadow = true;
      chairGroup.add(backRib);
    });

    // Rear architectural chrome spine
    const spineL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.65, 12), chromeMat);
    spineL.position.set(-0.25, 0.80, -0.32);
    chairGroup.add(spineL);

    const spineR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.65, 12), chromeMat);
    spineR.position.set(0.25, 0.80, -0.32);
    chairGroup.add(spineR);

    // Padded leather armrests with tubular chrome stanchions
    [-0.34, 0.34].forEach((ax) => {
      const armPad = new THREE.Mesh(roundedBox(0.07, 0.028, 0.36, 0.015), blackLeatherMat);
      armPad.position.set(ax, 0.64, -0.02);
      chairGroup.add(armPad);

      const armStanchion = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 12), chromeMat);
      armStanchion.position.set(ax, 0.52, -0.02);
      chairGroup.add(armStanchion);
    });

    // Chrome swivel stem & 5-star castor base
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.38, 16), chromeMat);
    stem.position.set(0, 0.19, 0);
    chairGroup.add(stem);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const legArm = new THREE.Mesh(roundedBox(0.03, 0.022, 0.32, 0.008), chromeMat);
      legArm.position.set(Math.sin(angle) * 0.16, 0.04, Math.cos(angle) * 0.16);
      legArm.rotation.y = angle;
      chairGroup.add(legArm);

      const castor = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), blackMat);
      castor.position.set(Math.sin(angle) * 0.30, 0.025, Math.cos(angle) * 0.30);
      chairGroup.add(castor);
    }

    chairGroup.position.set(ex, 0, ez - 0.82);
    chairGroup.rotation.y = rotY;
    chairGroup.name = 'clickable_chair';
    chairGroup.userData = {
      isChair: true,
      name: `${name} Chair`,
      chairPos: new THREE.Vector3(ex, 0.46, ez - 0.82),
      chairRotY: rotY,
      seatHeight: 0.46
    };
    furnitureGroup.add(chairGroup);
    chairsRef.current.push({
      name: `${name} Chair`,
      pos: new THREE.Vector3(ex, 0.46, ez - 0.82),
      rot: rotY,
      seatHeight: 0.46
    });

    // Monitors positioned on desk facing the executive chair at (ex, ez - 0.82)
    createWorkstationMonitor(ex - 0.55, 0.75, ez + 0.10, Math.PI - 0.16, `${screenKey}_mon1`, null, `${name} Left Monitor`);
    createWorkstationMonitor(ex + 0.55, 0.75, ez + 0.10, Math.PI + 0.16, `${screenKey}_mon2`, null, `${name} Right Monitor`);

    // Two luxury visitor chairs facing the desk from the south
    createCantileverChair(ex - 0.75, ez + 0.85, 0, `${name} Visitor Chair 1`, blackLeatherMat);
    createCantileverChair(ex + 0.75, ez + 0.85, 0, `${name} Visitor Chair 2`, blackLeatherMat);

    registerObstacle(ex, ez, 1.6, 0.8, `${name} Desk`);

    es.position.set(ex, 0, ez);
    es.rotation.y = rotY;
    furnitureGroup.add(es);
  };

  // 1. CEO Executive Penthouse Suite (North-West)
  createExecutiveSuite(-50, -36, 0, 'CEO Executive Suite', 'ceo_screen');
  createSpotWallScreen(-50, 1.8, -45.8, 4.4, 2.4, 0, 'ceo_wall_screen', screenTextures?.videoTexture, 'CEO Penthouse Keynote Screen');

  // 2. VP Executive Suite (North-East of Wing)
  createExecutiveSuite(-38, -36, 0, 'VP Executive Suite', 'vp_screen');
  createSpotWallScreen(-38, 1.8, -45.8, 4.4, 2.4, 0, 'vp_wall_screen', screenTextures?.starryLogoTexture, 'VP Suite Keynote Screen');

  // 3. Principal Director Suite (South-West of Wing)
  createExecutiveSuite(-50, -18, 0, 'Principal Suite', 'principal_screen');
  createSpotWallScreen(-57.8, 1.8, -18, 4.4, 2.4, Math.PI / 2, 'principal_wall_screen', screenTextures?.chartTexture, 'Principal Suite Presentation Screen');

  // 4. Executive Private Board Meeting Suite (South-East of Wing: -38, -18)
  const execBoard = new THREE.Group();

  // Smoked walnut conference table with champagne brass bezel
  const confTableTop = new THREE.Mesh(roundedBox(3.4, 0.065, 1.6, 0.03), smokedWalnutMat);
  confTableTop.position.set(0, 0.74, 0);
  confTableTop.castShadow = true;
  execBoard.add(confTableTop);

  const confTableBezel = new THREE.Mesh(roundedBox(3.44, 0.07, 1.64, 0.03), brassGoldMat);
  confTableBezel.position.set(0, 0.738, 0);
  execBoard.add(confTableBezel);

  // Center brass power/AV connectivity trough
  const confTrough = new THREE.Mesh(roundedBox(1.8, 0.012, 0.24, 0.01), brassGoldMat);
  confTrough.position.set(0, 0.776, 0);
  execBoard.add(confTrough);

  // Walnut plinth pedestals with brass collars
  [-0.9, 0.9].forEach((px) => {
    const plinth = new THREE.Mesh(roundedBox(0.24, 0.65, 1.05, 0.03), smokedWalnutMat);
    plinth.position.set(px, 0.35, 0);
    plinth.castShadow = true;
    execBoard.add(plinth);

    const collar = new THREE.Mesh(roundedBox(0.26, 0.03, 1.08, 0.02), brassGoldMat);
    collar.position.set(px, 0.69, 0);
    execBoard.add(collar);

    const shoe = new THREE.Mesh(roundedBox(0.27, 0.025, 1.10, 0.02), brassGoldMat);
    shoe.position.set(px, 0.012, 0);
    shoe.castShadow = true;
    execBoard.add(shoe);
  });

  execBoard.position.set(-38, 0, -18);
  furnitureGroup.add(execBoard);

  // 6 Conference Luxury Black Leather Cantilever Chairs (3 north, 3 south)
  [-1.0, 0, 1.0].forEach((cx, idx) => {
    createCantileverChair(-38 + cx, -18 - 1.15, 0, `Exec Board North Chair ${idx + 1}`, blackLeatherMat);
    createCantileverChair(-38 + cx, -18 + 1.15, Math.PI, `Exec Board South Chair ${idx + 1}`, blackLeatherMat);
  });

  createSpotWallScreen(-38, 1.8, -27.8, 4.4, 2.4, 0, 'exec_board_wall_screen', screenTextures?.videoTexture, 'Executive Board Keynote Screen');
  registerObstacle(-38, -18, 1.9, 1.0, 'Executive Board Conference Table');

  // Register Mega Arcade & Games obstacles
  registerObstacle(-14, 32, 2.8, 2.8, 'Tournament Chessboard');
  registerObstacle(-14, 40, 1.3, 1.8, 'Tournament Billiards Table');
  registerObstacle(12, 32, 1.6, 1.0, 'Ping Pong Table');
  registerObstacle(10, 44, 7.0, 0.6, 'Arcade Machines Bank');

  return { ...screensMap, furnitureGroup };
}
