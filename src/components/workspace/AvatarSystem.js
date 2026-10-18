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
    faceType = 'happy', // 'happy' | 'wink' | 'smirk' | 'sunglasses' | 'glasses' | 'cyber_visor'
    mouthType = 'smile_teeth', // 'smile_teeth' | 'gentle_smile' | 'smirk' | 'open_laugh'
    noseType = 'clean', // 'clean' | 'cute_nose' | 'freckles' | 'blush'
    eyeColor = '#10b981',
    isAI = false,
    gender = 'male'
  }) => {
    const cacheKey = `${faceType}_${mouthType}_${noseType}_${eyeColor}_${isAI}_${gender}`;
    if (faceTextureCache.has(cacheKey)) {
      return faceTextureCache.get(cacheKey);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);

    // AI Android Visor Screen (DevBot)
    if (isAI || faceType === 'cyber_visor') {
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
    if (noseType === 'blush' || noseType === 'freckles' || faceType === 'happy' || faceType === 'wink') {
      [-1, 1].forEach((side) => {
        const bx = 256 + side * 96;
        const by = 280;
        const bGrad = ctx.createRadialGradient(bx, by, 4, bx, by, 38);
        bGrad.addColorStop(0, 'rgba(255, 90, 125, 0.55)');
        bGrad.addColorStop(0.6, 'rgba(255, 140, 165, 0.25)');
        bGrad.addColorStop(1, 'rgba(255, 180, 200, 0)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.ellipse(bx, by, 38, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cute white sparkle glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx + (side === -1 ? -10 : 10), by - 6, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // B. Freckles / Nose
    if (noseType === 'freckles') {
      ctx.fillStyle = 'rgba(120, 53, 15, 0.50)';
      [-1, 1].forEach((side) => {
        [
          [side * 62, 262, 2.2],
          [side * 78, 270, 1.8],
          [side * 92, 265, 2.0],
          [side * 105, 276, 1.8],
          [side * 48, 272, 1.6]
        ].forEach(([fx, fy, fr]) => {
          ctx.beginPath();
          ctx.arc(256 + fx, fy, fr, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    if (noseType === 'cute_nose') {
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.55)';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(254, 246);
      ctx.lineTo(258, 254);
      ctx.stroke();
    }

    // C. Eyes / Eyewear
    if (faceType === 'sunglasses') {
      // Sleek Dark Wayfarer Sunglasses (Top-Right archetype)
      ctx.save();
      ctx.fillStyle = '#09090b';
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 5;

      // Left lens frame
      ctx.beginPath();
      ctx.roundRect(140, 175, 100, 68, [14, 14, 20, 20]);
      ctx.fill();
      ctx.stroke();

      // Right lens frame
      ctx.beginPath();
      ctx.roundRect(272, 175, 100, 68, [14, 14, 20, 20]);
      ctx.fill();
      ctx.stroke();

      // Bridge
      ctx.fillRect(238, 188, 36, 12);

      // Sleek diagonal reflection gleam
      ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
      [140, 272].forEach((lx) => {
        ctx.beginPath();
        ctx.moveTo(lx + 20, 182);
        ctx.lineTo(lx + 36, 182);
        ctx.lineTo(lx + 14, 235);
        ctx.lineTo(lx + 2, 235);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    } else if (faceType === 'glasses') {
      // Round Smart Glasses with Wire Frames
      ctx.save();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 5;
      [-1, 1].forEach((side) => {
        const gx = 256 + side * 68;
        ctx.beginPath();
        ctx.arc(gx, 205, 34, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
        ctx.stroke();
      });
      // Bridge
      ctx.beginPath();
      ctx.arc(256, 196, 18, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.restore();

      // Draw normal eyes inside glasses
      const eyeY = 205;
      const eyeSpacing = 68;
      [-1, 1].forEach((side) => {
        const ex = 256 + side * eyeSpacing;
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, 18, 24, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#09090b';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex - 5, eyeY - 6, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      const eyeY = 205;
      const eyeSpacing = 68;

      // Draw Left / Standard Eye
      const drawStandardEye = (ex, side) => {
        // Eye White Base with crisp dark border
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, 40, 54, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Deep Glossy Black Iris
        const irisX = ex + (side === -1 ? 2 : -2);
        const irisY = eyeY + 2;
        ctx.beginPath();
        ctx.ellipse(irisX, irisY, 34, 46, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#09090b';
        ctx.fill();

        // Luminous Lower Crescent Reflection
        ctx.beginPath();
        ctx.ellipse(irisX, irisY + 18, 24, 12, 0, 0, Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();

        // Primary Large White Catchlight Sparkle (Top-Left)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(irisX - 9, irisY - 12, 11, 0, Math.PI * 2);
        ctx.fill();

        // Secondary Smaller Catchlight Sparkle (Bottom-Right)
        ctx.beginPath();
        ctx.arc(irisX + 10, irisY + 11, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Tertiary sparkle glint (Top-Right)
        ctx.beginPath();
        ctx.arc(irisX + 9, irisY - 10, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Bold Upper Eyelash Rim
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(ex, eyeY - 4, 42, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        // Feminine Winged Lash Tip
        if (gender === 'female') {
          ctx.beginPath();
          ctx.moveTo(ex + side * 38, eyeY - 16);
          ctx.lineTo(ex + side * 50, eyeY - 26);
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
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(rx, eyeY + 4, 30, Math.PI * 1.16, Math.PI * 1.84);
        ctx.stroke();

        // Flutter lashes
        [-16, 0, 16].forEach((ox) => {
          ctx.beginPath();
          ctx.moveTo(rx + ox, eyeY - 18);
          ctx.lineTo(rx + ox + 6, eyeY - 30);
          ctx.stroke();
        });
      } else {
        drawStandardEye(256 + eyeSpacing, 1);
      }
    }

    // D. Expressive Eyebrows
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';

    if (faceType === 'smirk' || faceType === 'sunglasses') {
      // Confident angled brows
      ctx.beginPath();
      ctx.moveTo(145, 145);
      ctx.lineTo(215, 134);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(297, 132);
      ctx.lineTo(367, 144);
      ctx.stroke();
    } else {
      // Friendly arched brows
      [-1, 1].forEach((side) => {
        const bx = 256 + side * 68;
        ctx.beginPath();
        ctx.moveTo(bx - side * 36, 142);
        ctx.quadraticCurveTo(bx, 126, bx + side * 36, 140);
        ctx.stroke();
      });
    }

    // E. Mouth Expressions
    const effectiveMouth = mouthType || (faceType === 'smirk' ? 'smirk' : 'smile_teeth');

    if (effectiveMouth === 'smirk') {
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(226, 335);
      ctx.quadraticCurveTo(256, 350, 292, 320);
      ctx.stroke();
    } else if (effectiveMouth === 'gentle_smile') {
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(256, 305, 38, 0.35, Math.PI - 0.35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(224, 328);
      ctx.lineTo(228, 336);
      ctx.moveTo(288, 328);
      ctx.lineTo(284, 336);
      ctx.stroke();
    } else if (effectiveMouth === 'open_laugh') {
      const mouthY = 310;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(190, mouthY);
      ctx.quadraticCurveTo(256, 314, 322, mouthY);
      ctx.quadraticCurveTo(256, 410, 190, mouthY);
      ctx.fillStyle = '#18181b';
      ctx.fill();
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 5.5;
      ctx.stroke();
      ctx.clip();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(180, mouthY - 4, 152, 28);

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(256, 400, 36, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Broad Cheerful Open Smile with Teeth & Tongue (Default / Reference standard)
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
      ctx.lineWidth = 5.5;
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
      ctx.arc(256, 392, 30, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    faceTextureCache.set(cacheKey, tex);
    return tex;
  };

  // 2. Shared Geometry Builders
  // A. Iconic Minifigure C-Shaped Claw Hand (Sleek scale)
  const createCHandGeometry = () => {
    const outerR = 0.040;
    const innerR = 0.022;
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
      depth: 0.028,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.003,
      bevelThickness: 0.003
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  };

  // B. Slender Tapered Minifigure Torso (Reference slim proportions)
  const createTorsoGeometry = (topW = 0.28, botW = 0.33, h = 0.36, d = 0.16) => {
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
      bevelSize: 0.010,
      bevelThickness: 0.010
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  };

  const sharedCHandGeo = createCHandGeometry();
  const sharedTorsoGeo = createTorsoGeometry();

  // Shared Standard Materials
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32 });
  const whiteSoleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.32 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.40 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.40 });
  const denimMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.50 });
  const khakiMat = new THREE.MeshStandardMaterial({ color: 0xd4b996, roughness: 0.55 });

  // 3. Avatar Factory
  const buildAvatar = (name, initialPos, config = {}) => {
    const root = new THREE.Group();
    root.name = `avatar_${name}`;

    const isAI = config.status === 'ai-agent' || name.includes('DevBot');
    const skinHex = isAI ? 0xd1fae5 : (config.skinColor || 0xf6d5be);
    const skinMat = new THREE.MeshStandardMaterial({
      color: skinHex,
      roughness: 0.32
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

    // 1. Head Assembly (y = 1.09) - Compact, cute squoval proportions (Width 0.27m, Height 0.28m)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.09;

    // Slender visible neck pin (separates head cleanly from torso)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.052, 0.06, 16), skinMat);
    neck.position.set(0, -0.15, 0);
    headGroup.add(neck);

    // Compact Cylindrical Minifigure Head
    const headCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.20, 28), skinMat);
    headCylinder.castShadow = true;
    headGroup.add(headCylinder);

    const topCap = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), skinMat);
    topCap.position.y = 0.10;
    topCap.scale.set(1.0, 0.35, 1.0);
    headGroup.add(topCap);

    const botCap = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), skinMat);
    botCap.position.y = -0.10;
    botCap.scale.set(1.0, 0.35, 1.0);
    headGroup.add(botCap);

    // Undistorted Cylinder Decal Face
    const faceTex = createMinifigureFaceTexture({
      faceType: faceType,
      mouthType: config.mouthType || 'smile_teeth',
      noseType: config.noseType || 'clean',
      isAI: isAI,
      gender: config.gender || 'male',
      eyeColor: config.eyeColor || '#10b981'
    });

    const faceGeo = new THREE.CylinderGeometry(
      0.137, 0.137, 0.20,
      28, 1, true,
      Math.PI * 1.65, Math.PI * 0.70
    );
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      transparent: true,
      roughness: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.y = -0.005;
    faceMesh.renderOrder = 3;
    headGroup.add(faceMesh);

    // 2. Sculpted Chunky 3D Hairpieces & Headwear (12 Archetypes)
    let hairColor = config.hairColor || 0x1c1917;
    if (typeof hairColor === 'string') {
      hairColor = parseInt(hairColor.replace('#', '0x'), 16);
    }
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.35 });

    const effectiveHair = config.hairType || (config.gender === 'female' ? 'long_waves_headphones' : 'black_waves');

    if (isAI) {
      // DevBot AI: Futuristic Cyber Mascot Helmet with Floating Neon Halo
      const haloMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.014, 8, 24), haloMat);
      halo.position.set(0, 0.25, 0);
      halo.rotation.x = Math.PI / 2;
      headGroup.add(halo);

      const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.11), whiteMat);
      antennaStem.position.set(0, 0.22, 0);
      headGroup.add(antennaStem);

      const ledOrb = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 14), haloMat);
      ledOrb.position.set(0, 0.28, 0);
      headGroup.add(ledOrb);
    } else if (effectiveHair === 'safari_hat' || name === 'Phil') {
      // Tan Safari Fedora Hat with Brown Band
      const hatMat = khakiMat;
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.65 });

      const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.155, 0.09, 20), hatMat);
      hatCrown.position.set(0, 0.15, -0.01);
      hatCrown.rotation.x = -0.06;
      headGroup.add(hatCrown);

      const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.157, 0.157, 0.022, 20), bandMat);
      hatBand.position.set(0, 0.12, -0.01);
      hatBand.rotation.x = -0.06;
      headGroup.add(hatBand);

      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.015, 24), hatMat);
      brim.position.set(0, 0.11, 0);
      brim.rotation.x = -0.06;
      headGroup.add(brim);

      [-0.14, 0.14].forEach((hx) => {
        const sideLock = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.10, 6, 10), hairMat);
        sideLock.position.set(hx, 0.06, 0.07);
        headGroup.add(sideLock);
      });
      const backHair = new THREE.Mesh(new THREE.SphereGeometry(0.145, 16, 16), hairMat);
      backHair.position.set(0, 0.06, -0.06);
      headGroup.add(backHair);
    } else if (effectiveHair === 'cyber_spikes' || name === 'Stefan') {
      // Dynamic Electric Spiky Anime Hair
      const skullCap = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.60), hairMat);
      skullCap.position.set(0, 0.07, -0.01);
      headGroup.add(skullCap);

      const spikes = [
        { pos: [0.00, 0.21, 0.02], rot: [-0.2, 0.1, -0.1], s: [0.045, 0.14] },
        { pos: [-0.07, 0.19, 0.04], rot: [-0.1, 0.2, -0.4], s: [0.042, 0.13] },
        { pos: [0.07, 0.19, 0.03], rot: [-0.1, -0.2, 0.4], s: [0.042, 0.13] },
        { pos: [-0.11, 0.14, 0.07], rot: [0.2, 0, -0.6], s: [0.036, 0.12] },
        { pos: [0.11, 0.14, 0.07], rot: [0.2, 0, 0.6], s: [0.036, 0.12] },
        { pos: [0.02, 0.15, 0.14], rot: [0.4, 0, -0.2], s: [0.038, 0.11] },
        { pos: [-0.04, 0.15, 0.13], rot: [0.4, 0, 0.3], s: [0.038, 0.11] }
      ];
      spikes.forEach(({ pos, rot, s }) => {
        const sp = new THREE.Mesh(new THREE.ConeGeometry(s[0], s[1], 8), hairMat);
        sp.position.set(...pos);
        sp.rotation.set(...rot);
        headGroup.add(sp);
      });
    } else if (effectiveHair === 'long_waves_headphones' || name === 'Sarah') {
      // Long Cascading Waves + White Studio Headphones
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.60), hairMat);
      skullDome.position.set(0, 0.07, -0.01);
      headGroup.add(skullDome);

      // Parted bangs
      [-0.05, 0.05].forEach((bx) => {
        const bang = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.10, 6, 10), hairMat);
        bang.position.set(bx, 0.14, 0.142);
        bang.rotation.set(0.28, 0, bx < 0 ? -0.3 : 0.3);
        headGroup.add(bang);
      });

      // Flowing wavy tresses cascading past shoulders
      [-0.145, 0.145].forEach((sx) => {
        const wave1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.20, 8, 12), hairMat);
        wave1.position.set(sx, 0.02, 0.08);
        wave1.rotation.set(0.12, 0, sx < 0 ? 0.10 : -0.10);
        headGroup.add(wave1);

        const wave2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.18, 8, 12), hairMat);
        wave2.position.set(sx < 0 ? sx - 0.015 : sx + 0.015, -0.10, 0.07);
        wave2.rotation.set(0.10, 0, sx < 0 ? -0.15 : 0.15);
        headGroup.add(wave2);
      });

      const backWaves = new THREE.Mesh(new THREE.SphereGeometry(0.145, 16, 16), hairMat);
      backWaves.position.set(0, 0.02, -0.07);
      headGroup.add(backWaves);

      // White Studio Headphones over the hair
      const hpMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.014, 8, 24, Math.PI), hpMat);
      hpBand.position.set(0, 0.08, 0.01);
      headGroup.add(hpBand);

      [-0.165, 0.165].forEach((cx) => {
        const earcup = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.03, 16), hpMat);
        earcup.rotation.z = Math.PI / 2;
        earcup.position.set(cx, 0.08, 0.01);
        headGroup.add(earcup);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.006, 8, 16), blackMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(cx + (cx < 0 ? -0.016 : 0.016), 0.08, 0.01);
        headGroup.add(ring);
      });
    } else if (effectiveHair === 'topknot_waves' || name === 'Chloe') {
      // Topknot Half-Bun + Cascading Waves
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.60), hairMat);
      skullDome.position.set(0, 0.07, -0.01);
      headGroup.add(skullDome);

      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 14), hairMat);
      bun.position.set(0, 0.21, 0.02);
      headGroup.add(bun);

      const scrunchieMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 });
      const scrunchie = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.010, 8, 16), scrunchieMat);
      scrunchie.position.set(0, 0.18, 0.02);
      scrunchie.rotation.x = Math.PI / 2;
      headGroup.add(scrunchie);

      [-0.145, 0.145].forEach((sx) => {
        const wave = new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.22, 8, 12), hairMat);
        wave.position.set(sx, -0.04, 0.07);
        wave.rotation.set(0.10, 0, sx < 0 ? 0.10 : -0.10);
        headGroup.add(wave);
      });
    } else if (effectiveHair === 'twin_buns' || name === 'Andi') {
      // Twin Space Buns
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.60), hairMat);
      skullDome.position.set(0, 0.07, -0.01);
      headGroup.add(skullDome);

      [-0.14, 0.14].forEach((bx) => {
        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), hairMat);
        bun.position.set(bx, 0.18, -0.01);
        headGroup.add(bun);
      });
    } else if (effectiveHair === 'bob_cut') {
      // Sleek Bob Cut with Bangs
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
      skullDome.position.set(0, 0.07, -0.01);
      headGroup.add(skullDome);

      const fringe = new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.14, 6, 10), hairMat);
      fringe.position.set(0, 0.14, 0.142);
      fringe.rotation.z = Math.PI / 2;
      headGroup.add(fringe);

      [-0.142, 0.142].forEach((sx) => {
        const sideBob = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.16, 6, 10), hairMat);
        sideBob.position.set(sx, 0.02, 0.05);
        headGroup.add(sideBob);
      });
    } else if (effectiveHair === 'high_ponytail') {
      // Sleek High Ponytail
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
      skullDome.position.set(0, 0.07, -0.01);
      headGroup.add(skullDome);

      const tailBase = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), hairMat);
      tailBase.position.set(0, 0.17, -0.11);
      headGroup.add(tailBase);

      const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.22, 6, 10), hairMat);
      tail.position.set(0, 0.06, -0.14);
      tail.rotation.x = -0.35;
      headGroup.add(tail);
    } else if (effectiveHair === 'pompadour') {
      // Voluminous Pompadour Quiff
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
      skullDome.position.set(0, 0.07, -0.01);
      headGroup.add(skullDome);

      const quiff = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.14, 8, 12), hairMat);
      quiff.position.set(0, 0.18, 0.08);
      quiff.rotation.x = -0.45;
      headGroup.add(quiff);
    } else if (effectiveHair === 'afro_short') {
      // Textured Afro Fade
      const afroDome = new THREE.Mesh(new THREE.SphereGeometry(0.155, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
      afroDome.position.set(0, 0.08, -0.01);
      headGroup.add(afroDome);
    } else if (effectiveHair === 'swept_brown' || name === 'Wes') {
      // Chestnut Wavy Swept Hair
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.60), hairMat);
      skullDome.position.set(0, 0.07, -0.01);
      headGroup.add(skullDome);

      const sweep = new THREE.Mesh(new THREE.CapsuleGeometry(0.050, 0.14, 8, 12), hairMat);
      sweep.position.set(0.03, 0.15, 0.14);
      sweep.rotation.set(0.35, 0.15, -0.30);
      headGroup.add(sweep);

      [-0.14, 0.14].forEach((sx) => {
        const sideLock = new THREE.Mesh(new THREE.CapsuleGeometry(0.030, 0.11, 6, 10), hairMat);
        sideLock.position.set(sx, 0.06, 0.07);
        headGroup.add(sideLock);
      });
    } else if (effectiveHair === 'beanie' || config.hatType === 'beanie' || name === 'Alex') {
      // Knit Streetwear Beanie
      const beanieDome = new THREE.Mesh(new THREE.SphereGeometry(0.165, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.6), darkMat);
      beanieDome.position.set(0, 0.09, 0);
      headGroup.add(beanieDome);

      const brim = new THREE.Mesh(new THREE.TorusGeometry(0.158, 0.024, 10, 24), darkMat);
      brim.position.set(0, 0.07, 0);
      brim.rotation.x = Math.PI / 2;
      headGroup.add(brim);

      [-0.04, 0.04].forEach((bx) => {
        const bang = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.08, 6, 10), hairMat);
        bang.position.set(bx, 0.11, 0.148);
        bang.rotation.z = bx < 0 ? -0.3 : 0.3;
        headGroup.add(bang);
      });
    } else {
      // Default: Black Wavy Anime Hair (Ayush / Reference standard)
      const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.148, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
      skullDome.position.set(0, 0.08, -0.01);
      skullDome.rotation.x = -0.08;
      headGroup.add(skullDome);

      const backHair = new THREE.Mesh(new THREE.SphereGeometry(0.138, 18, 18), hairMat);
      backHair.position.set(0, 0.02, -0.06);
      headGroup.add(backHair);

      // Parted wavy bangs
      const mainBang = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.14, 8, 12), hairMat);
      mainBang.position.set(-0.03, 0.14, 0.142);
      mainBang.rotation.set(0.35, 0.12, -1.25);
      headGroup.add(mainBang);

      const sideBang = new THREE.Mesh(new THREE.CapsuleGeometry(0.034, 0.12, 8, 12), hairMat);
      sideBang.position.set(0.07, 0.13, 0.142);
      sideBang.rotation.set(0.32, -0.15, -1.10);
      headGroup.add(sideBang);

      const centerTuft = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.10, 6, 10), hairMat);
      centerTuft.position.set(0.01, 0.15, 0.148);
      centerTuft.rotation.set(0.40, 0.05, -0.4);
      headGroup.add(centerTuft);

      // Tucked side locks (hugging temples cleanly)
      [-0.140, 0.140].forEach((sx) => {
        const lock = new THREE.Mesh(new THREE.CapsuleGeometry(0.030, 0.12, 6, 10), hairMat);
        lock.position.set(sx, 0.05, 0.07);
        lock.rotation.set(0.15, 0, sx < 0 ? 0.15 : -0.15);
        headGroup.add(lock);
      });

      // Crown waves
      const crownWave1 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 8), hairMat);
      crownWave1.position.set(0.03, 0.22, 0.04);
      crownWave1.rotation.set(-0.35, 0.2, -0.4);
      headGroup.add(crownWave1);

      const crownWave2 = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.10, 8), hairMat);
      crownWave2.position.set(-0.04, 0.20, 0.02);
      crownWave2.rotation.set(-0.3, -0.2, 0.3);
      headGroup.add(crownWave2);
    }

    root.add(headGroup);

    // 3. Slender Tapered Torso Assembly (y = 0.74)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.74;

    const clothing = config.clothing || (
      name === 'Sarah' ? 'pink_jacket' : (
        name === 'Stefan' ? 'cyber_jacket' : (
          name === 'Phil' ? 'safari_khaki' : (
            name === 'Chloe' ? 'overalls' : (
              name === 'Wes' ? 'moto_jacket' : 'red_hoodie'
            )
          )
        )
      )
    );

    let shirtHex = config.shirtColor || 0xdc2626;
    if (typeof shirtHex === 'string') {
      shirtHex = parseInt(shirtHex.replace('#', '0x'), 16);
    }

    let torsoMat;
    if (clothing === 'red_hoodie') {
      torsoMat = new THREE.MeshStandardMaterial({ color: shirtHex, roughness: 0.40 });
    } else if (clothing === 'pink_jacket') {
      torsoMat = new THREE.MeshStandardMaterial({ color: config.shirtColor ? shirtHex : 0xf472b6, roughness: 0.40 });
    } else if (clothing === 'cyber_jacket') {
      torsoMat = new THREE.MeshStandardMaterial({ color: config.shirtColor ? shirtHex : 0x18181b, roughness: 0.35 });
    } else if (clothing === 'safari_khaki') {
      torsoMat = khakiMat;
    } else if (clothing === 'overalls') {
      torsoMat = new THREE.MeshStandardMaterial({ color: config.shirtColor ? shirtHex : 0xd97706, roughness: 0.45 });
    } else if (clothing === 'moto_jacket') {
      torsoMat = blackMat;
    } else if (clothing === 'formal_shirt') {
      torsoMat = new THREE.MeshStandardMaterial({ color: shirtHex || 0xffffff, roughness: 0.35 });
    } else if (clothing === 'casual_tee') {
      torsoMat = new THREE.MeshStandardMaterial({ color: shirtHex || 0x2563eb, roughness: 0.40 });
    } else if (isAI) {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.3, roughness: 0.3 });
    } else {
      torsoMat = new THREE.MeshStandardMaterial({ color: shirtHex || 0xdc2626, roughness: 0.40 });
    }

    // Tapered Trapezoid Torso Mesh (Sleek scale)
    const torsoMesh = new THREE.Mesh(sharedTorsoGeo, torsoMat);
    torsoMesh.castShadow = true;
    torsoGroup.add(torsoMesh);

    // Outfit 3D Details
    if (clothing === 'red_hoodie' || clothing === 'pink_jacket') {
      // White T-shirt insert in open jacket
      const innerTee = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.33, 0.015), whiteMat);
      innerTee.position.set(0, 0, 0.088);
      torsoGroup.add(innerTee);

      // Hood collar ring around neck
      const hoodRing = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.028, 8, 20), torsoMat);
      hoodRing.position.set(0, 0.17, -0.02);
      hoodRing.rotation.x = Math.PI / 2;
      torsoGroup.add(hoodRing);

      // White drawstring cords
      [-0.032, 0.032].forEach((cx) => {
        const cord = new THREE.Mesh(new THREE.CapsuleGeometry(0.007, 0.11, 6, 10), whiteMat);
        cord.position.set(cx, 0.08, 0.10);
        cord.rotation.x = -0.12;
        torsoGroup.add(cord);
      });

      if (clothing === 'red_hoodie') {
        // Backpack straps over shoulders
        const strapMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6 });
        const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        [-0.082, 0.082].forEach((sx) => {
          const strap = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.34, 0.015), strapMat);
          strap.position.set(sx, 0.01, 0.088);
          torsoGroup.add(strap);

          const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.015, 0.018), brassMat);
          buckle.position.set(sx, 0.04, 0.096);
          torsoGroup.add(buckle);
        });
      }
    } else if (clothing === 'cyber_jacket') {
      const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      [-0.085, 0.085].forEach((nx) => {
        const circuitStripe = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.32, 0.012), neonMat);
        circuitStripe.position.set(nx, 0, 0.088);
        torsoGroup.add(circuitStripe);
      });
      const chestEmblem = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 8, 16), neonMat);
      chestEmblem.position.set(0, 0.05, 0.088);
      torsoGroup.add(chestEmblem);
    } else if (clothing === 'safari_khaki') {
      const pocketMat = new THREE.MeshStandardMaterial({ color: 0xc4a480, roughness: 0.6 });
      [-0.075, 0.075].forEach((px) => {
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.018), pocketMat);
        pocket.position.set(px, 0.04, 0.09);
        torsoGroup.add(pocket);
      });
      const compassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
      const compass = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.010, 16), compassMat);
      compass.rotation.x = Math.PI / 2;
      compass.position.set(0, -0.04, 0.095);
      torsoGroup.add(compass);
    } else if (clothing === 'overalls') {
      const innerSweater = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.34, 0.015), whiteMat);
      innerSweater.position.set(0, 0, 0.085);
      torsoGroup.add(innerSweater);

      const bib = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.19, 0.018), torsoMat);
      bib.position.set(0, -0.06, 0.092);
      torsoGroup.add(bib);

      [-0.065, 0.065].forEach((sx) => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.32, 0.018), torsoMat);
        strap.position.set(sx, 0.03, 0.092);
        torsoGroup.add(strap);
      });
    } else if (clothing === 'moto_jacket') {
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.6 });
      const slingStrap = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.40, 0.018), strapMat);
      slingStrap.position.set(0, 0, 0.092);
      slingStrap.rotation.z = 0.55;
      torsoGroup.add(slingStrap);
    } else if (clothing === 'formal_shirt') {
      // Crisp Dress Shirt Collar & Necktie
      const tieMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.22, 0.015), tieMat);
      tie.position.set(0, 0.04, 0.092);
      torsoGroup.add(tie);

      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.020, 6, 16), whiteMat);
      collar.position.set(0, 0.17, -0.01);
      collar.rotation.x = Math.PI / 2;
      torsoGroup.add(collar);
    }

    root.add(torsoGroup);

    // 4. Slender Articulated Arms with Sleek C-Claw Hands
    const armMat = clothing === 'overalls' ? whiteMat : torsoMat;

    const buildArm = (side) => {
      const armPivot = new THREE.Group();
      armPivot.position.set(side * 0.165, 0.86, 0);

      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), armMat);
      armPivot.add(shoulder);

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.034, 0.18, 14), armMat);
      upperArm.position.y = -0.09;
      upperArm.castShadow = true;
      armPivot.add(upperArm);

      const elbowPivot = new THREE.Group();
      elbowPivot.position.set(0, -0.18, 0);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.030, 0.15, 14), armMat);
      forearm.position.y = -0.075;
      forearm.castShadow = true;
      elbowPivot.add(forearm);

      const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.025, 12), armMat);
      wrist.position.set(0, -0.15, 0);
      elbowPivot.add(wrist);

      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.175, 0);

      const cHand = new THREE.Mesh(sharedCHandGeo, skinMat);
      cHand.rotation.y = side < 0 ? -Math.PI / 2 + 0.25 : Math.PI / 2 - 0.25;
      cHand.rotation.x = Math.PI / 2;
      cHand.rotation.z = side * 0.15;
      handGroup.add(cHand);

      elbowPivot.add(handGroup);
      armPivot.add(elbowPivot);

      // Relaxed iconic Lego minifigure stance with flared arms
      armPivot.rotation.z = side * 0.28;
      armPivot.rotation.x = -0.10;
      elbowPivot.rotation.x = -0.16;
      elbowPivot.rotation.z = -side * 0.06;

      return { armPivot, elbowPivot };
    };

    const leftArm = buildArm(-1);
    const rightArm = buildArm(1);
    root.add(leftArm.armPivot);
    root.add(rightArm.armPivot);

    // 5. Pelvis & Slender Separated Legs (Ground contact at y = 0.00)
    let pantsHex = config.pantsColor;
    if (typeof pantsHex === 'string') {
      pantsHex = parseInt(pantsHex.replace('#', '0x'), 16);
    }

    const pantsType = config.pantsType || (
      clothing === 'pink_jacket' ? 'jeans' : (
        clothing === 'safari_khaki' ? 'shorts' : (
          clothing === 'overalls' ? 'overalls_bottom' : 'cargo_pants'
        )
      )
    );

    let pantsMat;
    if (pantsHex) {
      pantsMat = new THREE.MeshStandardMaterial({ color: pantsHex, roughness: 0.45 });
    } else if (pantsType === 'jeans') {
      pantsMat = denimMat;
    } else if (pantsType === 'shorts') {
      pantsMat = khakiMat;
    } else if (pantsType === 'overalls_bottom') {
      pantsMat = torsoMat;
    } else if (pantsType === 'trousers') {
      pantsMat = darkMat;
    } else {
      pantsMat = blackMat;
    }

    // Pelvis waistband bracket
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 18), pantsMat);
    pelvis.position.set(0, 0.52, 0);
    pelvis.scale.set(1.0, 1.0, 0.65);
    pelvis.castShadow = true;
    root.add(pelvis);

    const buildLeg = (legX) => {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(legX, 0.48, 0);

      // Slender Leg Shaft (length = 0.42m, reaching from y = 0.48 down to y = 0.06)
      const legShaft = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.42, 0.14), pantsMat);
      legShaft.position.set(0, -0.21, 0);
      legShaft.castShadow = true;
      hipPivot.add(legShaft);

      // If shorts: lower half of leg reveals skin!
      if (pantsType === 'shorts') {
        const bareKnee = new THREE.Mesh(new THREE.BoxGeometry(0.114, 0.18, 0.138), skinMat);
        bareKnee.position.set(0, -0.32, 0);
        hipPivot.add(bareKnee);
      }

      // Outer Cargo Pocket with Flap
      if (pantsType === 'cargo_pants') {
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.11, 0.09), pantsMat);
        pocket.position.set(legX < 0 ? -0.065 : 0.065, -0.18, 0);
        hipPivot.add(pocket);

        const flap = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.025, 0.092), pantsMat);
        flap.position.set(legX < 0 ? -0.065 : 0.065, -0.115, 0);
        hipPivot.add(flap);
      } else if (pantsType === 'cyber_pants') {
        const cyberStripeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const cStripe = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.38, 0.02), cyberStripeMat);
        cStripe.position.set(legX < 0 ? -0.062 : 0.062, -0.21, 0);
        hipPivot.add(cStripe);
      }

      const kneePivot = new THREE.Group();
      kneePivot.position.set(0, -0.42, 0);

      // Footwear / Shoes
      const shoeGroup = new THREE.Group();
      const shoesType = config.shoesType || 'platform_sneakers';

      let shoeHex = config.shoesColor;
      if (typeof shoeHex === 'string') {
        shoeHex = parseInt(shoeHex.replace('#', '0x'), 16);
      }
      const shoeAccentColor = shoeHex || (
        clothing === 'red_hoodie' ? 0xdc2626 : (
          clothing === 'pink_jacket' ? 0xf472b6 : (
            clothing === 'cyber_jacket' ? 0x00f0ff : (
              clothing === 'safari_khaki' ? 0x5c3d2e : 0x18181b
            )
          )
        )
      );
      const accentMat = new THREE.MeshStandardMaterial({ color: shoeAccentColor, roughness: 0.35 });

      if (shoesType === 'boots') {
        // Rugged Adventure Boots
        const bootSole = new THREE.Mesh(new THREE.BoxGeometry(0.128, 0.035, 0.195), darkMat);
        bootSole.position.set(0, 0.017, 0.025);
        shoeGroup.add(bootSole);

        const bootUpper = new THREE.Mesh(new THREE.BoxGeometry(0.122, 0.060, 0.18), accentMat);
        bootUpper.position.set(0, 0.052, 0.02);
        shoeGroup.add(bootUpper);
      } else if (shoesType === 'cyber_sneakers') {
        // Neon Cyber Sneakers with Glowing Outsole
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const neonSole = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.024, 0.19), ledMat);
        neonSole.position.set(0, 0.012, 0.025);
        shoeGroup.add(neonSole);

        const shoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.120, 0.045, 0.165), blackMat);
        shoeUpper.position.set(0, 0.046, 0.018);
        shoeGroup.add(shoeUpper);
      } else {
        // Platform Sneakers (Default / Reference Standard)
        const sole = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.028, 0.19), whiteSoleMat);
        sole.position.set(0, 0.014, 0.025);
        sole.castShadow = true;
        shoeGroup.add(sole);

        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.126, 0.010, 0.192), accentMat);
        strip.position.set(0, 0.033, 0.025);
        shoeGroup.add(strip);

        const shoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.120, 0.040, 0.165), accentMat);
        shoeUpper.position.set(0, 0.052, 0.018);
        shoeUpper.castShadow = true;
        shoeGroup.add(shoeUpper);

        const toeBumper = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.028, 12, 1, false, 0, Math.PI), whiteSoleMat);
        toeBumper.rotation.y = Math.PI / 2;
        toeBumper.position.set(0, 0.024, 0.108);
        shoeGroup.add(toeBumper);

        const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.022, 0.07), whiteMat);
        tongue.position.set(0, 0.068, 0.035);
        shoeGroup.add(tongue);
      }

      kneePivot.add(shoeGroup);
      hipPivot.add(kneePivot);

      return { hipPivot, kneePivot };
    };

    const leftLeg = buildLeg(-0.072);
    const rightLeg = buildLeg(0.072);
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
        faceMat,
        pantsMat,
        hairMat
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
  const applyAvatarPose = (parts, { isMoving = false, walkCycle = 0, isSitting = false, isSwimming = false, swimCycle = 0, emote = null, elapsed = 0 }) => {
    if (!parts) return;

    if (isSwimming) {
      if (isMoving) {
        // Forward swimming crawl stroke
        const stroke = Math.sin(swimCycle);
        if (parts.leftArmPivot) {
          parts.leftArmPivot.rotation.x = -Math.PI * 0.45 + stroke * 0.75;
          parts.leftArmPivot.rotation.z = -0.35 + Math.cos(swimCycle) * 0.35;
        }
        if (parts.rightArmPivot) {
          parts.rightArmPivot.rotation.x = -Math.PI * 0.45 - stroke * 0.75;
          parts.rightArmPivot.rotation.z = 0.35 - Math.cos(swimCycle) * 0.35;
        }
        if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = Math.sin(swimCycle * 2) * 0.45;
        if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -Math.sin(swimCycle * 2) * 0.45;
        if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = Math.max(0, Math.sin(swimCycle * 2) * 0.55);
        if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = Math.max(0, -Math.sin(swimCycle * 2) * 0.55);
        if (parts.torsoGroup) {
          parts.torsoGroup.position.y = 0.68;
          parts.torsoGroup.rotation.x = 0.35; // streamline pitch in water
        }
      } else {
        // Idle treading water / floating
        if (parts.leftArmPivot) {
          parts.leftArmPivot.rotation.x = -0.35;
          parts.leftArmPivot.rotation.z = -0.65 + Math.sin(elapsed * 3) * 0.18;
        }
        if (parts.rightArmPivot) {
          parts.rightArmPivot.rotation.x = -0.35;
          parts.rightArmPivot.rotation.z = 0.65 - Math.sin(elapsed * 3) * 0.18;
        }
        if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = Math.sin(elapsed * 3.5) * 0.22;
        if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -Math.sin(elapsed * 3.5) * 0.22;
        if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = 0.25;
        if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = 0.25;
        if (parts.torsoGroup) {
          parts.torsoGroup.position.y = 0.68 + Math.sin(elapsed * 3) * 0.02;
          parts.torsoGroup.rotation.x = 0.12;
        }
      }
    } else if (isMoving) {
      if (parts.torsoGroup) parts.torsoGroup.rotation.x = 0;
      const stride = Math.sin(walkCycle);
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = stride * 0.55;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -stride * 0.55;

      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = Math.max(0, -stride * 0.60);
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = Math.max(0, stride * 0.60);

      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -stride * 0.45;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = stride * 0.45;

      if (parts.torsoGroup) parts.torsoGroup.position.y = 0.74;
    } else if (isSitting) {
      if (parts.torsoGroup) parts.torsoGroup.rotation.x = 0;
      // Classic Minifigure 90° forward seated leg pose
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = -1.45;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -1.45;

      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = 0;
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = 0;

      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -0.55;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = -0.55;

      if (parts.torsoGroup) parts.torsoGroup.position.y = 0.74;
    } else {
      if (parts.torsoGroup) parts.torsoGroup.rotation.x = 0;
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = 0;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = 0;
      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = 0;
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = 0;
      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -0.10;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = -0.10;

      if (emote === 'wave' && parts.rightArmPivot) {
        parts.rightArmPivot.rotation.z = Math.PI * 0.68 + Math.sin(elapsed * 12) * 0.3;
        parts.rightArmPivot.rotation.x = -0.35;
      } else if (parts.rightArmPivot) {
        parts.rightArmPivot.rotation.z = 0.28;
        parts.rightArmPivot.rotation.x = -0.10;
      }

      if (parts.torsoGroup) {
        parts.torsoGroup.position.y = 0.74 + Math.sin(elapsed * 2.5) * 0.005;
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

    // 1. Ayush (Active Player) - Customizable Player Avatar
    const ayush = buildAvatar(playerConfig.name || 'Ayush (you)', new THREE.Vector3(-9.0, 0, 16.0), {
      isPlayer: true,
      skinColor: skinHex,
      hairType: hairType,
      hairColor: playerConfig.hairColor || (playerConfig.gender === 'female' ? 0x3e2723 : 0x1c1917),
      clothing: playerConfig.clothing || (playerConfig.gender === 'female' ? 'pink_jacket' : 'red_hoodie'),
      shirtColor: shirtColor,
      faceType: playerConfig.faceType || (playerConfig.gender === 'female' ? 'wink' : 'happy'),
      mouthType: playerConfig.mouthType || 'smile_teeth',
      noseType: playerConfig.noseType || 'clean',
      pantsType: playerConfig.pantsType || (playerConfig.gender === 'female' ? 'jeans' : 'cargo_pants'),
      pantsColor: playerConfig.pantsColor,
      shoesType: playerConfig.shoesType || 'platform_sneakers',
      shoesColor: playerConfig.shoesColor,
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
