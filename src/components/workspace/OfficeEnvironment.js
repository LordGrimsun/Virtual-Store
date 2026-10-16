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
  const sCam = 36;
  sunLight.shadow.camera.left = -sCam;
  sunLight.shadow.camera.right = sCam;
  sunLight.shadow.camera.top = sCam;
  sunLight.shadow.camera.bottom = -sCam;
  sunLight.shadow.bias = -0.00015;
  sunLight.shadow.normalBias = 0.025;
  environmentGroup.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xd9ebff, 0.6);
  fillLight.position.set(-20, 30, -20);
  environmentGroup.add(fillLight);

  // 3. Main Interior Floor Mesh (Width: 64, Depth: 48)
  const floorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(64, 0.4, 48),
    materials.floorMat
  );
  floorMesh.position.set(0, -0.2, 0);
  floorMesh.receiveShadow = true;
  floorMesh.name = 'floor';
  environmentGroup.add(floorMesh);

  // Patio outdoor floor overlay (x: -32 to -14, z: -24 to -8)
  const patioFloor = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.42, 16),
    materials.patioFloorMat
  );
  patioFloor.position.set(-23, -0.19, -16);
  patioFloor.receiveShadow = true;
  environmentGroup.add(patioFloor);

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

  const doorsList = [];

  // Helper: Interactive Double Doorway with swinging hinge pivots & brass handles
  const createDoubleDoor = (x, z, rotY = 0) => {
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

    // Interactive state for smooth animation and collision checking
    doorGroup.userData = {
      isInteractiveDoor: true,
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

  // 5. Build the Exact 12-Room Wall Blueprint (media_1791969443822.png)
  // Overall interior dimensions: X = [-32, +32], Z = [-24, +24]

  // Outer Perimeter Walls:
  // South Wall (Z = +24): Glass clerestory looking out onto the south sidewalk/trees!
  // North Wall (Z = -24): Glass clerestory looking out onto Seattle street!
  // West Wall (Z = -32): Solid exterior wall + monolith
  createWall(-32, 0, WALL_THICKNESS, 48);
  // East Wall (Z = +32): Solid exterior wall
  createWall(32, 0, WALL_THICKNESS, 48);

  // Transparent Clerestory Windows with mullions on North & South Perimeters
  const createClerestoryFacade = (zPos) => {
    for (let x = -30; x <= 30; x += 6) {
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
  createClerestoryFacade(-24); // North clerestory
  createClerestoryFacade(24);  // South clerestory

  // Internal Horizontal Dividers:
  // Divider between Row 3 (North) and Row 2 (Middle): Z = -8
  // Patio partition (X = -32 to -14)
  createWall(-23, -8, 18, WALL_THICKNESS);
  // Workspace A partition (X = -14 to +14, with entryway openings at -3 and +3)
  createWall(-8.5, -8, 11, WALL_THICKNESS);
  createWall(8.5, -8, 11, WALL_THICKNESS);
  // Lobby partition (X = +14 to +32, with doorway)
  createWall(23, -8, 18, WALL_THICKNESS);

  // Divider between Row 2 (Middle) and Row 1 (South): Z = +8
  // Auditorium north wall (X = -32 to -16)
  createWall(-24, 8, 16, WALL_THICKNESS);
  // Boardroom north wall with double door (X = -16 to -2):
  createWall(-14, 8, 4, WALL_THICKNESS);
  createDoubleDoor(-9, 8, 0); // Double doors into Boardroom
  createWall(-4, 8, 4, WALL_THICKNESS);
  // Conference B north wall with double door (X = -2 to +12):
  createWall(0.5, 8, 5, WALL_THICKNESS);
  createDoubleDoor(5, 8, 0);  // Double doors into Conference B
  createWall(9.5, 8, 5, WALL_THICKNESS);
  // Conference A north wall with double door (X = +12 to +26):
  createWall(14.5, 8, 5, WALL_THICKNESS);
  createDoubleDoor(19, 8, 0); // Double doors into Conference A
  createWall(23.5, 8, 5, WALL_THICKNESS);

  // Internal Vertical Dividers:
  // Between Auditorium and Boardroom (X = -16, Z = +8 to +24)
  createWall(-16, 16, WALL_THICKNESS, 16);

  // Between Boardroom and Conference B (X = -2, Z = +8 to +24)
  createWall(-2, 16, WALL_THICKNESS, 16);

  // Between Conference B and Conference A (X = +12, Z = +8 to +24)
  createWall(12, 16, WALL_THICKNESS, 16);

  // Between Patio and Workspace A (X = -14, Z = -24 to -8)
  createWall(-14, -16, WALL_THICKNESS, 16);

  // Between Workspace A and Lobby (X = +14, Z = -24 to -8)
  createWall(14, -16, WALL_THICKNESS, 16);

  // In Row 2 (Middle Row):
  // Between Lounge C and Lounge B (X = -10, Z = -8 to +8, with central open portal)
  createWall(-10, -5, WALL_THICKNESS, 6);
  createWall(-10, 5, WALL_THICKNESS, 6);

  // Chat A and Chat B Private Booth Enclosures (X: +8 to +16):
  // West wall of Chat pods (X = +8, Z = -8 to +8)
  createWall(8, -4, WALL_THICKNESS, 8);
  createWall(8, 4, WALL_THICKNESS, 8);
  // Partition dividing Chat A and Chat B (Z = 0, X = +8 to +16)
  createWall(12, 0, 8, WALL_THICKNESS);
  // East wall of Chat pods (X = +16, Z = -8 to +8)
  createWall(16, -4, WALL_THICKNESS, 8);
  createWall(16, 4, WALL_THICKNESS, 8);

  // Door openings into Chat A and Chat B (sliding glass / open portal)
  // Lounge A is located to the right of Chat A & B (X = +16 to +32, Z = -8 to +8)

  // 6. Giant Spot Vertical Signboard / Monolith outside Auditorium (media_1791969443822.png)
  const monolithGrp = new THREE.Group();
  const monolith = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 11, 14),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.5 })
  );
  monolith.position.set(-34.5, 5.5, 16);
  monolith.castShadow = true;
  monolithGrp.add(monolith);

  // Green circular Spot emblem on Monolith
  const spotCircle = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32),
    new THREE.MeshBasicMaterial({ color: 0x10b981 })
  );
  spotCircle.rotation.z = Math.PI / 2;
  spotCircle.position.set(-34.0, 7.5, 14);
  monolithGrp.add(spotCircle);

  // Spot lowercase typography plaque
  if (screenTextures?.logoTexture) {
    const spotSign = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 2.5),
      new THREE.MeshBasicMaterial({ map: screenTextures.logoTexture, transparent: true })
    );
    spotSign.rotation.y = Math.PI / 2;
    spotSign.position.set(-34.05, 5.5, 16);
    monolithGrp.add(spotSign);
  }
  environmentGroup.add(monolithGrp);

  // 7. Seattle Environment: Asphalt Roads, Sidewalks, Park Benches, Trees & City
  const seattleGroup = new THREE.Group();
  seattleGroup.name = 'env_seattle_group';

  // Asphalt roads
  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.94 });
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.88 });
  const roadMarkMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const benchWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
  const benchMetalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });

  // North Street (Z = -38)
  const northRoad = new THREE.Mesh(new THREE.BoxGeometry(140, 0.08, 14), asphaltMat);
  northRoad.position.set(0, -0.04, -38);
  seattleGroup.add(northRoad);

  // South Street (Z = +38)
  const southRoad = new THREE.Mesh(new THREE.BoxGeometry(140, 0.08, 14), asphaltMat);
  southRoad.position.set(0, -0.04, 38);
  seattleGroup.add(southRoad);

  // West Street (X = -46)
  const westRoad = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 90), asphaltMat);
  westRoad.position.set(-46, -0.04, 0);
  seattleGroup.add(westRoad);

  // Sidewalks directly outside north and south clerestory
  const northSidewalk = new THREE.Mesh(new THREE.BoxGeometry(80, 0.14, 4), sidewalkMat);
  northSidewalk.position.set(0, 0.06, -26.5);
  seattleGroup.add(northSidewalk);

  const southSidewalk = new THREE.Mesh(new THREE.BoxGeometry(80, 0.14, 4), sidewalkMat);
  southSidewalk.position.set(0, 0.06, 26.5);
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
