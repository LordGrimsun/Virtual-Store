import * as THREE from 'three';

/**
 * Creates friendly, stylized 3D humanoid avatars with heads, facial features,
 * 3D hair/hats, clothing textures, articulated arms, and legs supporting walking,
 * seated poses, and animated gestures matching the Spot Virtual desktop reference.
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

  // Generic Stylized Face Decal Canvas
  const createFaceTexture = (hasBeard = false, eyeColor = '#1e293b') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Eyes
    [-45, 45].forEach((eyeX) => {
      // Sclera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(128 + eyeX, 110, 18, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris & Pupil
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(128 + eyeX, 112, 11, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(128 + eyeX - 4, 108, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrow
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(128 + eyeX, 85, 14, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    });

    // Mouth / Smile
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(128, 155, 20, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Beard / Stubble
    if (hasBeard) {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(128, 190, 48, 28, 0, 0, Math.PI);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  };

  const defaultFaceTex = createFaceTexture(false, '#1e293b');
  const stanFaceTex = createFaceTexture(true, '#0369a1');
  const wesFaceTex = createFaceTexture(false, '#0284c7');

  // Materials
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const darkShoeMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.8 });
  const pantsBlueMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 });
  const pantsDarkMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
  const pantsBeigeMat = new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.8 });

  // 2. Avatar Factory
  const buildAvatar = (name, initialPos, config = {}) => {
    const root = new THREE.Group();
    root.name = `avatar_${name}`;

    // Skin Material
    const skinMat = new THREE.MeshStandardMaterial({
      color: config.skinColor || 0xf6d8c3,
      roughness: 0.55
    });

    // 1. Head Assembly
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.88;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), skinMat);
    head.name = `avatar_head_${name}`;
    head.castShadow = true;
    headGroup.add(head);

    // Face Decal Plane
    let faceTex = defaultFaceTex;
    if (config.hasBeard) faceTex = stanFaceTex;
    else if (name === 'Wes') faceTex = wesFaceTex;

    const faceDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 0.46),
      new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, opacity: 0.95 })
    );
    faceDecal.position.set(0, 0.02, 0.41);
    headGroup.add(faceDecal);

    // Hair / Hats
    if (config.hatType === 'spot_cap') {
      // White Spot Baseball Cap
      const capDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7),
        whiteMat
      );
      capDome.position.set(0, 0.12, -0.04);
      headGroup.add(capDome);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.36), whiteMat);
      visor.position.set(0, 0.08, 0.44);
      visor.rotation.x = -0.1;
      headGroup.add(visor);

      const logoDot = new THREE.Mesh(
        new THREE.CircleGeometry(0.08, 16),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      logoDot.position.set(0, 0.22, 0.42);
      logoDot.rotation.x = -0.2;
      headGroup.add(logoDot);
    } else if (config.hatType === 'beanie') {
      const beanie = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5),
        pantsDarkMat
      );
      beanie.position.set(0, 0.12, 0);
      headGroup.add(beanie);
    } else if (config.hairType === 'blond_styled') {
      // Wes's styled blonde pompadour
      const hairMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7),
        hairMat
      );
      hairDome.position.set(0, 0.12, -0.05);
      headGroup.add(hairDome);

      const quiff = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 8), hairMat);
      quiff.position.set(0.05, 0.42, 0.22);
      quiff.rotation.x = 0.5;
      headGroup.add(quiff);
    } else if (config.hairType === 'orange_bob') {
      // Chloe's bright orange bob with fringe
      const hairMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5),
        hairMat
      );
      hairDome.position.set(0, 0.1, -0.02);
      headGroup.add(hairDome);

      [-0.32, 0.32].forEach((sx) => {
        const strand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 0.25), hairMat);
        strand.position.set(sx, -0.05, 0.1);
        headGroup.add(strand);
      });
    } else {
      const hairMat = new THREE.MeshStandardMaterial({
        color: config.hairColor || 0x452210,
        roughness: 0.6
      });
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.6),
        hairMat
      );
      hair.position.set(0, 0.12, -0.04);
      headGroup.add(hair);
    }

    // Glasses
    if (config.hasGlasses) {
      const frameColor = config.glassesColor || 0x0f172a;
      const gMat = new THREE.MeshBasicMaterial({ color: frameColor });
      [-0.17, 0.17].forEach((gx) => {
        const rim = new THREE.Mesh(new THREE.RingGeometry(0.075, 0.105, 16), gMat);
        rim.position.set(gx, 0.03, 0.42);
        headGroup.add(rim);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.025, 0.01), gMat);
      bridge.position.set(0, 0.03, 0.42);
      headGroup.add(bridge);
    }

    // Headphone accessory
    if (config.hasHeadphones) {
      const hpMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.03, 8, 16, Math.PI), hpMat);
      band.position.set(0, 0.15, 0);
      headGroup.add(band);

      [-0.43, 0.43].forEach((cupX) => {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 12), hpMat);
        cup.rotation.z = Math.PI / 2;
        cup.position.set(cupX, 0.02, 0);
        headGroup.add(cup);
      });
    }

    root.add(headGroup);

    // 2. Torso Assembly
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

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.36, 0.82, 16), torsoMat);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Puffer jacket horizontal rings
    if (config.clothing === 'cyan_puffer') {
      [-0.24, 0, 0.24].forEach((qy) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.35, 0.035, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0x0369a1 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = qy;
        torsoGroup.add(ring);
      });
    }

    root.add(torsoGroup);

    // 3. Articulated Arms
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.38, 1.48, 0);
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.58, 8), torsoMat);
    leftArm.position.y = -0.28;
    leftArm.castShadow = true;
    leftArmPivot.add(leftArm);
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), skinMat);
    leftHand.position.y = -0.58;
    leftArmPivot.add(leftHand);
    root.add(leftArmPivot);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.38, 1.48, 0);
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.58, 8), torsoMat);
    rightArm.position.y = -0.28;
    rightArm.castShadow = true;
    rightArmPivot.add(rightArm);
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), skinMat);
    rightHand.position.y = -0.58;
    rightArmPivot.add(rightHand);
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

    // 4. Articulated Legs and Shoes
    const pantsMat = config.pantsColor === 'dark' ? pantsDarkMat : config.pantsColor === 'beige' ? pantsBeigeMat : pantsBlueMat;

    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.18, 0.74, 0);
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.68, 8), pantsMat);
    leftLeg.position.y = -0.34;
    leftLeg.castShadow = true;
    leftLegPivot.add(leftLeg);
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.32), darkShoeMat);
    leftShoe.position.set(0, -0.68, 0.06);
    leftShoe.castShadow = true;
    leftLegPivot.add(leftShoe);
    root.add(leftLegPivot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.18, 0.74, 0);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.68, 8), pantsMat);
    rightLeg.position.y = -0.34;
    rightLeg.castShadow = true;
    rightLegPivot.add(rightLeg);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.32), darkShoeMat);
    rightShoe.position.set(0, -0.68, 0.06);
    rightShoe.castShadow = true;
    rightLegPivot.add(rightShoe);
    root.add(rightLegPivot);

    root.position.copy(initialPos);
    if (config.initialRot) root.rotation.y = config.initialRot;

    return {
      name,
      role: config.role || 'Teammate',
      mesh: root,
      isPlayer: config.isPlayer || false,
      status: config.status || 'online',
      initialSitting: config.isSitting || false,
      parts: {
        headGroup,
        torsoGroup,
        leftArmPivot,
        rightArmPivot,
        leftLegPivot,
        rightLegPivot,
        wavingHandMesh
      }
    };
  };

  // 3. Create Roster of 11 Characters Matching the Reference Screenshot
  const createRoster = (scene) => {
    const list = [];

    // 1. Ayush (Active Player) - Boardroom (matching media_1791969444037.png & media_1791969444163.png)
    const ayush = buildAvatar('Ayush (you)', new THREE.Vector3(-9.0, 0, 16.0), {
      isPlayer: true,
      hairType: 'brown_neat',
      hairColor: 0x452211,
      shirtColor: 0xb91c1c, // Burgundy / Red top matching screenshot
      pantsColor: 'dark',
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

    // 4. Phil - Long table north side (seated, facing us)
    const phil = buildAvatar('Phil', new THREE.Vector3(4.8, 0, 2.5), {
      shirtColor: 0xdc2626,
      hasGlasses: true,
      glassesColor: 0xf97316,
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

    // Apply sitting kinematics to seated avatars
    list.forEach((av) => {
      if (av.initialSitting) {
        av.mesh.position.y = -0.15;
        if (av.parts.leftLegPivot) {
          av.parts.leftLegPivot.rotation.x = -Math.PI / 2;
          av.parts.rightLegPivot.rotation.x = -Math.PI / 2;
        }
        if (av.parts.leftArmPivot) {
          av.parts.leftArmPivot.rotation.x = -Math.PI / 3;
          av.parts.rightArmPivot.rotation.x = -Math.PI / 3;
        }
      }
    });

    return list;
  };

  return {
    buildAvatar,
    createRoster
  };
}
