import * as THREE from 'three';

/**
 * Creates friendly, stylized realistic 3D humanoid avatars matching the Spot Virtual desktop reference.
 * Features:
 * - Expressive 3D facial features (sculpted eyes with iris/pupil/glint, eyelids, nose bridge, ears, lips)
 * - Volumetric 3D hairstyles (pompadour, layered bob, neat locks, beanie, Spot cap)
 * - Tailored clothing (puffer jackets, flannel shirts, knit sweaters, collars, belts with buckles)
 * - Two-segment articulated arms (shoulders + elbows + hands)
 * - Two-segment articulated legs (hips + knees + shins + modern sneaker soles)
 * - Real kinematic sitting where thighs rest horizontally, knees bend 90° down, and feet rest flat on the floor.
 */
export function createAvatarSystem() {
  // 1. Shared Textures for Clothing and Facial Features
  // Buffalo Plaid Flannel Texture (Red and Black) for Wes
  const plaidCanvas = document.createElement('canvas');
  plaidCanvas.width = 128;
  plaidCanvas.height = 128;
  const pCtx = plaidCanvas.getContext('2d');
  pCtx.fillStyle = '#b91c1c';
  pCtx.fillRect(0, 0, 128, 128);
  pCtx.fillStyle = '#111827';
  pCtx.fillRect(0, 0, 64, 64);
  pCtx.fillRect(64, 64, 64, 64);
  pCtx.fillStyle = 'rgba(0,0,0,0.35)';
  pCtx.fillRect(64, 0, 64, 64);
  pCtx.fillRect(0, 64, 64, 64);
  const plaidTexture = new THREE.CanvasTexture(plaidCanvas);
  plaidTexture.wrapS = THREE.RepeatWrapping;
  plaidTexture.wrapT = THREE.RepeatWrapping;
  plaidTexture.repeat.set(4, 4);

  // Striped Knit Sweater Texture (Purple and White) for Stefan
  const stripeCanvas = document.createElement('canvas');
  stripeCanvas.width = 64;
  stripeCanvas.height = 64;
  const stCtx = stripeCanvas.getContext('2d');
  stCtx.fillStyle = '#ffffff';
  stCtx.fillRect(0, 0, 64, 64);
  stCtx.fillStyle = '#6b21a8';
  stCtx.fillRect(0, 0, 64, 32);
  const stripeTexture = new THREE.CanvasTexture(stripeCanvas);
  stripeTexture.wrapS = THREE.RepeatWrapping;
  stripeTexture.wrapT = THREE.RepeatWrapping;
  stripeTexture.repeat.set(1, 6);

  // Shared Materials
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const darkShoeMat = new THREE.MeshStandardMaterial({ color: 0x1e242d, roughness: 0.75 });
  const whiteSoleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const buckleMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8, roughness: 0.2 });
  const pantsBlueMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 });
  const pantsDarkMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.8 });
  const pantsBeigeMat = new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.8 });

  // 2. Avatar Factory
  const buildAvatar = (name, initialPos, config = {}) => {
    const root = new THREE.Group();
    root.name = `avatar_${name}`;

    const skinColor = config.skinColor || 0xf6d8c3;
    const skinMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.55
    });

    // 1. Head Assembly (y = 1.82)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.82;

    // Smooth neck connecting head to torso
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.20, 16), skinMat);
    neck.position.set(0, -0.28, 0);
    headGroup.add(neck);

    // Stylized contoured chibi head (matching real_spot_after_continue.png)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 28, 28), skinMat);
    head.scale.set(1.0, 1.04, 0.98);
    head.name = `avatar_head_${name}`;
    head.castShadow = true;
    headGroup.add(head);

    // Cute rounded chin
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.10, 14, 14), skinMat);
    chin.position.set(0, -0.21, 0.19);
    headGroup.add(chin);

    // Subtle sculpted nose
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 12, 12),
      skinMat
    );
    nose.position.set(0, -0.04, 0.38);
    nose.scale.set(0.9, 0.8, 1.2);
    headGroup.add(nose);

    // Stylized friendly human ears on both sides
    [-0.37, 0.37].forEach((ex) => {
      const ear = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.024, 12),
        skinMat
      );
      ear.position.set(ex, 0, 0.02);
      ear.rotation.z = Math.PI / 2;
      headGroup.add(ear);
    });

    // 3D Stylized Friendly Human Eyes (matching real Spot reference media_1792144700841.png)
    const eyeColor = config.eyeColor || (name === 'Wes' ? 0x0284c7 : (config.hasBeard ? 0x0369a1 : 0x10b981));
    const eyeRimMat = new THREE.MeshBasicMaterial({ color: 0x18181b }); // deep charcoal soft rim
    const irisMat = new THREE.MeshBasicMaterial({ color: eyeColor }); // vibrant iris
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b }); // deep pupil center
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // specular catchlight
    const eyebrowMat = new THREE.MeshStandardMaterial({
      color: config.hairColor || (config.hairType === 'blond_styled' ? 0x854d0e : 0x1c1917),
      roughness: 0.7
    });

    [-0.12, 0.12].forEach((eyeX) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(eyeX, 0.02, 0.362);

      // Soft natural eye backing (warm almond contour)
      const eyeRim = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), eyeRimMat);
      eyeRim.scale.set(1.25, 0.72, 0.22);
      eyeGroup.add(eyeRim);

      // Vibrant expressive iris
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.025, 18), irisMat);
      iris.position.set(0, 0, 0.014);
      iris.scale.set(1.15, 0.82, 1);
      eyeGroup.add(iris);

      // Pupil center
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.013, 16), pupilMat);
      pupil.position.set(0, 0, 0.016);
      pupil.scale.set(1.05, 0.82, 1);
      eyeGroup.add(pupil);

      // Specular shine catchlight (gives warmth and human life to eyes)
      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.0055, 8), glintMat);
      glint.position.set(-0.007, 0.007, 0.018);
      eyeGroup.add(glint);

      // Upper eyelid line (gentle resting eyelid)
      const upperLid = new THREE.Mesh(
        new THREE.TorusGeometry(0.034, 0.005, 6, 14, Math.PI * 0.65),
        eyebrowMat
      );
      upperLid.position.set(0, 0.018, 0.015);
      upperLid.rotation.z = (eyeX < 0 ? -1 : 1) * 0.06;
      eyeGroup.add(upperLid);

      // Natural contoured eyebrow
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.012, 0.012), eyebrowMat);
      brow.position.set(0, 0.046, 0.014);
      brow.rotation.z = (eyeX < 0 ? -1 : 1) * 0.06;
      eyeGroup.add(brow);

      headGroup.add(eyeGroup);
    });

    // Friendly Natural Smile & Soft Lips (natural warm rose/nude tone, NO red clown lipstick)
    const lipMat = new THREE.MeshBasicMaterial({ color: 0x9e6648 }); // natural warm rose/nude
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.005, 6, 14, Math.PI * 0.55), lipMat);
    smile.position.set(0, -0.115, 0.362);
    smile.rotation.x = 0.22;
    smile.rotation.z = Math.PI * 1.22;
    headGroup.add(smile);

    // Beard / Stubble for Stan / Phil
    if (config.hasBeard) {
      const beardMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      const beard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.32, 0.20, 16, 1, false, -Math.PI / 2, Math.PI),
        beardMat
      );
      beard.position.set(0, -0.16, 0.08);
      headGroup.add(beard);
    }

    // Sculpted 3D Hairstyles & Headwear
    if (config.hatType === 'spot_cap') {
      const capDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7),
        whiteMat
      );
      capDome.position.set(0, 0.10, -0.03);
      headGroup.add(capDome);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.36), whiteMat);
      visor.position.set(0, 0.06, 0.42);
      visor.rotation.x = -0.1;
      headGroup.add(visor);

      const logoDot = new THREE.Mesh(
        new THREE.CircleGeometry(0.065, 16),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      logoDot.position.set(0, 0.20, 0.40);
      logoDot.rotation.x = -0.2;
      headGroup.add(logoDot);
    } else if (config.hatType === 'beanie') {
      const beanieDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.44, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.5),
        pantsDarkMat
      );
      beanieDome.position.set(0, 0.12, 0);
      headGroup.add(beanieDome);

      const brim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 10, 24), pantsDarkMat);
      brim.position.set(0, 0.06, 0);
      brim.rotation.x = Math.PI / 2;
      headGroup.add(brim);
    } else if (config.hairType === 'blond_styled' || config.hairType === 'pompadour' || config.hairType === 'short_parted') {
      // Styled pompadour / parted volume with side locks (matching media_1792144700841.png)
      const hairCol = config.hairColor || (config.hairType === 'blond_styled' ? 0xfacc15 : (config.isPlayer ? 0x3d2714 : 0x1c1917));
      const hairMat = new THREE.MeshStandardMaterial({ color: hairCol, roughness: 0.55 });

      // Cranial dome covering skull smoothly
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.405, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62),
        hairMat
      );
      hairDome.position.set(0, 0.10, -0.03);
      hairDome.rotation.x = -0.20;
      headGroup.add(hairDome);

      const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.395, 20, 20), hairMat);
      hairBack.position.set(0, 0.02, -0.07);
      headGroup.add(hairBack);

      // Swept pompadour crown volume (smoothly styled curve)
      const pomp = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.24, 10, 16), hairMat);
      pomp.position.set(0.02, 0.28, 0.14);
      pomp.rotation.x = 0.55;
      pomp.rotation.z = -0.08;
      headGroup.add(pomp);

      // Side locks framing face and ears
      [-0.35, 0.35].forEach((sx) => {
        const sideLock = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.16, 6, 10), hairMat);
        sideLock.position.set(sx, 0.05, 0.08);
        headGroup.add(sideLock);
      });
    } else if (config.hairType === 'orange_bob') {
      const hairMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.41, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.60),
        hairMat
      );
      hairDome.position.set(0, 0.10, -0.02);
      headGroup.add(hairDome);

      const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.10, 0.14), hairMat);
      fringe.position.set(0, 0.16, 0.33);
      fringe.rotation.x = 0.25;
      headGroup.add(fringe);

      [-0.32, 0.32].forEach((sx) => {
        const strand = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.32, 8, 12), hairMat);
        strand.position.set(sx, -0.06, 0.08);
        headGroup.add(strand);
      });
    } else {
      // Authentic Spot Virtual Volumetric Wavy Hair (smooth, flowing, NO mouse-ear lobes)
      const hairColor = config.hairColor || 0x1c1917; // Deep espresso / dark charcoal
      const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.55 });

      // Main cranial hair volume dome (smooth complete shell)
      const topHair = new THREE.Mesh(
        new THREE.SphereGeometry(0.405, 32, 32),
        hairMat
      );
      topHair.position.set(0, 0.06, -0.04);
      topHair.scale.set(1.0, 1.02, 1.0);
      headGroup.add(topHair);

      // Back Hair Volume enclosing nape
      const backHair = new THREE.Mesh(new THREE.SphereGeometry(0.395, 22, 22), hairMat);
      backHair.position.set(0, -0.02, -0.08);
      headGroup.add(backHair);

      // Soft curved bangs / fringe across the forehead framing face
      const frontBangs = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.075, 0.26, 8, 16),
        hairMat
      );
      frontBangs.position.set(-0.06, 0.16, 0.28);
      frontBangs.rotation.set(0.32, 0.14, -1.45);
      headGroup.add(frontBangs);

      const sideBangs = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.065, 0.20, 8, 14),
        hairMat
      );
      sideBangs.position.set(0.14, 0.15, 0.29);
      sideBangs.rotation.set(0.30, -0.18, -1.25);
      headGroup.add(sideBangs);

      // Left side cascading locks
      const leftUpper = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.22, 8, 14), hairMat);
      leftUpper.position.set(-0.34, 0.04, 0.05);
      leftUpper.rotation.set(0.12, 0, 0.14);
      headGroup.add(leftUpper);

      const leftMid = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.22, 8, 14), hairMat);
      leftMid.position.set(-0.32, -0.15, 0.08);
      leftMid.rotation.set(0.14, 0, -0.06);
      headGroup.add(leftMid);

      const leftLower = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.18, 8, 14), hairMat);
      leftLower.position.set(-0.28, -0.26, 0.12);
      leftLower.rotation.set(0.22, 0.08, -0.04);
      headGroup.add(leftLower);

      // Right side cascading locks
      const rightUpper = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.22, 8, 14), hairMat);
      rightUpper.position.set(0.34, 0.04, 0.05);
      rightUpper.rotation.set(0.12, 0, -0.14);
      headGroup.add(rightUpper);

      const rightMid = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.22, 8, 14), hairMat);
      rightMid.position.set(0.32, -0.15, 0.08);
      rightMid.rotation.set(0.14, 0, 0.06);
      headGroup.add(rightMid);

      const rightForward = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.20, 8, 14), hairMat);
      rightForward.position.set(0.26, -0.24, 0.14);
      rightForward.rotation.set(0.26, -0.10, 0.08);
      headGroup.add(rightForward);
    }

    // Modern Glasses (for Phil / custom)
    if (config.hasGlasses) {
      const frameColor = config.glassesColor || 0xf97316;
      const gMat = new THREE.MeshBasicMaterial({ color: frameColor });
      const glassMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.45 });

      [-0.15, 0.15].forEach((gx) => {
        const rim = new THREE.Mesh(new THREE.RingGeometry(0.065, 0.088, 16), gMat);
        rim.position.set(gx, 0.05, 0.39);
        headGroup.add(rim);

        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.065, 16), glassMat);
        lens.position.set(gx, 0.05, 0.39);
        headGroup.add(lens);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.01), gMat);
      bridge.position.set(0, 0.05, 0.39);
      headGroup.add(bridge);
    }

    // Over-Ear Studio Headphones (for Steven)
    if (config.hasHeadphones) {
      const hpMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const cushionMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 8, 20, Math.PI), hpMat);
      band.position.set(0, 0.14, 0);
      headGroup.add(band);

      [-0.41, 0.41].forEach((cupX) => {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), hpMat);
        cup.rotation.z = Math.PI / 2;
        cup.position.set(cupX, 0.02, 0);
        headGroup.add(cup);

        const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 16), cushionMat);
        cushion.rotation.y = Math.PI / 2;
        cushion.position.set(cupX + (cupX < 0 ? 0.02 : -0.02), 0.02, 0);
        headGroup.add(cushion);
      });
    }

    root.add(headGroup);

    // 2. Torso Assembly (tucked shirt into pants matching real_spot_after_continue.png)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.20;

    let torsoMat;
    const isHoodie = config.clothing === 'red_hoodie';
    if (isHoodie) {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.65 });
    } else if (config.clothing === 'cyan_puffer') {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.38 });
    } else if (config.clothing === 'plaid_flannel') {
      torsoMat = new THREE.MeshStandardMaterial({ map: plaidTexture, roughness: 0.8 });
    } else if (config.clothing === 'purple_striped') {
      torsoMat = new THREE.MeshStandardMaterial({ map: stripeTexture, roughness: 0.8 });
    } else {
      torsoMat = new THREE.MeshStandardMaterial({
        color: config.shirtColor || 0xa0b7cc, // Light Oxford heather blue
        roughness: 0.65
      });
    }

    // Tapered humanoid torso body (sloped shoulders, tucked into waistband)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.29, 0.52, 18), torsoMat);
    torso.castShadow = true;
    torsoGroup.add(torso);

    if (isHoodie) {
      // Hood collar ring around neck
      const hoodRim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.055, 8, 20), torsoMat);
      hoodRim.position.set(0, 0.28, -0.03);
      hoodRim.rotation.x = Math.PI / 2;
      torsoGroup.add(hoodRim);

      // Kangaroo pouch pocket
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.04), torsoMat);
      pouch.position.set(0, -0.12, 0.28);
      torsoGroup.add(pouch);
    } else {
      // Button-down center placket and pearl buttons
      const placket = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.50, 0.015), torsoMat);
      placket.position.set(0, 0, 0.29);
      torsoGroup.add(placket);

      const buttonMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      [0.18, 0.06, -0.06, -0.18].forEach((by) => {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 8), buttonMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(0, by, 0.30);
        torsoGroup.add(btn);
      });

      // 3D Winged Shirt Collar around neck
      [-0.09, 0.09].forEach((cx) => {
        const collarWing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.10), torsoMat);
        collarWing.position.set(cx, 0.28, 0.12);
        collarWing.rotation.set(-0.35, cx < 0 ? 0.3 : -0.3, cx < 0 ? -0.2 : 0.2);
        torsoGroup.add(collarWing);
      });
    }

    root.add(torsoGroup);

    // 3. Articulated Arms (Shoulder -> Upper Arm -> Forearm -> Hand)
    // Left Arm
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.29, 1.40, 0);

    const leftShoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.072, 14, 14), torsoMat);
    leftShoulderCap.position.set(0, 0, 0);
    leftArmPivot.add(leftShoulderCap);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.060, 0.26, 12), torsoMat);
    leftUpperArm.position.y = -0.13;
    leftUpperArm.castShadow = true;
    leftArmPivot.add(leftUpperArm);

    const leftElbowPivot = new THREE.Group();
    leftElbowPivot.position.set(0, -0.26, 0);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.060, 0.054, 0.24, 12), torsoMat);
    leftForearm.position.y = -0.12;
    leftForearm.castShadow = true;
    leftElbowPivot.add(leftForearm);

    // Shirt cuff at left wrist
    const leftCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.063, 0.04, 12), torsoMat);
    leftCuff.position.set(0, -0.22, 0);
    leftElbowPivot.add(leftCuff);

    // Left Hand
    const leftHandGroup = new THREE.Group();
    leftHandGroup.position.set(0, -0.26, 0);
    const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.08, 0.045), skinMat);
    leftPalm.position.set(0, -0.04, 0);
    leftHandGroup.add(leftPalm);

    const leftThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.045, 8), skinMat);
    leftThumb.position.set(0.038, -0.02, 0.015);
    leftThumb.rotation.z = Math.PI / 4;
    leftThumb.rotation.x = 0.2;
    leftHandGroup.add(leftThumb);

    [-0.02, 0.005, 0.03].forEach((fx) => {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.009, 0.055, 8), skinMat);
      finger.position.set(fx, -0.08, 0.005);
      leftHandGroup.add(finger);
    });
    leftElbowPivot.add(leftHandGroup);

    leftArmPivot.rotation.z = -0.05;
    leftElbowPivot.rotation.x = -0.06;
    leftArmPivot.add(leftElbowPivot);
    root.add(leftArmPivot);

    // Right Arm
    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.29, 1.40, 0);

    const rightShoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.072, 14, 14), torsoMat);
    rightShoulderCap.position.set(0, 0, 0);
    rightArmPivot.add(rightShoulderCap);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.060, 0.26, 12), torsoMat);
    rightUpperArm.position.y = -0.13;
    rightUpperArm.castShadow = true;
    rightArmPivot.add(rightUpperArm);

    const rightElbowPivot = new THREE.Group();
    rightElbowPivot.position.set(0, -0.26, 0);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.060, 0.054, 0.24, 12), torsoMat);
    rightForearm.position.y = -0.12;
    rightForearm.castShadow = true;
    rightElbowPivot.add(rightForearm);

    // Shirt cuff at right wrist
    const rightCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.063, 0.04, 12), torsoMat);
    rightCuff.position.set(0, -0.22, 0);
    rightElbowPivot.add(rightCuff);

    // Right Hand
    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0, -0.26, 0);
    const rightPalm = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.08, 0.045), skinMat);
    rightPalm.position.set(0, -0.04, 0);
    rightHandGroup.add(rightPalm);

    const rightThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.045, 8), skinMat);
    rightThumb.position.set(-0.038, -0.02, 0.015);
    rightThumb.rotation.z = -Math.PI / 4;
    rightThumb.rotation.x = 0.2;
    rightHandGroup.add(rightThumb);

    [-0.02, 0.005, 0.03].forEach((fx) => {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.009, 0.055, 8), skinMat);
      finger.position.set(-fx, -0.08, 0.005);
      rightHandGroup.add(finger);
    });
    rightElbowPivot.add(rightHandGroup);

    rightArmPivot.rotation.z = 0.05;
    rightElbowPivot.rotation.x = -0.06;
    rightArmPivot.add(rightElbowPivot);
    root.add(rightArmPivot);

    // Floating Waving Hand Emoji (for Sarah or waving emotes)
    let wavingHandMesh = null;
    if (config.hasWavingHand) {
      const handGroup = new THREE.Group();
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.36, 0.06), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
      handGroup.add(palm);
      for (let f = 0; f < 4; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.20, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        finger.position.set(-0.11 + f * 0.075, 0.26, 0);
        handGroup.add(finger);
      }
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.16, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
      thumb.position.set(0.18, 0.05, 0);
      thumb.rotation.z = -Math.PI / 4;
      handGroup.add(thumb);

      handGroup.position.set(0.55, 2.35, 0.2);
      root.add(handGroup);
      wavingHandMesh = handGroup;
    }

    // 4. Pelvis & Articulated Legs (matching real_spot_after_continue.png)
    const pantsMat = config.pantsColor === 'dark' ? pantsDarkMat : (config.pantsColor === 'beige' ? pantsBeigeMat : pantsBlueMat);

    // Pelvis waistband connecting shirt to legs
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.265, 0.16, 18), pantsMat);
    pelvis.position.set(0, 0.88, 0);
    pelvis.castShadow = true;
    root.add(pelvis);

    // Helper: Build one articulated leg (thigh + knee hinge + shin + sneaker)
    const buildLeg = (legX) => {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(legX, 0.80, 0);

      // Thigh (length 0.38)
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.078, 0.38, 14), pantsMat);
      thigh.position.y = -0.19;
      thigh.castShadow = true;
      hipPivot.add(thigh);

      // Knee Joint Pivot at local y = -0.38
      const kneePivot = new THREE.Group();
      kneePivot.position.set(0, -0.38, 0);

      // Knee joint cap
      const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(0.076, 12, 12), pantsMat);
      kneeCap.position.set(0, 0, 0.01);
      kneePivot.add(kneeCap);

      // Shin / Calf (length 0.36)
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.068, 0.36, 14), pantsMat);
      shin.position.y = -0.18;
      shin.castShadow = true;
      kneePivot.add(shin);

      // Modern Spot Sneaker at bottom of shin (y = -0.36)
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.36, 0);

      // White rubber sole plinth (rests flat at floor y = 0)
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.040, 0.30), whiteSoleMat);
      sole.position.set(0, 0.020, 0.05);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Sneaker Upper body (light gray / pale white upper matching real_spot_after_continue.png)
      const sneakerUpperMat = new THREE.MeshStandardMaterial({ color: 0xdde3ea, roughness: 0.6 });
      const shoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.065, 0.26), sneakerUpperMat);
      shoeUpper.position.set(0, 0.065, 0.035);
      shoeUpper.castShadow = true;
      shoeGroup.add(shoeUpper);

      // White rounded toe bumper
      const toeBumper = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.035, 12, 1, false, 0, Math.PI), whiteSoleMat);
      toeBumper.rotation.y = Math.PI / 2;
      toeBumper.position.set(0, 0.035, 0.16);
      shoeGroup.add(toeBumper);

      kneePivot.add(shoeGroup);
      hipPivot.add(kneePivot);

      return { hipPivot, kneePivot };
    };

    // Naturally spaced legs matching real_spot_after_continue.png
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
        torsoMat
      },
      config,
      parts: {
        headGroup,
        torsoGroup,
        leftArmPivot,
        rightArmPivot,
        leftElbowPivot,
        rightElbowPivot,
        leftLegPivot: leftLeg.hipPivot,
        rightLegPivot: rightLeg.hipPivot,
        leftKneePivot: leftLeg.kneePivot,
        rightKneePivot: rightLeg.kneePivot,
        wavingHandMesh
      }
    };
  };

  /**
   * Applies realistic humanoid kinematic poses:
   * - Walking: Natural alternating hip stride, natural knee flexion on back-swing, counter arm swings.
   * - Sitting: Thigh horizontal forward (-1.45 rad), knee flexed 90° down (+1.45 rad), shins vertical, arms resting on thighs.
   * - Standing Idle: Gentle breathing sway, natural relaxed posture.
   */
  const applyAvatarPose = (parts, { isMoving = false, walkCycle = 0, isSitting = false, emote = null, elapsed = 0 }) => {
    if (!parts) return;

    if (isMoving) {
      // Natural walking kinematics
      const stride = Math.sin(walkCycle);
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = stride * 0.55;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -stride * 0.55;

      // Knee bends backward during the back stride
      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = Math.max(0, -stride * 0.65);
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = Math.max(0, stride * 0.65);

      // Arm counter swing with natural slight elbow bend
      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -stride * 0.45;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = stride * 0.45;
      if (parts.leftElbowPivot) parts.leftElbowPivot.rotation.x = -0.15;
      if (parts.rightElbowPivot) parts.rightElbowPivot.rotation.x = -0.15;

      if (parts.torsoGroup) parts.torsoGroup.position.y = 1.20;
    } else if (isSitting) {
      // Authentic sitting kinematics:
      // Thighs rotated forward 83° (-1.45 rad)
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = -1.45;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = -1.45;

      // Knees bent downward 83° (+1.45 rad) so shins are perpendicular/vertical to floor
      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = 1.45;
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = 1.45;

      // Arms resting naturally on armrests or thighs
      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = -0.55;
      if (parts.rightArmPivot) parts.rightArmPivot.rotation.x = -0.55;
      if (parts.leftElbowPivot) parts.leftElbowPivot.rotation.x = -0.35;
      if (parts.rightElbowPivot) parts.rightElbowPivot.rotation.x = -0.35;

      if (parts.torsoGroup) parts.torsoGroup.position.y = 1.20;
    } else {
      // Standing idle pose with subtle breathing sway
      if (parts.leftLegPivot) parts.leftLegPivot.rotation.x = 0;
      if (parts.rightLegPivot) parts.rightLegPivot.rotation.x = 0;
      if (parts.leftKneePivot) parts.leftKneePivot.rotation.x = 0;
      if (parts.rightKneePivot) parts.rightKneePivot.rotation.x = 0;
      if (parts.leftArmPivot) parts.leftArmPivot.rotation.x = 0;
      if (parts.leftElbowPivot) parts.leftElbowPivot.rotation.x = 0;

      // Emote wave
      if (emote === 'wave' && parts.rightArmPivot) {
        parts.rightArmPivot.rotation.z = Math.PI * 0.72 + Math.sin(elapsed * 12) * 0.3;
        parts.rightArmPivot.rotation.x = -0.3;
        if (parts.rightElbowPivot) parts.rightElbowPivot.rotation.x = -0.5;
      } else if (parts.rightArmPivot) {
        parts.rightArmPivot.rotation.z = 0;
        parts.rightArmPivot.rotation.x = 0;
        if (parts.rightElbowPivot) parts.rightElbowPivot.rotation.x = 0;
      }

      if (parts.torsoGroup) {
        parts.torsoGroup.position.y = 1.20 + Math.sin(elapsed * 2.5) * 0.015;
      }
    }
  };

  // 3. Create Roster of 11 Characters Matching the Reference Screenshot
  const createRoster = (scene, playerConfig = {}) => {
    const list = [];

    // Parse skinColor if passed as hex string or number
    let skinHex = 0xf5d0b5;
    if (playerConfig.skinColor) {
      if (typeof playerConfig.skinColor === 'string') {
        skinHex = parseInt(playerConfig.skinColor.replace('#', '0x'), 16);
      } else {
        skinHex = playerConfig.skinColor;
      }
    }

    const hairType = playerConfig.hairType || (playerConfig.gender === 'male' ? 'pompadour' : 'spot_wavy_bob');
    const shirtColor = playerConfig.shirtColor || 0x93c5fd;

    // 1. Player (Active Player) - Boardroom (matching real_spot_after_continue.png)
    const ayush = buildAvatar(playerConfig.name || 'Ayush (you)', new THREE.Vector3(-9.0, 0, 16.0), {
      isPlayer: true,
      skinColor: skinHex,
      hairType: hairType,
      hairColor: playerConfig.hairColor || 0x1c1917,
      eyeColor: 0x10b981, // Vibrant emerald green matching real_spot_after_continue.png
      clothing: 'oxford_shirt',
      shirtColor: shirtColor,
      pantsColor: 'indigo',
      role: 'Digital Lead'
    });
    scene.add(ayush.mesh);
    list.push(ayush);

    // 2. Wes - Workspace A
    const wes = buildAvatar('Wes', new THREE.Vector3(6.0, 0, -19.0), {
      hairType: 'blond_styled',
      clothing: 'plaid_flannel',
      pantsColor: 'dark',
      role: 'Platform Architect'
    });
    scene.add(wes.mesh);
    list.push(wes);

    // 3. Stefan - Lounge B
    const stefan = buildAvatar('Stefan', new THREE.Vector3(-1.0, 0, 2.0), {
      hairColor: 0x3d2714,
      clothing: 'purple_striped',
      pantsColor: 'dark',
      isSitting: true,
      role: 'Audio Engineer'
    });
    scene.add(stefan.mesh);
    list.push(stefan);

    // 4. Phil - Long table north side (seated, facing room)
    const phil = buildAvatar('Phil', new THREE.Vector3(4.8, 0, 2.5), {
      shirtColor: 0xdc2626,
      hasGlasses: true,
      glassesColor: 0xf97316,
      hasBeard: true,
      isSitting: true,
      role: 'Infrastructure'
    });
    scene.add(phil.mesh);
    list.push(phil);

    // 5. Sarah - Round table huddle (seated with waving hand)
    const sarah = buildAvatar('Sarah', new THREE.Vector3(-17.2, 0, 4.8), {
      hairColor: 0x5b3a29,
      shirtColor: 0x0284c7,
      hasWavingHand: true,
      isSitting: true,
      role: 'Product Designer'
    });
    scene.add(sarah.mesh);
    list.push(sarah);

    // 6. Andi - Round table huddle (seated)
    const andi = buildAvatar('Andi', new THREE.Vector3(-21.5, 0, 5.8), {
      shirtColor: 0xf472b6,
      hairType: 'blond_styled',
      isSitting: true,
      role: 'Operations'
    });
    scene.add(andi.mesh);
    list.push(andi);

    // 7. Chloe - Middle nook white sofa (seated)
    const chloe = buildAvatar('Chloe', new THREE.Vector3(-4.5, 0, 4.2), {
      hairType: 'orange_bob',
      shirtColor: 0xf1f5f9,
      pantsColor: 'beige',
      isSitting: true,
      initialRot: Math.PI / 2,
      role: 'Growth & Events'
    });
    scene.add(chloe.mesh);
    list.push(chloe);

    // 8. Steven - Engineering desk pod 1 (seated, headphones)
    const steven = buildAvatar('Steven', new THREE.Vector3(17.5, 0, -14.1), {
      shirtColor: 0xffffff,
      hasHeadphones: true,
      isSitting: true,
      role: 'Frontend Engineer'
    });
    scene.add(steven.mesh);
    list.push(steven);

    // 9. Alex - Engineering desk pod 2 (seated, beanie)
    const alex = buildAvatar('Alex', new THREE.Vector3(22.5, 0, -14.1), {
      hatType: 'beanie',
      shirtColor: 0x334155,
      pantsColor: 'dark',
      isSitting: true,
      role: 'WebRTC Specialist'
    });
    scene.add(alex.mesh);
    list.push(alex);

    // 10. Graham - Walking near engineering aisle
    const graham = buildAvatar('Graham', new THREE.Vector3(15.2, 0, -5.2), {
      shirtColor: 0x16a34a,
      hairColor: 0x27272a,
      role: 'Security & DevOps'
    });
    scene.add(graham.mesh);
    list.push(graham);

    // 11. DevBot (Autonomous AI Agent) - Glass Boardroom
    const devBot = buildAvatar('DevBot (AI)', new THREE.Vector3(0, 0, -17.0), {
      shirtColor: 0x10b981,
      skinColor: 0xd1fae5,
      status: 'ai-agent',
      isSitting: true,
      role: 'Autonomous Agent'
    });
    scene.add(devBot.mesh);
    list.push(devBot);

    // Apply authentic sitting kinematics to all initially seated avatars
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
    createRoster
  };
}
