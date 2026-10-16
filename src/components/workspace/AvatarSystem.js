import * as THREE from 'three';

/**
 * AvatarSystem: High-End 3D Stylized Minifigure / Toy Game Chibi Avatar Engine
 * Faithfully recreating the modern 3D stylized aesthetic from the user's reference:
 * - Cylindrical Minifigure Head with smooth rounded bevel caps
 * - Undistorted 512x512 Procedural Decal Faces:
 *   * Big glossy anime/toy eyes with dual specular catchlights
 *   * Playful winking face variant (^_-)
 *   * Sleek dark wayfarer sunglasses variant
 *   * Cheerful open smile with white upper teeth bar & red tongue
 *   * Confident anime smirk variant
 *   * Soft rosy cheek blush
 * - Iconic C-Shaped Hands (Bevelled Claw Grips) with wrist swivels
 * - Tapered Trapezoid Torso with 3D hood rings, drawstrings, pockets & straps
 * - Chunky Sculpted 3D Hairpieces:
 *   * Black wavy anime hair with layered locks
 *   * Long brunette waves + white studio headphones
 *   * Electric blue spiky anime hair
 *   * Chestnut wavy swept hair + sunglasses
 *   * Tan safari fedora hat + wavy locks peeking
 *   * Half-bun topknot + flowing waves + crossbody bag
 *   * Cyber Android Mascot with glowing scanline visor
 * - Cargo pants with 3D outer pocket flaps & chunky platform sneakers
 * - Full kinematic walking & sitting poses
 */
export function createAvatarSystem() {
  const faceTextureCache = new Map();

  // 1. Procedural 512x512 Canvas Decal Face Generator
  const createMinifigureFaceTexture = ({
    faceType = 'happy', // 'happy' | 'wink' | 'sunglasses' | 'smirk' | 'ai'
    eyeColor = '#10b981',
    isAI = false,
    gender = 'male'
  }) => {
    const cacheKey = `${faceType}_${eyeColor}_${isAI}_${gender}`;
    if (faceTextureCache.has(cacheKey)) {
      return faceTextureCache.get(cacheKey);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);

    // AI Android Visor Screen (DevBot)
    if (isAI || faceType === 'ai') {
      ctx.fillStyle = 'rgba(6, 78, 59, 0.65)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(80, 160, 352, 140, 20);
      ctx.fill();
      ctx.stroke();

      // Scanline grid
      ctx.fillStyle = 'rgba(52, 211, 153, 0.15)';
      for (let y = 170; y < 290; y += 8) {
        ctx.fillRect(86, y, 340, 3);
      }

      // Cheerful glowing digital glyph eyes (^ o ^)
      ctx.strokeStyle = '#6ee7b7';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';

      // Left eye arc
      ctx.beginPath();
      ctx.arc(172, 222, 28, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Right eye arc
      ctx.beginPath();
      ctx.arc(340, 222, 28, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Happy open digital smile
      ctx.beginPath();
      ctx.arc(256, 255, 18, 0, Math.PI);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Status indicator dots
      ctx.fillStyle = '#34d399';
      [-1, 1].forEach((side) => {
        const bx = 256 + side * 128;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(bx + (i - 1) * 12, 310, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      faceTextureCache.set(cacheKey, tex);
      return tex;
    }

    // A. Soft Rosy Cheek Blush
    [-1, 1].forEach((side) => {
      const bx = 256 + side * 120;
      const by = 295;
      const bGrad = ctx.createRadialGradient(bx, by, 6, bx, by, 48);
      bGrad.addColorStop(0, 'rgba(255, 90, 125, 0.55)');
      bGrad.addColorStop(0.6, 'rgba(255, 140, 165, 0.25)');
      bGrad.addColorStop(1, 'rgba(255, 180, 200, 0)');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.ellipse(bx, by, 48, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cute white sparkle glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bx + (side === -1 ? -14 : 14), by - 8, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // B. Eyes / Eyewear
    if (faceType === 'sunglasses') {
      // Sleek Dark Wayfarer Sunglasses (Top-Right archetype)
      ctx.save();
      ctx.fillStyle = '#09090b';
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 5;

      // Left lens frame
      ctx.beginPath();
      ctx.roundRect(130, 185, 110, 76, [16, 16, 24, 24]);
      ctx.fill();
      ctx.stroke();

      // Right lens frame
      ctx.beginPath();
      ctx.roundRect(272, 185, 110, 76, [16, 16, 24, 24]);
      ctx.fill();
      ctx.stroke();

      // Bridge
      ctx.fillRect(236, 198, 40, 14);

      // Sleek diagonal reflection gleam
      ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
      [130, 272].forEach((lx) => {
        ctx.beginPath();
        ctx.moveTo(lx + 24, 192);
        ctx.lineTo(lx + 40, 192);
        ctx.lineTo(lx + 16, 252);
        ctx.lineTo(lx + 2, 252);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    } else {
      const eyeY = 225;
      const eyeSpacing = 82;

      // Draw Left / Standard Eye
      const drawStandardEye = (ex, side) => {
        // Eye White Base with crisp dark border
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, 48, 62, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Deep Glossy Black Iris
        const irisX = ex + (side === -1 ? 2 : -2);
        const irisY = eyeY + 2;
        ctx.beginPath();
        ctx.ellipse(irisX, irisY, 40, 52, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#09090b';
        ctx.fill();

        // Luminous Lower Crescent Reflection
        ctx.beginPath();
        ctx.ellipse(irisX, irisY + 22, 28, 14, 0, 0, Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();

        // Primary Large White Catchlight Sparkle (Top-Left)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(irisX - 11, irisY - 14, 13, 0, Math.PI * 2);
        ctx.fill();

        // Secondary Smaller Catchlight Sparkle (Bottom-Right)
        ctx.beginPath();
        ctx.arc(irisX + 12, irisY + 13, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Tertiary sparkle glint (Top-Right)
        ctx.beginPath();
        ctx.arc(irisX + 10, irisY - 11, 4, 0, Math.PI * 2);
        ctx.fill();

        // Bold Upper Eyelash Rim
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(ex, eyeY - 4, 50, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        // Feminine Winged Lash Tip
        if (gender === 'female') {
          ctx.beginPath();
          ctx.moveTo(ex + side * 44, eyeY - 18);
          ctx.lineTo(ex + side * 58, eyeY - 30);
          ctx.stroke();
        }
      };

      // Draw Left Eye
      drawStandardEye(256 - eyeSpacing, -1);

      // Draw Right Eye (either wink or standard)
      if (faceType === 'wink') {
        // Playful Winking Eye (Top-Middle archetype)
        const rx = 256 + eyeSpacing;
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 7.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(rx, eyeY + 6, 36, Math.PI * 1.16, Math.PI * 1.84);
        ctx.stroke();

        // Flutter lashes
        [-20, 0, 20].forEach((ox) => {
          ctx.beginPath();
          ctx.moveTo(rx + ox, eyeY - 20);
          ctx.lineTo(rx + ox + 8, eyeY - 34);
          ctx.stroke();
        });
      } else {
        drawStandardEye(256 + eyeSpacing, 1);
      }
    }

    // C. Expressive Eyebrows
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';

    if (faceType === 'smirk' || faceType === 'sunglasses') {
      // Confident angled brows
      ctx.beginPath();
      ctx.moveTo(125, 155);
      ctx.lineTo(210, 142);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(302, 140);
      ctx.lineTo(387, 154);
      ctx.stroke();
    } else {
      // Friendly arched brows
      [-1, 1].forEach((side) => {
        const bx = 256 + side * 82;
        ctx.beginPath();
        ctx.moveTo(bx - side * 42, 152);
        ctx.quadraticCurveTo(bx, 134, bx + side * 42, 150);
        ctx.stroke();
      });
    }

    // D. Cheerful Open Smile or Smirk
    if (faceType === 'smirk') {
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 6.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(224, 335);
      ctx.quadraticCurveTo(256, 350, 296, 320);
      ctx.stroke();
    } else {
      // Broad Cheerful Open Smile with Teeth & Tongue (Reference standard)
      const mouthY = 320;
      ctx.save();

      // Mouth outline and dark interior
      ctx.beginPath();
      ctx.moveTo(196, mouthY);
      ctx.quadraticCurveTo(256, 324, 316, mouthY);
      ctx.quadraticCurveTo(256, 396, 196, mouthY);
      ctx.fillStyle = '#18181b';
      ctx.fill();
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Clip inside mouth for teeth and tongue
      ctx.clip();

      // Pure White Upper Teeth Bar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.rect(190, mouthY - 4, 132, 26);
      ctx.fill();

      // Coral/Rose Tongue at Bottom
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(256, 392, 32, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    faceTextureCache.set(cacheKey, tex);
    return tex;
  };

  // 2. Shared Geometry Builders
  // A. Iconic Minifigure C-Shaped Claw Hand
  const createCHandGeometry = () => {
    const outerR = 0.064;
    const innerR = 0.038;
    const arc = Math.PI * 1.35; // 243° curved claw opening
    const startAngle = (Math.PI * 2 - arc) / 2;
    const endAngle = startAngle + arc;

    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, startAngle, endAngle, false);
    const endX = Math.cos(endAngle);
    const endY = Math.sin(endAngle);
    shape.lineTo(innerR * endX, innerR * endY);
    shape.absarc(0, 0, innerR, endAngle, startAngle, true);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.052,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.005
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  };

  // B. Tapered Minifigure Torso (Trapezoidal prism with bevels)
  const createTorsoGeometry = (topW = 0.38, botW = 0.48, h = 0.50, d = 0.26) => {
    const shape = new THREE.Shape();
    const halfTop = topW / 2;
    const halfBot = botW / 2;
    const halfH = h / 2;

    shape.moveTo(-halfBot, -halfH);
    shape.lineTo(halfBot, -halfH);
    shape.lineTo(halfTop, halfH);
    shape.lineTo(-halfTop, halfH);
    shape.closePath();

    const extrudeSettings = {
      depth: d,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.014,
      bevelThickness: 0.014
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  };

  const sharedCHandGeo = createCHandGeometry();
  const sharedTorsoGeo = createTorsoGeometry();

  // Shared Standard Materials
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const whiteSoleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.45 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.45 });
  const denimMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.55 });
  const khakiMat = new THREE.MeshStandardMaterial({ color: 0xd4b996, roughness: 0.60 });

  // 3. Avatar Factory
  const buildAvatar = (name, initialPos, config = {}) => {
    const root = new THREE.Group();
    root.name = `avatar_${name}`;

    const isAI = config.status === 'ai-agent' || name.includes('DevBot');
    const skinHex = isAI ? 0xd1fae5 : (config.skinColor || 0xf6d5be);
    const skinMat = new THREE.MeshStandardMaterial({
      color: skinHex,
      roughness: 0.38
    });

    // Determine Archetype
    const faceType = config.faceType || (
      isAI ? 'ai' : (
        config.hasGlasses ? 'sunglasses' : (
          name === 'Stefan' || name === 'Wes' ? 'smirk' : (
            name === 'Sarah' || config.gender === 'female' ? 'wink' : 'happy'
          )
        )
      )
    );

    // 1. Head Assembly (y = 1.80)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.80;

    // Small neck pin
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.12, 16), skinMat);
    neck.position.set(0, -0.22, 0);
    headGroup.add(neck);

    // Cylindrical Minifigure Head with rounded bevel domes
    const headCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.30, 28), skinMat);
    headCylinder.castShadow = true;
    headGroup.add(headCylinder);

    const topCap = new THREE.Mesh(new THREE.SphereGeometry(0.26, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), skinMat);
    topCap.position.y = 0.15;
    headGroup.add(topCap);

    const botCap = new THREE.Mesh(new THREE.SphereGeometry(0.26, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), skinMat);
    botCap.position.y = -0.15;
    headGroup.add(botCap);

    // Undistorted Cylinder Decal Face
    const faceTex = createMinifigureFaceTexture({
      faceType: faceType,
      isAI: isAI,
      gender: config.gender || 'male',
      eyeColor: config.eyeColor || '#10b981'
    });

    // Mapped cleanly on front curved surface of cylinder (126° azimuth centered on +Z)
    const faceGeo = new THREE.CylinderGeometry(
      0.264, 0.264, 0.36,
      28, 1, true,
      Math.PI * 1.65, Math.PI * 0.70
    );
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      transparent: true,
      roughness: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.renderOrder = 3;
    headGroup.add(faceMesh);

    // 2. Sculpted Chunky 3D Hairpieces & Headwear (Reference Archetypes)
    const hairColor = config.hairColor || 0x1c1917;
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.40 });

    if (isAI) {
      // DevBot AI: Futuristic Cyber Mascot Helmet with Floating Neon Halo
      const haloMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.024, 8, 24), haloMat);
      halo.position.set(0, 0.44, 0);
      halo.rotation.x = Math.PI / 2;
      headGroup.add(halo);

      const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18), whiteMat);
      antennaStem.position.set(0, 0.40, 0);
      headGroup.add(antennaStem);

      const ledOrb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), haloMat);
      ledOrb.position.set(0, 0.50, 0);
      headGroup.add(ledOrb);
    } else if (config.hairType === 'safari_hat' || name === 'Phil') {
      // Archetype 5: Phil (Bottom-Left) - Tan Safari Fedora Hat with Brown Band
      const hatMat = khakiMat;
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.7 });

      // Crown
      const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.16, 20), hatMat);
      hatCrown.position.set(0, 0.28, -0.01);
      hatCrown.rotation.x = -0.06;
      headGroup.add(hatCrown);

      // Hat Band
      const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.272, 0.272, 0.04, 20), bandMat);
      hatBand.position.set(0, 0.22, -0.01);
      hatBand.rotation.x = -0.06;
      headGroup.add(hatBand);

      // Wide Brim
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.025, 24), hatMat);
      brim.position.set(0, 0.20, 0);
      brim.rotation.x = -0.06;
      headGroup.add(brim);

      // Wavy hair locks peeking from underneath brim
      const brownHairMat = new THREE.MeshStandardMaterial({ color: 0x4a2c1d, roughness: 0.4 });
      [-0.24, 0.24].forEach((hx) => {
        const sideLock = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.18, 6, 10), brownHairMat);
        sideLock.position.set(hx, 0.10, 0.08);
        headGroup.add(sideLock);
      });
      const backHair = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 16), brownHairMat);
      backHair.position.set(0, 0.10, -0.10);
      headGroup.add(backHair);
    } else if (config.hairType === 'cyber_spikes' || name === 'Stefan') {
      // Archetype 3: Stefan (Bottom-Middle) - Dynamic Electric Blue Spiky Anime Hair
      const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35 });

      const skullCap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.58), blueMat);
      skullCap.position.set(0, 0.12, -0.02);
      headGroup.add(skullCap);

      // Sculpted dynamic spikes
      const spikeAngles = [
        { pos: [0.00, 0.38, 0.04], rot: [-0.2, 0.1, -0.1], s: [0.08, 0.24] },
        { pos: [-0.14, 0.34, 0.08], rot: [-0.1, 0.2, -0.4], s: [0.07, 0.22] },
        { pos: [0.14, 0.34, 0.06], rot: [-0.1, -0.2, 0.4], s: [0.07, 0.22] },
        { pos: [-0.22, 0.24, 0.12], rot: [0.2, 0, -0.6], s: [0.06, 0.20] },
        { pos: [0.22, 0.24, 0.12], rot: [0.2, 0, 0.6], s: [0.06, 0.20] },
        { pos: [0.04, 0.28, 0.24], rot: [0.4, 0, -0.2], s: [0.07, 0.18] },
        { pos: [-0.08, 0.28, 0.23], rot: [0.4, 0, 0.3], s: [0.07, 0.18] }
      ];
      spikeAngles.forEach(({ pos, rot, s }) => {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(s[0], s[1], 8), blueMat);
        spike.position.set(...pos);
        spike.rotation.set(...rot);
        headGroup.add(spike);
      });
    } else if (config.hairType === 'long_waves_headphones' || name === 'Sarah') {
      // Archetype 2: Sarah (Top-Middle) - Long Brunette Cascading Waves + White Studio Headphones
      const brunetteMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.40 });

      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.285, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), brunetteMat);
      skullDome.position.set(0, 0.12, -0.02);
      headGroup.add(skullDome);

      // Parted bangs
      [-0.10, 0.10].forEach((bx) => {
        const bang = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.18, 6, 12), brunetteMat);
        bang.position.set(bx, 0.25, 0.27);
        bang.rotation.set(0.30, 0, bx < 0 ? -0.3 : 0.3);
        headGroup.add(bang);
      });

      // Flowing wavy tresses cascading past shoulders
      [-0.26, 0.26].forEach((sx) => {
        const wave1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.32, 8, 14), brunetteMat);
        wave1.position.set(sx, 0.02, 0.16);
        wave1.rotation.set(0.15, 0, sx < 0 ? 0.12 : -0.12);
        headGroup.add(wave1);

        const wave2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.060, 0.30, 8, 14), brunetteMat);
        wave2.position.set(sx < 0 ? sx - 0.02 : sx + 0.02, -0.18, 0.14);
        wave2.rotation.set(0.10, 0, sx < 0 ? -0.18 : 0.18);
        headGroup.add(wave2);
      });

      // Back volume
      const backWaves = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), brunetteMat);
      backWaves.position.set(0, 0.02, -0.12);
      headGroup.add(backWaves);

      // White Studio Headphones over the hair
      const hpMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.024, 8, 24, Math.PI), hpMat);
      hpBand.position.set(0, 0.15, 0.01);
      headGroup.add(hpBand);

      [-0.32, 0.32].forEach((cx) => {
        const earcup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), hpMat);
        earcup.rotation.z = Math.PI / 2;
        earcup.position.set(cx, 0.15, 0.01);
        headGroup.add(earcup);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.01, 8, 16), blackMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(cx + (cx < 0 ? -0.028 : 0.028), 0.15, 0.01);
        headGroup.add(ring);
      });
    } else if (config.hairType === 'topknot_waves' || name === 'Chloe') {
      // Archetype 6: Chloe (Bottom-Right) - Topknot Half-Bun + Cascading Brunette Waves
      const chloeMat = new THREE.MeshStandardMaterial({ color: 0x4a2c1d, roughness: 0.40 });

      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.285, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), chloeMat);
      skullDome.position.set(0, 0.12, -0.02);
      headGroup.add(skullDome);

      // High Topknot Bun on Crown
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), chloeMat);
      bun.position.set(0, 0.38, 0.02);
      headGroup.add(bun);

      const scrunchieMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 });
      const scrunchie = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 16), scrunchieMat);
      scrunchie.position.set(0, 0.33, 0.02);
      scrunchie.rotation.x = Math.PI / 2;
      headGroup.add(scrunchie);

      // Cascading shoulder waves
      [-0.26, 0.26].forEach((sx) => {
        const wave = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.38, 8, 14), chloeMat);
        wave.position.set(sx, -0.08, 0.14);
        wave.rotation.set(0.12, 0, sx < 0 ? 0.12 : -0.12);
        headGroup.add(wave);
      });
    } else if (config.hairType === 'swept_brown' || name === 'Wes') {
      // Archetype 4: Wes (Top-Right) - Chestnut Wavy Swept Hair
      const wesMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.40 });

      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.285, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.58), wesMat);
      skullDome.position.set(0, 0.12, -0.02);
      headGroup.add(skullDome);

      // Layered side-swept locks
      const sweep = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.24, 8, 12), wesMat);
      sweep.position.set(0.05, 0.28, 0.26);
      sweep.rotation.set(0.35, 0.15, -0.30);
      headGroup.add(sweep);

      [-0.24, 0.24].forEach((sx) => {
        const sideLock = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.18, 6, 10), wesMat);
        sideLock.position.set(sx, 0.10, 0.14);
        headGroup.add(sideLock);
      });
    } else if (config.hairType === 'twin_buns' || name === 'Andi') {
      // Andi: Golden Blond Twin Buns with Ribbons
      const blondMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.40 });
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.285, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), blondMat);
      skullDome.position.set(0, 0.12, -0.02);
      headGroup.add(skullDome);

      [-0.26, 0.26].forEach((bx) => {
        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), blondMat);
        bun.position.set(bx, 0.32, -0.02);
        headGroup.add(bun);
      });
    } else if (config.hatType === 'beanie' || name === 'Alex') {
      // Alex: Slouchy Knit Beanie
      const beanieDome = new THREE.Mesh(new THREE.SphereGeometry(0.31, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.6), darkMat);
      beanieDome.position.set(0, 0.16, 0);
      headGroup.add(beanieDome);

      const brim = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.045, 10, 24), darkMat);
      brim.position.set(0, 0.12, 0);
      brim.rotation.x = Math.PI / 2;
      headGroup.add(brim);

      [-0.08, 0.06].forEach((bx) => {
        const bang = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.14, 6, 10), hairMat);
        bang.position.set(bx, 0.18, 0.28);
        bang.rotation.z = bx < 0 ? -0.3 : 0.3;
        headGroup.add(bang);
      });
    } else {
      // Archetype 1: Ayush (Player / Top-Left) - Black Wavy Anime Hair with Chunky Locks
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.30, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
      skullDome.position.set(0, 0.14, -0.02);
      skullDome.rotation.x = -0.08;
      headGroup.add(skullDome);

      // Back volume
      const backHair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), hairMat);
      backHair.position.set(0, 0.04, -0.10);
      headGroup.add(backHair);

      // Parted wavy bangs
      const mainBang = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.24, 8, 12), hairMat);
      mainBang.position.set(-0.06, 0.26, 0.27);
      mainBang.rotation.set(0.35, 0.12, -1.25);
      headGroup.add(mainBang);

      const sideBang = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.22, 8, 12), hairMat);
      sideBang.position.set(0.12, 0.25, 0.27);
      sideBang.rotation.set(0.32, -0.15, -1.10);
      headGroup.add(sideBang);

      const centerTuft = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.18, 6, 10), hairMat);
      centerTuft.position.set(0.02, 0.29, 0.28);
      centerTuft.rotation.set(0.40, 0.05, -0.4);
      headGroup.add(centerTuft);

      // Side cheek locks
      [-0.26, 0.26].forEach((sx) => {
        const lock = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.22, 6, 10), hairMat);
        lock.position.set(sx, 0.10, 0.14);
        lock.rotation.set(0.15, 0, sx < 0 ? 0.15 : -0.15);
        headGroup.add(lock);
      });

      // Crown wave tufts (3 textured chunky clumps on crown)
      const crownWave1 = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.20, 8), hairMat);
      crownWave1.position.set(0.06, 0.40, 0.08);
      crownWave1.rotation.set(-0.35, 0.2, -0.4);
      headGroup.add(crownWave1);

      const crownWave2 = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.18, 8), hairMat);
      crownWave2.position.set(-0.08, 0.38, 0.04);
      crownWave2.rotation.set(-0.3, -0.2, 0.3);
      headGroup.add(crownWave2);
    }

    root.add(headGroup);

    // 3. Tapered Minifigure Torso Assembly & Outfits
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.20;

    let torsoMat;
    const isPlayer = config.isPlayer || false;
    const isRedHoodie = config.clothing === 'red_hoodie' || isPlayer;
    const isPinkJacket = config.clothing === 'pink_jacket' || name === 'Sarah';
    const isCyberJacket = config.clothing === 'cyber_jacket' || name === 'Stefan';
    const isKhaki = config.clothing === 'safari_khaki' || name === 'Phil';
    const isOveralls = config.clothing === 'overalls' || name === 'Chloe';
    const isMoto = config.clothing === 'moto_jacket' || name === 'Wes';

    if (isRedHoodie) {
      torsoMat = new THREE.MeshStandardMaterial({ color: config.shirtColor || 0xdc2626, roughness: 0.45 });
    } else if (isPinkJacket) {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.45 });
    } else if (isCyberJacket) {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.40 });
    } else if (isKhaki) {
      torsoMat = khakiMat;
    } else if (isOveralls) {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.50 });
    } else if (isMoto) {
      torsoMat = blackMat;
    } else if (isAI) {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.3, roughness: 0.3 });
    } else {
      torsoMat = new THREE.MeshStandardMaterial({ color: config.shirtColor || 0x38bdf8, roughness: 0.45 });
    }

    // Tapered Trapezoid Torso Mesh
    const torsoMesh = new THREE.Mesh(sharedTorsoGeo, torsoMat);
    torsoMesh.castShadow = true;
    torsoGroup.add(torsoMesh);

    // Outfit 3D Details
    if (isRedHoodie || isPinkJacket) {
      // White T-shirt insert in open jacket
      const innerTee = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.46, 0.02), whiteMat);
      innerTee.position.set(0, 0, 0.138);
      torsoGroup.add(innerTee);

      // Hood collar ring around neck
      const hoodRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 8, 20), torsoMat);
      hoodRing.position.set(0, 0.25, -0.02);
      hoodRing.rotation.x = Math.PI / 2;
      torsoGroup.add(hoodRing);

      // White drawstring cords
      [-0.05, 0.05].forEach((cx) => {
        const cord = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.16, 6, 10), whiteMat);
        cord.position.set(cx, 0.12, 0.155);
        cord.rotation.x = -0.12;
        torsoGroup.add(cord);
      });
    } else if (isCyberJacket) {
      // Stefan: Glowing Cyan Illuminated Circuit Trims
      const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      [-0.14, 0.14].forEach((nx) => {
        const circuitStripe = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.44, 0.015), neonMat);
        circuitStripe.position.set(nx, 0, 0.138);
        torsoGroup.add(circuitStripe);
      });
      const chestEmblem = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 16), neonMat);
      chestEmblem.position.set(0, 0.08, 0.138);
      torsoGroup.add(chestEmblem);
    } else if (isKhaki) {
      // Phil: Khaki Safari Explorer Shirt with Brass Compass
      const pocketMat = new THREE.MeshStandardMaterial({ color: 0xc4a480, roughness: 0.6 });
      [-0.11, 0.11].forEach((px) => {
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.025), pocketMat);
        pocket.position.set(px, 0.06, 0.14);
        torsoGroup.add(pocket);
      });
      const compassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
      const compass = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.015, 16), compassMat);
      compass.rotation.x = Math.PI / 2;
      compass.position.set(0, -0.06, 0.145);
      torsoGroup.add(compass);
    } else if (isOveralls) {
      // Chloe: Dungarees Overalls with White Knit Sweater Underneath
      const sweaterMat = whiteMat;
      const innerSweater = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.02), sweaterMat);
      innerSweater.position.set(0, 0, 0.135);
      torsoGroup.add(innerSweater);

      // Overalls Bib & Shoulder Straps
      const bib = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.02), torsoMat);
      bib.position.set(0, -0.10, 0.145);
      torsoGroup.add(bib);

      [-0.10, 0.10].forEach((sx) => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.02), torsoMat);
        strap.position.set(sx, 0.04, 0.145);
        torsoGroup.add(strap);
      });
    } else if (isMoto) {
      // Wes: Black Moto Jacket with Crossbody Sling Strap
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.6 });
      const slingStrap = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.56, 0.02), strapMat);
      slingStrap.position.set(0, 0, 0.145);
      slingStrap.rotation.z = 0.55;
      torsoGroup.add(slingStrap);
    }

    root.add(torsoGroup);

    // 4. Articulated Arms with Iconic C-Shaped Claw Hands
    const armMat = isOveralls ? whiteMat : torsoMat;

    const buildArm = (side) => {
      const armPivot = new THREE.Group();
      armPivot.position.set(side * 0.28, 1.40, 0);

      // Shoulder ball
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), armMat);
      armPivot.add(shoulder);

      // Upper arm
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.060, 0.26, 14), armMat);
      upperArm.position.y = -0.13;
      upperArm.castShadow = true;
      armPivot.add(upperArm);

      const elbowPivot = new THREE.Group();
      elbowPivot.position.set(0, -0.26, 0);

      // Forearm
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.060, 0.054, 0.22, 14), armMat);
      forearm.position.y = -0.11;
      forearm.castShadow = true;
      elbowPivot.add(forearm);

      // Wrist ring
      const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.04, 12), armMat);
      wrist.position.set(0, -0.22, 0);
      elbowPivot.add(wrist);

      // Iconic Minifigure C-Shaped Hand
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.26, 0);

      const cHand = new THREE.Mesh(sharedCHandGeo, skinMat);
      cHand.rotation.y = side < 0 ? -Math.PI / 2 : Math.PI / 2;
      cHand.rotation.x = Math.PI / 2;
      handGroup.add(cHand);

      elbowPivot.add(handGroup);
      armPivot.add(elbowPivot);

      armPivot.rotation.z = side * 0.06;
      elbowPivot.rotation.x = -0.08;

      return { armPivot, elbowPivot };
    };

    const leftArm = buildArm(-1);
    const rightArm = buildArm(1);
    root.add(leftArm.armPivot);
    root.add(rightArm.armPivot);

    // 5. Pelvis & Articulated Legs with Cargo Pockets & Platform Sneakers
    const pantsMat = (isPinkJacket || name === 'Sarah') ? denimMat : (
      isKhaki ? khakiMat : (
        isOveralls ? torsoMat : (
          config.pantsColor === 'dark' || isPlayer || isCyberJacket || isMoto ? blackMat : darkMat
        )
      )
    );

    // Pelvis waistband bracket
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 18), pantsMat);
    pelvis.position.set(0, 0.88, 0);
    pelvis.scale.set(1.0, 1.0, 0.6);
    pelvis.castShadow = true;
    root.add(pelvis);

    const buildLeg = (legX) => {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(legX, 0.82, 0);

      // Main leg shaft
      const legShaft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.44, 0.22), pantsMat);
      legShaft.position.set(0, -0.22, 0);
      legShaft.castShadow = true;
      hipPivot.add(legShaft);

      // 3D Cargo Pocket on outer side
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.14, 0.14), pantsMat);
      pocket.position.set(legX < 0 ? -0.10 : 0.10, -0.18, 0);
      hipPivot.add(pocket);

      const kneePivot = new THREE.Group();
      kneePivot.position.set(0, -0.44, 0);

      // Chunky Platform Sneaker (Reference high-top)
      const shoeGroup = new THREE.Group();

      // Thick white platform rubber sole
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.055, 0.28), whiteSoleMat);
      sole.position.set(0, 0.028, 0.04);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Midsole colored accent strip
      const shoeAccentColor = isRedHoodie ? 0xdc2626 : (isPinkJacket ? 0xf472b6 : (isCyberJacket ? 0x00f0ff : 0x18181b));
      const accentMat = new THREE.MeshStandardMaterial({ color: shoeAccentColor, roughness: 0.4 });
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.192, 0.016, 0.282), accentMat);
      strip.position.set(0, 0.060, 0.04);
      shoeGroup.add(strip);

      // Sneaker upper body
      const shoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.065, 0.24), accentMat);
      shoeUpper.position.set(0, 0.095, 0.03);
      shoeUpper.castShadow = true;
      shoeGroup.add(shoeUpper);

      // Rounded toe bumper
      const toeBumper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.055, 12, 1, false, 0, Math.PI), whiteSoleMat);
      toeBumper.rotation.y = Math.PI / 2;
      toeBumper.position.set(0, 0.045, 0.16);
      shoeGroup.add(toeBumper);

      kneePivot.add(shoeGroup);
      hipPivot.add(kneePivot);

      return { hipPivot, kneePivot };
    };

    const leftLeg = buildLeg(-0.11);
    const rightLeg = buildLeg(0.11);
    root.add(leftLeg.hipPivot);
    root.add(rightLeg.hipPivot);

    root.position.copy(initialPos);
    if (config.initialRot) root.rotation.y = config.initialRot;

    return {
      name,
      role: config.role || 'Teammate',
      mesh: root,
      isPlayer: config.isPlayer || false,
      status: config.status || 'online',
      initialSitting: config.isSitting || false,
      seatHeight: config.seatHeight || 0.46,
      materials: {
        skinMat,
        torsoMat,
        faceMat
      },
      config,
      parts: {
        headGroup,
        torsoGroup,
        leftArmPivot: leftArm.armPivot,
        rightArmPivot: rightArm.armPivot,
        leftElbowPivot: leftArm.elbowPivot,
        rightElbowPivot: rightArm.elbowPivot,
        leftLegPivot: leftLeg.hipPivot,
        rightLegPivot: rightLeg.hipPivot,
        leftKneePivot: leftLeg.kneePivot,
        rightKneePivot: rightLeg.kneePivot
      }
    };
  };

  /**
   * Applies realistic kinematic poses:
   * - Walking: Alternating hip stride, knee flexion, counter arm swing.
   * - Sitting: Legs pivot 90° forward (-1.45 rad), arms rest forward.
   * - Standing Idle: Gentle breathing sway, wave emote.
   */
  const applyAvatarPose = (parts, { isMoving = false, walkCycle = 0, isSitting = false, emote = null, elapsed = 0 }) => {
    if (!parts) return;

    if (isMoving) {
      const stride = Math.sin(walkCycle);
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = stride * 0.55;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -stride * 0.55;

      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = Math.max(0, -stride * 0.60);
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = Math.max(0, stride * 0.60);

      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -stride * 0.45;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = stride * 0.45;

      if (parts.torsoGroup) parts.torsoGroup.position.y = 1.20;
    } else if (isSitting) {
      // Classic Minifigure 90° forward seated leg pose
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = -1.45;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -1.45;

      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = 0;
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = 0;

      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -0.55;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = -0.55;

      if (parts.torsoGroup) parts.torsoGroup.position.y = 1.20;
    } else {
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = 0;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = 0;
      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = 0;
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = 0;
      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = 0;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = 0;

      if (emote === 'wave' && parts.rightArmPivot) {
        parts.rightArmPivot.rotation.z = Math.PI * 0.68 + Math.sin(elapsed * 12) * 0.3;
        parts.rightArmPivot.rotation.x = -0.35;
      } else if (parts.rightArmPivot) {
        parts.rightArmPivot.rotation.z = 0.06;
        parts.rightArmPivot.rotation.x = 0;
      }

      if (parts.torsoGroup) {
        parts.torsoGroup.position.y = 1.20 + Math.sin(elapsed * 2.5) * 0.012;
      }
    }
  };

  // 4. Create Full Office Roster of 11 Minifigure Teammates
  const createRoster = (scene, playerConfig = {}) => {
    const list = [];

    let skinHex = 0xf6d5be;
    if (playerConfig.skinColor) {
      if (typeof playerConfig.skinColor === 'string') {
        skinHex = parseInt(playerConfig.skinColor.replace('#', '0x'), 16);
      } else {
        skinHex = playerConfig.skinColor;
      }
    }

    const hairType = playerConfig.hairType || (playerConfig.gender === 'female' ? 'long_waves_headphones' : 'black_waves');
    const shirtColor = playerConfig.shirtColor || 0xdc2626;

    // 1. Ayush (Active Player) - Top-Left: Red open hoodie, wavy black hair, cheerful open smile
    const ayush = buildAvatar(playerConfig.name || 'Ayush (you)', new THREE.Vector3(-9.0, 0, 16.0), {
      isPlayer: true,
      skinColor: skinHex,
      hairType: hairType,
      hairColor: playerConfig.hairColor || 0x1c1917,
      clothing: 'red_hoodie',
      shirtColor: shirtColor,
      faceType: 'happy',
      gender: playerConfig.gender || 'male',
      role: 'Digital Lead'
    });
    scene.add(ayush.mesh);
    list.push(ayush);

    // 2. Sarah - Top-Middle: Long brunette waves, white headphones, pink jacket, winking face
    const sarah = buildAvatar('Sarah', new THREE.Vector3(-17.2, 0, 4.8), {
      hairType: 'long_waves_headphones',
      hairColor: 0x3e2723,
      clothing: 'pink_jacket',
      faceType: 'wink',
      gender: 'female',
      isSitting: true,
      role: 'Product Designer'
    });
    scene.add(sarah.mesh);
    list.push(sarah);

    // 3. Stefan - Bottom-Middle: Electric blue spiky anime hair, cyber jacket with neon cyan trims
    const stefan = buildAvatar('Stefan', new THREE.Vector3(-1.0, 0, 2.0), {
      hairType: 'cyber_spikes',
      hairColor: 0x0284c7,
      clothing: 'cyber_jacket',
      faceType: 'smirk',
      isSitting: true,
      role: 'Audio Engineer'
    });
    scene.add(stefan.mesh);
    list.push(stefan);

    // 4. Wes - Top-Right: Chestnut wavy swept hair, dark sleek sunglasses, black moto jacket
    const wes = buildAvatar('Wes', new THREE.Vector3(6.0, 0, -19.0), {
      hairType: 'swept_brown',
      hairColor: 0x6b4226,
      clothing: 'moto_jacket',
      faceType: 'sunglasses',
      hasGlasses: true,
      role: 'Platform Architect'
    });
    scene.add(wes.mesh);
    list.push(wes);

    // 5. Phil - Bottom-Left: Adventurer with tan safari fedora hat, khaki outfit, chest compass badge
    const phil = buildAvatar('Phil', new THREE.Vector3(4.8, 0, 2.5), {
      hairType: 'safari_hat',
      clothing: 'safari_khaki',
      faceType: 'happy',
      isSitting: true,
      role: 'Infrastructure'
    });
    scene.add(phil.mesh);
    list.push(phil);

    // 6. Chloe - Bottom-Right: Topknot half-bun + cascading brunette waves, honey mustard dungarees
    const chloe = buildAvatar('Chloe', new THREE.Vector3(-4.5, 0, 4.2), {
      hairType: 'topknot_waves',
      clothing: 'overalls',
      faceType: 'happy',
      gender: 'female',
      isSitting: true,
      initialRot: Math.PI / 2,
      role: 'Growth & Events'
    });
    scene.add(chloe.mesh);
    list.push(chloe);

    // 7. Andi - Energetic twin buns, coral streetwear bomber
    const andi = buildAvatar('Andi', new THREE.Vector3(-21.5, 0, 5.8), {
      hairType: 'twin_buns',
      hairColor: 0xfbbf24,
      clothing: 'pink_jacket',
      faceType: 'happy',
      gender: 'female',
      isSitting: true,
      role: 'Operations'
    });
    scene.add(andi.mesh);
    list.push(andi);

    // 8. Steven - Cyber engineer with silver-frosted crop
    const steven = buildAvatar('Steven', new THREE.Vector3(17.5, 0, -14.1), {
      hairType: 'cyber_spikes',
      hairColor: 0x94a3b8,
      clothing: 'cyber_jacket',
      isSitting: true,
      role: 'Frontend Engineer'
    });
    scene.add(steven.mesh);
    list.push(steven);

    // 9. Alex - Streetwear developer with knit beanie & hoodie
    const alex = buildAvatar('Alex', new THREE.Vector3(22.5, 0, -14.1), {
      hatType: 'beanie',
      clothing: 'red_hoodie',
      shirtColor: 0x15803d, // Forest green
      isSitting: true,
      role: 'WebRTC Specialist'
    });
    scene.add(alex.mesh);
    list.push(alex);

    // 10. Graham - Tactical crop with olive bomber
    const graham = buildAvatar('Graham', new THREE.Vector3(15.2, 0, -5.2), {
      clothing: 'red_hoodie',
      shirtColor: 0x166534,
      role: 'Security & DevOps'
    });
    scene.add(graham.mesh);
    list.push(graham);

    // 11. DevBot (Autonomous AI Agent) - High-tech cyber android mascot
    const devBot = buildAvatar('DevBot (AI)', new THREE.Vector3(0, 0, -17.0), {
      status: 'ai-agent',
      faceType: 'ai',
      isSitting: true,
      role: 'Autonomous Agent'
    });
    scene.add(devBot.mesh);
    list.push(devBot);

    // Apply initial sitting posture
    list.forEach((av) => {
      if (av.initialSitting) {
        av.mesh.position.y = -0.18;
        applyAvatarPose(av.parts, { isSitting: true });
      }
    });

    return list;
  };

  return {
    buildAvatar,
    applyAvatarPose,
    createRoster,
    createMinifigureFaceTexture
  };
}
