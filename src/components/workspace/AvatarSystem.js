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

    // 1. Head Assembly (y = 1.88)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.88;

    // Smooth neck connecting head to torso
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 16), skinMat);
    neck.position.set(0, -0.32, 0);
    headGroup.add(neck);

    // Stylized contoured chibi head (soft squoval contours matching real_spot_after_continue.png)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.40, 28, 28), skinMat);
    head.scale.set(1.0, 1.04, 0.96);
    head.name = `avatar_head_${name}`;
    head.castShadow = true;
    headGroup.add(head);

    // Cute cheeks definition
    [-0.15, 0.15].forEach((cx) => {
      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), skinMat);
      cheek.position.set(cx, -0.10, 0.26);
      cheek.scale.set(1.0, 0.85, 0.85);
      headGroup.add(cheek);
    });

    // Cute rounded chin
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), skinMat);
    chin.position.set(0, -0.22, 0.20);
    headGroup.add(chin);

    // Subtle sculpted nose
    const nose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.035, 0.08, 8),
      skinMat
    );
    nose.position.set(0, -0.04, 0.40);
    nose.rotation.x = 0.2;
    headGroup.add(nose);

    // Ears on both sides
    [-0.40, 0.40].forEach((ex) => {
      const ear = new THREE.Mesh(
        new THREE.CylinderGeometry(0.062, 0.062, 0.028, 12),
        skinMat
      );
      ear.position.set(ex, 0, 0);
      ear.rotation.z = Math.PI / 2;
      headGroup.add(ear);
    });

    // 3D Expressive Almond Eyes (Left & Right) matching real_spot_after_continue.png
    const eyeColor = config.eyeColor || (name === 'Wes' ? 0x0284c7 : (config.hasBeard ? 0x0369a1 : 0x10b981));
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: eyeColor });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyebrowMat = new THREE.MeshStandardMaterial({
      color: config.hairColor || (config.hairType === 'blond_styled' ? 0xa16207 : 0x1c1917),
      roughness: 0.7
    });

    [-0.14, 0.14].forEach((eyeX) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(eyeX, 0.04, 0.37);

      // Sclera (White eye ball)
      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), eyeWhiteMat);
      eyeWhite.scale.set(1.22, 0.92, 0.45);
      eyeGroup.add(eyeWhite);

      // Colored Iris (emerald green matching real_spot_after_continue.png)
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.042, 16), irisMat);
      iris.position.set(0, 0, 0.033);
      eyeGroup.add(iris);

      // Dark Pupil
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.024, 16), pupilMat);
      pupil.position.set(0, 0, 0.034);
      eyeGroup.add(pupil);

      // Specular highlight glint
      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.010, 8), glintMat);
      glint.position.set(-0.014, 0.014, 0.035);
      eyeGroup.add(glint);

      // Upper eyelid curved line
      const upperLid = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.009, 6, 14, Math.PI * 0.75), eyebrowMat);
      upperLid.position.set(0, 0.042, 0.032);
      upperLid.rotation.z = Math.PI * 0.12;
      eyeGroup.add(upperLid);

      // 3D Eyebrow arch
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.024, 0.02), eyebrowMat);
      brow.position.set(0, 0.082, 0.025);
      brow.rotation.z = (eyeX < 0 ? -1 : 1) * 0.08;
      eyeGroup.add(brow);

      headGroup.add(eyeGroup);
    });

    // Friendly 3D Smile / Lips
    const lipMat = new THREE.MeshBasicMaterial({ color: 0xbe123c });
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.012, 8, 16, Math.PI * 0.7), lipMat);
    smile.position.set(0, -0.16, 0.38);
    smile.rotation.x = 0.26;
    smile.rotation.z = Math.PI * 1.15;
    headGroup.add(smile);

    // Beard / Stubble for Stan / Phil
    if (config.hasBeard) {
      const beardMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      const beard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.34, 0.22, 16, 1, false, -Math.PI / 2, Math.PI),
        beardMat
      );
      beard.position.set(0, -0.18, 0.08);
      headGroup.add(beard);
    }

    // Sculpted 3D Hairstyles & Headwear
    if (config.hatType === 'spot_cap') {
      // White Spot Baseball Cap with green dot
      const capDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.44, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7),
        whiteMat
      );
      capDome.position.set(0, 0.12, -0.03);
      headGroup.add(capDome);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.38), whiteMat);
      visor.position.set(0, 0.08, 0.44);
      visor.rotation.x = -0.1;
      headGroup.add(visor);

      const logoDot = new THREE.Mesh(
        new THREE.CircleGeometry(0.07, 16),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      logoDot.position.set(0, 0.23, 0.42);
      logoDot.rotation.x = -0.2;
      headGroup.add(logoDot);
    } else if (config.hatType === 'beanie') {
      // Ribbed Knit Beanie with folded brim
      const beanieDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.5),
        pantsDarkMat
      );
      beanieDome.position.set(0, 0.14, 0);
      headGroup.add(beanieDome);

      const brim = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.05, 10, 24), pantsDarkMat);
      brim.position.set(0, 0.08, 0);
      brim.rotation.x = Math.PI / 2;
      headGroup.add(brim);
    } else if (config.hairType === 'blond_styled') {
      // Wes's styled golden-blonde pompadour with swept locks
      const hairMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45 });
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.6),
        hairMat
      );
      hairDome.position.set(0, 0.12, -0.04);
      headGroup.add(hairDome);

      // Swept pompadour volume
      const pomp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.35, 12), hairMat);
      pomp.position.set(0.04, 0.38, 0.18);
      pomp.rotation.x = 0.55;
      pomp.rotation.z = -0.1;
      headGroup.add(pomp);

      // Side locks
      [-0.38, 0.38].forEach((sx) => {
        const sideLock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.26, 0.2), hairMat);
        sideLock.position.set(sx, 0.08, 0.1);
        headGroup.add(sideLock);
      });
    } else if (config.hairType === 'orange_bob') {
      // Chloe's bright orange layered bob with fringe
      const hairMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.5),
        hairMat
      );
      hairDome.position.set(0, 0.11, -0.02);
      headGroup.add(hairDome);

      // Front fringe bangs
      const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.15), hairMat);
      fringe.position.set(0, 0.18, 0.35);
      fringe.rotation.x = 0.3;
      headGroup.add(fringe);

      // Left & right bob strands framing face
      [-0.34, 0.34].forEach((sx) => {
        const strand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.32), hairMat);
        strand.position.set(sx, -0.06, 0.08);
        headGroup.add(strand);
      });
    } else {
      // Authentic Spot Virtual Volumetric Wavy Hair with Cascading Shoulder Locks (matching real_spot_after_continue.png)
      const hairColor = config.hairColor || 0x1c1917; // Deep espresso / dark charcoal
      const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.65 });

      // Main cranial hair volume dome
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.44, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.55),
        hairMat
      );
      hairDome.position.set(0, 0.12, -0.04);
      headGroup.add(hairDome);

      // Parted volumetric crown volume (left & right crown lobes)
      [-0.14, 0.14].forEach((px) => {
        const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), hairMat);
        lobe.position.set(px, 0.32, 0.08);
        lobe.scale.set(1.2, 0.8, 1.1);
        headGroup.add(lobe);
      });

      // Front wavy bangs sweeping across forehead from parting
      [-0.12, 0.12].forEach((bx) => {
        const bang = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.12), hairMat);
        bang.position.set(bx, 0.20, 0.34);
        bang.rotation.set(0.25, 0, (bx < 0 ? -1 : 1) * 0.15);
        headGroup.add(bang);
      });

      // Signature cascading wavy locks draping over shoulders (exact match to real_spot_after_continue.png)
      [-0.40, 0.40].forEach((sideX) => {
        const sign = sideX < 0 ? -1 : 1;

        // Upper lock beside temple
        const upperLock = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.32, 10), hairMat);
        upperLock.position.set(sideX, 0.06, 0.12);
        upperLock.rotation.set(-0.1, 0, sign * -0.12);
        headGroup.add(upperLock);

        // Mid lock cascading past the ear & cheek
        const midLock = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.36, 10), hairMat);
        midLock.position.set(sideX * 1.05, -0.16, 0.10);
        midLock.rotation.set(-0.08, 0, sign * -0.06);
        headGroup.add(midLock);

        // Lower shoulder lock curling forward over the collar / shoulder
        const shoulderLock = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.34, 10), hairMat);
        shoulderLock.position.set(sideX * 0.95, -0.38, 0.14);
        shoulderLock.rotation.set(0.28, sign * 0.15, sign * 0.08);
        shoulderLock.castShadow = true;
        headGroup.add(shoulderLock);
      });

      // Flowing layered back curtain locks down the neck onto upper back
      const backCurtain = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.46, 16, 1, false, Math.PI * 0.5, Math.PI), hairMat);
      backCurtain.position.set(0, -0.18, -0.04);
      headGroup.add(backCurtain);
    }

    // Modern Glasses (for Phil / custom)
    if (config.hasGlasses) {
      const frameColor = config.glassesColor || 0xf97316;
      const gMat = new THREE.MeshBasicMaterial({ color: frameColor });
      const glassMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.45 });

      [-0.16, 0.16].forEach((gx) => {
        const rim = new THREE.Mesh(new THREE.RingGeometry(0.07, 0.095, 16), gMat);
        rim.position.set(gx, 0.05, 0.41);
        headGroup.add(rim);

        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), glassMat);
        lens.position.set(gx, 0.05, 0.41);
        headGroup.add(lens);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.022, 0.01), gMat);
      bridge.position.set(0, 0.05, 0.41);
      headGroup.add(bridge);
    }

    // Over-Ear Studio Headphones (for Steven)
    if (config.hasHeadphones) {
      const hpMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const cushionMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.03, 8, 20, Math.PI), hpMat);
      band.position.set(0, 0.16, 0);
      headGroup.add(band);

      [-0.43, 0.43].forEach((cupX) => {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16), hpMat);
        cup.rotation.z = Math.PI / 2;
        cup.position.set(cupX, 0.02, 0);
        headGroup.add(cup);

        const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.022, 8, 16), cushionMat);
        cushion.rotation.y = Math.PI / 2;
        cushion.position.set(cupX + (cupX < 0 ? 0.02 : -0.02), 0.02, 0);
        headGroup.add(cushion);
      });
    }

    root.add(headGroup);

    // 2. Torso Assembly (y = 1.15)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.15;

    let torsoMat;
    if (config.clothing === 'cyan_puffer') {
      torsoMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.38 });
    } else if (config.clothing === 'plaid_flannel') {
      torsoMat = new THREE.MeshStandardMaterial({ map: plaidTexture, roughness: 0.8 });
    } else if (config.clothing === 'purple_striped') {
      torsoMat = new THREE.MeshStandardMaterial({ map: stripeTexture, roughness: 0.8 });
    } else {
      torsoMat = new THREE.MeshStandardMaterial({
        color: config.shirtColor || 0xffffff,
        roughness: 0.65
      });
    }

    // Tapered humanoid torso body
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.36, 0.82, 18), torsoMat);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Button-down center placket and pearl buttons (matching real_spot_after_continue.png)
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.74, 0.02), torsoMat);
    placket.position.set(0, 0, 0.36);
    torsoGroup.add(placket);

    const buttonMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    [0.26, 0.10, -0.06, -0.22].forEach((by) => {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.01, 8), buttonMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0, by, 0.375);
      torsoGroup.add(btn);
    });

    // 3D Winged Shirt Collar (matching real_spot_after_continue.png)
    [-0.10, 0.10].forEach((cx) => {
      const collarWing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.12), torsoMat);
      collarWing.position.set(cx, 0.42, 0.16);
      collarWing.rotation.set(-0.35, cx < 0 ? 0.3 : -0.3, cx < 0 ? -0.2 : 0.2);
      torsoGroup.add(collarWing);
    });

    // Cyan Puffer jacket horizontal baffle segments
    if (config.clothing === 'cyan_puffer') {
      [-0.24, 0, 0.24].forEach((qy) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.35, 0.035, 8, 18),
          new THREE.MeshStandardMaterial({ color: 0x0369a1 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = qy;
        torsoGroup.add(ring);
      });
    }

    // Belt & Buckle at waist (y = -0.38)
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.365, 0.365, 0.06, 18), beltMat);
    belt.position.y = -0.38;
    torsoGroup.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.02), buckleMat);
    buckle.position.set(0, -0.38, 0.37);
    torsoGroup.add(buckle);

    root.add(torsoGroup);

    // 3. Two-Segment Articulated Arms (Shoulder -> Upper Arm -> Elbow -> Forearm -> Hand)
    // Left Arm
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.38, 1.48, 0);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.072, 0.28, 10), torsoMat);
    leftUpperArm.position.y = -0.14;
    leftUpperArm.castShadow = true;
    leftArmPivot.add(leftUpperArm);

    const leftElbowPivot = new THREE.Group();
    leftElbowPivot.position.set(0, -0.28, 0);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.064, 0.26, 10), torsoMat);
    leftForearm.position.y = -0.13;
    leftForearm.castShadow = true;
    leftElbowPivot.add(leftForearm);

    // Shirt cuff at left wrist
    const leftCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.076, 0.05, 12), torsoMat);
    leftCuff.position.set(0, -0.25, 0);
    leftElbowPivot.add(leftCuff);

    // Left Hand with palm, thumb, and separated fingers
    const leftHandGroup = new THREE.Group();
    leftHandGroup.position.set(0, -0.29, 0);
    const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.05), skinMat);
    leftPalm.position.set(0, -0.04, 0);
    leftHandGroup.add(leftPalm);

    const leftThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.055, 8), skinMat);
    leftThumb.position.set(0.045, -0.02, 0.02);
    leftThumb.rotation.z = Math.PI / 4;
    leftThumb.rotation.x = 0.2;
    leftHandGroup.add(leftThumb);

    [-0.025, 0.005, 0.035].forEach((fx) => {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.065, 8), skinMat);
      finger.position.set(fx, -0.09, 0.005);
      leftHandGroup.add(finger);
    });
    leftElbowPivot.add(leftHandGroup);

    leftArmPivot.add(leftElbowPivot);
    root.add(leftArmPivot);

    // Right Arm
    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.38, 1.48, 0);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.072, 0.28, 10), torsoMat);
    rightUpperArm.position.y = -0.14;
    rightUpperArm.castShadow = true;
    rightArmPivot.add(rightUpperArm);

    const rightElbowPivot = new THREE.Group();
    rightElbowPivot.position.set(0, -0.28, 0);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.064, 0.26, 10), torsoMat);
    rightForearm.position.y = -0.13;
    rightForearm.castShadow = true;
    rightElbowPivot.add(rightForearm);

    // Shirt cuff at right wrist
    const rightCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.076, 0.05, 12), torsoMat);
    rightCuff.position.set(0, -0.25, 0);
    rightElbowPivot.add(rightCuff);

    // Right Hand with palm, thumb, and separated fingers
    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0, -0.29, 0);
    const rightPalm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.05), skinMat);
    rightPalm.position.set(0, -0.04, 0);
    rightHandGroup.add(rightPalm);

    const rightThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.055, 8), skinMat);
    rightThumb.position.set(-0.045, -0.02, 0.02);
    rightThumb.rotation.z = -Math.PI / 4;
    rightThumb.rotation.x = 0.2;
    rightHandGroup.add(rightThumb);

    [-0.025, 0.005, 0.035].forEach((fx) => {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.065, 8), skinMat);
      finger.position.set(-fx, -0.09, 0.005);
      rightHandGroup.add(finger);
    });
    rightElbowPivot.add(rightHandGroup);

    rightArmPivot.add(rightElbowPivot);
    root.add(rightArmPivot);

    // Floating Waving Hand Emoji (for Sarah or waving emotes)
    let wavingHandMesh = null;
    if (config.hasWavingHand) {
      const handGroup = new THREE.Group();
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.06), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
      handGroup.add(palm);
      for (let f = 0; f < 4; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        finger.position.set(-0.12 + f * 0.08, 0.28, 0);
        handGroup.add(finger);
      }
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
      thumb.position.set(0.2, 0.05, 0);
      thumb.rotation.z = -Math.PI / 4;
      handGroup.add(thumb);

      handGroup.position.set(0.58, 2.45, 0.2);
      root.add(handGroup);
      wavingHandMesh = handGroup;
    }

    // 4. Two-Segment Articulated Legs (Hip -> Thigh -> Knee -> Shin -> Modern Sneaker)
    const pantsMat = config.pantsColor === 'dark' ? pantsDarkMat : (config.pantsColor === 'beige' ? pantsBeigeMat : pantsBlueMat);

    // Helper: Build one articulated leg (thigh + knee hinge + shin + sneaker)
    const buildLeg = (legX) => {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(legX, 0.76, 0);

      // Thigh (length 0.38)
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.088, 0.38, 12), pantsMat);
      thigh.position.y = -0.19;
      thigh.castShadow = true;
      hipPivot.add(thigh);

      // Knee Joint Pivot at local y = -0.38
      const kneePivot = new THREE.Group();
      kneePivot.position.set(0, -0.38, 0);

      // Knee joint cap
      const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(0.086, 12, 12), pantsMat);
      kneeCap.position.set(0, 0, 0.01);
      kneePivot.add(kneeCap);

      // Shin / Calf (length 0.38)
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.076, 0.38, 12), pantsMat);
      shin.position.y = -0.19;
      shin.castShadow = true;
      kneePivot.add(shin);

      // Modern Sneaker at bottom of shin (y = -0.38)
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.38, 0);

      // White rubber sole plinth
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.045, 0.32), whiteSoleMat);
      sole.position.set(0, 0.022, 0.06);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Sneaker Upper body
      const shoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.075, 0.28), darkShoeMat);
      shoeUpper.position.set(0, 0.075, 0.04);
      shoeUpper.castShadow = true;
      shoeGroup.add(shoeUpper);

      // White toe bumper
      const toeBumper = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 12, 1, false, 0, Math.PI), whiteSoleMat);
      toeBumper.rotation.y = Math.PI / 2;
      toeBumper.position.set(0, 0.04, 0.18);
      shoeGroup.add(toeBumper);

      kneePivot.add(shoeGroup);
      hipPivot.add(kneePivot);

      return { hipPivot, kneePivot };
    };

    const leftLeg = buildLeg(-0.18);
    const rightLeg = buildLeg(0.18);
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

      if (parts.torsoGroup) parts.torsoGroup.position.y = 1.15;
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

      if (parts.torsoGroup) parts.torsoGroup.position.y = 1.15;
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
        parts.torsoGroup.position.y = 1.15 + Math.sin(elapsed * 2.5) * 0.015;
      }
    }
  };

  // 3. Create Roster of 11 Characters Matching the Reference Screenshot
  const createRoster = (scene) => {
    const list = [];

    // 1. Ayush (Active Player) - Boardroom (matching real_spot_after_continue.png)
    const ayush = buildAvatar('Ayush (you)', new THREE.Vector3(-9.0, 0, 16.0), {
      isPlayer: true,
      skinColor: 0xf5d0b5,
      hairType: 'spot_wavy_bob',
      hairColor: 0x1c1917,
      eyeColor: 0x10b981, // Vibrant emerald green matching real_spot_after_continue.png
      clothing: 'oxford_shirt',
      shirtColor: 0x93c5fd, // Light powder blue button-down shirt matching real_spot_after_continue.png
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
