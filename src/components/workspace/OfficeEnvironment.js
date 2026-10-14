import * as THREE from 'three';

/**
 * Builds the architectural environment matching the Spot Virtual desktop reference:
 * Rich bleached birch flooring, high acoustic black walls, glass boardroom partitions,
 * trough planters with multi-blade snake plants, exterior hills/trees, and calibrated lighting.
 */
export function buildOfficeEnvironment(scene, screenTextures) {
  const materials = {};

  // 1. Procedural Bleached Birch Wood Plank Floor Texture with rich grain
  const floorCanvas = document.createElement('canvas');
  floorCanvas.width = 1024;
  floorCanvas.height = 1024;
  const fCtx = floorCanvas.getContext('2d');
  
  // Base warm light oak / bleached birch tone
  fCtx.fillStyle = '#f1efeb';
  fCtx.fillRect(0, 0, 1024, 1024);

  // Alternating subtle plank lightness
  for (let y = 0; y < 1024; y += 32) {
    const toneVariation = (Math.sin(y * 0.1) * 8);
    fCtx.fillStyle = `rgba(255, 255, 255, ${0.025 + (toneVariation > 0 ? 0.025 : 0)})`;
    fCtx.fillRect(0, y, 1024, 32);
  }

  // Darker defined plank joint seams
  fCtx.strokeStyle = '#c9c4bd';
  fCtx.lineWidth = 1.25;
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
  fCtx.fillStyle = 'rgba(120, 100, 80, 0.045)';
  for (let i = 0; i < 700; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    const rw = 25 + Math.random() * 75;
    fCtx.fillRect(rx, ry, rw, 1.2);
  }

  const floorTexture = new THREE.CanvasTexture(floorCanvas);
  floorTexture.colorSpace = THREE.SRGBColorSpace;
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(9, 7);

  // Common Materials
  materials.floorMat = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.72,
    metalness: 0.04
  });

  // Light brushed acoustic panel used on the architectural wall sections.
  // Fine vertical grain and shallow seams match Spot's pale feature-wall finish.
  const wallCanvas = document.createElement('canvas');
  wallCanvas.width = 512;
  wallCanvas.height = 512;
  const wallCtx = wallCanvas.getContext('2d');
  wallCtx.fillStyle = '#d4d3d0';
  wallCtx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 24) {
    const shade = 196 + ((x * 17) % 22);
    wallCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade - 1})`;
    wallCtx.fillRect(x, 0, 21, 512);
    wallCtx.fillStyle = 'rgba(255,255,255,0.38)';
    wallCtx.fillRect(x, 0, 1.2, 512);
    wallCtx.fillStyle = 'rgba(65,65,65,0.13)';
    wallCtx.fillRect(x + 21, 0, 2, 512);
  }
  wallCtx.fillStyle = 'rgba(80,75,70,0.045)';
  for (let i = 0; i < 700; i++) {
    const x = (i * 73) % 512;
    const y = (i * 137) % 512;
    wallCtx.fillRect(x, y, 1, 8 + (i % 18));
  }
  const wallTexture = new THREE.CanvasTexture(wallCanvas);
  wallTexture.colorSpace = THREE.SRGBColorSpace;
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(3, 2);

  materials.panelWallMat = new THREE.MeshStandardMaterial({
    map: wallTexture,
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.015
  });

  materials.blackWallMat = new THREE.MeshStandardMaterial({
    color: 0x111620,
    roughness: 0.82,
    metalness: 0.12
  });

  materials.frameMat = new THREE.MeshStandardMaterial({
    color: 0x090c12,
    roughness: 0.5,
    metalness: 0.5
  });

  materials.glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    transparent: true,
    opacity: 0.28,
    roughness: 0.04,
    transmission: 0.95,
    thickness: 0.35,
    ior: 1.5
  });

  materials.outdoorGrassMat = new THREE.MeshStandardMaterial({
    color: 0x6e9354,
    roughness: 0.95
  });

  // 2. Lighting System
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8ba67e, 1.45);
  hemiLight.position.set(0, 60, 0);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfffef5, 1.35);
  sunLight.position.set(28, 48, 24);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 1.0;
  sunLight.shadow.camera.far = 135;
  const sCam = 40;
  sunLight.shadow.camera.left = -sCam;
  sunLight.shadow.camera.right = sCam;
  sunLight.shadow.camera.top = sCam;
  sunLight.shadow.camera.bottom = -sCam;
  sunLight.shadow.bias = -0.0003;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xd9ebff, 0.65);
  fillLight.position.set(-25, 28, -25);
  scene.add(fillLight);

  // 3. Floor Mesh
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(68, 0.4, 42), materials.floorMat);
  floorMesh.position.set(0, -0.2, -4);
  floorMesh.receiveShadow = true;
  floorMesh.name = 'floor';
  scene.add(floorMesh);

  // 4. Exterior Landscape (Rolling Green Hills & 3D Trees)
  const outdoorGround = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 120),
    materials.outdoorGrassMat
  );
  outdoorGround.rotation.x = -Math.PI / 2;
  outdoorGround.position.set(0, -0.05, -20);
  outdoorGround.receiveShadow = true;
  scene.add(outdoorGround);

  // Use broad, low ellipsoids instead of oversized cones. The old cones
  // dominated the skyline and pushed the office down in the viewport.
  const createHill = (x, z, r, h, color) => {
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 20),
      new THREE.MeshStandardMaterial({ color, roughness: 0.98 })
    );
    hill.scale.set(r, h * 0.42, r * 0.55);
    hill.position.set(x, -h * 0.22, z);
    hill.receiveShadow = true;
    scene.add(hill);
  };
  createHill(-50, -84, 36, 22, 0x638c50);
  createHill(-17, -88, 44, 27, 0x527f43);
  createHill(23, -86, 40, 24, 0x638c50);
  createHill(64, -80, 34, 20, 0x527f43);

  const createTree = (x, z, scale = 1) => {
    const treeGrp = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35 * scale, 0.45 * scale, 3 * scale, 6),
      new THREE.MeshStandardMaterial({ color: 0x543d2b, roughness: 0.9 })
    );
    trunk.position.y = 1.5 * scale;
    trunk.castShadow = true;
    treeGrp.add(trunk);

    [
      { r: 2.2 * scale, h: 2.5 * scale, y: 3.2 * scale },
      { r: 1.7 * scale, h: 2.2 * scale, y: 4.6 * scale },
      { r: 1.1 * scale, h: 1.8 * scale, y: 5.8 * scale }
    ].forEach((tier) => {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(tier.r, tier.h, 7),
        new THREE.MeshStandardMaterial({ color: 0x3d6b2c, roughness: 0.85 })
      );
      cone.position.y = tier.y;
      cone.castShadow = true;
      treeGrp.add(cone);
    });
    treeGrp.position.set(x, 0, z);
    scene.add(treeGrp);
  };

  [-46, -30, -10, 8, 26, 42, 56].forEach((tx, idx) => {
    createTree(tx, -54 - (idx % 3) * 4, 0.85 + (idx % 2) * 0.18);
  });


  // 4b. Stylized city context outside the office plot. These low-detail blocks
  // provide the urban street-view seen through Spot's glazing without competing
  // with furniture inside the office.
  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x41464a, roughness: 0.96 });
  const curbMat = new THREE.MeshStandardMaterial({ color: 0xb9b9b4, roughness: 0.9 });
  const roadMarkMat = new THREE.MeshBasicMaterial({ color: 0xf2f0e8 });
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xc9c7c0, roughness: 0.93 });

  const addRoad = (width, depth, x, z) => {
    const road = new THREE.Mesh(new THREE.BoxGeometry(width, 0.07, depth), asphaltMat);
    road.position.set(x, -0.025, z);
    scene.add(road);
    return road;
  };

  // Four streets around a rectangular green forecourt.
  addRoad(132, 7.4, 0, -36);
  addRoad(132, 7.4, 0, 28);
  addRoad(7.4, 88, -44.5, -4);
  addRoad(7.4, 88, 44.5, -4);

  // Pale sidewalks between the office lawn and the street edges.
  addRoad(84, 1.15, 0, -30.1).material = sidewalkMat;
  addRoad(84, 1.15, 0, 22.1).material = sidewalkMat;
  addRoad(1.15, 56, -38.2, -4).material = sidewalkMat;
  addRoad(1.15, 56, 38.2, -4).material = sidewalkMat;

  // Broken lane markings.
  for (let x = -64; x <= 64; x += 5.5) {
    [-36, 28].forEach((z) => {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.018, 0.12), roadMarkMat);
      dash.position.set(x, 0.018, z);
      scene.add(dash);
    });
  }
  for (let z = -44; z <= 36; z += 5.5) {
    [-44.5, 44.5].forEach((x) => {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.018, 2.6), roadMarkMat);
      dash.position.set(x, 0.018, z);
      scene.add(dash);
    });
  }

  // Zebra crossings at the four corners of the plot.
  [-44.5, 44.5].forEach((x) => {
    [-36, 28].forEach((z) => {
      for (let i = -4; i <= 4; i++) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 2.35), roadMarkMat);
        stripe.position.set(x + i * 0.55, 0.02, z);
        scene.add(stripe);
      }
    });
  });
  [-36, 28].forEach((z) => {
    [-44.5, 44.5].forEach((x) => {
      for (let i = -4; i <= 4; i++) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.02, 0.34), roadMarkMat);
        stripe.position.set(x, 0.022, z + i * 0.55);
        scene.add(stripe);
      }
    });
  });

  // Repeating facade texture: understated dark glazing divided by light mullions.
  const facadeCanvas = document.createElement('canvas');
  facadeCanvas.width = 256;
  facadeCanvas.height = 512;
  const facadeCtx = facadeCanvas.getContext('2d');
  facadeCtx.fillStyle = '#555b61';
  facadeCtx.fillRect(0, 0, 256, 512);
  for (let y = 8; y < 512; y += 34) {
    facadeCtx.fillStyle = 'rgba(220,220,215,0.42)';
    facadeCtx.fillRect(0, y, 256, 3);
    for (let x = 9; x < 256; x += 31) {
      const tone = 24 + ((x * 3 + y * 7) % 26);
      facadeCtx.fillStyle = `rgb(${tone}, ${tone + 7}, ${tone + 12})`;
      facadeCtx.fillRect(x, y + 5, 22, 23);
      facadeCtx.fillStyle = 'rgba(210,220,225,0.28)';
      facadeCtx.fillRect(x, y + 5, 2, 23);
    }
  }
  const facadeTexture = new THREE.CanvasTexture(facadeCanvas);
  facadeTexture.colorSpace = THREE.SRGBColorSpace;
  facadeTexture.wrapS = THREE.RepeatWrapping;
  facadeTexture.wrapT = THREE.RepeatWrapping;

  const cityBlocks = [
    { x: -63, z: -56, w: 19, d: 17, h: 31, color: 0xc6c4bd },
    { x: -31, z: -57, w: 17, d: 16, h: 23, color: 0xd1c2a7 },
    { x: 8, z: -58, w: 22, d: 17, h: 19, color: 0xbfc4c5 },
    { x: 57, z: -57, w: 21, d: 18, h: 29, color: 0xc3c5c4 },
    { x: -64, z: -3, w: 19, d: 20, h: 20, color: 0xc5c4bd },
    { x: 63, z: -4, w: 21, d: 24, h: 34, color: 0xc1c3c2 },
    { x: -63, z: 45, w: 23, d: 17, h: 28, color: 0xc5b9a2 },
    { x: -25, z: 47, w: 19, d: 18, h: 22, color: 0xc6c6c2 },
    { x: 19, z: 47, w: 22, d: 18, h: 35, color: 0xc5c8ca },
    { x: 62, z: 46, w: 20, d: 18, h: 26, color: 0xc1c1bf }
  ];

  cityBlocks.forEach((b, index) => {
    const facade = new THREE.MeshStandardMaterial({
      map: facadeTexture,
      color: b.color,
      roughness: 0.86,
      metalness: 0.06
    });
    const building = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), facade);
    building.position.set(b.x, b.h / 2 - 0.04, b.z);
    building.receiveShadow = true;
    scene.add(building);

    // Simple roof cap and setback parapet for readable architectural silhouettes.
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(b.w + 0.25, 0.28, b.d + 0.25),
      new THREE.MeshStandardMaterial({ color: 0x454a4e, roughness: 0.82 })
    );
    roof.position.set(b.x, b.h - 0.02, b.z);
    scene.add(roof);
  });

  // Small roadside trees soften the hard city blocks.
  const addStreetTree = (x, z, scale = 1) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 1.7 * scale, 7),
      new THREE.MeshStandardMaterial({ color: 0x675343, roughness: 0.9 })
    );
    trunk.position.y = 0.85 * scale;
    tree.add(trunk);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x47783d, roughness: 0.92 });
    [
      [-0.34, 1.9, 0.1, 0.95],
      [0.28, 2.2, -0.12, 0.82],
      [0, 2.65, 0, 0.9]
    ].forEach(([dx, y, dz, r]) => {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(r * scale, 1), crownMat);
      crown.position.set(dx * scale, y * scale, dz * scale);
      crown.castShadow = true;
      tree.add(crown);
    });
    tree.position.set(x, -0.035, z);
    scene.add(tree);
  };

  [-29, -12, 7, 27].forEach((x, i) => addStreetTree(x, -32.5, 0.8 + (i % 2) * 0.12));
  [-28, -8, 14, 29].forEach((x, i) => addStreetTree(x, 24.5, 0.85 + (i % 2) * 0.12));
  [-20, 1, 22].forEach((z) => addStreetTree(-41.3, z, 0.82));
  [-18, 4, 23].forEach((z) => addStreetTree(41.3, z, 0.82));

  // Right brick wall accent
  const brickWall = new THREE.Mesh(
    new THREE.BoxGeometry(28, 3.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0xb89880, roughness: 0.85 })
  );
  brickWall.position.set(32, 1.7, -34);
  brickWall.castShadow = true;
  brickWall.receiveShadow = true;
  scene.add(brickWall);

  // 5. Architectural Walls (High Black Acoustic Feature Walls)
  const createWall = (x, z, w, d, h = 5.0, material = materials.blackWallMat) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    wall.position.set(x, h / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
    return wall;
  };

  // Solid Back Wall Framing the Triple Screens
  createWall(18, -22, 28, 0.45, 5.0, materials.panelWallMat);

  // Theater Left Enclosure Walls
  createWall(-20, -22, 24, 0.45, 5.0, materials.panelWallMat);
  createWall(-33.5, -14, 0.45, 17, 5.0);
  createWall(-20, -6, 25, 0.45, 4.5);
  createWall(-8.5, -14, 0.45, 16, 4.5);
  createWall(-8.5, 0, 0.45, 12, 4.5);

  // 6. Glass Boardroom Partitions & Sliding Door
  const createGlassEnclosure = () => {
    const group = new THREE.Group();

    // Back Glass Wall
    const glassBack = new THREE.Mesh(new THREE.BoxGeometry(9.6, 4.8, 0.1), materials.glassMat);
    glassBack.position.set(0, 2.4, -21.8);
    group.add(glassBack);

    // Front Glass Wall with Doorway
    const glassLeft = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.8, 0.1), materials.glassMat);
    glassLeft.position.set(-3.0, 2.4, -12.5);
    group.add(glassLeft);

    const glassRight = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.8, 0.1), materials.glassMat);
    glassRight.position.set(3.0, 2.4, -12.5);
    group.add(glassRight);

    // Sliding Door (partially open)
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.6, 0.08), materials.glassMat);
    door.position.set(0.6, 2.3, -12.4);
    group.add(door);

    // Door vertical black handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 12), materials.frameMat);
    handle.position.set(-0.4, 1.8, -12.3);
    group.add(handle);

    // Black frame trims
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.18, 0.16), materials.frameMat);
    topBeam.position.set(0, 4.8, -12.5);
    group.add(topBeam);

    const bottomBeam = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.08, 0.16), materials.frameMat);
    bottomBeam.position.set(0, 0.04, -12.5);
    group.add(bottomBeam);

    scene.add(group);
  };
  createGlassEnclosure();

  // 7. Planters with Multi-Blade Snake Plants (Sansevieria)
  const createPlanter = (x, z, w, d, h = 0.82) => {
    const group = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials.blackWallMat);
    box.position.y = h / 2;
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);

    const soil = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.1, 0.1, d - 0.1),
      new THREE.MeshStandardMaterial({ color: 0x1f1610, roughness: 0.9 })
    );
    soil.position.y = h - 0.05;
    group.add(soil);

    // Realistic upright sword blades (Sansevieria)
    const numPlants = Math.max(6, Math.floor((w + d) * 2.9));
    for (let i = 0; i < numPlants; i++) {
      const plantHeight = 0.62 + Math.random() * 0.42;
      const blade = new THREE.Mesh(
        new THREE.ConeGeometry(0.095, plantHeight, 6),
        new THREE.MeshStandardMaterial({
          color: i % 3 === 0 ? 0x1e4620 : i % 3 === 1 ? 0x276749 : 0x3b7650,
          roughness: 0.6
        })
      );
      const px = (Math.random() - 0.5) * (w - 0.28);
      const pz = (Math.random() - 0.5) * (d - 0.28);
      blade.position.set(px, h + plantHeight / 2 - 0.1, pz);
      blade.rotation.y = Math.random() * Math.PI;
      blade.rotation.z = (Math.random() - 0.5) * 0.12;
      blade.castShadow = true;
      group.add(blade);
    }

    group.position.set(x, 0, z);
    scene.add(group);
  };

  // Planters bounding the middle nook & perimeter
  createPlanter(-7.5, 3.5, 0.8, 7.0);
  createPlanter(-4.0, 6.8, 6.5, 0.8);
  createPlanter(-2.0, 1.8, 0.8, 4.2);
  createPlanter(-33.5, 5.0, 0.8, 19.0);
  createPlanter(-17.0, 16.5, 33.0, 0.8);
  createPlanter(16.0, 16.5, 33.0, 0.8);

  // 8. 3 Illuminated "● spot" Wall Plaques in Corridor
  [-11.5, 0.5, 26.5].forEach((lx) => {
    const signGrp = new THREE.Group();
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1.25, 0.06),
      new THREE.MeshStandardMaterial({
        map: screenTextures.logoTexture,
        roughness: 0.35,
        metalness: 0.1
      })
    );
    signGrp.add(plaque);

    const halo = new THREE.PointLight(0x22c55e, 0.6, 3.5);
    halo.position.set(0, 0, 0.12);
    signGrp.add(halo);

    signGrp.position.set(lx, 3.2, -26.5);
    scene.add(signGrp);
  });

  return { materials };
}
