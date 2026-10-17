import * as THREE from 'three';

/**
 * Builds the architectural environment matching the Spot Virtual desktop reference:
 * Exact 12-room floorplan blueprint (media_1791969443822.png), wall thickness 0.32, height 6.0,
 * wall color #f8f8f8, double doors with brass handles, transparent clerestory glass,
 * and the Seattle environment (media_1791969444094.png) with asphalt roads, zebra crossings,
 * sidewalk park benches, trees, and city skyline.
 */
export function buildOfficeEnvironment(scene, screenTextures, currentEnvironment = 'Seattle') {
  const materials = {};
  const environmentGroup = new THREE.Group();
  environmentGroup.name = 'office_environment_group';
  scene.add(environmentGroup);

  // 1. Procedural Bleached Birch Wood Plank Floor Texture with rich grain
  const floorCanvas = document.createElement('canvas');
  floorCanvas.width = 1024;
  floorCanvas.height = 1024;
  const fCtx = floorCanvas.getContext('2d');
  
  // Base warm light oak / bleached birch tone
  fCtx.fillStyle = '#f3f1ed';
  fCtx.fillRect(0, 0, 1024, 1024);

  // Alternating subtle plank lightness
  for (let y = 0; y < 1024; y += 32) {
    const toneVariation = Math.sin(y * 0.1) * 8;
    fCtx.fillStyle = `rgba(255, 255, 255, ${0.035 + (toneVariation > 0 ? 0.025 : 0)})`;
    fCtx.fillRect(0, y, 1024, 32);
  }

  // Defined plank joint seams
  fCtx.strokeStyle = '#cdc8c0';
  fCtx.lineWidth = 1.2;
  for (let y = 0; y < 1024; y += 32) {
    fCtx.beginPath();
    fCtx.moveTo(0, y);
    fCtx.lineTo(1024, y);
    fCtx.stroke();
  }

  // Staggered plank ends
  for (let y = 0; y < 1024; y += 32) {
    const offset = (y / 32) % 2 === 0 ? 0 : 80;
    for (let x = offset; x < 1024; x += 160) {
      fCtx.beginPath();
      fCtx.moveTo(x, y);
      fCtx.lineTo(x, y + 32);
      fCtx.stroke();
    }
  }

  // Fine wood fiber streaks
  fCtx.fillStyle = 'rgba(110, 95, 75, 0.035)';
  for (let i = 0; i < 600; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    const rw = 25 + Math.random() * 75;
    fCtx.fillRect(rx, ry, rw, 1.2);
  }

  const floorTexture = new THREE.CanvasTexture(floorCanvas);
  floorTexture.colorSpace = THREE.SRGBColorSpace;
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 8);

  materials.floorMat = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.68,
    metalness: 0.03
  });

  // Patio outdoor stone tile texture
  const patioCanvas = document.createElement('canvas');
  patioCanvas.width = 512;
  patioCanvas.height = 512;
  const pCtx = patioCanvas.getContext('2d');
  pCtx.fillStyle = '#e5e7eb';
  pCtx.fillRect(0, 0, 512, 512);
  pCtx.strokeStyle = '#cbd5e1';
  pCtx.lineWidth = 2;
  for (let i = 0; i < 512; i += 64) {
    pCtx.strokeRect(i, 0, 64, 512);
    pCtx.strokeRect(0, i, 512, 64);
  }
  const patioTexture = new THREE.CanvasTexture(patioCanvas);
  patioTexture.wrapS = THREE.RepeatWrapping;
  patioTexture.wrapT = THREE.RepeatWrapping;
  patioTexture.repeat.set(4, 4);
  materials.patioFloorMat = new THREE.MeshStandardMaterial({
    map: patioTexture,
    roughness: 0.85
  });

  // Gym non-slip speckled rubber flooring
  const gymCanvas = document.createElement('canvas');
  gymCanvas.width = 512;
  gymCanvas.height = 512;
  const gCtx = gymCanvas.getContext('2d');
  gCtx.fillStyle = '#1c222c';
  gCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    gCtx.fillStyle = Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255, 255, 255, 0.35)';
    gCtx.fillRect(Math.random() * 512, Math.random() * 512, 2.5, 2.5);
  }
  const gymTexture = new THREE.CanvasTexture(gymCanvas);
  gymTexture.wrapS = THREE.RepeatWrapping;
  gymTexture.wrapT = THREE.RepeatWrapping;
  gymTexture.repeat.set(8, 8);
  materials.gymFloorMat = new THREE.MeshStandardMaterial({
    map: gymTexture,
    roughness: 0.92,
    metalness: 0.05
  });

  // Swimming Pool Outdoor Teak Decking
  const teakCanvas = document.createElement('canvas');
  teakCanvas.width = 512;
  teakCanvas.height = 512;
  const tCtx = teakCanvas.getContext('2d');
  tCtx.fillStyle = '#b45309';
  tCtx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) {
    tCtx.fillStyle = y % 64 === 0 ? 'rgba(180, 83, 9, 0.9)' : 'rgba(217, 119, 6, 0.9)';
    tCtx.fillRect(0, y, 512, 30);
    tCtx.fillStyle = 'rgba(69, 26, 3, 0.5)';
    tCtx.fillRect(0, y + 30, 512, 2);
  }
  const teakTexture = new THREE.CanvasTexture(teakCanvas);
  teakTexture.wrapS = THREE.RepeatWrapping;
  teakTexture.wrapT = THREE.RepeatWrapping;
  teakTexture.repeat.set(6, 6);
  materials.poolDeckMat = new THREE.MeshStandardMaterial({
    map: teakTexture,
    roughness: 0.65,
    metalness: 0.05
  });

  // Swimming Pool Mosaic Tiles
  const poolTileCanvas = document.createElement('canvas');
  poolTileCanvas.width = 512;
  poolTileCanvas.height = 512;
  const ptCtx = poolTileCanvas.getContext('2d');
  ptCtx.fillStyle = '#0284c7';
  ptCtx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 16) {
    for (let y = 0; y < 512; y += 16) {
      const tileColor = Math.random() > 0.3 ? '#0284c7' : (Math.random() > 0.5 ? '#0ea5e9' : '#0369a1');
      ptCtx.fillStyle = tileColor;
      ptCtx.fillRect(x + 1, y + 1, 14, 14);
      ptCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ptCtx.strokeRect(x, y, 16, 16);
    }
  }
  const poolTileTex = new THREE.CanvasTexture(poolTileCanvas);
  poolTileTex.wrapS = THREE.RepeatWrapping;
  poolTileTex.wrapT = THREE.RepeatWrapping;
  poolTileTex.repeat.set(10, 10);
  materials.poolTileMat = new THREE.MeshStandardMaterial({
    map: poolTileTex,
    roughness: 0.2,
    metalness: 0.1
  });

  // Glistening Pool Water
  materials.waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    transmission: 0.72,
    opacity: 0.82,
    transparent: true,
    roughness: 0.08,
    metalness: 0.1,
    ior: 1.333,
    reflectivity: 0.85
  });

  // Mega Arcade & Game Zone Geometric Neon Carpet
  const arcadeCanvas = document.createElement('canvas');
  arcadeCanvas.width = 512;
  arcadeCanvas.height = 512;
  const aCtx = arcadeCanvas.getContext('2d');
  aCtx.fillStyle = '#0b0f19';
  aCtx.fillRect(0, 0, 512, 512);
  aCtx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
  aCtx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) {
    aCtx.beginPath(); aCtx.moveTo(i, 0); aCtx.lineTo(i, 512); aCtx.stroke();
    aCtx.beginPath(); aCtx.moveTo(0, i); aCtx.lineTo(512, i); aCtx.stroke();
  }
  aCtx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  for (let i = -512; i <= 512; i += 64) {
    aCtx.beginPath(); aCtx.moveTo(i, 0); aCtx.lineTo(i + 512, 512); aCtx.stroke();
  }
  const arcadeTex = new THREE.CanvasTexture(arcadeCanvas);
  arcadeTex.wrapS = THREE.RepeatWrapping;
  arcadeTex.wrapT = THREE.RepeatWrapping;
  arcadeTex.repeat.set(8, 6);
  materials.arcadeFloorMat = new THREE.MeshStandardMaterial({
    map: arcadeTex,
    roughness: 0.82,
    metalness: 0.1
  });

  // Executive Cabins Dark Walnut Parquet
  const parquetCanvas = document.createElement('canvas');
  parquetCanvas.width = 512;
  parquetCanvas.height = 512;
  const pqCtx = parquetCanvas.getContext('2d');
  pqCtx.fillStyle = '#261c14';
  pqCtx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) {
    pqCtx.fillStyle = y % 64 === 0 ? '#38281d' : '#2b1f17';
    pqCtx.fillRect(0, y, 512, 30);
    pqCtx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    pqCtx.strokeRect(0, y, 512, 32);
  }
  const parquetTex = new THREE.CanvasTexture(parquetCanvas);
  parquetTex.wrapS = THREE.RepeatWrapping;
  parquetTex.wrapT = THREE.RepeatWrapping;
  parquetTex.repeat.set(6, 6);
  materials.parquetFloorMat = new THREE.MeshStandardMaterial({
    map: parquetTex,
    roughness: 0.55,
    metalness: 0.05
  });

  // Mirrored Glass for Fitness Center
  materials.mirrorMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.05
  });

  // Architectural Wall Material: Vertical Brushed Acoustic Fabric Panel Texture (Matching media_1791993853484.png)
  const wallCanvas = document.createElement('canvas');
  wallCanvas.width = 1024;
  wallCanvas.height = 1024;
  const wCtx = wallCanvas.getContext('2d');

  // Base acoustic silver-grey fabric tone
  wCtx.fillStyle = '#dbdde2';
  wCtx.fillRect(0, 0, 1024, 1024);

  // Subtle vertical panel ribs / acoustic slats
  for (let x = 0; x < 1024; x += 16) {
    const toneVariation = Math.sin(x * 0.25) * 6;
    wCtx.fillStyle = `rgba(255, 255, 255, ${0.04 + (toneVariation > 0 ? 0.03 : 0)})`;
    wCtx.fillRect(x, 0, 8, 1024);
    wCtx.fillStyle = 'rgba(0, 0, 0, 0.025)';
    wCtx.fillRect(x + 8, 0, 8, 1024);
  }

  // Vertical brushed fabric striations / fibers
  for (let i = 0; i < 2800; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    const rh = 40 + Math.random() * 220;
    const isLight = Math.random() > 0.45;
    const alpha = Math.random() * 0.14 + 0.03;
    wCtx.fillStyle = isLight ? `rgba(255, 255, 255, ${alpha})` : `rgba(115, 120, 130, ${alpha})`;
    wCtx.fillRect(rx, ry, Math.random() * 1.6 + 0.6, rh);
  }

  // Fine vertical acoustic panel seam grooves every 128px
  wCtx.strokeStyle = 'rgba(90, 95, 105, 0.25)';
  wCtx.lineWidth = 1.2;
  for (let x = 0; x < 1024; x += 128) {
    wCtx.beginPath();
    wCtx.moveTo(x, 0);
    wCtx.lineTo(x, 1024);
    wCtx.stroke();
  }

  const wallTexture = new THREE.CanvasTexture(wallCanvas);
  wallTexture.colorSpace = THREE.SRGBColorSpace;
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(6, 2);

  materials.wallMat = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.92,
    metalness: 0.04
  });

  // Wall cap / trim material
  materials.wallTrimMat = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    roughness: 0.7
  });

  // Double Door panel material (grey with brass handles)
  materials.doorMat = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    roughness: 0.5,
    metalness: 0.15
  });

  materials.doorFrameMat = new THREE.MeshStandardMaterial({
    color: 0x4b5563,
    roughness: 0.4
  });

  materials.brassHandleMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.25
  });

  // Glass Clerestory Windows
  materials.glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    transmission: 0.96,
    thickness: 0.32,
    ior: 1.5
  });

  materials.frameMat = new THREE.MeshStandardMaterial({
    color: 0x374151,
    roughness: 0.5,
    metalness: 0.4
  });

  // 2. Calibrated Spot Lighting System
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8da388, 1.35);
  hemiLight.position.set(0, 50, 0);
  environmentGroup.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfffef5, 1.4);
  sunLight.position.set(24, 46, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 1.0;
  sunLight.shadow.camera.far = 110;
  const sCam = 70;
  sunLight.shadow.camera.left = -sCam;
  sunLight.shadow.camera.right = sCam;
  sunLight.shadow.camera.top = sCam;
  sunLight.shadow.camera.bottom = -sCam;
  sunLight.shadow.bias = -0.00015;
  sunLight.shadow.normalBias = 0.025;
  environmentGroup.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xd9ebff, 0.6);
  fillLight.position.set(-30, 40, -30);
  environmentGroup.add(fillLight);

  // 3. Main Expanded Mega-Campus Floor Mesh (Width: 120, Depth: 96)
  const floorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(120, 0.4, 96),
    materials.floorMat
  );
  floorMesh.position.set(0, -0.2, 0);
  floorMesh.receiveShadow = true;
  floorMesh.name = 'floor';
  environmentGroup.add(floorMesh);

  // A. Fitness Gym Floor Overlay (West Wing: X: -58 to -26, Z: +8 to +46)
  const gymFloor = new THREE.Mesh(
    new THREE.BoxGeometry(32, 0.42, 38),
    materials.gymFloorMat
  );
  gymFloor.position.set(-42, -0.19, 27);
  gymFloor.receiveShadow = true;
  gymFloor.name = 'floor_gym';
  environmentGroup.add(gymFloor);

  // B. Luxury Swimming Pool & Sun Deck Floor Overlay (East Wing: X: +26 to +58, Z: +8 to +46)
  // 4 Surrounding Teak Deck sections with cutout for pool basin (X: 32 to 52, Z: 16 to 38)
  const deckN = new THREE.Mesh(new THREE.BoxGeometry(32, 0.42, 8), materials.poolDeckMat);
  deckN.position.set(42, -0.19, 12);
  deckN.receiveShadow = true;
  environmentGroup.add(deckN);

  const deckS = new THREE.Mesh(new THREE.BoxGeometry(32, 0.42, 8), materials.poolDeckMat);
  deckS.position.set(42, -0.19, 42);
  deckS.receiveShadow = true;
  environmentGroup.add(deckS);

  const deckW = new THREE.Mesh(new THREE.BoxGeometry(6, 0.42, 22), materials.poolDeckMat);
  deckW.position.set(29, -0.19, 27);
  deckW.receiveShadow = true;
  environmentGroup.add(deckW);

  const deckE = new THREE.Mesh(new THREE.BoxGeometry(6, 0.42, 22), materials.poolDeckMat);
  deckE.position.set(55, -0.19, 27);
  deckE.receiveShadow = true;
  environmentGroup.add(deckE);

  // Swimming Pool Mosaic Tiled Floor (X: 32 to 52, Z: 16 to 38)
  const poolBottom = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.05, 22),
    materials.poolTileMat
  );
  poolBottom.position.set(42, 0.02, 27);
  poolBottom.receiveShadow = true;
  environmentGroup.add(poolBottom);

  // Pool Coping Rim (White Italian marble coping surrounding pool edge)
  const copingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 });
  const copingN = new THREE.Mesh(new THREE.BoxGeometry(21.4, 0.26, 0.8), copingMat);
  copingN.position.set(42, 0.13, 15.6);
  copingN.castShadow = true;
  environmentGroup.add(copingN);

  const copingS = new THREE.Mesh(new THREE.BoxGeometry(21.4, 0.26, 0.8), copingMat);
  copingS.position.set(42, 0.13, 38.4);
  copingS.castShadow = true;
  environmentGroup.add(copingS);

  const copingW = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.26, 22), copingMat);
  copingW.position.set(31.6, 0.13, 27);
  copingW.castShadow = true;
  environmentGroup.add(copingW);

  const copingE = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.26, 22), copingMat);
  copingE.position.set(52.4, 0.13, 27);
  copingE.castShadow = true;
  environmentGroup.add(copingE);

  // Dynamic Animated Glistening Swimming Pool Water Surface Mesh
  const waterGeo = new THREE.PlaneGeometry(19.8, 21.8, 32, 32);
  const waterMesh = new THREE.Mesh(waterGeo, materials.waterMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(42, 0.20, 27);
  waterMesh.receiveShadow = true;
  waterMesh.name = 'swimming_pool_water';
  environmentGroup.add(waterMesh);
  scene.userData.poolWaterMesh = waterMesh;

  // C. Mega Arcade & Game Zone Floor Overlay (South-Center Wing: X: -20 to +20, Z: +20 to +46)
  const arcadeFloor = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.42, 26),
    materials.arcadeFloorMat
  );
  arcadeFloor.position.set(0, -0.19, 33);
  arcadeFloor.receiveShadow = true;
  arcadeFloor.name = 'floor_arcade';
  environmentGroup.add(arcadeFloor);

  // D. Executive Cabins Floor Overlay (North-West Wing: X: -58 to -26, Z: -46 to -8)
  const cabinFloor = new THREE.Mesh(
    new THREE.BoxGeometry(32, 0.42, 38),
    materials.parquetFloorMat
  );
  cabinFloor.position.set(-42, -0.19, -27);
  cabinFloor.receiveShadow = true;
  cabinFloor.name = 'floor_executive_cabins';
  environmentGroup.add(cabinFloor);

  // 4. Exact Wall Builder Helpers (Dollhouse Cutaway Height: 2.85m matching Spot desktop reference)
  const WALL_HEIGHT = 2.85;
  const WALL_THICKNESS = 0.32;
  const wallsList = [];

  const createWall = (x, z, width, depth, height = WALL_HEIGHT, mat = null) => {
    // Each wall gets its own cloned material with transparent: true so individual foreground walls can fade independently
    const wallMat = (mat || materials.wallMat).clone();
    wallMat.transparent = true;
    wallMat.opacity = 1.0;

    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat);
    wall.position.set(x, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.userData = {
      isWall: true,
      wallCenter: new THREE.Vector3(x, height / 2, z),
      width,
      depth,
      height
    };
    environmentGroup.add(wall);

    // Wall top trim cap
    const trimMat = materials.wallTrimMat.clone();
    trimMat.transparent = true;
    trimMat.opacity = 1.0;
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.04, 0.08, depth + 0.04),
      trimMat
    );
    trim.position.set(x, height + 0.04, z);
    environmentGroup.add(trim);

    wallsList.push({
      mesh: wall,
      trimMesh: trim,
      center: new THREE.Vector3(x, height / 2, z),
      width,
      depth,
      radius: Math.hypot(width, depth) / 2
    });

    return wall;
  };

  // Helper: Modern Glass Partition Wall with dark base sill and top header trim (media_1792165933867.png)
  const createGlassPartition = (x, z, width, depth, height = WALL_HEIGHT) => {
    // Bottom sill/baseboard
    const baseSill = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.16, depth),
      materials.doorFrameMat
    );
    baseSill.position.set(x, 0.08, z);
    environmentGroup.add(baseSill);

    // Tempered glass panel
    const glassPane = new THREE.Mesh(
      new THREE.BoxGeometry(width, height - 0.24, depth * 0.4),
      materials.glassMat
    );
    glassPane.position.set(x, (height - 0.24) / 2 + 0.16, z);
    environmentGroup.add(glassPane);

    // Top header/sill
    const topSill = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.02, 0.08, depth + 0.02),
      materials.wallTrimMat
    );
    topSill.position.set(x, height + 0.04, z);
    environmentGroup.add(topSill);

    wallsList.push({
      mesh: glassPane,
      trimMesh: topSill,
      center: new THREE.Vector3(x, height / 2, z),
      width,
      depth,
      radius: Math.hypot(width, depth) / 2
    });
  };

  const doorsList = [];

  // Helper: Interactive Double Doorway with swinging hinge pivots, brass handles & wall lintel
  const createDoubleDoor = (x, z, rotY = 0, doorName = 'Double Door') => {
    const doorGroup = new THREE.Group();
    doorGroup.name = 'doorway_group';

    // Door frame
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.36), materials.doorFrameMat);
    frameLeft.position.set(-1.45, 1.2, 0);
    frameLeft.name = 'doorway_frame';
    doorGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.36), materials.doorFrameMat);
    frameRight.position.set(1.45, 1.2, 0);
    frameRight.name = 'doorway_frame';
    doorGroup.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.1, 0.36), materials.doorFrameMat);
    frameTop.position.set(0, 2.4, 0);
    frameTop.name = 'doorway_frame';
    doorGroup.add(frameTop);

    // Solid Wall Lintel / Transom above door frame spanning to WALL_HEIGHT (eliminates all gaps above doors!)
    const lintelH = WALL_HEIGHT - 2.45;
    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(3.02, lintelH, WALL_THICKNESS),
      materials.wallMat
    );
    lintel.position.set(0, 2.45 + lintelH / 2, 0);
    lintel.castShadow = true;
    doorGroup.add(lintel);

    const lintelTrim = new THREE.Mesh(
      new THREE.BoxGeometry(3.02 + 0.02, 0.08, WALL_THICKNESS + 0.02),
      materials.wallTrimMat
    );
    lintelTrim.position.set(0, WALL_HEIGHT + 0.04, 0);
    doorGroup.add(lintelTrim);

    // Left Door Leaf mounted on Hinge Pivot at -1.38
    const doorLPivot = new THREE.Group();
    doorLPivot.position.set(-1.38, 0, 0);

    const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.36, 2.28, 0.08), materials.doorMat);
    doorL.position.set(0.68, 1.14, 0);
    doorL.castShadow = true;
    doorL.name = 'interactive_door_leaf';
    doorLPivot.add(doorL);

    // Left brass handles on both interior and exterior sides
    [-0.055, 0.055].forEach((hz) => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 12), materials.brassHandleMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(1.20, 1.05, hz);
      handle.name = 'interactive_door_leaf';
      doorLPivot.add(handle);
    });

    doorGroup.add(doorLPivot);

    // Right Door Leaf mounted on Hinge Pivot at +1.38
    const doorRPivot = new THREE.Group();
    doorRPivot.position.set(1.38, 0, 0);

    const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.36, 2.28, 0.08), materials.doorMat);
    doorR.position.set(-0.68, 1.14, 0);
    doorR.castShadow = true;
    doorR.name = 'interactive_door_leaf';
    doorRPivot.add(doorR);

    // Right brass handles on both interior and exterior sides
    [-0.055, 0.055].forEach((hz) => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 12), materials.brassHandleMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(-1.20, 1.05, hz);
      handle.name = 'interactive_door_leaf';
      doorRPivot.add(handle);
    });

    doorGroup.add(doorRPivot);

    doorGroup.position.set(x, 0, z);
    doorGroup.rotation.y = rotY;

    doorGroup.userData = {
      isInteractiveDoor: true,
      name: doorName,
      isOpen: false,
      currentAngle: 0,
      targetAngle: 0,
      doorLPivot,
      doorRPivot,
      center: new THREE.Vector3(x, 1.2, z),
      width: 2.8,
      depth: 0.4,
      toggleDoor: (forceOpen) => {
        const nextState = forceOpen !== undefined ? forceOpen : !doorGroup.userData.isOpen;
        doorGroup.userData.isOpen = nextState;
        doorGroup.userData.targetAngle = nextState ? Math.PI * 0.48 : 0;
        return nextState;
      }
    };

    environmentGroup.add(doorGroup);
    doorsList.push(doorGroup);
    return doorGroup;
  };

  // Helper: Interactive Single Doorway for private focus cubicles & booths
  const createSingleDoor = (x, z, rotY = 0, doorName = 'Single Door') => {
    const doorGroup = new THREE.Group();
    doorGroup.name = 'doorway_group';

    // Single door frame
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.36), materials.doorFrameMat);
    frameLeft.position.set(-0.75, 1.2, 0);
    doorGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.36), materials.doorFrameMat);
    frameRight.position.set(0.75, 1.2, 0);
    doorGroup.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.1, 0.36), materials.doorFrameMat);
    frameTop.position.set(0, 2.4, 0);
    doorGroup.add(frameTop);

    // Solid Wall Lintel / Transom above single door frame
    const lintelH = WALL_HEIGHT - 2.45;
    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(1.62, lintelH, WALL_THICKNESS),
      materials.wallMat
    );
    lintel.position.set(0, 2.45 + lintelH / 2, 0);
    lintel.castShadow = true;
    doorGroup.add(lintel);

    const lintelTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.62 + 0.02, 0.08, WALL_THICKNESS + 0.02),
      materials.wallTrimMat
    );
    lintelTrim.position.set(0, WALL_HEIGHT + 0.04, 0);
    doorGroup.add(lintelTrim);

    // Single Door Leaf mounted on Hinge Pivot at -0.70
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-0.70, 0, 0);

    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.36, 2.28, 0.08), materials.doorMat);
    doorLeaf.position.set(0.68, 1.14, 0);
    doorLeaf.castShadow = true;
    doorLeaf.name = 'interactive_door_leaf';
    doorPivot.add(doorLeaf);

    // Brass handles on interior and exterior
    [-0.055, 0.055].forEach((hz) => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.40, 12), materials.brassHandleMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(1.20, 1.05, hz);
      handle.name = 'interactive_door_leaf';
      doorPivot.add(handle);
    });

    doorGroup.add(doorPivot);
    doorGroup.position.set(x, 0, z);
    doorGroup.rotation.y = rotY;

    doorGroup.userData = {
      isInteractiveDoor: true,
      name: doorName,
      isOpen: false,
      currentAngle: 0,
      targetAngle: 0,
      doorLPivot: doorPivot,
      doorRPivot: null,
      center: new THREE.Vector3(x, 1.2, z),
      width: 1.5,
      depth: 0.4,
      toggleDoor: (forceOpen) => {
        const nextState = forceOpen !== undefined ? forceOpen : !doorGroup.userData.isOpen;
        doorGroup.userData.isOpen = nextState;
        doorGroup.userData.targetAngle = nextState ? Math.PI * 0.48 : 0;
        return nextState;
      }
    };

    environmentGroup.add(doorGroup);
    doorsList.push(doorGroup);
    return doorGroup;
  };

  // Helper: Interactive Modern Double Glass Doors (Patio Terrace & Main Lobby)
  const createGlassDoubleDoor = (x, z, rotY = 0, doorName = 'Glass Door') => {
    const doorGroup = new THREE.Group();
    doorGroup.name = 'doorway_group';

    // Metal frame
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.36), materials.doorFrameMat);
    frameLeft.position.set(-1.45, 1.2, 0);
    doorGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.36), materials.doorFrameMat);
    frameRight.position.set(1.45, 1.2, 0);
    doorGroup.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.1, 0.36), materials.doorFrameMat);
    frameTop.position.set(0, 2.4, 0);
    doorGroup.add(frameTop);

    // Wall lintel above glass door
    const lintelH = WALL_HEIGHT - 2.45;
    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(3.02, lintelH, WALL_THICKNESS),
      materials.wallMat
    );
    lintel.position.set(0, 2.45 + lintelH / 2, 0);
    lintel.castShadow = true;
    doorGroup.add(lintel);

    const lintelTrim = new THREE.Mesh(
      new THREE.BoxGeometry(3.02 + 0.02, 0.08, WALL_THICKNESS + 0.02),
      materials.wallTrimMat
    );
    lintelTrim.position.set(0, WALL_HEIGHT + 0.04, 0);
    doorGroup.add(lintelTrim);

    const glassMat = materials.glassMat.clone();
    glassMat.opacity = 0.38;

    // Left glass leaf
    const doorLPivot = new THREE.Group();
    doorLPivot.position.set(-1.38, 0, 0);
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.36, 2.28, 0.06), glassMat);
    doorL.position.set(0.68, 1.14, 0);
    doorL.castShadow = true;
    doorL.name = 'interactive_door_leaf';
    doorLPivot.add(doorL);

    [-0.05, 0.05].forEach((hz) => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.55, 12), materials.doorFrameMat);
      handle.position.set(1.20, 1.05, hz);
      handle.name = 'interactive_door_leaf';
      doorLPivot.add(handle);
    });
    doorGroup.add(doorLPivot);

    // Right glass leaf
    const doorRPivot = new THREE.Group();
    doorRPivot.position.set(1.38, 0, 0);
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.36, 2.28, 0.06), glassMat);
    doorR.position.set(-0.68, 1.14, 0);
    doorR.castShadow = true;
    doorR.name = 'interactive_door_leaf';
    doorRPivot.add(doorR);

    [-0.05, 0.05].forEach((hz) => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.55, 12), materials.doorFrameMat);
      handle.position.set(-1.20, 1.05, hz);
      handle.name = 'interactive_door_leaf';
      doorRPivot.add(handle);
    });
    doorGroup.add(doorRPivot);

    doorGroup.position.set(x, 0, z);
    doorGroup.rotation.y = rotY;

    doorGroup.userData = {
      isInteractiveDoor: true,
      name: doorName,
      isOpen: false,
      currentAngle: 0,
      targetAngle: 0,
      doorLPivot,
      doorRPivot,
      center: new THREE.Vector3(x, 1.2, z),
      width: 2.8,
      depth: 0.4,
      toggleDoor: (forceOpen) => {
        const nextState = forceOpen !== undefined ? forceOpen : !doorGroup.userData.isOpen;
        doorGroup.userData.isOpen = nextState;
        doorGroup.userData.targetAngle = nextState ? Math.PI * 0.48 : 0;
        return nextState;
      }
    };

    environmentGroup.add(doorGroup);
    doorsList.push(doorGroup);
    return doorGroup;
  };

  // Helper: Low modern planter with tall vertical reeds (media_1792165933867.png & media_1792165933914.png)
  const createLowPlanter = (x, z, length, width = 0.65, rotY = 0) => {
    const planterGroup = new THREE.Group();
    planterGroup.name = 'planter_divider_group';

    // Dark charcoal / black trough box
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.42, width),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 })
    );
    box.position.y = 0.21;
    box.castShadow = true;
    planterGroup.add(box);

    // Soil bedding
    const soil = new THREE.Mesh(
      new THREE.BoxGeometry(length - 0.08, 0.06, width - 0.08),
      new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.95 })
    );
    soil.position.y = 0.40;
    planterGroup.add(soil);

    // Reeds / ornamental grasses
    const reedMat1 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 });
    const reedMat2 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });
    const reedCount = Math.floor(length * 7);
    for (let i = 0; i < reedCount; i++) {
      const rx = -length / 2 + 0.15 + (i / reedCount) * (length - 0.3) + (Math.random() - 0.5) * 0.08;
      const rz = (Math.random() - 0.5) * (width - 0.22);
      const rHeight = 0.85 + Math.random() * 0.45;
      const reed = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.018, rHeight, 6),
        Math.random() > 0.4 ? reedMat1 : reedMat2
      );
      reed.position.set(rx, 0.40 + rHeight / 2, rz);
      reed.rotation.z = (Math.random() - 0.5) * 0.12;
      planterGroup.add(reed);
    }

    planterGroup.position.set(x, 0, z);
    planterGroup.rotation.y = rotY;
    environmentGroup.add(planterGroup);

    // Register planter as collision boundary
    wallsList.push({
      mesh: box,
      center: new THREE.Vector3(x, 0.21, z),
      width: rotY === 0 ? length : width,
      depth: rotY === 0 ? width : length,
      radius: Math.hypot(length, width) / 2
    });

    return planterGroup;
  };

  // 5. Build the Exact Spot Virtual Wall Blueprint (media_1792165933867.png & media_1792165933914.png)
  // Overall interior dimensions: X = [-32, +32], Z = [-24, +24]

  // Outer Mega-Campus Perimeter Solid Walls & Panoramic Glass Clerestories (120m x 96m: X = [-58, +58], Z = [-46, +46])
  createWall(-58, 0, WALL_THICKNESS, 92); // Far West Wall (X = -58)
  createWall(58, -20, WALL_THICKNESS, 52); // Far East Wall behind Auditorium (X = +58, Z: -46 to +6)

  // Interior Connecting Wall at X = -32 between Central Core and West Wing (Executive Cabins & Gym)
  createWall(-32, -35, WALL_THICKNESS, 22); // North partition
  createDoubleDoor(-32, -16, Math.PI / 2, 'Executive Suite West Door'); // Doorway from Boardroom into Executive Cabins
  createWall(-32, 0, WALL_THICKNESS, 16); // Center solid wall behind Chat cabins
  createDoubleDoor(-32, 16, Math.PI / 2, 'Gym Concourse Door'); // Doorway from Patio into Fitness Gym
  createWall(-32, 35, WALL_THICKNESS, 22); // South partition

  // Interior Connecting Wall at X = +32 between Central Core and East Wing (Swimming Pool & Auditorium)
  createWall(32, -10, WALL_THICKNESS, 28); // Wall behind Auditorium Stage (X = +32, Z: -24 to +4)
  createGlassDoubleDoor(32, 14, Math.PI / 2, 'Pool Deck French Doors'); // Grand glass French doors onto Pool Deck

  // Transparent Clerestory Windows with mullions on North and South Horizons:
  const createClerestoryFacade = (zPos, startX = -56, endX = 56) => {
    for (let x = startX; x <= endX; x += 6) {
      const glassPane = new THREE.Mesh(
        new THREE.BoxGeometry(5.8, WALL_HEIGHT, 0.08),
        materials.glassMat
      );
      glassPane.position.set(x, WALL_HEIGHT / 2, zPos);
      environmentGroup.add(glassPane);

      // Frame mullions
      const mullion = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, WALL_HEIGHT, 0.22),
        materials.frameMat
      );
      mullion.position.set(x + 2.9, WALL_HEIGHT / 2, zPos);
      environmentGroup.add(mullion);
    }
  };

  createClerestoryFacade(-46, -54, 54); // North clerestory
  createClerestoryFacade(46, -54, 24); // South clerestory (West half & arcade)

  // =========================================================================
  // ROW 1: NORTH ROOMS (Z = -24 to -8) - Exact match to media_1792165933867.png
  // =========================================================================

  // 1. BOARDROOM (Northwest: X = -32 to -14, Z = -24 to -8)
  // Dividing wall between Boardroom and Meeting Cabin (X = -14, Z = -24 to -8)
  createWall(-14, -16, WALL_THICKNESS, 16);

  // South wall of Boardroom (Z = -8, total span: X = -32 to -14, exactly 18m)
  // Double Door at X = -23 (outer frame: -24.51 to -21.49)
  createWall(-28.255, -8, 7.49, WALL_THICKNESS); // Left solid wall: -32.0 to -24.51 (0.000 gap)
  createDoubleDoor(-23, -8, 0, 'Boardroom Double Door'); // Double doors with brass handles & lintel
  createGlassPartition(-17.745, -8, 7.49, WALL_THICKNESS); // Right glass wall: -21.49 to -14.00 (0.000 gap)

  // 2. MEETING CABIN / PRIVATE LOUNGE (North-Center: X = -14 to +6, Z = -24 to -8)
  // Dividing wall between Meeting Cabin and Auditorium (X = +6, Z = -24 to -8)
  createWall(6, -16, WALL_THICKNESS, 16);

  // South wall of Meeting Cabin (Z = -8, total span: X = -14 to +6, exactly 20m)
  // Double Door at X = -4 (outer frame: -5.51 to -2.49)
  createWall(-9.755, -8, 8.49, WALL_THICKNESS); // Left solid wall: -14.0 to -5.51 (0.000 gap)
  createDoubleDoor(-4, -8, 0, 'Meeting Cabin Double Door'); // Double doors with brass handles & lintel
  createWall(1.755, -8, 8.49, WALL_THICKNESS); // Right ribbed wall: -2.49 to +6.00 (0.000 gap)

  // 3. AUDITORIUM OPEN ATRIUM (East: X = +6 to +32, Z = -24 to +4)
  // Open layout: Framed by stylish low black planters with tall green reeds (media_1792165933867.png & media_1792165933914.png)
  createLowPlanter(6, -2, 12, 0.65, Math.PI / 2); // West boundary planter along X = +6 from Z = -8 to Z = +4
  createLowPlanter(12, 4, 12, 0.65, 0); // South boundary planter along Z = +4 from X = +6 to X = +18
  // Wide open walkway opening at X = 18 to 22 allows walking freely into the stadium seating tiers!

  // =========================================================================
  // ROW 2: CENTRAL CONCOURSE / LOUNGE C (X = -32 to +14, Z = -8 to +8)
  // Open, expansive, bright modern concourse with bleached birch plank flooring
  // =========================================================================

  // =========================================================================
  // ROW 3: SOUTH ROOMS & COLLABORATION WING (Z = +8 to +24)
  // =========================================================================

  // A. FOCUS CUBICLES 1 & 2 (X = -26 to -14, Z = 8 to 14) - Fully Enclosed with Zero Gaps
  // Outer West Wall (X = -26, Z = 8 to 14)
  createWall(-26, 11, WALL_THICKNESS, 6);

  // Focus Cubicle 1 Front Wall (Z = 8, X = -26 to -19.5, span = 6.5m)
  // Single door at X = -22.75 (outer frame: -23.56 to -21.94)
  createWall(-24.78, 8, 2.44, WALL_THICKNESS); // Left wall: -26.0 to -23.56 (0.000 gap)
  createSingleDoor(-22.75, 8, 0, 'Focus Cubicle 1 Door');
  createWall(-20.72, 8, 2.44, WALL_THICKNESS); // Right wall: -21.94 to -19.50 (0.000 gap)

  // Center divider between Cubicle 1 and 2 (X = -19.5, Z = 8 to 14)
  createWall(-19.5, 11, WALL_THICKNESS, 6);

  // Focus Cubicle 2 Front Wall (Z = 8, X = -19.5 to -14.0, span = 5.5m)
  // Single door at X = -16.75 (outer frame: -17.56 to -15.94)
  createWall(-18.53, 8, 1.94, WALL_THICKNESS); // Left wall: -19.50 to -17.56 (0.000 gap)
  createSingleDoor(-16.75, 8, 0, 'Focus Cubicle 2 Door');
  createWall(-14.97, 8, 1.94, WALL_THICKNESS); // Right wall: -15.94 to -14.00 (0.000 gap)

  // Outer East Wall of Cubicles (X = -14, Z = 8 to 14)
  createWall(-14, 11, WALL_THICKNESS, 6);

  // Back Wall of Cubicles (Z = 14, X = -26 to -14, span = 12m)
  createWall(-20, 14, 12, WALL_THICKNESS);

  // B. WORKSPACE A & COLLABORATION SUITE (X = -14 to +14, Z = 8 to 24) - Fully Enclosed
  // Front Wall along Z = 8 (from X = -14 to +14, total span = 28m)
  // Central Double Door at X = 0 (outer frame: -1.51 to +1.51)
  createWall(-7.755, 8, 12.49, WALL_THICKNESS); // Left front wall: -14.0 to -1.51 (0.000 gap)
  createDoubleDoor(0, 8, 0, 'Workspace A Concourse Door'); // Central Double Doors from Lounge C concourse
  createWall(7.755, 8, 12.49, WALL_THICKNESS); // Right front wall: +1.51 to +14.0 (0.000 gap)

  // West Divider Wall with Outdoor Patio (X = -14, Z = 14 to 24, span = 10m)
  // Double Glass Sliding Doors at Z = 19 (outer frame: 17.49 to 20.51)
  createWall(-14, 15.745, WALL_THICKNESS, 3.49); // North wall: 14.0 to 17.49 (0.000 gap)
  createGlassDoubleDoor(-14, 19, Math.PI / 2, 'Patio Terrace Glass Door'); // Glass doors to outdoor game terrace
  createWall(-14, 22.255, WALL_THICKNESS, 3.49); // South wall: 20.51 to 24.0 (0.000 gap)

  // East Divider Wall with Promenade / Lobby (X = 14, Z = 8 to 24, span = 16m)
  // Double Doors at Z = 16 (outer frame: 14.49 to 17.51)
  createWall(14, 11.245, WALL_THICKNESS, 6.49); // North wall: 8.0 to 14.49 (0.000 gap)
  createDoubleDoor(14, 16, Math.PI / 2, 'Workspace A East Door'); // Doors to East Promenade
  createWall(14, 20.755, WALL_THICKNESS, 6.49); // South wall: 17.51 to 24.0 (0.000 gap)

  // C. MAIN LOBBY & ENTRANCE (X = 14 to 32, Z = 8 to 24)
  // South Wall Entrance Double Glass Doors at X = 22, Z = 24
  createGlassDoubleDoor(22, 24, 0, 'Main Office Entrance');

  // =========================================================================
  // ROW 4: EXECUTIVE CABINS WING (X = -58 to -26, Z = -46 to -8)
  // =========================================================================
  // North-South dividing wall at X = -42 between Cabins 1/2 and 3/4
  createWall(-42, -35, WALL_THICKNESS, 22);
  createSingleDoor(-42, -24, Math.PI / 2, 'Executive Cabin Connecting Door');
  createWall(-42, -16, WALL_THICKNESS, 16);

  // East-West dividing wall at Z = -27
  createWall(-50, -27, 16, WALL_THICKNESS);
  createSingleDoor(-42, -27, 0, 'CEO Cabin Door');
  createWall(-34, -27, 16, WALL_THICKNESS);

  // =========================================================================
  // ROW 5: FITNESS & GYM CENTER (X = -58 to -26, Z = +8 to +46)
  // =========================================================================
  // North Gym Entrance Wall at Z = +8 (from X = -58 to -26, span = 32m)
  createWall(-50, 8, 16, WALL_THICKNESS);
  createGlassDoubleDoor(-42, 8, 0, 'Fitness Gym Glass Entrance');
  createWall(-34, 8, 16, WALL_THICKNESS);

  // East Gym Wall at X = -26 (separating Gym from Game Zone)
  createGlassPartition(-26, 27, WALL_THICKNESS, 38);

  // West Wall Large Gym Mirrored Panels
  const gymMirror = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.4, 32), materials.mirrorMat);
  gymMirror.position.set(-57.8, 1.3, 27);
  environmentGroup.add(gymMirror);

  // =========================================================================
  // ROW 6: LUXURY SWIMMING POOL & RESORT DECK (X = +26 to +58, Z = +8 to +46)
  // =========================================================================
  // Helper: Modern Glass Resort Balustrade
  const createGlassBalustrade = (bx, bz, length, rotY = 0) => {
    const bGrp = new THREE.Group();
    const glass = new THREE.Mesh(new THREE.BoxGeometry(length, 1.15, 0.06), materials.glassMat);
    glass.position.y = 0.58;
    bGrp.add(glass);
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, length, 12), materials.doorFrameMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.y = 1.16;
    bGrp.add(rail);
    bGrp.position.set(bx, 0, bz);
    bGrp.rotation.y = rotY;
    environmentGroup.add(bGrp);
    wallsList.push({
      mesh: glass,
      center: new THREE.Vector3(bx, 0.58, bz),
      width: rotY === 0 ? length : 0.4,
      depth: rotY === 0 ? 0.4 : length,
      radius: length / 2
    });
  };

  createGlassBalustrade(58, 27, 38, Math.PI / 2); // East Resort Railing overlooking Skyline
  createGlassBalustrade(42, 46, 32, 0); // South Resort Railing

  // Decorative Planter dividing line between Pool Deck and Central Area
  createLowPlanter(26, 27, 34, 0.65, Math.PI / 2);

  // =========================================================================
  // ROW 7: MEGA ARCADE & ENTERTAINMENT GAME ZONE (X = -20 to +20, Z = +20 to +46)
  // =========================================================================
  // North Entrance from Central Concourse: Open Neon Arched Portal at Z = 20
  createWall(-14, 20, 12, WALL_THICKNESS);
  createWall(14, 20, 12, WALL_THICKNESS);

  // Glowing Neon Portal Frame across X = -4 to +4 at Z = 20
  const portalMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
  const portalL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.8, 0.12), portalMat);
  portalL.position.set(-4, 1.4, 20);
  environmentGroup.add(portalL);
  const portalR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.8, 0.12), portalMat);
  portalR.position.set(4, 1.4, 20);
  environmentGroup.add(portalR);
  const portalTop = new THREE.Mesh(new THREE.BoxGeometry(8.12, 0.12, 0.12), portalMat);
  portalTop.position.set(0, 2.8, 20);
  environmentGroup.add(portalTop);

  // 7. Seattle Environment: Asphalt Roads, Sidewalks, Park Benches, Trees & City
  const seattleGroup = new THREE.Group();
  seattleGroup.name = 'env_seattle_group';

  // Asphalt roads
  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.94 });
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.88 });
  const roadMarkMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const benchWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
  const benchMetalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });

  // North Street (Z = -54)
  const northRoad = new THREE.Mesh(new THREE.BoxGeometry(160, 0.08, 14), asphaltMat);
  northRoad.position.set(0, -0.04, -54);
  seattleGroup.add(northRoad);

  // South Street (Z = +54)
  const southRoad = new THREE.Mesh(new THREE.BoxGeometry(160, 0.08, 14), asphaltMat);
  southRoad.position.set(0, -0.04, 54);
  seattleGroup.add(southRoad);

  // West Street (X = -68)
  const westRoad = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 120), asphaltMat);
  westRoad.position.set(-68, -0.04, 0);
  seattleGroup.add(westRoad);

  // Sidewalks directly outside north and south clerestory
  const northSidewalk = new THREE.Mesh(new THREE.BoxGeometry(120, 0.14, 4), sidewalkMat);
  northSidewalk.position.set(0, 0.06, -48.5);
  seattleGroup.add(northSidewalk);

  const southSidewalk = new THREE.Mesh(new THREE.BoxGeometry(120, 0.14, 4), sidewalkMat);
  southSidewalk.position.set(0, 0.06, 48.5);
  seattleGroup.add(southSidewalk);

  // Broken white lane divider lines on roads
  for (let x = -60; x <= 60; x += 6) {
    [-38, 38].forEach((z) => {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.02, 0.18), roadMarkMat);
      dash.position.set(x, 0.03, z);
      seattleGroup.add(dash);
    });
  }

  // Crosswalk zebra stripes
  [-30, 30].forEach((cx) => {
    for (let i = -4; i <= 4; i++) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.025, 3.2), roadMarkMat);
      stripe.position.set(cx + i * 0.75, 0.03, -38);
      seattleGroup.add(stripe);
    }
  });

  // Helper: Wooden Park Bench matching media_1791969444037.png and media_1791969444163.png
  const createParkBench = (x, z, rotY = 0) => {
    const bench = new THREE.Group();

    // Wood seat slats
    for (let s = -0.22; s <= 0.22; s += 0.11) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.09), benchWoodMat);
      slat.position.set(0, 0.45, s);
      slat.castShadow = true;
      bench.add(slat);
    }

    // Wood backrest slats
    for (let b = 0.58; b <= 0.88; b += 0.12) {
      const bSlat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.09, 0.04), benchWoodMat);
      bSlat.position.set(0, b, -0.26);
      bSlat.castShadow = true;
      bench.add(bSlat);
    }

    // Metal legs
    [-0.95, 0.95].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.52), benchMetalMat);
      leg.position.set(lx, 0.22, 0);
      leg.castShadow = true;
      bench.add(leg);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.06), benchMetalMat);
      arm.position.set(lx, 0.55, -0.24);
      bench.add(arm);
    });

    bench.position.set(x, 0.14, z);
    bench.rotation.y = rotY;
    seattleGroup.add(bench);
  };

  // Place Park Benches outside north glass wall (media_1791969444037.png)
  createParkBench(-12, -26.5, 0);
  createParkBench(-6, -26.5, 0);
  createParkBench(6, -26.5, 0);
  createParkBench(14, -26.5, 0);

  // Place Park Benches outside south glass wall (media_1791969444094.png)
  createParkBench(-10, 26.5, Math.PI);
  createParkBench(-4, 26.5, Math.PI);

  // Helper: Low-poly Street Tree matching Spot Virtual (media_1791969444037.png)
  const createStreetTree = (x, z, scale = 1) => {
    const tree = new THREE.Group();

    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 2.4 * scale, 7),
      new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.9 })
    );
    trunk.position.y = 1.2 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    // Green faceted foliage crown
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x367c3b,
      roughness: 0.85,
      flatShading: true
    });

    [
      { r: 1.4 * scale, y: 2.8 * scale, x: 0, z: 0 },
      { r: 1.1 * scale, y: 3.8 * scale, x: 0.2 * scale, z: -0.1 * scale },
      { r: 0.9 * scale, y: 3.2 * scale, x: -0.4 * scale, z: 0.3 * scale }
    ].forEach((tier) => {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(tier.r, 1), foliageMat);
      crown.position.set(tier.x, tier.y, tier.z);
      crown.castShadow = true;
      tree.add(crown);
    });

    tree.position.set(x, 0, z);
    seattleGroup.add(tree);
  };

  // Trees outside north clerestory
  createStreetTree(0, -28, 1.1);
  createStreetTree(-20, -28, 0.95);
  createStreetTree(22, -28, 1.05);

  // Trees outside south clerestory
  createStreetTree(-16, 28, 1.0);
  createStreetTree(2, 28, 1.15);

  // 8. Scenic Outer Zone Environment matching Spot Virtual reference (media_1792144700841.png)
  // Procedural Sky Dome with soft clouds
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 1024;
  skyCanvas.height = 512;
  const sCtx = skyCanvas.getContext('2d');
  const skyGrad = sCtx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, '#2563eb'); // Rich celestial blue at zenith
  skyGrad.addColorStop(0.4, '#60a5fa');
  skyGrad.addColorStop(0.75, '#93c5fd');
  skyGrad.addColorStop(1, '#dbeafe'); // Soft hazy horizon
  sCtx.fillStyle = skyGrad;
  sCtx.fillRect(0, 0, 1024, 512);

  // Soft procedural white cloud layers
  sCtx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  const drawCloud = (cx, cy, scale) => {
    sCtx.beginPath();
    sCtx.arc(cx, cy, 28 * scale, 0, Math.PI * 2);
    sCtx.arc(cx + 25 * scale, cy - 8 * scale, 22 * scale, 0, Math.PI * 2);
    sCtx.arc(cx + 50 * scale, cy, 26 * scale, 0, Math.PI * 2);
    sCtx.arc(cx + 25 * scale, cy + 8 * scale, 24 * scale, 0, Math.PI * 2);
    sCtx.fill();
  };
  drawCloud(180, 220, 1.4);
  drawCloud(420, 180, 1.8);
  drawCloud(720, 240, 1.2);
  drawCloud(900, 200, 1.6);
  drawCloud(300, 310, 1.0);

  const skyTex = new THREE.CanvasTexture(skyCanvas);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(210, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide })
  );
  skyDome.position.y = -5;
  seattleGroup.add(skyDome);

  // Rolling Green Hills on the left horizon (matching media_1792144700841.png)
  const hillMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.95 });
  const hill1 = new THREE.Mesh(new THREE.ConeGeometry(55, 28, 16), hillMat);
  hill1.position.set(-85, 4, -65);
  hill1.scale.set(1.4, 0.7, 1.0);
  seattleGroup.add(hill1);

  const hill2 = new THREE.Mesh(new THREE.ConeGeometry(65, 34, 16), hillMat);
  hill2.position.set(-110, 6, -45);
  hill2.scale.set(1.3, 0.8, 1.2);
  seattleGroup.add(hill2);

  // Low-poly Modern City Skyline in the far distance (Z = -65 to -105, completely outside office)
  const buildingMats = [
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 }), // Modern light grey
    new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.7 }), // Warm tan
    new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 }), // Slate
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })  // Dark charcoal glass
  ];

  const windowMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });

  const createSkylineBuilding = (bx, bz, bw, bh, bd, matIdx) => {
    const bGroup = new THREE.Group();
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), buildingMats[matIdx % buildingMats.length]);
    bMesh.position.y = bh / 2;
    bMesh.castShadow = true;
    bGroup.add(bMesh);

    // Floor window bands
    const floors = Math.floor(bh / 3.2);
    for (let f = 1; f < floors; f++) {
      const winBand = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.05, 0.9, bd + 0.05), windowMat);
      winBand.position.y = f * 3.2;
      bGroup.add(winBand);
    }

    // Rooftop equipment box
    const roofBox = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.4, 2.5, bd * 0.4), buildingMats[2]);
    roofBox.position.y = bh + 1.25;
    bGroup.add(roofBox);

    bGroup.position.set(bx, 0, bz);
    seattleGroup.add(bGroup);
  };

  // Far City Towers along the north horizon
  createSkylineBuilding(-38, -75, 16, 26, 14, 0);
  createSkylineBuilding(-18, -82, 14, 34, 12, 1);
  createSkylineBuilding(0, -78, 18, 28, 16, 2);
  createSkylineBuilding(22, -88, 15, 38, 14, 0);
  createSkylineBuilding(42, -76, 20, 24, 16, 3);
  createSkylineBuilding(64, -84, 16, 30, 14, 1);

  // Distant Architectural Ferris Wheel (matching media_1792144700841.png)
  const ferrisWheelGroup = new THREE.Group();
  ferrisWheelGroup.position.set(30, 15, -82);

  const wheelWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
  const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(12.5, 0.25, 8, 32), wheelWhiteMat);
  ferrisWheelGroup.add(wheelRim);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16), wheelWhiteMat);
  hub.rotation.x = Math.PI / 2;
  ferrisWheelGroup.add(hub);

  // 12 Radial Spokes & Passenger Gondolas
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.12, 12.4, 0.12), wheelWhiteMat);
    spoke.position.set((Math.cos(angle) * 12.4) / 2, (Math.sin(angle) * 12.4) / 2, 0);
    spoke.rotation.z = angle - Math.PI / 2;
    ferrisWheelGroup.add(spoke);

    // Gondola cabin
    const gondola = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 })
    );
    gondola.position.set(Math.cos(angle) * 12.5, Math.sin(angle) * 12.5 - 0.4, 0);
    ferrisWheelGroup.add(gondola);
  }

  // Support A-frame legs
  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 17, 8), wheelWhiteMat);
    leg.position.set(side * 3.5, -7.5, 0);
    leg.rotation.z = side * 0.22;
    ferrisWheelGroup.add(leg);
  });
  seattleGroup.add(ferrisWheelGroup);

  // Modern Outdoor Terrace Deck Furniture & Lush Planters (matching media_1792144700841.png right side)
  const planterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85, flatShading: true });
  const flowerMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 }); // Lavender purple flowers
  const outdoorSofaMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
  const outdoorCushionMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.25 });

  const createTerracePlanter = (px, pz, length = 12) => {
    const pGroup = new THREE.Group();
    // Long black trough
    const box = new THREE.Mesh(new THREE.BoxGeometry(length, 0.75, 0.9), planterMat);
    box.position.y = 0.38;
    box.castShadow = true;
    pGroup.add(box);

    // Green hedge shrubs filling box
    const shrubs = Math.floor(length / 1.5);
    for (let i = 0; i < shrubs; i++) {
      const sx = -length / 2 + 0.75 + i * 1.5;
      const hedge = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), hedgeMat);
      hedge.position.set(sx, 0.9, 0);
      hedge.scale.set(1.2, 0.85, 0.9);
      pGroup.add(hedge);

      // Purple flower buds
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), flowerMat);
      fl.position.set(sx + 0.2, 1.35, 0.1);
      pGroup.add(fl);
    }

    pGroup.position.set(px, 0, pz);
    seattleGroup.add(pGroup);
  };

  // Place continuous planter boxes directly outside the clerestory glass
  createTerracePlanter(-18, -25.2, 14);
  createTerracePlanter(0, -25.2, 14);
  createTerracePlanter(18, -25.2, 14);

  // Modern Outdoor Curved Lounge Sofas & Round Cocktail Tables (matching media_1792144700841.png)
  const createTerraceLoungeSet = (lx, lz) => {
    const lGroup = new THREE.Group();
    // Curved banquette sofa
    const sofaBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.42, 16, 1, false, 0, Math.PI),
      outdoorSofaMat
    );
    sofaBase.position.y = 0.21;
    sofaBase.castShadow = true;
    lGroup.add(sofaBase);

    const cushion = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.12, 16, 1, false, 0, Math.PI),
      outdoorCushionMat
    );
    cushion.position.y = 0.45;
    lGroup.add(cushion);

    // Curved backrest with gold base trim
    const backrest = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.45, 16, 1, true, 0, Math.PI),
      outdoorSofaMat
    );
    backrest.position.y = 0.65;
    lGroup.add(backrest);

    // Low round brass coffee table in front of lounge
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 16), goldTrimMat);
    table.position.set(0, 0.18, 0.6);
    table.castShadow = true;
    lGroup.add(table);

    lGroup.position.set(lx, 0.08, lz);
    seattleGroup.add(lGroup);
  };

  createTerraceLoungeSet(-10, -28.5);
  createTerraceLoungeSet(2, -28.5);
  createTerraceLoungeSet(14, -28.5);

  // Register interactive doors and office walls on scene.userData
  scene.userData.interactiveDoors = doorsList;
  scene.userData.officeWalls = wallsList;

  return {
    materials,
    environmentGroup,
    walls: wallsList,
    doors: doorsList,
    setEnvironment: (theme) => {
      // Toggle environment themes dynamically
      if (theme === 'Beach') {
        seattleGroup.visible = false;
        hemiLight.color.setHex(0xfff7ed);
        sunLight.color.setHex(0xfef08a);
      } else if (theme === 'Desert' || theme === 'Simple Desert') {
        seattleGroup.visible = false;
        hemiLight.color.setHex(0xfef3c7);
        sunLight.color.setHex(0xfde68a);
      } else if (theme === 'Park') {
        seattleGroup.visible = false;
        hemiLight.color.setHex(0xdcfce7);
        sunLight.color.setHex(0xecfdf5);
      } else if (theme === 'Park Night' || theme === 'Moon' || theme === 'Mars') {
        seattleGroup.visible = false;
        hemiLight.color.setHex(0x1e293b);
        sunLight.color.setHex(0x60a5fa);
      } else {
        // Seattle (Default)
        seattleGroup.visible = true;
        hemiLight.color.setHex(0xffffff);
        sunLight.color.setHex(0xfffef5);
      }
    }
  };
}
