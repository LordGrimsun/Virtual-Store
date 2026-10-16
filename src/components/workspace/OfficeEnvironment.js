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

  // 4. Exact Wall Builder Helpers
  const WALL_HEIGHT = 6.0;
  const WALL_THICKNESS = 0.32;

  const createWall = (x, z, width, depth, height = WALL_HEIGHT, mat = materials.wallMat) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
    wall.position.set(x, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    environmentGroup.add(wall);

    // Wall top trim cap
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.04, 0.08, depth + 0.04),
      materials.wallTrimMat
    );
    trim.position.set(x, height + 0.04, z);
    environmentGroup.add(trim);

    return wall;
  };

  // Helper: Double Doorway with grey doors and horizontal brass handles
  const createDoubleDoor = (x, z, rotY = 0) => {
    const doorGroup = new THREE.Group();

    doorGroup.name = 'doorway_group';

    // Door frame
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.4, 0.36), materials.doorFrameMat);
    frameLeft.position.set(-1.45, 2.2, 0);
    frameLeft.name = 'doorway_mesh';
    frameLeft.userData = { isDoorway: true };
    doorGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.4, 0.36), materials.doorFrameMat);
    frameRight.position.set(1.45, 2.2, 0);
    frameRight.name = 'doorway_mesh';
    frameRight.userData = { isDoorway: true };
    doorGroup.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.12, 0.36), materials.doorFrameMat);
    frameTop.position.set(0, 4.46, 0);
    frameTop.name = 'doorway_mesh';
    frameTop.userData = { isDoorway: true };
    doorGroup.add(frameTop);

    // Left door leaf
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.36, 4.34, 0.08), materials.doorMat);
    doorL.position.set(-0.7, 2.17, 0);
    doorL.castShadow = true;
    doorL.name = 'doorway_mesh';
    doorL.userData = { isDoorway: true };
    doorGroup.add(doorL);

    // Right door leaf
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.36, 4.34, 0.08), materials.doorMat);
    doorR.position.set(0.7, 2.17, 0);
    doorR.castShadow = true;
    doorR.name = 'doorway_mesh';
    doorR.userData = { isDoorway: true };
    doorGroup.add(doorR);

    // Brass horizontal handles
    [-1, 1].forEach((side) => {
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.45, 12),
        materials.brassHandleMat
      );
      handle.rotation.z = Math.PI / 2;
      handle.position.set(side * 0.18, 2.1, 0.06);
      handle.name = 'doorway_mesh';
      handle.userData = { isDoorway: true };
      doorGroup.add(handle);
    });

    doorGroup.position.set(x, 0, z);
    doorGroup.rotation.y = rotY;
    environmentGroup.add(doorGroup);
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

  // City Skyline Buildings completely removed to ensure all office rooms are 100% unobstructed
  // seattleGroup now keeps only the ground landscape and trees far outside the clerestory glass
  environmentGroup.add(seattleGroup);

  return {
    materials,
    environmentGroup,
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
