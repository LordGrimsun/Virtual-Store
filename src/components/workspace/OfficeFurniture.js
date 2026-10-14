import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/**
 * Builds all high-fidelity office furniture, workstations, chairs, tables,
 * screens, and interactive props matching the Spot Virtual desktop client reference.
 */
export function buildOfficeFurniture(scene, screenTextures, chairsRef) {
  // Common Materials
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32 });
  const blackMetalMat = new THREE.MeshStandardMaterial({ color: 0x141820, metalness: 0.6, roughness: 0.4 });
  const darkWallMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.85 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
  const chairBeigeMat = new THREE.MeshStandardMaterial({ color: 0xd4cac0, roughness: 0.72 });
  const chairFabricMat = new THREE.MeshStandardMaterial({ color: 0xded5cb, roughness: 0.75 });
  const darkTableMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.5 });
  const screenBezelMat = new THREE.MeshStandardMaterial({ color: 0x0a0d14, roughness: 0.6 });
  const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });

  const roundedBox = (width, height, depth, radius = 0.045) => {
    const safeRadius = Math.max(
      0.005,
      Math.min(radius, width * 0.45, height * 0.45, depth * 0.45)
    );
    return new RoundedBoxGeometry(width, height, depth, 3, safeRadius);
  };

  const sofaCushionMat = new THREE.MeshStandardMaterial({
    color: 0x252a31,
    roughness: 0.92
  });
  const paleCushionMat = new THREE.MeshStandardMaterial({
    color: 0xf1ece4,
    roughness: 0.92
  });
  const sofaBaseMat = new THREE.MeshStandardMaterial({
    color: 0x14171c,
    roughness: 0.86
  });

  const createUpholsteredSofa = (cx, cz, width, depth, rotation, upholsteryMat, name, objectName) => {
    const sofa = new THREE.Group();

    const base = new THREE.Mesh(roundedBox(width - 0.06, 0.24, depth - 0.04, 0.07), sofaBaseMat);
    base.position.y = 0.25;
    base.castShadow = true;
    base.receiveShadow = true;
    sofa.add(base);

    const seatWidth = (width - 0.24) / 2;
    [-1, 1].forEach((side) => {
      const cushion = new THREE.Mesh(
        roundedBox(seatWidth, 0.15, depth - 0.30, 0.055),
        upholsteryMat
      );
      cushion.position.set(side * (width * 0.25), 0.43, 0.08);
      cushion.castShadow = true;
      cushion.receiveShadow = true;
      sofa.add(cushion);
    });

    const back = new THREE.Mesh(
      roundedBox(width - 0.12, 0.56, 0.22, 0.06),
      upholsteryMat
    );
    back.position.set(0, 0.65, -depth / 2 + 0.14);
    back.castShadow = true;
    back.receiveShadow = true;
    sofa.add(back);

    [-1, 1].forEach((side) => {
      const arm = new THREE.Mesh(roundedBox(0.22, 0.38, depth - 0.04, 0.055), upholsteryMat);
      arm.position.set(side * (width / 2 - 0.12), 0.47, 0);
      arm.castShadow = true;
      sofa.add(arm);
    });

    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.05, 0.12, 10),
          blackMetalMat
        );
        foot.position.set(sx * (width / 2 - 0.22), 0.06, sz * (depth / 2 - 0.15));
        sofa.add(foot);
      });
    });

    sofa.position.set(cx, 0, cz);
    sofa.rotation.y = rotation;
    sofa.name = objectName;
    scene.add(sofa);
    chairsRef.current.push({
      name,
      pos: new THREE.Vector3(cx, 0, cz),
      rot: rotation
    });
    return sofa;
  };

  const createLoungeChair = (cx, cz, rotation, name) => {
    const chair = new THREE.Group();
    const base = new THREE.Mesh(roundedBox(0.92, 0.24, 0.84, 0.075), paleCushionMat);
    base.position.y = 0.27;
    base.castShadow = true;
    chair.add(base);

    const seat = new THREE.Mesh(roundedBox(0.74, 0.14, 0.62, 0.055), chairBeigeMat);
    seat.position.set(0, 0.45, 0.06);
    seat.castShadow = true;
    seat.name = 'clickable_chair';
    chair.add(seat);

    const back = new THREE.Mesh(roundedBox(0.78, 0.62, 0.19, 0.06), paleCushionMat);
    back.position.set(0, 0.74, -0.31);
    back.rotation.x = -0.05;
    back.castShadow = true;
    back.name = 'clickable_chair';
    chair.add(back);

    [-0.38, 0.38].forEach((x) => {
      const arm = new THREE.Mesh(roundedBox(0.18, 0.34, 0.68, 0.05), paleCushionMat);
      arm.position.set(x, 0.52, -0.01);
      arm.castShadow = true;
      chair.add(arm);
    });

    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.028, 0.19, 8), brassMat);
        leg.position.set(sx * 0.34, 0.095, sz * 0.29);
        chair.add(leg);
      });
    });

    chair.position.set(cx, 0, cz);
    chair.rotation.y = rotation;
    scene.add(chair);
    chairsRef.current.push({ name, pos: new THREE.Vector3(cx, 0, cz), rot: rotation });
    return chair;
  };

  const glassDomeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    roughness: 0.05,
    transmission: 0.96,
    thickness: 0.2
  });

  // Helper: Cantilever Sled-Base Conference Chair
  const createCantileverChair = (cx, cz, crot, chairName = 'Conference Chair') => {
    const cGrp = new THREE.Group();

    // Sled base tubular frame (black metal)
    const skidL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.62), blackMetalMat);
    skidL.position.set(-0.28, 0.04, 0);
    skidL.castShadow = true;
    cGrp.add(skidL);

    const skidR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.62), blackMetalMat);
    skidR.position.set(0.28, 0.04, 0);
    skidR.castShadow = true;
    cGrp.add(skidR);

    // Front riser tubes
    const riserL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8), blackMetalMat);
    riserL.position.set(-0.28, 0.36, -0.28);
    cGrp.add(riserL);

    const riserR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8), blackMetalMat);
    riserR.position.set(0.28, 0.36, -0.28);
    cGrp.add(riserR);

    // Upholstered Seat Cushion
    const seat = new THREE.Mesh(roundedBox(0.68, 0.09, 0.62, 0.03), chairFabricMat);
    seat.position.set(0, 0.7, 0);
    seat.castShadow = true;
    seat.receiveShadow = true;
    seat.name = 'clickable_chair';
    cGrp.add(seat);

    // Contoured Backrest
    const back = new THREE.Mesh(roundedBox(0.68, 0.62, 0.07, 0.025), chairFabricMat);
    back.position.set(0, 1.02, 0.28);
    back.rotation.x = -0.06;
    back.castShadow = true;
    back.name = 'clickable_chair';
    cGrp.add(back);

    // Armrests
    [-0.32, 0.32].forEach((armX) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.42), blackMetalMat);
      arm.position.set(armX, 0.92, -0.05);
      cGrp.add(arm);
    });

    cGrp.position.set(cx, 0, cz);
    cGrp.rotation.y = crot;
    scene.add(cGrp);

    chairsRef.current.push({
      name: chairName,
      pos: new THREE.Vector3(cx, 0, cz),
      rot: crot
    });

    return cGrp;
  };

  // Helper: Tub / Bucket Armchair (for Round Table)
  const createBucketArmchair = (cx, cz, crot, chairName = 'Huddle Armchair') => {
    const group = new THREE.Group();

    // 4 Splayed Legs
    const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    angles.forEach((ang) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.62, 8), blackMetalMat);
      leg.position.set(Math.cos(ang) * 0.26, 0.3, Math.sin(ang) * 0.26);
      leg.rotation.z = Math.cos(ang) * 0.18;
      leg.rotation.x = -Math.sin(ang) * 0.18;
      leg.castShadow = true;
      group.add(leg);
    });

    // Bucket Shell
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.12, 16), chairBeigeMat);
    seat.position.y = 0.68;
    seat.name = 'clickable_chair';
    seat.castShadow = true;
    group.add(seat);

    // Curved Back Bucket Shell
    const curvedBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.4, 0.52, 16, 1, true, Math.PI * 0.5, Math.PI),
      chairBeigeMat
    );
    curvedBack.position.set(0, 0.95, 0.05);
    curvedBack.name = 'clickable_chair';
    curvedBack.castShadow = true;
    group.add(curvedBack);

    group.position.set(cx, 0, cz);
    group.rotation.y = crot;
    scene.add(group);

    chairsRef.current.push({
      name: chairName,
      pos: new THREE.Vector3(cx, 0, cz),
      rot: crot
    });

    return group;
  };

  // Helper: Ergonomic Swivel Mesh Task Chair (for Desks)
  const createSwivelTaskChair = (cx, cz, crot, chairName = 'Desk Chair') => {
    const group = new THREE.Group();

    // 5-Star Castor Base
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.32), blackMetalMat);
      leg.position.set(Math.cos(ang) * 0.16, 0.08, Math.sin(ang) * 0.16);
      leg.rotation.y = -ang;
      group.add(leg);

      const castor = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), blackMetalMat);
      castor.position.set(Math.cos(ang) * 0.3, 0.03, Math.sin(ang) * 0.3);
      group.add(castor);
    }

    // Center Gas Cylinder
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.035, 0.58, 12), chromeMat);
    cylinder.position.y = 0.36;
    group.add(cylinder);

    // Ergonomic Contoured Seat
    const seat = new THREE.Mesh(roundedBox(0.62, 0.08, 0.58, 0.025), darkWallMat);
    seat.position.y = 0.68;
    seat.castShadow = true;
    seat.name = 'clickable_chair';
    group.add(seat);

    // Mesh Backrest with Lumbar Curve
    const back = new THREE.Mesh(roundedBox(0.58, 0.65, 0.06, 0.02), darkWallMat);
    back.position.set(0, 1.04, 0.26);
    back.rotation.x = -0.08;
    back.castShadow = true;
    back.name = 'clickable_chair';
    group.add(back);

    // Armrests
    [-0.31, 0.31].forEach((ax) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.3), blackMetalMat);
      arm.position.set(ax, 0.88, 0.02);
      group.add(arm);
    });

    group.position.set(cx, 0, cz);
    group.rotation.y = crot;
    scene.add(group);

    chairsRef.current.push({
      name: chairName,
      pos: new THREE.Vector3(cx, 0, cz),
      rot: crot
    });

    return group;
  };

  // 1. Zone 1: Far-Left Theater Screen & Tiered Seating
  const theaterScreen = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 3.8, 0.08),
    new THREE.MeshStandardMaterial({
      map: screenTextures.createNoMeetTexture('09:38'),
      roughness: 0.3
    })
  );
  theaterScreen.position.set(-20, 2.2, -21.7);
  theaterScreen.name = 'theaterScreen';
  theaterScreen.castShadow = true;
  scene.add(theaterScreen);

  // Theater Auditorium Rows
  [-13.5, -16.0, -18.5].forEach((rz, rowIdx) => {
    [-23.0, -20.0, -17.0].forEach((rx) => {
      createCantileverChair(rx, rz, 0, `Theater Seat R${rowIdx + 1}`);
    });
  });

  // 2. Zone 2: Round Table Huddle & Roadmap Board
  // "New Features" Roadmap Board
  const featBoard = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 3.2, 0.1),
    new THREE.MeshStandardMaterial({
      map: screenTextures.featTexture,
      roughness: 0.25
    })
  );
  featBoard.position.set(-20.5, 2.3, -5.6);
  featBoard.name = 'featBoard';
  featBoard.castShadow = true;
  scene.add(featBoard);

  // Round Table
  const roundTable = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.12, 32), whiteMat);
  roundTable.position.set(-19.5, 1.15, 4.5);
  roundTable.castShadow = true;
  roundTable.receiveShadow = true;
  scene.add(roundTable);

  const roundPylon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.1, 24), whiteMat);
  roundPylon.position.set(-19.5, 0.55, 4.5);
  roundPylon.castShadow = true;
  scene.add(roundPylon);

  // Conference Audio Puck / Speakerphone
  const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 16), blackMetalMat);
  puck.position.set(-19.5, 1.25, 4.5);
  scene.add(puck);

  const puckLed = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.015, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  puckLed.rotation.x = Math.PI / 2;
  puckLed.position.set(-19.5, 1.29, 4.5);
  scene.add(puckLed);

  // 5 Bucket Armchairs around round table
  const huddleChairAngles = [0, 1.25, 2.5, 3.75, 5.0];
  huddleChairAngles.forEach((ang, idx) => {
    const hx = -19.5 + Math.cos(ang) * 2.85;
    const hz = 4.5 + Math.sin(ang) * 2.85;
    const hRot = -ang - Math.PI / 2;
    createBucketArmchair(hx, hz, hRot, `Huddle Chair ${idx + 1}`);
  });

  // 3. Zone 3: Middle Nook Sofa & Gold Drink Table
  const paleSofaMat = new THREE.MeshStandardMaterial({ color: 0xf6f3ed, roughness: 0.88 });
  createUpholsteredSofa(-4.5, 4.2, 2.5, 0.98, Math.PI / 2, paleSofaMat, 'Nook Sofa', 'chair_nook');

  const goldTable = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.52, 20), brassMat);
  goldTable.position.set(-4.5, 0.26, 1.8);
  goldTable.castShadow = true;
  scene.add(goldTable);

  // 4. Zone 4: Foreground Lounge — padded black sofa and proper club chairs.
  createUpholsteredSofa(-2.0, 9.8, 3.6, 1.15, 0, darkWallMat, 'Lounge Sofa', 'chair_lounge');

  [-4.8, 1.2].forEach((cx, idx) => {
    createLoungeChair(cx, 11.8, idx === 0 ? Math.PI / 4 : -Math.PI / 4, `Club Chair ${idx + 1}`);
  });

  // Round Drum Coffee Table with Small Plant
  const drumTable = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.44, 28), whiteMat);
  drumTable.position.set(-1.8, 0.22, 11.8);
  drumTable.castShadow = true;
  drumTable.receiveShadow = true;
  scene.add(drumTable);

  const plantPot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.16, 12), whiteMat);
  plantPot.position.set(-1.8, 0.52, 11.8);
  scene.add(plantPot);

  const plantLeaf = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.22, 5),
    new THREE.MeshStandardMaterial({ color: 0x16a34a })
  );
  plantLeaf.position.set(-1.8, 0.68, 11.8);
  scene.add(plantLeaf);

  // 5. Zone 5: Center Long All-Hands Table & Doughnuts Plate
  const createAllHandsTable = () => {
    const group = new THREE.Group();

    // The reference layout has a long dark table running up the center of the plan.
    const table = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 9.0), darkTableMat);
    table.position.y = 1.15;
    table.castShadow = true;
    table.receiveShadow = true;
    group.add(table);

    // Three understated supports along the table's long axis.
    [-3.0, 0, 3.0].forEach((pz) => {
      const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 1.1, 16), darkWallMat);
      pylon.position.set(0, 0.55, pz);
      pylon.castShadow = true;
      group.add(pylon);
    });

    // Small refreshments stay on the tabletop and remain clickable.
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.25, 0.16, 18), whiteMat);
    bowl.position.set(-0.12, 1.3, -2.15);
    bowl.name = 'appleBowl';
    bowl.castShadow = true;
    group.add(bowl);

    for (let a = 0; a < 6; a++) {
      const apple = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), redMat);
      apple.position.set(-0.12 + (a % 3) * 0.12 - 0.1, 1.42, -2.25 + Math.floor(a / 3) * 0.12);
      apple.castShadow = true;
      apple.name = 'appleBowl';
      group.add(apple);
    }

    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.05, 20), redMat);
    plate.position.set(0.12, 1.23, 0.15);
    plate.name = 'doughnutPlate';
    plate.castShadow = true;
    group.add(plate);

    for (let i = 0; i < 4; i++) {
      const donut = new THREE.Mesh(
        new THREE.TorusGeometry(0.1, 0.05, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 })
      );
      donut.rotation.x = Math.PI / 2;
      donut.position.set(0.08 + (i % 2) * 0.13, 1.28, 0.1 + Math.floor(i / 2) * 0.13);
      donut.castShadow = true;
      donut.name = 'doughnutPlate';
      group.add(donut);
    }

    const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.30, 0.06, 18), whiteMat);
    domeBase.position.set(0.0, 1.23, 2.55);
    domeBase.castShadow = true;
    group.add(domeBase);

    const glassDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.29, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2),
      glassDomeMat
    );
    glassDome.position.set(0.0, 1.26, 2.55);
    group.add(glassDome);

    const domeKnob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), brassMat);
    domeKnob.position.set(0.0, 1.58, 2.55);
    group.add(domeKnob);

    // Coffee cups sit inboard so they do not overlap the edge or nearby chairs.
    [-0.8, 1.2].forEach((pz) => {
      const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.14, 12), blackMetalMat);
      mug.position.set(0.48, 1.28, pz);
      mug.castShadow = true;
      group.add(mug);
    });

    // 12 cantilever chairs distributed along both long sides.
    [-3.3, -2.0, -0.7, 0.7, 2.0, 3.3].forEach((zOff, idx) => {
      // West side faces east into the table; east side faces west.
      createCantileverChair(4.5 - 1.45, 3.8 + zOff, -Math.PI / 2, `All-Hands Chair W${idx + 1}`);
      createCantileverChair(4.5 + 1.45, 3.8 + zOff, Math.PI / 2, `All-Hands Chair E${idx + 1}`);
    });

    group.position.set(4.5, 0, 3.8);
    scene.add(group);
  };
  createAllHandsTable();

  // 6. Zone 6: Glass Boardroom Interior Furniture
  const innerTable = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.12, 1.8), darkTableMat);
  innerTable.position.set(0, 1.1, -17.0);
  innerTable.castShadow = true;
  innerTable.receiveShadow = true;
  scene.add(innerTable);

  const boardroomScreen = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 2.6, 0.08),
    new THREE.MeshStandardMaterial({
      map: screenTextures.createNoMeetTexture('09:34'),
      roughness: 0.3
    })
  );
  boardroomScreen.position.set(0, 2.4, -21.6);
  scene.add(boardroomScreen);

  // 6 Chairs in Boardroom
  [-1.6, 0, 1.6].forEach((bx, idx) => {
    createCantileverChair(bx, -18.4, 0, `Boardroom Chair N${idx + 1}`);
    createCantileverChair(bx, -15.6, Math.PI, `Boardroom Chair S${idx + 1}`);
  });

  // 7. Zone 7: Mobile Whiteboard Stand ("10:42 1 on 1 with Stan")
  const mobileScreenGrp = new THREE.Group();
  const mobileScreen = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 3.4, 0.08),
    new THREE.MeshStandardMaterial({
      map: screenTextures.schedTexture,
      roughness: 0.25
    })
  );
  mobileScreen.position.y = 1.9;
  mobileScreen.name = 'mobileSchedule';
  mobileScreen.castShadow = true;
  mobileScreenGrp.add(mobileScreen);

  // Whiteboard Stand Legs and Casters
  const standFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 0.12), blackMetalMat);
  standFrame.position.y = 0.2;
  mobileScreenGrp.add(standFrame);

  [-1.15, 1.15].forEach((lx) => {
    const upright = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.4, 12), blackMetalMat);
    upright.position.set(lx, 1.8, 0);
    mobileScreenGrp.add(upright);

    const casterFoot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.6), blackMetalMat);
    casterFoot.position.set(lx, 0.06, 0);
    mobileScreenGrp.add(casterFoot);
  });

  mobileScreenGrp.position.set(12.5, 0, 3.8);
  mobileScreenGrp.rotation.y = -Math.PI / 10;
  scene.add(mobileScreenGrp);

  // 8. Zone 8: Engineering Desk Pods (3 Rows of Desks)
  const createDeskPod = (x, z) => {
    const podGrp = new THREE.Group();

    // Two facing desks (white tops)
    const top1 = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.1, 1.4), whiteMat);
    top1.position.set(0, 1.15, -0.78);
    top1.castShadow = true;
    top1.receiveShadow = true;
    podGrp.add(top1);

    const top2 = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.1, 1.4), whiteMat);
    top2.position.set(0, 1.15, 0.78);
    top2.castShadow = true;
    top2.receiveShadow = true;
    podGrp.add(top2);

    // O-Frame Loop Legs (White powder-coated metal)
    [-1.38, 1.38].forEach((lx) => {
      const legLoop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 2.8), whiteMat);
      legLoop.position.set(lx, 0.55, 0);
      legLoop.castShadow = true;
      podGrp.add(legLoop);
    });

    // Acoustic Privacy Divider Screen (Grey fabric)
    const divider = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.52, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 })
    );
    divider.position.set(0, 1.45, 0);
    divider.castShadow = true;
    podGrp.add(divider);

    // Dual Monitors & Keyboards on both desk sides
    [-0.78, 0.78].forEach((dz, sideIdx) => {
      const facingRot = sideIdx === 0 ? 0 : Math.PI;

      // Dual Widescreen Monitors
      [-0.45, 0.45].forEach((mx, monIdx) => {
        const monArm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8), blackMetalMat);
        monArm.position.set(mx, 1.35, dz + (sideIdx === 0 ? 0.35 : -0.35));
        podGrp.add(monArm);

        const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.52, 0.035), screenBezelMat);
        monitor.position.set(mx, 1.58, dz + (sideIdx === 0 ? 0.28 : -0.28));
        monitor.rotation.y = facingRot + (monIdx === 0 ? 0.12 : -0.12);
        monitor.castShadow = true;
        podGrp.add(monitor);

        const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.48), screenGlowMat);
        screenFace.position.set(mx, 1.58, dz + (sideIdx === 0 ? 0.26 : -0.26));
        screenFace.rotation.y = facingRot + (monIdx === 0 ? 0.12 : -0.12);
        podGrp.add(screenFace);

        // Spot logo decal on rear casing of monitor (media_1791967544189.webp)
        const spotLogoDecal = new THREE.Mesh(
          new THREE.CircleGeometry(0.065, 16),
          new THREE.MeshBasicMaterial({ color: 0x22c55e })
        );
        spotLogoDecal.position.set(mx, 1.58, dz + (sideIdx === 0 ? 0.30 : -0.30));
        spotLogoDecal.rotation.y = facingRot + (monIdx === 0 ? 0.12 : -0.12) + (sideIdx === 0 ? Math.PI : 0);
        podGrp.add(spotLogoDecal);
      });

      // Keyboard & Mouse
      const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, 0.16), darkWallMat);
      keyboard.position.set(0, 1.21, dz + (sideIdx === 0 ? -0.18 : 0.18));
      podGrp.add(keyboard);

      const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.12), darkWallMat);
      mouse.position.set(0.38, 1.21, dz + (sideIdx === 0 ? -0.18 : 0.18));
      podGrp.add(mouse);
    });

    // Swivel Task Chairs for each desk
    createSwivelTaskChair(x, z - 1.65, 0, `Desk Chair ${x}_N`);
    createSwivelTaskChair(x, z + 1.65, Math.PI, `Desk Chair ${x}_S`);

    podGrp.position.set(x, 0, z);
    scene.add(podGrp);
  };

  // 3 Rows of Workstations
  createDeskPod(17.5, -12.5);
  createDeskPod(22.5, -12.5);
  createDeskPod(18.5, -6.0);
  createDeskPod(23.5, -6.0);
  createDeskPod(19.0, 0.5);
  createDeskPod(24.0, 0.5);

  // 9. Zone 9: Triple Back Wall Dashboards
  // Screen 1: Blue Telemetry Area Chart
  const screen1 = new THREE.Mesh(
    new THREE.BoxGeometry(5.0, 2.7, 0.08),
    new THREE.MeshStandardMaterial({
      map: screenTextures.chartTexture,
      roughness: 0.2
    })
  );
  screen1.position.set(10.8, 2.3, -21.7);
  screen1.name = 'screen1';
  screen1.castShadow = true;
  scene.add(screen1);

  // Screen 2: LED KPI Scoreboard (168 161 47 34 34)
  const screen2 = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 2.7, 0.08),
    new THREE.MeshStandardMaterial({
      map: screenTextures.kpiTexture,
      roughness: 0.2
    })
  );
  screen2.position.set(16.5, 2.3, -21.7);
  screen2.name = 'screen2';
  screen2.castShadow = true;
  scene.add(screen2);

  // Screen 3: Architecture Blueprint
  const screen3 = new THREE.Mesh(
    new THREE.BoxGeometry(5.0, 2.7, 0.08),
    new THREE.MeshStandardMaterial({
      map: screenTextures.archTexture,
      roughness: 0.2
    })
  );
  screen3.position.set(22.2, 2.3, -21.7);
  screen3.name = 'screen3';
  screen3.castShadow = true;
  scene.add(screen3);

  // 10. Zone 10: Cafe & Bar Area (media_1791967521136.png, media_1791967544187.webp)
  const barGrp = new THREE.Group();

  // Modern Bar Counter Body
  const barBody = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.15, 1.1), darkWallMat);
  barBody.position.set(0, 0.575, 0);
  barBody.castShadow = true;
  barBody.receiveShadow = true;
  barGrp.add(barBody);

  // Polished White Marble Countertop with Overhang
  const barTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.09, 1.3), whiteMat);
  barTop.position.set(0, 1.19, 0);
  barTop.castShadow = true;
  barTop.receiveShadow = true;
  barGrp.add(barTop);

  // Kickplate & Accent Trim
  const kickPlate = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.08, 1.05), brassMat);
  kickPlate.position.set(0, 0.04, 0);
  barGrp.add(kickPlate);

  // Professional Espresso Machine (Stainless Chrome)
  const espressoMachine = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.52, 0.55), chromeMat);
  espressoMachine.position.set(-1.2, 1.48, 0.05);
  espressoMachine.castShadow = true;
  barGrp.add(espressoMachine);

  // Espresso Portafilters & Dials
  [-1.38, -1.02].forEach((hx) => {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8), blackMetalMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(hx, 1.36, 0.38);
    barGrp.add(handle);
  });

  // Coffee Bean Grinder
  const grinder = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.44, 16), blackMetalMat);
  grinder.position.set(-0.45, 1.44, 0.05);
  grinder.castShadow = true;
  barGrp.add(grinder);

  // Stack of Ceramic Coffee Cups
  for (let c = 0; c < 3; c++) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.1, 14), whiteMat);
    cup.position.set(0.4, 1.28 + c * 0.09, 0.1);
    barGrp.add(cup);
  }

  // Fresh Fruit Basket
  const fruitBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.24, 0.14, 18), brassMat);
  fruitBowl.position.set(1.4, 1.3, 0);
  barGrp.add(fruitBowl);

  const fruitMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
  for (let f = 0; f < 4; f++) {
    const orange = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), fruitMat);
    orange.position.set(1.4 + (f % 2) * 0.09 - 0.04, 1.4, Math.floor(f / 2) * 0.09 - 0.04);
    barGrp.add(orange);
  }

  // 3 Suspended Modern Brass Pendant Lamps
  [-1.6, 0, 1.6].forEach((lx) => {
    // Cord
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 2.2, 8), blackMetalMat);
    cord.position.set(lx, 3.2, 0);
    barGrp.add(cord);

    // Brass Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.28, 16), brassMat);
    shade.position.set(lx, 2.1, 0);
    shade.castShadow = true;
    barGrp.add(shade);

    // Warm Light Bulb
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    bulb.position.set(lx, 1.95, 0);
    barGrp.add(bulb);
  });

  barGrp.position.set(-11.5, 0, 11.5);
  scene.add(barGrp);

  // 5 Gold Metal Swivel Bar Stools with Round White Cushions
  [-1.8, -0.9, 0, 0.9, 1.8].forEach((bx, idx) => {
    const stoolGrp = new THREE.Group();

    // Round Brass Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 20), brassMat);
    base.position.y = 0.02;
    base.castShadow = true;
    stoolGrp.add(base);

    // Center Brass Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.82, 12), brassMat);
    stem.position.y = 0.43;
    stem.castShadow = true;
    stoolGrp.add(stem);

    // Footrest Ring
    const footRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 8, 20), brassMat);
    footRing.rotation.x = Math.PI / 2;
    footRing.position.y = 0.32;
    stoolGrp.add(footRing);

    // Round White Fabric Cushion
    const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 20), chairFabricMat);
    cushion.position.y = 0.88;
    cushion.castShadow = true;
    cushion.name = 'clickable_chair';
    stoolGrp.add(cushion);

    const stoolX = -11.5 + bx;
    const stoolZ = 12.85; // Just in front of the bar counter
    stoolGrp.position.set(stoolX, 0, stoolZ);
    scene.add(stoolGrp);

    chairsRef.current.push({
      name: `Cafe Bar Stool ${idx + 1}`,
      pos: new THREE.Vector3(stoolX, 0, stoolZ),
      rot: Math.PI
    });
  });

  // 11. Zone 11: Beanbag Lounge Circle (media_1791967544265.webp)
  const loungeCenter = new THREE.Vector3(-9.5, 0, 3.5);

  // Round Scandinavian Low Wood Coffee Table
  const loungeTable = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.34, 28), whiteMat);
  loungeTable.position.set(loungeCenter.x, 0.17, loungeCenter.z);
  loungeTable.castShadow = true;
  loungeTable.receiveShadow = true;
  scene.add(loungeTable);

  // Succulent Dish on table
  const succPot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.08, 16), darkWallMat);
  succPot.position.set(loungeCenter.x, 0.38, loungeCenter.z);
  scene.add(succPot);

  const succGreen = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.12, 1),
    new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 })
  );
  succGreen.position.set(loungeCenter.x, 0.46, loungeCenter.z);
  scene.add(succGreen);

  // 5 Soft Color Floor Poufs / Beanbags arranged in a circle
  const beanbagColors = [0x65a30d, 0x06b6d4, 0xfef08a, 0xf97316, 0xec4899];
  const beanbagNames = ['Sage Beanbag', 'Cyan Beanbag', 'Cream Beanbag', 'Orange Beanbag', 'Rose Beanbag'];

  for (let b = 0; b < 5; b++) {
    const angle = (b / 5) * Math.PI * 2 + 0.3;
    const bx = loungeCenter.x + Math.cos(angle) * 2.15;
    const bz = loungeCenter.z + Math.sin(angle) * 2.15;

    const beanbagMat = new THREE.MeshStandardMaterial({
      color: beanbagColors[b],
      roughness: 0.88,
      metalness: 0.05
    });

    const beanbag = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 14), beanbagMat);
    beanbag.scale.set(1.0, 0.68, 1.0);
    beanbag.position.set(bx, 0.36, bz);
    beanbag.castShadow = true;
    beanbag.receiveShadow = true;
    beanbag.name = 'clickable_chair';
    scene.add(beanbag);

    chairsRef.current.push({
      name: beanbagNames[b],
      pos: new THREE.Vector3(bx, 0, bz),
      rot: -angle - Math.PI / 2
    });
  }

  return {
    theaterScreen,
    featBoard,
    mobileScreen,
    screen1,
    screen2,
    screen3
  };
}
