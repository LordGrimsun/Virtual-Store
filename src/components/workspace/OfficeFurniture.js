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

  // Common Materials
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.85 });
  const blackLeatherMat = new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.7 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const whiteChairMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.65 });
  const tubArmchairMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
  const brassGoldMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const darkTableMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
  const woodDeskMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
  const screenBezelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4 });
  const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const turquoiseMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.65 });
  const cushionYellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 });
  const cushionOrangeMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 });

  const roundedBox = (width, height, depth, radius = 0.045) => {
    const safeRadius = Math.max(0.005, Math.min(radius, width * 0.45, height * 0.45, depth * 0.45));
    return new RoundedBoxGeometry(width, height, depth, 3, safeRadius);
  };

  const screensMap = {};

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

  // Helper: Cantilever Sled-Base White Conference Chair (media_1791969444037.png)
  const createCantileverChair = (cx, cz, crot, chairName = 'Conference Chair') => {
    const chair = new THREE.Group();
    const chairPos = new THREE.Vector3(cx, 0, cz);

    // Chrome sled tubular base
    const skidL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.58), chromeMat);
    skidL.position.set(-0.25, 0.035, 0);
    chair.add(skidL);

    const skidR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.58), chromeMat);
    skidR.position.set(0.25, 0.035, 0);
    chair.add(skidR);

    // Cantilever upright risers
    const riserL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.42, 0.035), chromeMat);
    riserL.position.set(-0.25, 0.24, -0.27);
    chair.add(riserL);

    const riserR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.42, 0.035), chromeMat);
    riserR.position.set(0.25, 0.24, -0.27);
    chair.add(riserR);

    // White leather cushion seat (top at y = 0.49)
    const seat = new THREE.Mesh(roundedBox(0.52, 0.08, 0.48, 0.03), whiteChairMat);
    seat.position.set(0, 0.45, 0);
    seat.castShadow = true;
    seat.name = 'clickable_chair';
    seat.userData = { isChair: true, name: chairName, chairPos, chairRotY: crot, seatHeight: 0.46 };
    chair.add(seat);

    // White ribbed backrest
    const back = new THREE.Mesh(roundedBox(0.48, 0.48, 0.06, 0.03), whiteChairMat);
    back.position.set(0, 0.72, -0.23);
    back.castShadow = true;
    back.name = 'clickable_chair';
    back.userData = { isChair: true, name: chairName, chairPos, chairRotY: crot, seatHeight: 0.46 };
    chair.add(back);

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

  // Helper: Black 3-Seater Sofa (media_1791969444037.png)
  const createBlackSofa = (cx, cz, crot, sofaName = 'Boardroom Sofa') => {
    const sofa = new THREE.Group();
    const defaultCenterPos = new THREE.Vector3(
      cx + 0.12 * Math.sin(crot),
      0,
      cz + 0.12 * Math.cos(crot)
    );
    sofa.name = 'clickable_chair';
    sofa.userData = { isChair: true, name: sofaName, chairPos: defaultCenterPos, chairRotY: crot, seatHeight: 0.46 };

    // Base plinth
    const base = new THREE.Mesh(roundedBox(2.4, 0.22, 0.88, 0.06), blackMat);
    base.position.y = 0.2;
    base.castShadow = true;
    sofa.add(base);

    // 3 Individual Seat Cushions with accurate world positions
    [-0.72, 0, 0.72].forEach((sx, idx) => {
      const cosR = Math.cos(crot);
      const sinR = Math.sin(crot);
      const localZ = 0.08;
      const worldX = cx + sx * cosR + localZ * sinR;
      const worldZ = cz - sx * sinR + localZ * cosR;
      const cushionWorldPos = new THREE.Vector3(worldX, 0, worldZ);

      const cushion = new THREE.Mesh(roundedBox(0.68, 0.16, 0.62, 0.05), blackLeatherMat);
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

      if (chairsRef?.current) {
        chairsRef.current.push({
          name: `${sofaName} Cushion ${idx + 1}`,
          pos: cushionWorldPos,
          rot: crot,
          seatHeight: 0.46
        });
      }
    });

    // Backrest
    const back = new THREE.Mesh(roundedBox(2.36, 0.52, 0.22, 0.06), blackLeatherMat);
    back.position.set(0, 0.64, -0.32);
    back.castShadow = true;
    back.name = 'clickable_chair';
    back.userData = { isChair: true, name: sofaName, chairPos: defaultCenterPos, chairRotY: crot, seatHeight: 0.46 };
    sofa.add(back);

    // Left and right armrests
    [-1.12, 1.12].forEach((ax) => {
      const arm = new THREE.Mesh(roundedBox(0.18, 0.36, 0.84, 0.05), blackLeatherMat);
      arm.position.set(ax, 0.46, 0);
      arm.castShadow = true;
      sofa.add(arm);
    });

    sofa.position.set(cx, 0, cz);
    sofa.rotation.y = crot;
    furnitureGroup.add(sofa);

    return sofa;
  };

  // Helper: White Tub Armchair with brass legs (media_1791969444037.png)
  const createTubArmchair = (cx, cz, crot, chairName = 'Boardroom Tub Chair') => {
    const chair = new THREE.Group();
    const tubPos = new THREE.Vector3(cx, 0, cz);
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos: tubPos, chairRotY: crot, seatHeight: 0.46 };

    // Tub curved bucket seat
    const tub = new THREE.Mesh(roundedBox(0.82, 0.52, 0.78, 0.12), tubArmchairMat);
    tub.position.y = 0.42;
    tub.castShadow = true;
    tub.name = 'clickable_chair';
    tub.userData = { isChair: true, name: chairName, chairPos: tubPos, chairRotY: crot, seatHeight: 0.46 };
    chair.add(tub);

    // Deep seat cushion
    const cushion = new THREE.Mesh(roundedBox(0.64, 0.14, 0.58, 0.05), whiteMat);
    cushion.position.set(0, 0.42, 0.06);
    cushion.name = 'clickable_chair';
    cushion.userData = { isChair: true, name: chairName, chairPos: tubPos, chairRotY: crot, seatHeight: 0.46 };
    chair.add(cushion);

    // 4 Splayed Brass Legs
    [-1, 1].forEach((lx) => {
      [-1, 1].forEach((lz) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.026, 0.28, 10),
          brassGoldMat
        );
        leg.position.set(lx * 0.28, 0.14, lz * 0.26);
        chair.add(leg);
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

  // Helper: Low Circular Black Coffee Table with Gold Pedestal/Legs
  const createRoundCoffeeTable = (cx, cz, radius = 0.7, height = 0.42) => {
    const table = new THREE.Group();

    // Dark circular tabletop
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.05, 32),
      darkTableMat
    );
    top.position.y = height;
    top.castShadow = true;
    table.add(top);

    // Gold pedestal base
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.055, height - 0.05, 16),
      brassGoldMat
    );
    stem.position.y = (height - 0.05) / 2;
    table.add(stem);

    const basePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, 0.025, 24),
      brassGoldMat
    );
    basePlate.position.y = 0.015;
    table.add(basePlate);

    table.position.set(cx, 0, cz);
    furnitureGroup.add(table);
    return table;
  };

  // Helper: Small Gold Drink Table
  const createDrinkTable = (cx, cz) => {
    const table = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 20), brassGoldMat);
    top.position.y = 0.48;
    table.add(top);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.48, 10), brassGoldMat);
    leg.position.y = 0.24;
    table.add(leg);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 20), brassGoldMat);
    base.position.y = 0.01;
    table.add(base);

    table.position.set(cx, 0, cz);
    furnitureGroup.add(table);
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

  // Helper: Stylized Potted Ficus Tree (media_1792165933956.png & media_1792165947435.png)
  const createPottedPlant = (cx, cz, plantName = 'Ficus Plant') => {
    const plant = new THREE.Group();
    // Ceramic cylindrical pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.26, 0.58, 20),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 })
    );
    pot.position.y = 0.29;
    pot.castShadow = true;
    plant.add(pot);

    // Soil
    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.30, 0.30, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.95 })
    );
    soil.position.y = 0.56;
    plant.add(soil);

    // Branches & vibrant green leaves
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65 });

    const stem1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.2, 8), branchMat);
    stem1.position.set(0, 0.95, 0);
    plant.add(stem1);

    const leaves = [
      { x: 0, y: 1.5, z: 0, s: 0.45 },
      { x: 0.22, y: 1.3, z: 0.15, s: 0.35 },
      { x: -0.20, y: 1.25, z: -0.15, s: 0.36 },
      { x: 0.15, y: 1.05, z: -0.22, s: 0.32 },
      { x: -0.18, y: 0.95, z: 0.20, s: 0.32 }
    ];

    leaves.forEach((lf) => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(lf.s, 7, 7), leafMat);
      leaf.position.set(lf.x, lf.y, lf.z);
      leaf.scale.set(1.2, 0.7, 1.1);
      leaf.castShadow = true;
      plant.add(leaf);
    });

    plant.position.set(cx, 0, cz);
    furnitureGroup.add(plant);
    return plant;
  };

  // Helper: Curved Pillowy Cream Sofa (media_1792165933956.png)
  const createCreamCurvedSofa = (cx, cz, crot, sofaName = 'Meeting Cabin Curved Sofa') => {
    const sofa = new THREE.Group();
    const defaultCenterPos = new THREE.Vector3(
      cx + 0.12 * Math.sin(crot),
      0,
      cz + 0.12 * Math.cos(crot)
    );
    sofa.name = 'clickable_chair';
    sofa.userData = { isChair: true, name: sofaName, chairPos: defaultCenterPos, chairRotY: crot, seatHeight: 0.46 };

    const creamLeatherMat = new THREE.MeshStandardMaterial({ color: 0xf3f0ea, roughness: 0.72 });
    const creamDarkMat = new THREE.MeshStandardMaterial({ color: 0xe2ded7, roughness: 0.8 });

    // Rounded tubular base plinth
    const base = new THREE.Mesh(roundedBox(2.8, 0.22, 1.05, 0.10), creamDarkMat);
    base.position.y = 0.18;
    base.castShadow = true;
    sofa.add(base);

    // Pillowy curved seat cushion
    const cushion = new THREE.Mesh(roundedBox(2.6, 0.24, 0.92, 0.12), creamLeatherMat);
    cushion.position.set(0, 0.34, 0.06);
    cushion.castShadow = true;
    cushion.name = 'clickable_chair';
    cushion.userData = sofa.userData;
    sofa.add(cushion);

    // Rounded pillowy backrest
    const back = new THREE.Mesh(roundedBox(2.7, 0.48, 0.30, 0.14), creamLeatherMat);
    back.position.set(0, 0.58, -0.36);
    back.castShadow = true;
    back.name = 'clickable_chair';
    back.userData = sofa.userData;
    sofa.add(back);

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

  // Helper: Cream Bench Armchair with Black Base (media_1792165947435.png)
  const createBenchArmchair = (cx, cz, crot, chairName = 'Lounge Bench Armchair') => {
    const chair = new THREE.Group();
    const benchPos = new THREE.Vector3(cx, 0, cz);
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos: benchPos, chairRotY: crot, seatHeight: 0.44 };

    // Dark base frame
    const base = new THREE.Mesh(roundedBox(1.3, 0.14, 0.72, 0.04), blackMat);
    base.position.y = 0.12;
    chair.add(base);

    // Thick ribbed cream seat cushion
    const cushion = new THREE.Mesh(
      roundedBox(1.24, 0.22, 0.68, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.68 })
    );
    cushion.position.y = 0.30;
    cushion.castShadow = true;
    cushion.name = 'clickable_chair';
    cushion.userData = chair.userData;
    chair.add(cushion);

    // Low backrest
    const back = new THREE.Mesh(
      roundedBox(1.24, 0.26, 0.16, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.68 })
    );
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

  // Helper: Curved Black Armchair with Gold Trim for Window Promenade (media_1792165933914.png)
  const createWindowArmchair = (cx, cz, crot, chairName = 'Window Armchair') => {
    const chair = new THREE.Group();
    const chairPos = new THREE.Vector3(cx, 0, cz);
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos, chairRotY: crot, seatHeight: 0.46 };

    // Gold circular base trim
    const goldRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.04, 24),
      brassGoldMat
    );
    goldRing.position.y = 0.02;
    chair.add(goldRing);

    // Curved black bucket body
    const body = new THREE.Mesh(
      roundedBox(0.84, 0.54, 0.82, 0.14),
      blackLeatherMat
    );
    body.position.y = 0.38;
    body.castShadow = true;
    body.name = 'clickable_chair';
    body.userData = chair.userData;
    chair.add(body);

    // Black cushion
    const cushion = new THREE.Mesh(
      roundedBox(0.68, 0.12, 0.64, 0.06),
      blackMat
    );
    cushion.position.set(0, 0.42, 0.06);
    cushion.name = 'clickable_chair';
    cushion.userData = chair.userData;
    chair.add(cushion);

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

  // Large Dark Conference Table (8.0m long x 1.8m wide)
  const boardTable = new THREE.Mesh(roundedBox(8.0, 0.1, 1.8, 0.06), darkTableMat);
  boardTable.position.set(-23.0, 0.74, -16.0);
  boardTable.castShadow = true;
  furnitureGroup.add(boardTable);

  // Table plinth pedestals
  [-2.6, 0, 2.6].forEach((px) => {
    const leg = new THREE.Mesh(roundedBox(0.18, 0.68, 1.2, 0.04), blackMat);
    leg.position.set(-23.0 + px, 0.36, -16.0);
    furnitureGroup.add(leg);
  });

  // 12 White Cantilever Chairs (6 north, 6 south) matching media_1792165933867.png
  [-3.0, -1.8, -0.6, 0.6, 1.8, 3.0].forEach((cx, idx) => {
    createCantileverChair(-23.0 + cx, -17.2, 0, `Boardroom North Chair ${idx + 1}`);
    createCantileverChair(-23.0 + cx, -14.8, Math.PI, `Boardroom South Chair ${idx + 1}`);
  });

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

  // Gold side table with dome lamp next to north sofa
  createDrinkTable(-1.6, -18.2);
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.22, 16), brassGoldMat);
  lampBase.position.set(-1.6, 0.59, -18.2);
  furnitureGroup.add(lampBase);
  const lampDome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), whiteMat);
  lampDome.position.set(-1.6, 0.70, -18.2);
  furnitureGroup.add(lampDome);

  // Potted ficus plant
  createPottedPlant(-12.0, -14.5, 'Meeting Cabin Plant');

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

  // Sleek Black Speaker Podium / Lectern on stage
  const audPodium = new THREE.Mesh(
    roundedBox(0.65, 1.1, 0.55, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
  );
  audPodium.position.set(27.4, 0.70, -10.0);
  audPodium.rotation.y = -Math.PI / 2;
  audPodium.castShadow = true;
  furnitureGroup.add(audPodium);

  // 2 Stepped Stadium Seating Tiers facing East towards the cinema screen (Exact match to media_1792207254846.png)
  const audTiers = [
    { x: 21.0, y: 0.00, riserH: 0.00 },
    { x: 17.5, y: 0.32, riserH: 0.32 }
  ];

  audTiers.forEach((tier, tIdx) => {
    // Stepped concrete/carpet riser floor
    if (tier.riserH > 0) {
      const riserStep = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, tier.riserH, 14.6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
      );
      riserStep.position.set(tier.x, tier.riserH / 2, -10.0);
      riserStep.receiveShadow = true;
      furnitureGroup.add(riserStep);
    }

    // Long dark charcoal stadium bench (matching media_1792165933914.png)
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

    // 8 Individually clickable seat cushions along each bench
    for (let s = 0; s < 8; s++) {
      const sz = -15.25 + s * 1.5;
      const seatWorldPos = new THREE.Vector3(tier.x, tier.y, sz);
      const facingEastRot = Math.PI / 2; // Facing East towards the big cinema screen

      const cushion = new THREE.Mesh(roundedBox(0.72, 0.08, 1.25, 0.04), blackMat);
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

    // Center disc (highest)
    const d1 = new THREE.Mesh(new THREE.CylinderGeometry(0.70, 0.70, 0.045, 32), darkTableMat);
    d1.position.set(0, 0.42, 0);
    d1.castShadow = true;
    cluster.add(d1);
    const stem1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.40, 16), brassGoldMat);
    stem1.position.set(0, 0.20, 0);
    cluster.add(stem1);
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.025, 24), brassGoldMat);
    base1.position.set(0, 0.015, 0);
    cluster.add(base1);

    // Overlapping disc 2 (left/south)
    const d2 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.045, 32), darkTableMat);
    d2.position.set(-0.85, 0.36, 0.45);
    d2.castShadow = true;
    cluster.add(d2);
    const stem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.34, 16), brassGoldMat);
    stem2.position.set(-0.85, 0.17, 0.45);
    cluster.add(stem2);
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.025, 24), brassGoldMat);
    base2.position.set(-0.85, 0.015, 0.45);
    cluster.add(base2);

    // Overlapping disc 3 (right/south)
    const d3 = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.60, 0.045, 32), darkTableMat);
    d3.position.set(0.80, 0.38, 0.40);
    d3.castShadow = true;
    cluster.add(d3);
    const stem3 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.36, 16), brassGoldMat);
    stem3.position.set(0.80, 0.18, 0.40);
    cluster.add(stem3);
    const base3 = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.025, 24), brassGoldMat);
    base3.position.set(0.80, 0.015, 0.40);
    cluster.add(base3);

    cluster.position.set(cx, 0, cz);
    furnitureGroup.add(cluster);

    // Flower vase on center disc
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
  // 5. EAST PROMENADE WINDOW SEATING (X = +22 to +32, Z = +6 to +24)
  // Exact match to media_1792165933867.png & media_1792165933914.png
  // Pairs of curved black armchairs with cocktail tables looking out at Seattle
  // =========================================================================
  [7.0, 12.0, 17.0, 22.0].forEach((wz, idx) => {
    // Round cocktail table
    createRoundCoffeeTable(29.4, wz, 0.52, 0.46);
    createFlowerVase(29.4, 0.46, wz);

    // North facing armchair
    createWindowArmchair(29.4, wz - 1.25, 0, `Window Promenade Set ${idx + 1} North Chair`);
    // South facing armchair
    createWindowArmchair(29.4, wz + 1.25, Math.PI, `Window Promenade Set ${idx + 1} South Chair`);
  });

  // =========================================================================
  // 6. SOUTH WING: FOCUS CUBICLES, WORKSPACE A & PATIO
  // =========================================================================

  // Focus Cubicle 1 (Private pod at x = -22.5, z = 11.0)
  const cubicle1Desk = new THREE.Mesh(roundedBox(2.2, 0.08, 1.2, 0.04), woodDeskMat);
  cubicle1Desk.position.set(-22.5, 0.74, 11.0);
  furnitureGroup.add(cubicle1Desk);

  createWorkstationMonitor(
    -22.5, 0.78, 10.65, 0,
    'desk_cubicle_1',
    screenTextures?.createCodeEditorTexture ? screenTextures.createCodeEditorTexture('FocusProject.rs') : screenTextures?.codeEditorTexture,
    'Focus Cubicle 1 Workstation'
  );
  createCantileverChair(-22.5, 11.8, Math.PI, 'Focus Cubicle 1 Chair');

  // Focus Cubicle 2 (Private pod at x = -16.5, z = 11.0)
  const cubicle2Desk = new THREE.Mesh(roundedBox(2.2, 0.08, 1.2, 0.04), woodDeskMat);
  cubicle2Desk.position.set(-16.5, 0.74, 11.0);
  furnitureGroup.add(cubicle2Desk);

  createWorkstationMonitor(
    -16.5, 0.78, 10.65, 0,
    'desk_cubicle_2',
    screenTextures?.createDesignCanvasTexture ? screenTextures.createDesignCanvasTexture() : screenTextures?.chartTexture,
    'Focus Cubicle 2 Workstation'
  );
  createCantileverChair(-16.5, 11.8, Math.PI, 'Focus Cubicle 2 Chair');

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

  // Workspace A Team CI/CD Screen on South wall
  createSpotWallScreen(
    0, 1.55, 23.8, 3.8, 2.1, Math.PI, 'workspace_a',
    screenTextures?.createCiCdMonitorTexture ? screenTextures.createCiCdMonitorTexture() : screenTextures?.chartTexture,
    'Workspace A Team CI/CD Monitor'
  );

  // Patio Outdoor Game Zone: Giant 8x8 Chessboard at (x: -23.0, z: 19.0)
  const chessGrp = new THREE.Group();
  chessGrp.name = 'clickable_chessboard';
  chessGrp.userData = { isChessboard: true, name: 'Giant Terrace Chessboard' };

  const boardSize = 5.2;
  const squareSize = boardSize / 8;
  const whiteTileMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const blackTileMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

  const border = new THREE.Mesh(
    roundedBox(boardSize + 0.3, 0.05, boardSize + 0.3, 0.04),
    brassGoldMat
  );
  border.position.y = 0.015;
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
  chessGrp.position.set(-23.0, 0, 19.0);
  furnitureGroup.add(chessGrp);

  // Patio Sunken Turquoise Lounge Pit (x: -18, z: 20)
  const patioPit = new THREE.Mesh(roundedBox(3.8, 0.32, 3.8, 0.1), turquoiseMat);
  patioPit.position.set(-18.0, 0.16, 20.0);
  furnitureGroup.add(patioPit);
  createRoundCoffeeTable(-18.0, 20.0, 0.65, 0.30);

  // Conference A Screen (Lobby/Presentation: x: 19, z: 20)
  createSpotWallScreen(
    19.0, 1.55, 23.8, 3.2, 1.8, Math.PI, 'conference_a',
    screenTextures?.kpiTexture,
    'Conference A Telemetry Display'
  );

  return { ...screensMap, furnitureGroup };
}
