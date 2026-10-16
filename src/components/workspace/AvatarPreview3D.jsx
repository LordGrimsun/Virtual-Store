import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createAvatarSystem } from './AvatarSystem';

/**
 * AvatarPreview3D: Interactive 3D WebGL Avatar Preview Canvas
 * Replaces flat 2D dummy in the onboarding customizer with the authentic Spot Virtual 3D humanoid avatar.
 * Supports:
 * - 360° mouse & touch drag rotation
 * - Instant skin color updates without reload
 * - Gender / hairstyle toggle (feminine wavy bob vs masculine pompadour)
 * - Soft ground contact shadow plinth
 * - Idle breathing animation
 */
export default function AvatarPreview3D({
  skinColor = '#ba8659',
  gender = 'male',
  hairType = null,
  shirtColor = null,
  rotationAngle = 0, // external angle in degrees
  onRotationChange
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const avatarObjRef = useRef(null);
  const targetRotationYRef = useRef(0);
  const currentRotationYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const animFrameRef = useRef(null);

  // Sync external rotation prop
  useEffect(() => {
    targetRotationYRef.current = (rotationAngle * Math.PI) / 180;
  }, [rotationAngle]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 340;

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Camera: Framed head-to-toe with comfortable headroom & ground plinth padding
    const camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 50);
    camera.position.set(0, 1.22, 4.30);
    camera.lookAt(0, 1.08, 0);

    // 3. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.10);
    keyLight.position.set(2.0, 3.5, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.65);
    fillLight.position.set(-2.5, 2.0, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.40);
    rimLight.position.set(0, 2.0, -3.0);
    scene.add(rimLight);

    // 4. Soft Ground Contact Shadow Disc
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.28)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.005, 0);
    scene.add(shadowMesh);

    // 5. Build Initial 3D Avatar
    const avatarSys = createAvatarSystem();
    const effectiveHair = hairType || (gender === 'female' ? 'long_waves_headphones' : 'black_waves');
    const parsedSkin = typeof skinColor === 'string'
      ? parseInt(skinColor.replace('#', '0x'), 16)
      : skinColor;

    const av = avatarSys.buildAvatar('customizer_preview', new THREE.Vector3(0, 0, 0), {
      isPlayer: true,
      skinColor: parsedSkin,
      hairType: effectiveHair,
      hairColor: gender === 'female' ? 0x3e2723 : 0x1c1917,
      clothing: gender === 'female' ? 'pink_jacket' : 'red_hoodie',
      faceType: gender === 'female' ? 'wink' : 'happy',
      shirtColor: shirtColor || (gender === 'female' ? 0xf472b6 : 0xdc2626),
      gender: gender,
      initialRot: targetRotationYRef.current
    });
    scene.add(av.mesh);
    avatarObjRef.current = av;

    // 6. Interactive 360° Mouse & Touch Drag Rotation
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const deltaX = clientX - dragStartXRef.current;
      dragStartXRef.current = clientX;

      // Sensitivity: drag to rotate
      targetRotationYRef.current += deltaX * 0.016;
      currentRotationYRef.current = targetRotationYRef.current;
      if (avatarObjRef.current?.mesh) {
        avatarObjRef.current.mesh.rotation.y = targetRotationYRef.current;
      }

      if (onRotationChange) {
        const deg = Math.round((((targetRotationYRef.current * 180) / Math.PI) % 360 + 360) % 360);
        onRotationChange(deg);
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.style.touchAction = 'none';

    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 7. Render Loop with Smooth Rotation Lerp & Breathing Sway
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotation lerp when not dragging
      if (!isDraggingRef.current && avatarObjRef.current?.mesh) {
        currentRotationYRef.current += (targetRotationYRef.current - currentRotationYRef.current) * 0.12;
        avatarObjRef.current.mesh.rotation.y = currentRotationYRef.current;
      }

      // Idle breathing sway
      if (avatarObjRef.current?.parts?.torsoGroup) {
        avatarObjRef.current.parts.torsoGroup.position.y = 1.20 + Math.sin(elapsed * 2.5) * 0.010;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
      shadowTex.dispose();
      shadowMat.dispose();
    };
  }, []);

  // Update Skin Color in Real-Time without Scene Rebuilding
  useEffect(() => {
    if (avatarObjRef.current?.materials?.skinMat) {
      const parsedSkin = typeof skinColor === 'string'
        ? parseInt(skinColor.replace('#', '0x'), 16)
        : skinColor;
      avatarObjRef.current.materials.skinMat.color.setHex(parsedSkin);
    }
  }, [skinColor]);

  // Update Shirt Color in Real-Time
  useEffect(() => {
    if (avatarObjRef.current?.materials?.torsoMat && shirtColor) {
      const parsedShirt = typeof shirtColor === 'string'
        ? parseInt(shirtColor.replace('#', '0x'), 16)
        : shirtColor;
      avatarObjRef.current.materials.torsoMat.color.setHex(parsedShirt);
    }
  }, [shirtColor]);

  // Rebuild Avatar Mesh when Gender or Hairstyle changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (avatarObjRef.current?.mesh) {
      scene.remove(avatarObjRef.current.mesh);
    }

    const avatarSys = createAvatarSystem();
    const effectiveHair = hairType || (gender === 'female' ? 'long_waves_headphones' : 'black_waves');
    const parsedSkin = typeof skinColor === 'string'
      ? parseInt(skinColor.replace('#', '0x'), 16)
      : skinColor;

    const av = avatarSys.buildAvatar('customizer_preview', new THREE.Vector3(0, 0, 0), {
      isPlayer: true,
      skinColor: parsedSkin,
      hairType: effectiveHair,
      hairColor: gender === 'female' ? 0x3e2723 : 0x1c1917,
      clothing: gender === 'female' ? 'pink_jacket' : 'red_hoodie',
      faceType: gender === 'female' ? 'wink' : 'happy',
      shirtColor: shirtColor || (gender === 'female' ? 0xf472b6 : 0xdc2626),
      gender: gender,
      initialRot: currentRotationYRef.current
    });
    scene.add(av.mesh);
    avatarObjRef.current = av;
  }, [gender, hairType, skinColor]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    />
  );
}
