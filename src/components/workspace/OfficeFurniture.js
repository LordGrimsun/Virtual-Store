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
  const createSpotWallScreen = (x, y, z, width = 4.8, height = 2.7, rotY = 0, screenKey = 'boardroom') => {
    const screenGrp = new THREE.Group();
    screenGrp.name = `screen_group_${screenKey}`;

    // Dark bezel casing
    const casing = new THREE.Mesh(roundedBox(width + 0.12, height + 0.12, 0.12, 0.04), screenBezelMat);
    casing.castShadow = true;
    casing.name = `casing_screen_${screenKey}`;
    screenGrp.add(casing);

    // Display face with starry Spot background (Exact match to media_1791993853484.png)
    const defaultTexture = screenTextures?.createStarryLogoTexture ? screenTextures.createStarryLogoTexture() : (screenTextures?.starryLogoTexture || screenTextures?.logoTexture);
    if (defaultTexture) defaultTexture.colorSpace = THREE.SRGBColorSpace;
    const displayMat = new THREE.MeshBasicMaterial({
      map: defaultTexture,
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const displayMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), displayMat);
    displayMesh.position.z = 0.07;
    displayMesh.name = `screen_${screenKey}`;
    displayMesh.userData = { isSpotScreen: true, screenKey, width, height, displayMesh };
    casing.userData = { isSpotScreen: true, screenKey, width, height, displayMesh };
    screenGrp.userData = { isSpotScreen: true, screenKey, width, height, displayMesh };
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

  // Helper: Cantilever Sled-Base White Conference Chair (media_1791969444037.png)
  const createCantileverChair = (cx, cz, crot, chairName = 'Conference Chair') => {
    const chair = new THREE.Group();

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

    // White leather cushion seat
    const seat = new THREE.Mesh(roundedBox(0.52, 0.08, 0.48, 0.03), whiteChairMat);
    seat.position.set(0, 0.45, 0);
    seat.castShadow = true;
    seat.name = 'clickable_chair';
    seat.userData = { isChair: true, name: chairName, chairPos: new THREE.Vector3(cx, 0, cz) };
    chair.add(seat);

    // White ribbed backrest
    const back = new THREE.Mesh(roundedBox(0.48, 0.48, 0.06, 0.03), whiteChairMat);
    back.position.set(0, 0.72, -0.23);
    back.castShadow = true;
    back.name = 'clickable_chair';
    back.userData = { isChair: true, name: chairName, chairPos: new THREE.Vector3(cx, 0, cz) };
    chair.add(back);

    chair.position.set(cx, 0, cz);
    chair.rotation.y = crot;
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos: new THREE.Vector3(cx, 0, cz) };
    furnitureGroup.add(chair);

    if (chairsRef?.current) {
      chairsRef.current.push({ name: chairName, pos: new THREE.Vector3(cx, 0, cz), rot: crot });
    }
    return chair;
  };

  // Helper: Black 3-Seater Sofa (media_1791969444037.png)
  const createBlackSofa = (cx, cz, crot, sofaName = 'Boardroom Sofa') => {
    const sofa = new THREE.Group();
    sofa.name = 'clickable_chair';
    sofa.userData = { isChair: true, name: sofaName, chairPos: new THREE.Vector3(cx, 0, cz) };

    // Base plinth
    const base = new THREE.Mesh(roundedBox(2.4, 0.22, 0.88, 0.06), blackMat);
    base.position.y = 0.2;
    base.castShadow = true;
    sofa.add(base);

    // 3 Seat Cushions
    [-0.72, 0, 0.72].forEach((sx) => {
      const cushion = new THREE.Mesh(roundedBox(0.68, 0.16, 0.62, 0.05), blackLeatherMat);
      cushion.position.set(sx, 0.38, 0.08);
      cushion.castShadow = true;
      cushion.name = 'clickable_chair';
      cushion.userData = { isChair: true, name: sofaName, chairPos: new THREE.Vector3(cx + (crot === 0 ? sx : 0), 0, cz + (crot !== 0 ? sx : 0)) };
      sofa.add(cushion);
    });

    // Backrest
    const back = new THREE.Mesh(roundedBox(2.36, 0.52, 0.22, 0.06), blackLeatherMat);
    back.position.set(0, 0.64, -0.32);
    back.castShadow = true;
    back.name = 'clickable_chair';
    back.userData = { isChair: true, name: sofaName, chairPos: new THREE.Vector3(cx, 0, cz) };
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

    if (chairsRef?.current) {
      chairsRef.current.push({ name: sofaName, pos: new THREE.Vector3(cx, 0, cz), rot: crot });
    }
    return sofa;
  };

  // Helper: White Tub Armchair with brass legs (media_1791969444037.png)
  const createTubArmchair = (cx, cz, crot, chairName = 'Boardroom Tub Chair') => {
    const chair = new THREE.Group();
    chair.name = 'clickable_chair';
    chair.userData = { isChair: true, name: chairName, chairPos: new THREE.Vector3(cx, 0, cz) };

    // Tub curved bucket seat
    const tub = new THREE.Mesh(roundedBox(0.82, 0.52, 0.78, 0.12), tubArmchairMat);
    tub.position.y = 0.42;
    tub.castShadow = true;
    tub.name = 'clickable_chair';
    tub.userData = { isChair: true, name: chairName, chairPos: new THREE.Vector3(cx, 0, cz) };
    chair.add(tub);

    // Deep seat cushion
    const cushion = new THREE.Mesh(roundedBox(0.64, 0.14, 0.58, 0.05), whiteMat);
    cushion.position.set(0, 0.42, 0.06);
    cushion.name = 'clickable_chair';
    cushion.userData = { isChair: true, name: chairName, chairPos: new THREE.Vector3(cx, 0, cz) };
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
      chairsRef.current.push({ name: chairName, pos: new THREE.Vector3(cx, 0, cz), rot: crot });
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

  // ==========================================
  // 1. BOARDROOM (x: -9, z: 16)
  // Matching media_1791993853484.png & media_1791969444037.png
  // ==========================================
  // West wall starry Spot screen (matching authentic Spot layout in media_1791969444037.png)
  createSpotWallScreen(-15.8, 3.2, 16, 4.8, 2.7, Math.PI / 2, 'boardroom');

  // Facing Black Sofas
  createBlackSofa(-11.6, 16, Math.PI / 2, 'Boardroom West Sofa');
  createBlackSofa(-6.4, 16, -Math.PI / 2, 'Boardroom East Sofa');

  // 2 Circular Coffee Tables in the middle
  createRoundCoffeeTable(-9.0, 14.8, 0.65, 0.38);
  createRoundCoffeeTable(-9.0, 17.2, 0.65, 0.38);

  // 4 White Tub Armchairs
  createTubArmchair(-10.2, 13.0, 0, 'Boardroom Tub Chair 1');
  createTubArmchair(-7.8, 13.0, 0, 'Boardroom Tub Chair 2');
  createTubArmchair(-10.2, 19.0, Math.PI, 'Boardroom Tub Chair 3');
  createTubArmchair(-7.8, 19.0, Math.PI, 'Boardroom Tub Chair 4');

  // Gold Drinks Tables between armchairs
  createDrinkTable(-9.0, 13.0);
  createDrinkTable(-9.0, 19.0);

  // ==========================================
  // 2. CONFERENCE B (x: 5, z: 16)
  // Matching media_1791969444037.png
  // ==========================================
  createSpotWallScreen(-1.8, 3.2, 16, 4.8, 2.7, Math.PI / 2, 'conference_b');

  // Long Dark Conference Table
  const confBTable = new THREE.Mesh(roundedBox(6.4, 0.1, 1.8, 0.05), darkTableMat);
  confBTable.position.set(5.0, 0.74, 16.0);
  confBTable.castShadow = true;
  furnitureGroup.add(confBTable);

  // Table plinth pedestals
  [-1.8, 1.8].forEach((px) => {
    const leg = new THREE.Mesh(roundedBox(0.18, 0.68, 1.2, 0.04), blackMat);
    leg.position.set(5.0 + px, 0.36, 16.0);
    furnitureGroup.add(leg);
  });

  // 8 White Cantilever Chairs
  [-2.1, -0.7, 0.7, 2.1].forEach((cx) => {
    createCantileverChair(5.0 + cx, 14.8, 0, 'Conf B North Chair');
    createCantileverChair(5.0 + cx, 17.2, Math.PI, 'Conf B South Chair');
  });

  // ==========================================
  // 3. CONFERENCE A (x: 19, z: 16)
  // ==========================================
  createSpotWallScreen(12.2, 3.2, 16, 4.8, 2.7, Math.PI / 2, 'conference_a');

  // 10-Seater Dark Conference Table
  const confATable = new THREE.Mesh(roundedBox(8.2, 0.1, 1.8, 0.05), darkTableMat);
  confATable.position.set(19.0, 0.74, 16.0);
  confATable.castShadow = true;
  furnitureGroup.add(confATable);

  [-2.6, 0, 2.6].forEach((px) => {
    const leg = new THREE.Mesh(roundedBox(0.18, 0.68, 1.2, 0.04), blackMat);
    leg.position.set(19.0 + px, 0.36, 16.0);
    furnitureGroup.add(leg);
  });

  // 10 Chairs
  [-2.8, -1.4, 0, 1.4, 2.8].forEach((cx) => {
    createCantileverChair(19.0 + cx, 14.8, 0, 'Conf A North Chair');
    createCantileverChair(19.0 + cx, 17.2, Math.PI, 'Conf A South Chair');
  });

  // ==========================================
  // 4. AUDITORIUM 🏠 (x: -24, z: 16)
  // Matching 7 tiers of stadium seating in blueprint
  // ==========================================
  // Giant vertical screen on west wall
  createSpotWallScreen(-31.8, 3.6, 16, 7.2, 4.0, Math.PI / 2, 'auditorium');

  // 7 Tiers of black bench seating facing the stage (west)
  for (let tier = 0; tier < 7; tier++) {
    const tx = -25.5 + tier * 1.5;
    const ty = 0.2 + tier * 0.28;
    const benchWidth = 11.0;

    const riser = new THREE.Mesh(
      roundedBox(0.85, 0.22, benchWidth, 0.04),
      blackLeatherMat
    );
    riser.position.set(tx, ty, 16.0);
    riser.castShadow = true;
    riser.name = 'clickable_chair';
    furnitureGroup.add(riser);

    if (chairsRef?.current) {
      chairsRef.current.push({
        name: `Auditorium Row ${tier + 1}`,
        pos: new THREE.Vector3(tx, ty, 16.0),
        rot: Math.PI / 2
      });
    }
  }

  // ==========================================
  // 5. PATIO ((•)) (x: -23, z: -16)
  // Outdoor terrace with giant chessboard and sunken pool
  // ==========================================
  // Giant 8x8 Chessboard (x: -26, z: -19)
  const chessGrp = new THREE.Group();
  const boardSize = 5.2;
  const squareSize = boardSize / 8;
  const whiteTileMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const blackTileMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isBlack = (r + c) % 2 === 1;
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(squareSize - 0.02, 0.04, squareSize - 0.02),
        isBlack ? blackTileMat : whiteTileMat
      );
      tile.position.set((c - 3.5) * squareSize, 0.03, (r - 3.5) * squareSize);
      chessGrp.add(tile);

      // Low-poly chess pieces on starting ranks
      if (r === 0 || r === 1 || r === 6 || r === 7) {
        const pieceMat = r < 2 ? blackMat : whiteMat;
        const piece = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.16, 0.45, 12),
          pieceMat
        );
        piece.position.set((c - 3.5) * squareSize, 0.25, (r - 3.5) * squareSize);
        piece.castShadow = true;
        chessGrp.add(piece);
      }
    }
  }
  chessGrp.position.set(-25.5, 0, -18.5);
  furnitureGroup.add(chessGrp);

  // Sunken Square Turquoise Lounge Pit (x: -18, z: -18)
  const patioPit = new THREE.Mesh(roundedBox(4.4, 0.35, 4.4, 0.1), turquoiseMat);
  patioPit.position.set(-18.5, 0.18, -18.5);
  furnitureGroup.add(patioPit);

  const patioPitTable = createRoundCoffeeTable(-18.5, -18.5, 0.8, 0.32);

  // Chevron angled corner terrace benches (x: -27, z: -11)
  [-1, 1].forEach((dir) => {
    const chevBench = new THREE.Mesh(roundedBox(3.4, 0.4, 0.8, 0.06), tubArmchairMat);
    chevBench.position.set(-26.5, 0.25, -11.5 + dir * 1.8);
    chevBench.rotation.y = dir * 0.4;
    furnitureGroup.add(chevBench);
  });

  // ==========================================
  // 6. WORKSPACE A (x: 0, z: -16)
  // 4 Engineering workstation desk clusters
  // ==========================================
  const createDeskPod = (px, pz) => {
    const pod = new THREE.Group();

    // Central 4-person shared desk
    const desk = new THREE.Mesh(roundedBox(3.4, 0.08, 2.2, 0.04), woodDeskMat);
    desk.position.y = 0.74;
    desk.castShadow = true;
    pod.add(desk);

    // Acoustic fabric privacy divider screen
    const divider = new THREE.Mesh(
      roundedBox(3.2, 0.48, 0.06, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
    );
    divider.position.set(0, 0.98, 0);
    pod.add(divider);

    // Dual monitors for each of the 4 stations
    [-0.9, 0.9].forEach((dx) => {
      // North monitors
      const monN = new THREE.Mesh(roundedBox(0.68, 0.42, 0.03, 0.02), screenBezelMat);
      monN.position.set(dx, 1.02, -0.22);
      pod.add(monN);

      // South monitors
      const monS = new THREE.Mesh(roundedBox(0.68, 0.42, 0.03, 0.02), screenBezelMat);
      monS.position.set(dx, 1.02, 0.22);
      pod.add(monS);

      // Task chairs
      createCantileverChair(px + dx, pz - 1.4, Math.PI, 'Workstation Chair');
      createCantileverChair(px + dx, pz + 1.4, 0, 'Workstation Chair');
    });

    pod.position.set(px, 0, pz);
    furnitureGroup.add(pod);
  };

  createDeskPod(-6, -19);
  createDeskPod(6, -19);
  createDeskPod(-6, -13);
  createDeskPod(6, -13);

  // ==========================================
  // 7. LOBBY 🌐 (x: 22, z: -16)
  // Reception desk and waiting area
  // ==========================================
  // Modern curved reception desk
  const recepDesk = new THREE.Mesh(roundedBox(4.2, 1.05, 1.6, 0.12), whiteMat);
  recepDesk.position.set(22.0, 0.52, -21.0);
  recepDesk.castShadow = true;
  furnitureGroup.add(recepDesk);

  // Reception monitors
  const recepMon = new THREE.Mesh(roundedBox(0.72, 0.45, 0.04, 0.02), screenBezelMat);
  recepMon.position.set(22.0, 1.25, -21.0);
  furnitureGroup.add(recepMon);

  createCantileverChair(22.0, -22.2, 0, 'Receptionist Chair');

  // Waiting lounge
  createRoundCoffeeTable(22.0, -13.0, 0.9, 0.38);
  createTubArmchair(20.5, -13.0, Math.PI / 2, 'Lobby Armchair 1');
  createTubArmchair(23.5, -13.0, -Math.PI / 2, 'Lobby Armchair 2');
  createTubArmchair(22.0, -11.5, Math.PI, 'Lobby Armchair 3');
  createTubArmchair(22.0, -14.5, 0, 'Lobby Armchair 4');

  // ==========================================
  // 8. LOUNGE C ((•)) (x: -21, z: 0)
  // Long buffet dining counter, 2 cocktail tables, 4 small 2-top tables
  // ==========================================
  // Long black buffet table (x: -21, z: -2)
  const buffetTable = new THREE.Mesh(roundedBox(8.4, 0.1, 1.4, 0.05), darkTableMat);
  buffetTable.position.set(-21.0, 0.74, -2.0);
  buffetTable.castShadow = true;
  furnitureGroup.add(buffetTable);

  [-3, -1.5, 0, 1.5, 3].forEach((bx) => {
    createCantileverChair(-21.0 + bx, -2.9, 0, 'Buffet North Chair');
    createCantileverChair(-21.0 + bx, -1.1, Math.PI, 'Buffet South Chair');
  });

  // 2 Large Circular Cocktail tables with stools (x: -25 and -17, z: 4)
  [-25, -17].forEach((cx) => {
    createRoundCoffeeTable(cx, 4.0, 1.1, 0.45);
    // 4 Round Ottomans / Stools
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const stool = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.38, 20),
          blackLeatherMat
        );
        stool.position.set(cx + sx * 0.95, 0.19, 4.0 + sz * 0.95);
        stool.castShadow = true;
        stool.name = 'clickable_chair';
        furnitureGroup.add(stool);
      });
    });
  });

  // 4 Small 2-Top Tables along the west wall (x: -30)
  [-5, -2, 2, 5].forEach((tz) => {
    createRoundCoffeeTable(-30.0, tz, 0.5, 0.74);
    createCantileverChair(-29.2, tz, -Math.PI / 2, '2-Top Chair');
  });

  // ==========================================
  // 9. LOUNGE B ((•)) (x: -1, z: 0)
  // Central coffee counter & 2 circular tables
  // ==========================================
  // Coffee Credenza / Island
  const coffeeBar = new THREE.Mesh(roundedBox(4.8, 0.95, 1.6, 0.08), woodDeskMat);
  coffeeBar.position.set(-1.0, 0.48, 0);
  coffeeBar.castShadow = true;
  furnitureGroup.add(coffeeBar);

  // 2 Circular Cocktail Tables (x: -5 and 3, z: 4)
  [-5, 3].forEach((cx) => {
    createRoundCoffeeTable(cx, 4.0, 1.1, 0.45);
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const stool = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.38, 20),
          blackLeatherMat
        );
        stool.position.set(cx + sx * 0.95, 0.19, 4.0 + sz * 0.95);
        stool.castShadow = true;
        stool.name = 'clickable_chair';
        furnitureGroup.add(stool);
      });
    });
  });

  // 2 4-person workstation pods on the right (x: 4, z: -4)
  createDeskPod(4, -4);

  // ==========================================
  // 10. CHAT A & CHAT B (x: 12, z: -4 & +4)
  // Private 1-on-1 huddle booths
  // ==========================================
  [-4, 4].forEach((cz, idx) => {
    const desk = new THREE.Mesh(roundedBox(2.2, 0.08, 1.2, 0.04), woodDeskMat);
    desk.position.set(12.0, 0.74, cz);
    desk.castShadow = true;
    furnitureGroup.add(desk);

    // Wall screen
    const mon = new THREE.Mesh(roundedBox(0.85, 0.52, 0.04, 0.02), screenBezelMat);
    mon.position.set(12.0, 1.2, cz - 0.5);
    furnitureGroup.add(mon);

    createCantileverChair(12.0, cz + 0.6, 0, `Chat ${idx === 0 ? 'A' : 'B'} Chair`);
  });

  // ==========================================
  // 11. LOUNGE A ((•)) (x: 23, z: 0)
  // Sunken lounge pit in the middle with cushions
  // ==========================================
  // Sunken Pit Upholstered Basin
  const pit = new THREE.Mesh(roundedBox(6.4, 0.38, 6.4, 0.12), turquoiseMat);
  pit.position.set(23.0, 0.19, 0);
  furnitureGroup.add(pit);

  // Recessed seating area
  const pitCenter = new THREE.Mesh(roundedBox(4.2, 0.18, 4.2, 0.08), whiteMat);
  pitCenter.position.set(23.0, 0.28, 0);
  furnitureGroup.add(pitCenter);

  // Throw cushions
  [-1.4, 0, 1.4].forEach((cx) => {
    const c1 = new THREE.Mesh(roundedBox(0.52, 0.12, 0.52, 0.04), cushionYellowMat);
    c1.position.set(23.0 + cx, 0.38, -1.8);
    furnitureGroup.add(c1);

    const c2 = new THREE.Mesh(roundedBox(0.52, 0.12, 0.52, 0.04), cushionOrangeMat);
    c2.position.set(23.0 + cx, 0.38, 1.8);
    furnitureGroup.add(c2);
  });

  createRoundCoffeeTable(23.0, 0, 0.9, 0.36);

  // 4-person table pod above and below Lounge A
  createRoundCoffeeTable(23.0, -5.2, 0.8, 0.74);
  createCantileverChair(23.0, -6.1, 0, 'Lounge A North Chair');
  createCantileverChair(23.0, -4.3, Math.PI, 'Lounge A South Chair');

  createRoundCoffeeTable(23.0, 5.2, 0.8, 0.74);
  createCantileverChair(23.0, 4.3, 0, 'Lounge A North Chair 2');
  createCantileverChair(23.0, 6.1, Math.PI, 'Lounge A South Chair 2');

  // Additional interactive screens across other rooms
  createSpotWallScreen(0, 3.2, -23.8, 4.8, 2.7, 0, 'workspace_a');
  createSpotWallScreen(13.8, 2.2, -4.0, 2.2, 1.4, -Math.PI / 2, 'chat_a');
  createSpotWallScreen(13.8, 2.2, 4.0, 2.2, 1.4, -Math.PI / 2, 'chat_b');
  createSpotWallScreen(23.0, 3.0, -8.8, 3.6, 2.2, 0, 'lounge_a');

  return { ...screensMap, furnitureGroup };
}
