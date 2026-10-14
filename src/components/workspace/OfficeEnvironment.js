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
  fCtx.fillStyle = '#eddcc8';
  fCtx.fillRect(0, 0, 1024, 1024);

  // Alternating subtle plank lightness
  for (let y = 0; y < 1024; y += 32) {
    const toneVariation = (Math.sin(y * 0.1) * 8);
    fCtx.fillStyle = `rgba(255, 255, 255, ${0.06 + (toneVariation > 0 ? 0.06 : 0)})`;
    fCtx.fillRect(0, y, 1024, 32);
  }

  // Darker defined plank joint seams
  fCtx.strokeStyle = '#9c8c76';
  fCtx.lineWidth = 2.5;
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
  fCtx.fillStyle = 'rgba(120, 100, 80, 0.08)';
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
  floorTexture.repeat.set(8, 6);

  // Common Materials
  materials.floorMat = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.72,
    metalness: 0.04
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
    new THREE.PlaneGeometry(200, 88),
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
  const createWall = (x, z, w, d, h = 5.0) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials.blackWallMat);
    wall.position.set(x, h / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
    return wall;
  };

  // Solid Back Wall Framing the Triple Screens
  createWall(18, -22, 28, 0.45, 5.0);

  // Theater Left Enclosure Walls
  createWall(-20, -22, 24, 0.45, 5.0);
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
